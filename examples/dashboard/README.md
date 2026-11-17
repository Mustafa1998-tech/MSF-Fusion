# Dashboard example (Ops Board) — MSF Fusion

> **Status:** working end-to-end demo of the full-stack preview — SSR snapshot → hydration → fine-grained client-side filtering.

A realistic internal task board built to exercise MSF Fusion beyond a toy counter.

## What it demonstrates
- **SSR snapshot rendering** (`@mustafa-26112026/runtime/server`) producing real HTML with reactive-ready markup
- **Hydration** (`@mustafa-26112026/runtime/universal`) mounting the same component tree on the client, binding click handlers
- **Fine-grained reactivity in the browser** — filter buttons update the signal, `<tbody>` re-evaluates and swaps rows, visible count updates via accessor
- **Reusable components** with props and slots (`h(Component, props, ...children)`)
- **Production prerender + background start** — image-ready static page served by a Node HTTP server

## Run

```bash
# Development (on-demand SSR)
pnpm --filter @mustafa-26112026/example-dashboard dev
# open http://localhost:4175/
# optional filter: http://localhost:4175/?filter=open

# Production (static prerender + hydration)
pnpm --filter @mustafa-26112026/example-dashboard build:static
pnpm --filter @mustafa-26112026/example-dashboard start
# open http://localhost:4175/
```

## Files
- `src/app.ts` — shared view + SSR prerender/hydrate helpers
- `src/entry-client.ts` — client hydration entry (mount with URL param filter)
- `scripts/prerender.ts` — builds static SSR page into `dist/client/index.html`
- `src/server.ts` — production Node server + dev SSR via Vite middleware

## Notes
- The example uses `mount` for the client by design — the SSR snapshot is static; hydration currently re-mounts the tree client-side. Full fine-grained hydration adoption for `<tbody>` is still in the universal runtime preview.
- This is an internal example app, not a shipped product UI.

---
**ملخص بالعربية:** مثال لوحة مهام (Ops Board) يُظهر SSR + الترطيب + تفاعلية دقيقة على المتصفح باستخدام MSF Fusion. يعمل في التطوير والإنتاج عبر prerender وStart بسيط.