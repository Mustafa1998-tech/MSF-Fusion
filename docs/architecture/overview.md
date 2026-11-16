# Architecture overview — MSF Fusion

## Vision
MSF Fusion aims to be a **standalone** web framework that owns its reactivity, compiler, runtime, and server integration. It must not depend on or wrap React, Angular, Next.js, or copy their source. Compatibility is provided through adapters/bridges built on MSF Fusion primitives, not by embedding competitor runtimes.

## Core principles
1. **Compiler-assisted, runtime-true:** the compiler lowers declarative authoring into explicit fine-grained reactive operations; the runtime does not emulate VDOM diffing as the primary update model.
2. **Fine-grained reactivity:** state changes propagate to precise computations/effects/DOM bindings with predictable ownership and disposal.
3. **TypeScript-first:** types are part of the public contract (APIs, compiler diagnostics, generated outputs) while runtime behavior remains correct in plain JS builds.
4. **Full-stack by design:** client, SSR, hydration/streaming/resume strategy, data boundaries, and server handlers share one model and security posture.
5. **Evidence over claims:** performance, compatibility, and security assertions require reproducible measurements/tests.

## Current implementation status (M1 in progress)
| Component | Target | Current state |
|---|---|---|
| Reactive kernel | signals/memos/effects, ownership/disposal, batching | **Implemented (preview):** `packages/runtime/src/core.ts` with tests |
| DOM runtime | fine-grained bindings, control flow, keyed updates | **Partial (preview):** `packages/runtime/src/dom.ts` (insert/attrs/events, basic keyed `list`) |
| SSR | render-to-string, hydration/streaming | **Partial (preview):** `packages/runtime/src/server.ts` (`h`, `renderToString`, escaping); no hydration/isomorphic components |
| Compiler | parse/analyze/IR/codegen, JSX subset, sourcemaps | **Scaffold only:** `packages/compiler` (not implemented) |
| Dev tooling | CLI, HMR, diagnostics | **Scaffold only:** `packages/dev` (not implemented) |
| Contracts | shared IR/interfaces | **Scaffold:** `packages/contracts` |
| Benchmarks (competitors) | reproducible baselines | **Implemented:** `benchmarks/runner` + final baseline evidence |
| MSF benchmark integration | equivalent MSF fixtures/measurements | **Pending** |

See [engineering status](../engineering/status.md) and [architecture/code review](../reviews/architecture-code-review.md) for details and risks.

## System context (C4 L1)

```mermaid
C4Context
  title MSF Fusion — System Context (target)
  Person(dev, "Developer", "Builds apps with MSF Fusion")
  Person(user, "End User", "Uses deployed app")
  System(msf, "MSF Fusion", "Compiler, runtime, dev server, SSR/adapters")
  System_Ext(browser, "Browser", "Executes client runtime")
  System_Ext(node, "Node.js LTS", "Build, SSR, server handlers")
  System_Ext(npm, "npm ecosystem", "ESM/CJS packages, tooling")
  System_Ext(py, "Python/WASM", "Optional bridge targets")
  Rel(dev, msf, "Authors TS/JSX-like templates, config")
  Rel(msf, browser, "Serves client bundles/HTML")
  Rel(msf, node, "Runs on")
  Rel(msf, npm, "Consumes/provides packages")
  Rel(msf, py, "Interop via explicit bridge", "planned")
  Rel(user, browser, "Interacts")
```

## Container view (C4 L2, target)

```mermaid
C4Container
  title MSF Fusion — Containers (target)
  Person(dev, "Developer")
  Container(compiler, "Compiler", "TS/Node, Oxc+TS analysis", "Parses, analyzes, lowers reactive graph, emits client/server code")
  Container(runtime, "Client Runtime", "JS/TS", "Signals, effects, scheduler, DOM bindings, hydration/resume")
  Container(server, "Server Runtime", "Node.js", "SSR, streaming, actions/endpoints, serialization boundaries")
  Container(devtools, "Dev Server/CLI", "Vite/Node", "HMR, diagnostics, build orchestration")
  Container(adapters, "Adapters/Bridges", "Packages", "Web Components, React/Angular interop, Python/WASM bridge")
  ContainerDb(cache, "Build/Graph Cache", "FS", "Incremental compilation artifacts")
  Rel(dev, devtools, "Uses CLI/dev server")
  Rel(devtools, compiler, "Invokes")
  Rel(compiler, runtime, "Emits client code")
  Rel(compiler, server, "Emits server code")
  Rel(compiler, cache, "Reads/writes")
  Rel(server, runtime, "Ships HTML + hydration data")
  Rel(runtime, adapters, "Interop boundaries")
```

## Compile-to-runtime pipeline (sequence, target)

```mermaid
sequenceDiagram
  autonumber
  participant Src as Source (.ts/.tsx subset)
  participant Parse as Parser (Oxc)
  participant Check as Type Analysis (TS adapter)
  participant Graph as Reactive Graph IR
  participant Lower as Lowering/Codegen
  participant Client as Client Bundle
  participant Server as SSR/Server Bundle
  Src->>Parse: syntax tree + locations
  Parse->>Check: symbols/types/diagnostics
  Parse->>Graph: template + reactive reads/writes
  Check->>Graph: type constraints, safety hints
  Graph->>Lower: ownership, scheduling, boundaries
  Lower->>Client: fine-grained DOM/runtime calls
  Lower->>Server: render/serialize/endpoint code
```

## Dependency direction (target and current rule)

```mermaid
graph TD
  A[Authoring API] --> B[Compiler Frontend]
  B --> C[Reactive IR]
  D[Type Checker Adapter] --> C
  C --> E[Codegen]
  E --> F[Client Runtime]
  E --> G[Server Runtime]
  F --> H[DOM/Browser]
  G --> I[Node/Edge Adapter]
  J[Interop Adapters] --> F
  J --> G
  K[CLI/Devtools] --> B
  K --> E
```

**Rule:** runtime packages must not import compiler internals; compiler depends on shared IR/contracts only. Adapters depend on public runtime/compiler surfaces.

## Key architectural decisions
- ADR-001: Compiler-assisted fine-grained reactivity over VDOM-first runtime
- ADR-002: Signals/ownership model and scheduling boundaries
- ADR-003: Full-stack data/serialization boundary and SSR strategy
- ADR-004: Compiler toolchain split (Oxc parse/transform + TypeScript semantic adapter)
- ADR-005: Security/performance as non-negotiable constraints

## ملخص بالعربية
يوثّق هذا المستند المعمارية المستهدفة لـ MSF Fusion والحالة الحالية: نواة تفاعلية وطبقة DOM/SSR أولية **منفذة كمعاينة**، بينما المترجم وIR/codegen وCLI/HMR والنموذج الموحد والترطيب ما زالت قيد التنفيذ وفق ADRs والخطة.
