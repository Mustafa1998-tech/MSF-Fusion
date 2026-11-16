# Changelog

All notable changes to this repository will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). MSF Fusion has not published framework releases yet; entries track repository milestones and evidence.

## [Unreleased]

### Added
- Professional repository presentation: refreshed README, LICENSE (pending final approval), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY policy, issue/PR templates, and CI workflow for benchmark-lab/toolchain checks.

## [0.0.0-m0] - 2026-11-16

### Added
- **Architecture & governance:** system overview with Mermaid diagrams, ADR-001–ADR-005, security requirements and threat model, performance requirements, risks, quality gates, roadmap, MVP scope, and approval-gated implementation plan (English with Arabic summaries).
- **Benchmark laboratory (`@msf/bench-runner`):** pinned competitor baselines (React, Solid, Svelte, Vue, Preact Signals), environment capture, micro/SSR/bundle/DOM suites, raw JSON + Markdown reporting, and unit tests.
- **Final baseline evidence:** sequential full-sample run `2026-11-16_06-39-52-525Z-5om9` (`benchmarks/results/*.json`, `benchmarks/reports/*.md`).
- **Compiler toolchain spike (`@msf/spike-compiler-toolchain`):** TypeScript 7 unstable API and Oxc transform feasibility probe with recorded evidence (`benchmarks/evidence/compiler-toolchain.json`).
- **Repository scaffolding:** pnpm workspace, strict TypeScript base config, editor/git settings, and documentation index.

### Notes
- No MSF Fusion framework runtime/compiler/server implementation is included.
- No performance superiority claims are made; baseline results are environment-specific and documented with exclusions/limitations.
- License is pending explicit approval (`UNLICENSED` metadata; all rights reserved per `LICENSE`).
