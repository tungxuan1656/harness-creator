# Work and Feature Model

## 1. Task classes

### Class A - Local task

Examples: a small bug, focused refactor, one config change, or a test change.

```text
instructions
  -> focused code/test
  -> implement
  -> targeted/affected verification
```

MUST NOT require a feature file, persistent plan, or progress log.

### Class B - Normal feature, usually one session

```text
instructions
  -> relevant spec/doc
  -> short ephemeral plan
  -> implement
  -> affected verification
  -> update existing feature state when present
```

The plan may stay in the conversation.

### Class C - Multi-session or cross-subsystem feature

```text
feature detail
  -> scoped steps
  -> incremental work
  -> proportional verification
  -> concise handoff when stopping
```

Persistent feature state earns its cost when resume cost is real.

### Class D - Large migration

An execution plan MAY be used for long-lived decisions, rollout, or checkpoints. It is an exception, not the default feature format.

## 2. When feature state is justified

Create `feature_index.json` and `features/*` when at least one is true:

- the project has an explicit repository-native planned backlog, especially after greenfield requirements/spec decomposition;
- work spans multiple sessions;
- execution dependencies exist;
- several people/agents need to see current scope;
- acceptance is too large for chat history to be reliable;
- resume cost has become a problem.

A planned feature MAY be tracked even when that individual feature is expected to finish in one session. In that case the backlog is project memory, not only session memory.

```text
Ad-hoc one-session task
  -> no feature artifact required

Planned feature in a repository-native backlog
  -> MAY be tracked even when execution takes one session
```

Do not create a repository backlog merely because the harness has a template or an external tracker already provides complete execution context.

## 3. Execution index

The index stores planned/current execution truth and MAY retain compact identities for completed features:

- `id`;
- `title`;
- `status`;
- `depends_on`;
- `detail`;
- optional `specs` and `external_ref`.

Do not add sprints, estimates, deadlines, comments, or full assignee workflow by default.

Array position has no priority, rank, or execution-order semantics.

## 4. Feature selection

Feature selection is external or user-driven in v1:

1. use an explicit user/task assignment when present;
2. otherwise follow the repository's existing external tracker, queue, or team convention;
3. otherwise report the eligible candidates and request selection.

A feature is eligible when it is `todo` and all `depends_on` features are `done`. Dependencies constrain execution eligibility; they do not rank or choose between eligible features.

Agents MUST NOT infer priority from array order, ID order, creation time, or file naming. The index has no canonical "next feature" when multiple candidates are eligible.

Add a rank/priority field only if evaluation shows that autonomous next-work selection provides enough recurring value to justify the extra policy and maintenance cost.

## 5. Status semantics

| Status | Meaning |
|---|---|
| `todo` | Intent and acceptance are clear; work has not started |
| `in_progress` | Work is actually underway |
| `blocked` | Progress is prevented by a concrete dependency, decision, or resource |
| `done` | Every acceptance and required verification item is satisfied or covered by a recorded accepted exception |

Multiple `in_progress` features MAY exist. Status is not a lock and does not grant ownership to an agent.

## 6. Feature detail

Required for a tracked feature:

- Goal;
- Scope;
- Acceptance;
- Relevant docs/specs;
- Verification.

Conditional:

- Non-goals when scope can drift;
- Accepted exceptions when completion intentionally leaves an acceptance or verification item unmet;
- Handoff when work stops before completion;
- Blocker details when status is `blocked`.

Do not duplicate status when the index is canonical.

## 7. Acceptance quality

Acceptance MUST be observable or verifiable.

Good:

> An invalid refresh token returns 401 and does not create a session.

Bad:

> Authentication is implemented cleanly.

A feature is `done` only when every acceptance and required verification item is either satisfied or explicitly covered by an accepted exception:

```text
each acceptance outcome -> satisfied | covered by an accepted exception
each required check     -> passed    | covered by an accepted exception
accepted exceptions     -> recorded in feature detail
```

The optional `Accepted exceptions` section in the feature detail is the canonical home for completion exceptions. Each entry MUST identify the unmet acceptance or verification item, why completion is still accepted, who or what accepted it, and a follow-up reference when relevant. Absence of the section means no completion exception is recorded.

Example:

```markdown
- Safari 15 compatibility - accepted by ADR-014; deferred to `feat-031`.
```

Accepted exceptions do not belong in `feature_index.json`; the index remains a compact execution summary.

## 8. Dependencies

A dependency must be a real execution dependency, not merely “related”. Structural validation SHOULD check:

- unique IDs and detail paths;
- referenced features exist;
- no self-dependency or cycle;
- paths stay inside expected repository areas;
- detail/spec files exist;
- basic status consistency.

JSON Schema validates shape; the garden structural scan validates cross-record and file invariants.

## 9. Handoff

Handoff records only state needed to resume:

```text
Done
Remaining
Blocker
Next
```

Do not write a diary, full command logs, or history already available in git.

When a feature completes, remove stale Handoff content or keep only a very short completion note if it still has durable value.

## 10. Completed feature retention

`done` should not preserve detail/Handoff garbage forever, but compact feature identity helps prevent duplicate planning.

Default for a small team:

- remove stale Handoff/blocker on completion;
- treat recorded accepted exceptions as durable value: retain the detail while they remain relevant, or move them to a canonical decision/spec/follow-up before deleting it;
- compact or remove low-value detail first;
- retain a compact index entry long enough for agents to know the feature existed and was completed;
- prune old done identity only after a milestone/release, or when the index is genuinely large and reliable git/external history exists;
- do not create `features/archive/` by default.

The repository MAY choose another retention policy, but it should be explicit and prevent unbounded index growth.

## 11. External tracker

The external tracker remains the source for team management. `external_ref` MAY link a related issue.

The feature index must not mirror tracker metadata. If the external tracker already provides enough scope, acceptance, and handoff for the agent in its working context, a second index is unnecessary.

## 12. Global progress log

Default off.

Add one only when feature Handoff and git history remain insufficient for long-running autonomous work or operations do not map to features. Keep it short; it must not become a daily diary.
