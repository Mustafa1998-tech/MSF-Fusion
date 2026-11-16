import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT ?? 4175);
const isProd = process.env.NODE_ENV === "production";

const MIME: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

async function createHandler() {
  if (isProd) {
    const clientDir = join(root, "dist", "client");
    const html = await readFile(join(clientDir, "index.html"), "utf8");
    return async (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => {
      try {
        const url = new URL(req.url ?? "/", `http://localhost:${port}`);
        if (url.pathname === "/" || url.pathname === "/ops") {
          res.setHeader("content-type", MIME[".html"]!);
          res.end(html);
          return;
        }
        const rel = (req.url ?? "/").replace(/^\/client\//, "").replace(/^\//, "");
        const body = await readFile(join(clientDir, rel));
        const ext = extname(rel);
        res.setHeader("content-type", MIME[ext] ?? "application/octet-stream");
        res.end(body);
      } catch {
        res.statusCode = 404;
        res.end("Not found");
      }
    };
  }

  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
  });

  return async (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    if (url.pathname === "/" || url.pathname === "/ops") {
      try {
        let template = await readFile(join(root, "index.html"), "utf8");
        template = await vite.transformIndexHtml(req.url ?? "/", template);
        const { renderDashboardInner } = await vite.ssrLoadModule("/src/app.ts");
        const filter = url.searchParams.get("filter") ?? "all";
        const html = template.replace("<!--ssr-outlet-->", renderDashboardInner(filter as "all" | "open" | "in-progress" | "done"));
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        console.error(error);
        res.statusCode = 500;
        res.end(String((error as Error)?.stack ?? error));
      }
      return;
    }
    vite.middlewares(req, res, () => {
      res.statusCode = 404;
      res.end("Not found");
    });
  };
}

async function main() {
  const handler = await createHandler();
  createServer((req, res) => {
    handler(req, res).catch((error) => {
      console.error(error);
      if (!res.headersSent) res.statusCode = 500;
      res.end(String((error as Error)?.message ?? error));
    });
  }).listen(port, () => {
    console.log(`MSF dashboard example listening at http://localhost:${port}/`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
