# FAQ

## Is MSF Fusion ready to use?
**As a developer preview, partially.** You can use the in-repo runtime APIs (`@msf/runtime` core, DOM helpers, SSR string renderer) and run the included examples/tests. It is **not** yet a complete, stable, or production-ready framework (no compiler/JSX subset, no hydration, no CLI/dev server, no published packages).

## What works right now?
- Reactive kernel: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, owner helpers
- DOM helpers: `@msf/runtime/dom` (`render`, `insert`, `setText`, `setAttribute`, `list`, etc.)
- SSR string rendering: `@msf/runtime/server` (`h`, `renderToString`, `escapeHtml`)
- Examples: `examples/counter-basic`, `examples/counter-browser`
- Tooling/evidence: benchmark runner, baseline results, compiler toolchain spike

## Can I install it from npm today?
No. Packages are private and currently export source files for monorepo development. Publishable builds/exports require further work and explicit approval before release.

## What syntax does MSF Fusion use?
Today: direct TypeScript/JavaScript calls to runtime APIs (and `h()` for SSR snapshots). A compiler-supported JSX/authoring subset is planned but **not implemented yet**.

## Is it based on React, Angular, Vue, Solid, or Svelte?
No. MSF Fusion is a standalone design that owns its reactivity, compiler, and runtime. It may compare against competitors in benchmarks, but it must not depend on, wrap, or copy their runtimes/source.

## Does it support TypeScript?
Yes for the current codebase and public runtime APIs (typed). Compiler diagnostics and full framework TypeScript authoring experience are planned.

## How fast is it?
There are **no MSF Fusion performance numbers yet**. Competitor baselines are measured and documented; any future MSF results must be measured with the same methodology and reported without unsupported superiority claims. See [benchmarks](../../benchmarks/methodology.md).

## Does it support SSR and hydration?
SSR **string snapshot rendering** is available in preview (`@msf/runtime/server`). **Hydration, streaming, and resumability are not implemented yet.**

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
- [Benchmark report](../../benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md) and [methodology](../../benchmarks/methodology.md)

## ملخص بالعربية
المشروع متاح حالياً كـ **معاينة مطوّر** (نواة تفاعلية وDOM/SSR وأمثلة) داخل المستودع، لكنه غير مكتمل للإنتاج أو النشر. لا مترجم/JSX ولا ترطيب ولا CLI ولا قياسات أداء لـ MSF بعد. راجع حالة المشروع والخطة والأدلة المرتبطة.