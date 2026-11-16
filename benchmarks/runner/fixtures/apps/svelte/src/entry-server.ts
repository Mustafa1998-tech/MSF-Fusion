import { render } from "svelte/server";
import App from "./App.svelte";
import { makeRows } from "../../../shared/bench-client";

export function renderPage(): string {
  return render(App, { props: { initialRows: makeRows(1_000) } }).body;
}
