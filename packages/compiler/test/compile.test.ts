import { describe, expect, it } from "vitest";
import { compile } from "../src/index.js";

describe("compiler subset (jsx-dom-v1)", () => {
  it("transforms intrinsic JSX to DOM runtime calls", () => {
    const res = compile({
      filename: "Counter.tsx",
      source: `export function Counter() {\n  const count = 1;\n  return <section class="x"><h1>Hi</h1><p>{count}</p></section>;\n}`,
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.meta?.transformed).toBe(true);
    expect(res.code).toContain("@mustafa-26112026/runtime/dom");
    expect(res.code).toContain("document.createElement");
    expect(res.code).toContain("insert");
  });

  it("supports dynamic attributes and events", () => {
    const res = compile({
      filename: "App.tsx",
      source: `export function App(){ const v = 1; return <button class={v} onClick={fn}>{v}</button>; }`,
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("setAttribute");
    expect(res.code).toContain("addEventListener");
  });

  it("passes through non-jsx files", () => {
    const src = "export const x = 1;\n";
    const res = compile({ filename: "a.ts", source: src });
    expect(res.code).toBe(src);
    expect(res.meta?.transformed).toBe(false);
  });

  it("reports unsupported component tags", () => {
    const res = compile({ filename: "X.tsx", source: `export const A = () => <MyComp/>;` });
    expect(res.diagnostics.some((d) => d.code === "MSF_UNSUPPORTED_COMPONENT")).toBe(true);
  });
});

