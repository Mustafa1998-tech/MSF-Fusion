# Scenario: Server-side rendering (single render)

## Goal
Measure warm-process throughput for rendering an equivalent 1,000-row table to an HTML string.

## Candidates
React 19.3.1 (`react-dom/server`), Solid 1.9.19 (`solid-js/web`), Svelte 5.57.3 (`svelte/server`), Vue 3.5.45 (`@vue/server-renderer`) — plus the **MSF Fusion runtime preview** (`@mustafa-26112026/runtime` `renderToString`, informational preview measurement, not a production claim).

## Fixture contract
- Equivalent data shape and 1,000 rows (`data-row` attributes 0..999).
- Each SSR entry exports `renderPage()` returning a string/awaitable string.
- Structural validation: 1,000 `data-row` entries and expected first/last markers before timing.

## Method
- Vite SSR build per fixture; build time recorded separately.
- Warm-up renders discarded; repeated samples with fixed renders/sample (CLI option).
- Median/P95/CV in ms/render and renders/s.

## Exclusions
No data fetching, routing, streaming, suspense boundaries beyond fixture, hydration, or full framework servers (Next.js/Angular SSR/Qwik). Those require different equivalence contracts.

## ملخص بالعربية
يقيس زمن عرض SSR لجدول مكافئ من 1000 صف في عملية Node دافئة، مع التحقق البنيوي واستبعاد البث والترطيب وأطر الخادم الكاملة.
