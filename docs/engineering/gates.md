# Quality and approval gates — Milestone 0

## Milestone 0 exit gate (before any framework implementation)
- [ ] Architecture overview and ADR-001..005 reviewed
- [ ] Security requirements and threat model reviewed
- [ ] Performance requirements and benchmark methodology reviewed
- [ ] Risks, roadmap, MVP scope, and detailed implementation plan reviewed
- [ ] Benchmark lab typecheck/tests pass; report generation works
- [ ] Compiler toolchain spike evidence recorded and reviewed
- [ ] Competitor baseline run completed **sequentially** with raw JSON + report committed
- [ ] No smoke/unexplained anomalies left undocumented
- [ ] Explicit approval received to start Milestone 1

## Recurring gates for future milestones
| Gate | Minimum evidence |
|---|---|
| Correctness | Unit/integration tests for changed semantics; no mocked core behavior |
| Type safety | `tsc`/strict checks pass; public types reviewed |
| Memory | Disposal tests + targeted heap/stress evidence for risky changes |
| Security | Boundary/escaping/serialization tests; threat-model delta reviewed |
| Performance | Reproducible before/after or baseline comparison when hot paths change |
| Architecture | Dependency direction preserved; no React/Angular/Next runtime deps; no copied source |
| Documentation | User-facing behavior/docs updated (EN + AR summary) |

## Release/publication gate (future)
- All recurring gates pass, changelog/migration notes ready, provenance/supply-chain checks complete, and **explicit user approval** for publishing/license decisions.

## ملخص بالعربية
لا يبدأ تنفيذ الإطار قبل اكتمال مراجعة واعتماد مرحلة 0 (وثائق، قياسات أساس، أدلة، خطة)، مع بوابات متكررة للجودة والأمان والأداء في كل مرحلة لاحقة.
