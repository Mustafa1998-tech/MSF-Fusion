# Bundle benchmarks

**Status:** implemented in `benchmarks/runner/src/suites/bundle/` — now includes an MSF Fusion fixture (informational preview measurement).

- Scenario: `benchmarks/scenarios/bundle.md`
- Measures production Vite build output (JS/CSS/gzip/brotli) + build time for equivalent benchmark apps.
- MSF fixture: `benchmarks/runner/fixtures/apps/msf/` (mounts the same 1,000-row table via `@mustafa-26112026/runtime/dom`).
- Latest committed MSF bundle evidence: `benchmarks/results/2026-11-16_11-43-37-434Z-wlh8.{json,md}` (build 46.1 ms; 8.81 KiB JS raw / 3.09 KiB brotli; smallest in the table — informational, not a superiority claim).

Not included: SSR bundles, streaming output, adapter-specific artifacts. MSF numbers are developer-preview measurements.

ملخص: تُظهر قياسات الحزمة أن معاينة MSF runtime تولّد أصغر حزم انتقالية بين الثوابت الحالية في المعيار؛ وهذا قياس معلوماتي فقط وليس ادعاء تفوق.