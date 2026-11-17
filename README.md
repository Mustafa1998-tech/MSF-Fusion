<div align="center">

<img src="branding/logo/msf-fusion-logo.png" alt="MSF Fusion Framework" width="360" />

# MSF Fusion

**A compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework — designed for correctness, performance, and security.**

[![Status](https://img.shields.io/badge/status-M1%2FM2%20Developer%20Preview%20(components%20%2B%20hydration)-0f766e)](#project-status)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178c6)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-LTS%20%2F%20v26%20tested-339933)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12.21.0-f69220)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen)](LICENSE)

[Developer Guide](docs/guide/README.md) · [Architecture](docs/architecture/overview.md) · [ADRs](docs/adr/README.md) · [Benchmarks](benchmarks/methodology.md) · [Roadmap](docs/engineering/roadmap.md) · [Implementation Plan](docs/engineering/implementation-plan.md)

</div>

---

## Overview

**MSF Fusion** (Mustafa AI Software Factory — Fusion Framework) is a planned **standalone** framework that owns its reactivity model, compiler, runtime, and server integration. It is not built on, wrapped around, or derived from React, Angular, Next.js, or other framework runtimes.

The project follows an evidence-driven process: architecture decisions, security/performance constraints, reproducible competitor baselines, and compiler feasibility spikes were established before implementation. Milestone 1 is now in progress with a **runnable developer-preview runtime** (reactive kernel, DOM helpers, SSR string renderer) while compiler/JSX, hydration, and dev tooling continue.

## Project status

| Milestone | State | Summary |
|---|---|---|
| **M0 — Architecture & Baseline** | ✅ Completed | ADRs, security/threat model, benchmark lab, final competitor baseline, compiler toolchain spike |
| **M1 / M2 — Reactive kernel, components, hydration slices** | 🚧 In progress | Tested reactive kernel + DOM helpers + SSR; isomorphic view layer with **hydration** and **function components**; compiler subset with two targets (DOM + universal); dev-tooling preview; MSF micro-benchmark evidence; consumer-installable `dist` packages verified |
| M2+ | 📋 Planned | Streaming/resume, full-stack boundaries, router, DX, compatibility, hardening, release approval |

> **Important:** A working **developer-preview framework** exists in-repo (runtime, DOM, universal/SSR/hydration, components, compiler subset). It is still preview: full compiler/IR pipeline, dev server/HMR for library packages, router/actions/boundaries, comprehensive MSF measurements, and npm-publish readiness remain in progress. This repository makes **no superiority claims**.

## What is in this repository today

- **Runtime + DOM + universal (`@msf/runtime`):** fine-grained reactive kernel (signals/memos/effects/roots/disposal/batch/untrack), DOM bindings (`insert`/`setAttribute`/events/keyed multi-root `list`), SSR string renderer (`h`/`renderToString`/escaping), and an isomorphic view layer (`h`/`fragment`/`text`) with DOM mount + **hydration** and **function components**. Includes unit tests.
- **Compiler subset (`@msf/compiler`):** `jsx-dom-v1` (intrinsic JSX → DOM calls) and **`jsx-universal-v1`** (JSX → isomorphic view descriptors for SSR/mount/hydrate). Golden-output tests and diagnostics.
- **Dev tooling preview (`@msf/dev`):** `compileFile`/`compilePath`/`getDevStatus` + CLI for the supported subset.
- **Package consumption verified:** `dist` ESM+d.ts builds for `@msf/contracts|runtime|compiler|dev`; `pnpm verify:package` packs and smoke-tests them in a temp consumer (install, runtime smoke, TS typecheck); evidence at `benchmarks/evidence/package-verification.json`.
- **Examples:** `examples/counter-basic` (SSR snapshot), `examples/counter-browser` (Vite), **`examples/fullstack`** (dev SSR via Vite middleware + production prerender + hydration), and **`examples/dashboard`** (Ops Board — SSR + signal-driven filtering).
- **Benchmark lab + MSF micro evidence:** competitor baseline preserved; MSF runtime measured in micro suite with 12 samples; raw JSON + report committed (`2026-11-16_09-03-34-486Z-li9o`).
- **Architecture/governance:** ADR-001–ADR-005, security/threat model/requirements, quality gates, roadmap, DTB ledger (`docs/dtb/STATE.md`, `BACKLOG.md`, `CHANGELOG.md`), and review docs.

**In progress / not yet implemented:** full component model and hydration for all JSX/compiler patterns, fuller IR/sourcemaps and the TypeScript semantic adapter, dev server/HMR for library packages, router/full-stack action boundaries, publishable `dist` packages, comprehensive MSF benchmark fixtures/runs, and production hardening (M2+). **No MSF Fusion superiority/performance claims.**

## Design principles

- **Fine-grained reactivity:** targeted updates driven by an explicit dependency graph, not VDOM diffing as the primary model.
- **Compiler-assisted:** lowering and diagnostics informed by static analysis, with a framework-owned IR.
- **TypeScript-first:** strong typing as part of the authoring and tooling contract.
- **Full-stack boundaries:** explicit server/client/shared semantics and safe serialization (planned).
- **Evidence over claims:** performance, compatibility, and security assertions require reproducible measurements and tests.

## Repository structure

```text
.
├─ packages/
│  ├─ runtime/                   # Reactive kernel, DOM helpers, server, universal (mount/hydrate)
│  ├─ contracts/                 # Shared interfaces (CompileRequest.target, Diagnostic)
│  ├─ compiler/                  # Compiler subset: jsx-dom-v1 / jsx-universal-v1
│  └─ dev/                       # Dev tooling preview (compile APIs + CLI)
├─ examples/
│  ├─ counter-basic/             # Runnable SSR snapshot example
│  ├─ counter-browser/           # Runnable Vite browser example
│  ├─ fullstack/                 # SSR + hydration pilot (dev SSR / prod prerender)
│  └─ dashboard/                # Full-stack Ops Board (SSR + filters)
├─ docs/                         # Architecture, ADRs, guide, security, performance, engineering, DTB ledger
├─ benchmarks/                   # Runner, results/reports, evidence, methodology, scenarios
├─ spikes/                       # Milestone 0 feasibility probes
├─ branding/                     # Visual identity assets
└─ .github/                      # CI and community templates
```

## Getting started (developer preview)

**Prerequisites:** Node.js (LTS; v26.x tested), `pnpm@12.21.0`, Git. For DOM benchmarks, Playwright browsers must be installed.

```bash
pnpm install --frozen-lockfile

# Build packages
pnpm build

# Quality checks
pnpm run typecheck
pnpm --filter @msf/runtime run test
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test

# Verify packed packages install & work in a clean consumer
pnpm verify:package

# Run preview examples
node examples/counter-basic/src/ssr.ts
pnpm --filter @msf/example-counter-browser dev

# Full-stack SSR + hydration pilot
pnpm --filter @msf/example-fullstack dev

# Ops Board — realistic SSR + fine-grained filters
pnpm --filter @msf/example-dashboard dev

# Benchmarks (run sequentially for comparable results)
pnpm bench:micro && pnpm bench:ssr && pnpm bench:bundle && pnpm bench:dom && pnpm bench:report
```

See [benchmarks/methodology.md](benchmarks/methodology.md) for fairness rules, exclusions, and interpretation guidance.

## Documentation

| Area | Documents |
|---|---|
| **Developer guide (proposed syntax & usage)** | [Guide index](docs/guide/README.md) · [Getting started](docs/guide/getting-started.md) · [Real-world quickstart](docs/guide/real-world-quickstart.md) · [Reactivity](docs/guide/reactivity.md) · [Syntax & components](docs/guide/syntax-and-components.md) · [Full-stack & SSR](docs/guide/fullstack.md) · [FAQ](docs/guide/faq.md) |
| Architecture | [Overview](docs/architecture/overview.md) · [ADR index](docs/adr/README.md) |
| Decisions | [ADR-001 Reactivity](docs/adr/ADR-001-reactivity-model.md) · [ADR-002 Runtime & scheduling](docs/adr/ADR-002-runtime-and-scheduling.md) · [ADR-003 Full-stack boundaries](docs/adr/ADR-003-fullstack-ssr-boundaries.md) · [ADR-004 Compiler toolchain](docs/adr/ADR-004-compiler-toolchain.md) · [ADR-005 Security & performance gates](docs/adr/ADR-005-security-performance-gates.md) |
| Security & Performance | [Security requirements](docs/security/security-requirements.md) · [Threat model](docs/security/threat-model.md) · [Performance requirements](docs/performance/performance-requirements.md) |
| Engineering | [Status](docs/engineering/status.md) · [API stability](docs/api.md) · [Risks](docs/engineering/risks.md) · [Gates](docs/engineering/gates.md) · [Roadmap](docs/engineering/roadmap.md) · [MVP scope](docs/engineering/mvp-scope.md) · [Implementation plan](docs/engineering/implementation-plan.md) · [Code review](docs/reviews/architecture-code-review.md) |
| Benchmarks | [Methodology](benchmarks/methodology.md) · [Competitor versions](benchmarks/competitors/versions.md) · [Scenarios](benchmarks/scenarios) |

## Baseline evidence (latest)

- **Competitor micro+SSR+bundle+DOM baseline (M0, sequential):** [`benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json`](benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json) · [report](benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md)
- **MSF micro preview evidence (2026-11-16):** [`benchmarks/results/2026-11-16_09-03-34-486Z-li9o.json`](benchmarks/results/2026-11-16_09-03-34-486Z-li9o.json) · [report](benchmarks/reports/2026-11-16_09-03-34-486Z-li9o.md) (informational; not a superiority claim)
- **Package verification:** `benchmarks/evidence/package-verification.json` · reproduction: `pnpm build && pnpm verify:package`
- **Toolchain spike:** [`benchmarks/evidence/compiler-toolchain.json`](benchmarks/evidence/compiler-toolchain.json)

Results are machine- and time-specific. Read [limitations](benchmarks/methodology.md#known-limitations) before interpreting.

## Contributing & governance

- Contributions and implementation work are gated by milestone approval. See [CONTRIBUTING.md](CONTRIBUTING.md) and [Quality gates](docs/engineering/gates.md).
- Security reporting: [SECURITY.md](SECURITY.md)
- Community standards: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Changes: [CHANGELOG.md](CHANGELOG.md)

## License

The repository is licensed under the **MIT License**; see [LICENSE](LICENSE). Package metadata declares `MIT`. The packages are still marked `private: true` and are **not published to npm**; GitHub is the primary distribution channel.

---

<details>
<summary><strong>ملخص بالعربية</strong></summary>

**MSF Fusion** إطار عمل مستقل (تفاعلية دقيقة بمساعدة المترجم، TypeScript أولاً، كامل المكدس) دون اعتماد على React/Angular/Next.  
**الحالة الحالية:** المرحلة 0 مكتملة ومرحلة M1 قيد التنفيذ بوجود **معاينة مطوّر قابلة للتشغيل** (`@msf/runtime`: نواة تفاعلية + DOM helpers + SSR نصي) مع اختبارات وأمثلة (`counter-basic`, `counter-browser`).  
**غير مكتمل بعد:** المترجم/JSX subset وIR/codegen، hydration والنموذج الموحّد، CLI/HMR، بناء `dist` للنشر، وقياسات أداء لـ MSF Fusion (ولا توجد ادعاءات تفوق).  
راجع [حالة المشروع](docs/engineering/status.md)، [الخارطة](docs/engineering/roadmap.md)، و[مراجعة المعمارية والكود](docs/reviews/architecture-code-review.md).

</details>
