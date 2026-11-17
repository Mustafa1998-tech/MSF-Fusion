# `@mustafa-26112026/contracts`

Shared, dependency-light contracts for MSF Fusion packages: diagnostics, compile requests/results, and version marker.

> **Status: v0.1.0 — developer preview.**

## Install

```bash
npm install @mustafa-26112026/contracts@0.1.0
```

## Exports

- `Disposable`
- `Diagnostic`
- `CompileRequest`, `CompileResult` (`CompileRequest.target` accepts `jsx-dom-v1` | `jsx-universal-v1`)
- `MSF_CONTRACTS_VERSION`

## Purpose

`@mustafa-26112026/contracts` exists so `@mustafa-26112026/runtime`, `@mustafa-26112026/compiler`, and `@mustafa-26112026/dev` share boundaries without importing each other's internals. It has no runtime dependencies of its own.

Repository and issue tracker: <https://github.com/Mustafa1998-tech/MSF-Fusion>

## License

MIT
