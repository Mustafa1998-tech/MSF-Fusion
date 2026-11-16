import { renderToString } from "react-dom/server";
import { App } from "./App";
import { makeRows } from "../../../shared/bench-client";

export function renderPage(): string {
  return renderToString(<App initialRows={makeRows(1_000)} />);
}
