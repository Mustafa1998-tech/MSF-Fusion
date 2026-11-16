# Engineering status

**Last updated:** 2026-11-16 (M1 progress update)  
**Branch:** `master`

## Summary
M0 architecture/baseline/toolchain-spike deliverables are complete. M1 is in progress with a **tested reactive runtime preview**, a **real compiler JSX subset (v1)**, initial **dev tooling preview**, and **MSF runtime integration in micro benchmarks**. Full compiler/IR pipeline, hydration/isomorphic rendering, dev server/HMR, publishable builds, and broader M2+ capabilities remain pending.

## Implemented / verified
- **`@msf/runtime`** (21 tests)
  - Core: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
  - Fix: dependency tracking now dedupes repeated reads within a single computation run (including non-consecutive reads)
  - DOM: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`
  - Server: `h`, `renderNode`, `renderToString`, `escapeHtml`
- **`@msf/compiler`** (4 tests)
  - Real `jsx-dom-v1` subset compiler: transforms intrinsic JSX/TSX (elements, text/expr children, static/dynamic attrs, basic event props) into DOM runtime helper calls with diagnostics for unsupported cases
  - Non-JSX passthrough
- **`@msf/dev`** (2 tests)
  - Preview APIs/CLI: `compileFile`, `compilePath`, `getDevStatus`, `node packages/dev/src/cli.ts compile|status`
- **`@msf/contracts`**: shared compile/diagnostic contracts (including `meta`)
- **Benchmarks**
  - `@msf/bench-runner` includes `msf-runtime` micro candidate (`@msf/runtime`) for supported scenarios (smoke-verified)
  - Existing competitor baseline evidence retained
- **Examples:** `examples/counter-basic` (SSR), `examples/counter-browser` (Vite build)

## In progress / pending
- Compiler: fuller IR, semantic analysis/TS adapter, sourcemaps, component/control-flow/JSX coverage, stable lowering
- Isomorphic model and hydration (SSR snapshot exists; no hydration/resume)
- Dev tooling: dev server, HMR, project templates, richer diagnostics/build pipeline
- Package builds (`dist`, declarations, conditional exports) and consumption hardening
- MSF fixtures for SSR/bundle/DOM benchmarks and methodology-compliant measured runs
- M2+: routing, data/actions boundaries, streaming/resume, adapters/compatibility, security hardening, perf tuning

## Verification (this update)
- `pnpm run typecheck`: **pass** (workspace)
- `@msf/runtime` tests: **21/21 pass**
- `@msf/compiler` tests: **4/4 pass**
- `@msf/dev` tests: **2/2 pass**
- `@msf/bench-runner` tests: **31/31 pass**
- `@msf/spike-compiler-toolchain` tests: **4/4 pass**
- `@msf/example-counter-browser` build: **pass**
- `node --expose-gc benchmarks/runner/src/cli.ts micro --samples 1 --warmup 0`: **pass** (MSF candidate smoke; artifacts not committed)

## Known limitations / risks
- Compiler subset is intentionally constrained; not all JSX/TS/component patterns supported
- No sourcemaps, no full static reactivity analysis, no hydration
- Runtime setter function-value semantics and DOM keyed multi-root behavior still need further hardening/tests
- No MSF performance superiority claims; benchmark integration is partial

## ملخص بالعربية
تم إحراز تقدم ملموس في M1 واختباره: إصلاح تتبع الاعتماديات في النواة، مترجم JSX فرعي فعلي (`jsx-dom-v1`)، أدوات dev معاينة، ودمج مرشح MSF في اختبارات micro (smoke). ما يزال الترطيب والنموذج الموحد وIR/خرائط المصدر كاملة وأدوات dev المتقدمة وقياسات MSF الشاملة وبنود M2+ قيد التنفيذ/التخطيط.