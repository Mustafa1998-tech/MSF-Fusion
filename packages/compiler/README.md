# `@msf/compiler`

Compiler for the MSF Fusion JSX/TSX subset. Lowers supported JSX to either DOM runtime calls (`jsx-dom-v1`) or isomorphic view descriptors (`jsx-universal-v1`). The compiler itself is runtime-free.

> **Status: v0.1.0 — developer preview.** A real, tested subset compiler, not a full TypeScript/JSX pipeline. No sourcemaps or framework IR yet.

## Install

```bash
npm install @msf/compiler@0.1.0
```

## Usage

```ts
import { compile } from "@msf/compiler";

const result = compile({
  filename: "app.tsx",
  source: `const el = <button type="button" onClick={inc}>Count</button>;`,
  target: "jsx-universal-v1", // or "jsx-dom-v1"
});

result.code;        // lowered source
result.diagnostics; // { severity, code, message, ... }[]
result.meta;        // { transformed, subset }
```

## Targets

| Target | Output | Notes |
|---|---|---|
| `jsx-dom-v1` | `document.createElement` / `@msf/runtime/dom` calls | Intrinsic elements only; component tags produce `MSF_UNSUPPORTED_COMPONENT` |
| `jsx-universal-v1` | `h` / `fragment` view descriptors | Supports intrinsic elements, fragments, and component tags |

## Supported subset (v1)

- Intrinsic elements, nested children, text and `{expression}` children
- Static and dynamic attributes, boolean shorthand, `class`/`className`
- Fragments (`<>...</>`)
- `onEvent` handlers (`onClick`, `onInput`, …)
- Component tags on the universal target

## Not implemented yet

- Framework-owned Reactive IR and lowering pipeline
- TypeScript semantic adapter integration (ADR-004)
- Sourcemaps for generated code, watch mode, full JSX/TS coverage
- Compiler lowering of `Show`/`For` (they exist as runtime components today)

Unsupported constructs produce diagnostics rather than silent output. Repository and issue tracker: <https://github.com/Mustafa1998-tech/MSF-Fusion>

## License

MIT
