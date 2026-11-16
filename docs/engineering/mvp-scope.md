# MVP scope — updated (M1 preview in progress)

## MVP goal
A minimal, correct, evidence-backed vertical slice that proves MSF Fusion's core model end-to-end: **compile a constrained template/component to fine-grained DOM updates**, with SSR output and deterministic client mount for the same subset.

## Progress snapshot
| Area | MVP target | Current state |
|---|---|---|
| Runtime kernel | signals, computed, effects, ownership/disposal, batch | **Implemented (preview)** in `@msf/runtime` with tests |
| DOM renderer | text/attributes/events + keyed updates for supported patterns | **Partial (preview)**: reactive bindings, insert, `list` keyed helper |
| Compiler subset | parse/analyze/IR/lower/codegen + sourcemaps | **Not implemented** (scaffold only) |
| TypeScript-first authoring | typed APIs and component props in subset | **Partial**: runtime APIs typed; compiler diagnostics pending |
| SSR (minimal) | `renderToString` for subset, escaping by default | **Partial (preview)**: `h`/`renderToString` snapshot with escaping; no hydration/isomorphic components |
| Tooling | build integration and diagnostics | **Not implemented** (scaffold/examples use direct/Vite paths) |
| Tests | semantics, disposal/leak checks, compiler goldens, parity | **Partial**: runtime/kernel/DOM/server tests; compiler/parity pending |
| Benchmarks | measure subset vs M0 baselines where equivalent | **Pending** MSF fixtures/integration |

## In scope (MVP)
- **Runtime kernel:** signals, computed values, effects, ownership/disposal, explicit batch API
- **DOM renderer:** create/update/remove text/attributes/events and keyed list operations for supported patterns
- **Compiler subset:** parse supported syntax, build reactive IR, lower to runtime calls, emit readable source maps
- **TypeScript-first authoring:** types for public APIs and component props in supported subset
- **SSR (minimal):** render-to-string for subset, escaping by default, deterministic mount/hydration path (hydration may follow string render once subset stabilizes)
- **Tooling:** build integration (Vite plugin or equivalent), basic diagnostics
- **Tests:** runtime semantics, disposal/leak checks, compiler transform snapshots/goldens, SSR/client parity for subset
- **Benchmarks:** measure subset against M0 baselines where equivalent

## Out of scope (post-MVP unless re-approved)
- Streaming SSR, resumability, advanced partial hydration optimizations
- Router, global state library, forms system, i18n framework
- React/Angular adapters, Web Components compiler target, Python/WASM bridge
- Visual devtools UI, production deployment adapters
- Full JSX/TSX compatibility with React semantics
- Angular/Next.js/Qwik benchmark parity

## MVP acceptance criteria
1. **Correctness:** all kernel and compiler-subset tests pass; no known ownership leaks in supported patterns.
2. **Type safety:** strict typecheck passes; public APIs typed.
3. **Security:** default escaping in SSR/DOM paths; no secret serialization; boundary rules documented.
4. **Performance:** benchmark results recorded with methodology; regressions vs prior MSF measurements investigated (no superiority claim required).
5. **Architecture:** no dependency on React/Angular/Next runtime; clear package boundaries.
6. **Documentation:** getting-started + API docs for supported subset in English with Arabic summaries.

## ملخص بالعربية
نطاق MVP كما هو مع تحديث الحالة: النواة التفاعلية منفذة، وDOM/SSR معاينة جزئية، بينما المترجم والتوحيد isomorphic والأدوات وقياسات MSF ما زالت مطلوبة لإكمال الشريحة الرأسية المقبولة.
