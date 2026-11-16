export type MicroScenarioId =
  | "create-read-100k"
  | "unobserved-write-1m"
  | "computed-chain-64x20k"
  | "diamond-fanout-64x20k"
  | "dynamic-deps-50k"
  | "effect-fanout-512x200"
  | "effect-mount-dispose-10k";

export interface MicroScenario {
  id: MicroScenarioId;
  units: number;
  unitLabel: string;
  description: string;
}

export const MICRO_SCENARIOS: readonly MicroScenario[] = [
  {
    id: "create-read-100k",
    units: 100_000,
    unitLabel: "signal create+read",
    description:
      "Create 100,000 independent signals and read each value once.",
  },
  {
    id: "unobserved-write-1m",
    units: 1_000_000,
    unitLabel: "write",
    description:
      "Write one signal 1,000,000 times with no subscribers; measures setter overhead.",
  },
  {
    id: "computed-chain-64x20k",
    units: 20_000,
    unitLabel: "root update + tail read",
    description:
      "A 64-link computed chain; update the root and read the tail 20,000 times.",
  },
  {
    id: "diamond-fanout-64x20k",
    units: 20_000,
    unitLabel: "root update + sink read",
    description:
      "One source fans out to 64 computeds merged by a final computed; 20,000 updates.",
  },
  {
    id: "dynamic-deps-50k",
    units: 50_000,
    unitLabel: "conditional read",
    description:
      "Toggle a conditional dependency, read the derived value, and update both active and inactive sources.",
  },
  {
    id: "effect-fanout-512x200",
    units: 512 * 200,
    unitLabel: "effect execution",
    description:
      "512 synchronous effects observe one signal; the signal is written 200 times.",
  },
  {
    id: "effect-mount-dispose-10k",
    units: 10_000,
    unitLabel: "effect mount+dispose",
    description:
      "Create and dispose 10,000 effects, each observing its own signal.",
  },
];

export interface PreparedMicroScenario {
  run(): number;
  dispose?(): void;
}

export interface MicroCandidate {
  id: string;
  packageName: string;
  notes: string;
  /**
   * Scenarios omitted for this candidate because a semantically equivalent
   * operation cannot be constructed with its public API in this environment.
   */
  skip?: Partial<Record<MicroScenarioId, string>>;
  prepare(id: MicroScenarioId): PreparedMicroScenario;
}

export interface MicroSample {
  candidate: string;
  scenario: MicroScenarioId;
  nsPerOp: Record<string, number>;
}
