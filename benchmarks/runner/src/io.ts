import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RUNNER_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const BENCHMARKS_ROOT = resolve(RUNNER_ROOT, "..");
export const REPO_ROOT = resolve(BENCHMARKS_ROOT, "..");
export const RESULTS_DIR = join(BENCHMARKS_ROOT, "results");
export const REPORTS_DIR = join(BENCHMARKS_ROOT, "reports");
export const FIXTURES_DIR = join(RUNNER_ROOT, "fixtures");

export function makeRunId(date = new Date()): string {
  const iso = date.toISOString().replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${iso.replace("T", "_").replace("Z", "Z")}-${suffix}`;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(path: string, value: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

export async function latestResultPath(): Promise<string> {
  const { readdir } = await import("node:fs/promises");
  if (!existsSync(RESULTS_DIR)) {
    throw new Error(`No results directory exists at ${RESULTS_DIR}`);
  }
  const files = (await readdir(RESULTS_DIR))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const latest = files.at(-1);
  if (!latest) throw new Error(`No benchmark JSON results in ${RESULTS_DIR}`);
  return join(RESULTS_DIR, latest);
}
