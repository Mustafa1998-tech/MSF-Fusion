import {
  batch,
  createMemo,
  createSignal,
} from "@msf/runtime";
import { insert, render, setAttribute } from "@msf/runtime/dom";

function CounterApp() {
  const [count, setCount] = createSignal(0);
  const [step, setStep] = createSignal(1);
  const doubled = createMemo(() => count() * 2);
  const parity = createMemo(() => (count() % 2 === 0 ? "even" : "odd"));

  return () => {
    const root = document.createElement("section");
    root.className = "card";

    const h1 = document.createElement("h1");
    h1.textContent = "MSF Runtime Preview";
    root.appendChild(h1);

    const p = document.createElement("p");
    insert(p, () => `Count: ${count()} (doubled: ${doubled()}, ${parity()})`);
    setAttribute(p, "data-count", () => String(count()));
    root.appendChild(p);

    const info = document.createElement("p");
    info.className = "muted";
    insert(info, () => `Step: ${step()} · fine-grained updates, no VDOM diff`);
    root.appendChild(info);

    const inc = document.createElement("button");
    inc.textContent = "+";
    inc.onclick = () => setCount((n) => n + step());
    root.appendChild(inc);

    const dec = document.createElement("button");
    dec.textContent = "-";
    dec.onclick = () => setCount((n) => n - step());
    root.appendChild(dec);

    const stepBtn = document.createElement("button");
    stepBtn.textContent = "Step +1";
    stepBtn.onclick = () => setStep((s) => (s >= 5 ? 1 : s + 1));
    root.appendChild(stepBtn);

    const reset = document.createElement("button");
    reset.textContent = "Reset";
    reset.onclick = () =>
      batch(() => {
        setCount(0);
        setStep(1);
      });
    root.appendChild(reset);

    return root;
  };
}

const app = document.getElementById("app");
if (!app) throw new Error("#app not found");
render(CounterApp(), app);
