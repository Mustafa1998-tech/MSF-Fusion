# Runtime benchmarks

**Status:** competitor baseline coverage plus **MSF runtime preview** measurement in the micro suite (informational; no superiority claims).

- Micro: `benchmarks/runner/src/suites/micro/` and `benchmarks/scenarios/micro.md` — includes `msf-runtime` candidate alongside Preact Signals / Solid / Vue reactivity
- SSR: `benchmarks/runner/src/suites/ssr/` and `benchmarks/scenarios/ssr.md` — MSF runtime is **not yet** included there
- Latest committed MSF micro evidence: `benchmarks/results/2026-11-16_09-03-34-486Z-li9o.{json,md}` (2026-11-16)

Future runtime categories (scheduler fairness, async boundaries, streaming, SSR/bundle/DOM MSF comparisons) require separate equivalent fixtures and full methodology-compliant sequential runs; review and record results before making any claims.

ملخص: تُظهر هذه الفئة الآن قياساً أولياً لمعاينة MSF runtime في micro كدليل معلوماتي جنباً إلى جنب مع المنافسين؛ ما زالت SSR/bundle/DOM لـ MSF غير مدمجة ولا توجد ادعاءات تفوق.