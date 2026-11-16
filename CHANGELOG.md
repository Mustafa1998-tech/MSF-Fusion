# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published framework releases yet; entries track repository milestones and evidence.

## [Unreleased]

### Added
- **Runtime developer preview (M1 progress):** `@msf/runtime` with fine-grained reactive kernel (`createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, ownership/disposal), DOM helpers (`render`, `insert`, `setText`, `setAttribute`, `addEventListener`, `list` with keyed reconciliation), and SSR string renderer (`h`, `renderToString`, HTML escaping). Includes runtime tests (kernel/DOM/server).
- **Package scaffolds:** `@msf/contracts`, `@msf/compiler` (scaffold, not implemented), and `@msf/dev` (scaffold, not implemented).
- **Examples:** `examples/counter-basic` (runnable SSR snapshot) and `examples/counter-browser` (Vite interactive demo).
- **Documentation updates:** refreshed README, developer guide updated for runnable preview APIs, engineering status and architecture/code review docs.
- Professional repository presentation: LICENSE (pending final approval), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY policy, issue/PR templates.

### Changed
- Project status moved from M0-only to **M1 in progress** with documented preview scope and limitations.

### Notes
- Compiler/IR/codegen, JSX subset, hydration/isomorphic rendering, CLI/dev server, publishable `dist` builds, and MSF benchmark fixtures are still pending.
- No MSF Fusion performance superiority claims are made; baseline results remain environment-specific.

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
