# `@msf/contracts` (scaffold)

Shared contracts and interfaces for MSF Fusion packages.

> **Status:** Milestone 1 scaffold. Intended to hold stable boundaries (diagnostics, compile requests/results, IR/contracts as they emerge) so runtime/compiler/dev do not depend on each other's internals.

## Current exports
- `Disposable`
- `Diagnostic`
- `CompileRequest`, `CompileResult`
- `MSF_CONTRACTS_VERSION`

## Notes
- APIs will expand as compiler/IR and tooling are implemented.
- Keep this package dependency-light and boundary-focused.
