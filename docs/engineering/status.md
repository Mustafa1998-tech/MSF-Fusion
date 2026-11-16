# Engineering status

**Last updated:** 2026-11-16 (M2 isomorphic/hydration slice)  
**Branch:** `master`

## Summary
M0 architecture/baseline/toolchain-spike deliverables are complete. M1 is in progress with a **tested reactive runtime preview**, a **real compiler JSX subset (v1)**, initial **dev tooling preview**, and **MSF runtime integration in micro benchmarks**. An **M2 isomorphic slice** is now in place: isomorphic view descriptors, DOM mounting, **SSR hydration**, and **function components** (`h(Component, props, children)`) resolved by SSR/mount/hydrate, with tests and a **full-stack example** (dev SSR + production prerender + browser-verified hydration). Full compiler/IR pipeline (component/control-flow/lowering to the view layer), dev server/HMR for library packages, publishable release flow, and comprehensive benchmark coverage remain pending.

## Implemented / verified
- **`@msf/runtime`** (27 tests)
  - Core: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
  - Fix: dependency tracking dedupes repeated reads within a single computation run
  - DOM: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`
  - Server: `renderToString`, `escapeHtml`
  - Universal: `@msf/runtime/universal` — isomorphic `h`, `fragment`, `text`, DOM `mount`, and `hydrate` (adopts SSR markup, attaches listeners/reactive bindings, falls back to fresh mount on mismatch)
- **`@msf/compiler`** (14 tests): real `jsx-dom-v1` subset compiler to DOM runtime calls with diagnostics, plus `jsx-universal-v1` target emitting isomorphic view descriptors for the same subset (executable golden tests)
- **`@msf/dev`** (2 tests): `compileFile`, `compilePath`, `getDevStatus`, CLI
- **`@msf/contracts`**: shared compile/diagnostic contracts (including `meta`)
- **Benchmarks**: `@msf/bench-runner` includes `msf-runtime` micro candidate (smoke-verified)
- **Examples**: `examples/counter-basic` (SSR), `examples/counter-browser` (Vite), **`examples/fullstack`** (SSR + hydration pilot; production static prerender tested end-to-end in Chromium)

## In progress / pending
- Compiler: fuller IR, semantic analysis/TS adapter, sourcemaps, component/control-flow/JSX coverage, stable lowering
- Streaming/resume, fuller serialization/actions/router model, M3+ boundaries
- Dev tooling: dev server/HMR for library packages, templates, richer diagnostics/build pipeline
- Package builds (`dist`, declarations, conditional exports) and consumption hardening
- MSF fixtures for SSR/bundle/DOM benchmarks and methodology-compliant measured runs
- Additional hardening: edge cases, leaks, security boundaries, API stabilization

## Verification (this update)
- `pnpm run typecheck`: **pass** (workspace)
- `@msf/runtime` tests: **24/24 pass**
- `@msf/compiler` tests: **4/4 pass**
- `@msf/dev` tests: **2/2 pass**
- `@msf/bench-runner` tests: **31/31 pass**
- `@msf/spike-compiler-toolchain` tests: **4/4 pass**
- `@msf/example-counter-browser` build: **pass**
- `@msf/example-fullstack`: SSR dev route (HTTP 200), production prerender + `NODE_ENV=production` server (HTTP 200), hydration click-through in Chromium with **zero console errors**
- `node --expose-gc benchmarks/runner/src/cli.ts micro --samples 1 --warmup 0`: **pass**

## Known limitations / risks
- Compiler subset is intentionally constrained; no components, control flow, fragments or full JSX/TS coverage in the compiler path
- No sourcemaps; isomorphic view runtime is preview (not the compiler output yet)
- Runtime setter function-value semantics and DOM keyed multi-root behavior still need further hardening/tests
- No MSF performance superiority claims; benchmark integration is partial

## ملخص بالعربية
تم إضافة شريحة isomorphic/hydration في المعاينة واختبارها (توسيع `@msf/runtime/universal` مع mount/hydrate واختبار المتصفح للتطبيق full-stack). ما يزال المترجم/خرائط المصدر النموذج الموحد الكامل وأدوات dev وحزمة القياسات الشاملة M2+ قيد التنفيذ وفق الأدلة.