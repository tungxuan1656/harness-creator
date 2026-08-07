# Map Fallback Phase

Use this reference only when `harness-map` cannot be composed. Keep every map
action inside this phase until its gates pass, then return to the router.

## Inputs and Preconditions

Require:

- the repository classification and navigation pain point from the router;
- current user mutation authority;
- the original git status and any known concurrent or unrelated changes;
- completed prior-phase artifacts only when they help locate evidence.

Own fallback generation and rerun behavior for instruction routing, an
architecture overview or existing equivalent, a docs index when several docs
need routing, and subsystem guides only when a focused boundary or flow is hard
to infer.

## Inspection Budget

Inspect:

1. root and nested agent instructions, tool-specific rules, README, contributor
   guidance, and current documentation routes;
2. the root tree to one or two levels, manifests, workspace/build configuration,
   CI, and native verification entry points;
3. real application entry points, package or module boundaries, and test areas;
4. only enough representative flows through code and tests to ground the map;
5. feature or spec artifacts only far enough to preserve existing routes.

Classify relevant facts as observed, intended, proposed, or uncertain. Do not
promote a common implementation pattern into an intended boundary without
authority. Report code/doc conflicts instead of silently selecting a winner.

Stop when a fresh agent can locate the main entry points and modules, explain
coarse boundaries, and choose the next focused document. Do not inventory every
folder, feature, endpoint, or link.

## Artifact Decision

Use this test:

| Capability | Create or patch when | Reuse or omit when |
|---|---|---|
| Instruction entry | No clear agent-facing router exists or its routes are stale | An equivalent answers the router contract |
| Architecture overview | Topology, entry points, or boundaries are costly to infer | The repository is trivial or current docs already cover them |
| Docs index | Several focused docs need `Read when` routing | A few docs are already easy to discover |
| Subsystem guide | A distinct stack, multi-folder flow, or repeatedly violated boundary needs focus | Overview and code make it clear |

Require an instruction entry point or equivalent. Expect an architecture
overview for a typical medium repository unless evidence justifies omission.
Create no empty placeholder.

## Workflow

1. Declare the map scope and concrete navigation failure.
2. Identify each mapping fact's canonical home.
3. Gather evidence only until the stopping rule is met.
4. Reuse useful existing artifacts and choose the smallest missing set.
5. Patch stable headings and existing structure; adapt templates rather than
   copying placeholders.
6. Make the instruction entry answer in one scan:
   - project purpose and coarse topology;
   - task-to-doc routes;
   - main code areas and entry points;
   - universal repository invariants;
   - real verification commands;
   - feature-state location when already enabled.
7. Keep architecture content to bird's-eye flow, real entry points, coarse
   code map, boundaries, important cross-cutting concerns, uncertainty, and
   deeper routes.
8. Add a docs index only when several documents need it, with entries optimized
   for `Read when`.
9. Add a subsystem guide only when its distinct flow or boundary earns the cost.
10. Validate changed routes, links, stable symbols, paths, and documented
    commands against repository evidence.
11. Review the diff for duplicated truth, unsupported rules, placeholders,
    unrelated rewrites, and changes to human intent.

Make no change when existing mapping already passes the gates.

## Mutation Boundary

- Preserve current terminology, useful custom structure, and unrelated work.
- Keep one fact in one canonical home; elsewhere link or restate one routing
  sentence.
- Treat nested instruction files outside scope as read-only context.
- Do not create specs, feature state, verification orchestration, garden rules,
  or product-code refactors.
- Do not install dependencies or mutate external or production resources.

## Quality Gate

Require all applicable conditions:

- A fresh agent can find real entry points, modules, and focused docs quickly.
- Paths, internal links, stable symbols, and documented commands resolve.
- Boundaries are grounded or labeled intended, proposed, or uncertain.
- The instruction entry remains a concise router, not an encyclopedia.
- Every optional artifact prevents a concrete navigation failure.
- The ordinary path needs at most the instruction entry and one focused doc
  before code.
- Structural documentation checks pass when present and applicable.
- The diff is focused and an unchanged rerun is a no-op.

For a read-only audit, sample representative routes and inspect command
definitions without running a code suite solely to prove the map.

## Close the Phase

Return to the router with reused, changed, and intentionally omitted mapping
capabilities; grounded uncertainty and conflicts; validation performed; and any
follow-up that belongs to another phase. Do not begin that phase here.
