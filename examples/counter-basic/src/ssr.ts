import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";

function CounterCard() {
  const [count] = createSignal(3);
  return h(
    "section",
    { class: "counter", "data-count": count() },
    h("h1", null, "MSF Counter (SSR snapshot)"),
    h("p", null, "Count: ", count()),
  );
}

const html = renderToString(() => CounterCard());
console.log(html);
