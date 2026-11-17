import { describe, expect, it } from "vitest";
import { compile } from "../src/index.js";

// Minimal universal-runtime emulation for golden execution without taking a
// compiler -> runtime dependency (compiler must stay runtime-free).
type Desc = Record<string, unknown> | null;
function makeRuntime() {
  const h = (tag: string, props: Record<string, unknown> | null, ...children: unknown[]) =>
    ({ kind: "element", tag, props: props ?? null, children });
  const fragment = (...children: unknown[]) => ({ kind: "fragment", children });
  const evalDesc = (d: unknown): string => {
    if (d == null || typeof d === "boolean") return "";
    if (typeof d === "string" || typeof d === "number") return String(d);
    if (typeof d === "function") return evalDesc((d as () => unknown)());
    if (Array.isArray((d as Desc)?.children)) return ((d as { children: unknown[] }).children).map(evalDesc).join("");
    return "";
  };
  return { h, fragment, evalDesc };
}

function toEvalModule(code: string): string {
  return code
    .replace(/^import[^;]+;\n?/, "")
    .replace(/\bexport\s+const\s+/g, "const ")
    .replace(/\bexport\s+function\s+/g, "function ");
}

describe("compiled universal output executes correctly", () => {
  it("compiles JSX to a valid tree and evaluates its shape", () => {
    const jsx = `export const App = () => <main><span class="badge">ok</span></main>;`;
    const res = compile({ filename: "App.tsx", source: jsx, target: "universal" });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("@mustafa-26112026/runtime/universal");

    const { h, fragment, evalDesc } = makeRuntime();
    const factory = new Function(`const h = ${h.toString()}; const fragment = ${fragment.toString()}; ${toEvalModule(res.code)} return { App };`);
    const mod = factory() as { App: () => Desc & { children: Array<{ kind: string; tag: string; props: Record<string, unknown> }> } };
    const tree = mod.App() as { kind: string; tag: string; children: Array<{ kind: string; tag: string; props: Record<string, unknown> }> };
    expect(tree.kind).toBe("element");
    expect(tree.tag).toBe("main");
    expect(tree.children[0]!.kind).toBe("element");
    expect(tree.children[0]!.tag).toBe("span");
    expect(tree.children[0]!.props.class).toBe("badge");
    expect(evalDesc(tree)).toContain("ok");
  });

  it("preserves accessors for reactive children in the compiled output", () => {
    const jsx = `export const App = (s) => { const [count] = s; return <p>{count()}</p>; };`;
    const res = compile({ filename: "App.tsx", source: jsx, target: "universal" });
    expect(res.diagnostics).toEqual([]);

    const { h, evalDesc } = makeRuntime();
    const factory = new Function(`const h = ${h.toString()}; ${toEvalModule(res.code)} return { App };`);
    const mod = factory() as { App: (s: Array<() => number>) => unknown };
    const tree = mod.App([() => 42]);
    expect(evalDesc(tree)).toContain("42");
  });
});
