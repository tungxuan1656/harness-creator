---
name: harness-features
description: >-
  Create, migrate, or maintain lightweight repository-local feature state for
  planned backlogs and work that needs durable scope, dependencies, verifiable
  acceptance, status, or handoff across sessions. Use when decomposing accepted
  greenfield requirements into executable features, enabling persistent state
  for multi-session or cross-subsystem work, updating an existing tracked
  feature, or migrating legacy harness feature artifacts. Do not use for a
  clear ad-hoc one-session task, generic product roadmapping or project
  management, duplicating an external tracker that already provides sufficient
  execution context, reverse-engineering existing functionality into a backlog,
  or implementing the feature itself.
---

# Harness Features

## Purpose

Create the smallest repository-local execution memory that makes planned work
coherent and resumable:

```text
accepted requirements or planned work
  -> feature outcomes
  -> real execution dependencies
  -> verifiable acceptance
  -> compact status and handoff
```

Keep this invocation isolated to feature state. Read accepted specs and mapping
artifacts as inputs, but do not recreate them or drift into implementation,
verification-tool design, or broad repository cleanup.

## Require Feature State to Earn Its Cost

Enable or retain repository-local feature state when at least one condition is
true:

- the project has an explicit repository-native planned backlog, especially
  after greenfield requirements or specs have been accepted;
- work spans multiple sessions or has a meaningful resume cost;
- execution dependencies must remain visible;
- several people or agents need durable shared scope;
- acceptance is too large or complex for conversation history to remain safe.

A planned feature may be tracked even when its implementation should fit in one
session. The backlog is project memory in that case.

Do not enable a backlog for:

- a focused bug, refactor, configuration change, or ordinary one-session task
  whose scope is already clear;
- unplanned existing functionality discovered in code;
- work fully covered by an external tracker available in the agent's working
  context;
- a desire to populate templates or make the repository look complete.

If feature state is not justified, make no changes and report the evidence-backed
no-op. Do not create placeholder features.

## Own the Execution Artifacts

Own generation and rerun behavior for:

- the repository's feature index, defaulting to `feature_index.json`;
- tracked feature details, defaulting to `features/<id>.md`;
- the compact schema and lifecycle semantics connecting index and detail;
- scoped status, blocker, accepted-exception, and handoff updates.

Prefer a useful existing repository-native equivalent over these default names.
Do not create a second feature system. Create a committed machine-readable
schema only when repository tooling or conventions will consume it; otherwise
enforce the compact shape without adding a dead schema artifact.

Do not add a global progress log by default. Feature handoff, git history, and
the external tracker should carry normal resume state.

## Inspect Planned-Work Evidence

Inspect before asking questions or writing:

1. Read git status and preserve unrelated changes.
2. Locate the canonical instruction entry point and its existing feature route.
3. Locate existing feature indexes, detail files, schemas, progress logs, plans,
   issue references, and tracker conventions.
4. Read only the accepted requirements, repository-local specs, architecture or
   subsystem routes, and planned-work sources needed to define outcomes.
5. Inspect verification commands only far enough to cite real checks in feature
   details; do not design new verification orchestration.
6. Inspect code or history narrowly only when needed to preserve stable IDs,
   distinguish completed work from planned work, or confirm a referenced path.
7. Classify existing state as correct, stale, missing, conflicting, or uncertain.

Treat user requirements, accepted specs, and explicit planned work as intent.
Do not infer intended product behavior from a dominant implementation pattern.
Ask only when missing information materially changes feature boundaries,
acceptance, dependencies, or whether a backlog should exist.

Stop inspection when the planned outcomes, real dependencies, observable
acceptance, and required persistence are coherent. Do not broadly map the
repository or inventory every existing capability.

## Decompose Planned Work

Define features as coherent user or system outcomes, not layers, file batches,
or activity lists. Prefer slices that can be implemented and verified without
leaving a knowingly unusable intermediate state.

For each candidate feature:

1. Derive the goal from an accepted requirement or explicit planned-work source.
2. Bound the smallest coherent scope that delivers that outcome.
3. Link canonical behavior and architecture docs instead of copying them.
4. Write observable acceptance that can drive implementation and tests.
5. Add only prerequisites that truly prevent execution.
6. Label unresolved decisions instead of inventing behavior.

Dependencies express eligibility, not relevance or priority. Do not add a
dependency merely because two features touch the same subsystem.

For an existing application, track only explicitly planned, current, or
persistent work. Never reconstruct already implemented behavior into a fake
backlog. For greenfield work, decompose accepted requirements even when some
individual slices are one-session sized.

## Keep the Index Compact

For new canonical state, use this v1 shape:

```json
{
  "schema_version": 1,
  "features": [
    {
      "id": "feat-example",
      "title": "Observable outcome",
      "status": "todo",
      "depends_on": [],
      "detail": "features/feat-example.md",
      "specs": ["docs/specs/example.md"],
      "external_ref": "optional tracker reference"
    }
  ]
}
```

Require `id`, `title`, `status`, `depends_on`, and `detail`. Keep `specs` and
`external_ref` optional. Use only `todo`, `in_progress`, `blocked`, and `done`.
For new v1 state, use IDs shaped as `feat-<stable-token>`, keep each detail path
unique and inside `features/`, and use repository-relative Markdown paths for
specs. Reject absolute paths and parent traversal. Keep IDs stable after
publication, keep dependency lists unique, and make every dependency reference
another existing ID.

Do not add sprints, estimates, deadlines, comments, assignees, priority, rank,
or ownership locks by default. Array position, ID order, file names, and
creation time have no priority or execution-order meaning.

Allow multiple `in_progress` features. Status records reality; it is not a lock
and does not grant ownership.

## Write Verifiable Feature Details

Require each tracked feature detail to contain:

- **Goal**: one coherent user or system outcome;
- **Scope**: the included work boundary;
- **Acceptance**: observable or verifiable outcomes;
- **Relevant docs**: canonical specs and focused architecture/subsystem routes;
- **Verification**: real targeted and affected checks when known.

Add only when needed:

- **Non-goals** when scope is likely to drift;
- **Accepted exceptions** when completion intentionally leaves an acceptance or
  verification item unmet;
- **Handoff** when work stops before completion;
- blocker details when status is `blocked`.

Do not duplicate index status in the detail. Do not copy product rules from a
spec, architecture prose from a map, a long implementation plan, full command
logs, or history already available in git.

Make every acceptance item testable by observation. Prefer:

> An invalid refresh token returns 401 and does not create a session.

Avoid subjective completion claims such as:

> Authentication is implemented cleanly.

Treat qualitative words such as `fast`, `short-lived`, `secure`, `reasonable`,
or `clean` as unresolved unless a canonical source supplies a threshold,
comparison, or observable result. Do not sharpen them by inventing a value. If
the ambiguity materially affects scope or acceptance, request the missing
decision before publishing the feature as `todo`. When persistent state is
still required, mark the feature `blocked` and record the concrete decision
needed; otherwise omit the unresolved record and report the prerequisite to the
appropriate requirements or specs workflow.

Name an actual verification command when evidence provides one. If the command
or environment is undecided, record the decision as unresolved rather than
inventing a runnable check. Treat command placeholders such as `<test-file>` as
instructions to resolve later, not commands suitable for a committed feature
detail.

## Maintain Lifecycle Truth

Select work in this order:

1. follow an explicit user or task assignment;
2. otherwise follow the repository's external tracker, queue, or team convention;
3. otherwise report all eligible candidates and request selection.

A feature is eligible when it is `todo` and all dependencies are `done`.
Dependencies constrain eligibility but never select between multiple eligible
features. Do not automatically promote a feature during backlog creation.

Apply statuses literally:

| Status | Required truth |
|---|---|
| `todo` | Intent and acceptance are clear; work has not started |
| `in_progress` | Work is actually underway |
| `blocked` | A concrete dependency, decision, or resource prevents progress |
| `done` | Every acceptance and required check is satisfied or covered by a recorded accepted exception |

When stopping before completion, keep Handoff limited to:

```text
Done
Remaining
Blocker
Next
```

When completing a feature:

1. review every acceptance and required verification item;
2. run or confirm current evidence for every required verification item;
3. record each intentional exception with the unmet item, reason, accepting
   authority, and follow-up reference when relevant;
4. remove stale blocker and Handoff content;
5. mark `done` only when every item is satisfied or covered by an exception;
6. run the available structural feature-state check after the state update, and
   repair the state or restore a truthful non-done status if that check fails.

Keep accepted exceptions in feature detail, never in the compact index. Preserve
them while relevant or move them to a durable canonical decision, spec, or
follow-up before compacting the detail.

Prefer compacting low-value completed detail before pruning identity. Never
leave a dangling `detail` path: under a schema that requires detail, retain a
compact file until the index entry is also pruned or an explicit repository
policy safely changes the relationship. Do not create `features/archive/` by
default.

## Integrate Discoverability Minimally

When enabling feature state, add only the route needed to expose it through the
existing canonical instruction entry point. Include concise working rules only
when absent: read assigned feature detail, allow parallel `in_progress` work,
mark `done` only after acceptance and checks, and leave Handoff only when
stopping.

Preserve the router's structure, terminology, human intent, and unrelated dirty
changes. Do not redesign instruction routing. If no canonical route exists or
adding one requires resolving ambiguous instruction ownership, stop and report
the `harness-map` prerequisite instead of inventing a new routing system.

Validate every added route and path in the same invocation.

## Migrate and Rerun Safely

When migrating legacy harness feature state:

- preserve stable feature IDs and meaningful planned/current scope;
- map legacy active work to `in_progress` only when work is truly underway;
- allow multiple `in_progress` features instead of enforcing one global active
  feature;
- remove priority from the canonical v1 index without treating its old value as
  automatic selection; preserve necessary scheduling intent in the team's real
  queue or decision source;
- move useful active resume state from a global progress log into the relevant
  feature Handoff;
- remove obsolete logs or checkers only after their useful state is migrated and
  all routes are updated;
- leave ambiguous legacy meaning unchanged and report the decision needed.

On every rerun, read existing state before editing. Preserve stable IDs, titles,
human-authored acceptance, accepted exceptions, external references, and valid
custom conventions. Patch only stale or missing state. With unchanged evidence,
produce no semantic diff.

## Apply the Workflow

1. Declare the feature-state scope and persistence need.
2. Audit existing execution memory and decide whether to reuse, create, migrate,
   update, or make no change.
3. Gather planned-work evidence until the stopping rule is met.
4. Decompose only explicit planned work into coherent outcomes.
5. Create or patch the compact index and required feature details.
6. Add the minimal discoverability route when safe.
7. Validate shape, graph, files, lifecycle consistency, links, and acceptance.
8. Review the diff for invented behavior, duplicate truth, unstable IDs,
   priority-by-order assumptions, stale handoff, and unrelated rewrites.
9. Close the feature phase before suggesting another harness specialist.

## Respect Mutation Boundaries

- Preserve unrelated worktree changes and repository-native conventions.
- Keep one fact in one canonical home; link instead of duplicating.
- Report conflicting intent instead of forcing consistency.
- Do not rewrite existing IDs or completed history merely for uniform naming.
- Do not modify implementation code, product specs, architecture maps,
  verification tooling, or broad garden findings during this phase.
- Do not install dependencies, mutate production resources, or contact external
  trackers unless the user has separately authorized that action.

## Forbid Scope Expansion

Do not:

- turn all existing behavior, issues, or TODOs into features;
- create a repository backlog solely because a template exists;
- replace a sufficient external tracker with mirrored metadata;
- infer priority or next work from array order, IDs, dates, or file names;
- enforce a single active feature or treat status as ownership;
- invent product behavior, dependencies, verification commands, or acceptance;
- add a global diary, fixed archive, detailed execution plan, or extra workflow
  fields by default;
- implement the feature, generate specs, design verification orchestration, or
  perform broad cleanup;
- overwrite unrelated dirty changes or ambiguous human decisions.

## Validate the Result

Require all applicable gates:

- JSON parses and matches the repository's chosen compact schema.
- IDs and detail paths are unique and stable; statuses are valid.
- Dependency references exist, contain no self-dependency, and form no cycle.
- Every referenced detail and spec path stays inside the repository and resolves.
- Every tracked feature has coherent scope and observable acceptance.
- No unresolved qualitative criterion or placeholder command is presented as
  executable acceptance or verification.
- Array order is not documented or used as priority or selection order.
- `blocked` state names a concrete blocker; `done` state has no stale blocker or
  Handoff and covers every acceptance and required check.
- Accepted exceptions remain in the detail with authority and follow-up when
  relevant.
- New feature state is discoverable through a minimal instruction route.
- Existing structural feature or harness checks pass when available.
- The final diff is focused and rerun-safe.

Use an available JSON parser, repository schema validator, and garden-owned
structural check. When no structural helper exists, perform a direct lightweight
shape, graph, and path audit; do not create garden tooling in this phase. Do not
run a full code suite for planning-only changes unless repository policy or the
actual state transition requires it.

## Report the Invocation

Report concisely:

- reused feature-state capabilities or external sources;
- created, migrated, or changed artifacts;
- intentionally omitted feature state or optional fields and why;
- eligible candidates without selecting one when assignment is absent;
- conflicts, uncertainty, blockers, or follow-up decisions;
- validation performed and its result.

Measure success by coherent, resumable execution state, not feature count.
