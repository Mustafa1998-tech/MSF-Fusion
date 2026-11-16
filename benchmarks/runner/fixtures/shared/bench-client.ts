/**
 * Shared client-side benchmark contract.
 *
 * Every framework fixture must expose exactly this API so the Playwright
 * runner measures the same user-visible operations. The API is deliberately
 * small: preparation is unmeasured, `run` is measured, and both return only
 * after two animation frames so framework-scheduled work is included.
 */

export interface Row {
  id: number;
  label: string;
}

export type ScenarioId =
  | "create-1000"
  | "create-10000"
  | "update-all-1000"
  | "update-one-1000"
  | "swap-1000"
  | "remove-one-1000"
  | "clear-1000"
  | "replace-1000";

export interface Scenario {
  prepare?: () => void | Promise<void>;
  run: () => void;
}

export interface RunTiming {
  /** State update + all framework work completed synchronously. */
  syncMs: number;
  /** State update through two animation frames, including paint scheduling. */
  frameMs: number;
}

export interface BenchInspection {
  rowCount: number;
  firstId: number | null;
  secondId: number | null;
  penultimateId: number | null;
  lastId: number | null;
  firstLabel: string | null;
  row500Label: string | null;
  lastLabel: string | null;
}

export interface BenchApi {
  ready: true;
  scenarios: ScenarioId[];
  prepare(name: ScenarioId): Promise<void>;
  run(name: ScenarioId): Promise<RunTiming>;
  inspect(): BenchInspection;
}

declare global {
  interface Window {
    __bench?: BenchApi;
  }
}

export function makeRows(count: number, revision = 0): Row[] {
  const rows = new Array<Row>(count);
  for (let i = 0; i < count; i += 1) {
    rows[i] = { id: i, label: `row-${i}-r${revision}` };
  }
  return rows;
}

export function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function inspectRows(): BenchInspection {
  const nodes = document.querySelectorAll<HTMLTableRowElement>("tbody tr[data-row]");
  const first = nodes.item(0);
  const second = nodes.item(1);
  const penultimate = nodes.item(Math.max(0, nodes.length - 2));
  const last = nodes.item(nodes.length - 1);
  const firstId = first?.dataset["row"];
  const secondId = second?.dataset["row"];
  const penultimateId = penultimate?.dataset["row"];
  const lastId = last?.dataset["row"];
  const row500 = document.querySelector<HTMLTableRowElement>(
    'tbody tr[data-row="500"]',
  );
  const firstLabel = first?.querySelector(".label")?.textContent ?? null;
  const row500Label = row500?.querySelector(".label")?.textContent ?? null;
  const lastLabel = last?.querySelector(".label")?.textContent ?? null;
  return {
    rowCount: nodes.length,
    firstId: firstId === undefined ? null : Number(firstId),
    secondId: secondId === undefined ? null : Number(secondId),
    penultimateId: penultimateId === undefined ? null : Number(penultimateId),
    lastId: lastId === undefined ? null : Number(lastId),
    firstLabel,
    row500Label,
    lastLabel,
  };
}

export function installBench(scenarios: Record<ScenarioId, Scenario>): void {
  const ids = Object.keys(scenarios) as ScenarioId[];
  window.__bench = {
    ready: true,
    scenarios: ids,
    async prepare(name) {
      const scenario = scenarios[name];
      if (!scenario) throw new Error(`Unknown scenario: ${name}`);
      await scenario.prepare?.();
      await nextPaint();
    },
    async run(name) {
      const scenario = scenarios[name];
      if (!scenario) throw new Error(`Unknown scenario: ${name}`);
      const syncStart = performance.now();
      scenario.run();
      const syncEnd = performance.now();
      await nextPaint();
      const frameEnd = performance.now();
      return { syncMs: syncEnd - syncStart, frameMs: frameEnd - syncStart };
    },
    inspect: inspectRows,
  };
  performance.mark("msf-bench-ready");
}
