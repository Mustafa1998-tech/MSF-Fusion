import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";
import { makeRows } from "../../../shared/bench-client";

export async function renderPage(): Promise<string> {
  const app = createSSRApp(App, { initialRows: makeRows(1_000) });
  return renderToString(app);
}
