# API stability policy & export matrix — MSF Fusion

> **Use this document before relying on any MSF Fusion API in application code.**  
> The package is **not published to npm yet**; installability is verified in-repo (see `scripts/verify-package.mjs`).

## Stability levels used in this matrix
| Level | Meaning | Breaking changes |
|---|---|---|
| **Stable (preview-track)** | Runtime/DOM behavior is tested and exercised by the `examples/*` pilots; signature changes are rare and documented | Only with a minor/major release note + migration guidance |
| **Preview** | Implemented and tested, but the exact shape may change without notice | Can change in any release with a changelog note |
| **Planned** | Not implemented | Not available |

All MSF Fusion packages are still `private: true` (not published). The policy below applies to in-repo consumers and will become the contract for the first pre-release tag.

## `@mustafa-26112026/runtime` — exports
| Export | Level | Notes |
|---|---|---|
| `createSignal` | Stable (preview-track) | `[get, set] = createSignal(initial, options?)`; setter accepts value or updater function |
| `createMemo` | Stable (preview-track) | Lazy, cached, dependency-tracked |
| `createEffect` | Stable (preview-track) | Runs immediately; returns `Dispose`; re-run clears prior cleanups |
| `createRoot` | Stable (preview-track) | `createRoot((dispose) => ...)` for graph lifecycle |
| `batch` | Stable (preview-track) | Groups writes into one flush |
| `untrack` | Stable (preview-track) | Reads without dependency registration |
| `onCleanup` | Stable (preview-track) | Registers cleanup on owner |
| `getOwner`, `runWithOwner` | Stable (preview-track) | Advanced owner/graph introspection |
| `flushSync` | Stable (preview-track) | Flushes pending effects synchronously outside a batch |
| `Accessor`, `Setter`, `Dispose`, `SignalOptions`, `MemoOptions` (types) | Stable (preview-track) | Public generics |
| `./dom` — `render`, `mount`, `insert`, `setText`, `setAttribute`, `setProperty`, `addEventListener`, `show`, `list`, `For`, `append`, `template` | Stable (preview-track) | `list` keyed reconciliation supports multi-root items |
| `./server` — `h`, `fragment`, `text`, `renderNode`, `renderToString`, `escapeHtml` | Stable (preview-track) | `h` resolves components on both server and browser |
| `./universal` — `mount`, `hydrate` | Stable (preview-track) | Same view tree mountable/hydratable; no JSX yet |
| `./universal` — `h`, `fragment`, `text`, `ViewNode`, `ComponentProps` | Stable (preview-track) | Isomorphic descriptor for SSR + client |

## `@mustafa-26112026/compiler` — exports
| Export | Level | Notes |
|---|---|---|
| `compile` | Preview | Two targets: `dom` (default), `universal`; subset only |
| `CompileRequest.target`, `CompileResult`, `Diagnostic`, `MSF_CONTRACTS_VERSION` (from `@mustafa-26112026/contracts`) | Preview | Diagnostics contract can grow codes/severity levels |

## `@mustafa-26112026/dev` — exports
| Export | Level | Notes |
|---|---|---|
| `getDevStatus`, `compileFile`, `compilePath`, `checkFile`, `checkPath` | Preview | Reports ready flag + `compile-file`/`compile-path`/`check-file`/`check-path`/`diagnostics` |
| `msf-dev status`, `msf-dev check`, `msf-dev compile` (CLI) | Preview | `dist/cli.js` after `pnpm build` |

## `@mustafa-26112026/contracts` — exports
| Export | Level | Notes |
|---|---|---|
| `Diagnostic`, `CompileRequest`, `CompileResult`, `Disposable` | Preview | Will grow spans/sourcemaps/severity |
| `MSF_CONTRACTS_VERSION` | Preview | Schema-version string for diagnostics consumers |

## Breaking-change rules
1. **No silent removals** — every removed or changed export listed above will be documented in the release changelog.
2. **Deprecation first** — stable exports are deprecated for at least one milestone before removal.
3. **`MSF_CONTRACTS_VERSION`** bumped whenever diagnostic shape/semantics change, so consumer tools can pin or degrade gracefully.
4. **Pre-publish sign-off** — publishing anything (even a pre-release) needs **explicit user approval**; currently nothing is published.
5. **License** — repository and packages are licensed under the **MIT License** (`LICENSE`); package metadata declares `MIT`. Redistribution under MIT is fine; publishing requires explicit approval.

## What is intentionally NOT in the public API
- Deep runtime internals (`ReactiveNode`, `Owner`, `Listener` internals, array-slot disposal details)
- Private APIs may be referenced by `@mustafa-26112026/*` packages internally and are not covered by this policy
- Compiler IR and diagnostics `code` set is preview-only and may grow
