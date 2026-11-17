# Counter basic example (developer preview)

Demonstrates the **current runnable** MSF runtime APIs:
- reactive kernel (`createSignal`)
- DOM bindings (`@msf/runtime/dom`)
- SSR string snapshot (`@msf/runtime/server`)

## Run SSR example

```bash
pnpm install
node examples/counter-basic/src/ssr.ts
```

> Requires Node.js with TypeScript execution support as used in this repository environment.

## Browser usage
`src/main.ts` exports `mountCounter(container)` showing fine-grained updates. Bundle and serve it in a browser app to try it interactively (Vite or any ESM bundler).

## Status
This is a developer-preview example for Milestone 1 foundations, not a stable public API. Compiler/JSX subset, routing, and full SSR/hydration are in progress/planned.
