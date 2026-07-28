# harness-creator

A skill package for AI coding agents. Provides a workflow harness and
task-routing model for Node.js 20+ repositories.

## Skills

| Skill | Purpose |
|---|---|
| `harness-init` | Scaffolds canonical `harness/` structure into an existing repo (run by the user, not the agent) |
| `task-router` | Routes tasks to Direct, Tracked, or High-risk planned mode |
| `brainstorming` | Structured exploration when the right direction is not yet clear |
| `writing-plans` | Writes an implementation plan for multi-step or high-risk work |
| `executing-plans` | Executes an existing plan step by step with verification checkpoints |
| `verification-before-completion` | Enforces fresh evidence before any completion claim |
| `handoff` | Records unfinished-session state so the next session can resume |
| `prototype` | Builds a throwaway spike when UX or logic is too uncertain to commit |

## Installation

### Via `npx skills` (recommended)

```bash
npx skills add tungxuan1656/harness-creator
```

Skills are installed into `.agents/skills/` in the current project by default.
When prompted, select the **Universal (.agents/skills)** option.

To install specific skills only:

```bash
npx skills add tungxuan1656/harness-creator --skill task-router --skill harness-init
```

To install all skills without prompts:

```bash
npx skills add tungxuan1656/harness-creator --all
```

### Manual installation

Copy the skill directories into `.agents/skills/` in your project:

```sh
mkdir -p .agents/skills
cp -R skills/task-router .agents/skills/
cp -R skills/harness-init .agents/skills/
# repeat for other skills as needed
```

Or clone this repo alongside your project and symlink instead:

```sh
mkdir -p .agents/skills
ln -s /path/to/harness-creator/skills/task-router .agents/skills/task-router
ln -s /path/to/harness-creator/skills/harness-init .agents/skills/harness-init
```

## Using harness-init

After installing, the `harness-init` skill is read by the agent as instructions.
The actual scaffolding script is run by the **user** directly:

```sh
node .agents/skills/harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Repository purpose" \
  --verification-command "node --test" \
  --dry-run
```

Remove `--dry-run` to perform the real run. The script is missing-only and never
overwrites existing files.

## Repository layout

```text
skills/
├── brainstorming/
│   └── SKILL.md
├── executing-plans/
│   └── SKILL.md
├── handoff/
│   └── SKILL.md
├── harness-init/
│   ├── SKILL.md
│   ├── references/       # schema, tree, and ExecPlan guides
│   ├── scripts/          # create-harness.mjs
│   └── templates/        # generated files and validators
├── prototype/
│   └── SKILL.md
├── task-router/
│   └── SKILL.md
├── verification-before-completion/
│   └── SKILL.md
└── writing-plans/
    └── SKILL.md
```

## Requirements

Node.js 20+ is required only for the `harness-init` scripts. All other skills
are plain markdown instructions for the agent.

## License

[MIT](LICENSE)
