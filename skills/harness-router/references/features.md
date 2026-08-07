# Features Fallback Phase

Use this reference only when `harness-features` cannot be composed. Keep
feature-state work isolated until its gates pass, then return to the router.

## Inputs and Preconditions

Require:

- accepted requirements or explicit planned/current work;
- evidence that a repository-native backlog or durable execution memory earns
  its cost;
- user mutation authority and the original git status;
- completed accepted specs and focused map routes when relevant.

Use repository-local feature state when a planned greenfield backlog,
multi-session work, real execution dependencies, shared durable scope, or high
resume cost justifies it. A planned feature may be one-session sized when the
backlog itself is project memory.

Do not enable it for an ad-hoc focused task, an inventory of implemented
behavior, a sufficient external tracker, or template completeness.

## Inspection Budget

Inspect:

1. canonical instructions and existing feature-state routes;
2. feature indexes, detail files, schemas, progress logs, plans, issue
   references, and external selection conventions;
3. only accepted requirements, specs, architecture routes, and planned-work
   sources needed to define outcomes;
4. verification commands only far enough to cite real checks;
5. code or history narrowly to preserve stable IDs, distinguish planned from
   completed work, or resolve a referenced path.

Stop when persistence need, planned outcomes, real dependencies, observable
acceptance, and required checks are coherent. Do not map the whole repository
or reconstruct existing functionality as planned work.

## Artifact Contract

Prefer a useful existing equivalent. Otherwise default to
`feature_index.json` and `features/<id>.md`. For new or migrated v1 state,
require top-level `schema_version: 1` and `features`. Require record fields
`id`, `title`, `status`, `depends_on`, and `detail`; permit optional `specs` and
`external_ref`. Use only `todo`, `in_progress`, `blocked`, and `done`.

Keep IDs and detail paths unique and stable. Keep detail paths under
`features/`; reject absolute or parent-traversal paths. Require dependency IDs
to exist, reject self-dependencies and cycles, and treat dependency lists as
eligibility constraints rather than relevance, priority, or selection.
For new v1 IDs, use the canonical `^feat-[A-Za-z0-9][A-Za-z0-9._-]*$` shape.
Do not rename a published legacy ID merely to enforce new naming; preserve it
and report a schema-policy decision when migration cannot accept it safely.

Do not add sprints, estimates, deadlines, comments, assignees, rank, priority,
or ownership locks by default. Array order, ID order, filenames, and creation
time never select the next feature. Allow multiple `in_progress` features.

Require each feature detail to contain Goal, Scope, Acceptance, Relevant docs,
and Verification. Add Non-goals, Accepted exceptions, Handoff, or blocker
details only when they apply. Keep product rules in specs and architecture
rules in map artifacts.

## Workflow

1. Declare the feature-state scope and persistence need.
2. Decide to reuse, create, migrate, update, or make no change.
3. Gather only explicit planned-work evidence.
4. Decompose work into coherent user or system outcomes, not layers, file
   batches, or activity lists.
5. Link canonical specs and architecture rather than copying them.
6. Write observable acceptance. Do not invent thresholds for qualitative terms
   such as `fast`, `secure`, or `reasonable`.
7. Add only dependencies that truly prevent execution.
8. Create or patch the compact index and required details while preserving
   stable IDs and valid human-authored scope.
   - On legacy migration, set `schema_version` to `1`, preserve stable IDs,
     translate an old active status only when work is demonstrably underway,
     remove priority semantics only after preserving any real scheduling intent
     in its accepted external source, and move unique resume value into the
     relevant Handoff before deleting a global progress file.
9. Add only the existing instruction route needed to expose feature state.
   Report a map prerequisite if routing ownership is ambiguous.
10. Validate shape, graph, paths, lifecycle, acceptance, links, and available
    structural checks.
11. Review the diff for fake backlog entries, invented behavior, duplicate
    truth, priority-by-order assumptions, placeholders, stale Handoff, and
    unrelated rewrites.

When no explicit assignment or external convention selects work, report every
eligible candidate and request selection. Do not choose among candidates.

## Lifecycle Rules

Apply statuses literally:

| Status | Required truth |
|---|---|
| `todo` | Intent and acceptance are clear; work has not started |
| `in_progress` | Work is actually underway |
| `blocked` | A concrete dependency, decision, or resource prevents progress |
| `done` | Every acceptance and required check is satisfied or covered by an accepted exception |

Keep Handoff limited to Done, Remaining, Blocker, and Next when stopping before
completion. On completion, review all acceptance and checks, record each
exception with unmet item, reason, accepting authority, and relevant follow-up,
remove stale blocker and Handoff, mark done, then run the structural state check.

Keep accepted exceptions in feature detail, not the index. Preserve them while
relevant or move them to a durable accepted home before compaction. Compact
low-value completed detail before pruning compact done identity. Never leave a
dangling required detail path or create an archive by default.

## Mutation Boundary

- Modify feature state and at most one minimal existing instruction route.
- Preserve stable IDs, accepted exceptions, external references, repository
  conventions, and unrelated work.
- Do not implement features or modify product specs, architecture, verification
  tooling, or garden rules.
- Do not contact external trackers or install dependencies without separate
  authorization.

## Quality Gate

Require all applicable conditions:

- JSON parses, declares `schema_version: 1` for new or migrated v1 state, and
  matches the chosen compact schema.
- IDs, detail paths, dependencies, statuses, and files are valid and acyclic.
- Every feature has coherent scope and observable acceptance.
- No placeholder command or unresolved qualitative criterion is presented as
  executable truth.
- No ordering convention implies priority or automatic selection.
- Blocked and done lifecycle content is truthful; done has no stale Handoff.
- Accepted exceptions retain authority and follow-up when relevant.
- Feature state is discoverable through one minimal valid route.
- Available structural checks pass and the diff is rerun-safe.

Without a structural helper, perform a direct lightweight shape, graph, and
path audit; do not create garden tooling in this phase.

## Close the Phase

Return to the router with reused, changed, and intentionally omitted execution
memory; eligible candidates without auto-selection; blockers or uncertainty;
validation performed; and follow-up decisions. Do not implement work here.
