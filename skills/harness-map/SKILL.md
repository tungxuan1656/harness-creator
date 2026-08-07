---
name: harness-map
description: >-
  Map or repair repository navigation for coding agents by grounding instruction
  routes, architecture overviews, documentation indexes, and conditional
  subsystem guides in real code, tests, and existing docs. Use when agents
  cannot locate entry points, understand topology or dependency boundaries,
  choose the right documentation, or follow routes made stale by structural
  changes. Do not use for product/domain specifications, feature backlog or
  handoff state, verification orchestration, broad semantic cleanup, or an
  ordinary focused code change with no navigation problem.
---

# Harness Map

## Purpose

Make the repository legible enough that a fresh coding agent can quickly answer:

- Where do the main entry points and modules live?
- Which boundaries and dependency directions matter?
- Which focused document should be read next?
- Which code and tests are relevant to the task?

Create missing capabilities, not a fixed documentation tree. Keep the ordinary
path short:

```text
instruction entry point
  -> one focused document when needed
  -> relevant code and tests
  -> proportional verification
```

Keep this invocation isolated to repository mapping. Do not drift into specs,
feature planning, verification design, or broad gardening.

## Own the Mapping Artifacts

Own generation and rerun behavior for:

- root and tool-specific instruction routing;
- an architecture overview or an existing equivalent;
- a documentation index when several documents need routing;
- subsystem guides only when a focused boundary or flow is hard to infer.

Prefer existing canonical artifacts over default names. Route tool-specific
instruction files to one canonical rule home instead of copying rules. Treat
nested instruction files outside the requested scope as read-only context.

Use this artifact test:

| Capability | Create or patch when | Reuse or omit when |
|---|---|---|
| Instruction entry point | No clear agent-facing router exists or its routes are stale | An equivalent already answers the routing contract |
| Architecture overview | Topology, entry points, or boundaries are expensive to infer | The repository is trivial or an existing doc covers them |
| Documentation index | Several focused docs need `Read when` routes | Few docs are already easy to discover |
| Subsystem guide | A distinct stack, multi-folder flow, or commonly violated boundary needs focused guidance | The overview and code make the subsystem clear |

Require an agent instruction entry point or equivalent. For the default
10k-200k LOC repository, treat an architecture overview as expected; omit it
only when the repository is genuinely trivial or an existing document already
covers topology, entry points, and boundaries.

Do not create empty placeholders. An omitted optional artifact is better than
generic prose.

## Gather Evidence

Inspect before asking questions or writing:

1. Read git status and preserve unrelated changes.
2. Inspect the root tree to one or two levels.
3. Find root and nested agent instructions, including `AGENTS.md`, `CLAUDE.md`,
   `.github/copilot-instructions.md`, Cursor rules, and contributor guidance.
4. Read the README, documentation routes, existing architecture material,
   manifests, workspace/build configuration, CI, and native verification entry
   points.
5. Locate real application entry points, package/module boundaries, and test
   areas.
6. Locate existing issue or feature state only far enough to preserve its
   instruction route; do not analyze or redesign it.
7. Trace only enough representative flows through code and tests to ground the
   map. Do not infer architecture from manifests alone.
8. Classify each relevant fact or section as correct, stale, missing,
   conflicting, or uncertain.

Ask only for information that cannot be inferred safely and would materially
change the output.

Label truth when the distinction matters:

- **Observed**: supported by code, tests, configuration, or runtime evidence.
- **Intended**: supported by an accepted decision, canonical document, or user
  requirement.
- **Proposed**: a future structure not yet implemented.
- **Uncertain**: evidence conflicts or a decision is missing.

Do not promote a common code pattern into a required boundary without evidence
that it is intended. When code and documentation conflict, report the evidence
and classify the conflict instead of silently choosing a winner.

## Stop Inspection Deliberately

Stop when a fresh agent can locate the main entry points and modules, explain
the coarse boundaries, and choose the next relevant document without broad
reverse-engineering. Expand inspection only when evidence shows that a needed
boundary or route remains unclear. Do not turn a focused map audit into a
repository-wide broken-link scan, semantic cleanup, or verification run; route
those concerns to the matching harness phase when they are independently
justified.

## Build the Smallest Useful Map

### Instruction router

Make the canonical instruction entry point answer in one scan:

1. What does the project do, and what is its coarse topology?
2. Which document should be read for each major task type?
3. Where are the main code areas and entry points?
4. Which repository-wide invariants apply to every task?
5. Which existing command verifies a change?
6. Where does persistent feature state live, if already enabled?

Keep the router concise. Link rather than duplicate. Do not embed framework
tutorials, full architecture, product behavior, feature history, or commands
that have not been verified from repository evidence.

### Architecture overview

Include only durable orientation knowledge:

- a bird's-eye flow;
- real application entry points;
- a coarse path-to-responsibility map;
- dependency direction and important boundaries;
- significant cross-cutting concerns and invariants;
- known exceptions or uncertainties;
- routes to deeper docs.

Use stable symbols and paths, not line numbers. Do not enumerate every folder,
function, endpoint, or implementation detail.

### Documentation index

Create or patch a docs index only when several docs need routing. Optimize each
entry for `Read when`; avoid long summaries and duplicate truth.

### Subsystem guide

Add a guide only when at least one condition holds:

- the subsystem has a distinct stack or convention;
- a flow spans several folders and is hard to locate;
- agents commonly put logic in the wrong layer;
- an important boundary cannot be safely inferred;
- the subsystem is too detailed for the architecture overview.

Prefer real paths, stable symbols, compact flows, rules, observed examples, and
test locations. Record exceptions and uncertainty instead of normalizing them.

## Apply the Workflow

1. Declare the map scope and the navigation failure being addressed.
2. Audit existing mapping capabilities and identify each fact's canonical home.
3. Gather representative evidence until the stopping rule is met.
4. Choose the smallest justified artifact set and explicitly retain useful
   existing equivalents.
5. Patch existing structure and stable headings where practical. Use templates
   only as starting points; delete irrelevant sections and placeholders.
6. Add only the routes required to make created or repaired capabilities
   discoverable.
7. Validate every changed path, link, symbol, and documented command against
   repository evidence.
8. Review the diff for duplicated truth, unsupported rules, unrelated rewrites,
   and accidental changes to human-authored intent.
9. Close the map phase before suggesting another harness specialist.

If existing artifacts already satisfy the quality gates, make no change and
report the evidence-backed no-op.

## Respect Mutation Boundaries

- Read existing content and git state before editing.
- Preserve correct human-authored decisions and repository terminology.
- Make focused patches; do not rewrite unrelated prose for uniformity.
- Keep one fact in one canonical home. Elsewhere, link or restate only the
  sentence required for routing.
- Report ambiguous intent conflicts instead of overwriting them.
- Do not add managed markers around human-maintained content by default.
- Make reruns no-ops or semantic minimal diffs when evidence has not changed.
- Do not redesign another harness phase's artifacts.

## Forbid Scope Expansion

Do not:

- generate a full docs tree from a checklist;
- reverse-engineer every feature or endpoint;
- create product/domain specs or feature state;
- create or redesign verification orchestration;
- perform broad code refactors or semantic cleanup;
- turn inconsistent implementation patterns into rules without accepted intent;
- install dependencies, mutate production resources, or run unsafe commands;
- overwrite unrelated dirty worktree changes.

## Validate the Result

Require all applicable gates:

- A fresh agent can find real entry points, modules, and relevant docs quickly.
- Paths, internal links, stable symbols, and documented commands resolve.
- Boundaries are grounded in evidence or explicitly labeled intended,
  proposed, or uncertain.
- The instruction router stays concise and routes to focused truth.
- Optional artifacts have a concrete failure mode that justifies them.
- No fact is substantially duplicated across mapping artifacts.
- The common task path requires the instruction entry point and at most one
  focused doc before code for ordinary work.
- Existing structural documentation checks pass when available.
- The final diff is focused and rerun-safe.

Use cheap documentation or structural checks when the repository provides them.
Do not run a full code test suite merely because mapping files changed unless a
repository convention or the actual change requires it. For a read-only audit,
sample representative routes and inspect existing command definitions; do not
run code suites solely to prove that the mapped commands work.

## Report the Invocation

Report concisely:

- reused mapping artifacts or capabilities;
- created or changed artifacts;
- intentionally omitted optional artifacts and why;
- conflicts, uncertainty, or follow-up decisions;
- validation performed and its result.

Measure success by reduced navigation ambiguity, not file count.
