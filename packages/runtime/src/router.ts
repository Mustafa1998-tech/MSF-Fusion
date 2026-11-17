/**
 * Router preview for MSF Fusion (M2+ preview, intentionally minimal).
 *
 * - `matchRoute(pattern, url)` compiles `"/users/:id"`-style patterns with
 *   named params, wildcard (`*`) and query string parsing.
 * - `createRouter` exposes a reactive `current()` accessor plus `push`/`replace`/`back`/
 *   `navigate`. In DOM environments it uses `history` + `popstate`; elsewhere it runs
 *   in memory mode (SSR-safe).
 * - No route trees, loaders, or data actions — by design (see ADR-003).
 */
import { createSignal } from "./core.js";

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface Router {
  /** Reactive current location. */
  current: () => RouteMatch;
  /** Navigate forward to a path (e.g. "/users/7?tab=a"). */
  push: (path: string) => void;
  /** Replace current entry without adding to history. */
  replace: (path: string) => void;
  /** Go back one entry. */
  back: () => void;
  /** Initial path at creation (debug helper). */
  initial: string;
}

function compileSegments(pattern: string) {
  return pattern
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith(":")
        ? ({ kind: "param", name: segment.slice(1) } as const)
        : segment === "*"
          ? ({ kind: "wildcard" } as const)
          : ({ kind: "static", value: segment } as const),
    );
}

export function matchRoute(pattern: string, url: string): RouteMatch | null {
  const [pathPart, queryPart] = url.split("?", 2);
  const segments = pathPart!.split("/").filter(Boolean);
  const compiled = compileSegments(pattern);
  const params: Record<string, string> = {};
  let i = 0;
  for (const seg of compiled) {
    if (seg.kind === "wildcard") {
      params["*"] = segments.slice(i).join("/");
      i = segments.length;
      break;
    }
    const actual = segments[i];
    if (actual == null) return null;
    if (seg.kind === "param") params[seg.name] = decodeURIComponent(actual);
    else if (seg.value !== actual) return null;
    i++;
  }
  if (i < segments.length) return null;
  const query: Record<string, string> = {};
  if (queryPart) {
    for (const pair of queryPart.split("&")) {
      if (!pair) continue;
      const [rawKey = "", rawValue = ""] = pair.split("=");
      if (rawKey !== "") query[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
    }
  }
  return { path: pathPart || "/", params, query };
}

export function createRouter(
  routes: string[],
  options: { base?: string; initial?: string } = {},
): Router {
  const base = (options.base ?? "").replace(/\/+$/, "");
  const canUseHistory =
    typeof globalThis !== "undefined" && typeof (globalThis as { history?: History }).history?.pushState === "function";
  const initial =
    options.initial ??
    (canUseHistory && typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");

  const [current, setCurrent] = createSignal<RouteMatch>({ path: "/", params: {}, query: {} });
  const resolve = (url: string): RouteMatch => {
    let pathPart = url.split("?", 1)[0]!;
    const basePrefix = base ? `${base}/` : "";
    if (basePrefix && pathPart.startsWith(basePrefix)) pathPart = `/${pathPart.slice(basePrefix.length)}`;
    else if (base && pathPart === base) pathPart = "/";
    const queryTail = url.includes("?") ? `?${url.split("?", 2)[1]}` : "";
    for (const pattern of routes) {
      const m = matchRoute(pattern, pathPart + queryTail);
      if (m) return m;
    }
    return { path: pathPart || "/", params: {}, query: Object.fromEntries(new URLSearchParams(url.split("?")[1] ?? "")) };
  };
  setCurrent(resolve(initial));

  if (canUseHistory && typeof window !== "undefined") {
    window.addEventListener("popstate", (event: PopStateEvent) => {
      const url = (event.state as { msfPath?: string } | null)?.msfPath ?? window.location.pathname + window.location.search;
      setCurrent(resolve(url));
    });
  }

  const setUrl = (path: string, mode: "push" | "replace") => {
    const url = base + path;
    if (canUseHistory && typeof window !== "undefined") {
      const state = { msfPath: path };
      if (mode === "push") window.history.pushState(state, "", url);
      else window.history.replaceState(state, "", url);
      setCurrent(resolve(path));
    } else {
      setCurrent(resolve(path));
    }
  };

  return {
    current,
    push: (path) => setUrl(path, "push"),
    replace: (path) => setUrl(path, "replace"),
    back: () => {
      if (canUseHistory && typeof window !== "undefined") window.history.back();
    },
    initial,
  };
}
