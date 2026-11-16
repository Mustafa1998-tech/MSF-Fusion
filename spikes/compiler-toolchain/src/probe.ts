/**
 * Milestone 0 compiler-toolchain spike.
 *
 * This is an architecture-validation probe, not a benchmark. It records which
 * compiler APIs are actually available in the pinned toolchain and whether a
 * minimal parse/analyze/transform round-trip works. The `elapsedMs` values are
 * single diagnostic observations and are not statistically meaningful.
 *
 * Run with: pnpm spike:toolchain
 */
import { performance } from "node:perf_hooks";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import process from "node:process";
import { transformSync, __napiBindingTarget } from "oxc-transform-react";
import type {
  FeatureReport,
  OxcVariantReport,
  ToolchainProbeResult,
  TypeScriptApiReport,
} from "./types.ts";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
export const EVIDENCE_PATH = join(
  REPO_ROOT,
  "benchmarks",
  "evidence",
  "compiler-toolchain.json",
);
const FIXTURE_PROJECT = join(PACKAGE_ROOT, "fixtures", "project");

const UNSTABLE_FEATURES: Record<string, readonly string[]> = {
  "typescript/unstable/ast": [
    "createScanner",
    "formatSyntaxKind",
    "forEachChild",
    "visitEachChild",
  ],
  "typescript/unstable/ast/factory": [
    "createIdentifier",
    "createCallExpression",
    "updateCallExpression",
  ],
  "typescript/unstable/sync": [
    "API",
    "Snapshot",
    "Project",
    "Program",
    "Checker",
    "Emitter",
  ],
  "typescript/unstable/async": [
    "API",
    "Snapshot",
    "Project",
    "Program",
    "Checker",
    "Emitter",
  ],
};

async function probeTypeScriptRoot(): Promise<{
  version: string;
  rootExports: string[];
}> {
  const root = (await import("typescript")) as unknown as {
    version?: string;
  };
  return {
    version: root.version ?? "unknown",
    rootExports: Object.keys(root).sort(),
  };
}

async function probeUnstable(): Promise<Record<string, FeatureReport>> {
  const reports: Record<string, FeatureReport> = {};
  for (const [subpath, features] of Object.entries(UNSTABLE_FEATURES)) {
    try {
      const module = (await import(subpath)) as unknown as Record<
        string,
        unknown
      >;
      reports[subpath] = {
        exportCount: Object.keys(module).length,
        features: Object.fromEntries(
          features.map((name) => [name, typeof module[name]]),
        ),
      };
    } catch (error) {
      reports[subpath] = {
        exportCount: 0,
        features: {
          importError: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
  return reports;
}

async function probeScanner(): Promise<{
  tokenCount: number;
  tokens: string[];
  endOfFileConstantDefined: boolean;
}> {
  const ast = (await import("typescript/unstable/ast")) as unknown as {
    createScanner: (
      skipTrivia: boolean,
      languageVariant: unknown,
      text: string,
    ) => { scan(): number };
    formatSyntaxKind: (token: number) => string;
    SyntaxKind: object;
  };
  const scanner = ast.createScanner(
    false,
    // LanguageVariant.Standard is a runtime enum member.
    (await import("typescript/unstable/ast")).LanguageVariant.Standard,
    "const answer: number = 42;",
  );
  const tokens: string[] = [];
  for (let index = 0; index < 200; index += 1) {
    const token = scanner.scan();
    const name = ast.formatSyntaxKind(token);
    if (name === "EndOfFileToken") break;
    tokens.push(name);
  }
  return {
    tokenCount: tokens.length,
    tokens,
    endOfFileConstantDefined: Object.hasOwn(ast.SyntaxKind, "EndOfFileToken"),
  };
}

async function probeTypeScriptApi(): Promise<TypeScriptApiReport> {
  const startedAt = performance.now();
  try {
    const { API } = (await import("typescript/unstable/sync")) as unknown as {
      API: new (options: { cwd: string }) => {
        updateSnapshot(params?: {
          openProjects?: string[];
        }): {
          getProjects(): Array<{
            rootFiles: readonly string[];
            program: {
              getSourceFile(
                file: string,
              ): { fileName: string; text: string } | undefined;
              getSemanticDiagnostics(): readonly unknown[];
            };
          }>;
          dispose(): void;
        };
        close(): void;
      };
    };
    const api = new API({ cwd: FIXTURE_PROJECT });
    try {
      const snapshot = api.updateSnapshot({ openProjects: ["tsconfig.json"] });
      try {
        const projects = snapshot.getProjects();
        let sourceFiles = 0;
        let semanticDiagnostics = 0;
        for (const project of projects) {
          for (const root of project.rootFiles) {
            if (project.program.getSourceFile(root)) sourceFiles += 1;
          }
          semanticDiagnostics += project.program.getSemanticDiagnostics().length;
        }
        return {
          available: true,
          error: null,
          projects: projects.length,
          sourceFiles,
          semanticDiagnostics,
          diagnosticElapsedMs: performance.now() - startedAt,
          notes: [
            "The API spawns the pinned native TypeScript server (tsc.exe on Windows) and communicates over a pipe.",
            "Semantic diagnostics prove the server parsed and checked the fixture project.",
          ],
        };
      } finally {
        snapshot.dispose();
      }
    } finally {
      api.close();
    }
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : String(error),
      projects: 0,
      sourceFiles: 0,
      semanticDiagnostics: 0,
      diagnosticElapsedMs: null,
      notes: [],
    };
  }
}

const TSX_SOURCE = `export interface Props {
  name: string;
}

export function Greeting({ name }: Props) {
  return (
    <div class="greeting">
      <span>Hello {name}</span>
    </div>
  );
}
`;

const TS_SOURCE = `export const answer: number = 42;
`;

interface VariantSpec {
  name: string;
  filename: string;
  source: string;
  options: Parameters<typeof transformSync>[2];
  checks: Record<string, (code: string, map: boolean) => boolean>;
}

const VARIANTS: readonly VariantSpec[] = [
  {
    name: "typescript-strip",
    filename: "answer.ts",
    source: TS_SOURCE,
    options: { reactCompiler: false },
    checks: {
      "emits export": (code) => code.includes("export const answer"),
      "removes type annotation": (code) => !code.includes(": number"),
    },
  },
  {
    name: "classic-jsx",
    filename: "Greeting.tsx",
    source: TSX_SOURCE,
    options: {
      reactCompiler: false,
      jsx: { runtime: "classic", pragma: "h" },
      sourcemap: true,
    },
    checks: {
      "emits pragma call": (code) => code.includes('h("div"'),
      "keeps text child": (code) => code.includes("Hello"),
      "produces source map": (_code, map) => map,
    },
  },
  {
    name: "preserve-jsx",
    filename: "Greeting.tsx",
    source: TSX_SOURCE,
    options: { reactCompiler: false, jsx: "preserve" },
    checks: {
      "keeps JSX syntax": (code) => code.includes("<div"),
      "removes types": (code) => !code.includes("Props"),
    },
  },
];

async function probeOxc(): Promise<ToolchainProbeResult["oxc"]> {
  const variants: OxcVariantReport[] = [];
  for (const variant of VARIANTS) {
    const startedAt = performance.now();
    const result = transformSync(
      variant.filename,
      variant.source,
      variant.options,
    );
    variants.push({
      name: variant.name,
      fatal: result.fatal,
      errorCount: result.errors.length,
      codeBytes: Buffer.byteLength(result.code, "utf8"),
      sourceMap: result.map !== undefined,
      codeSample: result.code.slice(0, 400),
      checks: Object.fromEntries(
        Object.entries(variant.checks).map(([label, check]) => [
          label,
          check(result.code, result.map !== undefined),
        ]),
      ),
      elapsedMs: performance.now() - startedAt,
    });
  }
  return { bindingTarget: __napiBindingTarget, variants };
}

export async function runProbe(): Promise<ToolchainProbeResult> {
  const [root, unstable, scanner, api, oxc] = await Promise.all([
    probeTypeScriptRoot(),
    probeUnstable(),
    probeScanner(),
    probeTypeScriptApi(),
    probeOxc(),
  ]);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      os: `${os.type()} ${os.release()}`,
    },
    typescript: {
      version: root.version,
      rootExports: root.rootExports,
      unstable,
      scanner,
      api,
    },
    oxc,
    notes: [
      "TypeScript 7.0.2 exposes compiler APIs only under unstable/* subpaths; the root export is version-only.",
      "The unstable API is a client/server protocol and may change in minor releases; any adoption must be isolated behind an adapter.",
      "Oxc provides synchronous parse, TypeScript stripping, JSX transform, and source maps in one call.",
      "This probe validates feasibility only. It is not a performance benchmark and its elapsedMs values are not comparable measurements.",
    ],
  };
}

async function main(): Promise<void> {
  const result = await runProbe();
  await mkdir(dirname(EVIDENCE_PATH), { recursive: true });
  await writeFile(EVIDENCE_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`Compiler toolchain probe written to ${EVIDENCE_PATH}`);
  console.log(
    `TypeScript ${result.typescript.version}; API available: ${result.typescript.api.available}; projects: ${result.typescript.api.projects}; diagnostics: ${result.typescript.api.semanticDiagnostics}`,
  );
  console.log(`Oxc binding: ${result.oxc.bindingTarget}`);
  for (const variant of result.oxc.variants) {
    console.log(
      `  ${variant.name}: fatal=${variant.fatal} errors=${variant.errorCount} bytes=${variant.codeBytes} checks=${JSON.stringify(variant.checks)}`,
    );
  }
}

const isEntryPoint = process.argv[1] === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
