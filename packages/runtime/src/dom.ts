/**
 * Minimal DOM runtime helpers (Milestone 1).
 *
 * These are fine-grained primitives intended as compiler/runtime targets and
 * as a usable authoring API until the compiler JSX subset is ready.
 */
import {
  createEffect,
  createRoot,
  onCleanup,
  untrack,
  type Accessor,
  type Dispose,
} from "./core.ts";

export type MaybeAccessor<T> = T | Accessor<T>;

function isAccessor<T>(value: MaybeAccessor<T>): value is Accessor<T> {
  return typeof value === "function";
}

function read<T>(value: MaybeAccessor<T>): T {
  return isAccessor(value) ? value() : value;
}

export function render(
  component: () => Node | Node[] | string | number | null | undefined,
  container: Element,
): Dispose {
  return createRoot((dispose) => {
    container.textContent = "";
    append(container, component());
    onCleanup(() => {
      container.textContent = "";
    });
    return dispose;
  });
}

export function mount(
  node: Node,
  container: Element,
  anchor?: Node | null,
): void {
  container.insertBefore(node, anchor ?? null);
}

function toNode(value: unknown): Node | null {
  if (value == null || value === false || value === true) return null;
  if (value instanceof Node) return value;
  if (Array.isArray(value)) {
    const fragment = document.createDocumentFragment();
    for (const item of value) append(fragment, item);
    return fragment;
  }
  return document.createTextNode(String(value));
}

export function append(parent: Node, value: unknown): void {
  const node = toNode(value);
  if (node) parent.appendChild(node);
}

export function template<T extends Element = Element>(html: string): () => T {
  let cached: HTMLTemplateElement | null = null;
  return () => {
    if (!cached) {
      cached = document.createElement("template");
      cached.innerHTML = html.trim();
    }
    return cached.content.firstElementChild!.cloneNode(true) as T;
  };
}

export function setText(node: Text, value: MaybeAccessor<unknown>): void {
  if (isAccessor(value)) {
    createEffect(() => {
      node.data = value() == null ? "" : String(value());
    });
  } else {
    node.data = value == null ? "" : String(value);
  }
}

export function insert(
  parent: Node,
  value: MaybeAccessor<unknown>,
  anchor: Node | null = null,
): void {
  if (!isAccessor(value)) {
    const node = toNode(value);
    if (node) parent.insertBefore(node, anchor);
    return;
  }

  let current: Node | Node[] | null = null;
  createEffect(() => {
    const nextValue = value();
    // remove previous
    if (Array.isArray(current)) {
      for (const n of current) n.parentNode?.removeChild(n);
    } else if (current) {
      current.parentNode?.removeChild(current);
    }

    if (nextValue == null || nextValue === false || nextValue === true) {
      current = null;
      return;
    }

    if (Array.isArray(nextValue)) {
      const nodes: Node[] = [];
      for (const item of nextValue) {
        const n = toNode(item);
        if (n) {
          nodes.push(n);
          parent.insertBefore(n, anchor);
        }
      }
      current = nodes;
      return;
    }

    const node = toNode(nextValue);
    if (node) {
      parent.insertBefore(node, anchor);
      current = node;
    } else {
      current = null;
    }
  });
}

export function setAttribute(
  el: Element,
  name: string,
  value: MaybeAccessor<unknown>,
): void {
  const apply = (v: unknown) => {
    if (v == null || v === false) {
      el.removeAttribute(name);
    } else if (v === true) {
      el.setAttribute(name, "");
    } else {
      el.setAttribute(name, String(v));
    }
  };
  if (isAccessor(value)) {
    createEffect(() => apply(value()));
  } else {
    apply(value);
  }
}

export function setProperty(
  el: Element,
  name: string,
  value: MaybeAccessor<unknown>,
): void {
  const apply = (v: unknown) => {
    (el as any)[name] = v;
  };
  if (isAccessor(value)) {
    createEffect(() => apply(value()));
  } else {
    apply(value);
  }
}

export function addEventListener(
  el: Element,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void {
  el.addEventListener(type, handler, options);
  onCleanup(() => el.removeEventListener(type, handler, options));
}

export function show<T extends Node>(
  when: MaybeAccessor<unknown>,
  renderFn: () => T,
  fallback?: () => T,
): Accessor<T | null> {
  return () => (read(when) ? renderFn() : fallback ? fallback() : null);
}

/**
 * Simple reactive list renderer (keyed by index by default, or by key fn).
 * For Milestone 1 this provides a usable primitive; compiler can target more
 * optimized strategies later.
 */
export function For<T>(props: {
  each: MaybeAccessor<readonly T[] | T[] | undefined | null>;
  children: (item: T, index: Accessor<number>) => Node;
}): Accessor<Node[]> {
  return () => {
    const list = (read(props.each) ?? []) as readonly T[];
    const out: Node[] = [];
    // Simplified implementation: recreates nodes when list identity/content changes
    // in the tracking context. A keyed diff can replace this later.
    for (let i = 0; i < list.length; i++) {
      const item = list[i] as T;
      const node = untrack(() => props.children(item, () => i));
      out.push(node);
    }
    return out;
  };
}
