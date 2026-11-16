# Competitor and toolchain versions — Milestone 0

Versions are **pinned** in `benchmarks/runner/package.json` and resolved from installed `node_modules` at report time. This manifest records the intended baseline set and rationale.

## Baseline competitors (measured)
| Competitor | Package(s) | Pinned version | Suites | Notes |
|---|---|---:|---|---|
| React | `react`, `react-dom` | 19.3.1 | SSR, bundle, DOM | No React Compiler. No standalone signal primitive; excluded from micro signal suite. |
| Solid | `solid-js` | 1.9.19 | micro, SSR, bundle, DOM | Micro uses client runtime `solid-js/dist/solid.js`; effect scenarios requiring render flush skipped. |
| Svelte | `svelte` | 5.57.3 | SSR, bundle, DOM | Svelte 5 runes/compiler output. |
| Vue | `vue`, `@vue/reactivity` | 3.5.45 | micro, SSR, bundle, DOM | Standalone reactivity in micro; Composition API in fixtures. |
| Preact Signals (primitive) | `@preact/signals-core` | 1.14.5 | micro | Included as fine-grained signal primitive reference; not a full framework DOM fixture. |

## Deferred competitors (not measured in Milestone 0)
| Competitor | Current version checked | Reason for deferral |
|---|---:|---|
| Angular | 22.2.6 | Signals/effects are DI/injector-bound; full app/SSR/build baselines need equivalent application harness and are deferred to avoid unfair micro comparisons. |
| Next.js | 16.4.6 | App Router/server-client boundary adds routing, bundling, and transport semantics not equivalent to a single render call; deferred until framework has comparable full-stack slice. |
| Qwik | 1.20.4 | Resumability/serialization model requires dedicated hydration/resume scenarios; not comparable to eager-hydration fixtures. |

## Toolchain
| Tool | Version | Purpose |
|---|---:|---|
| Node.js | v26.12.1 (installed) | Runtime for runner, builds, SSR |
| pnpm | 12.21.0 | Workspace/package manager |
| TypeScript | 7.0.2 | Type checking; unstable API probed in spike (see `benchmarks/evidence/compiler-toolchain.json`) |
| Vite | 8.3.8 | Production client/SSR builds (`minify: "oxc"`) |
| Vitest | 5.1.0 | Unit tests for runner/spike |
| Playwright | 1.65.1 | DOM automation (Chromium 1255 installed) |
| oxc-transform-react | 0.158.0 | Compiler toolchain spike (parse/strip/JSX/sourcemap feasibility) |

## Official sources consulted
- React Compiler: https://react.dev/learn/react-compiler
- Angular Signals: https://angular.dev/guide/signals
- Angular SSR: https://angular.dev/guide/ssr
- Solid fine-grained reactivity: https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity
- Svelte `$state`: https://svelte.dev/docs/svelte/$state
- Svelte server rendering: https://svelte.dev/docs/svelte/svelte-server
- Next.js server/client components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Qwik resumability: https://qwik.dev/docs/concepts/resumable
- TypeScript 7 progress (native compiler/API context): https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/
- Oxc parser: https://oxc.rs/docs/guide/usage/parser

## ملخص بالعربية
يوثّق هذا الملف الإصدارات المثبتة للمنافسين والأدوات المستخدمة في خط الأساس (React/Solid/Svelte/Vue/Preact Signals) مع أسباب تأجيل Angular وNext.js وQwik، وروابط المصادر الرسمية.
