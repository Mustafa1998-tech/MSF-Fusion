import { performance } from "node:perf_hooks";
import { APP_FIXTURES, buildClientFixture, collectAssets, extensionOf } from "../../fixtures.ts";
import { summarize, type Summary } from "../../stats.ts";

export interface BundleAppResult {
  app: string;
  label: string;
  frameworkPackages: string[];
  notes: string;
  buildTimesMs: number[];
  buildSummary: Summary;
  assets: Array<{
    path: string;
    rawBytes: number;
    gzipBytes: number;
    brotliBytes: number;
  }>;
  jsRawBytes: number;
  jsGzipBytes: number;
  jsBrotliBytes: number;
  cssRawBytes: number;
  cssGzipBytes: number;
  htmlRawBytes: number;
  totalGzipBytes: number;
  totalBrotliBytes: number;
}

export interface BundleSuiteResult {
  kind: "bundle";
  status: "completed";
  totalDurationMs: number;
  config: {
    mode: "production";
    minifier: string;
    measuredBuilds: number;
    includes: string[];
  };
  apps: BundleAppResult[];
  notes: string[];
}

export async function runBundleSuite(): Promise<BundleSuiteResult> {
  const startedAt = performance.now();
  const apps: BundleAppResult[] = [];

  for (const fixture of APP_FIXTURES) {
    const { buildTimesMs, distDirectory } = await buildClientFixture(
      fixture,
      3,
    );
    const assets = await collectAssets(distDirectory);
    const js = assets.filter((asset) => extensionOf(asset.path) === ".js");
    const css = assets.filter((asset) => extensionOf(asset.path) === ".css");
    const html = assets.filter((asset) => extensionOf(asset.path) === ".html");
    const sum = (values: number[]): number =>
      values.reduce((total, value) => total + value, 0);

    apps.push({
      app: fixture.id,
      label: fixture.label,
      frameworkPackages: fixture.frameworkPackages,
      notes: fixture.notes,
      buildTimesMs,
      buildSummary: summarize(buildTimesMs),
      assets,
      jsRawBytes: sum(js.map((asset) => asset.rawBytes)),
      jsGzipBytes: sum(js.map((asset) => asset.gzipBytes)),
      jsBrotliBytes: sum(js.map((asset) => asset.brotliBytes)),
      cssRawBytes: sum(css.map((asset) => asset.rawBytes)),
      cssGzipBytes: sum(css.map((asset) => asset.gzipBytes)),
      htmlRawBytes: sum(html.map((asset) => asset.rawBytes)),
      totalGzipBytes: sum(assets.map((asset) => asset.gzipBytes)),
      totalBrotliBytes: sum(assets.map((asset) => asset.brotliBytes)),
    });
  }

  return {
    kind: "bundle",
    status: "completed",
    totalDurationMs: performance.now() - startedAt,
    config: {
      mode: "production",
      minifier: "Oxc, as configured by Vite 8.3.8 (build.minify: 'oxc')",
      measuredBuilds: 3,
      includes: [
        "all JavaScript assets in dist (initial entry)",
        "CSS assets in dist",
        "index.html",
        "gzip level 9 and Brotli quality 11",
      ],
    },
    apps,
    notes: [
      "The same functional application (empty table plus imperative benchmark API) is built for every framework.",
      "One untimed warm-up build runs before three measured builds; each build starts from an empty dist directory.",
      "Build time includes Vite's in-process config loading and transform pipeline, but not package installation or TypeScript checking.",
      "React has no compiler plugin in this baseline (React Compiler intentionally disabled).",
      "Bundle sizes include framework runtime and benchmark harness code; they are not hello-world sizes.",
      "Angular and Next.js builds are not included in this baseline; see benchmarks/methodology.md for the reason.",
    ],
  };
}
