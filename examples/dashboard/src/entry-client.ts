import { mount } from "@mustafa-26112026/runtime/universal";
import { createDashboardView, type StatusFilter } from "./app.ts";

const container = document.getElementById("app");
if (!container) throw new Error("#app not found");

const initialFilter = (new URLSearchParams(window.location.search).get("filter") as StatusFilter | null) ?? "all";
mount(() => createDashboardView(initialFilter).view(), container);
