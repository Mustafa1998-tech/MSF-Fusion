# Roadmap

> M1 implementation is in progress under the approved direction. Scope and sequencing may be adjusted based on evidence.

## M0 — Architecture, baseline, feasibility ✅ Completed
- Architecture docs/ADRs, security/performance constraints, risks/gates
- Benchmark lab + competitor baselines + methodology + final sequential baseline evidence
- Compiler toolchain spike and evidence
- **Exit:** approved direction to proceed with M1

## M1 — Reactive kernel + minimal compiler slice 🚧 In progress
**Completed so far**
- Package scaffolding: `@msf/contracts`, `@msf/runtime`, `@msf/compiler` (scaffold), `@msf/dev` (scaffold)
- Reactive kernel (real): `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, ownership/disposal
- DOM helpers preview: `render`, `insert`, reactive text/attrs/props/events, `list` with keyed reconciliation
- SSR string renderer preview: `h`, `renderToString`, HTML escaping
- Runtime tests (kernel/DOM/server) and runnable examples (`counter-basic`, `counter-browser`)

**Remaining**
- Compiler subset: JSX/authoring subset, reactive IR, lowering/codegen, diagnostics, sourcemaps (WP4)
- Unified component/isomorphic model and stronger DOM control-flow primitives
- MSF benchmark fixtures + measurements in runner for supported scenarios (WP5)
- Publishable package builds (`dist`/types/exports) and dev tooling/CLI baseline
- Documentation/API stabilization for preview

## M2 — Component model, SSR, hydration baseline 📋 Planned
- Props/children/context/refs/events, robust control flow primitives
- Isomorphic render + deterministic hydration for supported subset
- Security: escaping/serialization boundaries enforced
- Evidence: parity tests, updated benchmarks

## M3 — Full-stack boundaries and DX 📋 Planned
- Server/client/shared module boundaries, actions/endpoints contracts, validation hooks
- Dev server/HMR integration, diagnostics, source maps
- Evidence: integration tests, build time/size tracking

## M4 — Compatibility and ecosystem (evidence-gated) 📋 Planned
- Web Components interop, React/Angular adapter experiments (separate packages)
- npm ESM/CJS packaging matrix
- Python bridge/WASM design spike → implementation only if justified

## M5 — Hardening and pre-release 📋 Planned
- Streaming/resume evaluation, perf tuning, fuzz/property tests, security review
- Documentation bilingual completion, migration guides
- Release only with explicit approval (including license/publishing)

## ملخص بالعربية
M0 مكتملة، وM1 قيد التنفيذ (نواة تفاعلية وDOM/SSR معاينة وأمثلة واختبارات منجزة؛ المتبقي: المترجم/IR، توحيد النموذج، قياسات MSF، أدوات المطوّر، وتجهيز الحزم). المراحل M2–M5 مخططة بحسب الأدلة والاعتمادات.
