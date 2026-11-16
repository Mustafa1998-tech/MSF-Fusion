# Full-stack SSR + hydration example (developer preview)

> A real project-shaped pilot app using MSF Fusion's isomorphic runtime preview: **server-rendered markup → client hydration** with fine-grained reactivity. This is not a claim that the framework is fully production-ready — it is the current M1/M2 preview applied end-to-end.

## What this example demonstrates
- **SSR snapshot** using `@msf/runtime/server` / `@msf/runtime/universal` (`renderAppInner`)
- **Isomorphic view descriptor** (`h`, `fragment`, `text`) shared between Node.js and the browser
- **Client hydration** (`hydrate`) — adopts SSR markup, attaches event listeners and reactive bindings without wiping the DOM
- **Dev mode:** Vite on-demand SSR through middleware mode with `ssrLoadModule`
- **Production mode:** static prerender (`build:static`) + Node HTTP server serving client assets

## Run

```bash
# development (on-demand SSR)
pnpm --filter @msf/example-fullstack dev
# open http://localhost:4173/?count=3

# production static prerender + hydration
pnpm --filter @msf/example-fullstack build:static
pnpm --filter @msf/example-fullstack start
# open http://localhost:4173/
```

## Files
- `src/app.ts` — shared view (`createAppView`) used by SSR and hydration
- `src/server.ts` — Node HTTP server; dev uses Vite middleware + SSR on demand, production serves prerendered static files
- `src/entry-client.ts` — client hydration entry
- `scripts/prerender.ts` — builds HTML with SSR content baked in for `dist/client/index.html`
- `index.html` — HTML shell with `<!--ssr-outlet-->`

## Notes
- Hydration marks mismatches and falls back to a fresh mount if SSR markup does not match the view tree.
- The view API is preview; the compiler does not yet emit this view code.
- No router, data actions, or streaming yet — this is a pilot for the isomorphic slice.
