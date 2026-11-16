# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published framework releases yet; entries track repository milestones and evidence.

## [Unreleased]

### Added
- **Package builds & consumer verification:** `@msf/contracts|runtime|compiler|dev` now emit real `dist` ESM builds with declarations via `tsconfig.build.json`, package exports point at `dist`, and `scripts/verify-package.mjs` packs the four packages, installs them into a temp consumer, runs a runtime smoke test and a TypeScript consumer typecheck — producing `benchmarks/evidence/package-verification.json`. Root scripts: `pnpm build`, `pnpm verify:package`.
- **Runtime developer preview (M1 progress):** `@msf/runtime` with fine-grained reactive kernel (`createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, ownership/disposal) and DOM helpers (`@msf/runtime/dom`), with tests.
- **Isomorphic view layer (M2 preview):** `@msf/runtime/universal` with isomorphic view descriptors (`h`, `fragment`, `text`), DOM mounting, and **hydration** that adopts SSR markup, attaches listeners, wires reactive bindings, and falls back to fresh mount on markup mismatch. Includes tests.
- **Full-stack example:** `examples/fullstack` — Vite + Node.js SSR in dev (middleware mode, on-demand render) and static prerender + hydration in production, served by Node HTTP. Hydration verified in a real Chromium browser.
- **Compiler universal target (M1/M2 bridge):** `@msf/compiler` `jsx-universal-v1` lowers supported JSX/TSX (intrinsic elements, nested children, dynamic attributes/events) to isomorphic view descriptors (`h("section", ...)`) consumable by `@msf/runtime/universal` for SSR/mount/hydrate — same component pipeline on server and client.
- **Runtime hardening:** O(1) owner disposal via `ownedSlot` (removes accidental O(n²) in `disposeNode`); keyed `list()` supports multi-root items; runaway-update depth guard (`MSF_REACTIVE_CYCLE`) with tests.
- **Compiler universal target:** `@msf/compiler` `jsx-universal-v1` emits isomorphic view descriptors (`h("...")` from `@msf/runtime/universal`) for the same JSX/TSX subset — the same compiled component can be SSR-rendered, mounted, or hydrated. Includes golden-output and executable-eval tests.
- **Dev tooling preview:** `@msf/dev` compile APIs/CLI (`compileFile`, `compilePath`, `status`) and tests.
- **Benchmark integration (partial):** `msf-runtime` micro-benchmark candidate in `@msf/bench-runner` (smoke-verified), alongside existing competitor baselines.
- **Examples:** `examples/counter-basic` (SSR snapshot), `examples/counter-browser` (Vite interactive demo), `examples/fullstack` (SSR + hydration pilot).
- **Documentation:** refreshed README/guide, engineering status and architecture/code review, ADR/engineering updates, and package READMEs.
- Repository presentation and governance: LICENSE (pending final approval), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY policy, issue/PR templates.

### Changed
- Project status moved from M0-only to **M1 in progress** with runnable preview slices and documented limitations.
- Runtime dependency tracking hardened to dedupe repeated reads within a single computation run.

### Notes
- Full IR/sourcemaps, broader compiler/JSX/component support, streaming/resume, dev server/HMR for library packages, publishable `dist` builds, and comprehensive MSF benchmark coverage are still pending (M1 hardening / M2+).
- No MSF Fusion performance superiority claims are made; benchmark evidence must follow documented methodology.

## [0.0.0-m0] - 2026-11-16

### Added
- **Architecture & governance:** system overview with Mermaid diagrams, ADR-001–ADR-005, security requirements and threat model, performance requirements, risks, quality gates, roadmap, MVP scope, and approval-gated implementation plan (English with Arabic summaries).
- **Benchmark laboratory (`@msf/bench-runner`):** pinned competitor baselines (React, Solid, Svelte, Vue, Preact Signals), environment capture, micro/SSR/bundle/DOM suites, raw JSON + Markdown reporting, and unit tests.
- **Final baseline evidence:** sequential full-sample run `2026-11-16_06-39-52-525Z-5om9` (`benchmarks/results/*.json`, `benchmarks/reports/*.md`).
- **Compiler toolchain spike (`@msf/spike-compiler-toolchain`):** TypeScript 7 unstable API and Oxc transform feasibility probe with recorded evidence (`benchmarks/evidence/compiler-toolchain.json`).
- **Repository scaffolding:** pnpm workspace, strict TypeScript base config, editor/git settings, and documentation index.

### Notes
- No MSF Fusion framework runtime/compiler/server implementation was included in the M0 snapshot.
- No performance superiority claims are made; baseline results are environment-specific and documented with exclusions/limitations.
- License is pending explicit approval (`UNLICENSED` metadata; all rights reserved per `LICENSE`).
