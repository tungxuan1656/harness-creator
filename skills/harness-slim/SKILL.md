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

Explain what was created and how to replace placeholder feature entries.

### Check harness state

```bash
bash skills/harness-slim/scripts/check-state.sh /path/to/project/feature_index.json
```

Shows active/blocked/todo features and overall progress. Run before starting a new feat or after marking one done.

### Audit an existing harness

```bash
node skills/harness-slim/scripts/validate-harness.mjs --target /path/to/project
```

Reports five subsystem scores, lowest-scoring area, and first 2–3 changes that would improve reliability.

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

## Design Rules

- Keep `AGENTS.md` short: routing and invariants, not a full manual.
- Put project facts in project docs, not in the skill.
- Make verification commands explicit and runnable.
- Require evidence before marking a feature done.
- Use one active feature unless the harness has explicit multi-agent ownership boundaries.
- Prefer append/prepend state files over relying on chat history.
- Never hide destructive behavior in scripts; overwrites require explicit user approval.
- `init.sh quick` for startup; `init.sh full` only before marking done.

## Deliverable Checklist

For a usable minimal harness, leave the target project with:

- [ ] `AGENTS.md`
- [ ] `feature_index.json`
- [ ] `features/feat-001.md` (at least one feature detail file)
- [ ] `init.sh`
- [ ] `progress.md`
- [ ] `check-state.sh` or equivalent state-check script

If you cannot create files, provide exact file contents and commands instead.
