# SSR benchmarks

**Milestone 1/M2 preview status:** implemented in `benchmarks/runner/src/suites/ssr/` — now includes the MSF Fusion runtime SSR fixture, informational measurement only.

- Scenario: `benchmarks/scenarios/ssr.md`
- Measures single `renderPage()` calls for equivalent 1,000-row markup on warm Node.js.
- MSF fixture: `benchmarks/runner/fixtures/apps/msf/src/entry-server.ts` (`h` + `renderToString`).
- Latest committed MSF SSR evidence: `benchmarks/results/2026-11-16_09-37-02-734Z-arcv.{json,md}`.

Not included: streaming, selective hydration/resumability, data loaders, routing, edge runtimes, Angular/Next/Qwik server stacks. MSF SSR numbers are developer-preview measurements; they are **not superiority claims**.

ملخص: تشمل الآن قياس SSR لـ MSF Fusion (إعلامي فقط)، بجانب خط الأساس للمنافسين؛ لا توجد ادعاءات تفوق.