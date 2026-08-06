# harness-slim

A compact skill for making AI coding agents reliable across long-running work.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> The best harness is small enough that the agent actually follows it.

`harness-slim` gives a repository enough structure for agents to start consistently, stay in scope, verify their work, and resume across sessions without turning project management into a framework.

## What it creates

```text
AGENTS.md
feature_index.json
features/feat-001.md
init.sh
progress.md
docs/README.md
scripts/check-state.sh
```

| Artifact | Purpose |
|---|---|
| `AGENTS.md` | Concise workflow, invariants, verification, and routing to project knowledge |
| `feature_index.json` | Small status index with at most one active feature |
| `features/<id>.md` | Objective, scope, done criteria, plan, and evidence for one feature |
| `init.sh` | Quick startup checks and full verification |
| `progress.md` | Append-only handoff between sessions |
| `docs/README.md` | Map of durable project knowledge |
| `scripts/check-state.sh` | Bash + `jq` validation and state summary |

A fresh harness starts idle. The agent does not activate todo work without instruction.

## Project documentation

The generator creates only `docs/README.md`. The initializer agent inspects the repository and selects the smallest useful documentation set for its size, risk, and recurring knowledge needs.

```text
docs/
├── README.md                 # documentation map
├── architecture.md           # boundaries, dependencies, invariants
├── design-decisions/         # durable decisions and consequences
├── product-specs/            # stable behavior and domain rules
├── references/               # external APIs, protocols, domain sources
├── generated/                # documentation derived from code or schemas
├── security.md               # trust boundaries and controls
└── reliability.md            # failure modes, recovery, operations
```

This is a menu, not a required scaffold:

- Small projects may need only `docs/README.md`.
- Growing projects may add architecture, decisions, or domain specifications.
- Large or regulated projects may add security, reliability, generated references, and deeper specifications.

Never create empty documents to match the tree. Follow existing repository conventions and link existing sources of truth instead of duplicating them.

## Install

```bash
npx skills add tungxuan1656/harness-slim --skill harness-slim
```

The repository also includes optional companion skills under [`skills/`](skills/).

## Usage

```bash
# Create a harness
node skills/harness-slim/scripts/create-harness.mjs --target /path/to/project

# Check state from the generated project root
./scripts/check-state.sh feature_index.json

# Audit the harness
node skills/harness-slim/scripts/validate-harness.mjs --target /path/to/project
```

Generator options:

| Flag | Description |
|---|---|
| `--target DIR` | Target project directory; defaults to the current directory |
| `--package-manager npm\|pnpm\|yarn\|bun` | Override package-manager detection |
| `--commands "cmd1,cmd2"` | Use custom verification commands |
| `--force` | Overwrite existing harness files |

## Requirements

- Node.js 20+ for the skill's generator, validator, and reports.
- Bash and `jq` for generated state checks.
- Project-specific tools used by `init.sh`.

## Design principles

- At most one active feature; zero means idle.
- Load feature and project details only when relevant.
- Record verification evidence before marking work done.
- Keep progress append-only and restartable.
- Keep `AGENTS.md` concise and `docs/README.md` authoritative.
- Create documentation only from inspected evidence.

## References

- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Using PLANS.md for multi-hour problem solving](https://developers.openai.com/cookbook/articles/codex_exec_plans)

Inspired in part by [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
