# Security Policy

MSF Fusion treats security as an architectural requirement. The repository contains security/design documentation, benchmark and spike tooling, and a **developer-preview runtime** (`@mustafa-26112026/runtime`) with initial DOM/SSR helpers. The framework is not production-hardened or released.

## Supported status

| Component | Status | Security fixes |
|---|---|---|
| `@mustafa-26112026/runtime` (kernel/DOM/SSR preview) | Developer preview (M1 in progress) | Best-effort; issues reviewed case-by-case |
| `@mustafa-26112026/compiler`, `@mustafa-26112026/dev`, `@mustafa-26112026/contracts` | Scaffold / early contracts | Best-effort; issues reviewed case-by-case |
| Benchmark lab & spikes | Tooling | Best-effort; issues reviewed case-by-case |
| Documentation/design | Active | Corrections welcome via private report or PR as appropriate |

## Reporting a vulnerability

**Please do not open a public issue for suspected vulnerabilities.**

1. Use GitHub's private vulnerability reporting for this repository if available: [Report a vulnerability](https://github.com/Mustafa1998-tech/MSF-Fusion/security/advisories/new).
2. If private reporting is unavailable, contact the maintainers directly with a clear subject line (e.g. `[SECURITY] ...`) and include: affected component/commit, reproduction steps or proof of concept, impact assessment, and any suggested mitigation.
3. Allow reasonable time for investigation and remediation before public disclosure.

## What to include

- Version/commit SHA and environment details
- Minimal, reproducible steps (or a safe PoC)
- Expected vs. actual behavior and security impact
- Whether the issue affects design/docs, tooling, dependencies, runtime behavior, SSR escaping/serialization assumptions, or future boundaries

## Disclosure and response

- We will acknowledge receipt when possible and assess severity/impact.
- Fixes and advisories (if applicable) will be coordinated responsibly.
- We appreciate reports that follow good-faith research practices and avoid privacy violations, data destruction, or service disruption.

## Security design references

- [Security requirements](docs/security/security-requirements.md)
- [Threat model](docs/security/threat-model.md)
- [Quality gates](docs/engineering/gates.md)
