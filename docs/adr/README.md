# Architecture Decision Records

| ADR | Title | Status |
|---|---|---|
| [ADR-001](ADR-001-reactivity-model.md) | Compiler-assisted fine-grained reactivity | Accepted direction — implementation in progress (M1 preview: runtime kernel/DOM/SSR) |
| [ADR-002](ADR-002-runtime-and-scheduling.md) | Runtime ownership, scheduling, and lifecycle | Accepted direction — partially implemented in runtime kernel (M1) |
| [ADR-003](ADR-003-fullstack-ssr-boundaries.md) | Full-stack rendering and data boundaries | Accepted direction — SSR snapshot preview implemented; hydration/boundaries pending |
| [ADR-004](ADR-004-compiler-toolchain.md) | Compiler toolchain: Oxc + TypeScript semantic adapter | Accepted direction — spike evidence complete; compiler implementation pending |
| [ADR-005](ADR-005-security-performance-gates.md) | Security and performance as architectural gates | Accepted direction — applied as ongoing gates |

M0 decisions were approved for implementation. This table reflects current progress; individual ADRs retain rationale and may be amended by future ADRs as evidence evolves.

## ملخص بالعربية
سجلات القرارات المعمارية معتمدة للتنفيذ، والعمل جارٍ في M1 (معاينة للنواة وDOM/SSR) مع استمرار بقية البنود (المترجم، الترطيب، الحدود) وفق الأدلة.