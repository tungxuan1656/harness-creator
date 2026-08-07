# Knowledge and Ownership

## 1. Read ladder

### Near-always

- the root instruction file loaded by the target agent.

### By task classification

- architecture overview when topology is unfamiliar or the task is cross-cutting;
- one relevant subsystem guide;
- feature detail when the task belongs to a persistent feature;
- a spec when domain behavior affects implementation.

### On demand

- decisions, external references, generated schemas;
- garden findings;
- historical feature details.

A doc should not force an agent to open several other docs just to understand one basic invariant.

## 2. Router contract

The instruction entry point SHOULD answer these questions in one scan:

1. What does the project do, and what is its main topology?
2. Which docs should be read for task type X?
3. Where are the main code areas and entry points?
4. Which universal invariants apply to every task?
5. Which command verifies a change?
6. Where is feature state, if the repository uses it?

Do not embed framework tutorials, the full architecture, or feature history.

## 3. Architecture map

A useful architecture overview contains:

- a bird's-eye flow;
- application entry points;
- a coarse code map;
- dependency direction and boundaries;
- important cross-cutting concerns;
- explicit invariants;
- routes to deeper docs.

It does not list every folder/function, use line numbers, or copy subsystem guides.

## 4. Subsystem docs

Create a subsystem guide only when at least one is true:

- it has a distinct stack or convention;
- a flow spans several folders and is hard to locate;
- agents often place logic in the wrong layer;
- a boundary cannot be safely inferred;
- the subsystem is large enough that the overview should stay coarse.

Prefer real symbols/paths, flows, rules, examples, and test locations.

## 5. Product/domain specs

Create specs for:

- core workflows;
- permissions or state transitions;
- business invariants;
- public contracts;
- cross-layer behavior;
- edge cases that are easy to misread.

Do not create specs for obvious CRUD or framework plumbing.

A spec SHOULD contain:

```text
Goal
Flow
Rules
State transitions when applicable
Edge cases
Interfaces when a public contract needs them
Non-goals when scope can drift
Sources / uncertainties
```

`Sources / uncertainties` briefly records whether behavior comes from a requirement, existing canonical doc, test/evidence, or an inference requiring confirmation.

## 6. Truth ownership

`Owner` means **primary steward**, not exclusive writer.

| Truth | Primary steward | Who may update it |
|---|---|---|
| Instruction routing | Harness/map workflow | A coding agent when the canonical route changes in scope |
| Architecture intent | Architecture docs | An agent making an accepted boundary change; garden may repair stale facts when authorized |
| Product behavior | Specs | An agent making an accepted behavior change; garden may repair proven stale facts when authorized |
| Feature state/scope | Feature artifacts | The feature agent or features workflow |
| Verification interface | Verify workflow | An agent making an in-scope tooling change |
| Observed implementation | Code/tests | The coding workflow for the user task |

Skill ownership controls generation and rerun behavior. It MUST NOT prevent a feature from updating a canonical doc that the feature changes.

Specialist skills may also make minimal discoverability patches outside their primary artifacts according to the [cross-skill integration contract](07-HARNESS_SKILL_SPEC.md#6-cross-skill-integration).

## 7. One fact, one canonical home

Other docs MAY:

- link;
- restate one sentence for routing;
- summarize an invariant every relevant task must see.

Do not copy whole sections. Architecture, specs, and feature state are peer truth branches, not one derivation chain:

```text
                    AGENTS.md
                       |
          +------------+------------+
          |            |            |
          v            v            v
   Architecture      Specs     Feature state
          |            |            |
          v            |            |
   Subsystem docs      |            |
          \             |           /
           +------------+----------+
                       v
                  Code + tests
```

Feature detail primarily routes to relevant specs, architecture/subsystem docs, acceptance, and verification. Product behavior is not derived from architecture.

## 8. Mutation and rerun protocol

Before changing an artifact, the skill MUST:

1. read existing content and git state;
2. identify the canonical owner of the fact;
3. classify content as correct, stale, missing, conflicting, or uncertain;
4. patch stable headings or the existing structure;
5. preserve human-authored decisions not proven wrong;
6. report a conflict instead of overwriting when intent is unclear.

Managed markers MAY be used for fully generated sections. Do not wrap human-maintained content by default.

## 9. Writing standard

Prefer:

- maps/rules before prose;
- `A -> B -> C` for flows;
- tables for mappings/state;
- one invariant per bullet;
- stable symbols and paths;
- observed/intended/proposed labels when useful.

Remove:

- history that does not affect decisions;
- tutorials the agent already knows;
- prose that repeats code;
- generic best practices not grounded in the repository;
- manually maintained `Last updated` dates as a proxy for correctness.

## 10. Docs index

Create `docs/README.md` when several docs need routing. Each row should mainly answer `Read when`, not provide a long summary.

```markdown
| Document | Read when |
|---|---|
| `BACKEND.md` | Changing API, service, or persistence code |
| `specs/auth.md` | Changing authentication behavior |
```
