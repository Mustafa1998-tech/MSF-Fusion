// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { h } from "../src/view.js";
import { mount, hydrate } from "../src/universal.js";
import { renderToString } from "../src/server.js";

describe("universal view mount/hydrate — reactive region adoption", () => {
  it("hydrates a reactive multi-root region in place and keeps following siblings stable", () => {
    const [rows, setRows] = createSignal<Array<string>>(["a", "b"]);
    const view = () =>
      h(
        "section",
        null,
        h("tbody", { id: "rows" }, () => rows().map((r) => h("tr", null, h("td", null, r)))),
        h("p", { id: "after" }, "after"),
      );
    const html = renderToString(view);
    document.body.innerHTML = `<div id="app">${html}</div>`;
    const container = document.getElementById("app")!;
    const dispose = hydrate(view, container);

    const tbody = container.querySelector("#rows")!;
    expect(tbody.querySelectorAll("tr").length).toBe(2);
    expect(container.querySelector("#after")?.textContent).toBe("after");

    setRows(["a", "b", "c"]);
    expect(tbody.querySelectorAll("tr").length).toBe(3);
    expect([...tbody.querySelectorAll("tr")].map((r) => r.textContent)).toEqual(["a", "b", "c"]);
    expect(container.querySelector("#after")?.textContent).toBe("after");
    // No duplicated SSR leftovers anywhere in the container
    expect(container.querySelectorAll("tr").length).toBe(3);
    setRows(["a"]);
    expect(tbody.querySelectorAll("tr").length).toBe(1);
    expect(container.querySelector("#after")?.textContent).toBe("after");
    dispose();
  });

  it("keeps SSR-inline text adoption working when a sibling follows", () => {
    const [count, setCount] = createSignal(1);
    const view = () => h("p", null, () => `Count: ${count()}!`, h("span", null, " tail"));
    const html = renderToString(view);
    document.body.innerHTML = `<div id="app">${html}</div>`;
    const container = document.getElementById("app")!;
    const dispose = hydrate(view, container);
    expect(container.querySelector("p")?.textContent).toBe("Count: 1! tail");
    setCount(9);
    expect(container.querySelector("p")?.textContent).toBe("Count: 9! tail");
    dispose();
  });
});
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

