# Engineering risks — Milestone 0

| ID | Risk | Impact | Likelihood | Mitigation | Gate/Owner |
|---|---|---|---|---|---|
| R1 | Compiler unsoundness (wrong lowering/optimization) | High | Medium | Reactive IR invariants, golden tests, differential tests vs runtime semantics | Correctness gate |
| R2 | TypeScript unstable API churn (7.x) | High | Medium | Isolate behind semantic adapter, pin versions, spike coverage, fallback plan to CLI/diagnostics-only modes | ADR-004 review |
| R3 | Memory leaks from ownership/disposal bugs | High | Medium | Ownership model tests, stress loops, heap snapshots, dev-mode tracing | Memory gate |
| R4 | Benchmark misinterpretation / unfair comparisons | High | Medium | Document semantics, record exclusions, sequential runs, no composite scores | Methodology review |
| R5 | Security boundary leaks (secrets/serialization/XSS) | Critical | Medium | Compiler boundaries, safe defaults, threat-model reviews, security tests | Security gate |
| R6 | Source map/debuggability poor for compiled output | Medium | Medium | Preserve locations in IR, sourcemap tests, dev diagnostics | DX gate |
| R7 | Scope creep (full-stack + compiler + adapters too early) | High | High | Strict milestone plan, MVP slice, defer streaming/resume/bridges until evidenced | Approval gate |
| R8 | Windows-specific tooling issues (pnpm shims, paths, perf variance) | Medium | Medium | Cross-platform CI later, command-shim handling, document environment | CI plan |
| R9 | Ecosystem compatibility claims without evidence | High | Medium | Integration test matrix, real adapter packages, no marketing claims | Compatibility gate |
| R10 | DOM benchmark noise (frame floor, thermal variance) | Medium | High | Report sync+frame, multiple samples, document limitations, controlled reruns | Bench discipline |

## ملخص بالعربية
أهم المخاطر: صحة المترجم، تغيّر واجهات TypeScript، تسرب الذاكرة، عدالة القياسات، أمان الحدود، وتعقيد النطاق، مع تخفيفات وبوابات مراجعة لكل خطر.
