# Memory benchmarks

**Milestone 0 status:** partial.

- DOM suite captures CDP `usedSize` after GC at baseline, after `create-10000`, and after `clear`.
- Results are point-in-time retained heap observations, not leak proofs.

Not included: long-running leak detection, allocation profiling, GC pause analysis, server memory under load, WASM/bridge memory.

ملخص: توجد لقطات كومة أولية فقط؛ لا يوجد تحليل تسرب طويل الأمد أو ضغط GC.
