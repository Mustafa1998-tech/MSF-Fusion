# Memory benchmarks

**Status:** partial (competitor baseline evidence).

- DOM suite captures CDP `usedSize` after GC at baseline, after `create-10000`, and after `clear`.
- Results are point-in-time retained heap observations, not leak proofs.
- MSF runtime preview exists but is not yet included in equivalent memory benchmark scenarios.

Not included: long-running leak detection, allocation profiling, GC pause analysis, server memory under load, WASM/bridge memory.

ملخص: توجد لقطات كومة أولية لخط الأساس فقط؛ لا يوجد تحليل تسرب طويل الأمد أو قياسات ذاكرة لـ MSF بعد.
