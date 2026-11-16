import { describe, expect, it } from "vitest";
import { captureEnvironment } from "../src/env.ts";

describe("captureEnvironment", () => {
  it("captures the runtime and installed package versions", () => {
    const environment = captureEnvironment(["react", "typescript"]);
    expect(environment.node).toBe(process.version);
    expect(environment.platform).toBe(process.platform);
    expect(environment.osVersion.length).toBeGreaterThan(0);
    expect(environment.cpuCores).toBeGreaterThan(0);
    expect(environment.totalMemoryBytes).toBeGreaterThan(0);
    expect(environment.packageVersions["react"]).toMatch(/^\d+\.\d+\.\d+/);
    expect(environment.packageVersions["typescript"]).toMatch(
      /^\d+\.\d+\.\d+/,
    );
  });

  it("captures git state without throwing", () => {
    const environment = captureEnvironment([]);
    expect(
      environment.gitCommit === null || typeof environment.gitCommit === "string",
    ).toBe(true);
    expect([true, false, null]).toContain(environment.gitDirty);
  });
});
