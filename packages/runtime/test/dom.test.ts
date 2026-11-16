// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { insert, render, setAttribute, setText } from "../src/dom.js";

describe("DOM runtime", () => {
  it("renders and updates reactive text", () => {
    const container = document.createElement("div");
    const [count, setCount] = createSignal(0);
    render(() => {
      const el = document.createElement("span");
      const text = document.createTextNode("");
      setText(text, () => `Count: ${count()}`);
      el.appendChild(text);
      return el;
    }, container);

    expect(container.textContent).toBe("Count: 0");
    setCount(1);
    expect(container.textContent).toBe("Count: 1");
  });

  it("updates attributes reactively", () => {
    const el = document.createElement("button");
    const [disabled, setDisabled] = createSignal(false);
    const [label, setLabel] = createSignal("Save");
    setAttribute(el, "disabled", disabled);
    setAttribute(el, "aria-label", label);
    document.body.appendChild(el);

    expect(el.hasAttribute("disabled")).toBe(false);
    expect(el.getAttribute("aria-label")).toBe("Save");
    setDisabled(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    setLabel("Saving");
    expect(el.getAttribute("aria-label")).toBe("Saving");
    el.remove();
  });

  it("inserts and replaces reactive nodes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const [show, setShow] = createSignal(true);
    const [msg, setMsg] = createSignal("A");

    render(() => {
      const root = document.createElement("div");
      insert(root, () => (show() ? msg() : null));
      return root;
    }, container);

    expect(container.textContent).toBe("A");
    setMsg("B");
    expect(container.textContent).toBe("B");
    setShow(false);
    expect(container.textContent).toBe("");
    setShow(true);
    expect(container.textContent).toBe("B");
    container.remove();
  });
});

