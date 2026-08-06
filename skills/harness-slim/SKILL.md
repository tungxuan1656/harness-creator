---
name: harness-slim
description: >-
  Build, audit, and improve harnesses that make AI coding agents reliable: AGENTS.md
  instruction files, feature/state tracking, verification gates, scope boundaries, session
  handoff, memory persistence, context budgets, and multi-agent coordination.
  Use whenever a coding agent forgets context, drifts out of scope, claims "done" before
  tests pass, or starts each session inconsistently — or when creating AGENTS.md,
  feature_index.json, features/<id>.md, init.sh, or progress.md.
  Reach for it even if the user never says the word "harness."
license: MIT
---

# Harness Slim

Make a repository easier for coding agents to start, stay in scope, verify work, and resume across sessions. Keep the harness small enough that agents actually follow it.

Not for model selection, prompt tuning in isolation, chat UI design, or general app architecture.

## Core Model

Every useful coding-agent harness has five subsystems:

| Subsystem | Minimal artifact | Purpose |
|---|---|---|
| Instructions | `AGENTS.md` | Startup path, working rules, definition of done |
| State | `feature_index.json` + `features/<id>.md` | Current feature status (index) and detail (per-file) |
| Verification | `init.sh` | Quick and full checks the agent runs before claiming done |
| Scope | Feature done criteria and depends_on | Prevents overreach and half-finished work |
| Lifecycle | Append-only `progress.md`, end-of-session routine | Makes the next session restartable |

## First Move

1. Inspect what already exists: instruction files, feature/state files, verification commands, docs, package manifests.
2. Ask only for missing context that cannot be inferred: target agent, tolerance for structure, whether overwriting is allowed.
3. Prefer a minimal harness first. Add memory, multi-agent, or benchmark details only when the problem calls for them.

## Common Tasks

### Create a harness

```bash
node skills/harness-slim/scripts/create-harness.mjs --target /path/to/project
```

Options:
- `--package-manager npm|pnpm|yarn|bun` when detection is wrong.
- `--commands "cmd one,cmd two"` for custom verification.
- `--force` only after confirming overwrites are acceptable.

Explain what was created and how to replace placeholder feature entries. Then inspect the repository using the [Repository Knowledge Architecture](references/repository-knowledge-architecture.md) rubric: keep `docs/README.md` as the map and create only the durable project documents supported by evidence.

### Check harness state

```bash
# Run from the generated project root
./scripts/check-state.sh feature_index.json
```

Uses Bash and `jq` to validate `feature_index.json`, then shows active, blocked, todo, and overall progress. It checks required fields, IDs, dependencies, the at-most-one-active invariant, dependency order, and the active detail file. It exits nonzero on failures. A fresh harness is idle; the agent must not promote todo work without instruction.

### Audit an existing harness

```bash
node skills/harness-slim/scripts/validate-harness.mjs --target /path/to/project
```

Reports a heuristic five-subsystem score, lowest-scoring area, and first 2–3
changes that would improve reliability. Hard state/file gates are evaluated
separately; a failed gate makes validation fail regardless of the score.

### Produce a report

```bash
node skills/harness-slim/scripts/render-assessment-html.mjs --target /path/to/project
node skills/harness-slim/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

Structural benchmark only. Real effectiveness needs before/after agent sessions on representative tasks.

## When to Read References

Load only the reference needed for the problem:

- Memory across sessions: [Memory Persistence](references/memory-persistence-pattern.md)
- Context budget and progressive disclosure: [Context Engineering](references/context-engineering-pattern.md)
- Delegation and parallel agents: [Multi-Agent Coordination](references/multi-agent-pattern.md)
- Non-obvious failure modes: [Gotchas](references/gotchas.md)
- Optional, only when an initializer is assessing recurring repository knowledge or documentation needs: [Repository Knowledge Architecture](references/repository-knowledge-architecture.md)

## Design Rules

- Keep `AGENTS.md` concise: include the routing and invariants every coding task needs, without turning it into a project manual.
- Follow the target repository's Markdown style; do not hard-wrap prose automatically.
- Put project facts in project docs, not in the skill.
- Keep `docs/README.md` as the documentation map. Create only the smallest evidence-grounded set of project documents, list every created document there, and load details on demand.
- Do not claim that the generator inferred project-specific architecture or conventions; it only detects supported stack and verification signals.
- Make verification commands explicit and runnable.
- Require evidence before marking a feature done.
- Use at most one active feature; zero active features is valid during an idle bootstrap. Do not promote todo work without instruction.
- Prefer append/prepend state files over relying on chat history.
- Never hide destructive behavior in scripts; overwrites require explicit user approval.
- `init.sh quick` runs available fast/static checks for startup; `init.sh full`
  runs configured lint, static/type, and test checks before marking done.
  Configured command failures fail the script. Missing commands are warnings or
  not applicable and do not fail it.
- Record baseline failures. If a failure blocks the requested work, stop and ask;
  repair it only when authorized or within the selected scope.
- Do not impose a universal commit policy; follow the target repository's convention.

## Deliverable Checklist

For a usable minimal harness, leave the target project with:

- [ ] `AGENTS.md`
- [ ] `feature_index.json`
- [ ] `features/feat-001.md` (at least one feature detail file)
- [ ] `init.sh`
- [ ] `progress.md`
- [ ] `docs/README.md`
- [ ] `scripts/check-state.sh`

If you cannot create files, provide exact file contents and commands instead.

## Runtime requirement

Node.js 20+ is required for the skill's generator, validator, and report scripts. Generated projects require Bash and `jq` for `scripts/check-state.sh`; `init.sh` also requires the detected project's verification tools.

The generator always creates the `docs/README.md` map but no specialized documentation. Use the [optional architecture template](templates/architecture.md), or create another document type, only when inspection shows that durable knowledge is repeatedly needed and cannot be inferred reliably from code.
