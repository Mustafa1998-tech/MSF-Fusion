# Scenario: Reactivity microbenchmarks

## Goal
Measure primitive reactive operations in isolation (create/read/write, computed propagation, dynamic dependencies, effect fanout/lifecycle) without DOM, network, or framework routing overhead.

## Candidates
| Candidate | Package | Runtime | Included scenarios | Exclusions |
|---|---|---:|---|---|
| Preact Signals | `@preact/signals-core` 1.14.5 | Node | all supported | — |
| Solid | `solid-js` 1.9.19 (client dist) | Node, client runtime | non-effect scenarios per adapter | effect scenarios skipped if render flush required |
| Vue reactivity | `@vue/reactivity` 3.5.45 | Node | all supported | scheduler batching not modeled |

## Operations
- `create-1000`/`create-10000` equivalent primitive creation patterns as defined in `src/suites/micro/scenarios.ts`
- Unobserved and observed writes
- Computed chain and diamond propagation
- Dynamic dependency tracking
- Effect fanout and mount/dispose (where supported)

## Method
- Fresh graph per measured sample; setup outside timed region.
- Warm-up runs discarded.
- Report ns/op median, P95, CV, ops/s, checksum/sample count.
- Skip reasons recorded in JSON and report.

## Fairness notes
React and Angular are not included: no comparable standalone signal primitive / injector-free standalone measurement. Do not interpret micro results as whole-framework performance.

## ملخص بالعربية
يقيس هذا السيناريو عمليات التفاعلية المجردة (إشارات/حسابات/تأثيرات) بمعزل عن DOM، مع تسجيل الاستثناءات وعدم مقارنة React/Angular في هذا المستوى.
