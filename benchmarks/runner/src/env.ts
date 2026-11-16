import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import os from "node:os";
import process from "node:process";

const require = createRequire(import.meta.url);

export interface RuntimeEnvironment {
  runStartedAt: string;
  node: string;
  pnpm: string | null;
  platform: string;
  release: string;
  osVersion: string;
  arch: string;
  os: string;
  cpuModel: string;
  cpuCores: number;
  totalMemoryBytes: number;
  gitCommit: string | null;
  gitDirty: boolean | null;
  timezone: string;
  powerScheme: string | null;
  browser: { name: string; version: string } | null;
  packageVersions: Record<string, string>;
  notes: string[];
}

/**
 * Resolve a command the way a shell would. On Windows, package-manager
 * shims are `.cmd` files that `execFileSync` cannot execute without an
 * explicit extension, so try `<command>.cmd` before the bare name.
 */
function commandCandidates(command: string): string[] {
  if (process.platform === "win32" && !command.includes(".")) {
    return [`${command}.cmd`, command];
  }
  return [command];
}

function commandOutput(command: string, args: string[]): string | null {
  for (const candidate of commandCandidates(command)) {
    try {
      return execFileSync(candidate, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 10_000,
      }).trim();
    } catch {
      // Try the next candidate (for example `pnpm` after `pnpm.cmd` fails).
    }
  }
  return null;
}

function resolvePackageVersion(packageName: string): string | null {
  try {
    let current = dirname(require.resolve(packageName));
    for (let depth = 0; depth < 8; depth += 1) {
      const manifestPath = join(current, "package.json");
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
          name?: string;
          version?: string;
        };
        if (manifest.name === packageName && manifest.version) {
          return manifest.version;
        }
      } catch {
        // Continue walking towards the package root.
      }
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  } catch {
    return null;
  }
  return null;
}

export function captureEnvironment(
  packageNames: readonly string[],
  browser: { name: string; version: string } | null = null,
): RuntimeEnvironment {
  const packageVersions: Record<string, string> = {};
  for (const packageName of packageNames) {
    const version = resolvePackageVersion(packageName);
    if (version) packageVersions[packageName] = version;
  }

  const cpus = os.cpus();
  const gitCommit = commandOutput("git", ["rev-parse", "HEAD"]);
  const gitStatus = commandOutput("git", ["status", "--porcelain"]);
  const pnpm = commandOutput("pnpm", ["--version"]);
  const powerScheme = commandOutput("powercfg", ["/getactivescheme"]);

  return {
    runStartedAt: new Date().toISOString(),
    node: process.version,
    pnpm,
    platform: process.platform,
    release: os.release(),
    osVersion: os.version(),
    arch: process.arch,
    os: `${os.type()} ${os.release()}`,
    cpuModel: cpus[0]?.model ?? "unknown",
    cpuCores: cpus.length,
    totalMemoryBytes: os.totalmem(),
    gitCommit,
    gitDirty: gitStatus === null ? null : gitStatus.length > 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    powerScheme,
    browser,
    packageVersions,
    notes: [
      "Package versions are resolved from the installed node_modules tree, not copied from package.json ranges.",
      "gitDirty reports any tracked or untracked change at run start.",
      "On Windows, command versions are captured through the .cmd shim when present.",
    ],
  };
}
