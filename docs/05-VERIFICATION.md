# Verification Design

## 1. Goal

Verification must provide fast, trustworthy feedback without turning `init.sh` into a new build system or dependency engine.

Stable agent-facing modes:

```bash
./init.sh quick
./init.sh affected
./init.sh full
```

The current public interface has no `doctor` mode. Garden defines hygiene checks; verify composes deterministic checks into the lifecycle when relevant.

## 2. Mode semantics

### `quick`

Cheap health checks for startup or early iteration:

- syntax/config validation;
- fast type or static checks;
- the smallest useful smoke test.

`./init.sh` with no argument MAY default to `quick` for compatibility and to avoid surprising cost. After a code change, agents SHOULD call explicit `affected` or a targeted native command.

### `affected`

Default post-change verification:

```text
changed files
  -> component/package mapping
  -> reverse dependencies/shared configuration impact
  -> native affected tooling or conservative fallback
  -> relevant lint/type/test/build jobs
```

Uncertain mapping must widen, never silently skip.

### `full`

The canonical repository gate according to existing conventions. Use before merge/milestone or for high-risk changes; do not run it mechanically after every edit.

When the repository has a deterministic garden check, `full` SHOULD run cheap structural invariants unless native CI/gates already cover them.

## 3. Structural hygiene composition

Garden owns the definitions and implementation of harness/docs/state hygiene checks. Verify executes or composes them for these triggers:

| Trigger | Expected behavior |
|---|---|
| Feature completion | Run feature/index/link structural checks |
| Harness, docs, or feature state changed | `affected` includes the relevant structural check |
| `full` verification | Run the cheap structural check when configured and applicable |
| Code-only local change | Do not add unrelated semantic gardening ceremony |

Structural check failure MAY gate completion because the result is deterministic and actionable. Semantic garden findings normally MUST NOT become an automatic delivery gate.

## 4. Change-set contract

Implementation must define how changed files are determined:

- explicit file list/target when supplied by the caller;
- local default includes staged, unstaged, and untracked files;
- CI uses a configured base or merge-base;
- renames/deletes map both old and new areas when relevant;
- lockfiles, root config, shared schemas, or build tooling SHOULD widen to dependent components;
- without git context, use explicit scope or a broader safe check.

Do not use one ambiguous `git diff` behavior for every environment.

## 5. `init.sh` is an adapter

`init.sh` SHOULD only:

1. resolve the repository root;
2. parse and validate the mode;
3. show concise help for invalid input;
4. dispatch to native tools or helpers;
5. preserve exit codes and signals.

Preferred shapes:

```text
init.sh -> make/nx/turbo/gradle/npm/pytest/etc.
```

Or, when orchestration is complex:

```text
init.sh
  -> scripts/verify/quick.sh
  -> scripts/verify/affected.sh
  -> scripts/verify/full.sh
  -> shared runner/library when genuinely needed
```

Helpers do not have to be shell. Use a runtime that is already reliable in the repository.

## 6. When to split helpers

Move logic out of `init.sh` when one or more applies:

- multiple components or toolchains;
- non-trivial affected mapping;
- service setup/cleanup;
- bounded parallel jobs;
- log capture/summary;
- shared logic between modes;
- the adapter becomes hard to scan or test.

Do not split files merely to put one command in each file.

## 7. Reuse native tooling

If the repository already has a good `make check`, Nx/Turbo affected command, Gradle task, Taskfile, or CI-local runner, the wrapper must delegate instead of copying logic.

`init.sh` may be unnecessary when an existing command is stable, discoverable, and agent-friendly. If backward compatibility needs an adapter, keep it thin.

Affected mapping has a complexity budget. Simple mappings such as a shared package to known dependents are acceptable. If the implementation starts reconstructing a substantial build/dependency graph, delegate to Nx/Turbo/Gradle/Make/workspace tooling or fall back conservatively. Harness MUST NOT build a second dependency engine.

## 8. Job graph and concurrency

Parallelize only independent jobs with bounded concurrency.

```text
lint -----\
type ------> parallel summary
unit -----/

services up -> migrate -> integration
```

Do not run jobs concurrently when they share a mutable database, fixture, emulator, or port without isolation.

## 9. Output contract

Default output should be a summary:

```text
PASS backend:type   2.1s
PASS backend:unit   4.8s
FAIL frontend:type  3.0s

2 passed, 1 failed
Failure: frontend:type
<short relevant excerpt>
Full log: <path if retained>
```

Requirements:

- successful verbose logs do not flood agent context;
- failure excerpts are actionable;
- full logs are recoverable when captured;
- command failures preserve a nonzero exit code;
- signal/cleanup does not leave processes or services behind.

## 10. Required, optional, N/A

Every check must be classified as:

- required;
- optional;
- not applicable.

Missing required tools/checks are failures or actionable configuration errors. Missing optional checks may be warnings/N/A. Do not call a linter a type checker or treat “no tests configured” as evidence that tests passed.

## 11. Baseline failures

When the repository already fails before the change:

- record the relevant baseline;
- compare new failures when feasible;
- do not silently fix unrelated failures;
- determine whether the failure blocks the requested work;
- report accepted exceptions clearly.

Do not run a full baseline for every local task.

## 12. Risk-proportional verification

| Change | Default evidence |
|---|---|
| Local pure logic | Targeted test plus relevant static check |
| Normal component change | Affected checks |
| Cross-component/public API/schema/auth/persistence | Affected plus relevant integration/full gate |
| Build/config/tooling | Relevant full build |

Repository conventions and actual risk may widen or narrow this table.

## 13. Safety

Verification MUST NOT:

- install dependencies automatically without authorization;
- mutate production resources;
- reset data outside disposable test scope;
- hide failures;
- run unsafe shared-state jobs concurrently.
