# DOM benchmarks

**Milestone 1/M2 preview status:** implemented in `benchmarks/runner/src/suites/dom/` — now includes the MSF Fusion DOM fixture (informational preview measurements).

- Scenarios and contract: `benchmarks/scenarios/dom.md`
- Shared fixture API: `benchmarks/runner/fixtures/shared/bench-client.ts`
- MSF fixture: `benchmarks/runner/fixtures/apps/msf/src/main.tsx` — fine-grained signals + keyed `list()` render 1,000/10,000-row table via `@mustafa-26112026/runtime/dom`.
- Metrics: `syncMs`, `frameMs`, startup marks, CDP heap snapshots, console/page errors
- Latest committed MSF DOM evidence: `benchmarks/results/2026-11-16_09-50-15-877Z-jjuo.{json,md}` (2026-11-16)

Not included: hydration, input/scroll/animation stress, accessibility tree cost, cross-browser matrix. MSF numbers are developer-preview measurements; no superiority claims.

ملخص: تشمل الآن قياس DOM لـ MSF Fusion (إعلامي فقط)، بجانب خط الأساس للمنافسين؛ لا توجد ادعاءات تفوق.

ملخص: تغطي هذه الفئة عمليات DOM والبدء ولقطات كومة أولية في Chromium فقط.
