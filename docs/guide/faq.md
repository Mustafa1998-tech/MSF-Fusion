# FAQ

## Is MSF Fusion ready to use?
**Not yet for application development.** Milestone 0 delivers architecture, ADRs, a reproducible benchmark lab, and a compiler toolchain spike. The framework runtime/compiler/server packages are planned for implementation after explicit approval (see [implementation plan](../engineering/implementation-plan.md)).

## Can I install it from npm today?
No. There are no published MSF Fusion framework packages yet. The `packages/`, `apps/`, and `examples/` directories are reserved for approved milestones.

## What syntax does MSF Fusion use?
The final authoring syntax (JSX subset, directives, or file format) will be decided and implemented in Milestone 1. The [syntax & components guide](syntax-and-components.md) shows **proposed, non-runnable** examples to communicate intent.

## Is it based on React, Angular, Vue, Solid, or Svelte?
No. MSF Fusion is a standalone design that owns its reactivity, compiler, and runtime. It may learn from industry ideas (and compares against competitors in benchmarks), but it must not depend on, wrap, or copy their runtimes/source.

## Will it support TypeScript?
Yes, TypeScript-first is a core goal: typed APIs, typed component contracts, and compiler diagnostics are planned. (Today, the repository tooling is TypeScript-based.)

## How fast is it?
There are **no MSF Fusion performance numbers yet** because the framework is not implemented. The repository includes reproducible competitor baselines and methodology; any future MSF results must be measured and reported with the same rigor. See [benchmarks](../../benchmarks/methodology.md).

## Does it support SSR, streaming, or resumability?
Minimal SSR/client mount for a supported subset is planned in the MVP/M2 direction; streaming and resumability are deferred until correctness, security, and evidence justify them. See [full-stack guide](fullstack.md) and [roadmap](../engineering/roadmap.md).

## What about React/Angular/Web Components/Python interop?
Compatibility and bridges are **design goals** to be validated with real integration evidence in later milestones. No adapters or bridge implementations are shipped in M0.

## Is it secure?
Security is treated as an architectural requirement (safe defaults, boundaries, serialization, threat modeling), but executable framework security behavior depends on implementation. See [security requirements](../security/security-requirements.md) and [threat model](../security/threat-model.md).

## What license does it use?
No final license has been selected. Until explicitly approved, the repository is **all rights reserved** per [LICENSE](../../LICENSE) and package metadata is `UNLICENSED`.

## How can I contribute?
Read [CONTRIBUTING.md](../../CONTRIBUTING.md), [quality gates](../engineering/gates.md), and open an issue/proposal aligned with the current milestone. For vulnerabilities, follow [SECURITY.md](../../SECURITY.md).

## Where are the benchmark results?
- Latest report: [`benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md`](../../benchmarks/reports/2026-11-16_06-39-52-525Z-5om9.md)
- Raw data: [`benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json`](../../benchmarks/results/2026-11-16_06-39-52-525Z-5om9.json)
- Methodology: [`benchmarks/methodology.md`](../../benchmarks/methodology.md)

## ملخص بالعربية
الإطار غير جاهز للاستخدام الإنتاجي أو التثبيت حالياً، ولا توجد أرقام أداء خاصة به. هذا المستودع يوفر التصميم والقياسات الأساسية والأدلة فقط، والتنفيذ مرهون بموافقة المراحل القادمة.
