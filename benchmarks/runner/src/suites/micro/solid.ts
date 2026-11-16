import {
  createMemo,
  createRoot,
  createSignal,
} from "solid-js/dist/solid.js";
import type {
  MicroCandidate,
  MicroScenarioId,
  PreparedMicroScenario,
} from "./scenarios.ts";

export const solidCandidate: MicroCandidate = {
  id: "solid-signals",
  packageName: "solid-js",
  notes:
    "Solid's public reactive primitives, loaded from Solid's client runtime rather than its non-reactive server build. Effect scenarios are excluded because Solid schedules effects until a render flush; createComputed would be a different primitive.",
  skip: {
    "effect-fanout-512x200":
      "Solid effects are scheduled until a render flush; a browser render root is required for an equivalent measurement.",
    "effect-mount-dispose-10k":
      "Solid effects are scheduled until a render flush; a browser render root is required for an equivalent measurement.",
  },
  prepare(id) {
    switch (id) {
      case "create-read-100k":
        return {
          run() {
            const getters: Array<() => number> = new Array(100_000);
            let checksum = 0;
            for (let i = 0; i < getters.length; i += 1) {
              const [get] = createSignal(i);
              getters[i] = get;
            }
            for (let i = 0; i < getters.length; i += 1) {
              checksum += getters[i]!();
            }
            return checksum;
          },
        };

      case "unobserved-write-1m": {
        const [get, set] = createSignal(0);
        return {
          run() {
            for (let i = 0; i < 1_000_000; i += 1) {
              set(i);
            }
            return get();
          },
        };
      }

      case "computed-chain-64x20k": {
        let disposeRoot = () => {};
        let tail = () => 0;
        let setRoot = (_value: number) => {};
        createRoot((dispose) => {
          disposeRoot = dispose;
          const [get, set] = createSignal(0);
          setRoot = set;
          let current = createMemo(() => get());
          for (let i = 0; i < 64; i += 1) {
            const previous = current;
            current = createMemo(() => previous() + 1);
          }
          tail = current;
          tail();
        });
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 20_000; i += 1) {
              setRoot(i);
              checksum = (checksum + tail()) % 1_000_000_007;
            }
            return checksum;
          },
          dispose: disposeRoot,
        };
      }

      case "diamond-fanout-64x20k": {
        let disposeRoot = () => {};
        let sink = () => 0;
        let setRoot = (_value: number) => {};
        createRoot((dispose) => {
          disposeRoot = dispose;
          const [get, set] = createSignal(0);
          setRoot = set;
          const branches = Array.from({ length: 64 }, (_, index) =>
            createMemo(() => get() + index),
          );
          sink = createMemo(() =>
            branches.reduce((total, branch) => total + branch(), 0),
          );
          sink();
        });
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 20_000; i += 1) {
              setRoot(i);
              checksum = (checksum + sink()) % 1_000_000_007;
            }
            return checksum;
          },
          dispose: disposeRoot,
        };
      }

      case "dynamic-deps-50k": {
        let disposeRoot = () => {};
        let readDerived = () => 0;
        let setShow = (_value: boolean) => {};
        let setA = (_value: number) => {};
        let setB = (_value: number) => {};
        createRoot((dispose) => {
          disposeRoot = dispose;
          const [show, setShowSignal] = createSignal(true);
          const [a, setASignal] = createSignal(0);
          const [b, setBSignal] = createSignal(0);
          const derived = createMemo(() => (show() ? a() : b()));
          setShow = setShowSignal;
          setA = setASignal;
          setB = setBSignal;
          readDerived = derived;
          derived();
        });
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 50_000; i += 1) {
              setShow((i & 1) === 0);
              checksum = (checksum + readDerived()) % 1_000_000_007;
              setB(i);
              if ((i & 3) === 0) setA(i);
            }
            return checksum;
          },
          dispose: disposeRoot,
        };
      }

      case "effect-fanout-512x200":
      case "effect-mount-dispose-10k":
        throw new Error(
          `Solid scenario ${id} is skipped; see candidate.skip for the reason`,
        );

      default: {
        const exhaustive: never = id;
        throw new Error(`Unsupported scenario: ${String(exhaustive)}`);
      }
    }
  },
};

export type { PreparedMicroScenario, MicroScenarioId };
