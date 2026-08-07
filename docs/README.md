# Harness Design Corpus

## Purpose

This corpus is the design source of truth for the `harness-*` skill family, with `harness` as the entry point. The skills help AI coding agents establish or improve a working framework across different repositories.

Default target:

- projects around 10k-200k LOC;
- teams of 1-4 people;
- one or a few agents working with humans;
- features usually completed in one or a few sessions;
- delivery speed and feedback matter more than heavy governance.

## Goal

Harness should help an agent:

```text
Find quickly
  -> Understand enough
  -> Change within scope
  -> Verify at the right risk level
  -> Leave a clean state
```

An ordinary local task should ideally need only:

```text
AGENTS.md
  -> one relevant doc when needed
  -> relevant code/tests
  -> targeted or affected verification
```

Do not require a feature file, persistent plan, progress log, or full suite for a small task unless it creates real value.

## Hybrid skill architecture

When the platform supports multiple installed skills, use a thin router and focused specialists:

```text
harness
├── harness-map
├── harness-specs
├── harness-features
├── harness-verify
└── harness-garden
```

| Skill/phase | Use when | Typical artifacts |
|---|---|---|
| `harness` | Adopt/upgrade and choose phases | Capability audit, ordered execution |
| `harness-map` | Agents cannot find code or understand boundaries | `AGENTS.md`, architecture/subsystem docs |
| `harness-specs` | Product/domain behavior is unsafe to infer | Canonical repository-local specs |
| `harness-features` | The project/work needs a persistent backlog | `feature_index.json`, `features/*` |
| `harness-verify` | A clear feedback loop is missing | `init.sh`, `scripts/verify/*` when needed |
| `harness-garden` | Stale docs/state/code patterns need cleanup | Structural scan, semantic audit, targeted repair |

If the platform cannot compose multiple skills, `harness` uses the same workflow references but MUST run phases independently: inspect, produce, validate, and close one phase before changing concerns.

## Canonical documents

1. `01-SCOPE_AND_PRINCIPLES.md` - scope, priorities, and non-goals.
2. `02-TARGET_HARNESS.md` - target-repository artifact architecture.
3. `03-KNOWLEDGE_AND_OWNERSHIP.md` - progressive disclosure, truth, and mutation rules.
4. `04-WORK_AND_FEATURE_MODEL.md` - task classes, feature state, and handoff.
5. `05-VERIFICATION.md` - `init.sh` adapter and verification contract.
6. `06-GARDENING.md` - structural, semantic, and cleanup workflow.
7. `07-HARNESS_SKILL_SPEC.md` - hybrid skill architecture and phase contracts.
8. `08-WORKFLOWS.md` - end-to-end flows.
9. `09-EVALS_AND_MIGRATION.md` - quality gates, evals, and migration.
10. `10-DESIGN_DECISIONS.md` - accepted decisions and short rationale.

Templates in `templates/` are starting points, not a mandatory scaffold.

## Normative language

- **MUST**: required for correctness or to avoid a major failure mode.
- **SHOULD**: the default, but may be skipped with repository evidence.
- **MAY**: optional.
- **MUST NOT**: likely to cause drift, false confidence, or significant overhead.

## References

- OpenAI, Harness engineering: https://openai.com/index/harness-engineering/
- Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic, Harness design for long-running application development: https://www.anthropic.com/engineering/harness-design-long-running-apps
- matklad, ARCHITECTURE.md: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html

These sources provide design hypotheses. The skill's effectiveness still needs evaluation on representative repositories and tasks.
