# Garden Fallback Phase

Use this reference only when `harness-garden` cannot be composed. Keep
maintenance isolated until its gates pass, then return to the router.

## Inputs and Preconditions

Require:

- explicit audit/review or cleanup/fix intent;
- the smallest useful scope and user mutation authority;
- the original git status and completed canonical artifacts from prior phases;
- a concrete drift signal, migration need, recurring failure, or maintenance
  pain point.

Treat audit, check, and review as read-only. Treat cleanup or fix as authority
for high-confidence mechanical and targeted repairs within scope. Require
explicit scope and evidence before semantic code refactoring or behavior
change.

Own fallback generation and rerun behavior for deterministic harness/docs/state
checks, evidence-based semantic audits, conditional `scripts/garden/check.*` or
existing equivalents, scoped findings, authorized repairs, and safe migration
of valuable legacy maintenance checks.

Garden owns structural invariants. Verify owns their lifecycle composition.
Patch an existing explicit hook only when mechanical and unambiguous; otherwise
report a verify follow-up.

## Inspection Budget

Choose one initial scope:

```text
structural-only
docs/specs
feature state
verification harness
one subsystem
recent changes
repository-wide only when explicitly justified
```

Inspect only relevant instruction routes, canonical docs/specs/decisions,
feature state and retention policy, verification hooks, existing checks,
representative code/tests, available runtimes, and history needed to prove a
migration or deletion. Start with cheap structural checks. For semantic work,
sample recent changes, documented paths, representative modules, tests, and
known hotspots before expanding.

Treat code/tests/runtime as observed evidence and accepted requirements,
decisions, specs, or architecture rules as intended evidence. Do not assume
newer code or older docs are authoritative by age alone.

Stop when scoped invariants have been checked, representative evidence supports
or rejects the concern, high-confidence authorized repairs are verified, and
remaining questions require a product, architecture, compatibility, or scope
decision. Do not maximize coverage or finding count.

## Separate the Engines

Keep structural and semantic work distinct:

| Engine | Standard | Delivery effect |
|---|---|---|
| Structural | Deterministic and locally reproducible | May fail an applicable maintenance or verification gate |
| Semantic | Evidence-based interpretation with honest confidence | Normally report; do not gate automatically |

Check only deterministic invariants such as malformed feature state, duplicate
IDs or paths, missing/cyclic dependencies, escaping references, declared
orphan rules, reliable broken links, missing helpers, obvious duplicate routes,
done state with stale Handoff/blocker, and accepted generated/config rules.

Honor optional capabilities. Their absence is not a failure unless the
repository declares them required. Do not encode product meaning, architecture
intent, prose freshness, code quality, guessed ownership, or deprecation safety
as structural regex rules.

For semantic concerns, state observed behavior, locate the expected condition
and authority, record stable evidence, sample occurrences and counterexamples,
classify only what evidence supports, and label confidence. Do not prove dead
code from text search alone when generated, reflective, public, data, or
external consumers may exist.

## Workflow

1. Declare audit versus cleanup, the smallest scope, and mutation/safety limits.
2. Inspect canonical artifacts, current git state, existing checks, relevant
   history, and representative semantic evidence.
3. Run existing structural checks and inspect their contract; distinguish a
   passing run from incomplete coverage.
4. Record structural failures separately from semantic findings.
5. Report a finding using only useful fields:

   ```text
   Severity
   Observed
   Expected
   Evidence
   Classification or confidence
   Action
   ```

6. Decide to report, repair, create or extend a check, migrate legacy tooling,
   or make no change.
7. Repair only high-confidence authorized issues in their canonical homes, such
   as proven path changes, invalid state, stale completed Handoff, duplicate
   sections with a clear owner, stale routes, dead generated helpers, or
   retention-policy cleanup.
8. Before deletion, search consumers, identify durable human value, move
   accepted exceptions or decisions to an accepted home, update routes first,
   preserve compatibility when external consumers remain plausible, and
   confirm reliable history.
9. Test executable tooling with disposable fixtures and run verification
   proportional to changed docs, state, scripts, commands, or behavior.
10. Review links, schemas, paths, command references, deletions, false gates,
    duplicated truth, and the final diff.
11. Rerun the relevant structural path and confirm unchanged evidence produces
    no semantic diff.

Keep reports in the response by default. Persist only for multi-session cleanup,
separate human review, or milestone remediation.

## Structural Tooling

Create or extend a reusable checker only when machine-checkable harness state,
many recurring agent-facing links, or a repeatedly valuable invariant earns
it. Reuse native lint/schema/link tooling first. Use an already available
runtime and dependency set.

Make a checker deterministic, compact, read-only, explicit about optional
skips, nonzero on required failure, safe with paths and invocation locations,
and explicit that it does not validate semantic correctness. Test clean pass,
each material failure class, invalid input, optional absence, documented
working directories, path edge cases, repeat determinism, failure propagation,
and non-mutation.

When a canonical schema or accepted validator exists, implement its exact
accepted and rejected value space. Do not narrow valid IDs, statuses, paths, or
optional fields to a preferred style. Include a boundary fixture for any value
class that a new checker could accidentally reject.

Do not add a runtime, package, lockfile, network dependency, universal stack
guesser, or regex semantic oracle solely for maintenance.

## Legacy Migration Rules

When migrating `harness-slim` maintenance:

- preserve valuable project-specific checks while dropping obsolete global
  one-active, priority, Bash-plus-`jq`, diary, and fixed-tree assumptions only
  after their owning feature semantics are migrated;
- report a features prerequisite instead of changing canonical feature schema
  in garden;
- preserve active progress in feature Handoff or another accepted home before
  removing a global log;
- update every instruction, verification, and CI consumer before removing a
  checker path;
- report a verify follow-up for public `doctor` removal or mode redesign when
  no mechanical migration is safe;
- keep compatibility delegates only while real consumers require them.

## Mutation Boundary

- Keep audit mode read-only.
- Limit cleanup writes to maintenance tooling, conditionally persisted reports,
  and evidenced repairs in declared scope.
- Preserve human intent, accepted exceptions, compatibility, repository
  conventions, and unrelated work.
- Do not rebuild feature schemas, verification modes, maps, specs, or product
  behavior while gardening.
- Install no dependencies and mutate no production or shared resource without
  separate authorization.

## Quality Gate

Require all applicable conditions:

- Final scope matches intent and audit mode made no mutation.
- Structural results are deterministic and separate from semantics.
- Every semantic finding has evidence, expected authority, and honest
  confidence.
- Repairs target canonical homes and preserve accepted truth and unrelated work.
- Deleted or compacted artifacts have no unresolved consumer or durable value.
- Changed feature state, routes, links, anchors, scripts, and commands remain
  consistent and runnable.
- New checkers are directly fixture-tested, truthful, read-only, and explicit
  about semantic limits.
- Existing baseline failures remain distinct.
- The diff is focused and unchanged rerun is a no-op.

Inspect actual command output, exit status, and diff before claiming success.

## Close the Phase

Return to the router with final intent and scope; reused tools and canonical
sources; structural and semantic findings; repaired, migrated, deleted,
preserved, and omitted artifacts; uncertainty and owner follow-ups; verification
results; and whether a persistent report was justified. Do not open another
phase here.
