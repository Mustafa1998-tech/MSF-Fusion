# MVP scope — proposed

## MVP goal
A minimal, correct, evidence-backed vertical slice that proves MSF Fusion's core model end-to-end: **compile a constrained template/component to fine-grained DOM updates**, with SSR string output and deterministic client mount for the same subset.

## In scope (MVP)
- **Runtime kernel:** signals, computed values, effects, ownership/disposal, explicit batch API
- **DOM renderer:** create/update/remove text/attributes/events and keyed list operations for supported patterns
- **Compiler subset:** parse supported syntax, build reactive IR, lower to runtime calls, emit readable source maps
- **TypeScript-first authoring:** types for public APIs and component props in supported subset
- **SSR (minimal):** `renderToString`-equivalent for subset, escaping by default, no streaming
- **Tooling:** build integration (Vite plugin or equivalent), basic diagnostics
- **Tests:** runtime semantics, disposal/leak checks, compiler transform snapshots/goldens, SSR/client parity for subset
- **Benchmarks:** measure subset against M0 baselines where equivalent (micro/DOM/SSR/bundle)

## Out of scope (post-MVP unless re-approved)
- Streaming SSR, resumability, partial hydration optimizations beyond baseline
- Router, global state library, forms system, i18n framework
- React/Angular adapters, Web Components compiler target, Python/WASM bridge
- Visual devtools UI, production deployment adapters
- Full JSX/TSX compatibility with React semantics
- Angular/Next.js/Qwik benchmark parity

## MVP acceptance criteria
1. **Correctness:** all kernel and compiler-subset tests pass; no known ownership leaks in supported patterns.
2. **Type safety:** strict typecheck passes; public APIs typed.
3. **Security:** default escaping in SSR/DOM paths; no secret serialization; boundary rules documented.
4. **Performance:** benchmark results recorded with methodology; regressions vs prior MSF measurements investigated (no external superiority claim required at MVP, but no catastrophic regressions).
5. **Architecture:** no dependency on React/Angular/Next runtime; clear package boundaries.
6. **Documentation:** getting-started + API docs for supported subset in English with Arabic summaries.

## ملخص بالعربية
نطاق MVP المقترح: شريحة رأسية صغيرة وصحيحة (نواة تفاعلية + مترجم لمجموعة فرعية + DOM + SSR بسيط + اختبارات وقياسات)، مع تأجيل البث والمحوّلات والجسور وأدوات متقدمة إلى ما بعد MVP.
