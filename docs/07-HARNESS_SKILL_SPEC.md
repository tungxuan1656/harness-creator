# Harness Skill Architecture

## 1. Purpose

Build, adopt, audit, and improve a lightweight repository harness that helps coding agents understand code quickly, stay in scope, and receive feedback at the right risk level.

The target is a medium repository, a 1-4 person team, and features that usually finish in one or a few sessions. The skill architecture must preserve delivery speed, progressive disclosure, and existing project conventions.

## 2. Chosen architecture

Preferred distribution when the platform supports multiple installed skills:

```text
harness                 # thin router/adoption coordinator
harness-map             # repository cognition and navigation
harness-specs           # product/domain behavior
harness-features        # planned backlog, scope, acceptance, handoff
harness-verify          # feedback interface and orchestration
harness-garden          # structural and semantic maintenance
```

The split follows cognitive responsibility: reverse-engineering architecture, formalizing product behavior, decomposing a backlog, designing verification, and semantic cleanup require different evidence, stopping rules, and quality gates.

## 3. Portable fallback

Some platforms cannot have a router invoke another skill, or a user may install only `harness`. In that profile, the router MAY execute the same workflow references but MUST enforce phase isolation:

```text
capability audit
  -> select only needed phases
  -> inspect MAP evidence
  -> produce + validate MAP artifacts
  -> close MAP phase
  -> inspect SPEC evidence
  -> produce + validate SPEC artifacts
  -> close SPEC phase
  -> continue only when requested/justified
```

MUST NOT derive architecture, specs, backlog, and verification tooling in one undifferentiated reasoning pass.

## 4. Router contract - `harness`

Use when the user wants to set up, adopt, upgrade, or audit a repository-wide harness.

The router only:

1. inspects root capabilities and the current pain point;
2. classifies greenfield/existing, topology, and installed skill support;
3. chooses the smallest ordered set of phases;
4. delegates to a specialist skill when available;
5. otherwise loads exactly one matching workflow reference;
6. requires the phase-specific quality gate before continuing;
7. runs a final cross-link/command sanity check;
8. reports reused, created, and intentionally omitted capabilities.

The router MUST NOT reimplement all specialist details in its core `SKILL.md`.

## 5. Specialist contracts

### `harness-map`

Use when agents struggle to locate code, understand topology/boundaries, or route through instructions/docs.

Owns generation and rerun behavior for:

- root and tool-specific instruction routing;
- an architecture overview or existing equivalent;
- a documentation index;
- conditional subsystem guides.

It inspects topology, real entry points, representative flows/tests, and separates observed patterns from intended rules.

### `harness-specs`

Use when product/domain behavior, permissions, state transitions, public contracts, or edge cases cannot be safely inferred.

Owns generation and rerun behavior for canonical repository-local specs. It records sources/uncertainties and does not automatically treat current code as intended truth.

### `harness-features`

Use when greenfield requirements need a planned repository backlog or work needs persistent scope, dependencies, acceptance, or handoff.

Owns feature schema/index/detail behavior. It MUST distinguish planned project features from ad-hoc one-session tasks and MUST NOT reverse-engineer existing functionality into a fake backlog.

### `harness-verify`

Use when existing commands are fragmented, slow, unclear, or lack stable affected feedback.

Owns `init.sh` and verification helper behavior, reuses native tools, preserves failures, and composes garden-owned structural checks when applicable.

### `harness-garden`

Use to audit/clean stale instructions, docs, feature state, verification adapters, or recurring bad patterns.

Owns structural maintenance checks and semantic gardening. Structural invariants may gate; semantic findings normally do not.

## 6. Cross-skill integration

Specialist ownership governs primary generation and rerun behavior; it is not an exclusive-write boundary. A specialist MAY make the smallest integration patch needed to expose a capability through an artifact stewarded by another skill.

| Skill | Primary writes | Integration writes allowed |
|---|---|---|
| `harness-map` | Instruction routing, architecture overview, docs index, subsystem guides | None; routing artifacts are already primary writes |
| `harness-specs` | Canonical repository-local specs | Docs index or a minimal instruction route to the new spec area |
| `harness-features` | Feature index, feature details, and feature schema behavior | Minimal instruction route to feature state |
| `harness-verify` | `init.sh` and verification helpers/configuration | Agent instruction verification commands |
| `harness-garden` | Structural maintenance tooling and scoped findings/repairs | Any affected canonical artifact when cleanup is authorized |

An integration patch:

- MUST only make the new capability discoverable or apply Garden's authorized scoped repair;
- MUST preserve the owning artifact's structure, style, human-authored intent, and unrelated dirty changes;
- MUST NOT redesign, broadly clean, or assume generation ownership of the other skill's artifact;
- MUST validate the added route, path, or command in the same invocation;
- MUST stop and report the required owning-skill follow-up when discoverability cannot be added without resolving ambiguous intent or redesigning the artifact.

An integration write is part of the current specialist's completion gate. It does not open another cognitive phase or require invoking the owning specialist.

Examples:

- Verify creates `./init.sh affected`, then patches the existing instruction router's verification command when needed.
- Specs creates `docs/specs/auth.md`, then adds one route to the existing docs index when needed.
- Features enables `feature_index.json`, then adds one feature-state route to the existing instruction entry point when needed.

This contract keeps independently invoked specialists useful without allowing cross-skill scope expansion.

## 7. Trigger boundaries

Harness skills SHOULD trigger for:

- setting up/upgrading a repository for coding agents;
- agents repeatedly reading the wrong modules or violating boundaries;
- durable product behavior needing repository-local truth;
- a greenfield backlog or multi-session feature state;
- a fast affected verification entry point;
- stale harness/docs/state cleanup;
- migration from `harness-slim`.

They SHOULD NOT trigger for:

- an ordinary focused coding task with no harness issue;
- a generic refactor unrelated to agent legibility;
- project-management workflow;
- model selection or prompt tuning alone;
- an enterprise governance framework.

Specialist metadata descriptions must name positive triggers and meaningful exclusions to reduce collisions.

## 8. Shared first move

Inspect before asking or creating:

- root tree 1-2 levels;
- git status;
- agent instruction files, including nested files;
- README/contributing/existing docs;
- manifests, workspace/build configs, and CI;
- existing test commands;
- existing issue/feature state;
- representative code only when phase correctness needs it.

Ask only for information that cannot be inferred safely and materially changes the output.

## 9. Phase references

Fallback/router references MUST mirror the cognitive phases exactly:

```text
skills/harness/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── map.md
    ├── specs.md
    ├── features.md
    ├── verify.md
    └── garden.md
```

Do not merge `map` and `specs` into one generic knowledge reference. Each reference states inputs, inspection budget, stopping rule, workflow, mutation boundary, and quality gate.

In modular distribution, each specialist skill remains independently usable. Packaging MUST avoid divergent duplicated rules; implementation must choose one canonical source or generation strategy before release.

## 10. Phase isolation protocol

For each phase:

```text
declare phase and scope
  -> load only the phase reference
  -> inspect phase-specific evidence
  -> produce focused artifacts
  -> validate phase quality gates
  -> summarize outputs/uncertainties
  -> close the concern before the next phase
```

Cross-phase facts may be consumed as inputs, but later phases MUST read completed artifacts instead of re-deriving the same mental model.

Examples:

- specs read completed architecture routes but independently investigate behavior;
- features read accepted specs instead of inferring product rules again;
- verify reads topology/build tools, not feature prose, unless acceptance names required checks;
- garden audits canonical artifacts without silently redefining them.

## 11. Inspection budgets

### Map

Stop when a fresh agent can answer where entry points/modules live, what the main boundaries are, and which doc to read next.

### Specs

Stop when expected behavior, edge cases, and uncertainties are enough to derive implementation/tests without broad reverse-engineering.

### Features

Read requirements/specs and planned work only. Stop when feature outcomes, dependencies, and acceptance are coherent.

### Verify

Read native commands, CI, tool configs, dependency graph, and integration resource constraints. Stop before building a second dependency engine.

### Garden

Start structural/recent/focused; expand semantic sampling only when evidence shows recurring drift.

## 12. Shared output contract

Every invocation reports concisely:

- reused artifacts/capabilities;
- created or changed artifacts;
- intentionally omitted capabilities;
- uncertainty or follow-up decisions;
- verification performed.

Success is not measured by file count.

## 13. Mutation and rerun rules

Every skill MUST:

- inspect existing content and the dirty worktree;
- preserve correct human-authored intent;
- patch focused sections;
- avoid unrelated rewrites;
- keep stable feature IDs/names;
- report ambiguous conflicts instead of forcing consistency.

Rerunning with unchanged evidence SHOULD be a no-op or a semantic minimal diff.

## 14. Forbidden actions

Harness skills MUST NOT:

- generate a full docs tree from a checklist;
- infer architecture only from manifests;
- reverse-engineer an existing app into a fake backlog;
- add a global progress log by default;
- enforce one active feature globally;
- duplicate native build/dependency systems;
- automate semantic judgment with regex;
- auto-install dependencies or mutate production resources;
- broad-refactor code from low-confidence garden findings;
- move to another cognitive phase before validating the current outputs.

## 15. Quality gates

### Shared

- facts are grounded or uncertainty is labeled;
- artifact count is justified;
- links/commands are valid;
- newly created capabilities are discoverable through minimal integration routes;
- truth is not duplicated;
- rerun is safe;
- the common task path stays short.

### Map

- a fresh agent locates entry points and relevant docs quickly;
- observed patterns are not promoted to rules without evidence.

### Specs

- behavior can drive acceptance tests;
- sources/uncertainty are visible;
- implementation detail does not leak unless it is a contract.

### Features

- a planned backlog or persistence need is explicit;
- acceptance is verifiable;
- graph/state is valid;
- array order is not treated as priority or selection order;
- accepted completion exceptions are recorded in feature detail;
- IDs are stable and handoff is concise.

### Verify

- real commands run;
- affected mapping is conservative and bounded in complexity;
- failures propagate;
- the adapter is thin;
- output is compact;
- structural hygiene is composed when relevant.

### Garden

- structural checks are deterministic;
- semantic findings are evidence-based;
- repairs are scoped and verified;
- obsolete artifacts are removed only when safe.

## 16. Implementation rule

Add scripts only for deterministic, repeated tasks where they are cheaper and more reliable than reasoning. Templates are starting points; each skill adapts or omits sections instead of copying placeholders unchanged.
