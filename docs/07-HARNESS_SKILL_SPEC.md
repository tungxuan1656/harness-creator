# Harness Skill Architecture

## 1. Purpose

Build, adopt, audit và improve một lightweight repository harness giúp coding agents hiểu code nhanh, giữ scope và nhận feedback đúng mức risk.

Target là repository trung bình, team 1-4 người và feature thường hoàn thành trong một hoặc vài phiên. Skill architecture phải giữ delivery speed, progressive disclosure và existing project conventions.

## 2. Chosen architecture

Preferred distribution khi platform hỗ trợ multiple installed skills:

```text
harness                 # thin router/adoption coordinator
harness-map             # repository cognition and navigation
harness-specs           # product/domain behavior
harness-features        # planned backlog, scope, acceptance, handoff
harness-verify          # feedback interface and orchestration
harness-garden          # structural and semantic maintenance
```

Lý do tách theo cognitive responsibility: reverse-engineering architecture, formalizing product behavior, backlog decomposition, verification design và semantic cleanup cần evidence, stopping rules và quality gates khác nhau.

## 3. Portable fallback

Một số platform không cho router invoke skill khác hoặc user chỉ cài `harness`. Trong profile này, router MAY thực thi cùng workflow references nhưng MUST giữ phase isolation:

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

MUST NOT cùng lúc derive architecture, specs, backlog và verification tooling trong một undifferentiated reasoning pass.

## 4. Router contract - `harness`

Use when user muốn setup, adopt, upgrade hoặc audit tổng thể repository harness.

Router chỉ:

1. inspect root capabilities và current pain point;
2. classify greenfield/existing, topology và installed skill support;
3. choose minimal ordered phases;
4. delegate tới specialized skill khi available;
5. otherwise load exactly one matching workflow reference;
6. require phase-specific quality gate before continuing;
7. run final cross-link/command sanity check;
8. report reused, created và intentionally omitted capabilities.

Router MUST NOT reimplement all specialist details in its core `SKILL.md`.

## 5. Specialist contracts

### `harness-map`

Use when agent khó locate code, understand topology/boundaries hoặc instructions/docs routing yếu.

Owns generation/rerun behavior for:

- root/tool-specific instruction routing;
- architecture overview hoặc existing equivalent;
- docs index;
- conditional subsystem docs.

It inspects topology, real entry points, representative flows/tests và separates observed patterns from intended rules.

### `harness-specs`

Use when product/domain behavior, permissions, state transitions, public contracts hoặc edge cases không thể suy ra an toàn.

Owns generation/rerun behavior for canonical repository-local specs. It records sources/uncertainties and does not treat current code as intended truth automatically.

### `harness-features`

Use when greenfield requirements cần planned repository backlog hoặc work cần persistent scope, dependencies, acceptance hay handoff.

Owns feature schema/index/detail behavior. It MUST distinguish planned project features from ad-hoc one-session tasks and MUST NOT reverse-engineer existing functionality into a fake backlog.

### `harness-verify`

Use when existing commands fragmented, slow, unclear hoặc thiếu stable affected feedback.

Owns `init.sh`/verify helper behavior, reuses native tools, preserves failures and composes garden-owned structural checks when applicable.

### `harness-garden`

Use for audit/cleanup of stale instructions, docs, feature state, verify adapters hoặc recurring bad patterns.

Owns structural maintenance checks và semantic gardening. Structural invariants may gate; semantic findings normally do not.

## 6. Trigger boundaries

Harness skills SHOULD trigger for:

- setup/upgrade repo for coding agents;
- agents repeatedly read wrong modules or violate boundaries;
- durable product behavior needs repository-local truth;
- greenfield backlog or multi-session feature state;
- fast affected verification entry point;
- stale harness/docs/state cleanup;
- migration from `harness-slim`.

They SHOULD NOT trigger for:

- ordinary focused coding task with no harness issue;
- generic refactor unrelated to agent legibility;
- product-management workflow;
- model selection hoặc prompt tuning riêng lẻ;
- enterprise governance framework.

Specialist metadata descriptions must name both positive triggers and meaningful exclusions to reduce collision.

## 7. Shared first move

Inspect before asking or creating:

- root tree 1-2 levels;
- git status;
- agent instruction files, including nested;
- README/contributing/existing docs;
- manifests, workspace/build configs and CI;
- existing test commands;
- existing issue/feature state;
- representative code only when phase correctness needs it.

Ask only for information that cannot be inferred safely and materially changes the output.

## 8. Phase references

The fallback/router skill references MUST mirror cognitive phases exactly:

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

Do not merge `map` and `specs` into one generic knowledge reference. Each reference states inputs, inspection budget, stopping rule, workflow, mutation boundary và quality gate.

In modular distribution, each specialized skill remains independently usable. Packaging MUST avoid divergent duplicated rules; implementation should choose one canonical source/generation strategy before release.

## 9. Phase isolation protocol

For each phase:

```text
declare phase and scope
  -> load only phase reference
  -> inspect phase-specific evidence
  -> produce focused artifacts
  -> validate phase quality gates
  -> summarize outputs/uncertainties
  -> unload/close concern before next phase
```

Cross-phase facts may be consumed as inputs, but later phases MUST read completed artifacts instead of re-deriving the same mental model.

Examples:

- specs read completed architecture routes but independently investigate behavior;
- features read accepted specs instead of inferring product rules again;
- verify reads topology/build tools, not feature prose, unless acceptance names required checks;
- garden audits canonical artifacts without silently redefining them.

## 10. Inspection budgets

### Map

Stop when a fresh agent can answer where entry points/modules live, what the main boundaries are and which doc to read next.

### Specs

Stop when expected behavior, edge cases and uncertainties are enough to derive implementation/tests without broad reverse-engineering.

### Features

Read requirements/specs and planned work only. Stop when feature outcomes, dependencies and acceptance are coherent.

### Verify

Read native commands, CI, tool configs, dependency graph and integration resource constraints. Stop before building a second dependency engine.

### Garden

Start structural/recent/focused; expand semantic sampling only when evidence shows recurring drift.

## 11. Shared output contract

Every invocation reports concisely:

- reused artifacts/capabilities;
- created or changed artifacts;
- intentionally omitted capabilities;
- uncertainty or follow-up decisions;
- verification performed.

Success is not measured by file count.

## 12. Mutation and rerun rules

Every skill MUST:

- inspect existing content and dirty worktree;
- preserve correct human-authored intent;
- patch focused sections;
- avoid unrelated rewrites;
- keep stable feature IDs/names;
- report ambiguous conflict instead of forcing consistency.

Rerun with unchanged evidence SHOULD be a no-op or semantic minimal diff.

## 13. Forbidden actions

Harness skills MUST NOT:

- generate a full docs tree from checklist;
- infer architecture only from manifests;
- reverse-engineer existing app into fake backlog;
- add global progress log by default;
- enforce one active feature globally;
- duplicate native build/dependency systems;
- automate semantic judgment with regex;
- auto-install dependencies or mutate production resources;
- broad-refactor code from low-confidence garden findings;
- move to another cognitive phase before validating current outputs.

## 14. Quality gates

### Shared

- facts grounded or uncertainty labeled;
- artifact count justified;
- links/commands valid;
- no duplicate truth;
- rerun-safe change;
- common task path remains short.

### Map

- fresh agent locates entry points and relevant docs quickly;
- observed pattern is not promoted to rule without evidence.

### Specs

- behavior can drive acceptance tests;
- source/uncertainty visible;
- implementation detail does not leak unless it is a contract.

### Features

- planned backlog or persistence need is explicit;
- acceptance verifiable;
- graph/state valid;
- IDs stable and handoff concise.

### Verify

- real commands run;
- affected mapping conservative and bounded in complexity;
- failures propagate;
- adapter thin;
- output compact;
- structural hygiene composed when relevant.

### Garden

- structural checks deterministic;
- semantic findings evidence-based;
- repair scoped and verified;
- obsolete artifacts removed only when safe.

## 15. Implementation rule

Script chỉ thêm khi deterministic task lặp lại, rẻ hơn và đáng tin hơn reasoning. Templates are starting points; each skill adapts or omits sections instead of copying placeholders unchanged.
