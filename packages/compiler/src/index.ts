import type { CompileRequest, CompileResult, Diagnostic } from "@msf/contracts";

type Target = "dom" | "universal";

interface Ctx {
  src: string;
  file: string;
  i: number;
  diagnostics: Diagnostic[];
  domHelpers: Set<string>;
  universalHelpers: Set<string>;
  target: Target;
  n: number;
}

function isIdentStart(ch: string) { return /[A-Za-z_$]/.test(ch); }
function isIdent(ch: string) { return /[A-Za-z0-9_$.-]/.test(ch); }
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

function genEl(_ctx: Ctx): string { return `__el${++_ctx.n}`; }

/** Parse attributes into prop/expr source entries. */
function parsePropsAndEvents(ctx: Ctx): { props: string[]; events: Array<{ name: string; value: string }>; selfClosing: boolean } {
  const props: string[] = [];
  const events: Array<{ name: string; value: string }> = [];
  let selfClosing = false;
  while (ctx.i < ctx.src.length) {
    skipWs(ctx);
    if (ctx.src.startsWith("/>", ctx.i)) { ctx.i += 2; selfClosing = true; return { props, events, selfClosing }; }
    if (ctx.src[ctx.i] === ">") { ctx.i++; return { props, events, selfClosing }; }
    const name = parseIdent(ctx);
    if (!name) { ctx.i++; continue; }
    skipWs(ctx);
    let val: { type: "string" | "expr" | "bool"; value: string } = { type: "bool", value: "true" };
    if (ctx.src[ctx.i] === "=") { ctx.i++; const v = parseAttrValue(ctx); if (v) val = v; }
    const ev = eventName(name);
    if (ev) {
      const expr = val.type === "expr" ? val.value : val.type === "string" ? JSON.stringify(val.value) : "undefined";
      events.push({ name: ev, value: expr });
      continue;
    }
    if (name === "ref") {
      addDiag(ctx, ctx.i, "MSF_UNSUPPORTED_REF", "ref is not supported in this compiler subset yet.");
      continue;
    }
    const attr = name === "className" ? "class" : name;
    if (val.type === "bool") {
      props.push([attr, "true"].join(": "));
    } else if (val.type === "string") {
      props.push([attr, JSON.stringify(val.value)].join(": "));
    } else {
      props.push([attr, `() => (${val.value})`].join(": "));
    }
  }
  return { props, events, selfClosing: false };
}

/** Build a props object expression for the universal target. */
function universalPropsObject(props: string[], events: Array<{ name: string; value: string }>): string {
  const parts = [...props];
  for (const ev of events) {
    const name = "on" + ev.name.slice(0, 1).toUpperCase() + ev.name.slice(1);
    parts.push(`${JSON.stringify(name)}: ${ev.value}`);
  }
  if (parts.length === 0) return "null";
  return `{ ${parts.join(", ")} }`;
}

function transformJsxElement(ctx: Ctx): string | null {
  // ctx.i at '<'
  if (ctx.src[ctx.i + 1] === ">") { // fragment <>
    ctx.i += 2;
    const fragArgs: string[] = [];
    while (ctx.i < ctx.src.length) {
      if (ctx.src.startsWith("</>", ctx.i)) {
        ctx.i += 3;
        if (ctx.target === "universal") {
          ctx.universalHelpers.add("fragment");
          return `fragment(${fragArgs.join(", ")})`;
        }
        const frag = genEl(ctx);
        return `(() => { const ${frag} = document.createDocumentFragment(); ${fragArgs.map((a) => `${frag}.append(${a});`).join(" ")} return ${frag}; })()`;
      }
      const child = parseChild(ctx);
      if (child != null) fragArgs.push(child);
      else if (ctx.src[ctx.i]) ctx.i++; else break;
    }
    addDiag(ctx, ctx.i, "MSF_PARSE_ERROR", "Unterminated fragment.");
    if (ctx.target === "universal") { ctx.universalHelpers.add("fragment"); return `fragment(${fragArgs.join(", ")})`; }
    return `null`;
  }
  ctx.i++; // '<'
  const tag = parseIdent(ctx);
  if (!tag) { addDiag(ctx, ctx.i, "MSF_PARSE_ERROR", "Invalid JSX tag."); return null; }
  const isComponent = /^[A-Z]/.test(tag);
  if (!/^[a-z]/.test(tag) && !tag.includes("-") && !isComponent) {
    addDiag(ctx, ctx.i, "MSF_UNSUPPORTED_TAG", "Tag name is not a supported intrinsic or component.");
  }
  const { props, events, selfClosing } = parsePropsAndEvents(ctx);

  const args: string[] = [];
  if (!selfClosing) {
    while (ctx.i < ctx.src.length) {
      if (ctx.src.startsWith(`</${tag}>`, ctx.i) || ctx.src.startsWith(`</${tag} `, ctx.i)) {
        ctx.i += 2 + tag.length;
        while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== ">") ctx.i++;
        if (ctx.src[ctx.i] === ">") ctx.i++;
        break;
      }
      if (ctx.src.startsWith("</", ctx.i)) {
        // mismatched close — bail out gracefully
        break;
      }
      const child = parseChild(ctx);
      if (child != null) args.push(child);
      else if (ctx.src[ctx.i]) ctx.i++; else break;
    }
  }

  if (ctx.target === "universal") {
    ctx.universalHelpers.add("h");
    const propsExpr = universalPropsObject(props, events);
    if (isComponent) {
      return `h(${tag}, ${propsExpr}${args.length ? ", " : ""}${args.join(", ")})`;
    }
    return `h(${JSON.stringify(tag)}, ${propsExpr}${args.length ? ", " : ""}${args.join(", ")})`;
  }

  // ---- DOM target (jsx-dom-v1) ----
  if (isComponent) {
    addDiag(ctx, ctx.i, "MSF_UNSUPPORTED_COMPONENT", "Component tags are not supported in the DOM target; use the 'universal' target instead.");
    return "undefined";
  }
  const el = genEl(ctx);
  const parts: string[] = [`const ${el} = document.createElement(${JSON.stringify(tag)});`];
  for (const ev of events) {
    ctx.domHelpers.add("addEventListener");
    parts.push(`__msf_addEventListener(${el}, ${JSON.stringify(ev.name)}, ${ev.value});`);
  }
  for (const p of props) {
    const sep = p.indexOf(": ");
    const attr = p.slice(0, sep);
    const value = p.slice(sep + 2);
    const attrName = attr.startsWith('"') ? JSON.parse(attr) : attr;
    if (value === "true") {
      parts.push(`${el}.setAttribute(${JSON.stringify(attrName)}, "");`);
    } else if (value.startsWith("() =>")) {
      ctx.domHelpers.add("setAttribute");
      parts.push(`__msf_setAttribute(${el}, ${JSON.stringify(attrName)}, ${value});`);
    } else {
      parts.push(`${el}.setAttribute(${JSON.stringify(attrName)}, ${value});`);
    }
  }
  for (const child of args) {
    if (child.startsWith("() =>")) {
      ctx.domHelpers.add("insert");
      parts.push(`__msf_insert(${el}, ${child});`);
    } else {
      parts.push(`${el}.append(${child});`);
    }
  }
  parts.push(`return ${el};`);
  return `(() => { ${parts.join(" ")} })()`;
}

function parseChild(ctx: Ctx): string | null {
  skipWs(ctx);
  if (ctx.i >= ctx.src.length) return null;
  if (ctx.src[ctx.i] === "<") {
    if (ctx.src.startsWith("</", ctx.i)) return null;
    return transformJsxElement(ctx);
  }
  if (ctx.src[ctx.i] === "{") {
    const expr = parseJsExprInBraces(ctx);
    if (expr == null) return null;
    if (expr.trim() === "") return null;
    return `() => (${expr})`;
  }
  // text
  let text = "";
  while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== "<" && ctx.src[ctx.i] !== "{") {
    text += ctx.src[ctx.i++]!;
  }
  const collapsed = text.replace(/\s+/g, " ");
  if (collapsed.trim() === "") return null;
  return JSON.stringify(collapsed);
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
  const target: Target = request.target === "universal" ? "universal" : "dom";
  if (!/\.(tsx|jsx)$/i.test(filename)) {
    return { code: request.source, diagnostics, meta: { transformed: false, subset: target === "universal" ? "jsx-universal-v1" : "jsx-dom-v1" } };
  }
  const ctx: Ctx = { src: request.source, file: filename, i: 0, diagnostics, domHelpers: new Set(), universalHelpers: new Set(), target, n: 0 };
  let code = transformSource(ctx);

  if (target === "universal") {
    const imports: string[] = [];
    if (ctx.universalHelpers.has("fragment")) imports.push("fragment");
    if (ctx.universalHelpers.has("h")) imports.push("h");
    if (imports.length > 0) {
      code = `import { ${imports.join(", ")} } from "@msf/runtime/universal";\n` + code;
    }
    return { code, diagnostics, meta: { transformed: ctx.universalHelpers.size > 0 || /h\(/.test(code), subset: "jsx-universal-v1" } };
  }

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
