# Contributing to MSF Fusion

Thank you for your interest in MSF Fusion. This project is currently in **Milestone 0** (architecture, baseline evidence, and tooling). Framework implementation is gated by explicit approval.

## Current contribution posture

- **Welcome now:** documentation fixes, benchmark methodology clarifications, reproducibility improvements, issue reports with evidence, and proposals that align with approved ADRs.
- **Gated:** new framework runtime/compiler/server implementation, API design changes, dependency additions, and performance/security claims. These require alignment with the [implementation plan](docs/engineering/implementation-plan.md) and milestone approval.
- **Not accepted:** code copied from other frameworks, runtime dependencies on React/Angular/Next.js, fabricated benchmarks, or claims without reproducible evidence.

## Development setup

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @msf/bench-runner run test
pnpm --filter @msf/spike-compiler-toolchain run test
```

Benchmarks must be run sequentially and interpreted according to [benchmarks/methodology.md](benchmarks/methodology.md).

## Pull request guidelines

1. Keep changes focused and explain *why* (not only *what*).
2. Run relevant typechecks/tests; include results in the PR description.
3. Do not commit secrets, large generated artifacts, or machine-specific noise.
4. Preserve dependency direction and architectural boundaries described in [docs/architecture/overview.md](docs/architecture/overview.md).
5. For benchmark-affecting changes, include environment details and raw evidence; do not publish superiority claims without methodology-compliant comparisons.
6. Add or update documentation (English required; Arabic summary appreciated where docs already include it).

## Commit and review expectations

- Prefer clear, descriptive commit messages.
- Reviews prioritize correctness, security, performance evidence, and maintainability over speed.
- Maintainers may defer out-of-scope work to future milestones.

## License and rights

By contributing, you agree that your contributions may be incorporated under the repository's current terms ([LICENSE](LICENSE), pending final license approval). Do not submit material you do not have the right to contribute.

## Questions

Open a discussion/issue describing the proposal, motivation, alternatives considered, and evidence. For security-sensitive matters, follow [SECURITY.md](SECURITY.md) instead of filing a public issue.
