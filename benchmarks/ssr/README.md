# SSR benchmarks

**Milestone 0 status:** implemented in `benchmarks/runner/src/suites/ssr/`.

- Scenario: `benchmarks/scenarios/ssr.md`
- Measures single `renderPage()` calls for equivalent 1,000-row markup on warm Node.js.

Not included: streaming, selective hydration/resumability, data loaders, routing, edge runtimes, Angular/Next/Qwik server stacks.

ملخص: تغطي عرض HTML متزامن مكافئ فقط؛ البث والترطيب المؤجل خارج النطاق حالياً.
