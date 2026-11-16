import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { makeRunId, readJson, writeJson } from "../src/io.ts";

describe("makeRunId", () => {
  it("produces unique ISO-based identifiers", () => {
    const first = makeRunId();
    const second = makeRunId();
    expect(first).not.toBe(second);
    expect(first).toMatch(
      /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}-\d{3}Z-[a-z0-9]{4}$/,
    );
  });
});

describe("writeJson/readJson", () => {
  it("round-trips structured data", async () => {
    const directory = await mkdtemp(join(tmpdir(), "msf-io-"));
    try {
      const path = join(directory, "nested", "result.json");
      const value = { runId: "x", samples: [1, 2, 3] };
      await writeJson(path, value);
      await expect(readJson(path)).resolves.toEqual(value);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
