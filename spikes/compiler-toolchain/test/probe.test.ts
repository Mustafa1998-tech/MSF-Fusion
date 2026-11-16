import { describe, expect, it } from "vitest";
import { runProbe } from "../src/probe.ts";
import type { ToolchainProbeResult } from "../src/types.ts";

let cached: Promise<ToolchainProbeResult> | null = null;

function probe(): Promise<ToolchainProbeResult> {
  cached ??= runProbe();
  return cached;
}

describe("compiler toolchain probe", () => {
  it("records the TypeScript root and unstable API surface", async () => {
    const result = await probe();
    expect(result.schemaVersion).toBe(1);
    expect(result.typescript.version).toMatch(/^7\./);
    expect(result.typescript.rootExports).toContain("version");

    const syncReport = result.typescript.unstable["typescript/unstable/sync"];
    const astReport = result.typescript.unstable["typescript/unstable/ast"];
    expect(syncReport).toBeDefined();
    expect(astReport).toBeDefined();
    expect(syncReport?.features.API).toBe("function");
    expect(astReport?.features.createScanner).toBe("function");
  }, 120_000);

  it("scans TypeScript tokens", async () => {
    const result = await probe();
    expect(result.typescript.scanner.tokenCount).toBeGreaterThan(0);
    expect(result.typescript.scanner.tokens).toContain("ConstKeyword");
    expect(result.typescript.scanner.tokens).toContain("NumericLiteral");
    expect(
      typeof result.typescript.scanner.endOfFileConstantDefined,
    ).toBe("boolean");
  }, 120_000);

  it("opens a project and produces semantic diagnostics", async () => {
    const result = await probe();
    expect(result.typescript.api.available).toBe(true);
    expect(result.typescript.api.error).toBeNull();
    expect(result.typescript.api.projects).toBeGreaterThan(0);
    expect(result.typescript.api.sourceFiles).toBeGreaterThan(0);
    expect(result.typescript.api.semanticDiagnostics).toBeGreaterThan(0);
  }, 120_000);

  it("transforms TypeScript and TSX with Oxc", async () => {
    const result = await probe();
    expect(result.oxc.variants.length).toBe(3);
    for (const variant of result.oxc.variants) {
      expect(variant.fatal).toBe(false);
      expect(variant.errorCount).toBe(0);
      expect(Object.values(variant.checks).every(Boolean)).toBe(true);
    }
  }, 120_000);
});
