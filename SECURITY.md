# Security Policy

MSF Fusion treats security as an architectural requirement. Although the framework runtime is not yet implemented (Milestone 0), the repository contains security requirements, a threat model, and benchmark/tooling code that should be handled responsibly.

## Supported status

| Component | Status | Security fixes |
|---|---|---|
| Framework runtime/compiler packages | Not implemented | N/A until released |
| Benchmark lab & spikes | Milestone 0 tooling | Best-effort; issues reviewed case-by-case |
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
- Whether the issue affects design/docs, tooling, dependencies, or future runtime assumptions

## Disclosure and response

- We will acknowledge receipt when possible and assess severity/impact.
- Fixes and advisories (if applicable) will be coordinated responsibly.
- We appreciate reports that follow good-faith research practices and avoid privacy violations, data destruction, or service disruption.

## Security design references

- [Security requirements](docs/security/security-requirements.md)
- [Threat model](docs/security/threat-model.md)
- [Quality gates](docs/engineering/gates.md)
