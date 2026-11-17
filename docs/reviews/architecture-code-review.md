# Architecture and code review

**Date:** 2026-11-16  
**Scope:** Repository state on `master` (M1 developer preview), focusing on `packages/runtime`, package scaffolds, examples, and alignment with ADRs/plan.

## Executive summary
- **Strength:** a real fine-grained reactive kernel, initial DOM helpers, SSR string rendering, examples, and passing tests provide a credible M1 foundation.
- **Gap:** the framework is not yet compiler-assisted in implementation (no IR/codegen/JSX subset, no hydration/isomorphic model, no dev tooling, no publishable `dist` builds, no MSF benchmark integration).
- **Risk areas:** reactivity edge-case correctness (in-run duplicate dependency tracking), DOM/SSR model divergence, packaging readiness, and scope pressure.

## Architecture alignment
- **ADR-001/002:** partially implemented in runtime core (signals/memos/effects, ownership/disposal, batching). Missing compiler lowering, cycle detection/dev diagnostics, and advanced scheduling/error-boundary policies.
- **ADR-003:** preview-only SSR (`h`/`renderToString` snapshot with escaping). Missing component parity, hydration, streaming, and enforced boundaries.
- **ADR-004:** compiler toolchain not implemented (scaffold only); spike evidence exists.
- **Dependency direction:** acceptable so far (no runtime→compiler dependency, no React/Angular/Next runtime deps).

## Code findings

### `packages/runtime/src/core.ts`
- **Good:** array-based source/observer bookkeeping with slot updates, `CLEAN/CHECK/DIRTY` propagation, cleanup/disposal order, batching/effect queue.
- **Issues:**
  - Duplicate tracking when the same source is read multiple non-consecutive times in one computation run (only consecutive dedupe at `readSignal`).
  - Setter treats any function as updater, preventing function-as-value without wrapping (API semantics must be explicit/tested).
  - No cycle detection/dev warnings; error handling rethrows without higher-level recovery strategy.
  - Possible duplicate effect scheduling in some propagation paths (correctness likely preserved but extra work).

### `packages/runtime/src/dom.ts`
- **Good:** reactive `insert`/`setText`/`setAttribute` via effects, root-owned `render`, keyed `list` with per-item scopes and item/index signals.
- **Issues:**
  - Non-keyed/accessor `For` and simple replacements recreate nodes; keyed path assumes a single root node per mapped item (multi-root/fragment cases need support or explicit constraints).
  - Text insertion replaces nodes rather than updating in-place in some paths.
  - DOM and SSR APIs are not unified (different tree models).

### `packages/runtime/src/server.ts`
- **Good:** safe-by-default escaping, event prop omission, `untrack` snapshot rendering.
- **Limitations:** not integrated with component/runtime DOM model, no hydration markers/serialization, limited attribute semantics.

### Scaffolds and packaging
- `@mustafa-26112026/contracts`, `@mustafa-26112026/compiler`, `@mustafa-26112026/dev` are honest scaffolds.
- Runtime exports point to source `.ts` files and packages are private; suitable for monorepo preview, not yet npm-ready.

## Recommendations (prioritized)
1. **P0:** fix in-run duplicate dependency tracking; add tests for duplicate reads and setter function-value semantics.
2. **P1:** define and enforce DOM `list` node contract (single-root or fragment-aware), add keyed reconciliation tests (swap/insert/remove/identity).
3. **P1:** introduce build pipeline (`dist`, d.ts, conditional exports) and consumption smoke tests.
4. **P1:** design unified isomorphic rendering contract before compiler codegen expands.
5. **P2:** implement compiler subset (IR/codegen/sourcemaps) targeting current runtime primitives, then integrate MSF benchmark fixtures with methodology-compliant reporting.

## Conclusion
The repository has moved from architecture-only M0 to a working runtime preview foundation. Reaching a launchable developer framework requires correctness hardening, compiler/tooling implementation, isomorphic SSR/hydration, packaging, and evidence-based benchmarking—without superiority claims.
