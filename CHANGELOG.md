# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published framework releases yet; entries track repository milestones and evidence.

## [Unreleased]

### Added
- **Runtime developer preview (M1 progress):** `@msf/runtime` with fine-grained reactive kernel (`createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, ownership/disposal), DOM helpers, and SSR string renderer (`h`, `renderToString`, HTML escaping), with tests.
- **Compiler subset (real, M1):** `@msf/compiler` `jsx-dom-v1` transform for intrinsic JSX/TSX subset to DOM runtime calls with diagnostics and tests.
- **Dev tooling preview:** `@msf/dev` compile APIs/CLI (`compileFile`, `compilePath`, `status`) and tests.
- **Benchmark integration (partial):** `msf-runtime` micro-benchmark candidate in `@msf/bench-runner` (smoke-verified), alongside existing competitor baselines.
- **Examples:** `examples/counter-basic` (SSR snapshot) and `examples/counter-browser` (Vite interactive demo).
- **Documentation:** refreshed README/guide, engineering status and architecture/code review, ADR/engineering updates, and package READMEs.
- Repository presentation and governance: LICENSE (pending final approval), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY policy, issue/PR templates.

### Changed
- Project status moved from M0-only to **M1 in progress** with runnable preview slices and documented limitations.
- Runtime dependency tracking hardened to dedupe repeated reads within a single computation run.

### Notes
- Full IR/sourcemaps, broader compiler/JSX/component support, hydration/isomorphic rendering, dev server/HMR, publishable `dist` builds, and comprehensive MSF benchmark coverage are still pending (M1 hardening / M2+).
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
