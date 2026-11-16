# Syntax & components (Proposed)

> **Proposed / not implemented.** The authoring syntax (JSX subset, template directives, or `.msf` SFC-style files) will be finalized during Milestone 1. Examples below illustrate the intended ergonomics and may change.

## Components

A component is a function that sets up reactive state/bindings and returns UI. The compiler analyzes supported patterns and lowers them to fine-grained runtime operations.

```tsx
// Proposed syntax — illustrative
import { signal } from "msf/runtime";

export function Greeting(props: { name: string }) {
  return <h1>Hello, {props.name}</h1>;
}

export function Counter() {
  const count = signal(0);
  return (
    <section>
      <p>Count: {count}</p>
      <button onClick={() => count.update((n) => n + 1)}>Increment</button>
    </section>
  );
}
```

**Intent:** components run to establish structure and reactive bindings; updates are driven by dependencies, not full component re-execution as a diff strategy.

## Props and typing

```tsx
// Proposed syntax — illustrative
type UserCardProps = {
  id: string;
  name: string;
  onSelect?: (id: string) => void;
};

export function UserCard(props: UserCardProps) {
  return (
    <article class="card">
      <h2>{props.name}</h2>
      <button onClick={() => props.onSelect?.(props.id)}>Select</button>
    </article>
  );
}
```

Props are treated as inputs; reactivity of prop access/updates depends on the finalized component contract (static vs reactive props) and will be documented with compiler diagnostics.

## Expressions and bindings

```tsx
// Proposed syntax — illustrative
const title = signal("MSF");
const href = signal("/docs");
const disabled = signal(false);

<div title={title} data-mode="demo">
  <a href={href} aria-disabled={disabled}>Open</a>
</div>
```

- Text/attribute/property/event bindings update only when their dependencies change.
- The compiler distinguishes static vs dynamic parts to minimize runtime work.

## Conditional rendering

```tsx
// Proposed syntax — illustrative
import { Show } from "msf/runtime"; // or compiler intrinsic — TBD

<Show when={user()} fallback={<p>Signed out</p>}>
  {(u) => <p>Welcome, {u.name}</p>}
</Show>
```

An alternative compiler-directive or control-flow syntax may be chosen; the requirement is clear, analyzable branching with correct mount/unmount and disposal.

## Lists and keys

```tsx
// Proposed syntax — illustrative
import { For } from "msf/runtime"; // or compiler intrinsic — TBD

<For each={items()} key={(item) => item.id}>
  {(item, index) => (
    <li>
      {index()}: {item.label}
    </li>
  )}
</For>
```

Keyed list updates must preserve identity, minimize DOM moves, and dispose removed item scopes correctly.

## Events

```tsx
// Proposed syntax — illustrative
<form
  onSubmit={(e) => {
    e.preventDefault();
    save();
  }}
>
  <input onInput={(e) => name.set(e.currentTarget.value)} />
  <button type="submit">Save</button>
</form>
```

Event listeners are bound once (where possible) and cleaned up on disposal; handler ergonomics and typing will follow DOM/TS standards.

## Refs (DOM access)

```tsx
// Proposed syntax — illustrative
import { onMount } from "msf/runtime";

let input!: HTMLInputElement;

<input ref={input} />;
onMount(() => input.focus());
```

Direct DOM access is explicit and scoped to lifecycle hooks; compiler may provide safe patterns for common cases.

## Composition and children

```tsx
// Proposed syntax — illustrative
function Panel(props: { title: string; children?: unknown }) {
  return (
    <section>
      <header>{props.title}</header>
      <div>{props.children}</div>
    </section>
  );
}

<Panel title="Settings">
  <p>Content</p>
</Panel>
```

Children/slots API (functions, static nodes, or compiled slots) will be specified to preserve fine-grained updates without accidental over-rendering.

## Styling (planned)

CSS strategy (scoped styles, CSS modules, utility integration, or compiler-assisted extraction) is not finalized in M0. The framework will prioritize predictable output, SSR compatibility, and security (e.g. no unsafe inline-style injection by default).

## TypeScript experience (goal)

- Typed props, events, refs, and context/injection APIs
- Compiler diagnostics for invalid bindings, boundary violations, and unsupported patterns
- Source maps and readable generated output for debugging

## ملخص بالعربية
صياغة المكونات والعناصر المقترحة تهدف إلى ربط دقيق بالتفاعلية (نص/خصائص/أحداث/قوائم مفاتيح/شروط) مع أنواع TypeScript وتشخيصات مترجم. الصيغة النهائية (JSX subset أو بديل) ستُعتمد أثناء التنفيذ وليست قابلة للتشغيل حالياً.
