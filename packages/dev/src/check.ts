import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { compile } from "@msf/compiler";

export type CompileTarget = "dom" | "universal";
export interface CompileOptions {
  target?: CompileTarget;
}

export interface CheckDiagnostic {
  code: string;
  message: string;
  line?: number;
  column?: number;
}

export interface CheckResult {
  file: string;
  ok: boolean;
  transformed: boolean;
  diagnostics: CheckDiagnostic[];
}

export async function checkFile(inputFile: string, options: CompileOptions = {}): Promise<CheckResult> {
  const source = await readFile(inputFile, "utf8");
  const result = compile({ filename: inputFile, source, target: options.target ?? "dom" });
  return {
    file: inputFile,
    ok: result.diagnostics.length === 0,
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
      if (e.name === "node_modules" || e.name === "dist" || e.name === ".git" || e.name === "dist-ssr") continue;
      files.push(...(await collectFiles(p, exts)));
    } else if (exts.some((x) => e.name.endsWith(x))) {
      files.push(p);
    }
  }
  return files.sort();
}

export async function checkPath(inputPath: string, options: CompileOptions = {}): Promise<CheckResult[]> {
  const s = await stat(inputPath);
  if (s.isFile()) return [await checkFile(inputPath, options)];
  const files = await collectFiles(inputPath, [".tsx", ".jsx"]);
  const results: CheckResult[] = [];
  for (const f of files) results.push(await checkFile(f, options));
  return results;
}
