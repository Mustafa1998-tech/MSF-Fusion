# Getting started

> **Status:** Milestone 1 developer preview. Runtime core, DOM helpers, SSR string rendering, and examples are runnable in-repo. Compiler/JSX, hydration, CLI/dev server, and npm publishing are **not implemented yet**.

## Developer preview (runnable now)

```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile

# Verify
pnpm run typecheck
pnpm --filter @msf/runtime run test
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test

# Examples
node examples/counter-basic/src/ssr.ts
pnpm --filter @msf/example-counter-browser dev

# Full-stack SSR + hydration pilot
pnpm --filter @msf/example-fullstack dev
```

**Current implemented surface (preview, subject to change):**
- `@msf/runtime`: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
- `@msf/runtime/dom`: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`
- `@msf/runtime/server`: `h`, `renderNode`, `renderToString`, `escapeHtml`

**Current limitations:** compiler subset is limited (`jsx-dom-v1`, no sourcemaps/IR pipeline/components/control-flow), SSR/hydration preview exists via `@msf/runtime/universal` (no streaming/resume), dev tooling is compile-only (no dev server/HMR for library packages), no router, no publishable `dist` packages yet.

## Current preview usage

### SSR snapshot

```ts
import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";

const html = renderToString(() => {
  const [count] = createSignal(0);
  return h("section", { class: "counter" },
    h("h1", null, "Counter"),
    h("p", null, "Count: ", count()),
  );
});

console.log(html);
```

### Browser fine-grained DOM

```ts
import { batch, createMemo, createSignal } from "@msf/runtime";
import { insert, render, setAttribute } from "@msf/runtime/dom";

render(() => {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);

  const root = document.createElement("section");
  const value = document.createElement("p");
  insert(value, () => `Count: ${count()} (double: ${doubled()})`);
  setAttribute(value, "data-count", () => String(count()));

  const btn = document.createElement("button");
  btn.textContent = "Increment";
  btn.addEventListener("click", () => {
    batch(() => setCount((n) => n + 1));
  });

  root.append(value, btn);
  return root;
}, document.getElementById("app")!);
```

> `packages/runtime` currently exports source `.ts` for monorepo/development use. A publishable `dist` build and stable package exports are planned.

## Planned (not available yet): project scaffolding and CLI

```bash
# Proposed — not available yet
pnpm create msf-app my-app
cd my-app
pnpm dev
pnpm build
```

Planned CLI (provisional): `msf dev`, `msf build`, `msf check`, `msf preview`.

## Recommended reading
1. [Engineering status](../engineering/status.md)
2. [Architecture overview](../architecture/overview.md)
3. [ADR index](../adr/README.md)
4. [Implementation plan](../engineering/implementation-plan.md)
5. [Benchmark methodology](../../benchmarks/methodology.md)

## ملخص بالعربية
يمكنك اليوم تشغيل معاينة المطوّر داخل المستودع (نواة تفاعلية، DOM، SSR نصي، وأمثلة) والتحقق بالاختبارات. أوامر الإنشاء وCLI وحزم npm والبناء النهائي والترطيب والمترجم/JSX **مخططة وغير متاحة بعد**.