# ADR-003: Full-stack rendering and data boundaries

- **Status:** Proposed
- **Date:** 2026-11-16

## Context
MSF Fusion is full-stack. It must define where code runs (server/client), how data crosses boundaries, how HTML is produced/hydrated or resumed, and how to prevent accidental secret leakage.

## Decision
- **Rendering modes (planned):** static generation, SSR, streaming SSR, and a progressive hydration/resume strategy evaluated after kernel stability. Milestone 1 targets minimal SSR + deterministic client mount before streaming/resume claims.
- **Explicit boundaries:** server-only modules, client-only modules, and shared pure modules enforced by compiler diagnostics and bundler rules.
- **Serialization contract:** only explicitly serializable data crosses server→client; functions, class instances, and secrets rejected by default.
- **Actions/endpoints:** typed request/response handlers with validation at boundary; CSRF/origin/auth hooks designed in.
- **No implicit data fetching magic:** data dependencies are explicit so they can be analyzed, cached, and audited.

## Sequence — SSR request (target)
```mermaid
sequenceDiagram
  participant B as Browser
  participant S as MSF Server
  participant R as Renderer
  participant D as Data Boundary
  B->>S: GET /page
  S->>D: load server data (validated)
  D-->>S: serializable state
  S->>R: render(component, state)
  R-->>S: HTML + hydration payload
  S-->>B: 200 text/html
  B->>B: hydrate/resume (planned)
```

## Trade-offs
- Explicit boundaries reduce magic but require developer learning.
- Streaming/resume deferred until correctness/security baselines exist.

## ملخص بالعربية
يحدد القرار حدود تنفيذ واضحة (خادم/عميل/مشترك)، تعاقد تسلسل آمن، ومسار SSR تدريجي مع تأجيل البث والاستئناف إلى ما بعد استقرار النواة.
