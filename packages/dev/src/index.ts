import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, resolve, basename } from "node:path";
import { compile } from "@msf/compiler";

export { checkFile, checkPath, type CheckResult, type CheckDiagnostic } from "./check.js";

export interface CompileFileResult {
  file: string;
  outFile?: string;
  transformed: boolean;
  diagnostics: Array<{ code: string; message: string; line?: number; column?: number }>;
}

export type CompileTarget = "dom" | "universal";
export interface CompileOptions {
  target?: CompileTarget;
}

export async function compileFile(inputFile: string, outDir?: string, options: CompileOptions = {}): Promise<CompileFileResult> {
  const source = await readFile(inputFile, "utf8");
  const result = compile({ filename: inputFile, source, target: options.target ?? "dom" });
  let outDirTarget: string | undefined;
  if (outDir) {
    const outName = basename(inputFile).replace(/\.(tsx|jsx)$/i, ".js");
    outDirTarget = resolve(outDir, outName);
    await mkdir(outDir, { recursive: true });
    await writeFile(outDirTarget, result.code, "utf8");
  }
  return {
    file: inputFile,
    ...(outDirTarget ? { outFile: outDirTarget } : {}),
    transformed: Boolean(result.meta?.transformed),
    diagnostics: result.diagnostics.map((d) => ({
      code: d.code,
      message: d.message,
      ...(d.line !== undefined ? { line: d.line } : {}),
      ...(d.column !== undefined ? { column: d.column } : {}),
    })),
  };
}

async function collectFiles(dir: string, exts: string[]): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === ".git") continue;
      files.push(...(await collectFiles(p, exts)));
    } else if (exts.some((x) => e.name.endsWith(x))) {
      files.push(p);
    }
  }
  return files.sort();
}

export async function compilePath(inputPath: string, outDir?: string, options: CompileOptions = {}): Promise<CompileFileResult[]> {
  const s = await stat(inputPath);
  if (s.isFile()) return [await compileFile(inputPath, outDir, options)];
  const files = await collectFiles(inputPath, [".tsx", ".jsx"]);
  const results: CompileFileResult[] = [];
  for (const f of files) results.push(await compileFile(f, outDir, options));
  return results;
}

export function getDevStatus(): { ready: boolean; message: string; features: string[] } {
  return {
    ready: true,
    message: "MSF dev tooling preview: file compilation/check for JSX subset is available (no dev server/HMR yet).",
    features: ["compile-file", "compile-path", "check-file", "check-path", "diagnostics"],
  };
}
