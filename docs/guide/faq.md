# FAQ

## Is MSF Fusion ready to use?
**As a developer preview, partially.** You can use the in-repo runtime (`@mustafa-26112026/runtime` core/DOM/SSR/universal), function components, and a JSX **subset** via the compiler. It is **not** production-ready: no compiler/IR pipeline for full TSX, no dev server/HMR for library packages, no router/actions/boundaries, limited benchmark coverage, and no npm-published packages.

## What works right now?
- **Show/For control-flow components** work in the isomorphic view layer (no compiler lowering needed)
- Reactive kernel: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, owner helpers
- DOM helpers: `@mustafa-26112026/runtime/dom` (`render`, `insert`, multi-root keyed `list`, `setAttribute`, ...)
- Isomorphic view + hydration: `@mustafa-26112026/runtime/universal` (`h`, `fragment`, `text`, `mount`, `hydrate`, function components)
- SSR string rendering: `@mustafa-26112026/runtime/server` (`h`, `renderToString`, `escapeHtml`)
- Compiler subset with two targets: `dom` (→ `@mustafa-26112026/runtime/dom`) and `universal` (→ isomorphic view descriptors) — JSX **subset only**
- Dev preview: `@mustafa-26112026/dev` compile APIs/CLI (`status`, `compile`)
- Examples: `examples/counter-basic`, `examples/counter-browser`, **`examples/fullstack`** (dev SSR + production prerender + Chromium-verified hydration)

## Can I install it from npm today?
No. Packages are private and currently export source files for monorepo development. Publishable builds/exports require further work and explicit approval before release.

## What syntax does MSF Fusion use?
Today: direct TypeScript/JavaScript calls to runtime APIs (and `h()` for SSR snapshots), plus **`Show`/`For` control-flow components** and **`For`/`Show` JSX component tags** in the `universal` compiler target. A full TSX/compiler pipeline is planned, not fully implemented.

## Is it based on React, Angular, Vue, Solid, or Svelte?
No. MSF Fusion is a standalone design that owns its reactivity, compiler, and runtime. It may compare against competitors in benchmarks, but it must not depend on, wrap, or copy their runtimes/source.

## Does it support TypeScript?
Yes for the current codebase and public runtime APIs (typed). Compiler diagnostics and full framework TypeScript authoring experience are planned.

## How fast is it?
There are **no MSF Fusion performance numbers yet**. Competitor baselines are measured and documented; any future MSF results must be measured with the same methodology and reported without unsupported superiority claims. See [benchmarks](../../benchmarks/methodology.md).

## Does it support SSR and hydration?
Yes in preview. SSR **string snapshot rendering** is available in preview (`@mustafa-26112026/runtime/server`). A **limited isomorphic/hydration preview** also exists via `@mustafa-26112026/runtime/universal` (view descriptors, DOM mount and hydrate with mismatch fallback), exercised end-to-end in `examples/fullstack`. **Streaming, resume, actions/router, and full component-model hydration are not implemented yet.**

## What about React/Angular/Web Components/Python interop?
These are future, evidence-gated goals. No adapters or bridge implementations are shipped.

## Is it secure?
Security is an architectural requirement, but the framework is not production-hardened. Current SSR renderer escapes by default for text/attributes in its supported model; broader boundary enforcement depends on future compiler/runtime work. See [security requirements](../security/security-requirements.md) and [threat model](../security/threat-model.md).

## What license does it use?
No final license has been selected. Until explicitly approved, the repository is **all rights reserved** per [LICENSE](../../LICENSE).

## Where can I see current status and evidence?
- [Engineering status](../engineering/status.md)
- [Architecture/code review](../reviews/architecture-code-review.md)
- [Roadmap](../engineering/roadmap.md) and [Implementation plan](../engineering/implementation-plan.md)
- [Benchmark report](../../benchmarks/reports/2026-11-16_09-03-34-486Z-li9o.md) (MSF micro, 12 samples) · [methodology](../../benchmarks/methodology.md)

## ملخص بالعربية
المشروع متاح حالياً كـ **معاينة مطوّر** (نواة تفاعلية، DOM bindings، طبقة universal تدعم المكونات الدالية وShow/For، SSR hydration، مترجم subset، أدوات dev معاينة، وأمثلة) داخل المستودع، لكنه غير مكتمل للإنتاج أو النشر. لا توجد سلسلة بناء متكاملة (dev server/HMR)، لا router/actions/boundaries، تغطية micro فقط، ولا نشر على npm. راجع حالة المشروع والأدلة المرتبطة.