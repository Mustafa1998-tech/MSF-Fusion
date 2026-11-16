<div align="center">

# MSF Fusion

**A compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework — designed for correctness, performance, and security.**

[![Status](https://img.shields.io/badge/status-Milestone%200%20(Architecture%20%26%20Baseline)-0f766e)](#project-status)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178c6)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-LTS%20%2F%20v26%20tested-339933)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12.21.0-f69220)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-pending%20approval-lightgrey)](LICENSE)

[Developer Guide](docs/guide/README.md) · [Architecture](docs/architecture/overview.md) · [ADRs](docs/adr/README.md) · [Benchmarks](benchmarks/methodology.md) · [Roadmap](docs/engineering/roadmap.md) · [Implementation Plan](docs/engineering/implementation-plan.md)

</div>

---

## Overview

**MSF Fusion** (Mustafa AI Software Factory — Fusion Framework) is a planned **standalone** framework that owns its reactivity model, compiler, runtime, and server integration. It is not built on, wrapped around, or derived from React, Angular, Next.js, or other framework runtimes.

The project follows an evidence-driven process: architecture decisions, security/performance constraints, reproducible competitor baselines, and compiler feasibility spikes are established **before** framework implementation.

## Project status

| Milestone | State | Summary |
|---|---|---|
| **M0 — Architecture & Baseline** | ✅ Completed (pending approval) | ADRs, security/threat model, benchmark lab, final competitor baseline, compiler toolchain spike |
| **M1 — Reactive kernel & compiler slice** | ⏳ Proposed | Awaiting explicit approval of M0 artifacts and implementation plan |
| M2+ | 📋 Planned | SSR/hydration, full-stack boundaries, DX, compatibility, hardening |

> **Important:** No production MSF Fusion runtime, compiler, or server package is implemented yet. The [developer guide](docs/guide/README.md) documents **proposed syntax and usage** (design preview). This repository does **not** contain MSF Fusion performance numbers and makes **no superiority claims**.

## What is in this repository today

- **Architecture & decisions:** system/container views, compile-to-runtime pipeline, and ADR-001–ADR-005 with trade-offs and Mermaid diagrams.
- **Benchmark laboratory:** reproducible runner with pinned dependencies, environment capture, raw JSON samples, median/P95/CV/MAD reporting, and equivalent fixtures.
- **Competitor baselines (measured):** React 19.3.1, Solid 1.9.19, Svelte 5.57.3, Vue 3.5.45, and `@preact/signals-core` 1.14.5 (micro primitives where semantically comparable).
- **Compiler toolchain spike:** TypeScript 7 unstable semantic API + Oxc transform feasibility, with recorded evidence.
- **Engineering governance:** threat model, security/performance requirements, risks, quality gates, MVP scope, roadmap, and a detailed approval-gated implementation plan.

**Deferred by design (documented):** Angular/Next.js/Qwik baselines, streaming SSR, hydration/resume, real-world/security-benchmark suites, long-running leak analysis, adapters, and any MSF Fusion runtime claims.

## Design principles

- **Fine-grained reactivity:** targeted updates driven by an explicit dependency graph, not VDOM diffing as the primary model.
- **Compiler-assisted:** lowering and diagnostics informed by static analysis, with a framework-owned IR.
- **TypeScript-first:** strong typing as part of the authoring and tooling contract.
- **Full-stack boundaries:** explicit server/client/shared semantics and safe serialization (planned).
- **Evidence over claims:** performance, compatibility, and security assertions require reproducible measurements and tests.

## Repository structure

```text
.
├─ docs/                         # Architecture, ADRs, security, performance, engineering
├─ benchmarks/
│  ├─ runner/                    # Benchmark CLI, suites, fixtures, tests
│  ├─ results/                   # Raw benchmark JSON (committed deliberately)
│  ├─ reports/                   # Generated Markdown reports
│  ├─ evidence/                  # Spike/toolchain evidence
│  ├─ methodology.md             # Measurement rules and limitations
│  ├─ competitors/versions.md    # Pinned baseline manifest
│  └─ scenarios/                 # micro, ssr, bundle, dom
├─ spikes/
│  └─ compiler-toolchain/        # Milestone 0 feasibility probe
├─ packages/ apps/ examples/     # Reserved for approved milestones
└─ .github/                      # CI and community templates
```

## Getting started (Milestone 0 artifacts)

**Prerequisites:** Node.js (LTS; v26.x tested), `pnpm@12.21.0`, Git. For DOM benchmarks, Playwright browsers must be installed.

```bash
pnpm install --frozen-lockfile

# Quality checks
pnpm run typecheck
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test

# Compiler toolchain evidence
pnpm spike:toolchain

# Benchmarks (run sequentially for comparable results)
pnpm bench:micro
pnpm bench:ssr
pnpm bench:bundle
pnpm bench:dom
pnpm bench:report
```

See [benchmarks/methodology.md](benchmarks/methodology.md) for fairness rules, exclusions, and interpretation guidance.

## Documentation

| Area | Documents |
|---|---|
| **Developer guide (proposed syntax & usage)** | [Guide index](docs/guide/README.md) · [Getting started](docs/guide/getting-started.md) · [Reactivity](docs/guide/reactivity.md) · [Syntax & components](docs/guide/syntax-and-components.md) · [Full-stack & SSR](docs/guide/fullstack.md) · [FAQ](docs/guide/faq.md) |
| Architecture | [Overview](docs/architecture/overview.md) · [ADR index](docs/adr/README.md) |
| Decisions | [ADR-001 Reactivity](docs/adr/ADR-001-reactivity-model.md) · [ADR-002 Runtime & scheduling](docs/adr/ADR-002-runtime-and-scheduling.md) · [ADR-003 Full-stack boundaries](docs/adr/ADR-003-fullstack-ssr-boundaries.md) · [ADR-004 Compiler toolchain](docs/adr/ADR-004-compiler-toolchain.md) · [ADR-005 Security & performance gates](docs/adr/ADR-005-security-performance-gates.md) |
| Security & Performance | [Security requirements](docs/security/security-requirements.md) · [Threat model](docs/security/threat-model.md) · [Performance requirements](docs/performance/performance-requirements.md) |
| Engineering | [Risks](docs/engineering/risks.md) · [Gates](docs/engineering/gates.md) · [Roadmap](docs/engineering/roadmap.md) · [MVP scope](docs/engineering/mvp-scope.md) · [Implementation plan](docs/engineering/implementation-plan.md) |
| Benchmarks | [Methodology](benchmarks/methodology.md) · [Competitor versions](benchmarks/competitors/versions.md) · [Scenarios](benchmarks/scenarios) |

## Baseline evidence (latest)

- **Raw data:** [`benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json`](benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json)
- **Report:** [`benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md`](benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md)
- **Toolchain spike:** [`benchmarks/evidence/compiler-toolchain.json`](benchmarks/evidence/compiler-toolchain.json)

Results are machine- and time-specific. Read [limitations](benchmarks/methodology.md#known-limitations) before interpreting.

## Contributing & governance

- Contributions and implementation work are gated by milestone approval. See [CONTRIBUTING.md](CONTRIBUTING.md) and [Quality gates](docs/engineering/gates.md).
- Security reporting: [SECURITY.md](SECURITY.md)
- Community standards: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Changes: [CHANGELOG.md](CHANGELOG.md)

## License

No final open-source or commercial license has been selected yet. Until explicitly approved, repository contents are provided under the terms in [LICENSE](LICENSE) (**all rights reserved, pending approval**). Package metadata currently declares `UNLICENSED`.

---

<details>
<summary><strong>ملخص بالعربية</strong></summary>

**MSF Fusion** إطار عمل مخطط له (تفاعلية دقيقة بمساعدة المترجم، TypeScript أولاً، كامل المكدس) ومملوك بالكامل دون الاعتماد على React/Angular/Next.  
الحالة الحالية: **المرحلة 0 مكتملة بانتظار الاعتماد** (معمارية، ADRs، متطلبات أمان/أداء، مختبر قياس خط أساس منافس قابل لإعادة الإنتاج، وتجربة جدوى لسلسلة أدوات المترجم). **لا يوجد تنفيذ إنتاجي للإطار ولا أرقام أداء لـ MSF Fusion ولا ادعاءات تفوق.**  
راجع [خطة التنفيذ](docs/engineering/implementation-plan.md) و[بوابات الجودة](docs/engineering/gates.md) قبل بدء المرحلة 1.

</details>
