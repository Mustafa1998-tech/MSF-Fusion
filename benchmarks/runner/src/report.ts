import { formatBytes, formatNumber } from "./stats.ts";
import type { RuntimeEnvironment } from "./env.ts";
import type { MicroSuiteResult } from "./suites/micro/index.ts";
import type { BundleSuiteResult } from "./suites/bundle/index.ts";
import type { SsrSuiteResult } from "./suites/ssr/index.ts";
import type { DomSuiteResult } from "./suites/dom/index.ts";

export interface BenchmarkRun {
  schemaVersion: 1;
  runId: string;
  generatedAt: string;
  environment: RuntimeEnvironment;
  suites: {
    micro?: MicroSuiteResult;
    bundle?: BundleSuiteResult;
    ssr?: SsrSuiteResult;
    dom?: DomSuiteResult;
  };
  status: "running" | "completed" | "failed";
  error?: string;
  notes: string[];
}

function versionLabel(
  environment: RuntimeEnvironment,
  packages: readonly string[],
): string {
  return packages
    .map((name) => `${name}@${environment.packageVersions[name] ?? "unknown"}`)
    .join("<br>");
}

function microTable(run: BenchmarkRun, suite: MicroSuiteResult): string {
  const lines: string[] = [];
  for (const scenario of suite.scenarios) {
    lines.push(`### ${scenario.id}`);
    lines.push("");
    lines.push(scenario.description);
    lines.push("");
    lines.push(
      `| Library | Version | Median ns/op | P95 ns/op | CV | Ops/s | Samples |`,
    );
    lines.push(`|---|---:|---:|---:|---:|---:|---:|`);
    const rows = suite.results
      .filter((result) => result.scenario === scenario.id)
      .sort((a, b) => a.summary.median - b.summary.median);
    for (const result of rows) {
      lines.push(
        `| ${result.candidate} | ${run.environment.packageVersions[result.packageName] ?? "unknown"} | ${formatNumber(result.summary.median)} | ${formatNumber(result.summary.p95)} | ${formatNumber(result.summary.cvPct)}% | ${Math.round(result.opsPerSecond).toLocaleString("en-US")} | ${result.samplesNsPerOp.length} |`,
      );
    }
    lines.push("");
  }
  if (suite.skipped.length > 0) {
    lines.push("### Excluded measurements");
    lines.push("");
    for (const skipped of suite.skipped) {
      lines.push(
        `- **${skipped.candidate} / ${skipped.scenario}**: ${skipped.reason}`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

function bundleTable(run: BenchmarkRun, suite: BundleSuiteResult): string {
  const lines = [
    "| App | Versions | JS raw | JS gzip | JS Brotli | CSS gzip | Total gzip | Build median | CV |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|",
  ];
  for (const app of suite.apps) {
    lines.push(
      `| ${app.label} | ${versionLabel(run.environment, app.frameworkPackages)} | ${formatBytes(app.jsRawBytes)} | ${formatBytes(app.jsGzipBytes)} | ${formatBytes(app.jsBrotliBytes)} | ${formatBytes(app.cssGzipBytes)} | ${formatBytes(app.totalGzipBytes)} | ${formatNumber(app.buildSummary.median, 1)} ms | ${formatNumber(app.buildSummary.cvPct, 1)}% |`,
    );
  }
  return lines.join("\n");
}

function ssrTable(run: BenchmarkRun, suite: SsrSuiteResult): string {
  const lines = [
    "| App | Versions | Median ms/render | P95 ms/render | CV | Renders/s | HTML bytes | SSR build |",
    "|---|---|---:|---:|---:|---:|---:|---:|",
  ];
  for (const app of suite.apps) {
    lines.push(
      `| ${app.label} | ${versionLabel(run.environment, app.frameworkPackages)} | ${formatNumber(app.summary.median, 3)} | ${formatNumber(app.summary.p95, 3)} | ${formatNumber(app.summary.cvPct, 1)}% | ${formatNumber(app.rendersPerSecond, 1)} | ${app.htmlBytes.toLocaleString("en-US")} | ${formatNumber(app.buildMs, 1)} ms |`,
    );
  }
  return lines.join("\n");
}

function domTables(run: BenchmarkRun, suite: DomSuiteResult): string {
  const lines: string[] = [];
  for (const scenario of suite.config.scenarios) {
    lines.push(`### ${scenario}`);
    lines.push("");
    lines.push(
      "| App | Versions | Sync median | Frame median | Frame P95 | Frame CV |",
    );
    lines.push("|---|---|---:|---:|---:|---:|");
    const rows = suite.apps
      .map((app) => ({
        app,
        result: app.scenarios.find((entry) => entry.scenario === scenario),
      }))
      .filter(
        (
          entry,
        ): entry is {
          app: (typeof suite.apps)[number];
          result: NonNullable<
            (typeof suite.apps)[number]["scenarios"][number]
          >;
        } => entry.result !== undefined,
      )
      .sort((a, b) => a.result.frameSummary.median - b.result.frameSummary.median);
    for (const { app, result } of rows) {
      lines.push(
        `| ${app.label} | ${versionLabel(run.environment, app.frameworkPackages)} | ${formatNumber(result.syncSummary.median, 2)} ms | ${formatNumber(result.frameSummary.median, 2)} ms | ${formatNumber(result.frameSummary.p95, 2)} ms | ${formatNumber(result.frameSummary.cvPct, 1)}% |`,
      );
    }
    lines.push("");
  }

  lines.push("### Startup and retained heap");
  lines.push("");
  lines.push(
    "| App | DCL | load | bench-ready mark | Heap empty | Heap after 10k rows | Heap after clear |",
  );
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const app of suite.apps) {
    const memory = app.memory;
    lines.push(
      `| ${app.label} | ${app.startup.domContentLoadedEventEnd === null ? "n/a" : `${formatNumber(app.startup.domContentLoadedEventEnd, 1)} ms`} | ${app.startup.loadEventEnd === null ? "n/a" : `${formatNumber(app.startup.loadEventEnd, 1)} ms`} | ${app.startup.readyMarkMs === null ? "n/a" : `${formatNumber(app.startup.readyMarkMs, 1)} ms`} | ${memory ? formatBytes(memory.baselineBytes) : "n/a"} | ${memory ? formatBytes(memory.afterCreate10000Bytes) : "n/a"} | ${memory ? formatBytes(memory.afterClearBytes) : "n/a"} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

export function renderReport(run: BenchmarkRun): string {
  const lines: string[] = [];
  lines.push("# MSF Fusion — Baseline Benchmark Report");
  lines.push("");
  lines.push(`- Run ID: \`${run.runId}\``);
  lines.push(`- Generated: ${run.generatedAt}`);
  lines.push(`- Status: **${run.status}**`);
  lines.push(`- Raw data: \`benchmarks/results/${run.runId}.json\``);
  lines.push("");
  lines.push(
    "> This report contains competitor baselines and, where integrated, the MSF Fusion runtime developer preview. MSF Fusion numbers are informational preview measurements, not superiority claims.",
  );
  lines.push("");
  lines.push("## Environment");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|---|---|");
  lines.push(`| Date | ${run.environment.runStartedAt} |`);
  lines.push(
    `| OS | ${run.environment.os} (${run.environment.arch}) |`,
  );
  lines.push(`| OS version | ${run.environment.osVersion} |`);
  lines.push(`| CPU | ${run.environment.cpuModel} |`);
  lines.push(`| Logical CPUs | ${run.environment.cpuCores} |`);
  lines.push(
    `| Memory | ${formatBytes(run.environment.totalMemoryBytes)} |`,
  );
  lines.push(`| Node.js | ${run.environment.node} |`);
  lines.push(`| pnpm | ${run.environment.pnpm ?? "unknown"} |`);
  lines.push(
    `| Git commit | ${run.environment.gitCommit ?? "uncommitted/unknown"}${run.environment.gitDirty ? " (dirty)" : ""} |`,
  );
  lines.push(`| Timezone | ${run.environment.timezone} |`);
  lines.push(
    `| Power scheme | ${run.environment.powerScheme ?? "not captured"} |`,
  );
  if (run.environment.browser) {
    lines.push(
      `| Browser | ${run.environment.browser.name} ${run.environment.browser.version} |`,
    );
  }
  lines.push("");
  lines.push("## Method");
  lines.push("");
  lines.push(
    "Library-specific primitives are compared, not whole frameworks. Read the semantic notes in the JSON before interpreting these numbers. Competitors were measured as pinned packages; MSF Fusion measurements use the in-repo developer-preview runtime.",
  );
  lines.push("");
  lines.push(
    "See `benchmarks/methodology.md` for exclusions, fairness rules, and known limitations.",
  );
  lines.push("");
  lines.push("### How to read the statistics");
  lines.push("");
  lines.push(
    "- **Median**: the 50th percentile of the raw samples (linear interpolation, R-7).",
  );
  lines.push(
    "- **P95**: the 95th percentile of the raw samples; higher values mean worse tail latency.",
  );
  lines.push(
    "- **CV**: coefficient of variation (`stddev / mean`, sample standard deviation). Values above roughly 10% indicate an unstable measurement on this machine.",
  );
  lines.push(
    "- **MAD**: median absolute deviation from the median, a robust spread measure.",
  );
  lines.push(
    "- **Ops/s**: `1 / median`, reported for convenience only and never used as a ranking score.",
  );
  lines.push("");

  if (run.suites.micro) {
    lines.push("## Reactivity microbenchmarks");
    lines.push("");
    lines.push(
      "Library-specific primitives are compared, not whole frameworks. Read the semantic notes in the JSON before interpreting these numbers.",
    );
    lines.push("");
    lines.push(microTable(run, run.suites.micro));
  }

  if (run.suites.ssr) {
    lines.push("## SSR rendering");
    lines.push("");
    lines.push(
      "Each framework renders the same 1,000-row table to an HTML string on a warm Node.js process. No I/O is included.",
    );
    lines.push("");
    lines.push(ssrTable(run, run.suites.ssr));
    lines.push("");
  }

  if (run.suites.bundle) {
    lines.push("## Production bundle size and build time");
    lines.push("");
    lines.push(bundleTable(run, run.suites.bundle));
    lines.push("");
    lines.push(
      "Build time is the Vite production build for the same functional fixture. It excludes dependency install and TypeScript type checking.",
    );
    lines.push("");
  }

  if (run.suites.dom) {
    lines.push("## Browser DOM operations");
    lines.push("");
    lines.push(
      "Measured in Chromium via Playwright on a local static production build. `syncMs` is synchronous work; `frameMs` includes two animation frames and therefore a frame-scheduling floor.",
    );
    lines.push("");
    lines.push(domTables(run, run.suites.dom));
  }

  lines.push("## Limitations and exclusions");
  lines.push("");
  const notes = new Set<string>([
    ...run.notes,
    ...(run.suites.micro?.notes ?? []),
    ...(run.suites.ssr?.notes ?? []),
    ...(run.suites.bundle?.notes ?? []),
    ...(run.suites.dom?.notes ?? []),
  ]);
  for (const note of notes) {
    lines.push(`- ${note}`);
  }
  lines.push(
    "- Results describe one machine and one point in time. They are not a universal ranking.",
  );
  lines.push(
    "- Angular, Next.js, Qwik, streaming SSR, hydration, and long-running memory-leak scenarios are not yet measured.",
  );
  lines.push("");
  lines.push("## Reproduction");
  lines.push("");
  lines.push("```bash");
  lines.push("pnpm install --frozen-lockfile");
  lines.push("pnpm bench:micro");
  lines.push("pnpm bench:ssr");
  lines.push("pnpm bench:bundle");
  lines.push("pnpm bench:dom");
  lines.push("pnpm bench:report");
  lines.push("```");
  lines.push("");
  lines.push(
    "Run suites sequentially in a single process for comparable results. Do not run CPU-bound suites concurrently with other benchmarks.",
  );
  lines.push("");
  return lines.join("\n");
}
