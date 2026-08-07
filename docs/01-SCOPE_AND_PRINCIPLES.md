# Scope and Principles

## 1. Problem

AI coding agents commonly lose effectiveness in four places:

1. **Orientation cost** - the relevant code is hard to locate.
2. **Intent loss** - behavior, boundaries, and conventions are not discoverable.
3. **Execution drift** - the agent exceeds scope or claims completion before verification.
4. **Entropy** - stale docs and bad patterns continue to be copied.

Harness exists to reduce these costs. It is not a project-management framework.

## 2. Priority order

When goals conflict, prefer:

```text
Correctness
  -> fast feedback
  -> low task overhead
  -> resumability
  -> documentation completeness
```

Documentation completeness comes last because more files do not automatically make an agent better.

## 3. Success conditions

A good harness helps an agent:

- find entry points and code ownership quickly;
- read less while making fewer guesses;
- distinguish intended behavior from observed implementation;
- stay within the user request or feature acceptance;
- run checks at the right risk level;
- resume long-running work without rereading the whole repository;
- prevent state and documentation garbage from accumulating.

## 4. Complexity must be earned

Before creating an artifact, ask:

> What concrete failure mode will occur if this artifact does not exist?

| Artifact | Worth creating when |
|---|---|
| Architecture overview | Orientation from code is expensive; the medium-repo target normally meets this bar |
| Subsystem guide | A subsystem pattern or boundary is hard to infer or often implemented incorrectly |
| Product spec | A business rule or edge case cannot be safely inferred |
| Feature state | The project has a planned backlog or work needs dependency, handoff, or persistence |
| Verification helper | Existing tools do not provide a clear agent-facing command |
| Persistent garden report | Cleanup spans sessions or needs separate review |

Missing optional artifacts are better than placeholders or generic prose.

For this corpus's 10k-200k LOC target:

- `AGENTS.md` or an equivalent agent instruction entry point MUST exist;
- an architecture overview (`ARCHITECTURE.md` or an equivalent) SHOULD exist;
- omit the architecture overview only when the repository is genuinely trivial or existing docs already cover topology, entry points, and boundaries.

Subsystem docs, specs, feature state, and helper scripts remain conditional.

## 5. Progressive disclosure

Do not require an agent to read the entire documentation tree before coding.

```text
AGENTS.md
  -> classify the task
  -> focused architecture/subsystem/spec/feature doc when needed
  -> narrow code slice
  -> targeted feedback
```

`AGENTS.md` is a router, not an encyclopedia.

## 6. Flexible work model

Teams of 1-4 need lightweight coordination:

- multiple features MAY be `in_progress`;
- one agent/session SHOULD have one primary task;
- the feature index is not a lock or ownership system;
- branch, worktree, and issue assignment follow repository conventions;
- do not add leases, schedulers, or workflow approvals by default.

## 7. Intended versus observed truth

- Specs and architecture rules describe **intended** behavior and boundaries.
- Code, tests, and runtime evidence describe **observed** implementation.

When they conflict:

```text
collect evidence
  -> classify stale doc / code defect / test defect / incomplete migration / ambiguity
  -> repair the correct layer
```

MUST NOT automatically assume that code or docs are correct.

## 8. Stable interfaces, replaceable implementation

Agent-facing interfaces should be few and stable:

- instruction entry point;
- documentation routes;
- optional feature state;
- verification commands.

The implementation may use Make, Nx, Turbo, Gradle, npm, pytest, shell, Node, or Python according to the repository.

## 9. Non-goals

Harness MUST NOT become:

- a Jira/Linear/GitHub Issues replacement;
- a new build system;
- a universal architecture framework;
- a full repository reverse-engineering report;
- a semantic correctness oracle;
- an enterprise governance or compliance layer;
- a mandatory multi-agent coordination protocol;
- a generator that creates every file in a fixed tree.

## 10. Decision test

Every new rule or artifact must answer:

1. Which observed or likely failure mode does it prevent?
2. Must every task pay its cost?
3. Is there a lighter way to achieve the same result?

If the benefit is unclear, do not add it by default.
