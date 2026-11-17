import { describe, expect, it } from "vitest";
import { compile } from "../src/index.js";

describe("compiled <Show>/<For> lowering (jsx-universal-v1)", () => {
  it("injects Show import and emits h(Show, ...) with when accessor", () => {
    const src = `export const App = () => <Show when={() => true} fallback={<em>no</em>}><p>yes</p></Show>;`;
    const res = compile({ filename: "App.tsx", source: src, target: "universal" });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toMatch(/import\s*{\s*h,\s*Show\s*}\s*from\s*"@msf\/runtime\/universal";?/);
    expect(res.code).toContain("h(Show,");
    expect(res.code).toMatch(/when:\s*\(\)\s*=>/);
    expect(res.code).toContain("h(\"p\"");
  });

  it("emits For with its single child function as children accessor", () => {
    const src = `export const App = (items) => <For each={items}>{(item) => <li>{item}</li>}</For>;`;
    const res = compile({ filename: "App.tsx", source: src, target: "universal" });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain('import { h, For } from "@msf/runtime/universal";');
    expect(res.code).toContain("h(For,");
    expect(res.code).toMatch(/children:\s*\(\(item\)\s*=>/);
    expect(res.code).toContain('h("li"');
  });

  it("executes compiled Show/For output against a minimal runtime", () => {
    const src = `export const App = () => <Show when={() => true}><p>yes</p></Show>;`;
    const res = compile({ filename: "App.tsx", source: src, target: "universal" });
    expect(res.diagnostics).toEqual([]);

    const harness = `
      const h = (tag, props, ...children) => ({ kind: "element", tag: typeof tag === "string" ? tag : String(tag), props: props ?? null, children });
      const Show = (props) => { const kids = props.children; const visible = typeof props.when === "function" ? props.when() : props.when; const fallback = typeof props.fallback === "function" ? props.fallback() : props.fallback; return visible ? (Array.isArray(kids) ? kids : [kids]) : (fallback ? (Array.isArray(fallback) ? fallback : [fallback]) : null); };
      ${res.code.replace(/^import[^;]+;\n?/, "").replace(/\bexport\s+const\s+/g, "const ")}
      return App();
    `;
    const tree = new Function(harness)() as { children: unknown[] };
    expect(JSON.stringify(tree)).toContain("yes");
  });

  it("reports MSF_INVALID_FOR_CHILDREN when <For> has no single function child", () => {
    const src = `export const App = () => <For each={[1]}><li>x</li></For>;`;
    const res = compile({ filename: "App.tsx", source: src, target: "universal" });
    expect(res.diagnostics.some((d) => d.code === "MSF_INVALID_FOR_CHILDREN")).toBe(true);
  });

  it("still reports component tags as unsupported on the DOM target", () => {
    const src = `export const App = () => <Show when={true}><p>x</p></Show>;`;
    const res = compile({ filename: "App.tsx", source: src, target: "dom" });
    expect(res.diagnostics.some((d) => d.code === "MSF_UNSUPPORTED_COMPONENT")).toBe(true);
  });
});
