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

## Milestone 0 status
Requirements documented only; no executable security benchmark suite yet (see `benchmarks/security/README.md`).

## ملخص بالعربية
تحدد هذه الوثيقة متطلبات الأمان الافتراضية (هروب تلقائي، حدود خادم/عميل، تسلسل آمن، حماية CSRF/SSRF، وسلسلة توريد) كقيود تصميمية قبل التنفيذ.
