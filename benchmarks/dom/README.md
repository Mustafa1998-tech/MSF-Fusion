# DOM benchmarks

**Milestone 0 status:** implemented in `benchmarks/runner/src/suites/dom/`.

- Scenarios and contract: `benchmarks/scenarios/dom.md`
- Shared fixture API: `benchmarks/runner/fixtures/shared/bench-client.ts`
- Metrics: `syncMs`, `frameMs`, startup marks, CDP heap snapshots, console/page errors

Not included: hydration, input/scroll/animation stress, accessibility tree cost, cross-browser matrix.

ملخص: تغطي هذه الفئة عمليات DOM والبدء ولقطات كومة أولية في Chromium فقط.
