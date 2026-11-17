# Real-world quickstart — how a developer builds an app with MSF Fusion

> **Status:** developer-preview quickstart. APIs and authoring model are preview; treat as *how to use what exists today*, not a final contract.

## Audience
You are evaluating MSF Fusion by cloning the repository and trying it on a real page. You do **not** yet have an npm-published package; you consume the workspace packages directly via `workspace:*` or tarball verification (`pnpm verify:package`).

## What you can build today (preview)
- A **full-stack app** with **SSR + hydration** where the same component tree is evaluated on the server and adopted on the client.
- **Interactive fine-grained updates** (signals/memos/effects) that update only affected DOM nodes.
- **Control flow** with `Show`/`For` and keyed `list()` reconciled against multi-root items.
- **SSR snapshot** with inline escaping by default.

## Requirements
- Node.js ≥ 24 LTS (v26.x tested) · `pnpm@12.21.0` · Git

## Install and verify
```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile
pnpm build          # emits dist/* ESM + d.ts for @msf/* packages
pnpm run typecheck
```

Verification: `pnpm verify:package` packs the four `@msf/*` packages, installs them into a clean consumer, and runs a runtime smoke test + TypeScript typecheck. Evidence: `benchmarks/evidence/package-verification.json`.

## Minimal realistic example — Ops Board
See [`examples/ops-board`](../../examples/dashboard) for a real task-board scenario with SSR + client filtering. The counter examples (`examples/counter-browser`, `examples/counter-basic`) show the simplest shape.

## Server + client, shared code

**`src/app.ts`** — the same component tree is used by both server and client:
```ts
import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";
import { mount, hydrate } from "@msf/runtime/universal";

export function createView(initial = 0) {
  const [count, setCount] = createSignal(initial);
  const view = () =>
    h("section", { class: "card" },
      h("p", null, () => `Count: ${count()}`),
      h("button", { type: "button", onClick: () => setCount((n) => n + 1) }, "Inc"),
    );
  return { view, count };
}
```

**SSR output (Node.js):**
```ts
const html = renderToString(() => h(App)); // full-page HTML string
```

**Client mount/hydrate:**
```ts
mount(() => h(App), document.getElementById("app")!); // CSR
hydrate(() => h(App), document.getElementById("app")!); // adopt SSR markup
```

## What ships today vs what's missing
| Ships today | Still waiting |
|---|---|
| Reactive kernel + DOM ops + SSR + hydration | Router, data actions, streaming/resume |
| Function components, `Show`/`For`, keyed `list()` | Compiler lowering of `<Show>`/`<For>` JSX today applies only to the view layer, not JSX parse pipeline |
| Examples and tests in the repo | Compiler diagnostics in the toolchain, sourcemaps, full TSX coverage |
| `@msf/*` packages with `dist` builds, tarball-verifiable | npm publishing (owner approval, though repo is MIT) |

## Recommended next step
1. Read the [engineering status](../engineering/status.md) for the live checklist.
2. Try the [Ops Board example](../../examples/dashboard): `pnpm --filter @msf/example-dashboard dev`.
3. Use `@msf/dev` `check` to diagnose the JSX subset in your own project: `pnpm --filter @msf/dev run check ./src`.

## ملخص بالعربية
هذا دليل عملي لاختبار الإطار من clone نظيف (install → build → verify) مع أمثلة حقيقية واستخدام الحزم من داخل المستودع، بدل التعتيم على ما هو جاهز وما لم يكتمل بعد.