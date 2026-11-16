import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";
import { renderAppInner } from "../src/app.ts";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const indexPath = join(root, "dist", "client", "index.html");
const html = await readFile(indexPath, "utf8");
const withSsr = html.replace("<!--ssr-outlet-->", renderAppInner(1));
await writeFile(indexPath, withSsr, "utf8");
console.log("prerendered SSR page into dist/client/index.html");
