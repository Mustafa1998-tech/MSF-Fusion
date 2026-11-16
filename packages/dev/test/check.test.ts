import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkFile, checkPath } from "../src/check.js";

let dir: string;
beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "msf-check-"));
  mkdirSync(join(dir, "nested"), { recursive: true });
  writeFileSync(join(dir, "ok.tsx"), `export const Ok = () => <div>ok</div>;\n`);
  writeFileSync(join(dir, "nested", "err.tsx"), `export const Bad = () => <DoesNotExistComponent />;\n`);
  writeFileSync(join(dir, "plain.ts"), `export const x = 1;\n`);
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("msf-dev check", () => {
  it("passes clean JSX files with no diagnostics", async () => {
    const res = await checkFile(join(dir, "ok.tsx"));
    expect(res.ok).toBe(true);
    expect(res.transformed).toBe(true);
    expect(res.diagnostics).toEqual([]);
  });

  it("reports unsupported components in the DOM target", async () => {
    const res = await checkFile(join(dir, "nested", "err.tsx"));
    expect(res.ok).toBe(false);
    expect(res.diagnostics.some((d) => d.code === "MSF_UNSUPPORTED_COMPONENT")).toBe(true);
  });

  it("passes plain .ts files untouched (non-JSX inputs are skipped)", async () => {
    const res = await checkFile(join(dir, "plain.ts"));
    expect(res.ok).toBe(true);
    expect(res.transformed).toBe(false);
  });

  it("recursively checks a directory and separates ok from failures", async () => {
    const results = await checkPath(dir);
    expect(results.length).toBe(2); // plain.ts is ignored by design
    const okFiles = results.filter((r) => r.ok).map((r) => r.file);
    const bad = results.filter((r) => !r.ok).map((r) => r.file);
    expect(okFiles.some((f) => f.endsWith("ok.tsx"))).toBe(true);
    expect(bad.some((f) => f.endsWith("err.tsx"))).toBe(true);
  });
});
