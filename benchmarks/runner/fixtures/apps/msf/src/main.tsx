import { createSignal } from "@mustafa-26112026/runtime";
import { render, insert, list, setAttribute } from "@mustafa-26112026/runtime/dom";
import {
  installBench,
  makeRows,
  type Row,
  type Scenario,
  type ScenarioId,
} from "../../../shared/bench-client";

const container = document.getElementById("app")!;

const [items, setItems] = createSignal<Row[]>(makeRows(1_000));
const [revision, setRevision] = createSignal(0);

render(() => {
  const main = document.createElement("main");
  const h1 = document.createElement("h1");
  h1.textContent = "MSF Bench — MSF Fusion";
  const p = document.createElement("p");
  insert(p, () => `Rows: ${items().length}`);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>ID</th><th>Label</th></tr>";
  const tbody = document.createElement("tbody");
  list(tbody, () => items(), (item) => {
    const tr = document.createElement("tr");
    setAttribute(tr, "data-row", () => String(item().id));
    const tdId = document.createElement("td");
    insert(tdId, () => String(item().id));
    const tdLabel = document.createElement("td");
    tdLabel.className = "label";
    insert(tdLabel, () => item().label);
    tr.append(tdId, tdLabel);
    return tr;
  }, (item) => item.id);
  table.append(thead, tbody);
  main.append(h1, p, table);
  return main;
}, container);

const scenarios: Record<ScenarioId, Scenario> = {
  "create-1000": {
    prepare: () => setItems([]),
    run: () => setItems(makeRows(1_000)),
  },
  "create-10000": {
    prepare: () => setItems([]),
    run: () => setItems(makeRows(10_000)),
  },
  "update-all-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => setItems(items().map((row) => ({ ...row, label: `${row.label}-u` }))),
  },
  "update-one-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => setItems(items().map((row) => (row.id === 500 ? { ...row, label: `${row.label}-one` } : row))),
  },
  "swap-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => setItems(items().with(1, items()[998]!).with(998, items()[1]!)),
  },
  "remove-one-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => setItems(items().filter((row) => row.id !== 500)),
  },
  "clear-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => setItems([]),
  },
  "replace-1000": {
    prepare: () => setItems(makeRows(1_000)),
    run: () => {
      setRevision((value) => value + 1);
      setItems(makeRows(1_000, revision()));
    },
  },
};

installBench(scenarios);
