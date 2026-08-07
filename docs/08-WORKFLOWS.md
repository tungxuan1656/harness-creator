# Workflows

## 1. Adopt an existing repository

```text
inspect existing instructions/docs/tools/state
  -> identify actual agent pain points
  -> classify missing capabilities
  -> choose minimal workflows
  -> patch/reuse existing artifacts
  -> run relevant verification
  -> report omissions and uncertainties
```

Typical existing repo:

```text
map only if navigation is weak
  -> verify only if commands are fragmented/unclear
  -> specs only for durable ambiguous behavior
  -> features only for planned multi-step work
```

Garden không phải default bootstrap step, nhưng MAY chạy focused structural cleanup nếu adoption phát hiện stale harness artifacts và user requested upgrade/cleanup.

## 2. Near-empty greenfield

```text
requirements
  -> specs for non-trivial behavior
  -> proposed architecture with assumptions
  -> coherent feature slices if work is multi-step
  -> code/tooling scaffold outside harness scope
  -> verification adapter once commands are real
```

Không viết observed maps hoặc runnable commands chưa tồn tại.

## 3. Local task after harness exists

```text
read instruction router
  -> one relevant doc if needed
  -> inspect narrow code/test slice
  -> implement
  -> targeted/affected verify
  -> docs-impact question
```

Docs-impact question:

- behavior contract changed?
- architecture boundary changed?
- recurring subsystem rule changed?
- canonical command changed?

Nếu đều `no`, không update docs.

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

Không tạo persistent feature artifact nếu task dự kiến xong trong một session và scope đã rõ.

## 5. Multi-session feature

At start:

1. identify primary feature from user/task context;
2. read its detail và linked docs;
3. inspect recent code/history needed;
4. run baseline quick/targeted check only if useful.

At stop before completion:

1. leave code in coherent state when feasible;
2. record concise Handoff;
3. update blocker/status only if truth changed;
4. record relevant verification result, not full logs.

At completion:

```text
acceptance satisfied
  -> proportional verification
  -> remove stale Handoff/blocker
  -> mark done
  -> update canonical docs only if impacted
```

## 6. Team concurrency

- Multiple `in_progress` features are allowed.
- User/task assignment determines primary work.
- Agent MUST NOT take over feature merely because it sees status.
- Existing branch/worktree conventions handle code isolation.
- Harness does not add locks or leases.

When collision risk is visible, report it and coordinate through the team’s existing mechanism.

## 7. Verification workflow

During implementation:

- use targeted native tests for tight feedback;
- run `affected` after coherent local change;
- widen for shared contracts/config/public interfaces;
- use `full` according to risk or merge convention.

Do not run full repository checks mechanically after every edit.

## 8. Garden workflow

```text
classify user intent: audit vs cleanup
  -> choose smallest scope
  -> run structural checks
  -> sample semantic evidence if relevant
  -> repair high-confidence scoped issues when authorized
  -> verify changed artifacts/behavior
  -> concise findings and remaining ambiguity
```

Cleanup can finish in one invocation; persistent remediation plans are conditional.

## 9. Failure handling

- Insufficient evidence -> write less and label uncertainty.
- Existing unrelated failures -> baseline/report, do not silently expand scope.
- Conflicting truth -> use conflict protocol, do not normalize automatically.
- Missing optional capability -> omit it and state why if relevant.
- Existing useful custom workflow -> preserve/reuse it.
