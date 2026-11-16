// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { list } from "../src/dom.js";

describe("list keyed reconciliation", () => {
  it("supports multi-root items via DocumentFragment", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [items, setItems] = createSignal([{ id: 1, label: "a" }, { id: 2, label: "b" }]);

    list(container, items, (item) => {
      const frag = document.createDocumentFragment();
      const a = document.createElement("li");
      a.textContent = "A:";
      const b = document.createElement("li");
      b.textContent = item().label;
      frag.append(a, b);
      return frag;
    }, (item) => item.id);

    expect(Array.from(container.querySelectorAll("li")).map((n) => n.textContent)).toEqual(["A:", "a", "A:", "b"]);

    setItems([...items().reverse()]);
    expect(Array.from(container.querySelectorAll("li")).map((n) => n.textContent)).toEqual(["A:", "b", "A:", "a"]);
    container.remove();
  });

  it("supports multi-root items as arrays", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [items, setItems] = createSignal([{ id: "a" }, { id: "b" }]);

    list(container, items, () => [document.createElement("li"), document.createElement("li")], (item) => item.id);
    expect(container.children.length).toBe(4);
    setItems([items()[1]!, items()[0]!]);
    expect(container.children.length).toBe(4);
    container.remove();
  });

  it("removes stale keyed entries and their nodes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [items, setItems] = createSignal([{ id: 1 }, { id: 2 }]);

    list(container, items, () => {
      const li = document.createElement("li");
      li.textContent = "item";
      return li;
    }, (item) => item.id);
    expect(container.children.length).toBe(2);
    setItems([items()[1]!]);
    expect(container.children.length).toBe(1);
    expect(container.querySelector("li")?.textContent).toBe("item");
    container.remove();
  });
});
