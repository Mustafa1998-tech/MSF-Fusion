# Performance requirements — Milestone 0

## Principles
- **Measure, don't guess:** every performance claim must reference reproducible runs (environment, versions, samples, raw data).
- **No global score:** report per-scenario metrics; trade-offs are explicit.
- **Correctness first:** unsafe optimizations or semantic changes for speed are rejected.
- **Regression-aware:** future changes affecting hot paths must include before/after evidence.

## Target performance dimensions (future implementation gates)
| Dimension | Requirement |
|---|---|
| Fine-grained updates | Targeted propagation without unnecessary component-wide rerenders; validated by micro + DOM scenarios |
| Bundle size | Competitive production output for equivalent functionality; track JS/CSS/gzip/brotli |
| Build/compile time | Incremental-friendly pipeline; report build and compiler timings separately |
| SSR throughput/latency | Measured render/stream performance with equivalent markup and validation |
| Startup/hydration | Measurable startup marks and interaction readiness; avoid eager work where resumability/partial hydration is chosen |
| Memory | No ownership/disposal leaks; bounded growth under repeated create/update/destroy |
| GC pressure | Avoid pathological allocation patterns in hot paths; investigate with profiles when anomalies appear |

## Evidence status
- **M0 baseline (complete):** competitor measurements for micro, SSR, bundle, DOM, and coarse heap snapshots (see `benchmarks/results/`, `benchmarks/reports/`, `benchmarks/methodology.md`).
- Toolchain feasibility (not a perf benchmark): `benchmarks/evidence/compiler-toolchain.json`.
- **M1 (in progress):** runtime preview exists but MSF Fusion framework fixtures/measurements are not yet integrated into the benchmark runner. **No MSF Fusion performance numbers or superiority claims exist yet.**

## Budgeting policy (to be set at Milestone 1 planning)
- Define scenario-specific budgets relative to approved baselines and product goals.
- Any "faster than X" claim requires same-machine methodology, equivalent scenario, and statistical reporting.

## ملخص بالعربية
تتطلب الأداء أدلة قابلة لإعادة الإنتاج لكل سيناريو دون درجة موحدة، مع بوابات مستقبلية للتحديثات الدقيقة والحزم والبناء وSSR والذاكرة، ولا توجد أرقام لأداء MSF Fusion في المرحلة 0.
