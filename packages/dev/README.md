# `@msf/dev`

Developer tooling for MSF Fusion: compile and check the supported JSX/TSX subset from the command line.

> **Status: v0.1.0 — developer preview.** Diagnostics and per-file compilation only; no dev server, HMR, or watch mode yet.

## Install

```bash
npm install --save-dev @msf/dev@0.1.0
```

## CLI

```bash
msf-dev status
msf-dev check <file-or-directory> [--target dom|universal]   # default: dom
msf-dev compile <file-or-directory> [--out <dir>] [--target dom|universal]
```

`--target` selects the compiler target (`jsx-dom-v1` by default, `jsx-universal-v1` for SSR/hydration paths).

## API

```ts
import { checkFile, checkPath, compileFile, compilePath, getDevStatus } from "@msf/dev";

const results = await checkPath("src", { target: "universal" }); // CheckResult[]: { file, ok, transformed, diagnostics }
const one = await checkFile("src/app.tsx", { target: "universal" }); // CheckResult
const emitted = await compileFile("src/app.tsx", "out", { target: "universal" }); // CompileFileResult
```

## Not implemented yet

- Dev server, HMR, watch mode
- Project scaffolding/templates
- Integrated build/preview pipeline and richer diagnostics UX

Repository and issue tracker: <https://github.com/Mustafa1998-tech/MSF-Fusion>

## License

MIT
