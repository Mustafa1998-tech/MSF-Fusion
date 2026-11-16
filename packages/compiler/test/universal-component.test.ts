import { describe, expect, it } from "vitest";
import { compile } from "../src/index.js";

describe("universal target output shape", () => {
  it("compile a component tag preserving props and events", () => {
    const res = compile({
      filename: "App.tsx",
      source: `export const App = () => <Counter initial={3} onClick={go} hello="str" />;`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain("h(Counter");
    expect(res.code).toContain("initial: () => (3)");
    expect(res.code).toContain("hello: \"str\"");
    expect(res.code).toContain("\"onClick\": go");
  });

  it("compiling a self-closing intrinsic element", () => {
    const res = compile({
      filename: "App.tsx",
      source: `export const App = () => <img src="/x.png" alt="pic" />;`,
      target: "universal",
    });
    expect(res.diagnostics).toEqual([]);
    expect(res.code).toContain('h("img"');
    expect(res.code).toContain("src: \"/x.png\"");
  });
});
