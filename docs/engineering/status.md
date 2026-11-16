# Engineering status

**Last updated:** 2026-11-16 (package builds + micro evidence)  
**Branch:** `master`

## Summary
M0 architecture/baseline/toolchain-spike deliverables are complete. M1 is in progress with a **tested reactive runtime preview**, a **real compiler (two targets)**, initial **dev tooling preview**, and **MSF runtime integration in micro benchmarks** (sequential committed evidence). An **M2 isomorphic slice** is in place: isomorphic view descriptors, DOM mounting, **SSR hydration**, **function components**, and a **full-stack example** (dev SSR + production prerender + browser-verified hydration). Full compiler/IR pipeline, dev server/HMR for library packages, publishable release flow, and methodology-compliant SSR/bundle/DOM benchmark coverage remain pending.

## Implemented / verified
- **`@msf/runtime`** (33 tests)
  - Core: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
  - Fix: in-run dependency dedupe; O(1) owner dispose via `ownedSlot` (24 µs → ~134 ns signal create+read+dispose on test machine)
  - Guards: runaway-update depth limit (`MSF_REACTIVE_CYCLE`) for nested reactive updates
  - DOM: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`
  - Universal: `@msf/runtime/universal` — isomorphic `h`, `fragment`, `text`, DOM `mount`, `hydrate` (adopts SSR markup, attaches listeners/bindings, fresh-mount fallback on mismatch)
  - Server: `renderToString` (component nodes resolved), `escapeHtml`
- **`@msf/compiler`** (14 tests): `jsx-dom-v1` (DOM runtime calls) and **`jsx-universal-v1`** (isomorphic view descriptors); golden-output and executable-eval tests; diagnostics
- **`@msf/dev`** (2 tests): `compileFile`, `compilePath`, `getDevStatus`, preview CLI
- **`@msf/contracts`**: `Diagnostic`, `CompileRequest.target`, `MSF_CONTRACTS_VERSION`
- **Benchmarks**: `msf-runtime` micro candidate measured with 12 samples / 2 warmups sequentially; raw JSON + report committed (`benchmarks/results/2026-11-16_09-03-34-486Z-li9o.{json,md}`, 2026-11-16); informational only
- **Examples**: `examples/counter-basic` (SSR), `examples/counter-browser` (Vite), **`examples/fullstack`** (SSR + hydration pilot; production prerender + Chromium hydration verified)
- **Package consumption**: `dist` ESM builds with declarations for four workspace packages; `scripts/verify-package.mjs` installs tarballs into a temp consumer, runs runtime smoke + TS consumer typecheck; evidence `benchmarks/evidence/package-verification.json`

## In progress / pending
- Compiler: full IR, semantic analysis/TS adapter, sourcemaps, control flow (`Show`/`For`) lowering, stable lowering; DOM target component support
- Streaming/resume, fuller serialization/actions/router model, M3+ boundaries
- Dev tooling: dev server/HMR, templates, richer diagnostics/build pipeline
- Methodology-compliant SSR/bundle/DOM MSF fixtures and measured runs
- Additional hardening: edge cases, leaks, security boundaries, API stabilization
- Publishing/license remains **approval-gated**

## Verification (this update)
- `pnpm run typecheck` (workspace): **pass**
- `@msf/runtime` tests: **27/27 pass**
- `@msf/compiler` tests: **14/14 pass**
- `@msf/dev` tests: **2/2 pass**
- `@msf/bench-runner` tests: **31/31 pass**
- `pnpm run build`: **pass**
- `pnpm verify:package`: **pass**
- `examples/example-fullstack`: dev SSR HTTP 200; production prerender + `NODE_ENV=production` server HTTP 200; Chromium hydration (zero console errors)

## Known limitations / risks
- Compiler subset constrained; component lowering targets `universal` output by default; no full JSX/TS/component layer yet
- No sourcemaps; isomorphic runtime remains preview (compiler now emits it)
- Keyed `list` multi-root semantics still need documented constraint/tests
- No MSF performance superiority claims; benchmark integration is micro-only for now

## ملخص بالعربية
تم تمكين تجارب MSF حتى في القياس micro مع أدلة موثقة. ما يزال المترجم/خرائط المصدر/أدوات dev/حزم SSR/bundle/DOM قيد المتابعة، ولا توجد ادعاءات تفوق أو نشر (النشر بحاجة موافقة).