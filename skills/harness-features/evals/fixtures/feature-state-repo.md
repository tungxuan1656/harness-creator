# Feature-state repository fixture

The canonical `feature_index.json` uses schema version 1 and contains:

| ID | Status | Depends on | Detail |
|---|---|---|---|
| `feat-csv-export` | `in_progress` | none | `features/feat-csv-export.md` |
| `feat-live-preview` | `in_progress` | none | `features/feat-live-preview.md` |
| `feat-share-export` | `todo` | `feat-csv-export` | `features/feat-share-export.md` |
| `feat-keyboard-shortcuts` | `todo` | none | `features/feat-keyboard-shortcuts.md` |
| `feat-preview-history` | `todo` | `feat-live-preview` | `features/feat-preview-history.md` |

Each detail has Goal, Scope, observable Acceptance, Relevant docs, and real
Verification commands. Additional state:

- All `feat-csv-export` acceptance and required checks pass except Safari 17.4.
- Its detail records an explicit exception accepted by product decision
  `ADR-021`, with follow-up `WEB-204`, and has a now-stale Handoff section.
- `feat-live-preview` is genuinely underway and its Handoff remains current.
- `scripts/garden/check-features.js` deterministically validates IDs, graph,
  paths, status, Handoff, and exception structure.
- `src/telemetry.js` has an unrelated unstaged human edit.

The evaluator should materialize a temporary git repository, commit the
baseline, dirty only `src/telemetry.js`, and preserve its hash during the task.
