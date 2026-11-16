import type { CompileRequest, CompileResult, Diagnostic } from "@msf/contracts";

interface Ctx {
  src: string;
  file: string;
  i: number;
  diagnostics: Diagnostic[];
  domHelpers: Set<string>;
  n: number;
}

function isIdentStart(ch: string) { return /[A-Za-z_$]/.test(ch); }
function isIdent(ch: string) { return /[A-Za-z0-9_$:-]/.test(ch); }
function isSpace(ch: string) { return ch === " " || ch === "\n" || ch === "\r" || ch === "\t"; }

function lineCol(src: string, pos: number) {
  let line = 1, col = 1;
  for (let i = 0; i < pos && i < src.length; i++) {
    if (src[i] === "\n") { line++; col = 1; } else col++;
  }
  return { line, column: col };
}
function addDiag(ctx: Ctx, pos: number, code: string, message: string) {
  const p = lineCol(ctx.src, pos);
  ctx.diagnostics.push({ code, message, file: ctx.file, line: p.line, column: p.column });
}
function skipWs(ctx: Ctx) { while (ctx.i < ctx.src.length && isSpace(ctx.src[ctx.i]!)) ctx.i++; }

function parseIdent(ctx: Ctx): string | null {
  if (ctx.i >= ctx.src.length || !isIdentStart(ctx.src[ctx.i]!)) return null;
  let s = "";
  while (ctx.i < ctx.src.length && isIdent(ctx.src[ctx.i]!)) s += ctx.src[ctx.i++]!;
  return s;
}

function parseJsExprInBraces(ctx: Ctx): string | null {
  // assumes current char is '{'
  const start = ctx.i;
  let depth = 0;
  let quote: string | null = null;
  let esc = false;
  while (ctx.i < ctx.src.length) {
    const ch = ctx.src[ctx.i++]!;
    if (quote) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return ctx.src.slice(start + 1, ctx.i - 1);
    }
  }
  addDiag(ctx, start, "MSF_PARSE_ERROR", "Unterminated JSX expression.");
  return null;
}

function parseAttrValue(ctx: Ctx): { type: "string" | "expr" | "bool"; value: string } | null {
  skipWs(ctx);
  if (ctx.src[ctx.i] === '"') {
    ctx.i++;
    let s = "";
    while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== '"') s += ctx.src[ctx.i++]!;
    if (ctx.src[ctx.i] === '"') ctx.i++;
    return { type: "string", value: s };
  }
  if (ctx.src[ctx.i] === "'") {
    ctx.i++;
    let s = "";
    while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== "'") s += ctx.src[ctx.i++]!;
    if (ctx.src[ctx.i] === "'") ctx.i++;
    return { type: "string", value: s };
  }
  if (ctx.src[ctx.i] === "{") {
    const expr = parseJsExprInBraces(ctx);
    if (expr == null) return null;
    return { type: "expr", value: expr.trim() };
  }
  return { type: "bool", value: "true" };
}

function eventName(prop: string): string | null {
  if (!/^on[A-Z]/.test(prop)) return null;
  return prop.slice(2).toLowerCase();
}

function genEl(ctx: Ctx): string { return `__el${++ctx.n}`; }

function transformJsxElement(ctx: Ctx): string | null {
  // ctx.i at '<'
  if (ctx.src[ctx.i + 1] === ">") { // fragment <>
    ctx.i += 2;
    const frag = genEl(ctx);
    const parts: string[] = [`const ${frag} = document.createDocumentFragment();`];
    while (ctx.i < ctx.src.length) {
      if (ctx.src.startsWith("</>", ctx.i)) { ctx.i += 3; parts.push(`return ${frag};`); return `(() => { ${parts.join(" ")} })()`; }
      const child = parseChild(ctx, frag);
      if (child) parts.push(child);
      else if (ctx.src[ctx.i]) ctx.i++; else break;
    }
    addDiag(ctx, ctx.i, "MSF_PARSE_ERROR", "Unterminated fragment.");
    return `(() => { ${parts.join(" ")} return ${frag}; })()`;
  }
  ctx.i++; // '<'
  const tag = parseIdent(ctx);
  if (!tag) { addDiag(ctx, ctx.i, "MSF_PARSE_ERROR", "Invalid JSX tag."); return null; }
  if (!/^[a-z]/.test(tag) && !tag.includes("-")) {
    addDiag(ctx, ctx.i, "MSF_UNSUPPORTED_COMPONENT", "Component tags are not supported in this compiler subset yet. Use intrinsic elements.");
    // try to recover by skipping to matching close
  }
  const el = genEl(ctx);
  const parts: string[] = [`const ${el} = document.createElement(${JSON.stringify(tag)});`];

  // attributes
  while (ctx.i < ctx.src.length) {
    skipWs(ctx);
    if (ctx.src.startsWith("/>", ctx.i)) { ctx.i += 2; parts.push(`return ${el};`); return `(() => { ${parts.join(" ")} })()`; }
    if (ctx.src[ctx.i] === ">") { ctx.i++; break; }
    const name = parseIdent(ctx);
    if (!name) { ctx.i++; continue; }
    skipWs(ctx);
    let val: { type: "string" | "expr" | "bool"; value: string } = { type: "bool", value: "true" };
    if (ctx.src[ctx.i] === "=") { ctx.i++; const v = parseAttrValue(ctx); if (v) val = v; }
    const ev = eventName(name);
    if (ev) {
      ctx.domHelpers.add("addEventListener");
      const expr = val.type === "expr" ? val.value : val.type === "string" ? JSON.stringify(val.value) : "undefined";
      parts.push(`__msf_addEventListener(${el}, ${JSON.stringify(ev)}, ${expr});`);
      continue;
    }
    if (name === "ref") { addDiag(ctx, ctx.i, "MSF_UNSUPPORTED_REF", "ref is not supported in this compiler subset yet."); continue; }
    const attr = name === "className" ? "class" : name;
    if (val.type === "string" || val.type === "bool") {
      const lit = val.type === "bool" ? JSON.stringify("") : JSON.stringify(val.value);
      parts.push(`${el}.setAttribute(${JSON.stringify(attr)}, ${lit});`);
    } else {
      ctx.domHelpers.add("setAttribute");
      parts.push(`__msf_setAttribute(${el}, ${JSON.stringify(attr)}, () => (${val.value}));`);
    }
  }

  // children until </tag>
  while (ctx.i < ctx.src.length) {
    if (ctx.src.startsWith(`</${tag}>`, ctx.i) || ctx.src.startsWith(`</${tag} `, ctx.i)) {
      ctx.i += 2 + tag.length;
      while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== ">") ctx.i++;
      if (ctx.src[ctx.i] === ">") ctx.i++;
      parts.push(`return ${el};`);
      return `(() => { ${parts.join(" ")} })()`;
    }
    if (ctx.src.startsWith("</", ctx.i)) {
      // mismatched/other close, let caller handle
      parts.push(`return ${el};`);
      return `(() => { ${parts.join(" ")} })()`;
    }
    const child = parseChild(ctx, el);
    if (child) parts.push(child);
    else if (ctx.i < ctx.src.length) ctx.i++; else break;
  }
  addDiag(ctx, ctx.i, "MSF_PARSE_ERROR", `Unterminated <${tag}> element.`);
  parts.push(`return ${el};`);
  return `(() => { ${parts.join(" ")} })()`;
}

function parseChild(ctx: Ctx, parent: string): string | null {
  skipWs(ctx);
  if (ctx.i >= ctx.src.length) return null;
  if (ctx.src[ctx.i] === "<") {
    if (ctx.src.startsWith("</", ctx.i)) return null;
    const jsx = transformJsxElement(ctx);
    if (jsx == null) return null;
    return `${parent}.append(${jsx});`;
  }
  if (ctx.src[ctx.i] === "{") {
    const expr = parseJsExprInBraces(ctx);
    if (expr == null) return null;
    if (expr.trim() === "") return "";
    ctx.domHelpers.add("insert");
    return `__msf_insert(${parent}, () => (${expr}));`;
  }
  // text
  let text = "";
  while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== "<" && ctx.src[ctx.i] !== "{") {
    text += ctx.src[ctx.i++]!;
  }
  const collapsed = text.replace(/\s+/g, " ");
  if (collapsed.trim() === "") return "";
  return `${parent}.append(${JSON.stringify(collapsed)});`;
}

function transformSource(ctx: Ctx): string {
  let out = "";
  while (ctx.i < ctx.src.length) {
    const ch = ctx.src[ctx.i]!;
    // naive JSX start detection: '<' followed by letter or '>'(fragment) in likely expression positions
    if (ch === "<" && ctx.i + 1 < ctx.src.length) {
      const next = ctx.src[ctx.i + 1]!;
      const prev = out.length > 0 ? out[out.length - 1]! : "";
      const canStart = /[=(:>,\[\n\r\t {?!&|]/.test(prev) || out.trim().length === 0 || /return\s*$/.test(out) || /=>\s*$/.test(out);
      if ((/[a-zA-Z]/.test(next) || next === ">") && canStart) {
        const jsx = transformJsxElement(ctx);
        if (jsx != null) { out += jsx; continue; }
      }
    }
    out += ch;
    ctx.i++;
  }
  return out;
}

export function compile(request: CompileRequest): CompileResult {
  const filename = request.filename || "module.tsx";
  const diagnostics: Diagnostic[] = [];
  if (!/\.(tsx|jsx)$/i.test(filename)) {
    return { code: request.source, diagnostics, meta: { transformed: false } };
  }
  const ctx: Ctx = { src: request.source, file: filename, i: 0, diagnostics, domHelpers: new Set(), n: 0 };
  let code = transformSource(ctx);
  if (ctx.domHelpers.size > 0) {
    const imports: string[] = [];
    if (ctx.domHelpers.has("insert")) imports.push(`insert as __msf_insert`);
    if (ctx.domHelpers.has("setAttribute")) imports.push(`setAttribute as __msf_setAttribute`);
    if (ctx.domHelpers.has("addEventListener")) imports.push(`addEventListener as __msf_addEventListener`);
    code = `import { ${imports.join(", ")} } from "@msf/runtime/dom";\n` + code;
  }
  return { code, diagnostics, meta: { transformed: ctx.domHelpers.size > 0 || /__el\d+/.test(code), subset: "jsx-dom-v1" } };
}

export type { CompileRequest, CompileResult };
