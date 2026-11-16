import { describe, expect, it } from "vitest";
import { renderReport, type BenchmarkRun } from "../src/report.ts";
import { summarize } from "../src/stats.ts";
import { MICRO_SCENARIOS } from "../src/suites/micro/scenarios.ts";
import type { RuntimeEnvironment } from "../src/env.ts";

const environment: RuntimeEnvironment = {
  runStartedAt: "2026-11-16T00:00:00.000Z",
  node: "v26.12.1",
  pnpm: "12.21.0",
  platform: "win32",
  release: "10.0.26100",
  osVersion: "Windows 11 Pro",
  arch: "x64",
  os: "Windows_NT 10.0.26100",
  cpuModel: "12th Gen Intel(R) Core(TM) i7-12700",
  cpuCores: 20,
  totalMemoryBytes: 16_836_000_000,
  gitCommit: "abc123",
  gitDirty: false,
  timezone: "Asia/Riyadh",
  powerScheme: "Balanced",
  browser: { name: "Chromium (Playwright)", version: "159.0.0.0" },
  packageVersions: {
    react: "19.3.1",
    "react-dom": "19.3.1",
    "solid-js": "1.9.19",
    svelte: "5.57.3",
    vue: "3.5.45",
    "@preact/signals-core": "1.14.5",
    "@vue/reactivity": "3.5.45",
    vite: "8.3.8",
    playwright: "1.65.1",
    typescript: "7.0.2",
    vitest: "5.1.0",
  },
  notes: [],
};

function makeRun(): BenchmarkRun {
  const scenario = MICRO_SCENARIOS[0]!;
  const samples = [100, 110, 105, 102, 108];
  const summary = summarize(samples);
  return {
    schemaVersion: 1,
    runId: "test-run",
    generatedAt: "2026-11-16T00:00:00.000Z",
    environment,
    status: "completed",
    notes: ["Test note."],
    suites: {
      micro: {
        kind: "micro",
        status: "completed",
        config: { samples: 5, warmup: 1 },
        totalDurationMs: 1,
        candidates: [
          {
            id: "solid",
            packageName: "solid-js",
            notes: "client runtime",
          },
        ],
        scenarios: MICRO_SCENARIOS,
        results: [
          {
            candidate: "solid",
            packageName: "solid-js",
            scenario: scenario.id,
            units: scenario.units,
            unitLabel: scenario.unitLabel,
            samplesNsPerOp: samples,
            summary,
            opsPerSecond: 1_000_000_000 / summary.median,
            checksum: 1,
          },
        ],
        skipped: [
          {
            candidate: "solid",
            scenario: "effect-fanout-512x200",
            reason: "effects require a render flush",
          },
        ],
        notes: ["Suite note."],
      },
    },
  };
}

describe("renderReport", () => {
  it("renders environment, statistics, results, and limitations", () => {
    const markdown = renderReport(makeRun());
    expect(markdown).toContain("# MSF Fusion — Baseline Benchmark Report");
    expect(markdown).toContain("Run ID: `test-run`");
    expect(markdown).toContain("Windows 11 Pro");
    expect(markdown).toContain("pnpm | 12.21.0");
    expect(markdown).toContain("## Reactivity microbenchmarks");
    expect(markdown).toContain("### effect-fanout-512x200");
    expect(markdown).toContain("Excluded measurements");
    expect(markdown).toContain("## Limitations and exclusions");
    expect(markdown).toContain("not superiority claims");
    expect(markdown).toContain("benchmarks/methodology.md");
  });

  it("includes raw sample counts and a median row", () => {
    const markdown = renderReport(makeRun());
    expect(markdown).toContain("| solid | 1.9.19 |");
    expect(markdown).toContain("| 5 |");
    expect(markdown).toContain("Ops/s");
  });
});
