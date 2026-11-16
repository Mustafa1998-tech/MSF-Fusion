# Security benchmarks / checks

**Status:** not implemented as executable benchmarks. Security requirements are defined as architectural constraints, and M1 runtime preview work has started, but automated security checks/benchmarks are still pending.

- See `docs/security/security-requirements.md` and `docs/security/threat-model.md`.
- Planned future checks: XSS/escaping correctness, SSRF-safe fetch boundaries, template injection resistance, serialization/boundary enforcement, dependency/supply-chain gates, CSP compatibility, secure defaults.
- MSF runtime/server preview currently includes basic HTML escaping for its supported string renderer; this is not a complete security validation.

No security benchmark results are claimed.

ملخص: لا توجد قياسات/اختبارات أمنية تنفيذية آلية بعد؛ المتطلبات ونموذج التهديد موثقان، وأعمال المعاينة (M1) بدأت دون اكتمال ضوابط الأمان أو نتائج قياس أمنية.