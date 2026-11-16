import { describe, expect, it } from "vitest";
import { getDevStatus } from "../src/index.js";
import { compile } from "@msf/compiler";

describe("dev scaffold/preview", () => {
  it("reports ready preview status", () => {
    const s = getDevStatus();
    expect(s.ready).toBe(true);
    expect(s.features.length).toBeGreaterThan(0);
  });

  it("compiler integration works for subset", () => {
    const r = compile({ filename: "x.tsx", source: "export const V = () => <div>{1}</div>;" });
    expect(r.diagnostics).toEqual([]);
    expect(String(r.meta?.transformed)).toBe("true");
  });
});

