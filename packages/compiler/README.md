# `@msf/compiler` (developer preview)

Compiler package for MSF Fusion.

> **Status:** Milestone 1 preview. A real **`jsx-dom-v1` subset compiler** is implemented and tested; full IR/semantic analysis/sourcemaps and broader JSX/component support are pending.

## Current capabilities
- `compile({ filename, source })` transforms supported `.tsx/.jsx` intrinsic JSX into `@msf/runtime/dom` helper calls
- Supported subset (v1): intrinsic elements, nested children, text/`{expr}` children, static and dynamic attributes, basic `onEvent` handlers
- Diagnostics for unsupported cases (e.g. component tags, spread/ref in subset)
- Non-JSX files passed through

## Not implemented yet
- Framework-owned Reactive IR and lowering pipeline
- TypeScript semantic adapter integration (per ADR-004)
- Sourcemaps, component compilation, control flow, fragments edge cases, full JSX/TS coverage

See `docs/adr/ADR-004-compiler-toolchain.md` and `docs/engineering/implementation-plan.md`.