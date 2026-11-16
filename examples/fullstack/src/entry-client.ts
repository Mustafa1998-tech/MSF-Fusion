import { hydrateCounter } from "./app.ts";

const container = document.getElementById("app");
if (!container) throw new Error("#app not found");

const initialCount = Number(
  container.querySelector("[data-count]")?.getAttribute("data-count") ?? "1",
);

hydrateCounter(container, Number.isFinite(initialCount) ? initialCount : 1);
