import { describe, expect, it } from "vitest";
import {
  batch,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  onCleanup,
  untrack,
} from "../src/index.ts";

describe("createSignal", () => {
  it("reads and writes values", () => {
    const [count, setCount] = createSignal(1);
    expect(count()).toBe(1);
    setCount(2);
    expect(count()).toBe(2);
    setCount((n) => n + 3);
    expect(count()).toBe(5);
  });

  it("supports custom equality", () => {
    let runs = 0;
    const [obj, setObj] = createSignal(
      { x: 1 },
      { equals: (a, b) => a.x === b.x },
    );
    createRoot(() => {
      createEffect(() => {
        obj();
        runs++;
      });
    });
    expect(runs).toBe(1);
    setObj({ x: 1 });
    expect(runs).toBe(1);
    setObj({ x: 2 });
    expect(runs).toBe(2);
  });
});

describe("createMemo", () => {
  it("computes derived values and memoizes", () => {
    let calls = 0;
    const [a, setA] = createSignal(2);
    const [b, setB] = createSignal(3);
    const sum = createMemo(() => {
      calls++;
      return a() + b();
    });
    expect(sum()).toBe(5);
    expect(sum()).toBe(5);
    expect(calls).toBe(1);
    setA(10);
    expect(sum()).toBe(13);
    expect(calls).toBe(2);
    setB(1);
    expect(calls).toBe(2); // lazy until read
    expect(sum()).toBe(11);
    expect(calls).toBe(3);
  });

  it("does not propagate when value is unchanged", () => {
    let memoRuns = 0;
    let effectRuns = 0;
    const [a, setA] = createSignal(1);
    const parity = createMemo(() => {
      memoRuns++;
      return a() % 2;
    });
    createRoot(() => {
      createEffect(() => {
        parity();
        effectRuns++;
      });
    });
    expect(memoRuns).toBe(1);
    expect(effectRuns).toBe(1);
    setA(3); // parity still 1
    expect(memoRuns).toBe(2);
    expect(effectRuns).toBe(1);
    setA(2);
    expect(memoRuns).toBe(3);
    expect(effectRuns).toBe(2);
  });

  it("handles diamond dependencies", () => {
    let calls = 0;
    const [s, setS] = createSignal(1);
    const a = createMemo(() => s() + 1);
    const b = createMemo(() => s() + 2);
    const c = createMemo(() => {
      calls++;
      return a() + b();
    });
    expect(c()).toBe(5); // (2) + (3)
    expect(calls).toBe(1);
    setS(2);
    expect(c()).toBe(7); // (3) + (4)
    expect(calls).toBe(2);
  });

  it("handles deep chains", () => {
    const [s, setS] = createSignal(0);
    let c: () => number = s;
    for (let i = 0; i < 50; i++) {
      const prev = c;
      c = createMemo(() => prev() + 1);
    }
    expect(c()).toBe(50);
    setS(5);
    expect(c()).toBe(55);
  });
});

describe("createEffect", () => {
  it("runs immediately and reacts to changes", () => {
    const log: number[] = [];
    const [a, setA] = createSignal(1);
    createRoot(() => {
      createEffect(() => {
        log.push(a());
      });
    });
    expect(log).toEqual([1]);
    setA(2);
    setA(3);
    expect(log).toEqual([1, 2, 3]);
  });

  it("runs cleanup before re-run and on dispose", () => {
    const events: string[] = [];
    const [a, setA] = createSignal(0);
    const dispose = createRoot((disposeRoot) => {
      createEffect(() => {
        const v = a();
        events.push(`run:${v}`);
        onCleanup(() => events.push(`cleanup:${v}`));
      });
      return disposeRoot;
    });
    expect(events).toEqual(["run:0"]);
    setA(1);
    expect(events).toEqual(["run:0", "cleanup:0", "run:1"]);
    dispose();
    expect(events).toEqual(["run:0", "cleanup:0", "run:1", "cleanup:1"]);
    setA(2);
    expect(events).toEqual(["run:0", "cleanup:0", "run:1", "cleanup:1"]);
  });

  it("supports dynamic dependencies", () => {
    const [flag, setFlag] = createSignal(true);
    const [a, setA] = createSignal("a1");
    const [b, setB] = createSignal("b1");
    const log: string[] = [];
    createRoot(() => {
      createEffect(() => {
        log.push(flag() ? a() : b());
      });
    });
    expect(log).toEqual(["a1"]);
    setB("b2"); // not tracked
    expect(log).toEqual(["a1"]);
    setA("a2");
    expect(log).toEqual(["a1", "a2"]);
    setFlag(false);
    expect(log).toEqual(["a1", "a2", "b2"]);
    setA("a3"); // no longer tracked
    expect(log).toEqual(["a1", "a2", "b2"]);
    setB("b3");
    expect(log).toEqual(["a1", "a2", "b2", "b3"]);
  });
});

describe("ownership and disposal", () => {
  it("disposes owned effects when root disposes", () => {
    let runs = 0;
    const [a, setA] = createSignal(0);
    const dispose = createRoot((d) => {
      createEffect(() => {
        a();
        runs++;
      });
      createRoot(() => {
        createEffect(() => {
          a();
          runs++;
        });
      });
      return d;
    });
    expect(runs).toBe(2);
    setA(1);
    expect(runs).toBe(4);
    dispose();
    setA(2);
    expect(runs).toBe(4);
  });

  it("disposes effect return value", () => {
    const [a, setA] = createSignal(0);
    let runs = 0;
    const stop = createEffect(() => {
      a();
      runs++;
    });
    expect(runs).toBe(1);
    stop();
    setA(1);
    expect(runs).toBe(1);
  });
});

describe("batch and untrack", () => {
  it("batches multiple writes into one effect flush", () => {
    const [a, setA] = createSignal(1);
    const [b, setB] = createSignal(2);
    let runs = 0;
    createRoot(() => {
      createEffect(() => {
        a();
        b();
        runs++;
      });
    });
    expect(runs).toBe(1);
    batch(() => {
      setA(10);
      setB(20);
      setA(11);
    });
    expect(runs).toBe(2);
    expect(a()).toBe(11);
    expect(b()).toBe(20);
  });

  it("untrack prevents dependency registration", () => {
    const [a, setA] = createSignal(1);
    const [b, setB] = createSignal(2);
    let runs = 0;
    createRoot(() => {
      createEffect(() => {
        a();
        untrack(() => b());
        runs++;
      });
    });
    expect(runs).toBe(1);
    setB(3);
    expect(runs).toBe(1);
    setA(4);
    expect(runs).toBe(2);
  });
});

describe("correctness edge cases", () => {
  it("handles conditional memos in diamond without glitches", () => {
    const [x, setX] = createSignal(1);
    const a = createMemo(() => x() > 0);
    const b = createMemo(() => x() + 1);
    const c = createMemo(() => (a() ? b() : 0));
    let seen: number[] = [];
    createRoot(() => {
      createEffect(() => {
        seen.push(c());
      });
    });
    expect(seen).toEqual([2]);
    setX(2);
    expect(seen).toEqual([2, 3]);
  });
});
