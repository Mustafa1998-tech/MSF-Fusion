# Scenario: Browser DOM operations, startup, and heap snapshot

## Goal
Measure user-visible DOM update scenarios, startup timing, and coarse retained-heap snapshots in Chromium.

## Scenarios
`create-1000`, `create-10000`, `update-all-1000`, `update-one-1000`, `swap-1000`, `remove-one-1000`, `clear-1000`, `replace-1000` (see `fixtures/shared/bench-client.ts`).

## Method
- Playwright Chromium, headless, fixed viewport (1280x900), local static production build.
- Each fixture implements the same `window.__bench` contract: `prepare`, `run`, `inspect`.
- `syncMs`: synchronous work until control returns. `frameMs`: includes two `requestAnimationFrame` waits.
- Warm-up runs discarded; verification after warm-up and final sample.
- CDP heap usage sampled after baseline/10k-create/clear with explicit GC where supported.

## Limitations
- Two-rAF floor masks small differences in `frameMs`; always read `syncMs`.
- No CPU/network throttling; desktop variance expected.
- Heap snapshots indicate retained memory at points in time, not leak absence.

## ملخص بالعربية
يقيس عمليات DOM والبدء ولقطات كومة الذاكرة في Chromium عبر عقد قياس موحد، مع الانتباه إلى حد أدنى زمني ناتج عن انتظار إطاري العرض.
