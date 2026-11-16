import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PACKAGES = ["@msf/contracts", "@msf/runtime", "@msf/compiler", "@msf/dev"];

const run = (cmd, args, opts = {}) => {
  if (process.platform !== "win32") {
    return execFileSync(cmd, args, { stdio: "inherit", ...opts });
  }
  // Windows: resolve node commands directly, shell-quote everything else.
  if (cmd === process.execPath) {
    return execFileSync(cmd, args, { stdio: "inherit", ...opts });
  }
  const winArgs = args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a));
  return execFileSync(cmd, winArgs, { stdio: "inherit", shell: true, ...opts });
};

function outOf(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", ...opts, shell: process.platform === "win32" }).trim();
}

async function main() {
  for (const pkg of PACKAGES) {
    run("pnpm", ["--filter", pkg, "run", "build"], { cwd: root });
  }

  const work = mkdtempSync(join(tmpdir(), "msf-consume-"));
  const packsDir = join(work, "packs");
  mkdirSync(packsDir, { recursive: true });
  const tarballMap = {};
  for (const pkg of PACKAGES) {
    run("pnpm", ["--filter", pkg, "pack", "--pack-destination", packsDir], { cwd: root });
    const tb = readdirSync(packsDir).find((f) => f.endsWith(".tgz") && f.includes(pkg.replace("@", "").replace("/", "-")));
    if (!tb) throw new Error(`tarball not found for ${pkg}; got: ${readdirSync(packsDir).join(",")}`);
    tarballMap[pkg] = join(packsDir, tb);
  }

  const consumer = join(work, "consumer");
  mkdirSync(consumer, { recursive: true });
  const deps = Object.fromEntries(PACKAGES.map((p) => [p, `file:${tarballMap[p]}`]));
  writeFileSync(
    join(consumer, "pnpm-workspace.yaml"),
    "packages:\n  - .\n" + "overrides:\n" + PACKAGES.map((p) => `  '${p}': 'file:${tarballMap[p]}'\n`).join(""),
    "utf8",
  );
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      name: "msf-consumer-smoke",
      version: "0.0.0",
      private: true,
      type: "module",
      dependencies: deps,
    }, null, 2),
    "utf8",
  );
  run("pnpm", ["install", "--no-frozen-lockfile"], { cwd: consumer });

  const smokePath = join(consumer, "smoke.mjs");
  writeFileSync(smokePath, `import { createSignal, batch, createMemo, createEffect, createRoot, untrack } from "@msf/runtime";
import { renderToString, h, escapeHtml } from "@msf/runtime/server";
import { compile } from "@msf/compiler";
import { getDevStatus } from "@msf/dev";
import { MSF_CONTRACTS_VERSION } from "@msf/contracts";
import { h as uh } from "@msf/runtime/universal";
import assert from "node:assert/strict";

const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);
setCount(21);
assert.equal(doubled(), 42);
assert.equal(escapeHtml("<b>&</b>"), "&lt;b&gt;&amp;&lt;/b&gt;");
assert.equal(renderToString(() => h("p", { class: "x" }, "ok")), '<p class="x">ok</p>');
assert.equal(typeof uh, "function");
const res = compile({ filename: "X.tsx", source: "export const V = () => <div>{1}</div>;" });
assert.equal(res.diagnostics.length, 0);
assert.ok(getDevStatus().ready);
assert.equal(typeof MSF_CONTRACTS_VERSION, "string");
console.log("consumer smoke: OK");
`, "utf8");
  run("node", [smokePath], { cwd: consumer });

  // Type consumer: verify declarations resolve and are usable.
  writeFileSync(join(consumer, "types.ts"), `import { createSignal, type Accessor, type Dispose } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";
import { compile, type CompileRequest } from "@msf/compiler";
import type { Diagnostic } from "@msf/contracts";
const [count]: [Accessor<number>, Dispose] = [0 as unknown as Accessor<number>, (() => {}) as Dispose];
void count;
const req: CompileRequest = { filename: "a.tsx", source: "//" };
const r = compile(req);
const diags: Diagnostic[] = r.diagnostics;
void diags;
const html: string = renderToString(() => h("p", null, "typed"));
void html;
`, "utf8");
  writeFileSync(join(consumer, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      strict: true,
      module: "NodeNext",
      moduleResolution: "NodeNext",
      noEmit: true,
      skipLibCheck: true
    },
    include: ["types.ts"]
  }, null, 2), "utf8");
  run(process.execPath, [
    join(root, "node_modules", "typescript", "bin", "tsc"),
    "-p", join(consumer, "tsconfig.json")
  ], { cwd: consumer, shell: false });
  console.log("consumer typecheck: OK");

  const evidence = {
    date: new Date().toISOString(),
    packages: PACKAGES,
    checks: ["build", "pack", "consumer install", "consumer runtime smoke", "consumer typecheck"],
    status: "passed",
  };
  writeFileSync(join(root, "benchmarks", "evidence", "package-verification.json"), JSON.stringify(evidence, null, 2) + "\n", "utf8");
  console.log("package verification: PASS (evidence written to benchmarks/evidence/package-verification.json)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
