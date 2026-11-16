import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { APP_FIXTURES, buildSsrFixture, type AppFixture } from "../../fixtures.ts";
import { summarize, type Summary } from "../../stats.ts";

export interface SsrSuiteOptions {
  samples: number;
  warmup: number;
  rendersPerSample: number;
}

interface SsrModule {
  renderPage(): string | Promise<string>;
}

export interface SsrAppResult {
  app: string;
  label: string;
  frameworkPackages: string[];
  notes: string;
  buildMs: number;
  htmlBytes: number;
  validation: {
    rowCount: number;
    firstRow: boolean;
    lastRow: boolean;
  };
  samplesMsPerRender: number[];
  summary: Summary;
  rendersPerSecond: number;
  warmupRenders: number;
}

export interface SsrSuiteResult {
  kind: "ssr";
  status: "completed";
  config: SsrSuiteOptions & { rendersPerSample: number };
  totalDurationMs: number;
  apps: SsrAppResult[];
  notes: string[];
}

async function renderOnce(module: SsrModule): Promise<string> {
  return await module.renderPage();
}

function validateHtml(html: string): SsrAppResult["validation"] {
  const rowCount = (html.match(/data-row=/g) ?? []).length;
  return {
    rowCount,
    firstRow: html.includes('data-row="0"') && html.includes("row-0-r0"),
    lastRow: html.includes('data-row="999"') && html.includes("row-999-r0"),
  };
}

async function loadFixture(
  fixture: AppFixture,
  cacheKey: number,
): Promise<{ module: SsrModule; buildMs: number }> {
  const { entryPath, durationMs } = await buildSsrFixture(fixture);
  const module = (await import(
    `${pathToFileURL(entryPath).href}?v=${cacheKey}`
  )) as SsrModule;
  if (typeof module.renderPage !== "function") {
    throw new Error(
      `${fixture.label} SSR entry does not export renderPage(): string`,
    );
  }
  return { module, buildMs: durationMs };
}

export async function runSsrSuite(
  options: SsrSuiteOptions,
): Promise<SsrSuiteResult> {
  const startedAt = performance.now();
  const apps: SsrAppResult[] = [];

  for (const [index, fixture] of APP_FIXTURES.entries()) {
    const { module, buildMs } = await loadFixture(fixture, index);
    const firstHtml = await renderOnce(module);
    const validation = validateHtml(firstHtml);
    if (validation.rowCount !== 1_000 || !validation.firstRow || !validation.lastRow) {
      throw new Error(
        `${fixture.label} SSR output failed structural validation: ${JSON.stringify(validation)}`,
      );
    }

    for (let i = 0; i < options.warmup; i += 1) {
      await renderOnce(module);
    }

    const samplesMsPerRender: number[] = [];
    for (let sample = 0; sample < options.samples; sample += 1) {
      const start = performance.now();
      for (let render = 0; render < options.rendersPerSample; render += 1) {
        await renderOnce(module);
      }
      const elapsed = performance.now() - start;
      samplesMsPerRender.push(elapsed / options.rendersPerSample);
    }

    const summary = summarize(samplesMsPerRender);
    apps.push({
      app: fixture.id,
      label: fixture.label,
      frameworkPackages: fixture.frameworkPackages,
      notes: fixture.notes,
      buildMs,
      htmlBytes: Buffer.byteLength(firstHtml, "utf8"),
      validation,
      samplesMsPerRender,
      summary,
      rendersPerSecond: 1_000 / summary.median,
      warmupRenders: options.warmup,
    });
  }

  return {
    kind: "ssr",
    status: "completed",
    config: options,
    totalDurationMs: performance.now() - startedAt,
    apps,
    notes: [
      "Each application renders the same 1,000-row markup on every request; no data fetching or I/O is included.",
      "SSR builds use Vite's SSR mode and each framework's official production renderer.",
      "React uses react-dom/server renderToString; Solid uses renderToString; Svelte uses svelte/server; Vue uses vue/server-renderer.",
      "Next.js, Angular SSR, and Qwik are not included because their server stacks add routing, bundling, and transport layers that are not functionally equivalent to a single render call.",
      "Hydration and streaming SSR are not measured in Milestone 0.",
      "SSR build time is recorded separately and is not part of the render latency samples.",
    ],
  };
}
