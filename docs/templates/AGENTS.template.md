# AGENTS.md

## Project

<What the product does and its main topology, in 2-4 sentences.>

## Start here

- Architecture: `<existing architecture doc>`
- Documentation map: `<docs index, if useful>`
- Feature state: `<feature_index.json, only if enabled>`
- Verification: `<affected verification command>`

## Task routing

| Change | Read first |
|---|---|
| `<task/component>` | `<focused doc or code area>` |

## Repository map

| Area | Responsibility |
|---|---|
| `<path/module>` | `<role>` |

## Working invariants

- Follow the repository's established boundaries and scoped instructions.
- Make the smallest coherent change that satisfies the request.
- Distinguish observed code patterns from intended rules.
- Do not invent project behavior when evidence is missing.
- Verify proportionally; use targeted or affected checks by default.
- Update durable docs only when behavior, boundaries, patterns, or commands change.

## Feature work

<!-- Remove this section when persistent feature state is not enabled. -->

- Read the relevant feature detail and linked specs.
- Focus on one primary task per session; other features may remain in progress.
- Mark done only when every acceptance and required verification item is satisfied or covered by a recorded accepted exception.
- Leave a concise Handoff only when stopping before completion.

## Verification

- Quick: `<command>`
- Affected: `<command>`
- Full: `<command>`
