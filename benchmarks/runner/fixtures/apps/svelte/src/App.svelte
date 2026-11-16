<script lang="ts">
  import { onMount } from "svelte";
  import {
    installBench,
    makeRows,
    type Row,
    type Scenario,
    type ScenarioId,
  } from "../../../shared/bench-client";

  let { initialRows = [] }: { initialRows?: Row[] } = $props();
  let rows = $state<Row[]>(initialRows);
  let revision = $state(0);

  onMount(() => {
    const scenarios: Record<ScenarioId, Scenario> = {
      "create-1000": {
        prepare: () => {
          rows = [];
        },
        run: () => {
          rows = makeRows(1_000);
        },
      },
      "create-10000": {
        prepare: () => {
          rows = [];
        },
        run: () => {
          rows = makeRows(10_000);
        },
      },
      "update-all-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          rows = rows.map((row) => ({ ...row, label: `${row.label}-u` }));
        },
      },
      "update-one-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          rows = rows.map((row) =>
            row.id === 500 ? { ...row, label: `${row.label}-one` } : row,
          );
        },
      },
      "swap-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          const next = rows.slice();
          const a = next[1];
          const b = next[998];
          if (!a || !b) return;
          next[1] = b;
          next[998] = a;
          rows = next;
        },
      },
      "remove-one-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          rows = rows.filter((row) => row.id !== 500);
        },
      },
      "clear-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          rows = [];
        },
      },
      "replace-1000": {
        prepare: () => {
          rows = makeRows(1_000);
        },
        run: () => {
          revision += 1;
          rows = makeRows(1_000, revision);
        },
      },
    };
    installBench(scenarios);
  });
</script>

<main>
  <h1>MSF Bench — Svelte</h1>
  <p>Rows: {rows.length}</p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Label</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.id)}
        <tr data-row={row.id}>
          <td>{row.id}</td>
          <td class="label">{row.label}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>
