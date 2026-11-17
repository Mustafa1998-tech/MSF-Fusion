# Compiler toolchain spike

Milestone 0 architecture-validation proof of concept. This package is **not**
framework runtime code and will not be published.

## Purpose

ADR-004 needs evidence about the pinned compiler toolchain before the MSF Fusion
compiler is designed. This spike answers three questions with real API calls:

1. What does the pinned TypeScript 7.0.2 package actually export?
2. Can the TypeScript unstable programmatic API parse and semantically check a
   real project?
3. Can Oxc parse TypeScript/TSX, strip types, transform JSX, and emit source
   maps in one call?

It is a feasibility probe, not a benchmark. The `elapsedMs` fields are single
diagnostic observations and are not statistically meaningful.

## Run

```bash
pnpm install --frozen-lockfile
pnpm spike:toolchain
pnpm --filter @mustafa-26112026/spike-compiler-toolchain run test
```

The probe writes `benchmarks/evidence/compiler-toolchain.json`.

## What is checked

| Probe | Expected result |
|---|---|
| `typescript` root export | version-only (`version`, `versionMajorMinor`) |
| `typescript/unstable/ast` | scanner and AST utilities are functions |
| `typescript/unstable/sync` | `API`, `Snapshot`, `Project`, `Program`, `Checker`, `Emitter` exist |
| TypeScript API end-to-end | opens `fixtures/project/tsconfig.json`, parses sources, reports semantic diagnostics for deliberate errors |
| Oxc `typescript-strip` | removes `: number` and keeps `export const answer` |
| Oxc `classic-jsx` | emits `h("div", ...)`, keeps the text child, produces a source map |
| Oxc `preserve-jsx` | keeps JSX syntax while removing TypeScript types |

## Caveats recorded by the probe

- The TypeScript APIs are under `unstable/*` and are a client/server protocol
  that spawns the native `tsc` server. They may change in minor releases.
- `SyntaxKind.EndOfFileToken` is not present on the runtime enum object; the
  scanner probe detects end-of-file through `formatSyntaxKind` instead.
- Oxc's `oxc-transform-react` package is React-specific. MSF Fusion would use
  the underlying Oxc parser/transform crates behind its own adapter, not this
  package's React Compiler.
