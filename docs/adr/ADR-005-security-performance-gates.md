# ADR-005: Security and performance as architectural gates

- **Status:** Accepted direction (ongoing)
- **Date:** 2026-11-16
- **Updated:** 2026-11-16 (applied during M1 implementation/review)

## Context
The framework targets production use. Security regressions and accidental performance cliffs are architectural risks, not post-hoc polish.

## Decision
Treat the following as **merge/release gates** for future milestones (not all automated in Milestone 0):
- **Correctness:** behavior tests for runtime/compiler semantics; no fake stubs for core behavior.
- **Type safety:** strict TS config; public API types reviewed; compiler diagnostics for boundary violations.
- **Memory:** ownership/disposal tests, leak scenarios, heap evidence for critical paths.
- **Security:** safe-by-default escaping/serialization, boundary validation, threat-model review for new surfaces.
- **Performance:** reproducible benchmark comparisons for affected areas; no superiority claims without evidence; regressions investigated.
- **Architecture:** dependency direction, no competitor runtime dependencies, no copied source.
- **Documentation:** API/behavior changes documented (EN + AR summaries).

## Consequences
- Slower early feature velocity but higher trustworthiness.
- Requires investment in test/bench infrastructure before broad feature expansion.

## Implementation note (M1)
Recurring gates are being applied to runtime preview work (tests, architecture boundaries, documented limitations, no superiority claims). Additional evidence (compiler correctness, MSF benchmarks, hardening/leak/security tests) is required as scope expands.

## ملخص بالعربية
يعتمد المشروع بوابات إلزامية للصحة والسلامة النوعية والذاكرة والأمان والأداء والمعمارية والتوثيق لكل المراحل القادمة.
