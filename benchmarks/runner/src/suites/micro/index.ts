import { performance } from "node:perf_hooks";
import { summarize, type Summary } from "../../stats.ts";
import { preactSignalsCandidate } from "./preact-signals.ts";
import { msfRuntimeCandidate } from "./msf.ts";
import {
  MICRO_SCENARIOS,
  type MicroCandidate,
  type MicroScenarioId,
} from "./scenarios.ts";
import { solidCandidate } from "./solid.ts";
import { vueReactivityCandidate } from "./vue.ts";

export interface MicroSuiteOptions {
  samples: number;
  warmup: number;
}

export interface MicroResult {
  candidate: string;
  packageName: string;
  scenario: MicroScenarioId;
  units: number;
  unitLabel: string;
  samplesNsPerOp: number[];
  summary: Summary;
  opsPerSecond: number;
  checksum: number;
}

export interface MicroSuiteResult {
  kind: "micro";
  status: "completed";
  config: MicroSuiteOptions;
  totalDurationMs: number;
  candidates: Array<Pick<MicroCandidate, "id" | "packageName" | "notes">>;
  scenarios: typeof MICRO_SCENARIOS;
  results: MicroResult[];
  skipped: Array<{
    candidate: string;
    scenario: MicroScenarioId;
    reason: string;
  }>;
  notes: string[];
}

const candidates: readonly MicroCandidate[] = [
  msfRuntimeCandidate,
  preactSignalsCandidate,
  solidCandidate,
  vueReactivityCandidate,
];

const gc = (globalThis as { gc?: () => void }).gc;

function measureOnce(candidate: MicroCandidate, scenario: MicroScenarioId): {
  elapsedMs: number;
  checksum: number;
} {
  const prepared = candidate.prepare(scenario);
  const start = performance.now();
  const checksum = prepared.run();
  const elapsedMs = performance.now() - start;
  prepared.dispose?.();
  if (!Number.isFinite(checksum)) {
    throw new Error(
      `${candidate.id} returned a non-finite checksum for ${scenario}`,
    );
  }
  return { elapsedMs, checksum };
}

export async function runMicroSuite(
  options: MicroSuiteOptions,
): Promise<MicroSuiteResult> {
  const startedAt = performance.now();
  const results: MicroResult[] = [];
  const skipped: MicroSuiteResult["skipped"] = [];
  gc?.();

  for (const candidate of candidates) {
    for (const scenario of MICRO_SCENARIOS) {
      const skipReason = candidate.skip?.[scenario.id];
      if (skipReason) {
        skipped.push({
          candidate: candidate.id,
          scenario: scenario.id,
          reason: skipReason,
        });
        continue;
      }
      for (let i = 0; i < options.warmup; i += 1) {
        measureOnce(candidate, scenario.id);
      }

      const samplesNsPerOp: number[] = [];
      let lastChecksum = 0;
      for (let i = 0; i < options.samples; i += 1) {
        const measured = measureOnce(candidate, scenario.id);
        lastChecksum = measured.checksum;
        if (measured.elapsedMs <= 0) {
          throw new Error(
            `${candidate.id}/${scenario.id} produced a non-positive duration`,
          );
        }
        samplesNsPerOp.push(
          (measured.elapsedMs * 1_000_000) / scenario.units,
        );
      }

      const summary = summarize(samplesNsPerOp);
      results.push({
        candidate: candidate.id,
        packageName: candidate.packageName,
        scenario: scenario.id,
        units: scenario.units,
        unitLabel: scenario.unitLabel,
        samplesNsPerOp,
        summary,
        opsPerSecond: 1_000_000_000 / summary.median,
        checksum: lastChecksum,
      });
    }
  }

  return {
    kind: "micro",
    status: "completed",
    config: options,
    totalDurationMs: performance.now() - startedAt,
    candidates: candidates.map(({ id, packageName, notes }) => ({
      id,
      packageName,
      notes,
    })),
    scenarios: MICRO_SCENARIOS,
    results,
    skipped,
    notes: [
      "Graph construction is performed outside the timed region; warm-up runs are discarded.",
      "Each sample uses a fresh graph and disposes it afterwards where the primitive exposes disposal.",
      "MSF runtime measurements use the in-repo developer-preview kernel (`@mustafa-26112026/runtime`) for supported primitives; they are informational and not superiority claims.",
      "Solid runs through its client runtime exported by the package (solid-js/dist/solid.js) so computed invalidation is live. Solid effect scenarios are skipped because effects require a render flush.",
      "Vue effects are synchronous in the standalone @vue/reactivity package; Vue's default scheduler batching is not part of this matrix.",
      "Angular is excluded from microbenchmarks: its signal API is not designed as a standalone package and effects require an injector/DI context.",
      "React has no comparable standalone signal primitive; React component rendering is measured in the DOM suite instead.",
      "Compare results only with documented methodology; this run may include MSF preview alongside competitor baselines depending on command.",
    ],
  };
}
