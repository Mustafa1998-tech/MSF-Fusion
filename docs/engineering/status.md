# Engineering status — Milestone 1 (developer preview)

**Last updated:** 2026-11-16  
**Branch:** `master` (includes runtime preview, DOM/SSR helpers, examples, docs)

## Summary
M0 architecture/baseline/toolchain-spike deliverables are complete. M1 is in progress with a **real, tested reactive runtime preview** and initial DOM/SSR capabilities. Compiler/IR/codegen, hydration/isomorphic rendering, dev tooling/CLI, publishable builds, and MSF benchmark integration remain pending.

## Implemented
- **`@msf/runtime`**
  - Core: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
  - DOM: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list` (keyed/non-keyed helpers), `For` convenience wrapper
  - Server: `h`, `renderNode`, `renderToString`, `escapeHtml`
  - Tests: `packages/runtime/test/{kernel,dom,server}.test.ts` (**20 passing**)
- **`@msf/contracts`**: scaffold interfaces (`Diagnostic`, `CompileRequest/Result`)
- **`@msf/compiler`**: scaffold (returns not-implemented diagnostic)
- **`@msf/dev`**: scaffold (status only)
- **Examples:** `examples/counter-basic` (SSR runnable), `examples/counter-browser` (Vite build/dev)
- **Benchmarks:** competitor baseline lab and final evidence remain valid (`2026-11-16_06-39-52-525Z-5om9`)

## Not implemented yet
- Compiler parsing/analysis/IR/lowering/codegen, JSX subset, diagnostics, sourcemaps
- Isomorphic component model and hydration
- Dev server, HMR, CLI workflows (`dev/build/check/preview/create`)
- Router, data/actions framework layer
- `dist` builds/types/conditional exports for npm consumption
- MSF fixtures in benchmark runner and MSF performance measurements

## Known issues / review findings (priority)
- **P0:** prevent duplicate source tracking within a single computation run; document/test setter semantics for function values
- **P1:** unify DOM/SSR rendering model; strengthen keyed list semantics (multi-root support/constraints) and add reconciliation tests
- **P1:** add package build pipeline and consumption checks
- **P2:** cycle detection/dev diagnostics, effect dedupe optimizations, stress/leak evidence

## Verification (latest known)
- `pnpm run typecheck`: passing (workspace)
- `@msf/runtime` tests: **20/20 passing**
- `@msf/bench-runner` tests: **31/31 passing** (M0)
- `@msf/spike-compiler-toolchain` tests: **4/4 passing** (M0)
- `examples/counter-browser` build: passing

## ملخص بالعربية
الحالة: معاينة M1 قيد التنفيذ بنواة تفاعلية وDOM/SSR وأمثلة واختبارات ناجحة؛ المتبقي الرئيسي هو المترجم/IR، التوحيد isomorphic والترطيب، أدوات المطوّر، بناء الحزم للنشر، وقياسات MSF. توجد ملاحظات تحسين ذات أولوية في تتبع الاعتماديات وتوحيد نموذج العرض.
