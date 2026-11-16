export interface Summary {
  count: number;
  min: number;
  median: number;
  p95: number;
  max: number;
  mean: number;
  stdDev: number;
  cvPct: number;
  mad: number;
}

/**
 * R-7 (linear interpolation) quantile, matching the default used by many
 * statistical tools. Kept explicit so results are reproducible across
 * runtimes and do not depend on a third-party statistics package.
 */
export function quantile(sortedAscending: readonly number[], q: number): number {
  if (sortedAscending.length === 0) {
    throw new Error("quantile requires at least one sample");
  }
  if (q < 0 || q > 1) {
    throw new Error(`quantile must be between 0 and 1, received ${q}`);
  }
  const position = (sortedAscending.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const lowerValue = sortedAscending[lower]!;
  const upperValue = sortedAscending[upper]!;
  if (lower === upper) return lowerValue;
  return lowerValue + (upperValue - lowerValue) * (position - lower);
}

export function summarize(samples: readonly number[]): Summary {
  if (samples.length === 0) {
    throw new Error("summarize requires at least one sample");
  }
  if (samples.some((value) => !Number.isFinite(value))) {
    throw new Error("summarize received a non-finite sample");
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const count = sorted.length;
  const mean = sorted.reduce((total, value) => total + value, 0) / count;
  const variance =
    count === 1
      ? 0
      : sorted.reduce((total, value) => total + (value - mean) ** 2, 0) /
        (count - 1);
  const stdDev = Math.sqrt(variance);
  const median = quantile(sorted, 0.5);
  const deviations = sorted
    .map((value) => Math.abs(value - median))
    .sort((a, b) => a - b);
  return {
    count,
    min: sorted[0]!,
    median,
    p95: quantile(sorted, 0.95),
    max: sorted[count - 1]!,
    mean,
    stdDev,
    cvPct: mean === 0 ? 0 : (stdDev / mean) * 100,
    mad: quantile(deviations, 0.5),
  };
}

export function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KiB", "MiB", "GiB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}
