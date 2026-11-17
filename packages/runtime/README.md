# `@msf/runtime`

Fine-grained reactive runtime for **MSF Fusion**: signals/memos/effects with owner-based disposal, DOM bindings, an isomorphic view layer, SSR string rendering, and hydration.

> **Status: v0.1.0 — developer preview.** Tested in-repo and in a real Chromium browser; not yet validated in production applications. APIs may change before 1.0.

## Install

```bash
npm install @msf/runtime@0.1.0
```

## Entry points

| Import | Contents |
|---|---|
| `@msf/runtime` | `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`, plus the view helpers `h`/`fragment`/`text` |
| `@msf/runtime/dom` | `render`, `mount` (DOM), `template`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, keyed `For` |
| `@msf/runtime/server` | `h`, `fragment`, `text`, `Show`, `For`, `renderNode`, `renderToString`, `escapeHtml` |
| `@msf/runtime/universal` | `h`, `fragment`, `text`, `Show`, `For`, `mount`, `hydrate` |

## Example — reactive counter

```ts
import { batch, createMemo, createSignal } from "@msf/runtime";
import { insert, render } from "@msf/runtime/dom";

render(() => {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);
  const button = document.createElement("button");
  insert(button, () => `Count ${count()} / ${doubled()}`);
  button.onclick = () => batch(() => setCount((n) => n + 1));
  return button;
}, document.getElementById("app")!);
```

## Example — SSR + hydration, one component tree

```ts
// shared.ts
import { h, createSignal } from "@msf/runtime";

export function App() {
  const [count, setCount] = createSignal(0);
  return h("button", { type: "button", onClick: () => setCount((n) => n + 1) },
    () => `Count: ${count()}`,
  );
}

// server.ts
import { renderToString } from "@msf/runtime/server";
const html = renderToString(() => h(App));

// client.ts
import { hydrate } from "@msf/runtime/universal";
hydrate(() => h(App), document.getElementById("app")!);
```

`hydrate` adopts existing SSR markup, attaches listeners, and falls back to a fresh `mount` on structural mismatch.

## Semantics worth knowing

- Signal setters treat function arguments as updaters: `setCount((n) => n + 1)`.
- Dependency tracking dedupes repeated reads within one effect run; owner disposal is O(1).
- Runaway nested updates are guarded: `MSF_REACTIVE_CYCLE` is thrown past a depth of 1000.
- Keyed `list()`/`For` reconcile items that may render multiple root nodes or a `DocumentFragment`.
- SSR escapes text and attribute values by default.

## Known limitations (preview)

- No router, data layer, server actions, streaming SSR, or resume.
- Compiler support is a JSX subset; `Show`/`For` are runtime components and are not lowered by `@msf/compiler` yet.
- Hydration is preview-grade. Static SSR markup is adopted and listeners attach; complex reactive regions may still need `mount` while edge cases are hardened.
- DOM-only concerns (event delegation, portals) are not implemented.

## Development

```bash
pnpm --filter @msf/runtime run typecheck
pnpm --filter @msf/runtime run test
```

Repository and issue tracker: <https://github.com/Mustafa1998-tech/MSF-Fusion>

## License

MIT
