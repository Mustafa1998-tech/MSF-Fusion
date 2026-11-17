# Security requirements — Milestone 0

## Principles
- **Safe by default:** escaping, serialization, and request handling must fail closed or sanitize unless an explicit, audited unsafe opt-in exists.
- **Explicit trust boundaries:** server-only secrets never cross to client bundles or hydration payloads.
- **Defense in depth:** compiler diagnostics, runtime checks (dev), and server validation complement each other.
- **Evidence:** security-sensitive behavior requires tests; no unverified claims.

## Requirements (target, to be enforced in implementation milestones)

### Rendering and templating
- Automatic contextual escaping for HTML/text/attribute/URL/script contexts as applicable.
- No string-concatenated HTML as default rendering path.
- Explicit raw-HTML API (if any) must be named, documented, and lintable/review-gated.

### Server/client boundary
- Compiler-enforced separation of server-only imports/values.
- Serialization allowlist/type validation for hydration and server actions.
- Environment variables/secrets inaccessible to client code except explicit public prefixes.

### Network and actions
- CSRF protection strategy for state-changing actions.
- Origin/method checks and configurable auth hooks.
- SSRF-resistant server fetch helpers (allowlists/deny private ranges by default where feasible).
- Rate limiting hooks and input size limits at framework boundaries.

### Supply chain and build
- Pinned dependencies, lockfile integrity, provenance-aware publishing (future).
- No execution of untrusted remote code during build/dev by default.
- Clear policy for code generation artifacts and source maps in production.

### Browser security posture
- CSP compatibility (avoid requiring `unsafe-inline`/`unsafe-eval` for core runtime).
- Safe handling of navigation/redirects and user-controlled URLs.

## Current status
- Requirements documented and treated as design gates.
- **M1 preview:** `@mustafa-26112026/runtime/server` escapes text/attribute values by default for its supported string-rendering model; this is not a complete security boundary.
- No executable security benchmark suite yet (see `benchmarks/security/README.md`).
- Compiler-enforced boundaries, serialization allowlists, auth/CSRF/SSRF controls, and broader runtime hardening are pending implementation.

## ملخص بالعربية
تحدد هذه الوثيقة متطلبات الأمان الافتراضية (هروب تلقائي، حدود خادم/عميل، تسلسل آمن، حماية CSRF/SSRF، وسلسلة توريد) كقيود تصميمية قبل التنفيذ.
