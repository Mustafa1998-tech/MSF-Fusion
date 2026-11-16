// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.js";
import { h } from "../src/view.js";
import { mount, hydrate } from "../src/universal.js";
import { renderToString } from "../src/server.js";

function Counter({ initial = 0, children }: { initial?: number; children?: unknown }) {
  const [count, setCount] = createSignal(initial);
  return h("div", { class: "counter" },
    h("p", null, () => `Count: ${count()}`),
    h("button", { type: "button", onClick: () => setCount((n) => n + 1) }, "Inc"),
    children as never,
  );
}

describe("universal view components", () => {
  it("renders components to SSR HTML", () => {
    const html = renderToString(() => h(Counter, { initial: 3 }));
    expect(html).toContain("Count: 3");
    expect(html).toContain("Inc");
  });

  it("mounts components into the DOM and hydrates them", async () => {
    const html = renderToString(() => h(Counter, { initial: 2 }));
    document.body.innerHTML = `<div id="app">${html}</div>`;
    const container = document.getElementById("app")!;
    const dispose = hydrate(() => h(Counter, { initial: 2 }), container);
    expect(container.textContent).toContain("Count: 2");
    container.querySelector("button")!.click();
    expect(container.textContent).toContain("Count: 3");
    dispose();
  });

  it("mounts components with non-SSR path too", () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const container = document.getElementById("app")!;
    mount(() => h(Counter, { initial: 7 }), container);
    expect(container.textContent).toContain("Count: 7");
    container.querySelector("button")!.click();
    expect(container.textContent).toContain("Count: 8");
  });
});
