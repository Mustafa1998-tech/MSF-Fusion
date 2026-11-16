import {
  computed,
  effect,
  ref,
  stop,
  type Ref,
} from "@vue/reactivity";
import type {
  MicroCandidate,
  MicroScenarioId,
  PreparedMicroScenario,
} from "./scenarios.ts";

const SUBSCRIBERS = 512;
const WRITES = 200;

export const vueReactivityCandidate: MicroCandidate = {
  id: "vue-reactivity",
  packageName: "@vue/reactivity",
  notes:
    "Vue's standalone reactivity package. Its public effects run synchronously in this package; no scheduler queue is configured.",
  prepare(id) {
    switch (id) {
      case "create-read-100k":
        return {
          run() {
            const refs = new Array<Ref<number>>(100_000);
            let checksum = 0;
            for (let i = 0; i < refs.length; i += 1) {
              refs[i] = ref(i);
            }
            for (let i = 0; i < refs.length; i += 1) {
              checksum += refs[i]!.value;
            }
            return checksum;
          },
        };

      case "unobserved-write-1m": {
        const source = ref(0);
        return {
          run() {
            for (let i = 0; i < 1_000_000; i += 1) {
              source.value = i;
            }
            return source.value;
          },
        };
      }

      case "computed-chain-64x20k": {
        const root = ref(0);
        let current = computed(() => root.value);
        for (let i = 0; i < 64; i += 1) {
          const previous = current;
          current = computed(() => previous.value + 1);
        }
        const tail = current;
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 20_000; i += 1) {
              root.value = i;
              checksum = (checksum + tail.value) % 1_000_000_007;
            }
            return checksum;
          },
        };
      }

      case "diamond-fanout-64x20k": {
        const root = ref(0);
        const branches = Array.from({ length: 64 }, (_, index) =>
          computed(() => root.value + index),
        );
        const sink = computed(() =>
          branches.reduce((total, branch) => total + branch.value, 0),
        );
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 20_000; i += 1) {
              root.value = i;
              checksum = (checksum + sink.value) % 1_000_000_007;
            }
            return checksum;
          },
        };
      }

      case "dynamic-deps-50k": {
        const showA = ref(true);
        const a = ref(0);
        const b = ref(0);
        const derived = computed(() => (showA.value ? a.value : b.value));
        let checksum = 0;
        return {
          run() {
            for (let i = 0; i < 50_000; i += 1) {
              showA.value = (i & 1) === 0;
              checksum = (checksum + derived.value) % 1_000_000_007;
              b.value = i;
              if ((i & 3) === 0) a.value = i;
            }
            return checksum;
          },
        };
      }

      case "effect-fanout-512x200": {
        const source = ref(0);
        const runners: Array<ReturnType<typeof effect>> = [];
        let checksum = 0;
        for (let i = 0; i < SUBSCRIBERS; i += 1) {
          runners.push(
            effect(() => {
              checksum = (checksum + source.value + 1) % 1_000_000_007;
            }),
          );
        }
        return {
          run() {
            for (let i = 0; i < WRITES; i += 1) {
              source.value = i;
            }
            return checksum;
          },
          dispose() {
            for (const runner of runners) stop(runner);
          },
        };
      }

      case "effect-mount-dispose-10k":
        return {
          run() {
            let checksum = 0;
            for (let i = 0; i < 10_000; i += 1) {
              const own = ref(i);
              const runner = effect(() => {
                checksum = (checksum + own.value) % 1_000_000_007;
              });
              stop(runner);
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
