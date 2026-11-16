#!/usr/bin/env node
import { basename, join } from "node:path";
import process from "node:process";
import { captureEnvironment } from "./env.ts";
import {
  latestResultPath,
  makeRunId,
  readJson,
  REPORTS_DIR,
  RESULTS_DIR,
  writeJson,
  writeText,
} from "./io.ts";
import { renderReport, type BenchmarkRun } from "./report.ts";
import { runBundleSuite } from "./suites/bundle/index.ts";
import { runDomSuite } from "./suites/dom/index.ts";
import { runMicroSuite } from "./suites/micro/index.ts";
import { runSsrSuite } from "./suites/ssr/index.ts";

const PACKAGE_NAMES = [
  "react",
  "react-dom",
  "solid-js",
  "svelte",
  "vue",
  "@preact/signals-core",
  "@vue/reactivity",
  "vite",
  "@vitejs/plugin-react",
  "vite-plugin-solid",
  "@sveltejs/vite-plugin-svelte",
  "@vitejs/plugin-vue",
  "playwright",
  "typescript",
  "vitest",
] as const;

type SuiteName = "micro" | "ssr" | "bundle" | "dom";

interface CliOptions {
  command: "all" | SuiteName | "report" | "help";
  samples: number | null;
  warmup: number | null;
  input: string | null;
}

function parseNumber(value: string | undefined, flag: string): number {
  if (value === undefined) throw new Error(`${flag} requires a value`);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} requires a positive integer`);
  }
  return parsed;
}

function parseArgs(argv: string[]): CliOptions {
  const command = (argv[0] ?? "all") as CliOptions["command"];
  const options: CliOptions = {
    command,
    samples: null,
    warmup: null,
    input: null,
  };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "--samples") {
      options.samples = parseNumber(argv[++i], "--samples");
    } else if (arg.startsWith("--samples=")) {
      options.samples = parseNumber(arg.slice("--samples=".length), "--samples");
    } else if (arg === "--warmup") {
      const value = Number(argv[++i]);
      if (!Number.isInteger(value) || value < 0) {
        throw new Error("--warmup requires a non-negative integer");
      }
      options.warmup = value;
    } else if (arg.startsWith("--warmup=")) {
      const value = Number(arg.slice("--warmup=".length));
      if (!Number.isInteger(value) || value < 0) {
        throw new Error("--warmup requires a non-negative integer");
      }
      options.warmup = value;
    } else if (arg === "--input") {
      const value = argv[++i];
      if (!value) throw new Error("--input requires a path");
      options.input = value;
    } else if (arg.startsWith("--input=")) {
      options.input = arg.slice("--input=".length);
    } else if (arg === "--help" || arg === "-h") {
      options.command = "help";
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function usage(): void {
  console.log(`MSF Fusion benchmark laboratory

Usage:
  node --expose-gc src/cli.ts <command> [options]

Commands:
  all       Run micro, SSR, bundle, and DOM suites (default)
  micro     Reactivity microbenchmarks
  ssr       Server-side rendering throughput
  bundle    Production bundle size and build time
  dom       Browser DOM operations, startup, and heap snapshots
  report    Render a markdown report from a saved JSON result
  help      Show this message

Options:
  --samples <n>   Samples per scenario (default: micro 12, SSR 12, DOM 10)
  --warmup <n>    Warm-up runs (default: micro 2, SSR 2, DOM 2)
  --input <path>  JSON input for the report command
`);
}

async function runReport(inputPath: string | null): Promise<void> {
  const path = inputPath ?? (await latestResultPath());
  const run = await readJson<BenchmarkRun>(path);
  const reportName = `${basename(path).replace(/\.json$/, "")}.md`;
  const outputPath = join(REPORTS_DIR, reportName);
  await writeText(outputPath, renderReport(run));
  console.log(`Report written to ${outputPath}`);
  console.log(`Source data: ${path}`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === "help") {
    usage();
    return;
  }
  if (options.command === "report") {
    await runReport(options.input);
    return;
  }

  const knownCommands = new Set(["all", "micro", "ssr", "bundle", "dom"]);
  if (!knownCommands.has(options.command)) {
    usage();
    throw new Error(`Unknown command: ${options.command}`);
  }

  const runId = makeRunId();
  const environment = captureEnvironment(PACKAGE_NAMES);
  const run: BenchmarkRun = {
    schemaVersion: 1,
    runId,
    generatedAt: new Date().toISOString(),
    environment,
    suites: {},
    status: "running",
    notes: [
      "Milestone 0 baseline only. MSF Fusion is not implemented, so this run contains no MSF Fusion measurements.",
      "All result values are machine- and time-specific. Raw samples are preserved in the JSON file.",
    ],
  };
  const resultPath = join(RESULTS_DIR, `${runId}.json`);
  const persist = async (): Promise<void> => {
    run.generatedAt = new Date().toISOString();
    await writeJson(resultPath, run);
  };
  await persist();

  try {
    const runMicro = options.command === "all" || options.command === "micro";
    const runSsr = options.command === "all" || options.command === "ssr";
    const runBundle = options.command === "all" || options.command === "bundle";
    const runDom = options.command === "all" || options.command === "dom";

    if (runMicro) {
      console.log("[bench] reactivity microbenchmarks...");
      run.suites.micro = await runMicroSuite({
        samples: options.samples ?? 12,
        warmup: options.warmup ?? 2,
      });
      await persist();
      console.log(
        `[bench] micro complete (${run.suites.micro.totalDurationMs.toFixed(0)} ms)`,
      );
    }

    if (runSsr) {
      console.log("[bench] SSR rendering...");
      run.suites.ssr = await runSsrSuite({
        samples: options.samples ?? 12,
        warmup: options.warmup ?? 2,
        rendersPerSample: 10,
      });
      await persist();
      console.log(
        `[bench] SSR complete (${run.suites.ssr.totalDurationMs.toFixed(0)} ms)`,
      );
    }

    if (runBundle) {
      console.log("[bench] production bundles and build time...");
      run.suites.bundle = await runBundleSuite();
      await persist();
      console.log(
        `[bench] bundle complete (${run.suites.bundle.totalDurationMs.toFixed(0)} ms)`,
      );
    }

    if (runDom) {
      console.log("[bench] browser DOM scenarios...");
      run.suites.dom = await runDomSuite({
        samples: options.samples ?? 10,
        warmup: options.warmup ?? 2,
      });
      run.environment.browser = {
        name: run.suites.dom.browser.name,
        version: run.suites.dom.browser.version,
      };
      await persist();
      console.log(
        `[bench] DOM complete (${run.suites.dom.totalDurationMs.toFixed(0)} ms)`,
      );
    }

    run.status = "completed";
    await persist();
    const reportPath = join(REPORTS_DIR, `${runId}.md`);
    await writeText(reportPath, renderReport(run));
    console.log(`[bench] raw results: ${resultPath}`);
    console.log(`[bench] report: ${reportPath}`);
  } catch (error) {
    run.status = "failed";
    run.error = error instanceof Error ? error.message : String(error);
    await persist();
    console.error(`[bench] FAILED: ${run.error}`);
    console.error(`[bench] partial raw results: ${resultPath}`);
    throw error;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
