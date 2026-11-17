# Why MSF Fusion — what problem does it solve, and how do you use it?

> **Honest scope statement:** MSF Fusion is a **developer preview**. The problem it targets (below) is real; the solution is designed but **only partially proven** in-repo today. Nothing on this page is a performance, compatibility, or production-readiness claim.

## The problem it targets

### 1. UI frameworks pay for correctness with overhead
React's model re-renders and reconciles a virtual tree; fine-grained alternatives (Solid) or compile-time approaches (Svelte) reduce that cost but often force a lock-in to one authoring style or one server story. MSF Fusion's bet: **measured, compiler-assisted fine-grained reactivity** — direct DOM updates on exact dependency changes, with an ownership/disposal model that keeps effects deterministic and leak-resistant.

### 2. Full-stack boundaries are informal by default
Server-to-client data flow, SSR vs hydration ownership, and where code runs are usually conventions, not contracts. MSF Fusion makes boundaries explicit:

- server/client/shared semantics designed into the model (ADR-003),
- safe serialization contract (only explicitly serializable data crosses),
- compile-time diagnostics for unsupported/unknown patterns,
- SSR + hydration handled by one isomorphic view layer (`@msf/runtime/universal`).

### 3. Type safety stops at the build tool
MSF Fusion treats types as the public contract: `@msf/contracts` holds the interfaces shared by runtime, compiler, and tooling; compiler diagnostics carry codes; the public API is typed end-to-end.

### 4. "Will it also work when I mix SSR with interactive UI?" — one component tree
The same component function evaluates on the server (`renderToString`) and on the client (`mount`/`hydrate`) through the same `h`/`Show`/`For`/`fragment`/`text` primitives — no separate server and client trees, no bespoke hydration conventions.

## What exists today vs what is planned

| Problem area | Status today | Evidence |
|---|---|---|
| Fine-grained reactive kernel (signals/memos/effects/ownership) | ✅ implemented & tested | `packages/runtime` (38 tests) |
| Keyed DOM list with multi-root items | ✅ tested | `test/list.test.ts` |
| SSR string renderer (escaped) | ✅ implemented | `@msf/runtime/server` |
| SSR + hydration pilot via isomorphic view layer | ✅ implemented & browser-verified | `examples/fullstack`, `examples/dashboard` (Ops Board) |
| Component model + Show/For | ✅ runtime layer; compiler lowering pending | `view.ts`, `test/view.test.ts` |
| JSX compiler (`jsx-dom-v1`, `jsx-universal-v1`) | ✅ subset only | `packages/compiler` (14 tests) |
| Dev diagnostics CLI | ✅ preview | `packages/dev` (6 tests) |
| Router / data actions / streaming / resume | ❌ not implemented | planned (M2+, gated) |
| Dev server + HMR | ❌ not implemented | planned (M2+) |
| Competitive performance measurements | ⚠️ informational only | `benchmarks/` (one machine, no claim) |

**Honest summary:** MSF Fusion documents and builds toward solving the **correctness + full-stack boundary + measured fine-grained updates** problem. It proves the runtime, hydration, components, and packaging slices today inside this repository. It does **not** yet ship the whole product (router/data/streaming/HMR), and it makes no superiority claim over React/Solid/Svelte/Vue.

## How a developer uses it (today)

### Clone-and-run workflow
```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile
pnpm build

# SSR snapshot example
node examples/counter-basic/src/ssr.ts

# Full-stack SSR + hydration
pnpm --filter @msf/example-fullstack dev

# Ops Board — realistic SSR + signal-driven filters
pnpm --filter @msf/example-dashboard dev
```

### Consuming the runtime directly (in-repo workspace)
```ts
import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";
import { hydrate } from "@msf/runtime/universal";

function App() {
  const [count, setCount] = createSignal(0);
  return h("button", { type: "button", onClick: () => setCount((n) => n + 1) },
    () => `Count: ${count()}`);
}

// server
const html = renderToString(() => h(App));

// client
hydrate(() => h(App), document.getElementById("app")!);
```

### Deeper docs
- [Getting started](guide/getting-started.md) — current runnable preview
- [Real-world quickstart](guide/real-world-quickstart.md) — clone → build → verify → your first app
- [Reactivity](guide/reactivity.md) · [Syntax & components](guide/syntax-and-components.md) · [Full-stack & SSR](guide/fullstack.md) · [FAQ](guide/faq.md)
- [API stability matrix](api.md) · [Production readiness](production-readiness.md)

## When NOT to use it

- Real company production systems today (it is a preview).
- When you need guaranteed npm availability, router, streaming SSR, HMR, or ecosystem compatibility — not implemented/not planned for this release.

## العربية — ملخص

**أي مشكلة يحلها MSF Fusion؟** يستهدف ثلاث مشاكل مجتمعة: (1) تكلفة الـ VDOM reconciliation بالمقارنة مع تحديثات ذرية مباشرة، (2) حدود غير معرّفة بين السيرفر والكلاينت (بيانات وSSR وhydration)، (3) أنواع TypeScript كعقد حقيقي عبر كامل البناء. ما زالت الحقائق جزئية: النواة تعمل والتطبيقات الصغيرة تعمل كاملة، لكن لا router ولا streaming ولا HMR بعد، ولا أي ادعاء تفوق. الاستخدام الفعلي اليوم: نسخ المستودع وتشغيل الأمثلة، والقراءة عبر الدليل وملفات العمارة قبل أي استخدام حقيقي.
