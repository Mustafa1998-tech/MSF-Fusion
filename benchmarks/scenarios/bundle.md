# Scenario: Production bundle size and build time

## Goal
Measure production client output size and Vite build time for the same functional benchmark fixture.

## Candidates
React, Solid, Svelte, Vue fixture apps (same imperative benchmark contract, initial empty table).

## Method
- Vite production build, `minify: "oxc"` (Vite 8), empty `dist` per measured build.
- One untimed warm build, then measured builds (default 3).
- Collect raw/gzip (level 9)/Brotli (q11) sizes for JS/CSS/HTML assets; report totals and build median/CV.
- Build time excludes dependency install and TypeScript type checking.

## Interpretation
Sizes include framework runtime plus benchmark harness code, not hello-world apps. React Compiler is not enabled. Comparisons are fixture-specific.

## Exclusions
Angular CLI and Next.js build pipelines are not included due to different bundling/routing/output models.

## ملخص بالعربية
يقيس حجم حزم الإنتاج (خام/gzip/brotli) وزمن بناء Vite لنفس تطبيق الاختبار، مع فصل زمن التثبيت وفحص الأنواع.
