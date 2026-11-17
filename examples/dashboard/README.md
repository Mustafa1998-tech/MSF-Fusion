# Dashboard example (Ops Board) — MSF Fusion

> **Status:** working end-to-end demo of the full-stack preview — SSR snapshot → hydration → fine-grained client-side filtering.

A realistic internal task board built to exercise MSF Fusion beyond a toy counter.

## What it demonstrates
- **SSR snapshot rendering** (`@msf/runtime/server`) producing real HTML with reactive-ready markup
- **Hydration** (`@msf/runtime/universal`) mounting the same component tree on the client, binding click handlers
- **Fine-grained reactivity in the browser** — filter buttons update the signal, `<tbody>` re-evaluates and swaps rows, visible count updates via accessor
- **Reusable components** with props and slots (`h(Component, props, ...children)`)
- **Production prerender + background start** — image-ready static page served by a Node HTTP server

## Run

```bash
# Development (on-demand SSR)
pnpm --filter @msf/example-dashboard dev
# open http://localhost:4175/
# optional filter: http://localhost:4175/?filter=open

# Production (static prerender + hydration)
pnpm --filter @msf/example-dashboard build:static
pnpm --filter @msf/example-dashboard start
# open http://localhost:4175/
```

## Files
- `src/app.ts` — shared view + SSR prerender/hydrate helpers
- `src/entry-client.ts` — client hydration entry (hydrate with URL param filter)
- `scripts/prerender.ts` — builds static SSR page into `dist/client/index.html`
- `src/server.ts` — production Node server + dev SSR via Vite middleware

## Notes
- The client uses real **hydration** (`hydrate()`): the SSR snapshot is adopted in place and the `<tbody>` reactive region is re-mounted before its following sibling anchor, leaving no duplicated SSR rows.
- This is an internal example app, not a shipped product UI.

---
**ملخص بالعربية:** مثال لوحة مهام (Ops Board) يُظهر SSR + الترطيب + تفاعلية دقيقة على المتصفح باستخدام MSF Fusion. يعمل في التطوير والإنتاج عبر prerender وStart بسيط.