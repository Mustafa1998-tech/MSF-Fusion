# `@msf/compiler` (scaffold)

Planned compiler package for MSF Fusion.

> **Status:** scaffold only (not implemented). `compile()` currently returns `MSF_COMPILER_NOT_IMPLEMENTED`.

## Planned responsibilities (per ADR-004)
- Parse/transform pipeline (Oxc) and TypeScript semantic adapter boundary
- Framework-owned Reactive IR
- Lowering/codegen to runtime targets with diagnostics and source maps
- Supported JSX/authoring subset for Milestone 1

See `docs/adr/ADR-004-compiler-toolchain.md`, `docs/engineering/implementation-plan.md`, and `spikes/compiler-toolchain/`.
