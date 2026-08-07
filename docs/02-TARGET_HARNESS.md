# Target Harness Architecture

## 1. Capability model

The target repository has five capabilities, not five mandatory processes:

```text
NAVIGATE -> UNDERSTAND -> FOCUS -> VERIFY -> MAINTAIN
```

| Capability | Question |
|---|---|
| Navigate | What should I read, and where should I edit? |
| Understand | Which boundaries, behaviors, and conventions matter? |
| Focus | What is the current task, and what counts as done? |
| Verify | What evidence is sufficient for this change? |
| Maintain | Are docs, state, and patterns drifting? |

## 2. Adaptive artifact set

A typical medium repository has an instruction entry point and an architecture overview; a verification adapter appears only when native commands are not clear enough:

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── docs/
│   └── README.md
└── init.sh                 # conditional adapter
```

Add these only when needed:

```text
docs/<SUBSYSTEM>.md         # subsystem complexity or distinct conventions
docs/specs/*                # product/domain behavior
feature_index.json          # planned backlog or persistent work
features/*                  # scope, acceptance, and handoff
scripts/garden/*            # recurring deterministic maintenance checks
scripts/verify/*            # complex verification orchestration
```

There is no universal target tree.

## 3. Minimal profiles

### Small or already well-structured repository

```text
AGENTS.md
existing docs and build commands
```

Do not create wrappers or docs when an existing interface is clear and agent-friendly.

### Typical medium repository

```text
AGENTS.md
ARCHITECTURE.md or an existing equivalent
docs/README.md when several docs need routing
init.sh or an existing stable verification command
```

`AGENTS.md` or an equivalent is a required capability. An architecture overview SHOULD exist for the medium-repository target unless the repository is trivial or existing docs already serve that purpose.

### Domain-heavy or multi-session work

Add focused specs and feature state. Do not enable them for every task.

## 4. Planes of truth

| Plane | Canonical artifacts | Purpose |
|---|---|---|
| Knowledge | instructions, architecture, subsystem docs, specs | What the system is and how it should behave |
| Execution | feature index/detail, handoff | What is being built and what remains |
| Feedback | tests, native build tools, `init.sh`, CI | Whether a change is valid |
| Maintenance | garden checks/findings | Whether truth and implementation are drifting |

Do not put every kind of truth into one large manifest.

## 5. Agent instruction entry point

The skill MUST inspect instruction mechanisms already used by the repository:

- `AGENTS.md`, including nested files;
- `CLAUDE.md`;
- `.github/copilot-instructions.md`;
- Cursor or other tool-specific rules;
- existing contributor instructions.

Prefer one canonical rule home. A tool-specific file SHOULD route to canonical content instead of copying every rule. Do not rewrite nested instruction files outside scope.

## 6. Existing artifacts win

Names in this corpus are defaults, not reasons to duplicate:

- a good existing architecture doc can replace `ARCHITECTURE.md`;
- an existing `make check` can replace most of `init.sh`;
- an existing issue tracker can replace the feature index for short tasks;
- existing product specs must be reused and routed.

Create missing capabilities, not a parallel ecosystem.

## 7. Greenfield versus existing repository

### Empty or near-empty greenfield

Observed architecture cannot be written from code that does not exist yet.

```text
requirements
  -> product/domain specs when needed
  -> proposed architecture with explicit assumptions
  -> initial feature slices
  -> code scaffold
  -> verification adapter when real commands exist
```

### Existing repository

```text
inspect existing truth
  -> map representative code
  -> reuse verification
  -> fill only durable knowledge gaps
  -> track only planned/current work
```

MUST NOT reverse-engineer all existing functionality into a backlog.

## 8. Proposed versus observed documentation

Architecture/spec content should distinguish when relevant:

- **Observed** - supported by code, tests, or runtime evidence.
- **Intended** - sourced from a user requirement, accepted decision, or canonical spec.
- **Proposed** - not yet proven by implementation.
- **Uncertain** - requires a decision or more evidence.

Do not turn a dominant code pattern into a mandatory rule without evidence that it is intended.

## 9. Stable lifecycle

Harness changes incrementally:

```text
inspect existing
  -> preserve correct content
  -> update stale facts in scope
  -> add missing capability
  -> remove obsolete artifact when safe
```

Rerun MUST NOT reset IDs, rewrite unrelated prose, or overwrite human decisions just to make output uniform.
