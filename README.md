# Harness

A lightweight family of skills for making coding agents effective in real
repositories without turning every task into project-management ceremony.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> The best harness is small enough that the agent actually follows it.

Harness helps an agent find the right code, recover intended behavior, stay
within scope, verify proportionally, and remove stale repository state. The
default target is a 10k-200k LOC repository maintained by a team of 1-4 people.

## Skill family

The preferred distribution is a thin adoption router plus five independently
usable specialists:

| Skill | Use when |
|---|---|
| `harness-router` | Auditing, adopting, upgrading, or migrating several repository harness capabilities |
| `harness-map` | Agents cannot find entry points, modules, boundaries, or the right documentation |
| `harness-specs` | Durable product or domain behavior is unsafe to infer |
| `harness-features` | Planned work needs a repository backlog, persistent scope, dependencies, acceptance, or handoff |
| `harness-verify` | Native checks are fragmented, unclear, or lack trustworthy affected feedback |
| `harness-garden` | Instructions, docs, feature state, verification artifacts, or recurring patterns have drifted |

Invoke a specialist directly for one focused concern. Use `harness-router` only
when repository-wide adoption or several phases are actually needed.

## Adaptive repository output

Harness creates missing capabilities, not a fixed tree. A typical medium
repository may use:

```text
AGENTS.md
ARCHITECTURE.md             # or an existing equivalent
docs/README.md              # only when several docs need routing
init.sh                     # only when native verification is not clear enough
```

Conditional capabilities include focused subsystem docs, product specs,
`feature_index.json`, `features/*`, verification helpers, and deterministic
garden checks. Existing repository-native docs, commands, and trackers win over
parallel harness artifacts.

The ordinary coding path should remain:

```text
agent instructions
  -> one focused document when needed
  -> relevant code and tests
  -> targeted or affected verification
```

## Install

Install the router for repository-wide adoption:

```bash
npx skills add tungxuan1656/harness-slim --skill harness-router
```

Or install only the specialists needed by your workflow:

```bash
npx skills add tungxuan1656/harness-slim --skill harness-map
npx skills add tungxuan1656/harness-slim --skill harness-specs
npx skills add tungxuan1656/harness-slim --skill harness-features
npx skills add tungxuan1656/harness-slim --skill harness-verify
npx skills add tungxuan1656/harness-slim --skill harness-garden
```

Example prompts:

```text
Use $harness-router to audit this repository and add only the harness capabilities it needs.
Use $harness-map to repair stale repository navigation.
Use $harness-specs to make this permission workflow explicit and testable.
Use $harness-features to turn these accepted requirements into a persistent backlog.
Use $harness-verify to expose trustworthy quick, affected, and full checks.
Use $harness-garden to audit stale feature state and documentation links.
```

## Current design principles

- `AGENTS.md` or an equivalent is a concise router, not an encyclopedia.
- An architecture overview is expected for a typical medium repository unless
  existing documentation already covers topology, entry points, and boundaries.
- Multiple features may be `in_progress`; status is not ownership or a lock.
- Array order, IDs, filenames, and creation time never imply feature priority.
- A global progress log is off by default; concise feature Handoff carries
  multi-session resume state when needed.
- Verification exposes `quick`, `affected`, and `full`; `affected` is the normal
  post-change path and the public interface has no `doctor` mode.
- Garden owns deterministic maintenance invariants; Verify composes their checks
  only when relevant.
- Intended and observed truth remain distinct when docs, code, and tests conflict.

The design source of truth is [docs/README.md](docs/README.md).

## Development and release checks

Each specialist `SKILL.md` is the canonical source for its phase. Router
fallback references are generated so the modular and fallback profiles cannot
silently diverge.

```bash
# Regenerate router fallback references after changing a specialist
node scripts/sync-harness-phases.mjs

# Check packaging, eval coverage, and generated-reference synchronization
node scripts/validate-hybrid-skills.mjs
```

Every router and specialist skill includes an `evals/evals.json` corpus covering
positive and negative triggers, workflow behavior, reruns, and dirty worktrees.
These deterministic checks validate corpus structure; release evaluation must
still execute the scenarios against representative repositories. Pull requests
and pushes that touch the hybrid skills run the deterministic preflight in CI.

## Legacy `harness-slim`

`skills/harness-slim` remains available as a compatibility profile for existing
consumers. It preserves the previous fixed scaffold and should not be treated as
the current hybrid design. New adoption should use `harness-router` and the
focused specialists above. Its legacy generator, validator, requirements, and
usage remain documented in
[skills/harness-slim/README.md](skills/harness-slim/README.md).

Install the legacy profile only when compatibility requires it:

```bash
npx skills add tungxuan1656/harness-slim --skill harness-slim
```

## References

- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Using PLANS.md for multi-hour problem solving](https://developers.openai.com/cookbook/articles/codex_exec_plans)

Inspired in part by [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering).

## License

[MIT](LICENSE)
