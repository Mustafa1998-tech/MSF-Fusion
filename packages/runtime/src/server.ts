/**
 * SSR renderer for the isomorphic view descriptor (Milestone 1 preview).
 *
 * Renders a deterministic HTML snapshot of a `ViewNode` tree with escaping by
 * default. The same tree can be mounted or hydrated on the client via
 * `@msf/runtime/universal`.
 */
import { untrack } from "./core.js";
import {
  isFragment,
  isText,
  isElement,
  isComponent,
  resolveComponent,
  type ViewChild,
  type ViewElement,
  type ViewMaybeAccessor,
  type ViewNode,
} from "./view.js";

export { h, fragment, text, Show, For } from "./view.js";
export type { ViewComponent, ComponentProps, ViewComponentInstance, ViewElement, ViewFragment, ViewNode, ViewText, ViewMaybeAccessor, ViewChild, MaybeAccessor } from "./view.js";

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

function readValue(value: unknown): unknown {
  return typeof value === "function" ? (value as () => unknown)() : value;
}

function read<T>(value: ViewMaybeAccessor<T>): T {
  return readValue(value) as T;
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

export function renderNode(node: unknown): string {
  if (typeof node === "function") return renderNode(readValue(node));
  if (node == null || node === false || node === true) return "";
  if (Array.isArray(node)) return renderChildren(node as ViewChild[]);
  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(String(node));
  }
  if (isComponent(node as ViewNode)) return renderNode(resolveComponent(node as ViewNode as Parameters<typeof resolveComponent>[0]));
  if (isText(node as ViewNode)) {
    const textNode = node as import("./view.js").ViewText;
    const v = read(textNode.value);
    return escapeHtml(v == null ? "" : String(v));
  }
  if (isFragment(node as ViewNode)) {
    const frag = node as import("./view.js").ViewFragment;
    return renderChildren(frag.children ?? []);
  }
  if (isElement(node as ViewNode)) {
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
    else out += renderNode(child);
  }
  return out;
}

export function renderToString(view: () => unknown): string {
  return untrack(() => renderNode(view()));
}

/** @deprecated use `@msf/runtime/universal` for isomorphic rendering */
export type ServerNode = ViewNode;
/** @deprecated use `@msf/runtime/universal` for isomorphic rendering */
export type ServerElement = ViewElement;
