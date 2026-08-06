# harness-slim

A single skill for making AI coding agents reliable.

Gives any repository the structure agents need to start consistently, stay in scope, verify their work, and resume across sessions — without heavy ceremony.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why this exists

Agents fail not because they lack intelligence, but because they lack structure.

Left alone, a coding agent will try to do too much at once, lose track of what was done between sessions, and silently move on when the codebase is already broken.

The engineers at Anthropic and OpenAI documented these failure modes directly:

- **Anthropic** — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): agents need an initializer to set up a feature checklist and a progress log, then work one feature at a time, always leaving a clean commit.
- **Anthropic** — [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps): separating planner, generator, and evaluator roles; using structured artifacts to hand off context across sessions.
- **OpenAI** — [Harness Engineering](https://openai.com/vi-VN/index/harness-engineering/): foundational insights on environment design, continuous feedback loops, and structure for autonomous AI agents.
- **OpenAI** — [Using PLANS.md for multi-hour problem solving](https://developers.openai.com/cookbook/articles/codex_exec_plans): a written plan with verifiable per-step done conditions turns vague intent into executable, trackable work.

This skill applies those lessons — stripped to the minimum that works across any repo, without forcing heavy ceremony on simple work.

---

## What it creates

Running `create-harness.mjs` in a project produces:

| File | Purpose |
|---|---|
| `AGENTS.md` | Agent instructions: startup workflow, rules, behavioral guidelines, definition of done |
| `feature_index.json` | Minimal feature index: id, title, status, priority, depends_on |
| `features/feat-001.md` | Feature detail file: objective, done criteria, plan, evidence |
| `init.sh` | Health check — `quick` mode (<5s) for startup, `full` mode before marking done |
| `progress.md` | Append-only session log — prepend per session, never edit old blocks |
| `check-state.sh` | Show active/blocked/todo features and progress count |

### Design principles

**One feature at a time.** The biggest agent failure mode: trying to implement everything at once, running out of context midway, leaving a half-implemented mess. `feature_index.json` keeps exactly one feature `active`.

**Two verification modes.** `./init.sh` (quick, type-check only) for startup and mid-session checks. `./init.sh full` (lint + type in parallel, then test) only before marking a feature done. Fast feedback without blocking flow.

**Append-only progress log.** `progress.md` is prepend-only — each session adds a new block at the top, never editing old ones. Eliminates merge conflicts when teammates work on different features in parallel.

**Feature detail on demand.** `feature_index.json` is always loaded (minimal: id, title, status). `features/<id>.md` is loaded only for the active feature (objective, done criteria, plan, evidence). No token waste on irrelevant features.

**Conditional startup workflow.** `AGENTS.md` distinguishes: skip the workflow for questions and lookups; run it only for actual code work. `git log` and `init.sh` are part of the code-work startup, not every conversation.

**Behavioral guidelines baked in.** `AGENTS.md` includes four guidelines that reduce common LLM coding mistakes: think before coding, simplicity first, surgical changes, goal-driven execution.

---

## Five subsystems

Every useful coding-agent harness has five subsystems:

| Subsystem | Artifact | Purpose |
|---|---|---|
| Instructions | `AGENTS.md` | Startup path, rules, definition of done |
| State | `feature_index.json` + `features/<id>.md` | Status index (always loaded) + detail (on demand) |
| Verification | `init.sh` | Quick and full checks the agent runs before claiming done |
| Scope | Done criteria + `depends_on` | Prevents overreach and half-finished work |
| Lifecycle | Append-only `progress.md` + end-of-session routine | Makes the next session restartable |

---

## Install

### Via `npx skills` (harness-slim only)

```bash
npx skills add tungxuan1656/harness-slim --skill harness-slim
```

or

```bass
npx skills add tungxuan1656/harness-slim
```

### Clone for all bundled skills

To get `harness-slim` plus the 10 companion skills in one go, clone the repo and copy the `skills/` folder:

```bash
git clone https://github.com/tungxuan1656/harness-slim /tmp/harness-slim
mkdir -p .agents/skills
cp -R /tmp/harness-slim/skills/* .agents/skills/
```

---

## Use

```bash
# Create a harness in a project
node skills/harness-slim/scripts/create-harness.mjs --target /path/to/project

# Check current harness state
bash skills/harness-slim/scripts/check-state.sh /path/to/project/feature_index.json

# Validate harness structure (five-subsystem score)
node skills/harness-slim/scripts/validate-harness.mjs --target /path/to/project

# HTML assessment report
node skills/harness-slim/scripts/run-benchmark.mjs --target /path/to/project --html report.html
```

Options for `create-harness.mjs`:

| Flag | Description |
|---|---|
| `--target DIR` | Target project directory (default: current dir) |
| `--package-manager npm\|pnpm\|yarn\|bun` | Override auto-detected package manager |
| `--commands "cmd1,cmd2"` | Custom verification commands |
| `--force` | Overwrite existing harness files |

---

## Typical session flow

```
User:  implement the next feature
Agent: [reads feature_index.json, finds active feat]
Agent: [reads features/<id>.md — objective and done criteria]
Agent: [runs ./init.sh — confirms environment is healthy]
Agent: [implements the feature]
Agent: [runs ./init.sh full — lint + type + test]
Agent: [marks done in feature_index.json, records evidence in features/<id>.md]
Agent: [prepends block to progress.md, commits]
```

The agent works one feature at a time and does not move to the next unless instructed.

---

## Requirements

Node.js 20+ is required for the scripts (`create-harness.mjs`, `validate-harness.mjs`). `check-state.sh` and `init.sh` require only bash, grep, and sed — no external dependencies.

---

## Optional companion skills

`harness-slim` is intentionally slim — it works standalone and has no dependencies on the skills below. The companions are optional: pick what fits your workflow.

All skills live in `skills/`. To use any of them, copy the relevant folder into your project's `.agents/skills/` (or wherever your agent tool expects them).

| Skill | What it does | Source |
|---|---|---|
| [`brainstorming`](skills/brainstorming/) | Explore requirements and design before touching code — produces a spec, then hands off to `writing-plans` | [obra/superpowers](https://github.com/obra/superpowers) |
| [`codebase-design`](skills/codebase-design/) | Shared vocabulary for designing deep modules: module, interface, depth, seam, adapter, leverage, locality | [mattpocock/skills](https://github.com/mattpocock/skills) |
| [`writing-plans`](skills/writing-plans/) | Turn a spec into a bite-sized implementation plan with TDD steps, file map, and done criteria | [obra/superpowers](https://github.com/obra/superpowers) |
| [`subagent-driven-development`](skills/subagent-driven-development/) | Execute a plan by dispatching one fresh subagent per task, with per-task review and a final whole-branch review | [obra/superpowers](https://github.com/obra/superpowers) |
| [`executing-plans`](skills/executing-plans/) | Inline plan execution with review checkpoints — fallback when subagents are not available | [obra/superpowers](https://github.com/obra/superpowers) |
| [`systematic-debugging`](skills/systematic-debugging/) | Four-phase debugging: root cause first, pattern analysis, hypothesis testing, then fix — never guess | [obra/superpowers](https://github.com/obra/superpowers) |
| [`verification-before-completion`](skills/verification-before-completion/) | Evidence before claims — run the verification command, read the output, only then declare done | [obra/superpowers](https://github.com/obra/superpowers) |
| [`git-commit`](skills/git-commit/) | Conventional commit messages auto-generated from diff — type, scope, description, safety rules | [github/awesome-copilot](https://github.com/github/awesome-copilot) |
| [`handoff`](skills/handoff/) | Compact the current session into a handoff document so a fresh agent can resume without losing context | [mattpocock/skills](https://github.com/mattpocock/skills) |
| [`find-skills`](skills/find-skills/) | Search and install skills from the open agent skills ecosystem at [skills.sh](https://skills.sh) | [vercel-labs/skills](https://github.com/vercel-labs/skills) |

---

## Acknowledgments

Special thanks to [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering), which served as the original prototype and inspiration for this project.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
