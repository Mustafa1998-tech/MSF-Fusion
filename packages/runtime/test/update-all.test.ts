// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { render, list, insert, setAttribute } from "../src/dom.js";

describe("explicit update-all scenario", () => {
  it("re-renders labels after setItems with new objects", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const makeRows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i, label: `row-${i}-r0` }));

    const [items, setItems] = createSignal(makeRows(3));
    render(() => {
      const main = document.createElement("main");
      const tbody = document.createElement("tbody");
      list(tbody, items, (item) => {
        const tr = document.createElement("tr");
        setAttribute(tr, "data-row", () => String(item().id));
        const td = document.createElement("td");
        td.className = "label";
        insert(td, () => item().label);
        tr.appendChild(td);
        return tr;
      }, (item) => item.id);
      main.appendChild(tbody);
      return main;
    }, container);

    expect(container.textContent).toBe("row-0-r0row-1-r0row-2-r0");
    setItems(items().map((row) => ({ ...row, label: `${row.label}-u` })));
    expect(container.textContent).toBe("row-0-r0-urow-1-r0-urow-2-r0-u");
    container.remove();
  });
});

