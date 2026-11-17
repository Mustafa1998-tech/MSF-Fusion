# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published to npm yet.

## [0.1.0] — 2026-11-17 (GitHub-only; no npm release)

> **Distribution decision (owner, 2026-11-17):** GitHub clone-based consumption only; no npm package is published and none is planned. The four `@msf/*` packages remain local tarball-verifiable (`pnpm build`, `pnpm verify:package`). An earlier experimental rename to `@mustafa-26112026/*` was reverted the same day.

The four `@msf/*` packages are at `0.1.0` and verified consumable (consumer install, runtime smoke, TS typecheck), but by owner decision the repository is clone-based and **no npm release is planned**. Publish metadata and the helper remain in-repo for future reference only.

### Added
- **Packaging hardened for publication:** per-package READMEs (real API surface), `publishConfig.access=public`, `LICENSE` included in every tarball, self-contained sourcemaps (`inlineSources`), and `scripts/publish-packages.mjs` (dry-run by default; `--yes` publishes in dependency order with preflight checks). Publication itself still pending operator `npm login` authorization.
- **Packaging & consumption verification**: `dist` ESM builds with declarations via `tsconfig.build.json`; conditional exports; `scripts/verify-package.mjs`.
- **Reactive kernel**: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, owner utilities; in-run dependency dedupe; O(1) owner dispose via `ownedSlot`.
- **Isomorphic view layer** (`@msf/runtime/universal`): isomorphic view descriptors, DOM `mount`, `hydrate`, plus `Show`/`For` control-flow components and `h(Component, props, children)` function components.
- **SSR string renderer** (`@msf/runtime/server`): `h`, `fragment`, `text`, `renderToString`, `escapeHtml` with default safe escaping; component nodes resolved.
- **Compiler subset** (`@msf/compiler`): `jsx-dom-v1` and **`jsx-universal-v1`** targets; lowering intrinsic JSX/TSX to `@msf/runtime/dom` or isomorphic view descriptors; diagnostics for unsupported patterns; published-package-ready.
- **Examples**: `counter-basic` (SSR), `counter-browser` (Vite), **`examples/fullstack`** (SSR + hydration pilot), **`examples/dashboard`** (Ops Board).
- **Benchmarks** (informational preview): MSF runtime measurements committed for micro (`09-03-34-486Z-li9o`), SSR (`09-37-02-734Z-arcv`), DOM (`09-50-15-877Z-jjuo`), bundle (`11-43-37-434Z-wlh8`) — 3.09 KiB brotli MSF fixture output; **no superiority claims**.
- **Dev tooling** (`@msf/dev`): `compileFile`, `compilePath`, `checkFile`, `checkPath`; CLI: `msf-dev status|check|compile`.
- **Production-readiness checklist** committed: `docs/production-readiness.md`.

### Notes
- No npm publish will be executed; distribution is GitHub-only (owner decision, 2026-11-17).
- No MSF performance superiority claim is made; benchmarks are informational preview measurements on one machine.
- Compiler coverage remains a subset; full IR, sourcemaps, streaming/resume, router, and actions are not implemented.
- No CI workflow pushed yet (GitHub token lacks `workflow` scope; needs operator permission to push `.github/workflows/ci.yml`).

## [0.0.0-m0] — 2026-11-16

### Added
- Architecture review, ADRs 001–005, threat model, risks, gates, roadmap, implementation plan.
- Benchmark lab (`@msf/bench-runner`) with React/Solid/Svelte/Vue/Preact Signals baselines (sequential, raw-data preserved).
- Compiler toolchain spike (Oxc + TypeScript 7 unstable API).
- Repository scaffolding: pnpm workspace, strict TS, editorconfig, issue/PR templates, MIT license placeholder.

### Notes
- License finalized as **MIT** (`LICENSE`); distribution is GitHub-only (owner decision 2026-11-17); no npm release is planned.
- No superiority claims; baselines are machine-specific.
