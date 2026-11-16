# MSF DTB State — MSF Fusion

- Product / repository: **MSF Fusion** (https://github.com/Mustafa1998-tech/MSF-Fusion) — compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework
- Active branch: `master`
- License: **MIT** (`LICENSE`); packages remain `private: true` and are **not published to npm** — distribution is via the public GitHub repository and source clones only.
- Last verified iteration: **DTB-004/006 (list() fix, depth guard) + benchmarks coverage (micro/SSR/DOM) + DTB-008/003/007**
- Current item / status: DTB-001..008 shipped (DTB-003 partial — Show/For runtime, no compiler lowering for control flow yet); next: stabilize benchmark harnesses and docs, or DTB-009 (npm publish under MIT — still requires owner approval)
- Relevant files: `benchmarks/{micro,ssr,dom}/`, `benchmarks/results/2026-11-16_{09-03-34-486Z-li9o,09-37-02-734Z-arcv,09-50-15-877Z-jjuo}.json`
- Baseline checks and results (2026-11-16, after list() fix):
  - `pnpm run typecheck` (workspace): **pass**
  - `@msf/runtime` tests: **37/37 pass**
  - `@msf/compiler` tests: **14/14 pass**
  - `@msf/dev` tests: **6/6 pass**
  - `@msf/bench-runner` tests: **31/31 pass**
  - `pnpm run build`: **pass**
  - `pnpm verify:package`: **pass** (consumer install + runtime smoke + TS consumer typecheck)
  - `examples/fullstack` dev SSR / production prerender + Chromium hydration: **pass**
  - MSF benchmarks: micro `2026-11-16_09-03-34-486Z-li9o`, SSR `2026-11-16_09-37-02-734Z-arcv`, DOM `2026-11-16_09-50-15-877Z-jjuo` (informational preview measurements)
- Most recent checks and results: see latest iteration notes below
- Notes / limitations:
  - No CI workflow pushed yet (workflow scope needed; validate locally)
  - No npm release (owner approval required even though repo is MIT)
  - No compiler support for `<Show>`/`<For>` lowering yet (runtime supports them)
- Known risks / blockers:
  - Hydration/component model still preview (not compiler-emitted)
  - Compiler subset constrained; bundle/dom MSF fixtures verified working
- Next safe action: pick next DTB backlog item; highest value = stabilize & close the preview, or approve and execute npm publish under MIT
- Approval required: npm publish/releases; any production-facing or destructive change; major scope expansion

## Iteration notes
- 2026-11-16 — benchmarks expanded: MSF micro/SSR/DOM evidence committed; SSR fixture added; DOM fixture used fine-grained `list(keyFn)` (real app wiring fixed); Windows `.cmd` shim detection fixed in `env.ts`.
- 2026-11-16 — License decision: **MIT** (`LICENSE` modified); package metadata set to `MIT`; DTB-009 still blocked on owner npm-publish approval.
- 2026-11-16 — list() item ownership fixed: per-item `createRoot` now runs under detached owner (`runWithOwner(null, ...)`) so reconciliation no longer disposes sibling effects; added test.
- 2026-11-16 `d67853e` — depth guard (`MSF_REACTIVE_CYCLE`) added for nested updateIfNecessary; test added.
- 2026-11-16 `fca2179` — `@msf/dev` ships `check` command (recursive `.tsx/.jsx` scan, exit non-zero on unsupported patterns); tests added.
- 2026-11-16 `73a8be7` — dist builds + conditional exports + consumer install/smoke/typecheck verification; evidence written; CI workflow outstanding.
- 2026-11-16 `e568729` — isomorphic view layer + SSR hydration; `examples/fullstack` verified end-to-end in Chromium.
