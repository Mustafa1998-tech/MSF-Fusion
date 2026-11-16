import { describe, expect, it } from "vitest";
import { MICRO_SCENARIOS } from "../src/suites/micro/scenarios.ts";
import { preactSignalsCandidate } from "../src/suites/micro/preact-signals.ts";
import { solidCandidate } from "../src/suites/micro/solid.ts";
import { vueReactivityCandidate } from "../src/suites/micro/vue.ts";

const candidates = [
  preactSignalsCandidate,
  solidCandidate,
  vueReactivityCandidate,
];

describe("microbenchmark adapters", () => {
  for (const candidate of candidates) {
    for (const scenario of MICRO_SCENARIOS) {
      if (candidate.skip?.[scenario.id]) continue;
      it(`${candidate.id} executes ${scenario.id} with a finite checksum`, () => {
        const prepared = candidate.prepare(scenario.id);
        try {
          const checksum = prepared.run();
          expect(Number.isFinite(checksum)).toBe(true);
        } finally {
          prepared.dispose?.();
        }
      }, 120_000);
    }
  }
});
