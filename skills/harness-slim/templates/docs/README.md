# Project Documentation

This directory is the source of truth for durable project knowledge that cannot be inferred reliably from code alone. Keep the set of documents minimal, current, and grounded in repository evidence.

## Documentation map

List only documents that exist. Add a row when a document is created and remove it when the document is retired.

| Document | Read when | Owner or source |
|---|---|---|
| `README.md` | Deciding whether project knowledge needs a dedicated document | Repository maintainers |

## Suggested structure

This is a menu, not a required scaffold. Create only the documents supported by project evidence and list every created document in the map above.

```text
docs/
├── README.md                 # documentation map
├── architecture.md           # boundaries, dependency direction, invariants
├── design-decisions/         # durable decisions and consequences
├── product-specs/            # stable product behavior and domain rules
├── references/               # external APIs, protocols, domain sources
├── generated/                # documentation derived from code or schemas
├── security.md               # trust boundaries, sensitive data, controls
└── reliability.md            # failure modes, recovery, SLOs, operations
```

Choose the smallest structure that preserves the project's source of truth:

- **Small or straightforward project:** keep only this map; add one focused document when the same non-obvious knowledge is repeatedly needed.
- **Growing project:** consider architecture, design decisions, or product/domain specifications when boundaries and decisions are no longer obvious from code.
- **Large, regulated, or operationally critical project:** add security, reliability, generated references, and deeper specifications only for risks and ownership that actually exist.

Follow existing repository naming and location conventions. This map may link to an existing root-level document instead of duplicating it under `docs/`.

## Rules

- Inspect code, configuration, tests, and existing documentation before creating a new document.
- Create a document only when its knowledge is durable, repeatedly needed, and not obvious from code.
- Record evidence, ownership, and the events that require re-verification.
- Prefer updating an existing source of truth over creating overlapping documentation.
- Keep `AGENTS.md` as the map: link to this index and load only documents relevant to the current task.
