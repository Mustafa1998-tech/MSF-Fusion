# Roadmap — proposed

> All milestones after M0 require explicit approval. Scope may be reduced based on evidence.

## M0 — Architecture, baseline, feasibility (current)
- Architecture docs/ADRs, security/performance constraints, risks/gates
- Benchmark lab + competitor baselines + methodology
- Compiler toolchain spike and evidence
- **Exit:** approval to implement M1

## M1 — Reactive kernel + minimal compiler slice (proposed)
- Packages: shared contracts, runtime kernel (signal/computed/effect/owner), minimal compiler transform for a constrained component/template subset
- DOM mounting/updating for benchmark-equivalent cases
- Tests: semantics, disposal, scheduler, compiler golden outputs
- Evidence: micro-kernel benchmarks vs M0 baselines (no superiority claim without data)

## M2 — Component model, SSR, hydration baseline
- Props/children/refs/events, control flow primitives
- SSR render-to-string + deterministic client mount/hydration for M1 subset
- Security: escaping/serialization boundaries
- Evidence: SSR and DOM parity tests, updated benchmarks

## M3 — Full-stack boundaries and DX
- Server/client module boundaries, actions/endpoints contracts, validation hooks
- Dev server/HMR integration, diagnostics, source maps
- Evidence: integration tests, build time/size tracking

## M4 — Compatibility and ecosystem (evidence-gated)
- Web Components interop, React/Angular adapter experiments (separate packages)
- npm ESM/CJS packaging matrix
- Python bridge/WASM design spike → implementation only if justified

## M5 — Hardening and pre-release
- Streaming/resume evaluation, perf tuning, fuzz/property tests, security review
- Documentation bilingual completion, migration guides
- Release only with explicit approval

## ملخص بالعربية
خارطة طريق مقترحة: M0 توثيق وقياس وجدوى، ثم نواة تفاعلية ومترجم أدنى، ثم مكونات وSSR، ثم حدود كامل المكدس وتجربة المطور، ثم توافق النظام البيئي، ثم تقسية وإصدار بموافقة صريحة.
