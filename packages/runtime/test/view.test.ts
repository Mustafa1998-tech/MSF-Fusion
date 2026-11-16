// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { h, Show, For } from "../src/server.js";
import { mount } from "../src/universal.js";
import { renderToString } from "../src/server.js";

describe("Show/For universal components", () => {
  it("renders children branch in SSR when truthy", () => {
    const html = renderToString(() =>
      h(Show, { when: () => true, children: [h("p", null, "shown")] }));
    expect(html).toContain("shown");
  });

  it("renders fallback in SSR when falsy", () => {
    const html = renderToString(() =>
      h(Show, { when: () => false, fallback: h("em", null, "hidden"), children: [h("p", null, "shown")] }));
    expect(html).not.toContain("shown");
    expect(html).toContain("hidden");
  });

  it("mounts and toggles Show reactively in DOM", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [on, setOn] = createSignal(true);
    mount(() => h(Show, { when: () => on(), children: [h("p", null, "shown")] }), container);
    expect(container.textContent).toContain("shown");
    setOn(false);
    expect(container.textContent).not.toContain("shown");
    container.remove();
  });

  it("mounts For and re-renders on items change", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [items, setItems] = createSignal(["a", "b"]);
    mount(() =>
      h(For<{ label: string }>, {
        each: () => items().map((label) => ({ label })),
        children: (item: { label: string }) => h("li", null, item.label),
      }),
      container,
    );
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("b");
    setItems([...items(), "c"]);
    expect(container.textContent).toContain("c");
    container.remove();
  });
});
