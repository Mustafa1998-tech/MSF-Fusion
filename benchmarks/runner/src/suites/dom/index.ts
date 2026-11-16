import { performance } from "node:perf_hooks";
import { chromium, type Browser, type Page } from "playwright";
import { APP_FIXTURES, buildClientFixture, type AppFixture } from "../../fixtures.ts";
import { summarize, type Summary } from "../../stats.ts";
import type {
  BenchInspection,
  RunTiming,
  ScenarioId,
} from "../../../fixtures/shared/bench-client.ts";
import { serveDirectory } from "./server.ts";

const DOM_SCENARIOS: readonly ScenarioId[] = [
  "create-1000",
  "create-10000",
  "update-all-1000",
  "update-one-1000",
  "swap-1000",
  "remove-one-1000",
  "clear-1000",
  "replace-1000",
];

export interface DomSuiteOptions {
  samples: number;
  warmup: number;
}

export interface DomScenarioResult {
  scenario: ScenarioId;
  samples: RunTiming[];
  syncSummary: Summary;
  frameSummary: Summary;
  verification: BenchInspection;
}

export interface DomMemoryResult {
  baselineBytes: number;
  afterCreate10000Bytes: number;
  afterClearBytes: number;
  garbageCollected: boolean;
}

export interface DomAppResult {
  app: string;
  label: string;
  frameworkPackages: string[];
  notes: string;
  buildMs: number;
  startup: {
    domContentLoadedEventEnd: number | null;
    loadEventEnd: number | null;
    readyMarkMs: number | null;
  };
  scenarios: DomScenarioResult[];
  memory: DomMemoryResult | null;
  consoleErrors: string[];
  pageErrors: string[];
}

export interface DomSuiteResult {
  kind: "dom";
  status: "completed";
  config: DomSuiteOptions & {
    viewport: { width: number; height: number };
    headless: true;
    scenarios: readonly ScenarioId[];
  };
  totalDurationMs: number;
  browser: { name: string; version: string; userAgent: string };
  apps: DomAppResult[];
  notes: string[];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function verifyScenario(scenario: ScenarioId, inspection: BenchInspection): void {
  const detail = JSON.stringify(inspection);
  switch (scenario) {
    case "create-1000":
      assert(inspection.rowCount === 1_000, `expected 1000 rows: ${detail}`);
      assert(inspection.firstId === 0, `expected first id 0: ${detail}`);
      assert(inspection.lastId === 999, `expected last id 999: ${detail}`);
      break;
    case "create-10000":
      assert(inspection.rowCount === 10_000, `expected 10000 rows: ${detail}`);
      assert(inspection.firstId === 0, `expected first id 0: ${detail}`);
      assert(inspection.lastId === 9_999, `expected last id 9999: ${detail}`);
      break;
    case "update-all-1000":
      assert(inspection.rowCount === 1_000, `expected 1000 rows: ${detail}`);
      assert(
        inspection.firstLabel?.endsWith("-u") === true &&
          inspection.row500Label?.endsWith("-u") === true &&
          inspection.lastLabel?.endsWith("-u") === true,
        `expected all sampled labels to be updated: ${detail}`,
      );
      break;
    case "update-one-1000":
      assert(inspection.rowCount === 1_000, `expected 1000 rows: ${detail}`);
      assert(
        inspection.row500Label?.endsWith("-one") === true,
        `expected row 500 label update: ${detail}`,
      );
      break;
    case "swap-1000":
      assert(inspection.rowCount === 1_000, `expected 1000 rows: ${detail}`);
      assert(inspection.secondId === 998, `expected swapped second id 998: ${detail}`);
      assert(
        inspection.penultimateId === 1,
        `expected swapped penultimate id 1: ${detail}`,
      );
      break;
    case "remove-one-1000":
      assert(inspection.rowCount === 999, `expected 999 rows: ${detail}`);
      assert(inspection.row500Label === null, `expected row 500 removed: ${detail}`);
      break;
    case "clear-1000":
      assert(inspection.rowCount === 0, `expected empty table: ${detail}`);
      break;
    case "replace-1000":
      assert(inspection.rowCount === 1_000, `expected 1000 rows: ${detail}`);
      assert(
        inspection.firstLabel?.includes("-r") === true &&
          inspection.firstLabel !== "row-0-r0",
        `expected replaced labels: ${detail}`,
      );
      break;
    default: {
      const exhaustive: never = scenario;
      throw new Error(`Unhandled scenario ${String(exhaustive)}`);
    }
  }
}

async function readStartup(page: Page): Promise<DomAppResult["startup"]> {
  return await page.evaluate(() => {
    const entries = performance.getEntries() as PerformanceEntry[];
    const navigation = entries.find(
      (entry) => entry.entryType === "navigation",
    ) as PerformanceNavigationTiming | undefined;
    const ready = performance.getEntriesByName("msf-bench-ready")[0];
    return {
      domContentLoadedEventEnd: navigation?.domContentLoadedEventEnd ?? null,
      loadEventEnd: navigation?.loadEventEnd ?? null,
      readyMarkMs: ready?.startTime ?? null,
    };
  });
}

async function inspect(page: Page): Promise<BenchInspection> {
  return await page.evaluate(() => {
    if (!window.__bench) throw new Error("Benchmark API disappeared");
    return window.__bench.inspect();
  });
}

async function prepare(page: Page, scenario: ScenarioId): Promise<void> {
  await page.evaluate(async (name) => {
    if (!window.__bench) throw new Error("Benchmark API not installed");
    await window.__bench.prepare(name);
  }, scenario);
}

async function run(page: Page, scenario: ScenarioId): Promise<RunTiming> {
  return await page.evaluate(async (name) => {
    if (!window.__bench) throw new Error("Benchmark API not installed");
    return await window.__bench.run(name);
  }, scenario);
}

async function runScenario(
  page: Page,
  scenario: ScenarioId,
  options: DomSuiteOptions,
): Promise<DomScenarioResult> {
  for (let i = 0; i < options.warmup; i += 1) {
    await prepare(page, scenario);
    await run(page, scenario);
  }
  verifyScenario(scenario, await inspect(page));

  const samples: RunTiming[] = [];
  for (let i = 0; i < options.samples; i += 1) {
    await prepare(page, scenario);
    const timing = await run(page, scenario);
    if (!Number.isFinite(timing.syncMs) || !Number.isFinite(timing.frameMs)) {
      throw new Error(`${scenario} returned a non-finite duration`);
    }
    if (timing.frameMs < timing.syncMs) {
      throw new Error(`${scenario} frame duration is below synchronous duration`);
    }
    samples.push(timing);
  }

  const verification = await inspect(page);
  verifyScenario(scenario, verification);
  return {
    scenario,
    samples,
    syncSummary: summarize(samples.map((sample) => sample.syncMs)),
    frameSummary: summarize(samples.map((sample) => sample.frameMs)),
    verification,
  };
}

async function measureMemory(
  context: Awaited<ReturnType<Browser["newContext"]>>,
  page: Page,
): Promise<DomMemoryResult | null> {
  try {
    const session = await context.newCDPSession(page);
    const collect = async (): Promise<number> => {
      await session.send("HeapProfiler.enable");
      await session.send("HeapProfiler.collectGarbage");
      const usage = (await session.send("Runtime.getHeapUsage")) as {
        usedSize: number;
      };
      return usage.usedSize;
    };
    await prepare(page, "clear-1000");
    await run(page, "clear-1000");
    const baselineBytes = await collect();
    await prepare(page, "create-10000");
    await run(page, "create-10000");
    const afterCreate10000Bytes = await collect();
    await prepare(page, "clear-1000");
    await run(page, "clear-1000");
    const afterClearBytes = await collect();
    await session.detach();
    return {
      baselineBytes,
      afterCreate10000Bytes,
      afterClearBytes,
      garbageCollected: true,
    };
  } catch {
    return null;
  }
}

async function runApp(
  browser: Browser,
  fixture: AppFixture,
  options: DomSuiteOptions,
): Promise<DomAppResult> {
  const { buildTimesMs, distDirectory } = await buildClientFixture(fixture, 1);
  const server = await serveDirectory(distDirectory);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.setDefaultTimeout(60_000);

  try {
    await page.goto(server.url, { waitUntil: "load" });
    await page.waitForFunction(() => window.__bench?.ready === true);
    const startup = await readStartup(page);

    const available = await page.evaluate(() => {
      if (!window.__bench) throw new Error("Benchmark API not installed");
      return window.__bench.scenarios;
    });
    const missing = DOM_SCENARIOS.filter(
      (scenario) => !available.includes(scenario),
    );
    if (missing.length > 0) {
      throw new Error(
        `${fixture.label} is missing scenarios: ${missing.join(", ")}`,
      );
    }

    const scenarios: DomScenarioResult[] = [];
    for (const scenario of DOM_SCENARIOS) {
      scenarios.push(await runScenario(page, scenario, options));
    }
    const memory = await measureMemory(context, page);
    if (pageErrors.length > 0) {
      throw new Error(
        `${fixture.label} raised page errors: ${pageErrors.join(" | ")}`,
      );
    }
    return {
      app: fixture.id,
      label: fixture.label,
      frameworkPackages: fixture.frameworkPackages,
      notes: fixture.notes,
      buildMs: buildTimesMs[0]!,
      startup,
      scenarios,
      memory,
      consoleErrors,
      pageErrors,
    };
  } finally {
    await context.close();
    await server.close();
  }
}

export async function runDomSuite(
  options: DomSuiteOptions,
): Promise<DomSuiteResult> {
  const startedAt = performance.now();
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
  });
  try {
    const apps: DomAppResult[] = [];
    for (const fixture of APP_FIXTURES.filter((item) => item.supportsClientBench !== false)) {
      apps.push(await runApp(browser, fixture, options));
    }
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate(() => navigator.userAgent);
    await context.close();

    return {
      kind: "dom",
      status: "completed",
      config: {
        ...options,
        viewport: { width: 1280, height: 900 },
        headless: true,
        scenarios: DOM_SCENARIOS,
      },
      totalDurationMs: performance.now() - startedAt,
      browser: {
        name: "Chromium (Playwright)",
        version: browser.version(),
        userAgent,
      },
      apps,
      notes: [
        "All applications expose the same imperative benchmark contract and render the same table markup.",
        "frameMs includes two requestAnimationFrame waits after the state update, so it has a fixed frame-scheduling floor of roughly 16-34 ms depending on refresh timing.",
        "syncMs measures only work completed before control returns to the benchmark harness; asynchronous commits are visible in frameMs but not syncMs.",
        "Preparation renders are outside the timed region. Warm-up runs are discarded.",
        "No CPU or network throttling is applied. Frame latency is expected to vary on shared desktop hardware.",
        "Memory values are CDP garbage-collected heap sizes after create-10000 and clear; they are not proof of absence of leaks.",
        "React fixtures use production React without React Compiler. Angular and Next.js are not part of the DOM baseline in Milestone 0.",
      ],
    };
  } finally {
    await browser.close();
  }
}

