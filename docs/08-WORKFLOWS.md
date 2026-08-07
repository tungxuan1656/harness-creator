# Workflows

## 1. Adopt an existing repository

```text
inspect existing instructions/docs/tools/state
  -> identify actual agent pain points
  -> classify missing capabilities
  -> choose the smallest set of phases
  -> patch/reuse existing artifacts
  -> run relevant verification
  -> report omissions and uncertainties
```

Typical existing-repository sequence:

```text
map only if navigation is weak
  -> verify only if commands are fragmented or unclear
  -> specs only for durable ambiguous behavior
  -> features only for planned or persistent work
```

Garden is not a default bootstrap phase, but MAY run focused structural cleanup when adoption finds stale harness artifacts and the user requested cleanup/upgrade.

## 2. Near-empty greenfield

```text
requirements
  -> specs for non-trivial behavior
  -> proposed architecture with explicit assumptions
  -> coherent feature slices when work is multi-step
  -> code/tooling scaffold outside harness scope
  -> verification adapter once commands are real
```

Do not write observed maps or runnable commands that do not exist yet.

## 3. Local task after harness exists

```text
read instruction router
  -> one relevant doc when needed
  -> inspect a narrow code/test slice
  -> implement
  -> targeted/affected verification
  -> docs-impact question
```

Docs-impact questions:

- Did the behavior contract change?
- Did an architecture boundary change?
- Did a recurring subsystem rule change?
- Did the canonical command change?

If all answers are `no`, do not update docs.

## 4. Normal feature

```text
request or existing feature detail
  -> relevant spec/subsystem doc
  -> short ephemeral plan
  -> incremental implementation
  -> targeted checks during iteration
  -> affected verification
  -> acceptance review
```

Do not create persistent feature artifacts when the task should finish in one session and its scope is already clear, unless it belongs to an explicit repository backlog.

## 5. Multi-session feature

At start:

1. identify the primary feature from explicit user/task assignment or the repository's external selection convention; never infer priority from feature index order;
2. read its detail and linked docs;
3. inspect recent code/history as needed;
4. run a baseline quick/targeted check only when useful.

Before stopping:

1. leave code coherent when feasible;
2. record a concise Handoff;
3. update blocker/status only when truth changed;
4. record relevant verification results, not full logs.

At completion:

```text
acceptance reviewed
  -> proportional verification performed
  -> record any accepted exceptions
  -> confirm every acceptance/check is satisfied or covered
  -> remove stale Handoff/blocker
  -> mark done
  -> cheap structural feature/harness check
  -> update canonical docs only if impacted
```

Do not claim completion if the structural check after the state update fails.

## 6. Team concurrency

- Multiple `in_progress` features are allowed.
- User/task assignment determines primary work.
- Dependencies determine eligibility, not priority; array order does not select the next feature.
- An agent MUST NOT take over a feature merely because it sees the status.
- Existing branch/worktree conventions handle code isolation.
- Harness does not add locks or leases.

When collision risk is visible, report it and coordinate through the team's existing mechanism.

## 7. Verification workflow

During implementation:

- use targeted native tests for tight feedback;
- run `affected` after a coherent local change;
- include the garden-owned structural check when harness/docs/feature state changed;
- widen for shared contracts/config/public interfaces;
- use `full` according to risk or merge convention.

Do not run full repository checks mechanically after every edit.

## 8. Garden workflow

```text
classify user intent: audit vs cleanup
  -> choose the smallest scope
  -> run structural checks
  -> sample semantic evidence when relevant
  -> repair high-confidence scoped issues when authorized
  -> verify changed artifacts/behavior
  -> report findings and remaining ambiguity concisely
```

Cleanup can finish in one invocation; persistent remediation plans are conditional.

## 9. Failure handling

- Insufficient evidence -> write less and label uncertainty.
- Existing unrelated failures -> baseline/report; do not silently expand scope.
- Conflicting truth -> use the conflict protocol; do not normalize automatically.
- Missing optional capability -> omit it and state why when relevant.
- Existing useful custom workflow -> preserve and reuse it.
