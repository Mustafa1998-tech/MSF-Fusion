import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";
import { hydrate } from "@msf/runtime/universal";
import type { ViewNode } from "@msf/runtime/universal";

/**
 * MSF Fusion dashboard slice — a realistic internal task board.
 *
 * The same component tree runs on the server (snapshot) and on the client
 * (mount/hydrate), exercising:
 * - signals for local reactive state
 * - fine-grained bindings (attribute, class, text) re-evaluated by the runtime
 * - control flow (list + conditional)
 * - hydration adopting server markup and attaching handlers/reactivity
 */

export interface Task {
  id: number;
  title: string;
  owner: string;
  status: "open" | "in-progress" | "done";
  updated: string;
}

export const TASKS: Task[] = [
  { id: 1, title: "Migrate billing service to AR", owner: "Mona", status: "in-progress", updated: "2026-11-15" },
  { id: 2, title: "Fix CSP violation in checkout", owner: "Omar", status: "open", updated: "2026-11-14" },
  { id: 3, title: "Write load test runbook", owner: "Lina", status: "done", updated: "2026-11-12" },
  { id: 4, title: "Rotate staging credentials", owner: "Omar", status: "open", updated: "2026-11-15" },
  { id: 5, title: "Sunset legacy queue worker", owner: "Mona", status: "done", updated: "2026-11-11" },
  { id: 6, title: "Investigate slow hydration path", owner: "Lina", status: "in-progress", updated: "2026-11-16" },
];

export type StatusFilter = "all" | Task["status"];

function statusLabel(status: StatusFilter): string {
  if (status === "all") return "All";
  if (status === "in-progress") return "In progress";
  return status[0]!.toUpperCase() + status.slice(1);
}

export function createDashboardView(initialFilter: StatusFilter = "all") {
  const [filter, setFilter] = createSignal<StatusFilter>(initialFilter);

  const view = (): ViewNode => {
    return h("main", { class: "dashboard" },
      h("header", { class: "topbar" },
        h("div", null,
          h("h1", null, "Ops Board"),
          h("p", { class: "hint", "data-hint": "subtitle" }, "MSF Fusion — internal engineering task board"),
        ),
        h("div", { class: "stat", "data-stat": "visible" },
          h("span", null, "Visible: "),
          h("strong", null, () => String(TASKS.filter((t) => filter() === "all" || t.status === filter()).length)),
        ),
      ),
      h("section", { class: "panel" },
        h("div", { class: "filters", role: "group", "aria-label": "Filter tasks" },
          ...(["all", "open", "in-progress", "done"] as const).map((key) =>
            h("button", {
              type: "button",
              class: () => `filter${filter() === key ? " active" : ""}`,
              "data-filter": key,
              "aria-pressed": () => String(filter() === key),
              onClick: () => setFilter(key),
            }, statusLabel(key)),
          ),
        ),
        h("table", { class: "table" },
          h("thead", null,
            h("tr", null,
              h("th", null, "Task"),
              h("th", null, "Owner"),
              h("th", null, "Status"),
              h("th", null, "Updated"),
            ),
          ),
          h("tbody", null, () =>
            TASKS.filter((task) => filter() === "all" || task.status === filter()).map((task) =>
              h("tr", { "data-row": String(task.id) },
                h("td", null, task.title),
                h("td", null, task.owner),
                h("td", null, h("span", { class: `badge badge-${task.status}` }, task.status)),
                h("td", { class: "muted" }, task.updated),
              ),
            ),
          ),
        ),
        h("p", { class: "hint" }, "SSR snapshot rendered by @msf/runtime. Hydrated by @msf/runtime/universal."),
      ),
    );
  };

  return { view, filter, setFilter };
}

export function renderDashboardInner(initialFilter: StatusFilter = "all"): string {
  const { view } = createDashboardView(initialFilter);
  return renderToString(view);
}

export function hydrateDashboard(container: Element, initialFilter: StatusFilter = "all"): void {
  const { view } = createDashboardView(initialFilter);
  hydrate(view, container);
}
