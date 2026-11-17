#!/usr/bin/env node
/**
 * Publish the @mustafa-26112026/* packages in dependency order.
 *
 * Safe by default: runs a dry-run unless `--yes` is passed.
 *
 *   node scripts/publish-packages.mjs            # dry run (packs every package, publishes nothing)
 *   node scripts/publish-packages.mjs --yes      # real publish, tag `latest`, then add `preview`
 *   node scripts/publish-packages.mjs --yes --tag preview
 *
 * Preflight: npm authentication, clean git tree, build, consumer verification.
 * Refuses to continue if any step fails.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const confirmed = args.includes("--yes");
const tagIndex = args.indexOf("--tag");
const tag = tagIndex >= 0 ? args[tagIndex + 1] : "latest";
const packages = ["contracts", "runtime", "compiler", "dev"];

function run(command, options = {}) {
  console.log(`\n$ ${command}`);
  execSync(command, { cwd: root, stdio: "inherit", shell: true, ...options });
}

function capture(command) {
  return execSync(command, { cwd: root, encoding: "utf8", shell: true }).trim();
}

function readPackage(dir) {
  const file = join(root, "packages", dir, "package.json");
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

function preflight() {
  let user;
  try {
    user = capture("npm whoami");
  } catch {
    throw new Error("Not authenticated with npm. Run `npm login` on this machine first.");
  }
  console.log(`npm user: ${user} (${capture("npm config get registry")})`);

  // Publishes happen from the `files` list; untracked files are irrelevant and may legitimately exist locally.
  const dirty = capture("git status --porcelain -uno");
  if (dirty) {
    throw new Error(`Working tree has uncommitted tracked changes:\n${dirty}\nCommit or stash before publishing.`);
  }

  for (const dir of packages) {
    const pkg = readPackage(dir);
    if (pkg.private) throw new Error(`packages/${dir} is still private:true.`);
    if (!pkg.version || pkg.version === "0.0.0") throw new Error(`packages/${dir} has no release version.`);
    if (pkg.publishConfig?.access !== "public") throw new Error(`packages/${dir} must set publishConfig.access=public.`);
  }
  if (!["latest", "preview", "next"].includes(tag)) throw new Error(`Unsupported dist-tag: ${tag}`);
}

function main() {
  console.log(`MSF Fusion publish — ${confirmed ? "REAL PUBLISH" : "dry run"} (tag: ${tag})`);
  for (const dir of packages) {
    const pkg = readPackage(dir);
    console.log(`  ${pkg.name}@${pkg.version}`);
  }

  preflight();
  run("pnpm run build");
  run("node scripts/verify-package.mjs");
  run("git fetch origin --tags");

  for (const dir of packages) {
    const pkg = readPackage(dir);
    const flags = `--access public --tag ${tag} --no-git-checks`;
    if (confirmed) {
      run(`pnpm --filter ${pkg.name} publish ${flags}`);
    } else {
      run(`pnpm --filter ${pkg.name} publish ${flags} --dry-run`);
    }
  }

  if (!confirmed) {
    console.log("\nDry run complete. Re-run with --yes to publish.");
    return;
  }

  for (const dir of packages) {
    const pkg = readPackage(dir);
    run(`npm dist-tag add ${pkg.name}@${pkg.version} preview`);
    const published = capture(`npm view ${pkg.name}@${pkg.version} version`);
    console.log(`${pkg.name}: published ${published}, dist-tags: ${capture(`npm view ${pkg.name} dist-tags --json`).replace(/\s+/g, " ")}`);
  }
  console.log("\nPublish complete.");
}

try {
  main();
} catch (error) {
  console.error(`\nPublish aborted: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
