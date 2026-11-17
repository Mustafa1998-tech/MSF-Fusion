# Roadmap

> M1 implementation is in progress under the approved direction. Scope and sequencing may be adjusted based on evidence.

## M0 — Architecture, baseline, feasibility ✅ Completed
- Architecture docs/ADRs, security/performance constraints, risks/gates
- Benchmark lab + competitor baselines + methodology + final sequential baseline evidence
- Compiler toolchain spike and evidence
- **Exit:** approved direction to proceed with M1

## M1 — Reactive kernel + minimal compiler slice 🚧 In progress
**Completed so far (tested)**
- Package scaffolding: `@msf/contracts`, `@msf/runtime`, `@msf/compiler`, `@msf/dev`
- Reactive kernel: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, ownership/disposal; dependency-tracking fix (in-run dedupe) and tests
- DOM helpers preview: `render`, `insert`, reactive text/attrs/props/events, `list` with keyed reconciliation
- SSR string renderer preview: `h`, `renderToString`, HTML escaping
- Compiler subset v1 (real): `jsx-dom-v1` intrinsic JSX/TSX transform to DOM runtime calls with diagnostics
- Dev tooling preview: compile APIs/CLI (`compileFile`, `compilePath`, `status`)
- MSF runtime micro-benchmark candidate integrated in runner (smoke-verified)
- Runtime/compiler/dev tests and runnable examples (`counter-basic`, `counter-browser`)

**Remaining**
- Broader compiler/IR, sourcemaps, semantic diagnostics, component/control-flow support
- Unified component/isomorphic model and hydration
- MSF benchmark fixtures + measurements for micro/SSR/bundle/DOM — **committed evidence** (see `benchmarks/results/`)
- Publishable package builds (`dist`/types/exports), dev server/HMR, fuller CLI
- Additional hardening (edge cases, leaks, security boundaries)

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
- npm publish only with explicit owner approval (license: MIT)

## ملخص بالعربية
M0 مكتملة، وM1 قيد التنفيذ (نواة تفاعلية وDOM/SSR معاينة وأمثلة واختبارات منجزة؛ المتبقي: المترجم/IR، توحيد النموذج، قياسات MSF، أدوات المطوّر، وتجهيز الحزم). المراحل M2–M5 مخططة بحسب الأدلة والاعتمادات.
