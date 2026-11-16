/**
 * Isomorphic view descriptor for MSF Fusion.
 *
 * A component runs once on the server (serialized) and once on the client
 * (mounted or hydrated) against the same deterministic tree. Static and
 * dynamic props/children use the same MaybeAccessor shape.
 *
 * This module intentionally stays free of DOM APIs so it can be imported by
 * the SSR renderer and unit-tested in Node.
 */

export type ViewNode =
  | ViewElement
  | ViewText
  | ViewFragment
  | string
  | number
  | boolean
  | null
  | undefined;

export interface ViewText {
  kind: "text";
  value: ViewMaybeAccessor<unknown>;
}

export interface ViewFragment {
  kind: "fragment";
  children: ViewChild[];
}

export interface ViewElement {
  kind: "element";
  tag: string;
  props?: Record<string, ViewMaybeAccessor<unknown>> | null;
  children?: ViewChild[];
}

export type ViewChild = ViewNode | ViewChild[] | (() => unknown);
export type ViewMaybeAccessor<T> = T | (() => T);

export function h(
  tag: string,
  props?: Record<string, unknown> | null,
  ...children: ViewChild[]
): ViewElement {
  return { kind: "element", tag, props: props as Record<string, ViewMaybeAccessor<unknown>> | null, children: flatten(children) };
}

export function fragment(...children: ViewChild[]): ViewFragment {
  return { kind: "fragment", children: flatten(children) };
}

export function text(value: ViewMaybeAccessor<unknown>): ViewText {
  return { kind: "text", value };
}

function flatten(children: ViewChild[]): ViewChild[] {
  const out: ViewChild[] = [];
  for (const child of children) {
    if (Array.isArray(child)) out.push(...flatten(child));
    else if (child !== undefined) out.push(child);
  }
  return out;
}

export function isElement(node: ViewNode): node is ViewElement {
  return node != null && typeof node === "object" && (node as ViewElement).kind === "element";
}
export function isText(node: ViewNode): node is ViewText {
  return node != null && typeof node === "object" && (node as ViewText).kind === "text";
}
export function isFragment(node: ViewNode): node is ViewFragment {
  return node != null && typeof node === "object" && (node as ViewFragment).kind === "fragment";
}
