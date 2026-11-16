/**
 * Minimal SSR string renderer (Milestone 1 preview).
 *
 * Renders a restricted tree shape to HTML with escaping by default.
 * This is not full isomorphic component rendering yet.
 */
import { untrack } from "./core.ts";

export type ServerNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | ServerElement
  | ServerNode[];

export interface ServerElement {
  type: string;
  props?: Record<string, unknown> | null;
  children?: ServerNode[];
}

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

function renderAttr(name: string, value: unknown): string {
  if (value == null || value === false) return "";
  if (value === true) return ` ${name}`;
  if (name === "className") name = "class";
  return ` ${name}="${escapeHtml(String(value))}"`;
}

export function h(
  type: string,
  props?: Record<string, unknown> | null,
  ...children: ServerNode[]
): ServerElement {
  const flat: ServerNode[] = [];
  const push = (value: ServerNode): void => {
    if (Array.isArray(value)) {
      for (const item of value) push(item);
    } else {
      flat.push(value);
    }
  };
  for (const child of children) push(child);
  return { type, props: props ?? null, children: flat };
}

export function renderNode(node: ServerNode): string {
  if (node == null || node === false || node === true) return "";
  if (Array.isArray(node)) return node.map(renderNode).join("");
  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(String(node));
  }

  const { type, props, children } = node;
  let attrs = "";
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === "children" || key.startsWith("on")) continue;
      attrs += renderAttr(key, value);
    }
  }
  if (VOID_ELEMENTS.has(type)) {
    return `<${type}${attrs}>`;
  }
  const inner =
    children && children.length > 0
      ? children.map(renderNode).join("")
      : props && props["children"] != null
        ? renderNode(props["children"] as ServerNode)
        : "";
  return `<${type}${attrs}>${inner}</${type}>`;
}

export function renderToString(view: () => ServerNode): string {
  // Run without tracking reactive reads; SSR snapshot is a point-in-time render.
  return untrack(() => renderNode(view()));
}
