# Production readiness checklist — MSF Fusion

> **Honest snapshot (2026-11-17).** This checklist is intended for a developer or reviewer asking *"Is this production-ready?"* Answer: **not yet.** Here is the authoritative state.

## Foundation — in good shape
| Capability | Status | Evidence |
|---|---|---|
| Reactive kernel (signals/memos/effects/roots/batch/untrack) | ✅ | 38 unit tests pass |
| DOM bindings (insert/setText/setAttribute/list/For) | ✅ | tests + multi-root keyed list fixed |
| SSR snapshot rendering (string, escaped) | ✅ | `@msf/runtime/server` |
| Isomorphic view layer (`mount`, `hydrate`, view descriptors) | ✅ | verified in Chromium: mismatch → fresh mount fallback |
| Function components with props/children | ✅ | mount/hydrate/SSR all tested |
| `Show`, `For` control-flow components | ✅ | view-layer tests (`test/view.test.ts`) |
| Keyed `list()` | ✅ | multi-root / swap/remove/identity tests fixed |
| Package builds (`dist`, d.ts, conditional exports) | ✅ | `pnpm verify:package`, evidence in `benchmarks/evidence/` |
| Fresh-clone verification | ✅ | clone → install → build → typecheck pass on vanilla Node 24 LTS |
| Examples runnable in-repo | ✅ | counter-basic, counter-browser, fullstack, dashboard |
| Benchmarks in micro/SSR/bundle/DOM | ✅ | informational, no superiority claims |
| License | ✅ | MIT, repository metadata & LICENSE match |
| Repo README accurate for portal developers | ✅ | updated for MIT + verify + real-world quickstart |

## Towards production use — not yet complete
| Capability | Status | Gap |
|---|---|---|
| Router | ❌ | No client/server router implemented |
| Data fetching / streaming / resume | ❌ | No data/route model or streaming SSR |
| Actions / server boundaries | ❌ | Contracts exist, no enforcement toolchain |
| Compiler full TSX/IR/codegen | ❌ | Only `jsx-dom-v1` / `jsx-universal-v1` subset; no sourcemaps |
| Dev server + HMR / CLI (`dev`/`build` for apps) | ❌ | `@msf/dev` is a check/compile preview only |
| npm publishing | ⚠️ prepared, not executed | Packages at `v0.1.0`, `public` access, verified tarballs; publication awaits operator `npm login` authorization; no registry release yet |
| Developer ergonomics (typechecking beyond run, diagnostics) | ⚠️ minimal | compile/dev check commands exist, not a complete HMR world |
| Streaming SSR | ❌ | Not implemented |
| Memory/leak analysis | ❌ | DOM CDM snapshot only; no long-run leak suite |
| Full browser/perf matrix | ❌ | Only Chromium Playwright, one machine |
| Real-world apps validated at scale | ❌ | Only toy-ish in-repo examples |
| CI | ⚠️ local | Workflow file exists but unpushed (token scope) and never ran green end-to-end |
| Benchmarks vs production builds | ❌ | MSF fixtures built via Vite but not under app compilers |

## What this means for a developer today
1. **You can clone, build, and run examples.** Yes.
2. **You can build small pages.** Yes.
3. **You cannot yet ship a real multi-route app with data and actions.** No.
4. **You should not use this in production yet.** It is a working developer preview (MIT, cloneable).
5. **Short list of blockers to get to "production":** npm publish approval, full compiler (IR/sourcemaps/component lowering), router/actions boundaries, dev server/HMR, real-world apps, validated benchmarks, memory/leak analysis, CI green.

## ملخص بالعربية
هذا جدول استعداد صريح: النواة التفاعلية تعمل والـ SSR/Hydration مُختبران والأمثلة قابلة للتشغيل داخل المستودع، لكن ما زال ينقص: موجه، data/actions، مترجم كامل، بيئة تطوير، نشر npm، وتحليلات طولية — لذلك فهو developer preview وليس production-ready بعد.