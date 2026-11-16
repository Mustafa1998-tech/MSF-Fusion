# `@msf/runtime` (developer preview)

Reactive runtime primitives for MSF Fusion (Milestone 1 preview).

> **Status:** experimental, in active development. APIs may change. Packages currently export source `.ts` for monorepo use and are not published.

## Exports

- `@msf/runtime` — core reactivity
  - `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`
  - `getOwner`, `runWithOwner`, `flushSync`
- `@msf/runtime/dom` — DOM helpers
  - `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`
- `@msf/runtime/server` — SSR string rendering
  - `h`, `renderNode`, `renderToString`, `escapeHtml`

## Example

```ts
import { batch, createMemo, createSignal } from "@msf/runtime";
import { insert, render } from "@msf/runtime/dom";

render(() => {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);
  const el = document.createElement("button");
  insert(el, () => `Count ${count()} / ${doubled()}`);
  el.onclick = () => batch(() => setCount((n) => n + 1));
  return el;
}, document.getElementById("app")!);
```

## Notes / limitations
- Setter treats function arguments as updater functions (preview semantics).
- DOM `list` keyed reconciliation is a preview helper; multi-root mapped items may require constraints/future support.
- SSR renderer is a snapshot string renderer (no hydration/isomorphic component model yet).
- No compiler integration yet; JSX subset is planned.

## Development

```bash
pnpm --filter @msf/runtime run typecheck
pnpm --filter @msf/runtime run test
```
