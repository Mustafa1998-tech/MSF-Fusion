/**
 * Minimal DOM runtime helpers (Milestone 1).
 *
 * These are fine-grained primitives intended as compiler/runtime targets and
 * as a usable authoring API until the compiler JSX subset is ready.
 */
import {
  createEffect,
  createRoot,
  createSignal,
  onCleanup,
  runWithOwner,
  untrack,
  type Accessor,
  type Dispose,
} from "./core.js";

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

  let current: Node[] = [];
  const clear = () => {
    for (let i = current.length - 1; i >= 0; i--) {
      current[i]!.parentNode?.removeChild(current[i]!);
    }
    current = [];
  };
  createEffect(() => {
    clear();
    const nextValue = value();
    if (nextValue == null || nextValue === false || nextValue === true) return;
    const items = Array.isArray(nextValue) ? nextValue : [nextValue];
    for (const item of items) {
      const node = toNode(item);
      if (!node) continue;
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        const children = Array.from(node.childNodes);
        parent.insertBefore(node, anchor);
        current.push(...children);
      } else {
        parent.insertBefore(node, anchor);
        current.push(node);
      }
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

// (reserved for future diff helpers)

/**
 * Reactive list renderer. If `key` is provided, performs keyed reconciliation
 * to preserve DOM nodes/identity when possible.
 */
export function list<T>(
  parent: Node,
  each: MaybeAccessor<readonly T[] | T[] | undefined | null>,
  mapFn: (item: Accessor<T>, index: Accessor<number>) => Node | Node[] | DocumentFragment,
  keyFn?: (item: T, index: number) => unknown,
  anchor: Node | null = null,
): void {
  const normalize = (value: Node | Node[] | DocumentFragment): Node[] => {
    if (Array.isArray(value)) return value;
    if (value.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return Array.from(value.childNodes);
    return [value];
  };

  if (!keyFn) {
    // non-keyed: simple replace (fine-grained per-item signals not tracked here)
    insert(parent, () => {
      const items = (read(each) ?? []) as readonly T[];
      return items.map((item, i) => untrack(() => normalize(mapFn(() => item, () => i) as Node)));
    }, anchor);
    return;
  }

  type Entry = {
    key: unknown;
    nodes: Node[];
    dispose: Dispose;
    setItem: (v: T | ((p: T) => T)) => T;
    setIndex: (v: number | ((p: number) => number)) => number;
  };

  let entries: Entry[] = [];
  let keyToEntry = new Map<unknown, Entry>();

  const removeEntry = (entry: Entry) => {
    entry.dispose();
    for (const node of entry.nodes) node.parentNode?.removeChild(node);
  };

  createEffect(() => {
    const items = (read(each) ?? []) as readonly T[];
    const newEntries: Entry[] = new Array(items.length);
    const newMap = new Map<unknown, Entry>();

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as T;
      const key = keyFn(item, i);
      let entry = keyToEntry.get(key);
      if (!entry) {
        let nodes!: Node[];
        let dispose!: Dispose;
        let getItem!: Accessor<T>;
        let setItem!: (v: T | ((p: T) => T)) => T;
        let getIndex!: Accessor<number>;
        let setIndex!: (v: number | ((p: number) => number)) => number;
        dispose = runWithOwner(null, () => createRoot((d) => {
          [getItem, setItem] = createSignal(item);
          [getIndex, setIndex] = createSignal(i);
          const created = mapFn(getItem, getIndex);
          nodes = normalize(created);
          return d;
        }));
        entry = {
          key,
          nodes,
          dispose,
          setItem,
          setIndex,
        };
      } else {
        entry.setItem(item);
        entry.setIndex(i);
      }
      newEntries[i] = entry;
      newMap.set(key, entry);
    }

    // remove stale
    for (const [key, entry] of keyToEntry) {
      if (!newMap.has(key)) removeEntry(entry);
    }

    // reorder/insert — walk backwards; anchor after last node so iteration inserts correctly
    let currentAnchor = anchor;
    for (let i = newEntries.length - 1; i >= 0; i--) {
      const entry = newEntries[i]!;
      for (let j = entry.nodes.length - 1; j >= 0; j--) {
        const node = entry.nodes[j]!;
        if (node.nextSibling !== currentAnchor || node.parentNode !== parent) {
          parent.insertBefore(node, currentAnchor);
        }
        currentAnchor = node;
      }
    }

    entries = newEntries;
    keyToEntry = newMap;
  });

  onCleanup(() => {
    for (const entry of entries) removeEntry(entry);
    entries = [];
    keyToEntry.clear();
  });
}

/** Accessor-returning convenience wrapper for non-keyed lists. */
export function For<T>(props: {
  each: MaybeAccessor<readonly T[] | T[] | undefined | null>;
  children: (item: T, index: Accessor<number>) => Node;
}): Accessor<Node[]> {
  return () => {
    const items = (read(props.each) ?? []) as readonly T[];
    const out: Node[] = [];
    for (let i = 0; i < items.length; i++) {
      out.push(untrack(() => props.children(items[i] as T, () => i)));
    }
    return out;
  };
}





