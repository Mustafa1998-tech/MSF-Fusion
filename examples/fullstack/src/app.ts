import { createSignal } from "@msf/runtime";
import { h, mount, hydrate } from "@msf/runtime/universal";
import { renderToString } from "@msf/runtime/server";
import type { ViewNode } from "@msf/runtime/universal";

/**
 * Shared view function: used by the server for SSR and by the browser for
 * hydration. The returned descriptor is a plain data tree with accessor
 * leaves for dynamic pieces — no DOM APIs, so it is safe to construct in
 * Node.js and in the browser.
 */
export function createAppView(initialCount: number) {
  const [count, setCount] = createSignal(initialCount);
  const view = (): ViewNode =>
    h(
      "section",
      { class: "card" },
      h("h1", null, "MSF Full-stack Counter"),
      h(
        "p",
        { "data-count": () => String(count()) },
        () => `Count: ${count()}`,
      ),
      h(
        "button",
        {
          type: "button",
          onClick: () => setCount((n) => n + 1),
        },
        "Increment",
      ),
      h(
        "button",
        {
          type: "button",
          onClick: () => setCount((n) => n - 1),
        },
        "Decrement",
      ),
      h("p", { class: "hint" }, "Server-rendered. Hydrated by @msf/runtime/universal."),
    );
  return { view, count };
}

export function renderAppInner(initialCount: number): string {
  const { view } = createAppView(initialCount);
  return renderToString(view);
}

export function hydrateCounter(container: Element, initialCount: number): void {
  const { view } = createAppView(initialCount);
  hydrate(view, container);
}

export { mount };
