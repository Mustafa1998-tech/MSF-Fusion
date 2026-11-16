#!/usr/bin/env node
import { resolve } from "node:path";
import process from "node:process";
import { compilePath, getDevStatus, checkPath } from "./index.js";

function usage() {
  console.log(`msf-dev (preview)\n\nUsage:\n  node packages/dev/src/cli.ts status\n  node packages/dev/src/cli.ts check <input-file-or-dir>\n  node packages/dev/src/cli.ts compile <input-file-or-dir> [--out <dir>]\n`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === "help" || cmd === "--help") { usage(); return; }
  if (cmd === "status") {
    console.log(JSON.stringify(getDevStatus(), null, 2));
    return;
  }
  if (cmd === "check") {
    const input = rest[0];
    if (!input) throw new Error("check requires <input-file-or-dir>");
    const results = await checkPath(resolve(input));
    let errors = 0;
    let transformed = 0;
    for (const r of results) {
      if (r.transformed) transformed++;
      if (!r.ok) errors += r.diagnostics.length;
      if (!r.ok) console.log(`FAIL ${r.file}`);
      for (const d of r.diagnostics) console.log(`  [${d.code}] ${d.message}${d.line ? ` (${d.line}:${d.column ?? 0})` : ""}`);
    }
    console.log(`\n${results.length} file(s) checked (${transformed} transformed), ${errors} diagnostic(s).`);
    if (errors > 0) process.exitCode = 1;
    return;
  }
  if (cmd === "compile") {
    const input = rest[0];
    if (!input) throw new Error("compile requires <input-file-or-dir>");
    let outDir: string | undefined;
    const outIdx = rest.indexOf("--out");
    if (outIdx >= 0) outDir = rest[outIdx + 1];
    const results = await compilePath(resolve(input), outDir ? resolve(outDir) : undefined);
    let errors = 0;
    for (const r of results) {
      errors += r.diagnostics.length;
      console.log(`${r.transformed ? "compiled" : "copied " } ${r.file}${r.outFile ? ` -> ${r.outFile}` : ""}`);
      for (const d of r.diagnostics) console.log(`  [${d.code}] ${d.message}${d.line ? ` (${d.line}:${d.column ?? 0})` : ""}`);
    }
    console.log(`\n${results.length} file(s), ${errors} diagnostic(s).`);
    if (errors > 0) process.exitCode = 1;
    return;
  }
  usage();
  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : String(e)); process.exitCode = 1; });

