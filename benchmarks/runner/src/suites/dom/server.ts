import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

export interface StaticServer {
  url: string;
  close(): Promise<void>;
}

export async function serveDirectory(directory: string): Promise<StaticServer> {
  const root = resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://localhost");
      const decoded = decodeURIComponent(requestUrl.pathname);
      const relative = normalize(decoded).replace(/^([/\\])+/, "");
      let filePath = resolve(join(root, relative));
      const prefix = `${root}${sep}`;
      if (filePath !== root && !filePath.startsWith(prefix)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      try {
        const info = await stat(filePath);
        if (info.isDirectory()) filePath = join(filePath, "index.html");
      } catch {
        if (!extname(filePath)) filePath = join(root, "index.html");
      }
      const body = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type":
          CONTENT_TYPES[extname(filePath).toLowerCase()] ??
          "application/octet-stream",
        "Cache-Control": "no-store",
        "Content-Length": body.byteLength,
      });
      response.end(body);
    } catch (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(`Not found: ${String(error)}`);
    }
  });

  await new Promise<void>((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolveListen());
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Static server did not expose a TCP port");
  }
  return {
    url: `http://127.0.0.1:${address.port}/`,
    async close() {
      await new Promise<void>((resolveClose) => {
        server.closeAllConnections();
        server.close(() => resolveClose());
      });
    },
  };
}
