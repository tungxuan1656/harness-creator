# Harness Skills

A dependency-free skill package for AI coding agents. Provides a canonical
workflow harness and task-routing model for Node.js 20+ repositories.

## Skills

### `harness-init`

Scaffolds a canonical harness structure (`manifest.json`, `checks.json`,
`validate.mjs`, `run-checks.mjs`, …) into an existing repository.
Missing-only, dry-run safe. Run by the **user**, not automatically by an agent.

### `task-router`

Routes tasks to Direct, Tracked, or High-risk planned mode. Chooses just
enough record-keeping and verification for the task at hand.

### `brainstorming`

Structured exploration for tasks where the right direction is not yet clear.

### `writing-plans`

Writes an implementation plan for multi-step, multi-session, or high-risk work.

### `executing-plans`

Executes an existing written plan step by step with verification checkpoints.

### `verification-before-completion`

Enforces fresh verification evidence before any completion claim.

### `handoff`

Records unfinished-session state so the next session can resume without re-discovery.

### `prototype`

Builds a throwaway spike when UX flow or domain logic is too uncertain to commit
to production code.

## Installation

### Via `npx skills` (recommended)

```bash
# Install all skills
npx skills add <github-owner>/harness

# Install specific skills only
npx skills add <github-owner>/harness --skill task-router --skill harness-init

# Install globally (available across all projects)
npx skills add <github-owner>/harness -g

# Install to a specific agent
npx skills add <github-owner>/harness -a claude-code
npx skills add <github-owner>/harness -a opencode
```

> Replace `<github-owner>` with the actual GitHub username or org once this
> repo is public.

### Manual installation

Copy or symlink the skill directories into your agent's skill folder.

**OpenCode — user-wide:**

```sh
mkdir -p "$HOME/.config/opencode/skills"
cp -R skills/harness-init "$HOME/.config/opencode/skills/"
cp -R skills/task-router "$HOME/.config/opencode/skills/"
```

**OpenCode — project-local:**

```sh
mkdir -p .opencode/skills
cp -R skills/task-router .opencode/skills/
```

**Claude Code — project-local:**

```sh
mkdir -p .claude/skills
cp -R skills/task-router .claude/skills/
```

## Repository layout

```text
skills/
├── brainstorming/          SKILL.md
├── executing-plans/        SKILL.md
├── handoff/                SKILL.md
├── harness-init/           SKILL.md + scripts/ + templates/ + references/
├── prototype/              SKILL.md
├── task-router/            SKILL.md
├── verification-before-completion/  SKILL.md
└── writing-plans/          SKILL.md
```

## Requirements

- Node.js 20+ (for `harness-init` scripts only; other skills are agent instructions)

## License

[MIT](LICENSE)
