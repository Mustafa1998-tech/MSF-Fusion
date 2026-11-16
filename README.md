# MSF Fusion

**MSF Fusion** (Mustafa AI Software Factory Fusion Framework) is a planned standalone, compiler-assisted, fine-grained reactive, TypeScript-first full-stack framework.

> **Current state: Milestone 0 (architecture + benchmark lab).** No production framework runtime/compiler/server package is implemented yet. This repository contains architecture decisions, a reproducible competitor baseline laboratory, and a compiler toolchain spike only.

## What Milestone 0 delivers
- Architecture direction and ADRs with trade-offs and diagrams
- Reproducible benchmark runner and equivalent competitor fixtures (React, Solid, Svelte, Vue, Preact Signals)
- Preliminary/smoke measurements removed before final baseline; final baseline evidence to be generated sequentially and committed
- Compiler toolchain feasibility spike (`spikes/compiler-toolchain`) with recorded evidence
- Security/performance constraints, risks, gates, MVP scope, and implementation plan for approval

## What Milestone 0 does **not** claim
- No MSF Fusion performance numbers, no superiority claims, no production-ready API
- No Angular/Next.js/Qwik baseline yet (deferred with reasons)
- No hydration/streaming/real-world/security-benchmark results yet
- No final license and no published packages

## Repository layout
| Path | Purpose |
|---|---|
| `docs/` | Architecture, ADRs, security, performance, engineering governance, implementation plan |
| `benchmarks/` | Methodology, scenarios, competitor manifest, category READMEs, runner, results/reports/evidence |
| `spikes/compiler-toolchain/` | TypeScript 7 / Oxc feasibility probe (Milestone 0 only) |
| `packages/`, `apps/`, `examples/`, `tests/` | Reserved for approved future milestones (currently empty) |

## Quick commands
```bash
pnpm install --frozen-lockfile
pnpm --filter @msf/bench-runner run typecheck
pnpm --filter @msf/bench-runner run test
pnpm spike:toolchain
# Benchmarks (run sequentially):
pnpm bench:micro
pnpm bench:ssr
pnpm bench:bundle
pnpm bench:dom
pnpm bench:report
```

## Documentation index
- [Architecture overview](docs/architecture/overview.md)
- [ADRs](docs/adr/README.md)
- [Security requirements](docs/security/security-requirements.md) · [Threat model](docs/security/threat-model.md)
- [Performance requirements](docs/performance/performance-requirements.md)
- [Engineering risks](docs/engineering/risks.md) · [Quality gates](docs/engineering/gates.md) · [Roadmap](docs/engineering/roadmap.md) · [MVP scope](docs/engineering/mvp-scope.md)
- [Implementation plan (approval)](docs/engineering/implementation-plan.md)
- [Benchmark methodology](benchmarks/methodology.md)

## ملخص بالعربية
MSF Fusion إطار عمل مخطط له (تفاعلية دقيقة بمساعدة المترجم، TypeScript أولاً، كامل المكدس). المرحلة 0 الحالية تحتوي على توثيق معماري ومختبر قياس خط أساس قابل لإعادة الإنتاج وتجربة جدوى لسلسلة أدوات المترجم فقط، دون أي تنفيذ إنتاجي للإطار أو ادعاءات أداء.
