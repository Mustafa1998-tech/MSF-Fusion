# Runtime benchmarks

**Status:** MSF runtime preview measurements committed across micro, SSR, bundle and DOM suites (informational; no superiority claims).

- Micro: `benchmarks/runner/src/suites/micro/` — `msf-runtime` candidate alongside Preact Signals / Solid / Vue reactivity
  - Evidence: `benchmarks/results/2026-11-16_09-03-34-486Z-li9o.{json,md}` (2026-11-16, 12 samples)
- SSR: `benchmarks/runner/src/suites/ssr/` — MSF fixture present
  - Evidence: `benchmarks/results/2026-11-16_09-37-02-734Z-arcv.{json,md}` (2026-11-16)
- Bundle: `benchmarks/runner/src/suites/bundle/` — MSF fixture present
  - Evidence: `benchmarks/results/2026-11-16_11-43-37-434Z-wlh8.{json,md}` (2026-11-16)
  - MSF measured at 3.09 KiB brotli (smallest in the table; informational measurement — no superiority claim)
- DOM: `benchmarks/runner/src/suites/dom/` — MSF fixture present
  - Evidence: `benchmarks/results/2026-11-16_09-50-15-877Z-jjuo.{json,md}` (2026-11-16, validated rows count match)

Future runtime categories (scheduler fairness, async boundaries, streaming, memory long-run) require separate fixtures and methodology-compliant runs; review and record before any claims.

ملخص: قياسات كاملة لمعاينة MSF runtime في micro/SSR/bundle/DOM (إعلامية فقط).