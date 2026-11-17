# Getting started

> **Status:** Milestone 1/M2 developer-preview. Runtime core, DOM helpers, SSR string rendering, isomorphic view layer with hydration, function components, examples, package builds, and consumer verification are runnable in-repo. Full compiler (IR/control-flow), dev server/HMR, router, streaming/resume, and npm publishing are **not implemented yet**.

## Developer preview (runnable now)

```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile

# Build workspace packages (dist outputs used by examples/consumer checks)
pnpm build

# Verify
pnpm run typecheck
pnpm --filter @mustafa-26112026/runtime run test
pnpm --filter @mustafa-26112026/bench-runner run test
pnpm --filter @mustafa-26112026/spike-compiler-toolchain run test

# Examples
node examples/counter-basic/src/ssr.ts
pnpm --filter @mustafa-26112026/example-counter-browser dev

# Full-stack SSR + hydration pilot
pnpm --filter @mustafa-26112026/example-fullstack dev

# Ops Board (SSR snapshot + client-side filters)
pnpm --filter @mustafa-26112026/example-dashboard dev

# Consumer-installable package verification
pnpm verify:package
```

**Current implemented surface (preview, subject to change):**
- `@mustafa-26112026/runtime`: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, `getOwner`, `runWithOwner`, `flushSync`
- `@mustafa-26112026/runtime/universal`: isomorphic view layer — `h`, `fragment`, `text`, DOM `mount`/`hydrate` (adopts SSR markup, attaches listeners/bindings, falls back to fresh mount on mismatch). **Function components** via `h(Component, props, children)`.
- `@mustafa-26112026/runtime/dom`: `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list` (multi-root keyed), `For`
- `@mustafa-26112026/runtime/server`: `h`, `renderNode`, `renderToString`, `escapeHtml` (component nodes resolved)

**Current limitations:** compiler subset is limited (default `jsx-dom-v1` and `jsx-universal-v1`; no sourcemaps/IR pipeline/components/control-flow), SSR/hydration is a preview (no streaming/resume), dev tooling is compile-only (no dev server/HMR for library packages), no router, and packages are still marked `private: true` (no npm publish yet; MIT-licensed on GitHub).

**Package builds & consumer verification:** `pnpm build` emits ESM+d.ts into `dist/`, and `pnpm verify:package` packs the four `@mustafa-26112026/*` packages and smoke-tests them in a temp consumer (install, runtime smoke, TS typecheck). Evidence: `benchmarks/evidence/package-verification.json`.

## Current preview usage

### SSR snapshot

```ts
import { createSignal } from "@mustafa-26112026/runtime";
import { h, renderToString } from "@mustafa-26112026/runtime/server";

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
import { batch, createMemo, createSignal } from "@mustafa-26112026/runtime";
import { insert, render, setAttribute } from "@mustafa-26112026/runtime/dom";

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

Planned CLI (provisional): `msf dev`, `msf build`, `msf check`, `msf preview`. The preview `@mustafa-26112026/dev` ships:

```bash
pnpm --filter @mustafa-26112026/dev run status           # feature status
pnpm --filter @mustafa-26112026/dev run check <path>     # diagnose JSX files, exit 1 on unsupported patterns
pnpm --filter @mustafa-26112026/dev run compile <path>   # emit outputs
```

## Recommended reading
1. [Engineering status](../engineering/status.md)
2. [Architecture overview](../architecture/overview.md)
3. [ADR index](../adr/README.md)
4. [Implementation plan](../engineering/implementation-plan.md)
5. [Benchmark methodology](../../benchmarks/methodology.md)

## ملخص بالعربية
يمكنك اليوم تشغيل معاينة المطوّر داخل المستودع (نواة تفاعلية، DOM، SSR نصي، وأمثلة) والتحقق بالاختبارات. أوامر الإنشاء وCLI وحزم npm والبناء النهائي والترطيب والمترجم/JSX **مخططة وغير متاحة بعد**.