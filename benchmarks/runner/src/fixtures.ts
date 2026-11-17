import { readdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { brotliCompressSync, constants as zlibConstants, gzipSync } from "node:zlib";
import { build } from "vite";
import { FIXTURES_DIR } from "./io.ts";

export interface AppFixture {
  id: string;
  label: string;
  directory: string;
  frameworkPackages: string[];
  serverEntry: string;
  notes: string;
  /**
   * When false, skip client-only suites (`bundle`, `dom`) because the fixture
   * does not ship a client application yet.
   */
  supportsClientBench?: boolean;
}

export const APP_FIXTURES: readonly AppFixture[] = [
  {
    id: "react",
    label: "React",
    directory: join(FIXTURES_DIR, "apps", "react"),
    frameworkPackages: ["react", "react-dom"],
    serverEntry: "src/entry-server.tsx",
    notes:
      "React 19 client root and renderToString SSR. No React Compiler, no experimental APIs.",
  },
  {
    id: "solid",
    label: "Solid",
    directory: join(FIXTURES_DIR, "apps", "solid"),
    frameworkPackages: ["solid-js"],
    serverEntry: "src/entry-server.tsx",
    notes:
      "Solid store + For for keyed rows; Vite Solid plugin compiles JSX to fine-grained DOM operations.",
  },
  {
    id: "svelte",
    label: "Svelte",
    directory: join(FIXTURES_DIR, "apps", "svelte"),
    frameworkPackages: ["svelte"],
    serverEntry: "src/entry-server.ts",
    notes:
      "Svelte 5 runes, keyed each block, compiled by the official Vite plugin.",
  },
  {
    id: "vue",
    label: "Vue",
    directory: join(FIXTURES_DIR, "apps", "vue"),
    frameworkPackages: ["vue"],
    serverEntry: "src/entry-server.ts",
    notes:
      "Vue 3 Composition API, keyed v-for, official Vue Vite plugin.",
  },
  {
    id: "msf",
    label: "MSF Fusion",
    directory: join(FIXTURES_DIR, "apps", "msf"),
    frameworkPackages: ["@mustafa-26112026/runtime"],
    serverEntry: "src/entry-server.ts",
    notes:
      "MSF Fusion runtime-preview mount of an equivalent 1,000/10,000-row table using fine-grained signals + keyed list(). Informational preview measurement; not a production claim.",
    supportsClientBench: true,
  },
];

export interface BuildOutcome {
  durationMs: number;
  distDirectory: string;
}

async function cleanAndBuild(fixture: AppFixture): Promise<BuildOutcome> {
  const distDirectory = join(fixture.directory, "dist");
  await rm(distDirectory, { recursive: true, force: true });
  const startedAt = performance.now();
  await build({
    root: fixture.directory,
    configFile: join(fixture.directory, "vite.config.ts"),
    logLevel: "silent",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      write: true,
    },
  });
  return {
    durationMs: performance.now() - startedAt,
    distDirectory,
  };
}

/**
 * The first build warms Vite's transform pipeline and is not recorded.
 * Every measured build starts from an empty output directory.
 */
export async function buildClientFixture(
  fixture: AppFixture,
  measuredRuns = 1,
): Promise<{ buildTimesMs: number[]; distDirectory: string }> {
  await cleanAndBuild(fixture);
  const buildTimesMs: number[] = [];
  let distDirectory = "";
  for (let i = 0; i < measuredRuns; i += 1) {
    const outcome = await cleanAndBuild(fixture);
    buildTimesMs.push(outcome.durationMs);
    distDirectory = outcome.distDirectory;
  }
  return { buildTimesMs, distDirectory };
}

export async function buildSsrFixture(
  fixture: AppFixture,
): Promise<{ durationMs: number; entryPath: string }> {
  const distDirectory = join(fixture.directory, "dist-ssr");
  await rm(distDirectory, { recursive: true, force: true });
  const startedAt = performance.now();
  await build({
    root: fixture.directory,
    configFile: join(fixture.directory, "vite.config.ts"),
    logLevel: "silent",
    build: {
      ssr: fixture.serverEntry,
      outDir: "dist-ssr",
      emptyOutDir: true,
      write: true,
    },
  });
  const durationMs = performance.now() - startedAt;
  const entryPath = join(distDirectory, "entry-server.js");
  await stat(entryPath);
  return { durationMs, entryPath };
}

export interface AssetSize {
  path: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

async function walk(directory: string, prefix = ""): Promise<AssetSize[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets: AssetSize[] = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) {
      assets.push(...(await walk(absolute, relative)));
      continue;
    }
    if (!entry.isFile()) continue;
    const buffer = await readFile(absolute);
    assets.push({
      path: relative,
      rawBytes: buffer.byteLength,
      gzipBytes: gzipSync(buffer, { level: 9 }).byteLength,
      brotliBytes: brotliCompressSync(buffer, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
      }).byteLength,
    });
  }
  return assets;
}

export async function collectAssets(distDirectory: string): Promise<AssetSize[]> {
  return (await walk(distDirectory)).sort((a, b) =>
    a.path.localeCompare(b.path),
  );
}

export function extensionOf(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot);
}
