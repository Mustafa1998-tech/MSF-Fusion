# FAQ

## What problem does MSF Fusion solve?
Three, together: (1) whole-tree VDOM reconciliation overhead vs **fine-grained, compiler-assisted updates** with deterministic ownership/disposal, (2) **informal server↔client boundaries** replaced by explicit server/client/shared semantics with a safe serialization contract, (3) **TypeScript as the public contract** (contracts/diagnostics) rather than only a build-time check. Details, evidence, and limits: [Why MSF Fusion](../why.md).

## Is MSF Fusion ready to use?
**As a developer preview, partially.** You can use the in-repo runtime (`@msf/runtime` core/DOM/SSR/universal/router), function components, control flow, a minimal router, and a JSX **subset** via the compiler. It is **not** production-ready: no full router, no data actions/streaming/resume, no dev server/HMR, and no npm release.

## What works right now?
- Reactive kernel: `createSignal`, `createMemo`, `createEffect`, `createRoot`, `batch`, `untrack`, `onCleanup`, owner helpers — 44 kernel/DOM tests (49 total in @msf/runtime)
- DOM helpers: `@msf/runtime/dom` (`render`, `insert`, keyed multi-root `list`, `setAttribute`, ...)
- Isomorphic view + hydration: `@msf/runtime/universal` (`h`, `fragment`, `text`, `mount`, `hydrate`, function components, `Show`/`For`)
- SSR string rendering: `@msf/runtime/server` (`h`, `renderToString`, `escapeHtml`)
- Compiler subset with two targets: `jsx-dom-v1` and `jsx-universal-v1` — 14 tests pass
- Dev preview: `@msf/dev` compile/check APIs and CLI — 6 tests pass
- Examples: `counter-basic`, `counter-browser`, **`fullstack`** (SSR + hydration), **`dashboard`** (Ops Board)

## How do I use it?
Today: **clone the repository** and work against the workspace.

```bash
git clone https://github.com/Mustafa1998-tech/MSF-Fusion.git
cd MSF-Fusion
pnpm install --frozen-lockfile && pnpm build
pnpm --filter @msf/example-fullstack dev
```

Full guide: [Why MSF Fusion](../why.md) → [Getting started](getting-started.md) → [Real-world quickstart](real-world-quickstart.md).

## Can I install it from npm?
**No.** Distribution is GitHub-only by owner decision (2026-11-17); there is no npm package and none is planned. The four `@msf/*` packages still build locally and pass `pnpm verify:package` (temp consumer install + runtime smoke + TS typecheck) for clone-based consumption.

## What syntax does MSF Fusion use?
Today: direct TypeScript/JavaScript calls to runtime APIs (`h()` view descriptors), `Show`/`For` control-flow components, and JSX **subset** tags through the compiler. A full TSX/compiler pipeline is planned, not fully implemented.

## Is it based on React, Angular, Vue, Solid, or Svelte?
No. MSF Fusion is a standalone design that owns its reactivity, compiler, and runtime. It may compare against competitors in benchmarks, but it must not depend on, wrap, or copy their runtimes/source.

## Does it support TypeScript?
Yes, current APIs and codebase are typed end-to-end (the `@msf/runtime`, `@msf/compiler`, and `@msf/dev` sources are TypeScript-first). Richer compiler diagnostics and the full framework TypeScript authoring experience are planned.

## How fast is it?
**No superiority numbers exist.** MSF measurements are committed (micro `09-03-34-486Z-li9o`, SSR `09-37-02-734Z-arcv`, DOM `09-50-15-877Z-jjuo`, bundle `11-43-37-434Z-wlh8` — 3.09 KiB brotli) but are single-machine, informational, and make no claim over competitors. See [benchmarks](../../benchmarks/methodology.md).

## Does it support SSR and hydration?
Yes, in preview. `@msf/runtime/server` renders escaped SSR strings; `@msf/runtime/universal` provides isomorphic `mount`/`hydrate` (adopts SSR markup, attaches listeners, fresh-mount fallback on mismatch) — exercised end-to-end in `examples/fullstack` and `examples/dashboard`. **Streaming, resume, actions, router, and full hydration-edge-case hardening are not implemented yet.**

## What about router / data fetching / server actions?
**A minimal router preview exists** at @msf/runtime/router (matchRoute, createRouter): path-pattern params, wildcard, query parsing, reactive current(), SSR-safe in-memory fallback. It is not a full router: no loaders, nested route trees, guards, transitions, data actions, or streaming/resume yet. M2+ gates this work.

## Is it secure?
Security is an architectural requirement, but the framework is **not** production-hardened. The SSR renderer escapes by default in its supported model; boundary enforcement depends on future compiler/runtime work. See [security requirements](../security/security-requirements.md) and [threat model](../security/threat-model.md).

## What license does it use?
**MIT.** See [LICENSE](../../LICENSE). There is no npm package; the repository is the distribution channel.

## Where can I see current status and evidence?
- [Production readiness](../production-readiness.md) — honest checklist
- [Engineering status](../engineering/status.md)
- [Why MSF Fusion](../why.md) — problem statement & solution scan
- [Architecture/code review](../reviews/architecture-code-review.md)
- [Roadmap](../engineering/roadmap.md) and [Implementation plan](../engineering/implementation-plan.md)
- [Benchmark reports](../../benchmarks/reports) (informational; one machine)

## العربية — ملخص

هل هو جاهز للاستخدام؟ **جزئيًا كمعاينة مطورين**: نواة تفاعلية وDOM وSSR/hydration ومكونات وcompiler subset وtests. ليس جاهزًا للإنتاج: لا يوجد full router (يوجد preview مصغّر في @msf/runtime/router)، لا data streaming/resume، لا HMR، ولا npm. التوزيع GitHub-only بقرار مالك المستودع (اعتماد الاستنساخ المحلي + `workspace:*`). الترخيص MIT. لا توجد أرقام تفوق — الادعاءات على الأداء ممنوعة، والأرقام الحالية معلوماتية على جهاز واحد.
