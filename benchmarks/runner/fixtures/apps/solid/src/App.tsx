import { For, batch, createSignal, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  installBench,
  makeRows,
  type Row,
  type Scenario,
  type ScenarioId,
} from "../../../shared/bench-client";

type State = { items: Row[] };

export function App(props: { initialRows?: Row[] }) {
  const [state, setState] = createStore<State>({ items: props.initialRows ?? [] });
  const [revision, setRevision] = createSignal(0);

  onMount(() => {
    const scenarios: Record<ScenarioId, Scenario> = {
      "create-1000": {
        prepare: () => setState("items", []),
        run: () => setState("items", makeRows(1_000)),
      },
      "create-10000": {
        prepare: () => setState("items", []),
        run: () => setState("items", makeRows(10_000)),
      },
      "update-all-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () =>
          batch(() => {
            for (let i = 0; i < 1_000; i += 1) {
              setState("items", i, "label", (label) => `${label}-u`);
            }
          }),
      },
      "update-one-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () =>
          setState("items", 500, "label", (label) => `${label}-one`),
      },
      "swap-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () =>
          setState(
            "items",
            produce((items: Row[]) => {
              const a = items[1];
              const b = items[998];
              if (!a || !b) return;
              items[1] = b;
              items[998] = a;
            }),
          ),
      },
      "remove-one-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () => setState("items", (items) => items.filter((row) => row.id !== 500)),
      },
      "clear-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () => setState("items", []),
      },
      "replace-1000": {
        prepare: () => setState("items", makeRows(1_000)),
        run: () => {
          setRevision((value) => value + 1);
          setState("items", makeRows(1_000, revision()));
        },
      },
    };
    installBench(scenarios);
  });

  return (
    <main>
      <h1>MSF Bench — Solid</h1>
      <p>Rows: {state.items.length}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          <For each={state.items}>
            {(row) => (
              <tr data-row={row.id}>
                <td>{row.id}</td>
                <td class="label">{row.label}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </main>
  );
}
