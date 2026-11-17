# Scenario: Production bundle size and build time

## Goal
Measure production client output size and Vite build time for the same functional benchmark fixture.

## Candidates
React, Solid, Svelte, Vue fixture apps (same imperative benchmark contract, initial empty table) — plus **MSF Fusion runtime preview** (`@mustafa-26112026/runtime`), informational only (not a superiority claim). Latest MSF evidence (2026-11-16): `benchmarks/results/2026-11-16_11-43-37-434Z-wlh8.{json,md}` (build 46.1 ms; 8.81 KiB raw / 3.09 KiB brotli JS).

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
هذا السيناريو يقيس حجم الحزم (راو/gzip/brotli) ووقت بناء Vite لتطبيق مكافئ، مع تضمين MSF Fusion كقياس معلوماتي فقط.