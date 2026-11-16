# Getting started

> **Proposed / not implemented.** This page describes the intended getting-started experience. Commands, package names, and APIs below are **design placeholders** and may change.

## Today: developer preview (runnable subset)

MSF Fusion is still in active development, but a **real runtime preview** is now available in this monorepo:
- Reactive kernel: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`
- DOM helpers: `@msf/runtime/dom` (`render`, `insert`, `setText`, `setAttribute`, `For`, ...)
- SSR string renderer: `@msf/runtime/server` (`h`, `renderToString`, escaping by default)

```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile

# Verify runtime and tooling
pnpm run typecheck
pnpm --filter @msf/runtime run test
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test

# Run the included SSR example
node examples/counter-basic/src/ssr.ts

# Run the interactive browser example (Vite)
pnpm --filter @msf/example-counter-browser dev
```

**Current limitations:** no compiler/JSX subset yet, no hydration, no dev server/CLI, no router, and packages are not published to npm. APIs may change.

**Recommended reading:**
1. [Architecture overview](../architecture/overview.md)
2. [ADR index](../adr/README.md)
3. [Implementation plan](../engineering/implementation-plan.md)
4. [Benchmark methodology](../../benchmarks/methodology.md)

## Future (planned): create an app

Once Milestone 1+ is approved and implemented, the intended workflow will look like:

```bash
# Proposed — not available yet
pnpm create msf-app my-app
cd my-app
pnpm install
pnpm dev
```

**Planned project shape (illustrative):**
```text
my-app/
├─ msf.config.ts          # framework/build config (proposed)
├─ tsconfig.json
├─ src/
│  ├─ entry-client.ts     # client mount (proposed)
│  ├─ entry-server.ts     # SSR handler (proposed, later milestone)
│  ├─ App.msf.tsx         # or .msf / .tsx subset — syntax TBD
│  └─ components/
└─ package.json
```

## Planned prerequisites
- **Node.js:** supported LTS (exact matrix TBD at M1 approval)
- **Package manager:** pnpm (recommended), npm/yarn compatibility to be validated
- **TypeScript:** strict mode, framework-provided config preset
- **Editor:** TypeScript language service + future MSF tooling/diagnostics

## Your first app (current preview API)

**SSR snapshot (runnable now):**
```ts
import { createSignal } from "@msf/runtime";
import { h, renderToString } from "@msf/runtime/server";

function CounterCard() {
  const [count] = createSignal(0);
  return h("section", { class: "counter" },
    h("h1", null, "Counter"),
    h("p", null, "Count: ", count()),
  );
}

console.log(renderToString(() => CounterCard()));
```

**Browser fine-grained DOM (runnable with bundler/ESM in browser):**
```ts
import { createSignal } from "@msf/runtime";
import { render, insert, setAttribute } from "@msf/runtime/dom";

const [count, setCount] = createSignal(0);

render(() => {
  const root = document.createElement("section");
  const value = document.createElement("p");
  insert(value, () => `Count: ${count()}`);
  setAttribute(value, "data-count", () => String(count()));

  const btn = document.createElement("button");
  btn.textContent = "Increment";
  btn.addEventListener("click", () => setCount((n) => n + 1));

  root.append(value, btn);
  return root;
}, document.getElementById("app")!);
```

> **Note:** JSX/compiler syntax shown elsewhere in the guide remains **proposed** until the compiler subset lands. The APIs above are the currently implemented runtime primitives.

## Development workflow (planned)
- `msf dev` — local dev server with HMR and compiler diagnostics
- `msf build` — production client/server builds
- `msf check` — type and framework boundary diagnostics
- `msf preview` — preview production build

(Exact CLI command names are provisional.)

## Next steps
- Learn the model: [Reactivity](reactivity.md)
- Learn authoring: [Syntax & components](syntax-and-components.md)
- Understand boundaries: [Full-stack & SSR](fullstack.md)

## ملخص بالعربية
حالياً يمكنك استنساخ المستودع وتشغيل اختبارات/قياسات المرحلة 0 فقط. الأوامر والحزم وبنية المشروع في هذه الصفحة **مقترحة وغير متاحة بعد**، وستتحدد نهائياً عند تنفيذ المراحل المعتمدة.
