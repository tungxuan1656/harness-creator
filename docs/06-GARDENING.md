# Gardening and Entropy Control

## 1. Purpose

Garden is the single maintenance workflow of `harness`. It removes entropy from:

- agent instructions and knowledge docs;
- specs and feature state;
- verification adapters/configuration;
- recurring code patterns likely to be copied by agents.

The current interface uses garden instead of a separate public maintenance mode in verification.

## 2. One workflow, two engines

Garden keeps a technical distinction without forcing users to understand two systems.

### Structural engine

Cheap and deterministic checks:

- invalid feature schema;
- duplicate IDs, missing dependencies, or cycles;
- missing/orphan detail files;
- broken internal links and stale paths;
- missing referenced verification helpers;
- obvious duplicate routing entries;
- completed state with stale Handoff/blocker.

### Reasoning engine

Evidence-based agent audit:

- architecture/spec says A while representative code/tests show B;
- intended dependency direction is violated;
- flow docs are stale after a migration;
- deprecated, bypassed, or duplicated patterns recur;
- an obsolete shim, flag, or API usage has strong evidence of being unused.

Structural results can be deterministic. Semantic results must distinguish proven conflict from suspicion.

**A structural invariant** is deterministic and MAY gate completion/CI. **A semantic finding** requires evidence and confidence and normally MUST NOT gate delivery automatically.

## 3. Triggers

Run garden when:

- the user asks for an audit, cleanup, or repository hygiene;
- stale links/docs/state are already visible;
- a large migration/refactor has just finished;
- several completed features need compaction;
- the same review comment or bad pattern keeps recurring;
- a milestone warrants real maintenance work.

Do not run a full semantic garden by default during every bootstrap or task.

## 4. Scope selection

Garden MUST choose the smallest useful scope:

```text
structural-only
docs/specs
feature state
verification harness
one subsystem
recent changes
repository-wide only when explicitly justified
```

Semantic audits should sample representative modules, recent changes, code paths referenced by docs, and known hotspots before expanding.

## 5. Audit and cleanup semantics

User intent determines mutation level:

- **audit/check/review** -> report findings; do not make broad changes;
- **cleanup/fix** -> repair high-confidence mechanical issues and targeted issues within the stated scope;
- semantic refactor or behavior change -> require evidence and explicit scope; report ambiguity before choosing a source of truth.

A cleanup invocation MAY audit and repair in one turn. Do not force a two-step ceremony for obvious broken links or stale state.

## 6. Finding format

Use only fields that add value:

```text
Severity
Observed
Expected
Evidence
Classification or confidence
Action
```

IDs are needed only when there are many findings, a persistent report, or user-selected repairs.

Optimize for precision. A finding without evidence must be labeled suspicion or omitted.

## 7. Repair policy

Garden MAY repair directly when the user requests cleanup and confidence is high:

- broken links/path renames;
- invalid or stale feature state;
- obsolete empty/duplicate doc sections with a clear canonical home;
- dead generated helpers with no remaining references;
- completed feature artifacts according to the retention policy.

Garden MUST NOT automatically:

- change product behavior to match stale docs;
- broadly rewrite architecture based on an unaccepted dominant pattern;
- refactor the whole repository because of a smell;
- remove compatibility code without proving that consumers are gone;
- fix unrelated test/build failures.

After repair, run verification appropriate to the changed files/behavior.

## 8. Structural tooling

When the target repository enables feature state or has many agent-facing docs/links, garden SHOULD provide a deterministic structural entry point, for example:

```text
scripts/garden/check.*
```

The helper MAY be omitted when the repository has no machine-checkable harness state or native tooling already covers the same invariants.

The script must be:

- deterministic;
- runnable with an available repository runtime;
- compact in output;
- nonzero when a required invariant fails;
- explicit that it does not validate semantic correctness.

Garden owns the invariant/check. Verify composes it into feature completion, affected harness changes, and full verification according to [05-VERIFICATION.md](05-VERIFICATION.md).

## 9. Promotion ladder

When an issue recurs:

```text
one-off finding
  -> durable documented rule
  -> repeatedly violated structural/lint check
  -> high-value required verification gate
```

Do not promote style preferences or low-confidence heuristics into gates.

## 10. Feature and doc garbage collection

Garden SHOULD consider:

- removing stale Handoff/blocker;
- preserving recorded accepted exceptions or moving them to a durable canonical home before compacting/removing detail;
- compacting or removing low-value completed detail first;
- retaining compact `done` index identity to prevent duplicate planning;
- pruning old identity only when the retention policy allows and reliable history exists;
- deleting empty placeholder docs;
- merging duplicate facts into their canonical home;
- removing stale routing rows;
- preserving git/external tracker history instead of creating an archive by default.

Deletion must check references and human-authored durable value.

## 11. Output persistence

By default, output stays in the response/session. Persist a report only when:

- cleanup spans multiple sessions;
- findings need separate human review;
- a milestone needs tracked remediation.

Do not create a permanent garbage catalog by default.

## 12. Completion

Garden is complete when scoped high-confidence issues have been reported or repaired, appropriate checks have run, and the repository is less ambiguous. Finding count and file count are not success metrics.
