# Syntax & components

> **Status:** Authoring is **plain TypeScript/JavaScript** against the preview runtime. **Function components** and **`Show`/`For` control-flow components** are supported by the isomorphic view layer. A compiler-backed JSX pipeline exists only as a **subset** (`jsx-dom-v1` / `jsx-universal-v1`) — not a complete TSX subset.

## Current authoring (implemented preview)

### Control-flow components (`Show` / `For`)

```ts
import { createSignal } from "@mustafa-26112026/runtime";
import { h, Show, For } from "@mustafa-26112026/runtime/server"; // or @mustafa-26112026/runtime/universal
import { renderToString } from "@mustafa-26112026/runtime/server";
import { mount } from "@mustafa-26112026/runtime/universal";

function Conditional() {
  const [on, setOn] = createSignal(true);
  return h("section", null,
    h(Show, { when: () => on(), children: [h("p", null, "shown")] }),
    h("button", { onClick: () => setOn((v) => !v) }, "toggle"),
  );
}

renderToString(() => Conditional());
mount(() => Conditional(), container);
```

`For` renders a list from an accessor; `Show` toggles a branch; both rebuild reactively (items aren't keyed-identity stable by default — use `@mustafa-26112026/runtime/dom`'s `list(..., keyFn)` for keyed identity).

### Function components (isomorphic view layer)

### Function components (isomorphic view layer)

```ts
import { createSignal } from "@mustafa-26112026/runtime";
import { h } from "@mustafa-26112026/runtime/server";
import { mount, hydrate } from "@mustafa-26112026/runtime/universal";
import { renderToString } from "@mustafa-26112026/runtime/server";

function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = createSignal(initial);
  return h("section", { class: "counter" },
    h("p", null, () => `Count: ${count()}`),
    h("button", { onClick: () => setCount((n) => n + 1) }, "Inc"),
  );
}

// SSR
const html = renderToString(() => h(Counter, { initial: 5 }));

// CSR mount
mount(() => h(Counter, { initial: 5 }), container);

// Adopt server markup (falls back to fresh mount on mismatch)
hydrate(() => h(Counter, { initial: 5 }), container);
```

- `h(Component, props, ...children)` resolves components identically on server (string render), browser mount, and hydrate.
- Dynamic leaves are accessor functions `() => expr` — evaluated during SSR/`mount` and updated reactively by `hydrate`.

### DOM (fine-grained bindings)

```ts
import { createSignal } from "@mustafa-26112026/runtime";
import { insert, render, setAttribute } from "@mustafa-26112026/runtime/dom";

render(() => {
  const [count, setCount] = createSignal(0);
  const section = document.createElement("section");
  const p = document.createElement("p");
  insert(p, () => `Count: ${count()}`);
  setAttribute(p, "data-count", () => String(count()));
  section.append(p);
  return section;
}, document.getElementById("app")!);
```

### Lists (current helper)

`@mustafa-26112026/runtime/dom` provides `list(parent, items, keyFn?, mapFn)` — keyed reconciliation for `Node`, `Node[]`, or `DocumentFragment` item roots, preserving identity across reorders, and disposing removed item scopes.

### SSR snapshot

```ts
import { createSignal } from "@mustafa-26112026/runtime";
import { h, renderToString } from "@mustafa-26112026/runtime/server";

function CounterCard() {
  const [count] = createSignal(0);
  return h("section", { class: "counter" }, h("p", null, "Count: ", count()));
}

const html = renderToString(() => CounterCard());
```

`@mustafa-26112026/runtime/server` escapes text/attribute values by default. `@mustafa-26112026/runtime/universal` adds the isomorphic view layer with mount and hydration. The compiler emits this view code only for explicitly supported JSX subsets.

## Compiler subset (current preview)

```bash
node packages/dev/src/cli.ts status
node packages/dev/src/cli.ts compile path/to/file.tsx --out dist-compiled
```

Two targets, same JSX subset:
- `target: "dom"` (default) — lowers intrinsic JSX to `@mustafa-26112026/runtime/dom` calls (`document.createElement`, `setAttribute`, `insert`, `addEventListener`)
- `target: "universal"` — lowers to `@mustafa-26112026/runtime/universal` view descriptors (`h("section", ...)`), usable for SSR **and** mount/hydrate

Supported subset (v1): intrinsic elements, nested elements/children, text + `{expr}` child accessors, static/dynamic attributes, basic `onEvent` handlers. Component tags are supported in the `universal` target.

Diagnostics for unsupported patterns: spread, `ref`, fragments edge-cases, non-intrinsic/component tags in the DOM target, and unknown JSX constructs.

## Proposed compiler/component syntax (not implemented)

Full TSX (control flow `Show`/`For`, refs, suspense/boundaries, sourcemaps, full TS analysis) is not implemented. The direction remains compiler-native lowering; the IR and semantic adapter are still pending.

## ملخص بالعربية
الصياغة الحالية: تأليف بـ TypeScript/JavaScript صريح + نواة جاهزة للتشغيل (DOM bindings / isomorphic view) + اختيار مترجم `dom` أو `universal`. المكونات الدالية تقرأ خادماً/ترطيباً/بدئاً عبر نفس الشجرة. JSX الكامل (تحكم، refs، sourcemaps، تحليل دلالي) وتقويلات مترجم متقدمة **غير منفذة**.