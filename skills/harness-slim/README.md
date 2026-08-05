# harness-slim

Compact skill for building and auditing harnesses around AI coding agents.

Provides five things agents need: instructions, state, verification, scope boundaries, and lifecycle handoff.

## Install

```bash
npx skills add tungxuan1656/harness-slim --skill harness-slim
```

Or copy `skills/harness-slim/` into your skill path.

## Use

```bash
# Create harness
node skills/harness-slim/scripts/create-harness.mjs --target /path/to/project

# Check harness state
bash skills/harness-slim/scripts/check-state.sh /path/to/project/feature_index.json

# Validate structure
node skills/harness-slim/scripts/validate-harness.mjs --target /path/to/project

# HTML report
node skills/harness-slim/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

Scripts use only Node.js built-ins (plus `check-state.sh` which uses grep/sed only).

## What It Creates

| File | Purpose |
|---|---|
| `AGENTS.md` | Agent instructions: startup, rules, behavioral guidelines, done definition |
| `feature_index.json` | Minimal feature index: id, title, status, priority, depends_on |
| `features/feat-001.md` | Feature detail placeholder: objective, done criteria, plan, evidence |
| `init.sh` | Health check script with `quick` (default) and `full` modes |
| `progress.md` | Append-only session log |
| `check-state.sh` | Show active/blocked/todo features and progress count |

## init.sh modes

```bash
./init.sh        # quick: type-check only, <5s — use at startup
./init.sh full   # full: lint + type (parallel) + test — use before marking done
```

## What validate-harness Checks

Five subsystems scored 1–5:

1. **Instructions** — AGENTS.md has startup workflow, done definition, verification commands
2. **State** — feature_index.json valid, progress.md present, feature detail files exist
3. **Verification** — init.sh present and has quick/full modes
4. **Scope** — one-feature rule, done criteria, depends_on tracked
5. **Lifecycle** — end-of-session procedure, append-only progress log

Score is structural. Does not replace real before/after agent-session testing.

## Status

- [x] Minimal harness scaffolding
- [x] Five-subsystem validation
- [x] HTML assessment report
- [x] Structural benchmark report
- [x] 10 eval cases
- [x] Generic verification detection for common stacks (Node/Python/Go/Rust/Maven/Gradle/.NET)
- [x] check-state.sh for runtime harness state
- [ ] Optional real before/after agent-session replay

## Files

```text
harness-slim/
├── SKILL.md
├── metadata.json
├── agents/openai.yaml
├── scripts/
│   ├── create-harness.mjs
│   ├── validate-harness.mjs
│   ├── render-assessment-html.mjs
│   ├── run-benchmark.mjs
│   ├── check-state.sh
│   └── lib/harness-utils.mjs
├── templates/
│   ├── agents.md
│   ├── feature_index.json
│   ├── features/
│   │   └── feat-001.md
│   ├── init.sh
│   └── progress.md
├── references/
│   ├── context-engineering-pattern.md
│   ├── gotchas.md
│   ├── memory-persistence-pattern.md
│   └── multi-agent-pattern.md
└── evals/evals.json
```

## Boundaries

Harness engineering only. Not for model selection, prompt tuning alone, or app architecture. Keep project-specific facts in the target repository.
