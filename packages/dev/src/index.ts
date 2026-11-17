import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { compile } from "@msf/compiler";

export { checkFile, checkPath, type CheckResult, type CheckDiagnostic } from "./check.js";

export interface CompileFileResult {
  file: string;
  outFile?: string;
  transformed: boolean;
  diagnostics: Array<{ code: string; message: string; line?: number; column?: number }>;
}

export async function compileFile(inputFile: string, outDir?: string): Promise<CompileFileResult> {
  const source = await readFile(inputFile, "utf8");
  const result = compile({ filename: inputFile, source });
  let outFile: string | undefined;
  if (outDir) {
    const base = relative(process.cwd(), inputFile).replace(/\.(tsx|jsx)$/i, ".js");
    outFile = resolve(outDir, base);
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, result.code, "utf8");
  }
  return {
    file: inputFile,
    ...(outFile ? { outFile } : {}),
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

export async function compilePath(inputPath: string, outDir?: string): Promise<CompileFileResult[]> {
  const s = await stat(inputPath);
  if (s.isFile()) return [await compileFile(inputPath, outDir)];
  const files = await collectFiles(inputPath, [".tsx", ".jsx"]);
  const results: CompileFileResult[] = [];
  for (const f of files) results.push(await compileFile(f, outDir));
  return results;
}

export function getDevStatus(): { ready: boolean; message: string; features: string[] } {
  return {
    ready: true,
    message: "MSF dev tooling preview: file compilation/check for JSX subset is available (no dev server/HMR yet).",
    features: ["compile-file", "compile-path", "check-file", "check-path", "diagnostics"],
  };
}
