---
name: harness-router
description: >-
  Audit, adopt, upgrade, or migrate a repository-wide coding-agent harness by
  classifying existing capabilities and routing only the necessary map, specs,
  features, verify, and garden phases in a safe order. Use when setting up a
  repository for coding agents, improving an incomplete or inconsistent harness,
  coordinating several harness concerns, or migrating from harness-slim. Do not
  use for an ordinary focused coding task, generic project management, model or
  prompt selection, or a single harness concern already covered by
  harness-map, harness-specs, harness-features, harness-verify, or harness-garden.
---

# Harness Router

## Purpose

Coordinate repository-wide harness adoption without turning setup into a fixed
scaffold or one undifferentiated analysis pass:

```text
inspect capabilities and pain points
  -> choose the smallest justified phase set
  -> complete and validate one phase
  -> continue only when another phase remains necessary
  -> run final route and command sanity checks
```

Treat `harness-router` as the distribution name for the thin `harness` entry
point described by the design corpus. Own the audit, selection, ordering, and
phase handoff. Let specialists own generation and rerun behavior for their
artifacts.

## Preserve the Common Task Path

Optimize for a coding agent to follow this route during ordinary work:

```text
agent instructions
  -> one focused document when needed
  -> relevant code and tests
  -> targeted or affected verification
```

Create a capability only when a concrete failure mode earns its cost. Reuse a
good existing equivalent regardless of its filename. Prefer absent optional
artifacts to placeholders or generic prose.

Do not use this router merely because a repository contains harness artifacts.
Allow direct specialist invocation to proceed without router ceremony.

## Inspect Before Selecting Phases

Inspect only enough to classify the repository and the user's pain point:

1. Read git status and preserve unrelated changes.
2. Inspect the root tree to one or two levels.
3. Locate root and nested agent instructions, tool-specific rules, README,
   contributor guidance, documentation routes, and architecture material.
4. Locate manifests, workspace and build configuration, native commands, CI,
   test areas, and existing verification adapters.
5. Locate existing specs, feature indexes/details, progress or plan artifacts,
   structural maintenance checks, and legacy harness files.
6. Inspect representative code only when repository topology or a phase choice
   cannot be established from the preceding evidence.
7. Classify each capability as useful, missing, stale, conflicting, uncertain,
   or intentionally unnecessary.
8. Classify the repository as near-empty greenfield or existing, note topology
   and toolchains, and determine whether specialist skills can be composed.

Ask only for information that cannot be inferred safely and materially changes
the selected phases, intended behavior, user authority, or safety boundary.
Do not reverse-engineer the repository merely to make the audit exhaustive.

## Audit Capabilities, Not Filenames

Use these questions:

| Capability | Sufficient when | Select a phase when |
|---|---|---|
| Navigate | Agents can find entry points, boundaries, focused docs, and universal instructions | Routes, topology, or boundaries are missing, stale, or expensive to infer |
| Understand | Durable product behavior and important edge cases are safe to determine | Permissions, state transitions, public contracts, or business rules are unsafe to infer |
| Focus | Planned or persistent work has coherent scope, acceptance, dependencies, and resume state | Greenfield requirements need a repository backlog or multi-session work needs durable state |
| Verify | Real agent-facing commands provide fast, trustworthy targeted or affected feedback | Commands are fragmented, unclear, unsafe, or lack conservative affected coverage |
| Maintain | Harness truth and implementation do not show scoped actionable drift | Cleanup, migration, stale state, broken routes, or recurring bad patterns justify maintenance |

Require an agent instruction entry point or equivalent. For a typical medium
repository, expect an architecture overview or existing equivalent unless the
repository is trivial or current docs already cover topology, entry points, and
boundaries. Keep specs, feature state, verification wrappers, subsystem guides,
and maintenance scripts conditional.

Do not create a second system when native docs, commands, an external tracker,
or repository tooling already satisfy the capability.

## Select the Smallest Ordered Phase Set

Choose from:

| Phase | Select when | Do not select merely because |
|---|---|---|
| Map | Navigation, instruction routing, architecture orientation, or subsystem boundaries are weak | A default `AGENTS.md` or architecture template exists |
| Specs | Durable product or domain behavior is unsafe to infer or accepted behavior changed | The repository has code, endpoints, models, or obvious CRUD |
| Features | Accepted greenfield work needs a planned backlog or execution needs persistence | Every task could be written as a feature or an external tracker already suffices |
| Verify | The feedback interface is fragmented, unclear, slow, unsafe, or lacks affected coverage | Native commands are already stable and discoverable |
| Garden | The user requests audit/cleanup, migration exposes stale artifacts, or scoped entropy is evident | Every adoption should include a repository-wide semantic audit |

Select zero phases when existing capabilities already solve the stated problem.
Report an evidence-backed no-op instead of refreshing files for uniformity.

### Order existing-repository adoption

Use only the applicable steps:

```text
map when navigation is weak
  -> verify when feedback is unclear
  -> specs for specific durable ambiguous behavior
  -> features for explicit planned or persistent work
  -> focused garden when cleanup was requested or adoption exposed real drift
```

Allow evidence-backed reordering when a real prerequisite demands it. For
example, complete a focused spec before feature decomposition when acceptance
depends on unsettled behavior.

### Order near-empty greenfield adoption

Use only the applicable steps:

```text
accepted requirements
  -> specs for non-trivial behavior
  -> proposed map with assumptions
  -> features when a repository backlog is justified
  -> code/tooling scaffold outside harness scope
  -> verify only after real commands exist
```

Do not write observed architecture for code that does not exist. Do not create
runnable verification commands before real checks exist.

### Order `harness-slim` migration

Use this dependency-aware path:

```text
audit human changes and legacy consumers
  -> map canonical instruction and documentation routes
  -> verify native commands and the stable quick/affected/full interface
  -> features migrate active/planned state while preserving stable IDs
  -> garden migrate valuable structural checks and remove obsolete artifacts
  -> final cross-link and command sanity check
```

Insert specs only for durable behavior that is genuinely unsafe to infer. Do
not preserve the global one-active-feature rule, mandatory progress diary,
priority-by-array semantics, giant stack-guesser, public `doctor` mode, or
fixed artifact checklist merely for compatibility.

## Delegate or Use One Fallback at a Time

For every selected phase:

1. Declare the phase, repository scope, concrete failure mode, user mutation
   authority, and evidence inherited from completed phases.
2. Prefer the matching installed specialist when the environment can compose
   skills. Use `harness-map`, `harness-specs`, `harness-features`,
   `harness-verify`, or `harness-garden` directly and let it apply its own
   contract.
3. When composition is unavailable, read exactly one matching fallback
   reference listed below. Do not load the other phase references.
4. Inspect phase-specific evidence rather than carrying an untested conclusion
   from the capability audit.
5. Produce or repair only that phase's focused artifacts.
6. Apply its quality gate, review its diff, and summarize outputs and
   uncertainty.
7. Close the phase before loading or delegating another concern.

Pass completed artifacts forward as inputs. Do not re-derive the same mental
model in later phases. Do not treat an integration write made by a specialist
as a new phase: it is part of that specialist's completion gate.

If a selected phase exposes an unresolved prerequisite, stop dependent phases
instead of inventing truth. Continue only with independent phases whose safety
and output do not depend on the missing decision.

## Enforce Phase Isolation

Use this state transition for each phase:

```text
selected
  -> active: one concern and one contract loaded
  -> produced: focused artifact or evidence-backed no-op
  -> validated: phase gates and integration routes checked
  -> closed: outputs and uncertainty summarized
```

Never keep two phases active. In particular:

- derive architecture from repository topology and accepted boundaries, not
  from an unfinished product-spec pass;
- investigate product behavior independently, using completed map routes only
  to locate evidence;
- derive features from accepted requirements and specs, not from a code
  inventory or unfinished behavior analysis;
- derive verification from native commands and build topology, not from broad
  feature prose;
- audit garden drift against canonical artifacts without silently redefining
  their truth.

## Respect Ownership and Integration Boundaries

Treat artifact ownership as primary stewardship, not an exclusive-write lock:

| Specialist | Primary writes | Minimal integration write |
|---|---|---|
| Map | Instruction routing, architecture overview, docs index, subsystem guides | None; routing is already primary |
| Specs | Canonical behavior specs | One existing docs-index or instruction route |
| Features | Feature index, details, and lifecycle semantics | One existing instruction route to feature state |
| Verify | Agent-facing adapter and verification helpers | Existing instruction verification commands |
| Garden | Deterministic maintenance tooling and scoped repairs | Affected canonical artifacts when cleanup is authorized |

Require each integration write to expose only the created or repaired
capability, preserve existing structure and human intent, avoid broad cleanup,
and validate the route or command in the same phase. Report the owning-phase
prerequisite when discoverability requires ambiguous redesign.

Outside an active fallback phase, do not let the router core author specialist
artifacts. In the portable profile, let the one loaded reference temporarily
own its phase writes until that phase closes. In the modular profile, coordinate
specialist writes, inspect their diffs, and perform final read-only sanity
checks.

## Apply Final Sanity Checks

After all selected phases close:

1. Review the combined diff against the original dirty worktree.
2. Confirm every new or changed capability is discoverable through the smallest
   valid route.
3. Resolve changed internal links, referenced files, stable symbols, and
   documented helper paths.
4. Run changed commands or direct behavior tests in proportion to risk; never
   claim an unrun command passed.
5. Run an existing deterministic structural check when applicable.
6. Confirm one fact has one canonical home and later phases consumed rather
   than duplicated earlier truth.
7. Confirm omitted optional capabilities remain absent and justified.
8. Confirm an unchanged rerun would produce no semantic diff.

Do not run a full code suite mechanically for documentation-only adoption. Do
not treat a semantic garden finding as an automatic delivery gate.

## Respect Mutation and Safety Boundaries

- Treat audit, assessment, or review requests as read-only unless the user also
  asks to adopt, upgrade, migrate, clean, fix, or otherwise change artifacts.
- Treat setup, adoption, upgrade, and migration requests as authority for
  focused repository-harness changes, not product implementation or broad
  refactoring.
- Preserve correct human-authored decisions, repository conventions, stable
  IDs and paths, accepted exceptions, and unrelated dirty changes.
- Patch existing structures; report ambiguous conflicts instead of forcing
  consistency.
- Install no dependencies and mutate no production resource without separate
  explicit authorization.
- Use disposable fixtures for generated executable helpers and remove only
  artifacts created by the invocation.

Do not:

- generate every template or a full docs tree from a checklist;
- infer architecture from manifests alone;
- reverse-engineer existing functionality into a backlog;
- add a global progress diary, one-active-feature lock, or implicit priority;
- build a second build or dependency system;
- combine semantic judgment with deterministic regex gates;
- redesign CI, project management, product behavior, or implementation outside
  an explicitly selected and authorized phase;
- reset, stash, overwrite, or normalize unrelated user work.

## Report the Invocation

Report concisely:

- repository classification and the pain point addressed;
- capabilities reused as-is;
- selected phases in executed order and why each was necessary;
- artifacts created, changed, migrated, or intentionally left unchanged;
- omitted phases or optional capabilities and why;
- conflicts, uncertainty, blocked prerequisites, and follow-up decisions;
- validation and verification actually performed with results.

Measure success by reduced navigation, intent, execution, feedback, and
maintenance cost—not by artifact or phase count.

## Load a Fallback Reference Only When Needed

Read exactly one reference only when its specialist cannot be composed:

- Map: [references/map.md](references/map.md)
- Specs: [references/specs.md](references/specs.md)
- Features: [references/features.md](references/features.md)
- Verify: [references/verify.md](references/verify.md)
- Garden: [references/garden.md](references/garden.md)

Return to this router only after the active reference's phase is validated and
closed. Treat installed specialist skills as canonical over these condensed
portable fallbacks.
