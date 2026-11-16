import { describe, expect, it } from "vitest";
import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from "../src/core.js";

function makeChain(depth: number): () => number {
  const root = createRoot((dispose) => {
    const [x] = createSignal(0);
    let c: () => number = x;
    for (let i = 0; i < depth; i++) {
      const prev = c;
      c = createMemo(() => prev() + 1);
    }
    return { chain: c, dispose };
  });
  return () => {
    try {
      return root.chain();
    } finally {
      root.dispose();
    }
  };
}

describe("cycle/depth guards", () => {
  it("deep memo chain below the limit evaluates normally", () => {
    const read = makeChain(250);
    expect(read()).toBe(250);
  });

  it("memo chain beyond the limit throws a meaningful cycle diagnostic", () => {
    const read = makeChain(1500);
    expect(() => read()).toThrow(/MSF_REACTIVE_CYCLE/);
  });

  it("a bounded self-referencing effect does not crash the harness", () => {
    const [a, setA] = createSignal(0);
    let n = 0;
    expect(() =>
      createRoot(() => {
        createEffect(() => {
          n++;
          if (n <= 10_000) setA(a() + 1);
        });
      })
    ).not.toThrow();
    expect(n).toBeGreaterThanOrEqual(1);
  });
});
