/**
 * SSR renderer for the isomorphic view descriptor (Milestone 1 preview).
 *
 * Renders a deterministic HTML snapshot of a `ViewNode` tree with escaping by
 * default. The same tree can be mounted or hydrated on the client via
 * `@msf/runtime/universal`.
 */
import { untrack } from "./core.ts";
import {
  isFragment,
  isText,
  isElement,
  type ViewChild,
  type ViewElement,
  type ViewMaybeAccessor,
  type ViewNode,
} from "./view.ts";

export { h, fragment, text } from "./view.ts";
export type { ViewElement, ViewFragment, ViewNode, ViewText, ViewMaybeAccessor, ViewChild } from "./view.ts";

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function read<T>(value: ViewMaybeAccessor<T>): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

function renderAttr(name: string, raw: unknown): string {
  if (raw == null || raw === false) return "";
  if (raw === true) return ` ${name}`;
  if (name === "className") name = "class";
  return ` ${name}="${escapeHtml(String(raw))}"`;
}

function eventAttrOk(name: string): boolean {
  return !/^on/i.test(name);
}

export function renderNode(node: ViewNode | (() => ViewNode)): string {
  if (typeof node === "function") return renderNode(read(node) as ViewNode);
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(String(node));
  }
  if (isText(node)) return escapeHtml(read(node.value) == null ? "" : String(read(node.value)));
  if (isFragment(node)) return renderChildren(node.children ?? []);
  if (isElement(node)) {
    const element = node as ViewElement;
    let attrs = "";
    if (element.props) {
      for (const [name, value] of Object.entries(element.props)) {
        if (name === "children" || !eventAttrOk(name)) continue;
        attrs += renderAttr(name, read(value as ViewMaybeAccessor<unknown>));
      }
    }
    if (VOID_ELEMENTS.has(element.tag)) return `<${element.tag}${attrs}>`;
    const inner = renderChildren(element.children ?? []);
    const propsChildren = element.props ? (element.props["children"] as ViewMaybeAccessor<unknown> | undefined) : undefined;
    const fallback = propsChildren != null ? renderNode(read(propsChildren) as ViewNode) : "";
    return `<${element.tag}${attrs}>${inner || fallback}</${element.tag}>`;
  }
  return "";
}

function renderChildren(children: ViewChild[]): string {
  let out = "";
  for (const child of children) {
    if (Array.isArray(child)) out += renderChildren(child);
    else out += renderNode(child as ViewNode | (() => ViewNode));
  }
  return out;
}

export function renderToString(view: () => ViewNode): string {
  // Run without tracking reactive reads; SSR snapshot is a point-in-time render.
  return untrack(() => renderNode(view()));
}

/** @deprecated use `@msf/runtime/universal` for isomorphic rendering */
export type ServerNode = ViewNode;
/** @deprecated use `@msf/runtime/universal` for isomorphic rendering */
export type ServerElement = ViewElement;
