# Browser counter example (Vite + MSF runtime)

Interactive browser demo using the current **real** MSF runtime preview (`createSignal`, `createMemo`, `batch`, DOM bindings).

## Run

```bash
pnpm install
pnpm --filter @msf/example-counter-browser dev
```

Then open the printed local URL (default `http://localhost:5174`).

## Build

```bash
pnpm --filter @msf/example-counter-browser build
pnpm --filter @msf/example-counter-browser preview
```

## Notes
- Uses fine-grained reactive DOM updates (no virtual DOM diffing in the runtime kernel).
- JSX/compiler toolchain is not required for this example; a compiler subset is planned.
- APIs are developer-preview and may change before stable release.
