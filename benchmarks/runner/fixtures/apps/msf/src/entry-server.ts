import { h, renderToString } from "@msf/runtime/server";
import { makeRows } from "../../../shared/bench-client";

export function renderPage(): string {
  const rows = makeRows(1_000);
  const body = h(
    "main",
    null,
    h("h1", null, "MSF Bench — MSF Fusion"),
    h("p", null, `Rows: ${rows.length}`),
    h(
      "table",
      null,
      h(
        "thead",
        null,
        h("tr", null, h("th", null, "ID"), h("th", null, "Label")),
      ),
      h(
        "tbody",
        null,
        ...rows.map((row) =>
          h(
            "tr",
            { "data-row": row.id },
            h("td", null, String(row.id)),
            h("td", { class: "label" }, row.label),
          ),
        ),
      ),
    ),
  );
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>MSF Bench — MSF Fusion</title></head><body>${renderToString(() => body)}</body></html>`;
}
