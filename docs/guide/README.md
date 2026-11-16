# MSF Fusion Guide

> **Status:** Milestone 1 developer preview in progress.  
> A **runnable runtime subset** is available now (`@msf/runtime` core + DOM helpers + SSR string renderer). Compiler/JSX subset, hydration, CLI/dev server, and stable package publishing are still planned/in progress. Examples marked **Proposed** are not implemented yet.

This guide explains both the **currently runnable APIs** and the **intended** developer experience for MSF Fusion.

## Who this is for
- Developers trying the current runtime preview in this monorepo
- Contributors implementing Milestone 1+ work
- Reviewers assessing API ergonomics, syntax, and documentation expectations

## Guide map
| Topic | Description |
|---|---|
| [Getting started](getting-started.md) | Current runnable preview, examples, and planned install/dev workflow |
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
pnpm --filter @msf/runtime run test

node examples/counter-basic/src/ssr.ts
pnpm --filter @msf/example-counter-browser dev
```

See the [root README](../../README.md), [engineering status](../engineering/status.md), and [benchmark methodology](../../benchmarks/methodology.md).

## ملخص بالعربية
الدليل يغطّي ما هو **متاح حالياً** (معاينة تشغيلية لنواة التفاعلية وDOM/SSR وأمثلة) وما هو **مقترح** (المترجم/JSX والترطيب والأدوات). الأمثلة الموسومة "مقترح" غير منفذة بعد.