import { describe, expect, it } from "vitest";
import { formatBytes, quantile, summarize } from "../src/stats.ts";

describe("quantile", () => {
  it("uses linear interpolation (R-7)", () => {
    expect(quantile([1, 2, 3, 4, 5], 0.5)).toBe(3);
    expect(quantile([1, 2, 3, 4, 5], 0.95)).toBeCloseTo(4.8, 12);
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(quantile([42], 0.95)).toBe(42);
  });

  it("rejects empty or out-of-range input", () => {
    expect(() => quantile([], 0.5)).toThrow(/at least one/);
    expect(() => quantile([1], 1.1)).toThrow(/between 0 and 1/);
  });
});

describe("summarize", () => {
  it("computes median, p95, CV and MAD", () => {
    const summary = summarize([10, 12, 11, 13, 12, 11, 12]);
    expect(summary.count).toBe(7);
    expect(summary.median).toBe(12);
    expect(summary.min).toBe(10);
    expect(summary.max).toBe(13);
    expect(summary.cvPct).toBeGreaterThan(0);
    expect(summary.mad).toBe(1);
  });

  it("handles a constant series without dividing by zero", () => {
    const summary = summarize([5, 5, 5, 5]);
    expect(summary.median).toBe(5);
    expect(summary.stdDev).toBe(0);
    expect(summary.cvPct).toBe(0);
    expect(summary.p95).toBe(5);
  });

  it("rejects non-finite samples", () => {
    expect(() => summarize([1, Number.NaN])).toThrow(/non-finite/);
    expect(() => summarize([Number.POSITIVE_INFINITY])).toThrow(/non-finite/);
  });
});

describe("formatBytes", () => {
  it("formats binary units", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.00 KiB");
    expect(formatBytes(1024 * 1024 * 1.5)).toBe("1.50 MiB");
  });
});
