# Engineering status

**Last updated:** 2026-11-16 (all benchmark suites integrated)
**Branch:** `master`

## Summary
MSF Fusion is **publishable (v0.1.0)** — packages are prepared for npm (`private: true` removed, `dist` ESM + d.ts, installable tarballs, consumer verification passing). It is **not npm-published yet** because the operator machine needs `npm login`; GitHub is the primary distribution channel. Functionality is a working developer preview: fine-grained reactivity, SSR/hydration, function components, benchmarks in all four suites, real examples, limited JSX compiler subset. See [production-readiness checklist](../production-readiness.md) for what is and isn't production-ready.

## Implemented / verified
- **`@msf/runtime`** (37 tests)
  - Core: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
  - Fix: in-run dependency dedupe; O(1) owner dispose via `ownedSlot`
  - Guards: runaway-update depth limit (`MSF_REACTIVE_CYCLE`) for nested reactive updates
  - DOM: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list` (multi-root keyed), `For`
  - Universal: `@msf/runtime/universal` — isomorphic `h`, `fragment`, `text`, DOM `mount`, `hydrate` (adopts SSR markup, binds reactive bindings, fresh-mount fallback on mismatch)
  - Server: `renderToString` (component nodes resolved), `escapeHtml`
- **`@msf/compiler`** (14 tests): `jsx-dom-v1` (DOM runtime calls) and **`jsx-universal-v1`** (isomorphic view descriptors); golden-output and executable-eval tests; diagnostics
- **`@msf/dev`** (6 tests): `compileFile`, `compilePath`, `checkFile`, `checkPath`, preview CLI (`check`, `status`)
- **`@msf/contracts`**: `Diagnostic`, `CompileRequest.target`, `MSF_CONTRACTS_VERSION`
- **Benchmarks:** MSF runtime preview measured in all four suites, sequential, committed evidence:
  - `micro` — `benchmarks/results/2026-11-16_09-03-34-486Z-li9o.{json,md}` (12 samples; informational)
  - `ssr`   — `benchmarks/results/2026-11-16_09-37-02-734Z-arcv.{json,md}` (12 samples; informational)
  - `bundle` — `benchmarks/results/2026-11-16_11-43-37-434Z-wlh8.{json,md}` (46.1 ms build; 8.81 KiB raw / 3.09 KiB brotli)
  - `dom`    — `benchmarks/results/2026-11-16_09-50-15-877Z-jjuo.{json,md}` (Chromium validated rows; informational)
- **Examples:** `examples/counter-basic`, `examples/counter-browser`, **`examples/fullstack`** (SSR + hydration), **`examples/dashboard`** (Ops Board — SSR + signal-driven filter)
- **Package consumption:** `dist` ESM builds with declarations; `scripts/verify-package.mjs` packs packages, installs into a temp consumer, runs smoke + TS typecheck; evidence `benchmarks/evidence/package-verification.json`

## In progress / pending
- Compiler: full IR, semantic analysis/TS adapter, sourcemaps, control flow lowering, stable lowering; DOM target component support
- Streaming/resume, fuller serialization/actions/router model, M3+ boundaries
- Dev tooling: dev server/HMR, templates, richer diagnostics/build pipeline
- MSF benchmark coverage: SSR/bundle/DOM already committed; long-running/memory leak, streaming, async boundaries remain future work
- Additional hardening: edge cases, leaks, security boundaries, API stabilization
- Publishing/release requires explicit owner approval (license: MIT; GitHub distribution is allowed; npm not published yet)

## Verification (this update)
- `pnpm run typecheck` (workspace): **pass**
- `@msf/runtime` tests: **37/37 pass**
- `@msf/compiler` tests: **14/14 pass**
- `@msf/dev` tests: **6/6 pass**
- `@msf/bench-runner` tests: **31/31 pass**
- `pnpm run build`: **pass**
- `pnpm verify:package`: **pass**
- `examples/*`: fullstack + dashboard SSR/hydration verified in Chromium (zero console errors)

## Known limitations / risks
- Compiler subset constrained; component lowering targets `universal` output by default; no full JSX/TS/component layer yet
- No sourcemaps; isomorphic runtime remains preview (compiler now emits it)
- `list()` keyed multi-root supported; hydration still preview (framework falls back to fresh mount on mismatch)
- No MSF performance superiority claims; benchmarks are informational preview measurements on a single machine

## ملخص بالعربية
تقدّم M1/M2: نواة تعمل مع اختبارات، مترجم بـهدفين (dom/universal)، hydration تعمل مع مثالين حقيقيين، وقياسات MSF في micro/SSR/bundle/DOM. المتبقي: compiler IR كامل، dev server/HMR، نشر npm (بحاجة موافقة صريحة)، ولا توجد ادعاءات تفوق.