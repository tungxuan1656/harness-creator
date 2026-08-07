# Evals and Migration

## 1. What to measure

Harness quality phải được đo bằng task outcome, không phải artifact count.

Primary metrics:

- task correctness;
- time to first correct code location;
- end-to-end completion time;
- tokens/files read before implementation;
- verification latency và false-pass/false-skip;
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
- inconsistent legacy repo;
- existing repo with good docs/native verification;
- near-empty greenfield.

Prefer medium-size realistic fixtures over tiny synthetic trees only.

## 3. Skill trigger evals

Test prompts that SHOULD trigger:

- “setup this repo for coding agents”;
- “agents keep reading the wrong modules”;
- “create a fast affected verification command”;
- “clean stale harness docs and feature state”;
- “migrate harness-slim”.

Test prompts that SHOULD NOT trigger:

- ordinary focused bug fix with no harness issue;
- generic UI implementation;
- product planning unrelated to repository execution;
- model/prompt selection.

Also verify classification selects only needed internal workflows.

## 4. Workflow evals

### Map

- agent locates real entry point/module faster;
- boundaries are grounded;
- docs remain concise;
- good existing docs are reused;
- inconsistent code is not promoted to rule blindly.

### Specs

- behavior and edge cases preserved;
- provenance/uncertainty visible;
- spec can drive tests;
- code/spec conflict is reported.

### Features

- decomposition coherent;
- acceptance verifiable;
- IDs stable on rerun;
- no fake backlog for existing functionality;
- completed state can be pruned safely.

### Verify

- local/staged/untracked/CI changes map correctly;
- shared changes include reverse dependencies;
- uncertainty widens;
- native tooling reused;
- parallel jobs safe;
- output compact and failures propagate.

### Garden

Inject broken links, invalid state, stale docs, deliberate exceptions và deprecated patterns. Measure structural recall separately from semantic precision. Semantic precision has higher priority than finding count.

## 5. Rerun and dirty-worktree evals

Every artifact-producing workflow needs tests for:

- second run with no source change -> no semantic diff;
- human-edited correct content -> preserved;
- stale section -> focused update;
- conflicting intent -> report, no overwrite;
- unrelated dirty files -> untouched;
- optional artifact deleted intentionally -> not recreated without evidence.

## 6. End-to-end and ablation

For same repo/task/model budget compare:

```text
baseline without harness
vs
full minimal harness
vs
remove one capability at a time
```

Ablation xác định artifact/rule nào thật sự load-bearing. Remove ceremony không cải thiện outcome hoặc đã trở thành dead weight khi models/tools tiến bộ.

## 7. Migration from `harness-slim`

Preserve useful existing work, không overwrite wholesale.

| Current artifact | Migration |
|---|---|
| `AGENTS.md` | Compact thành router; preserve project-specific rules |
| docs map/architecture | Reuse và remove duplicates |
| `feature_index.json` | Migrate schema, preserve stable IDs |
| `features/*` | Keep planned/current scope; compact done/history |
| `progress.md` | Move useful active state into feature Handoff; remove if redundant |
| `init.sh` | Turn into thin `quick/affected/full` adapter |
| `scripts/check-state.sh` | Move valuable checks under garden structural tooling |
| validator/report tooling | Keep only if recurring maintenance value exists |

Remove old assumptions:

- global one-active feature;
- mandatory progress diary;
- Bash + `jq` requirement;
- one giant multi-stack `init.sh`;
- `doctor` verification mode;
- fixed artifact checklist.

## 8. Migration sequence

1. Audit current artifacts and human changes.
2. Establish canonical instruction/doc routes.
3. Simplify verification adapter without breaking useful commands.
4. Migrate active feature state and preserve IDs.
5. Remove obsolete progress/checker artifacts only after references are updated.
6. Run structural garden and relevant verification.
7. Keep `harness-slim` name as a temporary compatibility alias only if distribution requires it.

## 9. Release gate for the new skill

Before implementing/releasing `harness`:

- single-skill trigger/classification contract passes evals;
- references use progressive disclosure;
- no bootstrap sub-skill invocation assumption;
- no doctor mode remains;
- init adapter fixtures cover simple and complex repos;
- rerun/dirty-worktree safety passes;
- target task flows remain shorter than the old harness for Class A/B work;
- end-to-end benchmark shows no speed regression from added process.
