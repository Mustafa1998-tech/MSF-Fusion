import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from "@msf/runtime";
import type { MicroCandidate, MicroScenarioId, PreparedMicroScenario } from "./scenarios.ts";

const SUBSCRIBERS = 512;
const WRITES = 200;

export const msfRuntimeCandidate: MicroCandidate = {
  id: "msf-runtime",
  packageName: "@msf/runtime",
  notes:
    "MSF Fusion reactive kernel (developer preview). Fine-grained signals/memos/effects with ownership and synchronous batched propagation.",
  prepare(id) {
    switch (id) {
      case "create-read-100k":
        return {
          run() {
            return createRoot((dispose) => {
              const values = new Array<() => number>(100_000);
              let checksum = 0;
              for (let i = 0; i < values.length; i++) {
                values[i] = createSignal(i)[0];
              }
              for (let i = 0; i < values.length; i++) {
                checksum += values[i]!();
              }
              dispose();
              return checksum;
            });
          },
        };

      case "unobserved-write-1m": {
        return {
          run() {
            return createRoot((dispose) => {
              const [s, setS] = createSignal(0);
              for (let i = 0; i < 1_000_000; i++) setS(i);
              const v = s();
              dispose();
              return v;
            });
          },
        };
      }

      case "computed-chain-64x20k": {
        return {
          run() {
            return createRoot((dispose) => {
              const [root, setRoot] = createSignal(0);
              let current: () => number = root;
              for (let i = 0; i < 64; i++) {
                const prev = current;
                current = createMemo(() => prev() + 1);
              }
              const tail = current;
              let checksum = 0;
              for (let i = 0; i < 20_000; i++) {
                setRoot(i);
                checksum = (checksum + tail()) % 1_000_000_007;
              }
              dispose();
              return checksum;
            });
          },
        };
      }

      case "diamond-fanout-64x20k": {
        return {
          run() {
            return createRoot((dispose) => {
              const [root, setRoot] = createSignal(0);
              const branches = Array.from({ length: 64 }, (_, idx) =>
                createMemo(() => root() + idx),
              );
              const sink = createMemo(() =>
                branches.reduce((t, b) => t + b(), 0),
              );
              let checksum = 0;
              for (let i = 0; i < 20_000; i++) {
                setRoot(i);
                checksum = (checksum + sink()) % 1_000_000_007;
              }
              dispose();
              return checksum;
            });
          },
        };
      }

      case "dynamic-deps-50k": {
        return {
          run() {
            return createRoot((dispose) => {
              const [showA, setShowA] = createSignal(true);
              const [a, setA] = createSignal(0);
              const [b, setB] = createSignal(0);
              const derived = createMemo(() => (showA() ? a() : b()));
              let checksum = 0;
              for (let i = 0; i < 50_000; i++) {
                setShowA((i & 1) === 0);
                checksum = (checksum + derived()) % 1_000_000_007;
                setB(i);
                if ((i & 3) === 0) setA(i);
              }
              dispose();
              return checksum;
            });
          },
        };
      }

      case "effect-fanout-512x200": {
        return {
          run() {
            return createRoot((dispose) => {
              const [source, setSource] = createSignal(0);
              let checksum = 0;
              for (let i = 0; i < SUBSCRIBERS; i++) {
                createEffect(() => {
                  checksum = (checksum + source() + 1) % 1_000_000_007;
                });
              }
              for (let i = 0; i < WRITES; i++) {
                setSource(i);
              }
              dispose();
              return checksum;
            });
          },
        };
      }

      case "effect-mount-dispose-10k":
        return {
          run() {
            let checksum = 0;
            for (let i = 0; i < 10_000; i++) {
              createRoot((dispose) => {
                const [own] = createSignal(i);
                const stop = createEffect(() => {
                  checksum = (checksum + own()) % 1_000_000_007;
                });
                stop();
                dispose();
              });
            }
            return checksum;
          },
        };

      default: {
        const exhaustive: never = id;
        throw new Error(`Unsupported scenario: ${String(exhaustive)}`);
      }
    }
  },
};

export type { PreparedMicroScenario, MicroScenarioId };
