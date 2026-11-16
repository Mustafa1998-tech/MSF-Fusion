# Quality and approval gates

## Milestone 0 exit gate (completed for approval flow)
- [x] Architecture overview and ADR-001..005 documented
- [x] Security requirements and threat model documented
- [x] Performance requirements and benchmark methodology documented
- [x] Risks, roadmap, MVP scope, and detailed implementation plan documented
- [x] Benchmark lab typecheck/tests passing; report generation implemented
- [x] Compiler toolchain spike evidence recorded
- [x] Competitor baseline run completed sequentially with raw JSON + report committed
- [x] Explicit user approval received to proceed with M1 implementation ("موافق")

## Milestone 1 in-progress checks (current)
- [x] Package scaffolding (`contracts/runtime/compiler/dev`) and workspace integration
- [x] Reactive runtime kernel implemented with tests (real behavior, no mocks)
- [x] DOM helpers and SSR string renderer preview implemented with tests/examples
- [ ] Reactive kernel edge-case hardening (duplicate tracking in-run, dev diagnostics/cycle detection, stress/leak evidence)
- [ ] Compiler subset (IR/codegen/diagnostics/sourcemaps) implemented and tested
- [ ] MSF benchmark fixtures integrated and measured with documented methodology
- [ ] Publishable package builds/exports and developer tooling baseline
- [ ] Milestone 1 review evidence package complete

## Recurring gates for implementation milestones
| Gate | Minimum evidence |
|---|---|
| Correctness | Unit/integration tests for changed semantics; no mocked core behavior |
| Type safety | `tsc`/strict checks pass; public types reviewed |
| Memory | Disposal tests + targeted heap/stress evidence for risky changes |
| Security | Boundary/escaping/serialization tests; threat-model delta reviewed |
| Performance | Reproducible before/after or baseline comparison when hot paths change; no superiority claims without evidence |
| Architecture | Dependency direction preserved; no React/Angular/Next runtime deps; no copied source |
| Documentation | Behavior/docs updated (EN + AR summary where established) |

## Release/publication gate (future)
- [ ] All recurring gates satisfied for release scope
- [ ] Changelog/migration notes and compatibility matrix complete
- [ ] Supply-chain/provenance checks complete
- [ ] **Explicit user approval** for final license choice
- [ ] **Explicit user approval** for publishing/release

## ملخص بالعربية
بوابة M0 اكتملت وتمت الموافقة على بدء M1. العمل جارٍ مع تحقق جزئي (النواة وDOM/SSR معاينة واختبارات)، وبقية بوابات M1 (تقسية، مترجم، قياسات MSF، بناء/أدوات) ما تزال مفتوحة، مع اشتراط موافقات منفصلة للرخصة والنشر.
