<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import {
    installBench,
    makeRows,
    type Row,
    type Scenario,
    type ScenarioId,
  } from "../../../shared/bench-client";

  const props = withDefaults(
    defineProps<{ initialRows?: Row[] }>(),
    { initialRows: () => [] },
  );
  const rows = ref<Row[]>(props.initialRows);
  let revision = 0;

  onMounted(() => {
    const scenarios: Record<ScenarioId, Scenario> = {
      "create-1000": {
        prepare: () => {
          rows.value = [];
        },
        run: () => {
          rows.value = makeRows(1_000);
        },
      },
      "create-10000": {
        prepare: () => {
          rows.value = [];
        },
        run: () => {
          rows.value = makeRows(10_000);
        },
      },
      "update-all-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          rows.value = rows.value.map((row) => ({
            ...row,
            label: `${row.label}-u`,
          }));
        },
      },
      "update-one-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          rows.value = rows.value.map((row) =>
            row.id === 500 ? { ...row, label: `${row.label}-one` } : row,
          );
        },
      },
      "swap-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          const next = rows.value.slice();
          const a = next[1];
          const b = next[998];
          if (!a || !b) return;
          next[1] = b;
          next[998] = a;
          rows.value = next;
        },
      },
      "remove-one-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          rows.value = rows.value.filter((row) => row.id !== 500);
        },
      },
      "clear-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          rows.value = [];
        },
      },
      "replace-1000": {
        prepare: () => {
          rows.value = makeRows(1_000);
        },
        run: () => {
          revision += 1;
          rows.value = makeRows(1_000, revision);
        },
      },
    };
    installBench(scenarios);
  });
</script>

<template>
  <main>
    <h1>MSF Bench — Vue</h1>
    <p>Rows: {{ rows.length }}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" :data-row="row.id">
          <td>{{ row.id }}</td>
          <td class="label">{{ row.label }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
