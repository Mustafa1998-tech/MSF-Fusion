# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published to npm yet.

## [0.1.0] — 2026-11-17 (publishable; not yet published)

MSF Fusion packages are now technically ready for npm publication: `@mustafa-26112026/contracts|runtime|compiler|dev` are at `0.1.0`, `private: true` removed, `package.json` carries full publish metadata (`repository`, `homepage`, `bugs`, `author`, `keywords`, `description`, `license: MIT`), and `pnpm verify:package` passes (consumer install, runtime smoke, TS consumer typecheck). **npm publish requires operator `npm login` on the machine — done by the user, not CI.**

### Added
- **Packaging hardened for publication:** per-package READMEs (real API surface), `publishConfig.access=public`, `LICENSE` included in every tarball, self-contained sourcemaps (`inlineSources`), and `scripts/publish-packages.mjs` (dry-run by default; `--yes` publishes in dependency order with preflight checks). Publication itself still pending operator `npm login` authorization.
- **Packaging & consumption verification**: `dist` ESM builds with declarations via `tsconfig.build.json`; conditional exports; `scripts/verify-package.mjs`.
- **Reactive kernel**: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, owner utilities; in-run dependency dedupe; O(1) owner dispose via `ownedSlot`.
- **Isomorphic view layer** (`@mustafa-26112026/runtime/universal`): isomorphic view descriptors, DOM `mount`, `hydrate`, plus `Show`/`For` control-flow components and `h(Component, props, children)` function components.
- **SSR string renderer** (`@mustafa-26112026/runtime/server`): `h`, `fragment`, `text`, `renderToString`, `escapeHtml` with default safe escaping; component nodes resolved.
- **Compiler subset** (`@mustafa-26112026/compiler`): `jsx-dom-v1` and **`jsx-universal-v1`** targets; lowering intrinsic JSX/TSX to `@mustafa-26112026/runtime/dom` or isomorphic view descriptors; diagnostics for unsupported patterns; published-package-ready.
- **Examples**: `counter-basic` (SSR), `counter-browser` (Vite), **`examples/fullstack`** (SSR + hydration pilot), **`examples/dashboard`** (Ops Board).
- **Benchmarks** (informational preview): MSF runtime measurements committed for micro (`09-03-34-486Z-li9o`), SSR (`09-37-02-734Z-arcv`), DOM (`09-50-15-877Z-jjuo`), bundle (`11-43-37-434Z-wlh8`) — 3.09 KiB brotli MSF fixture output; **no superiority claims**.
- **Dev tooling** (`@mustafa-26112026/dev`): `compileFile`, `compilePath`, `checkFile`, `checkPath`; CLI: `msf-dev status|check|compile`.
- **Production-readiness checklist** committed: `docs/production-readiness.md`.

### Notes
- No npm publish executed yet; operator must authenticate with `npm login` and run publish (or trigger GitHub release) explicitly.
- No MSF performance superiority claim is made; benchmarks are informational preview measurements on one machine.
- Compiler coverage remains a subset; full IR, sourcemaps, streaming/resume, router, and actions are not implemented.
- No CI workflow pushed yet (GitHub token lacks `workflow` scope; needs operator permission to push `.github/workflows/ci.yml`).

## [0.0.0-m0] — 2026-11-16

### Added
- Architecture review, ADRs 001–005, threat model, risks, gates, roadmap, implementation plan.
- Benchmark lab (`@mustafa-26112026/bench-runner`) with React/Solid/Svelte/Vue/Preact Signals baselines (sequential, raw-data preserved).
- Compiler toolchain spike (Oxc + TypeScript 7 unstable API).
- Repository scaffolding: pnpm workspace, strict TS, editorconfig, issue/PR templates, MIT license placeholder.

### Notes
- License finalized as **MIT** (`LICENSE`); npm publish still requires operator action.
- No superiority claims; baselines are machine-specific.
