# MSF Fusion Guide

> **Status:** Milestone 1/M2 developer preview.  
> A **runnable** subset exists: reactive kernel, DOM helpers, isomorphic view layer (`mount`/`hydrate`), function components, SSR string renderer, and examples. Compiler/JSX execution is limited to a subset (two targets: `dom` and `universal`). Streaming, hydration for all patterns, CLI/dev server, router, and npm publishing are **not implemented yet**. Examples marked **Proposed** are not implemented.

This guide explains both the **currently runnable APIs** and the **intended** developer experience for MSF Fusion.

## Who this is for
- Developers trying the current runtime preview in this monorepo
- Contributors implementing Milestone 1+ work
- Reviewers assessing API ergonomics, syntax, and documentation expectations

## Guide map
| Topic | Description |
|---|---|
| [Getting started](getting-started.md) | Current runnable preview, examples, and planned install/dev workflow |
| [Real-world quickstart](real-world-quickstart.md) | Practical steps to clone, build, verify, and try building your own app on MSF today |
| [Reactivity](reactivity.md) | Implemented kernel primitives, semantics notes, and proposed authoring ergonomics |
| [Syntax & components](syntax-and-components.md) | Current manual DOM/SSR authoring and proposed component/compiler syntax |
| [Full-stack & SSR](fullstack.md) | Current SSR snapshot capabilities and planned boundaries/hydration/actions |
| [FAQ](faq.md) | Common questions about status, usage, compatibility, performance, and security |

## Design principles
- **Fine-grained updates:** state reads create precise dependencies; writes update only affected computations/bindings.
- **Explicitness:** ownership, batching, and (planned) server/client boundaries are visible and predictable.
- **TypeScript-first:** public APIs are typed; compiler diagnostics are a planned milestone goal.
- **Compiler-assisted (target):** authoring syntax will lower to efficient runtime operations (no VDOM diff as the primary model).

## What works today

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @mustafa-26112026/runtime run test

node examples/counter-basic/src/ssr.ts
pnpm --filter @mustafa-26112026/example-counter-browser dev
```

See the [root README](../../README.md), [engineering status](../engineering/status.md), and [benchmark methodology](../../benchmarks/methodology.md).

## ملخص بالعربية
الدليل يغطّي ما هو **متاح حالياً** (معاينة تشغيلية لنواة التفاعلية وDOM/SSR وأمثلة) وما هو **مقترح** (المترجم/JSX والترطيب والأدوات). الأمثلة الموسومة "مقترح" غير منفذة بعد.