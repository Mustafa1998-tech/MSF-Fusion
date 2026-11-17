# MSF DTB Backlog — MSF Fusion

> Statuses: `PROPOSED` | `READY` | `IN_PROGRESS` | `BLOCKED` | `VERIFIED` | `REJECTED`

| ID | Candidate | Value | Evidence | Effort | Risk | Priority | Status | Acceptance criteria |
|---|---|---|---|---|---|---|---|---|
| DTB-001 | Component model in universal view layer (function components, children, props) with SSR/hydration/mount support and tests | High — enables real-world component apps | Component tags currently unsupported by compiler and `h()` view layer | Medium | Medium | **P1** | **VERIFIED** | `h(Component, props, children)` works in SSR + mount + hydrate; subscribers declared in props; tests for mount/hydrate/renderToString |
| DTB-002 | Compiler lowering of intrinsic JSX to the isomorphic view layer (instead of direct DOM calls) so the same syntax works on server and client | High | Current `jsx-dom-v1` only emits DOM calls; SSR/hydration not compiler-targeted | Medium | Medium | **P1** | **VERIFIED** | A small `.tsx` file compiles to code importing `@msf/runtime/universal` (mountable/hydratable/SSR-safe); golden test output |
| DTB-003 | Compiler control-flow components (Show/For) lowering with disposal-safe runtime primitives | High | Required for real UIs; compiler subset previously rejected non-intrinsic tags | High | Medium | P2 | **PARTIAL/VERIFIED** | `Show`/`For` implemented as isomorphic view layer components with tests (`test/view.test.ts`); compiler lowering still explicitly flagged as unsupported for the JSX pipeline |
| DTB-004 | Reactive list DOM multi-root item support or documented constraint + tests | Medium | `list(keyFn)` assumes one root node per item | Medium | Medium | P2 | **VERIFIED** | `list` supports `Node`, `Node[]`, `DocumentFragment` items with tests (`test/list.test.ts`) |
| DTB-005 | Methodology-compliant MSF micro benchmark run committed as evidence | Medium | Smoke only; no committed MSF baseline | Medium | Low | P2 | **VERIFIED** | MSF runtime preview measured in micro (`2026-11-16_09-03-34-486Z-li9o`), SSR (`2026-11-16_09-37-02-734Z-arcv`), DOM (`2026-11-16_09-50-15-877Z-jjuo`), bundle (`2026-11-16_11-43-37-434Z-wlh8`); sequential runs; docs updated; no superiority claims |
| DTB-006 | Cycle detection/dev diagnostics in runtime kernel (debug mode) | Medium | ADR-002 mentions cycle detection; not implemented | Medium | Low | P2 | **VERIFIED** | Depth guard (`MSF_REACTIVE_CYCLE` >1000 nested `updateIfNecessary` steps) implemented and tested (`test/cycle.test.ts`); full read/write-after-dispose tracing still open |
| DTB-007 | Dev tooling: `msf check` compile diagnostics CLI across a project | Medium | `compilePath` already exists | Low | Low | P3 | **VERIFIED** | `node packages/dev/dist/cli.js check <path>` emits diagnostics; `pnpm --filter @msf/dev run check <path>` alias; tests pass |
| DTB-008 | API docs frozen list + breaking-change policy for preview exports | Medium | Repeated "preview may change" notes; need a single reliable reference | Low | Low | P3 | **VERIFIED** | `docs/api.md` lists stability levels, all exports, and breaking-change rules; linked from README |
| DTB-009 | npm publishing / distribution model | High | Owner decision 2026-11-17: **GitHub-only distribution; no npm publishing**. Clone-and-build is the supported developer flow | - | Medium (unpublished packages limit reach, deliberate) | - | **REJECTED** | Developers clone the repo and work against the workspace; no npm release is planned or executed |

## Ranking notes

- DTB-001 / DTB-002 are the highest leverage because they unlock real components rather than raw DOM APIs.
- Priority formula: (value + risk_reduction + confidence) / (effort + change_risk).
- Anything touching deployment, license, npm publish, secrets, or production is **approval-gated** and will not be executed autonomously.

---

**ملخص بالعربية:** قائمة المهام الأولية مرتبة حسب القيمة والمخاطر. أعلى قيمة: نموذج المكوّنات لـ SSR/الترطيب، ثم دعم المترجم له. الترخيص والنشر محجوبان لموافقة صريحة.