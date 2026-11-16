# Engineering risks — updated

| ID | Risk | Impact | Likelihood | Current signal | Mitigation | Status |
|---|---|---|---|---|---|---|
| R1 | Compiler unsoundness (wrong lowering/optimization) | High | Medium | Compiler not implemented yet | Reactive IR invariants, golden tests, differential/runtime parity tests | Open (WP4) |
| R2 | TypeScript unstable API churn (7.x) | High | Medium | Spike validated feasibility only | Isolate behind semantic adapter, pin versions, fallback strategies | Open |
| R3 | Memory leaks / disposal bugs | High | Medium | Kernel disposal implemented; edge cases/stress limited | Ownership tests, stress loops, heap evidence, dev tracing | Partially mitigated |
| R4 | Reactive correctness edge cases (tracking, memo propagation, duplicates) | High | Medium | Core passes 14 kernel tests; review found duplicate-read tracking gap | Add targeted tests, fix tracking cursor/dedupe, fuzz/property tests | **Active** |
| R5 | Benchmark misinterpretation / unfair comparisons | High | Medium | M0 baseline documented with exclusions | Preserve methodology, sequential runs, no composite/superiority claims | Mitigated (ongoing) |
| R6 | Security boundary leaks (secrets/serialization/XSS) | Critical | Medium | SSR escaping exists for string renderer; no full boundaries yet | Compiler/runtime boundary enforcement, serialization allowlist, tests, threat-model deltas | Open |
| R7 | DOM/SSR divergence (non-isomorphic APIs) | High | Medium | DOM uses real nodes, SSR uses `h()` tree | Unify rendering model/component contract, parity tests | **Active** |
| R8 | Source map/debuggability poor for compiled output | Medium | Medium | No compiler output yet | Preserve spans in IR, sourcemap tests, readable dev output | Open |
| R9 | Scope creep / launch pressure | High | High | Broad request to "complete everything" | Milestone slicing, evidence gates, explicit approvals for npm publish | **Active** |
| R10 | Packaging/consumption friction | Medium | Medium | Packages export source `.ts`, no `dist` builds | Add build pipeline, conditional exports, compatibility tests | Open |
| R11 | DOM benchmark/environment noise | Medium | High | Observed variance in baseline runs | Report sync+frame, multi-sample, document limitations | Mitigated (ongoing) |

## ملخص بالعربية
المخاطر النشطة حالياً تشمل حواف صحة التفاعلية، تباعد DOM/SSR، وضغط نطاق الإطلاق، إلى جانب مخاطر مفتوحة في المترجم والأمان والتغليف؛ وتم تخفيف جزء من مخاطر التتبع/القياس عبر اختبارات النواة ومنهجية M0.
