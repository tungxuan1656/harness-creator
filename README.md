# harness-creator

A skill package for AI coding agents. Provides a structured workflow harness
and task-routing model for software repositories.

---

## Why this exists

The best agentic engineering teams have converged on the same insight: **agents
fail not because they lack intelligence, but because they lack structure.**

Left alone, a coding agent will try to do too much at once, lose track of what
was done between sessions, mark things complete without real verification, and
silently move on when the codebase is already broken.

The engineers at Anthropic and OpenAI documented these failure modes directly:

- **Anthropic** — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): agents need an initializer to set up a feature checklist and a progress log, then work one feature at a time, always leaving a clean commit.
- **Anthropic** — [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps): separating planner, generator, and evaluator roles; using structured artifacts to hand off context across sessions.
- **OpenAI** — [Using PLANS.md for multi-hour problem solving](https://developers.openai.com/cookbook/articles/codex_exec_plans): a written plan with verifiable per-step done conditions turns vague intent into executable, trackable work.
- **Steve Krenzel / Logic Inc** — [AI is forcing us to write good code](https://bits.logic.inc/p/ai-is-forcing-us-to-write-good-code): agents need hard guardrails. Tests, 100% coverage, small modules, static typing — these are no longer optional nice-to-haves. They are the rails the agent bounces off to find the right path.

**This package applies those lessons** — but stripped down to the minimum that
is universally useful across any repo, without forcing heavy ceremony on simple
work.

---

## Design philosophy

### 1. One feature at a time

The biggest failure mode Anthropic identified: agents try to implement
everything at once, run out of context midway, and leave a half-implemented
mess that the next session has to untangle. The fix is a feature checklist
(`harness/checks.json`) where each entry starts `passes: false`. The agent
picks the highest-priority unchecked item, implements it completely, verifies
it, sets `passes: true`, commits, then stops.

### 2. Verify before claiming done

Agents reliably mark things as done when they are not. Anthropic found that
explicit end-to-end verification — running the app the way a user would —
was the only reliable gate. This package enforces: **no completion claim
without a fresh, runnable, evidence-backed check.** "The code looks right" is
not verification. A passing test command is.

### 3. Leave a clean state after every session

The next session starts cold, with no memory of what happened. Agents must
leave `harness/progress.md` updated and a clean git commit so the next session
can orient in seconds rather than spending its context budget on archaeology.

### 4. Structured JSON over prose for checklists

Anthropic specifically noted: agents are less likely to inappropriately edit or
overwrite JSON files compared to Markdown. `checks.json` is JSON for this
reason. The `passes` field is the **only** field agents are allowed to change.

### 5. Choose just enough ceremony

Not every task needs a plan. Not every change needs tracking. The `task-router`
skill applies lightweight triage: simple reversible work → no artifacts, just do
it. Multi-session or high-risk work → tracked. Irreversible changes → written
plan with explicit rollback. Ceremony scales to actual risk.

---

## What this package includes

### Workflow foundation

| Skill | Purpose |
|---|---|
| `harness-init` | Scaffolds the canonical `harness/` structure into any existing repo. Run by the **user**, not the agent. |
| `task-router` | Triages tasks and chooses the right working mode: Direct, Tracked, or High-risk planned. |

### Working discipline

| Skill | Purpose |
|---|---|
| `brainstorming` | Structured exploration when direction is unclear or tradeoffs matter. |
| `writing-plans` | Writes a self-contained, executable plan with per-step verifiable done conditions. |
| `executing-plans` | Executes an existing plan step by step with verification checkpoints. |
| `verification-before-completion` | Enforces fresh evidence before any completion claim. |
| `handoff` | Records mid-session state so the next session resumes without re-discovery. |
| `prototype` | Builds a throwaway spike when logic or UX is too uncertain to commit to production code. |

---

## The harness structure

`harness-init` scaffolds this layout into a repo:

```
AGENTS.md               ← agent orientation map: sources of truth, workflow rules
harness/
  manifest.json         ← feature registry and lifecycle status
  checks.json           ← feature checklist (passes: false until verified)
  progress.md           ← running session log
  schemas/              ← JSON schemas for validation
  scripts/
    validate.mjs        ← validates harness contracts
    run-checks.mjs      ← runs registered checks
docs/
  specs/                ← per-feature acceptance specs
  plans/                ← written plans (High-risk mode)
  references/           ← repo-local knowledge docs
```

The key files:

- **`checks.json`** — the single source of what is done and what is not. Each
  check has a `passes` field that starts `false`. Agents set it `true` only
  after verified, end-to-end confirmation. Never delete or edit a check to make
  it pass.

- **`progress.md`** — the session handoff log. Updated at the end of every
  session with what was done, what is in progress, and what comes next.

- **`AGENTS.md`** — the agent map. Tells agents where every source of truth
  lives and what they are and are not allowed to do.

---

## Installation

### Via `npx skills`

```bash
# Install all skills
npx skills add tungxuan1656/harness-creator

# Install specific skills only
npx skills add tungxuan1656/harness-creator --skill task-router --skill harness-init

# Skip prompts
npx skills add tungxuan1656/harness-creator --all
```

Skills install to `.agents/skills/` in the current project by default.
When prompted, select **Universal (.agents/skills)**.

### Manual

```sh
mkdir -p .agents/skills
cp -R path/to/harness-creator/skills/task-router .agents/skills/
cp -R path/to/harness-creator/skills/harness-init .agents/skills/
```

---

## Setting up a repo

Once `harness-init` is installed, run the scaffolding script directly:

```sh
node .agents/skills/harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "What this repo does" \
  --verification-command "npm test" \
  --dry-run
```

Remove `--dry-run` to write files. The script is missing-only — it never
overwrites existing files. Review the dry-run output, then run for real.

After scaffolding:

1. Open `harness/checks.json` and write the feature checklist for your project.
   Each check starts `passes: false`. Add as many as you need — this becomes
   the agent's todo list.
2. Open `AGENTS.md` and confirm the verification command is correct.
3. Commit the initial harness files.

From here, the agent can orient itself, pick the next unchecked feature, and
work.

---

## Typical session flow

With the harness in place, a working session looks like:

```
User: implement the next unchecked feature
Agent: [reads checks.json, picks the first passes: false entry]
Agent: [runs verification command — confirms app is healthy before starting]
Agent: [implements the feature]
Agent: [runs verification command — confirms feature works end-to-end]
Agent: [sets passes: true in checks.json]
Agent: [updates progress.md, commits]
```

The agent does not move to the next feature in the same session unless
explicitly instructed. Clean commit, clean state.

---

## Requirements

Node.js 20+ is required only for the `harness-init` scripts. All other skills
are plain markdown instructions for the agent and have no runtime dependencies.

## License

[MIT](LICENSE)
