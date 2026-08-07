# Evals and Migration

## 1. What to measure

Harness quality must be measured by task outcomes, not artifact count.

Primary metrics:

- task correctness;
- time to the first correct code location;
- end-to-end completion time;
- tokens/files read before implementation;
- verification latency and false-pass/false-skip rate;
- scope violations;
- premature completion;
- resume success;
- stale-doc/state incidents;
- harness maintenance cost.

## 2. Representative repositories

Minimum fixture set:

- single backend service;
- full-stack application;
- polyglot or workspace monorepo;
- inconsistent legacy repository;
- existing repository with good docs/native verification;
- near-empty greenfield repository.

Prefer realistic medium-size fixtures over tiny synthetic trees alone.

## 3. Skill trigger evals

Prompts that SHOULD trigger:

- “setup this repo for coding agents”;
- “agents keep reading the wrong modules”;
- “turn these greenfield requirements into a repository backlog”;
- “create a fast affected verification command”;
- “clean stale harness docs and feature state”;
- “migrate harness-slim”.

Prompts that SHOULD NOT trigger:

- an ordinary focused bug fix with no harness issue;
- generic UI implementation;
- product planning unrelated to repository execution;
- model/prompt selection.

Also verify that:

- the router selects only needed phases;
- a specialist prompt triggers the matching skill without router ceremony;
- the fallback profile loads one phase reference at a time;
- map/specs/features/verify reasoning does not bleed across unfinished phases.

## 4. Workflow evals

### Map

- agents locate real entry points/modules faster;
- boundaries are grounded;
- docs remain concise;
- good existing docs are reused;
- inconsistent code is not promoted to a rule blindly.

### Specs

- behavior and edge cases are preserved;
- provenance/uncertainty is visible;
- the spec can drive tests;
- code/spec conflicts are reported.

### Features

- decomposition is coherent;
- greenfield planned backlog is created even when individual features are one-session sized;
- acceptance is verifiable;
- IDs are stable on rerun;
- existing functionality is not turned into a fake backlog;
- stale done detail is compacted before feature identity is pruned.

### Verify

- local/staged/untracked/CI changes map correctly;
- shared changes include reverse dependencies;
- uncertainty widens;
- native tooling is reused;
- affected mapping falls back before becoming a second dependency engine;
- parallel jobs are safe;
- output is compact and failures propagate;
- harness/docs/state changes compose structural garden checks.

### Garden

Inject broken links, invalid state, stale docs, deliberate exceptions, and deprecated patterns. Measure structural recall separately from semantic precision. Semantic precision has higher priority than finding count.

## 5. Rerun and dirty-worktree evals

Every artifact-producing workflow needs tests for:

- a second run with no source change -> no semantic diff;
- human-edited correct content -> preserved;
- stale section -> focused update;
- conflicting intent -> report, no overwrite;
- unrelated dirty files -> untouched;
- an intentionally deleted optional artifact -> not recreated without evidence.

## 6. End-to-end and ablation

For the same repository/task/model budget, compare:

```text
baseline without harness
vs
full minimal harness
vs
remove one capability at a time
```

Ablation identifies which artifacts/rules are load-bearing. Remove ceremony that does not improve outcomes or has become dead weight as models/tools improve.

## 7. Migration from `harness-slim`

Preserve useful existing work; do not overwrite wholesale.

| Current artifact | Migration |
|---|---|
| `AGENTS.md` | Compact into a router; preserve project-specific rules |
| docs map/architecture | Reuse and remove duplicates |
| `feature_index.json` | Migrate the schema; preserve stable IDs |
| `features/*` | Keep planned/current scope; compact done history |
| `progress.md` | Move useful active state into feature Handoff; remove if redundant |
| `init.sh` | Turn into a thin `quick/affected/full` adapter |
| `scripts/check-state.sh` | Move valuable checks under garden structural tooling |
| validator/report tooling | Keep only if it provides recurring maintenance value |

Remove old assumptions:

- global one-active feature;
- mandatory progress diary;
- Bash + `jq` requirement;
- one giant multi-stack `init.sh`;
- the old `doctor` verification mode;
- a fixed artifact checklist.

## 8. Migration sequence

1. Audit current artifacts and human changes.
2. Establish canonical instruction/doc routes.
3. Simplify the verification adapter without breaking useful commands.
4. Migrate active feature state and preserve IDs.
5. Remove obsolete progress/checker artifacts only after references are updated.
6. Run structural garden and relevant verification.
7. Keep the `harness-slim` name as a temporary compatibility alias only if distribution requires it.

## 9. Release gate for the new skills

Before implementing/releasing the hybrid distribution:

- router and specialist trigger contracts pass evals;
- router references mirror `map/specs/features/verify/garden`;
- the modular profile works when composition is supported;
- the fallback profile enforces phase isolation without assuming skill invocation;
- the maintenance interface matches [10-DESIGN_DECISIONS.md](10-DESIGN_DECISIONS.md);
- init adapter fixtures cover simple and complex repositories;
- feature completion and relevant affected/full flows run structural hygiene checks;
- rerun/dirty-worktree safety passes;
- common Class A/B task flows remain shorter than with the old harness;
- the end-to-end benchmark shows no speed regression from added process.
