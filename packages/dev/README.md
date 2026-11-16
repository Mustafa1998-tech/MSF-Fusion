# `@msf/dev` (developer preview)

Developer tooling package for MSF Fusion.

> **Status:** Milestone 1 preview. Provides compile APIs/CLI for the current compiler subset; dev server/HMR and full build workflows are pending.

## Current capabilities
- `compileFile(inputFile, outDir?)`, `compilePath(inputPath, outDir?)`
- `getDevStatus()`
- CLI: `node packages/dev/src/cli.ts status|compile <input> [--out <dir>]`

## Not implemented yet
- Dev server, HMR, watch mode
- Project scaffolding/templates
- Integrated build/check/preview pipeline and rich diagnostics UX

See `docs/engineering/implementation-plan.md` and `docs/engineering/status.md`.