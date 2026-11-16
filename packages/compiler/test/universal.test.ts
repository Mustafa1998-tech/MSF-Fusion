import { describe, expect, it } from "vitest";
import { compile } from "../src/index.js";

describe("compiler subset (jsx-universal-v1)", () => {
  it("compiles intrinsic JSX to universal view descriptors, not DOM calls", () => {
    const res = compile({
      filename: "Counter.tsx",
      source: `export function Counter() {\n  const count = 1;\n  return <section class="card"><h1>Hi</h1><p>{count}</p></section>;\n}`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.meta?.transformed).toBe(true);
    expect(res.code).toContain("h(\"section\"");
    expect(res.code).toContain("@msf/runtime/universal");
    expect(res.code).not.toContain("document.createElement");
    expect(res.code).not.toContain("setAttribute");
  });

  it("supports props, events and components in universal target", () => {
    const res = compile({
      filename: "App.tsx",
      source: `const P = (props) => props.children;\nexport function App(){ return <Panel title="x" onClick={go}>Hi</Panel>; }`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("Panel");
    expect(res.code).toContain("onClick");
    expect(res.code).toContain("h(");
  });

  it("event handlers stay as direct identifiers in props object", () => {
    const res = compile({
      filename: "Btn.tsx",
      source: `export const B = () => <button onClick={handleClick}>Go</button>;`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain('"onClick": handleClick');
  });

  it("pre-evaluates JSX expression children to accessors", () => {
    const res = compile({
      filename: "App.tsx",
      source: `export const A = () => <p>{value}</p>;`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("() => (value)");
  });

  it("static text children become literal strings", () => {
    const res = compile({
      filename: "App.tsx",
      source: `export const A = () => <p>Hello world</p>;`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("\"Hello world\"");
  });

  it("passes through non-jsx files unchanged", () => {
    const src = "export const x = 1;\n";
    const res = compile({ filename: "a.ts", source: src, target: "universal" });
    expect(res.code).toBe(src);
    expect(res.meta?.transformed).toBe(false);
  });
});
