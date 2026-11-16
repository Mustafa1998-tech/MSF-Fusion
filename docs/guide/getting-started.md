# Getting started

> **Proposed / not implemented.** This page describes the intended getting-started experience. Commands, package names, and APIs below are **design placeholders** and may change.

## Today (Milestone 0): explore the project

MSF Fusion does not yet ship an installable framework package. You can explore the design and evidence in this repository:

```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile

# Verify Milestone 0 tooling
pnpm run typecheck
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test

# Read baseline evidence
pnpm bench:report
```

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

## Your first component (proposed example)

```tsx
// Proposed syntax — not runnable yet
import { signal } from "msf/runtime";

export function Counter() {
  const count = signal(0);

  return (
    <button onClick={() => count.set(count.get() + 1)}>
      Count: {count}
    </button>
  );
}
```

> **Note:** The exact API names (`signal().get()/set()` vs getter/setter functions vs compiler sugar), file extensions, and JSX/template syntax are part of the approved compiler/runtime design and will be finalized during implementation.

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
