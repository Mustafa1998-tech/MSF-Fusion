# MSF DTB State — MSF Fusion

- Product / repository: **MSF Fusion** (https://github.com/Mustafa1998-tech/MSF-Fusion) — compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework
- Active branch: `master`
- License: **MIT** (`LICENSE`); the four `@mustafa-26112026/*` packages are **publishable at v0.1.0** (`private` removed, `publishConfig.access=public`) but are **not published to npm yet** — publication is approval-gated and requires operator `npm login` on the machine
- Last verified iteration: **v0.1.0 publish preparation** (2026-11-17): package READMEs made accurate, `LICENSE` shipped in every tarball, self-contained sourcemaps, `scripts/publish-packages.mjs` (dry-run by default), root `publish:packages` scripts
- Current item / status: DTB-001..008 shipped (DTB-003 partial — Show/For runtime; no compiler lowering of control flow); **DTB-009 release** — owner approval granted 2026-11-17, publication blocked only on npm authentication

## Baseline checks and results (2026-11-17, after publish preparation)

- `pnpm run typecheck` (workspace, 10 projects): **pass**
- `@mustafa-26112026/runtime` tests: **38/38 pass**
- `@mustafa-26112026/compiler` tests: **14/14 pass**
- `@mustafa-26112026/dev` tests: **6/6 pass**
- `@mustafa-26112026/bench-runner` tests: **31/31 pass**
- `@mustafa-26112026/spike-compiler-toolchain` tests: **4/4 pass**
- `pnpm run build` (dist ESM + d.ts, 4 packages): **pass**
- `pnpm verify:package` (temp consumer install + runtime smoke + TS typecheck): **PASS** — evidence `benchmarks/evidence/package-verification.json`
- `pnpm pack` (all four): tarball contains `LICENSE`, `dist/**.js`, `dist/**.js.map`, `dist/**.d.ts`, `README.md`; `workspace:*` rewritten to `0.1.0`
- Root package description mojibake fixed; `package.json` BOM removed in all four packages
- Script `scripts/publish-packages.mjs`: aborts cleanly with instructions when not authenticated; requires `--yes` to publish for real

## Open / partial

- npm publication **not executed yet** — awaits `npm login`/authorize on this machine; scope `@mustafa-26112026` ownership unverified (registry search shows 0 existing `@mustafa-26112026` packages)
- No superiority claims are made; benchmarks are informational
- Read [production-readiness.md](../production-readiness.md) before any release

## Next safe action

1. Verify npm auth, dry-run the publish (`pnpm publish:packages`), then publish with `--yes` (tag `latest`, plus `preview` dist-tag) in order contracts → runtime → compiler → dev
2. Then continue DTB-009 follow-ups: push CI workflow (blocked on `workflow` scope), npm dist-tags verification, docs/release notes
3. If auth fails or `@mustafa-26112026` scope is not owned by the user's account: **stop** and resolve scope ownership before publishing

## Approval required

npm publish/release; any production-facing or destructive change; major scope expansion. (Owner approval for npm publish was granted 2026-11-17; the action itself remains gated on successful operator authentication.)

## History

- 2026-11-17 — v0.1.0 publish preparation complete (README/LICENSE/sourcemaps/publish script); awaiting npm authorize; fresh-clone clone-and-build verified earlier
- 2026-11-17 — MIT license decision recorded; fresh-clone verification; `production-readiness.md` committed
- 2026-11-16 — DTB-004/006/008/003/007 (list fix, depth guard, API docs, Show/For, msf check)
- 2026-11-16 — Benchmark micro/SSR/DOM/bundle evidence integrated
