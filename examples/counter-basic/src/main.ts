/**
 * Browser-oriented example source (developer preview).
 *
 * This file demonstrates fine-grained DOM bindings with @mustafa-26112026/runtime.
 * To run in a browser, bundle/serve it with your preferred tool. The package
 * also includes `src/ssr.ts` which runs directly with Node.
 */
import { createSignal } from "@mustafa-26112026/runtime";
import { render, insert, setAttribute } from "@mustafa-26112026/runtime/dom";

export function mountCounter(container: Element) {
  const [count, setCount] = createSignal(0);

  return render(() => {
    const root = document.createElement("section");
    root.className = "counter";

    const title = document.createElement("h1");
    title.textContent = "MSF Counter";
    root.appendChild(title);

    const value = document.createElement("p");
    insert(value, () => `Count: ${count()}`);
    setAttribute(value, "data-count", () => String(count()));
    root.appendChild(value);

    const inc = document.createElement("button");
    inc.textContent = "Increment";
    inc.addEventListener("click", () => setCount((n) => n + 1));
    root.appendChild(inc);

    return root;
  }, container);
}
