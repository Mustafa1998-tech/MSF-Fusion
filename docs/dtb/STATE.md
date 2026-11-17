# MSF DTB State — MSF Fusion

- Product / repository: **MSF Fusion** (https://github.com/Mustafa1998-tech/MSF-Fusion) — compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework
- Active branch: `master`
- License: **MIT** (`LICENSE`); distribution model: **GitHub-only — developers clone the repository and work against the workspace** (owner decision, 2026-11-17). There is no npm package and no plan to publish one; `pnpm publish:packages` remains as an **unused in-repo helper** only.
- Last verified iteration: **GitHub-only distribution decision** (2026-11-17): npm publish was deliberately not pursued; the earlier `@mustafa-26112026/*` rename was reverted (commit `69410f2`); `v0.1.0` publish-preparation commits (READMEs, `LICENSE` in tarballs, self-contained sourcemaps, `scripts/verify-package.mjs` evidence) remain in-repo.
- Current item / status: DTB-001..008 shipped (DTB-003 partial — Show/For runtime; nested JSX-in-expressions translated and Show/For compiler lowering complete); DTB-009 (npm publish) **REJECTED**; DTB-010+ to be picked from backlog (router/data/streaming/dev-server remain the largest gaps).

## Baseline checks and results (2026-11-17, after the revert)

- `pnpm run typecheck` (workspace, 10 projects): **pass**
- `@msf/runtime` tests: **40/40 pass**
- `@msf/compiler` tests: **14/14 pass**
- `@msf/dev` tests: **6/6 pass**
- `@msf/bench-runner` tests: **31/31 pass**
- `@msf/spike-compiler-toolchain` tests: **4/4 pass**
- `pnpm run build` (dist ESM + d.ts, 4 packages): **pass**
- `pnpm verify:package` (temp consumer install + runtime smoke + TS typecheck): **PASS** — evidence `benchmarks/evidence/package-verification.json`

## Open / partial

- **No framework is "production-ready" yet**: no router, data/streaming/resume, server actions/boundaries, dev server/HMR, real-world app at scale, or independent benchmark validation; see [production-readiness.md](../production-readiness.md)
- No npm distribution (by decision); clone-based consumption only
- No superiority claims are made; benchmarks are informational

## Next safe action

Pick the next DTB item from `docs/dtb/BACKLOG.md`. Highest leverage remains: hydration edge cases for accessor children (`insertReactiveChildren`), compiler lowering of `Show`/`For`, then the router/data boundaries milestone.

## Approval required

Anything touching deployment, license, publishing, secrets, production data, or paid/public infrastructure — (npm publish explicitly rejected by owner 2026-11-17).

## History

- 2026-11-17 — Owner decision: GitHub-only distribution; npm publish rejected; `@mustafa-26112026/*` rename reverted; docs updated
- 2026-11-17 — v0.1.0 publish preparation (READMEs, LICENSE in tarballs, sourcemaps, publish helper script); fresh clone-and-build verified
- 2026-11-16 — DTB-004/006/008/003/007 (list fix, depth guard, API docs, Show/For, msf check) and the benchmark suite commits
- 2026-11-16 — Benchmark micro/SSR/DOM/bundle evidence integrated
