# MSF DTB State — MSF Fusion

- Product / repository: **MSF Fusion** (https://github.com/Mustafa1998-tech/MSF-Fusion) — compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework
- Active branch: `master`
- Authorized scope: M1/M2 preview work inside the repository — **developer preview only, no npm publish, no license change, no production mutation**
- Last verified iteration: **DTB-003 partial (Show/For)** + DTB-007/008 (this session)
- Current item / status: DTB-001..008 shipped (003 partial — compiler lowering still unsupported); next: DTB-009 still approval-gated (license/npm), or stability hardening before any release
- Relevant files: `packages/compiler/src/index.ts`, `packages/compiler/test/{compile,universal,universal-exec,universal-component}.test.ts`
- Baseline checks and results (2026-11-16, after DTB-002):
  - `pnpm run typecheck` (workspace): **pass**
  - `@msf/runtime` tests: **27/27 pass** (incl. component mount/hydrate/SSR)
  - `@msf/compiler` tests: **14/14 pass** (`jsx-dom-v1` + `jsx-universal-v1` golden and executable-eval tests)
  - `@msf/dev` tests: **2/2 pass**
  - `@msf/bench-runner` tests: **31/31 pass**
  - `pnpm run build`: **pass**
  - `pnpm verify:package`: **pass** (consumer install + runtime smoke + TS consumer typecheck; evidence `benchmarks/evidence/package-verification.json`)
  - `examples/example-fullstack` dev SSR / production prerender + Chromium hydration: **pass**
- Most recent checks and results: see latest iteration notes below
- Unverified checks / limitations:
  - No systematic MSF benchmark run committed yet (methodology-compliant, sequential, raw data)
  - No CI (workflow file exists locally, unpushed due to GitHub token `workflow` scope)
  - No licensed/npm release (approval required)
- Known risks / blockers:
  - Hydration/component model still preview (not compiler-emitted)
  - Compiler subset constrained; wrapper package not published
- Next safe action: see `docs/dtb/BACKLOG.md` (start with highest-value READY item)
- Approval required (if any): license/publishing/npm; any production-facing or destructive change; major scope expansion

## Iteration notes
- 2026-11-16 `e568729` — DTB-001: function components in isomorphic view layer (`h(Component, props, children)`) resolved by SSR/mount/hydrate; `packages/runtime/test/component.test.ts` (3 tests). DTB-001 VERIFIED.
- 2026-11-16 `73a8be7` — dist builds, conditional exports, consumer install/smoke/typecheck verification (`pnpm verify:package`), evidence JSON.
- 2026-11-16 (this iteration) — DTB-002: compiler `target: "universal"` (`jsx-universal-v1`) emits isomorphic view descriptors for the JSX subset; golden + executable-eval tests; 14 compiler tests pass. DTB-002 VERIFIED.
- 2026-11-16 `ab1812c` — isomorphic view layer + SSR hydration; full-stack example tested (dev SSR HTTP 200, prod prerender + hydration in Chromium).
- 2026-11-16 `c7e30e7` — runtime dependency-tracking fix, compiler `jsx-dom-v1`, MSF micro-benchmark candidate.
- 2026-11-16 `33c64a1` / earlier — docs update to M1-preview reality.
- 2026-11-16 `6aaf9b6` — public repo created, M0 baseline/benchmark evidence.
- 2026-11-16 `aca8423` — getting-started guide updates.

---

**ملخص بالعربية:** سجّل تنفيذ DTB — الإطار بدور معاينة مطوّر في المستودع، مع قيود واضحة (الترخيص/النشر يحتاج موافقة)، وحالة التحقق الحالية وجداول المهام التالية.