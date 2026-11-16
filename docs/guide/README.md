# MSF Fusion Guide (Design Preview)

> **Status: Proposed — not implemented yet.**  
> MSF Fusion is in Milestone 0. The framework runtime, compiler, packages, and CLI described in this guide are **planned** and subject to approval and change. Code examples are **illustrative (non-runnable)** unless explicitly marked otherwise.

This guide explains the *intended* developer experience for MSF Fusion: how you will create apps, write reactive state, compose components, and work with server/full-stack boundaries once the approved milestones are implemented.

## Who this is for
- Developers evaluating MSF Fusion's design direction
- Contributors preparing for Milestone 1+ implementation
- Reviewers assessing API ergonomics, syntax, and documentation expectations

## Guide map
| Topic | Description |
|---|---|
| [Getting started](getting-started.md) | Current repository state, prerequisites, and the planned install/dev workflow |
| [Reactivity](reactivity.md) | Proposed `signal`, `computed`, `effect`, ownership, batching, and lifecycle |
| [Syntax & components](syntax-and-components.md) | Proposed component authoring, templates/JSX subset, props, control flow, events, refs |
| [Full-stack & SSR](fullstack.md) | Planned server/client boundaries, data loading, actions, SSR/hydration direction |
| [FAQ](faq.md) | Common questions about status, compatibility, performance, and security |

## Design principles reflected in the syntax
- **Fine-grained updates:** state reads create precise dependencies; writes update only affected computations/DOM.
- **Explicitness:** ownership, batching, and server/client boundaries are visible and predictable.
- **TypeScript-first:** public APIs and component contracts are designed to be strongly typed.
- **Compiler-assisted:** authoring syntax lowers to efficient runtime operations (no VDOM diff as the primary model).

## Current reality (what works today)
You can already use this repository to review architecture and run evidence tooling:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @msf/bench-runner run test
pnpm spike:toolchain
pnpm bench:report
```

See the [root README](../../README.md), [architecture overview](../architecture/overview.md), and [benchmark methodology](../../benchmarks/methodology.md).

## ملخص بالعربية
هذا الدليل **تصميم مقترح غير منفّذ بعد**. يشرح تجربة المطور المتوقعة لـ MSF Fusion (التفاعلية، الصياغة، المكونات، والعمل كامل المكدس) عند تنفيذ المراحل المعتمدة، مع توضيح ما هو متاح اليوم (التوثيق والقياسات وأدوات المرحلة 0 فقط).
