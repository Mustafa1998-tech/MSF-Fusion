// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { h } from "../src/view.js";
import { mount, hydrate } from "../src/universal.js";
import { renderToString } from "../src/server.js";

describe("universal view mount/hydrate", () => {
  it("mounts a view into the DOM with reactive text", () => {
    document.body.innerHTML = "<div id=\"app\"></div>";
    const container = document.getElementById("app")!;
    const [count, setCount] = createSignal(1);
    const dispose = mount(
      () => h("section", { class: "x" }, h("p", null, () => `Count: ${count()}`)),
      container,
    );
    expect(container.textContent).toContain("Count: 1");
    setCount(2);
    expect(container.textContent).toContain("Count: 2");
    dispose();
  });

  it("hydrates SSR markup without throwing and wires reactivity", () => {
    const [count, setCount] = createSignal(3);
    const view = () => h("section", { "data-x": "1" }, h("p", null, () => `Count: ${count()}`));
    const html = renderToString(view);
    document.body.innerHTML = `<div id="app">${html}</div>`;
    const container = document.getElementById("app")!;
    const dispose = hydrate(view, container);
    expect(container.textContent).toContain("Count: 3");
    setCount(5);
    expect(container.textContent).toContain("Count: 5");
    dispose();
  });

  it("falls back to fresh mount on mismatched markup", () => {
    const [count] = createSignal(7);
    const view = () => h("section", null, h("p", null, () => `Count: ${count()}`));
    document.body.innerHTML = "<div id=\"app\"><span>wrong</span></div>";
    const container = document.getElementById("app")!;
    hydrate(view, container);
    expect(container.querySelector("p")?.textContent).toContain("Count: 7");
  });
});

