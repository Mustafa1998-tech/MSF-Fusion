# MSF DTB Changelog — MSF Fusion

- 2026-11-16 `d` — Consumer package verification: `scripts/verify-package.mjs` builds/packs `@msf/contracts|runtime|compiler|dev`, installs them into a temp consumer with pnpm overrides, runs a Node runtime smoke test plus a TS consumer typecheck; evidence written to `benchmarks/evidence/package-verification.json`. Result: **PASS**.
- 2026-11-16 — Isomorphic view layer + hydration (`@msf/runtime/universal`): isomorphic view descriptors (`h`, `fragment`, `text`), DOM `mount`, and `hydrate` with mismatch fallback; `examples/fullstack` pilot (dev SSR via Vite middleware; production prerender + Chromium-verified hydration). Tests 27/27 (incl. component mount/hydrate/SSR).
- 2026-11-16 (DTB-002) — Compiler `target: "universal"` (`jsx-universal-v1`) emits isomorphic view descriptors (`h("...", ...)`) from `@msf/runtime/universal` for intrinsic + component JSX; golden-output tests plus a `new Function` executable-eval test verified the emitted code evaluates to correct trees (badge/main shape; reactive `() => count()` accessors preserved). 14/14 compiler tests pass; workspace typecheck clean; `pnpm verify:package` PASS.
- 2026-11-16 — Runtime hardening: in-run dependency dedupe (non-consecutive duplicate reads); tests extended to cover it.
- 2026-11-16 — Docs: getting started, status, architecture/code review, DTB ledger added.
