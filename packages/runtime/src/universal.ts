/**
 * Isomorphic DOM mounting and hydration for MSF Fusion views.
 *
 * - `mount` builds a fresh DOM tree from a ViewNode descriptor.
 * - `hydrate` adopts the server-rendered DOM in-place, attaching listeners and
 *   reactive bindings. Falls back to a fresh mount when the server markup
 *   does not match the view tree.
 */
import { createEffect, createRoot, onCleanup, type Dispose } from "./core.js";
import {
  addEventListener,
  setAttribute,
  setText,
} from "./dom.js";
import {
  isFragment,
  isText,
  isElement,
  isComponent,
  resolveComponent,
  type ViewChild,
  type ViewElement,
  type ViewFragment,
  type ViewMaybeAccessor,
  type ViewNode, type ViewText, type ViewComponentInstance } from "./view.js";

export { h, fragment, text, Show, For } from "./view.js";
export type { ViewChild, ViewElement, ViewFragment, ViewMaybeAccessor, ViewNode, ViewText, ViewComponent, ComponentProps, ViewComponentInstance, MaybeAccessor } from "./view.js";

function isAccessor(value: unknown): value is () => unknown {
  return typeof value === "function";
}

function toDomNode(
  node: ViewNode | ViewChild,
  cursor?: { i: number },
): Node[] {
  if (node == null || node === false || node === true) return [];
  if (typeof node === "string" || typeof node === "number") {
    return [document.createTextNode(String(node))];
  }
  if (Array.isArray(node)) {
    const out: Node[] = [];
    for (const child of node) out.push(...toDomNode(child as ViewChild, cursor));
    return out;
  }
  if (isText(node as ViewText)) {
    const textNode = node as ViewText;
    const el = document.createTextNode("");
    const value = textNode.value as ViewMaybeAccessor<unknown>;
    if (isAccessor(value)) {
      setText(el, value as () => unknown);
    } else {
      el.data = value == null ? "" : String(value);
    }
    return [el];
  }
  if (isFragment(node as ViewFragment)) {
    const fragmentNode = document.createDocumentFragment();
    const children = (node as ViewFragment).children;
    const created = children.map((child) => toDomNode(child, cursor)).flat();
    for (const child of created) fragmentNode.appendChild(child);
    return [fragmentNode];
  }
  if (isComponent(node as ViewNode)) {
    const resolved = resolveComponent(node as ViewComponentInstance);
    return toDomNode(resolved, cursor);
  }
  if (isElement(node as ViewElement)) {
    const element = node as ViewElement;
    const el = document.createElement(element.tag);
    applyProps(el, element.props);
    mountChildren(el, element.children ?? []);
    return [el];
  }
  return [];
}

function mountChildren(parent: Element | DocumentFragment, children: ViewChild[]): void {
  for (const child of children) {
    appendChild(parent, child);
  }
}

/** Reactive children mount: evaluates accessor and mounts/inserts the result, replacing previous nodes. */
function insertReactiveChildren(parent: Element | DocumentFragment, accessor: () => ViewChild | ViewChild[] | null | undefined): void {
  const host = parent;
  let current: Node[] = [];
  let cleanup: Dispose | null = null;
  const clear = () => {
    for (let i = current.length - 1; i >= 0; i--) {
      current[i]!.parentNode?.removeChild(current[i]!);
    }
    current = [];
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  };
  createEffect(() => {
    clear();
    const v = accessor();
    if (v == null || v === false) return;
    const children = Array.isArray(v) ? v : [v as ViewChild];
    for (const child of children) {
      const nodes = toDomNode(child as ViewNode);
      for (const node of nodes) {
        host.appendChild(node);
        if (node.parentNode) current.push(node);
      }
    }
  });
  onCleanup(clear);
}

function appendChild(parent: Element | DocumentFragment, child: ViewChild): void {  if (child == null || child === false || child === true) return;
  if (isAccessor(child)) {
    insertReactiveChildren(parent, child as () => ViewChild);
    return;
  }
  if (Array.isArray(child)) {
    for (const inner of child) appendChild(parent, inner);
    return;
  }
  if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }
  if (isComponent(child as ViewNode)) {
    const resolved = resolveComponent(child as ViewComponentInstance);
    appendChild(parent, resolved);
    return;
  }
  const nodes = toDomNode(child as ViewNode);
  for (const node of nodes) parent.appendChild(node);
}

function applyProps(el: Element, props: ViewElement["props"]): void {
  if (!props) return;
  for (const [name, value] of Object.entries(props)) {
    if (name === "children") continue;
    if (name.startsWith("on") && name.length > 2) {
      const type = name.slice(2).toLowerCase();
      if (typeof value === "function") {
        addEventListener(el, type, value as EventListener);
      }
      continue;
    }
    const attr = name === "className" ? "class" : name;
    if (isAccessor(value)) {
      setAttribute(el, attr, value as () => unknown);
    } else {
      setAttribute(el, attr, value as unknown);
    }
  }
}

export function mount(
  view: () => ViewNode | (() => ViewChild | null | undefined),
  container: Element,
): Dispose {
  return createRoot((dispose) => {
    container.textContent = "";
    const v = view();
    if (typeof v === "function") {
      appendChild(container, v as () => ViewChild | null | undefined);
    } else {
      mountChildren(container, [v]);
    }
    onCleanup(() => {
      container.textContent = "";
    });
    return dispose;
  });
}

interface HydrationState {
  mismatch: boolean;
}

function adoptElement(
  expected: ViewElement,
  el: Element,
  state: HydrationState,
): void {
  if (el.tagName.toLowerCase() !== expected.tag.toLowerCase()) {
    state.mismatch = true;
    return;
  }
  applyProps(el, expected.props);
  const children = expected.children ?? [];
  const domChildren = Array.from(el.childNodes).filter(
    (child) => !(child.nodeType === Node.TEXT_NODE && (child.textContent ?? "").trim() === ""),
  );
  let domIndex = 0;
  for (const child of children) {
    domIndex = adoptChild(child, el, domChildren, domIndex, state);
  }
}

function adoptChild(
  child: ViewChild,
  parent: Element,
  domChildren: Node[],
  domIndex: number,
  state: HydrationState,
): number {
  if (child == null || child === false || child === true) return domIndex;
  if (isAccessor(child)) {
    // Inline text accessors: adopt the matching text node; otherwise mount the reactive subtree
    const domNode = domChildren[domIndex];
    if (domNode && domNode.nodeType === Node.TEXT_NODE) {
      setText(domNode as Text, child as () => unknown);
      return domIndex + 1;
    }
    insertReactiveChildren(parent, child as () => ViewChild);
    return domIndex;
  }
  if (Array.isArray(child)) {
    for (const inner of child) domIndex = adoptChild(inner, parent, domChildren, domIndex, state);
    return domIndex;
  }
  if (typeof child === "string" || typeof child === "number") {
    return domIndex + 1; // SSR already materialized this text node
  }
  if (isText(child as ViewText)) {
    const domNode = domChildren[domIndex];
    if (domNode && domNode.nodeType === Node.TEXT_NODE) {
      const value = (child as ViewText).value;
      if (isAccessor(value)) {
        setText(domNode as Text, value as () => unknown);
      }
      return domIndex + 1;
    }
    state.mismatch = true;
    return domIndex;
  }
  if (isFragment(child as ViewFragment)) {
    for (const inner of (child as ViewFragment).children) {
      domIndex = adoptChild(inner, parent, domChildren, domIndex, state);
    }
    return domIndex;
  }
  if (isElement(child as ViewElement)) {
    const domNode = domChildren[domIndex];
    if (domNode && domNode.nodeType === Node.ELEMENT_NODE) {
      adoptElement(child as ViewElement, domNode as Element, state);
      return domIndex + 1;
    }
    state.mismatch = true;
    return domIndex + 1;
  }
  if (isComponent(child as ViewNode)) {
    const resolved = resolveComponent(child as ViewComponentInstance);
    return adoptChild(resolved, parent, domChildren, domIndex, state);
  }
  state.mismatch = true;
  return domIndex + 1;
}

/**
 * Hydrate a container whose server-rendered markup is expected to match the
 * view tree returned by `view()`. If the markup does not match, the container
 * is cleared and the view is mounted fresh instead.
 */
export function hydrate(
  view: () => ViewNode | (() => ViewChild | null | undefined),
  container: Element,
): Dispose {
  return createRoot((dispose) => {
    const state: HydrationState = { mismatch: false };
    let v = view();
    if (typeof v === "function") {
      // Accessor-rooted view: hydrate not supported in this form, fall back to mount
      state.mismatch = true;
    } else {
      if (isComponent(v)) v = resolveComponent(v as ViewComponentInstance) as ViewNode;
      if (isElement(v) && container.firstElementChild) {
        adoptElement(v, container.firstElementChild, state);
      } else {
        state.mismatch = true;
      }
    }

    if (state.mismatch) {
      container.textContent = "";
      if (typeof v === "function") {
        appendChild(container, v as () => ViewChild | null | undefined);
      } else {
        mountChildren(container, [v as ViewNode]);
      }
    }

    onCleanup(() => {
      container.textContent = "";
    });
    return dispose;
  });
}



