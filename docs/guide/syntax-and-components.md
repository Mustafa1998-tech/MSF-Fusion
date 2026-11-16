# Syntax & components

> **Status:** A compiler-backed JSX/component syntax is **not implemented yet**. Today you can build UI with **manual runtime APIs** (`@msf/runtime/dom` and `@msf/runtime/server`). The compiler-oriented examples below are **proposed**.

## Current authoring (implemented preview)

### DOM (fine-grained bindings)

```ts
import { createSignal } from "@msf/runtime";
import { insert, render, setAttribute } from "@msf/runtime/dom";

render(() => {
  const [count, setCount] = createSignal(0);
  const section = document.createElement("section");
  const p = document.createElement("p");
  const button = document.createElement("button");

  insert(p, () => `Count: ${count()}`);
  setAttribute(p, "data-count", () => String(count()));
  button.textContent = "Increment";
  button.addEventListener("click", () => setCount((n) => n + 1));

  section.append(p, button);
  return section;
}, document.getElementById("app")!);
```

### Lists (current helper)

`@msf/runtime/dom` provides `list(parent, items, keyFn?, mapFn)` for keyed/non-keyed reconciliation helpers (preview API/behavior may evolve, especially for multi-root item rendering).

### SSR snapshot

```ts
import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";

function CounterCard() {
  const [count] = createSignal(0);
  return h("section", { class: "counter" }, h("p", null, "Count: ", count()));
}

const html = renderToString(() => CounterCard());
```

`@msf/runtime/server` escapes text/attribute values by default. It is **not** yet a full isomorphic component/hydration system.

## Proposed compiler/component syntax (not implemented)

The final authoring syntax (JSX subset, directives, or other forms) will be implemented with the compiler/IR milestone. Illustrative direction:

```tsx
// Proposed — not runnable yet
import { createSignal } from "@msf/runtime";

export function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <section>
      <p>Count: {count()}</p>
      <button onClick={() => setCount((n) => n + 1)}>Increment</button>
    </section>
  );
}
```

### Planned capabilities
- Typed props/components and compiler diagnostics
- Control flow primitives or compiled equivalents (`Show`, `For`, keyed updates) with correct disposal
- Events/refs/lifecycle patterns aligned with ownership model
- Source maps and readable generated output

## ملخص بالعربية
حالياً تُبنى الواجهات يدوياً عبر واجهات DOM/SSR المنفذة (معاينة). صياغة المكونات/JSX المدعومة بالمترجم **مقترحة ولم تُنفذ بعد** وستُحدَّد مع مرحلة IR/codegen.