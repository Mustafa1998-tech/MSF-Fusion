# Benchmark methodology — MSF Fusion baselines

> **Scope:** reproducible baseline competitor measurements (M0) plus measurement rules for MSF Fusion. A developer-preview MSF runtime is now **included in the micro and SSR suites** (`msf-runtime` micro candidate; MSF SSR-preview fixture in the SSR suite) and its results are informational preview measurements only — **no superiority claims**. Historical M0 result files/reports are preserved intact as evidence.

## Purpose
This laboratory establishes reproducible baselines for selected competitors so Milestone 1+ can compare MSF Fusion against measured evidence, not intuition. Results are inputs to architecture decisions; they are not a universal ranking.

## Categories
| Category | Status in Milestone 0 | Output |
|---|---|---|
| Reactivity microbenchmarks | Implemented | `micro` suite |
| Server-side rendering | Implemented (single render call) | `ssr` suite |
| Production bundle size / build time | Implemented | `bundle` suite |
| Browser DOM operations / startup / heap snapshot | Implemented | `dom` suite |
| Memory / GC behavior | Partial (CDP heap snapshots after create/clear) | `dom` suite memory fields |
| Security-related runtime checks | Not implemented | documented as excluded |
| Real-world scenarios | Not implemented | documented as excluded |
| Compatibility (npm, adapters, Python/WASM bridge) | Not implemented | design docs only |

## Environment capture (recorded in every JSON run)
- Date/time (ISO 8601), timezone
- OS, OS version, architecture, CPU model, logical CPU count, total RAM
- Node.js, pnpm, Vite, Vitest, Playwright, TypeScript, framework versions (resolved from installed `node_modules`)
- Browser name/version/user agent (DOM runs)
- Git commit and dirty state
- Windows power scheme when available

## Execution rules
- **Pinned dependencies:** exact versions in `benchmarks/runner/package.json` and lockfile. Report uses installed package versions.
- **Production builds:** bundle and DOM fixtures are built with Vite in production mode (`minify: "oxc"` in Vite 8). No dev server measurements.
- **Warm-up:** discarded warm-up runs before sampling (suite-specific defaults/flags).
- **Repeated samples:** raw samples preserved in JSON; median, P95, mean, stddev, CV, MAD reported.
- **Sequential runs:** suites must be run one at a time in a single process for comparable results. Do not run CPU-bound suites concurrently.
- **No composite score:** numbers are reported per scenario; no weighted total.
- **Validation:** fixtures export equivalent behavior and the runner verifies DOM/SSR structure before timing.

## Statistics
- **Median:** 50th percentile, linear interpolation (R-7).
- **P95:** 95th percentile (R-7).
- **CV:** sample coefficient of variation (`stddev / mean * 100`). > ~10% indicates instability on this machine.
- **MAD:** median absolute deviation from the median.
- **Ops/s:** `1 / median` convenience value, never a ranking score.

## Fairness and exclusions
- Compare semantically equivalent operations where possible; document when APIs differ.
- Angular is excluded from standalone signal microbenchmarks: signals require DI/injector context and are not a standalone primitive package in the same way.
- React has no comparable standalone signal primitive; React is measured in DOM/SSR/bundle suites, not micro signal benchmarks.
- Solid microbenchmarks use the **client runtime** (`solid-js/dist/solid.js`) because the Node package entry is not reactive. Solid effect scenarios that require a render flush are skipped and recorded as exclusions.
- Next.js, Angular full app, Qwik resumability, streaming SSR, hydration, and long-running memory-leak scenarios are out of scope for Milestone 0 and must not be claimed.

## Known limitations
- `frameMs` in DOM suite includes two `requestAnimationFrame` waits, creating a fixed scheduling floor (~16–34 ms). Small sync differences can be masked; interpret together with `syncMs`.
- Single-machine, single-time measurements. Desktop background load, thermal state, and power plan affect variance.
- Memory values are CDP garbage-collected heap snapshots after specific operations; they are not proof of absence of leaks.
- Preliminary/smoke runs in `benchmarks/results` may exist during development but must be deleted before a final baseline is cited.

## Reproduction
```bash
pnpm install --frozen-lockfile
pnpm --filter @msf/bench-runner run typecheck
pnpm --filter @msf/bench-runner run test
# Run sequentially:
node --expose-gc benchmarks/runner/src/cli.ts micro --samples 12 --warmup 2
node --expose-gc benchmarks/runner/src/cli.ts ssr --samples 12 --warmup 2
node --expose-gc benchmarks/runner/src/cli.ts bundle
node --expose-gc benchmarks/runner/src/cli.ts dom --samples 10 --warmup 2
node benchmarks/runner/src/cli.ts report
```
Raw JSON and markdown reports are written under `benchmarks/results/` and `benchmarks/reports/`.

## ملخص بالعربية
تحدد هذه الوثيقة منهجية قياس خط الأساس والمقارنات المستقبلية: إصدارات مثبتة، بناء إنتاجي، إحماء، عينات متكررة، حفظ النتائج الخام، ووسيط/P95/CV/MAD بدون درجة مركبة. توجد حالياً نتائج أساس للمنافسين فقط؛ معاينة MSF runtime متاحة لكن لم تُدمج بعد في قياسات مكافئة ولا توجد ادعاءات أداء لـ MSF Fusion.
