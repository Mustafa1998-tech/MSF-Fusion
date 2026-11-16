import { useEffect, useRef, useState } from "react";
import {
  installBench,
  makeRows,
  type Row,
  type Scenario,
  type ScenarioId,
} from "../../../shared/bench-client";

const scenarios: Record<ScenarioId, Scenario> = {} as Record<ScenarioId, Scenario>;

export function App({ initialRows = [] }: { initialRows?: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  useEffect(() => {
    scenarios["create-1000"] = {
      prepare: () => setRows([]),
      run: () => setRows(makeRows(1_000)),
    };
    scenarios["create-10000"] = {
      prepare: () => setRows([]),
      run: () => setRows(makeRows(10_000)),
    };
    scenarios["update-all-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () =>
        setRows((current) =>
          current.map((row) => ({ ...row, label: `${row.label}-u` })),
        ),
    };
    scenarios["update-one-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () =>
        setRows((current) =>
          current.map((row) =>
            row.id === 500 ? { ...row, label: `${row.label}-one` } : row,
          ),
        ),
    };
    scenarios["swap-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () =>
        setRows((current) => {
          const next = current.slice();
          const a = next[1];
          const b = next[998];
          if (!a || !b) return current;
          next[1] = b;
          next[998] = a;
          return next;
        }),
    };
    scenarios["remove-one-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () => setRows((current) => current.filter((row) => row.id !== 500)),
    };
    scenarios["clear-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () => setRows([]),
    };
    scenarios["replace-1000"] = {
      prepare: () => setRows(makeRows(1_000)),
      run: () => setRows(makeRows(1_000, 1)),
    };
    installBench(scenarios);
  }, []);

  return (
    <main>
      <h1>MSF Bench — React</h1>
      <p>Rows: {rows.length}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-row={row.id}>
              <td>{row.id}</td>
              <td className="label">{row.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
