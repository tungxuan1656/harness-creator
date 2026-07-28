# Harness Skills

Harness is a small, dependency-free skill package for OpenCode. It helps teams
create and operate a predictable repository workflow around a canonical
`harness/` tree, JSON contracts, executable checks, feature records, and
evidence-based progress.

## What this repository offers

### `harness-init` v1.0

Creates the canonical harness structure in an existing repository. It is
recon-first and missing-only: it previews changes, avoids overwriting existing
files, and can optionally create a bounded `init.mjs` entry point.

### `task-router` v1.0

Provides the operating rules for orienting in a harness repository, routing
work to Tier 0–3, maintaining the manifest/spec/work sources of truth, and
verifying work without weakening acceptance criteria.

The skills are designed to work together. Use `harness-init` to fill a precise
missing harness gap, then use `task-router` to inspect health and route work.

## Installation for OpenCode

Clone this repository, then run the commands from its root. Choose either a
copy or symlink installation.

### User-wide installation

Copy both skills into the user skill directory:

```sh
mkdir -p "$HOME/.config/opencode/skills"
cp -R skills/harness-init "$HOME/.config/opencode/skills/"
cp -R skills/task-router "$HOME/.config/opencode/skills/"
```

For a checkout that should update the installed skills immediately, use
symlinks instead:

```sh
mkdir -p "$HOME/.config/opencode/skills"
ln -s "$(pwd)/skills/harness-init" "$HOME/.config/opencode/skills/harness-init"
ln -s "$(pwd)/skills/task-router" "$HOME/.config/opencode/skills/task-router"
```

### Project-local installation

To keep the skills with one project, place them under that project's
`.opencode/skills/` directory:

```sh
mkdir -p .opencode/skills
cp -R skills/harness-init .opencode/skills/
cp -R skills/task-router .opencode/skills/
```

Each installed skill is a directory containing its `SKILL.md`. If a destination
already exists, replace or remove that destination intentionally before
reinstalling rather than mixing versions.

## Usage

After installation, ask OpenCode to use a skill by name. Typical requests are:

- “Use `harness-init` to inspect this repository, show a dry run, and create
  only the missing canonical harness files.”
- “Use `task-router` to perform orientation, validate the harness, and route
  this task with its tier, sources, done condition, and verification plan.”

The creator can also be run directly from this checkout:

```sh
node skills/harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Repository purpose" \
  --verification-command "node --test" \
  --dry-run
```

Read the relevant `SKILL.md` before a real run. It defines the required
reconnaissance, safety gates, JSON contracts, and validation behavior.

## Contents and layout

```text
skills/
├── harness-init/
│   ├── SKILL.md
│   ├── references/       # contracts and ExecPlan guidance
│   ├── scripts/          # harness creator
│   └── templates/        # generated files, schemas, and validators
└── task-router/
    └── SKILL.md          # routing and operating rules
```

Generated repositories use this canonical shape:

```text
AGENTS.md
harness/
├── manifest.json
├── checks.json
├── progress.md
├── schemas/
└── scripts/
docs/
├── specs/
├── plans/
└── references/
```

Optional files and directories are created only when they have content or are
needed by the target repository.

## Compatibility

The scripts target Node.js 20 or newer, use dependency-free ESM, and invoke
commands with explicit argument arrays rather than a shell. OpenCode skill
discovery can differ between installations; use the user-wide or project-local
skill directory supported by your OpenCode setup and confirm that the two
skill names are visible before use. This repository intentionally contains no
package-manager manifest or CI workflow.

The inner skill documentation is primarily Vietnamese; file names, commands,
contracts, and generated paths are stable and can be followed independently.

## License

This project is released under the [MIT License](LICENSE). Both skills also
declare MIT licensing in their frontmatter.
