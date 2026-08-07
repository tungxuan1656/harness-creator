# AGENTS.md

## Project
<2–4 câu: sản phẩm là gì, main topology>

## Start here
- Architecture: `ARCHITECTURE.md`
- Documentation map: `docs/README.md`
- Feature state: `feature_index.json` (if present)
- Verification: `./init.sh affected` (adapt to repo)

## Repository map
| Area | Read when |
|---|---|
| `docs/BACKEND.md` | Backend/API/data changes |
| `docs/FRONTEND.md` | UI/client state changes |
| `docs/specs/` | Product/domain behavior |

## Working invariants
- Follow existing architectural boundaries.
- Make the smallest coherent in-scope change.
- Do not invent project rules when evidence is missing.
- Verify proportionally; use affected checks by default when available.
- Update durable docs only when behavior/boundary/pattern actually changed.

## Feature work
- Read the relevant feature detail and linked specs.
- One agent/session focuses on one primary feature.
- Mark done only after acceptance + relevant verification.

## Verification
- Quick: `<command>`
- Affected: `<command>`
- Full: `<command>`
- Doctor: `<command>`
