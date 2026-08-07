---
name: harness-garden
description: >-
  Audit or clean repository harness entropy with deterministic structural checks
  and evidence-based semantic review across agent instructions, architecture and
  subsystem docs, product specs, feature state, verification adapters, and
  recurring code patterns. Use when users request repository hygiene, stale-link
  or stale-state cleanup, post-migration maintenance, completed-feature
  compaction, investigation of recurring deprecated or bypassed patterns, or
  migration of legacy harness-slim maintenance checks. Do not use for an
  ordinary focused coding task, routine execution of existing verification,
  speculative code-quality refactoring, defining product behavior, or broad
  architecture and implementation changes without explicit scope.
---

# Harness Garden

## Purpose

Reduce scoped repository ambiguity without turning maintenance into permanent
ceremony. Answer:

- Which machine-checkable harness invariants are broken?
- Which canonical documents, state, commands, or recurring patterns have
  evidence of drift?
- Which findings are proven, which are suspicions, and which truth source is
  authoritative?
- Which repairs are safe under the user's mutation request?
- Which issues belong to another workflow or need a decision?

Keep this invocation isolated to maintenance. Audit canonical artifacts without
silently redefining them. Do not drift into product planning, feature
implementation, architecture redesign, verification orchestration, or a general
repository rewrite.

## Classify Intent and Authority

Classify the request before changing files:

| User intent | Default behavior |
|---|---|
| Audit, check, inspect, review | Report findings; do not repair or persist a report |
| Cleanup, fix, repair | Repair high-confidence mechanical and targeted issues inside the stated scope |
| Semantic refactor or behavior change | Require explicit scope and authoritative evidence; report ambiguity before choosing truth |

Treat a cleanup request as authorization for safe scoped repair, not for broad
code or documentation rewrites. Ask only when missing authority or evidence
materially changes intended behavior, compatibility, deletion safety, or scope.

Keep findings in the response by default. Persist a report only when cleanup
will span sessions, findings need separate human review, or a milestone requires
tracked remediation. Do not create a permanent garbage catalog for a one-turn
audit.

## Own Maintenance Without Taking Over Other Truth

Own generation and rerun behavior for:

- deterministic checks of harness, documentation, and feature-state
  invariants;
- evidence-based semantic maintenance audits;
- conditional `scripts/garden/check.*` or an existing equivalent;
- scoped findings and authorized targeted repairs;
- safe migration of valuable legacy maintenance checks.

Treat canonical instructions, architecture docs, subsystem docs, specs, feature
artifacts, verification interfaces, code, and tests as truth owned by their
respective workflows. Garden may repair any affected canonical artifact only
when cleanup is authorized and the repair is evidenced and scoped. Preserve the
artifact's structure, terminology, human-authored intent, and unrelated changes.

Garden owns the invariant and its deterministic check. Verify owns composition
of that check into feature completion, affected verification, and full
verification. Patch an existing explicit structural-check hook or stale command
reference only when the change is mechanical and unambiguous. Otherwise report
the `harness-verify` follow-up instead of redesigning verification modes.

## Inspect Maintenance Evidence

Inspect before reporting or editing:

1. Read git status and preserve unrelated worktree changes.
2. Locate root and nested agent instructions, tool-specific instruction files,
   documentation indexes, and internal routes.
3. Locate architecture, subsystem, product-spec, decision, schema, and external
   contract sources relevant to the selected scope.
4. Locate feature indexes, schemas, detail files, accepted exceptions, Handoff,
   blockers, retention policy, and external tracker routes when feature state is
   in scope.
5. Locate verification adapters, native commands, structural hooks, CI
   composition, referenced helpers, and retained-log paths when verification
   maintenance is in scope.
6. Inspect existing garden, lint, link, schema, generated-file, or deprecation
   checks before creating another checker.
7. Inspect recent changes, representative code and tests, documented paths, and
   known hotspots only when semantic evidence is needed.
8. Inspect manifests and available runtimes only far enough to choose a safe
   implementation for a deterministic check.
9. Read git history or external evidence only when it materially clarifies a
   rename, migration, accepted decision, consumer, or deletion candidate.
10. Classify each candidate fact as correct, stale, missing, conflicting, or
    uncertain before changing it.

Do not assume newer code is intended truth or older documentation is stale.
Treat code, tests, and runtime behavior as observed evidence; treat accepted
requirements, decisions, and canonical specs or architecture rules as intended
evidence. Resolve conflicts from repository-specific authority and freshness,
not a universal source-precedence rule.

## Choose the Smallest Useful Scope

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

Start with cheap structural checks and the user's named area. For semantic work,
sample recent changes, documented code paths, representative modules and tests,
and known hotspots before expanding. Expand only when the evidence shows that
the same failure crosses the initial boundary or the user explicitly requests a
repository-wide audit.

Stop when:

- the selected structural invariants have been checked;
- representative evidence supports or rejects the scoped semantic concerns;
- high-confidence authorized repairs have been made and verified;
- remaining questions require a product, architecture, compatibility, or scope
  decision.

Do not maximize file coverage or finding count.

## Separate Structural and Semantic Engines

Keep the distinction explicit:

| Engine | Standard | Delivery effect |
|---|---|---|
| Structural | Deterministic, locally reproducible invariant | May fail a maintenance check or applicable verification gate |
| Semantic | Evidence-based interpretation with confidence | Normally report; do not gate automatically |

### Check structural invariants

Check only invariants that can produce the same answer from the same repository
state, such as:

- malformed feature state or schema violations;
- duplicate feature IDs or detail paths;
- missing dependencies, self-dependencies, or dependency cycles;
- missing or escaping detail/spec paths;
- orphan details when the repository declares that every detail is indexed;
- broken internal links, stale repository paths, or missing anchors when the
  parser can determine them reliably;
- references to missing verification or maintenance helpers;
- obvious duplicate routing entries;
- `done` feature state with stale Handoff or blocker content;
- generated-file or configuration invariants already declared by the
  repository.

Honor optional capabilities. Absence of a feature index, specs directory,
verification adapter, or docs index is not itself a failure unless the
repository declares it required.

Do not encode product meaning, architecture intent, prose freshness, code
quality, deprecation safety, or guessed ownership as structural regex rules.
Use a repository-native linter rule as structural only when its contract is
accepted and deterministic.

### Audit semantic drift

Investigate questions such as:

- an intended architecture dependency points one way while representative code
  imports the other way;
- a canonical spec requires one outcome while code or tests implement another;
- a flow document still describes a path replaced by a migration;
- deprecated, bypassed, or duplicated patterns recur in code likely to be
  copied;
- a shim, flag, endpoint, helper, or API usage appears obsolete.

For each concern:

1. State the observed condition precisely.
2. Locate the expected condition and its authority.
3. Record stable paths, symbols, commands, tests, decisions, or runtime evidence.
4. Sample enough occurrences and counterexamples to test whether the pattern is
   recurring or exceptional.
5. Classify stale documentation, code defect, test defect, incomplete migration,
   changed external contract, accepted exception, or unresolved ambiguity only
   when evidence supports the classification.
6. Label confidence and keep suspicions out of automatic gates.

Do not promote the dominant implementation pattern into an intended rule merely
because it is common. Do not prove dead code only with a local text search when
reflection, generated references, public consumers, migrations, data, or
external contracts may exist.

## Report Findings Precisely

Use only fields that improve the decision:

```text
Severity
Observed
Expected
Evidence
Classification or confidence
Action
```

Base severity on concrete impact, not documentation age or stylistic dislike.
Assign finding IDs only when there are many findings, a persistent report, or a
user-selected repair set. Label an evidence gap as suspicion, or omit it when it
does not support useful action.

Keep baseline failures and unrelated findings separate from issues introduced
or repaired in scope. Never inflate a clean audit by listing generic best
practices.

## Repair Only What Evidence Authorizes

When cleanup is requested, repair high-confidence scoped issues such as:

- broken links and proven path renames;
- invalid or stale feature state;
- stale Handoff or blocker content after completion;
- empty or duplicate documentation sections with a clear canonical home;
- stale routing rows after a proven artifact move or removal;
- dead generated maintenance helpers with no remaining consumer;
- completed feature artifacts according to the repository's retention policy;
- a targeted recurring code pattern when explicit scope, intended replacement,
  compatibility evidence, and proportional verification are all present.

Repair the canonical home of a fact, then reduce other locations to routes or
short required reminders. Preserve accepted exceptions and human decisions
unless stronger authority proves them obsolete.

Before deleting or compacting an artifact:

1. Search repository references and inspect generated, CI, and instruction
   consumers.
2. Identify human-authored durable value.
3. Move still-relevant accepted exceptions, decisions, or follow-ups to their
   canonical home before removing detail.
4. Update routes and consumers before removing the old path.
5. Retain compatibility when external or uninspectable consumers remain
   plausible; report the uncertainty.
6. Confirm that repository history or the external tracker is sufficient when
   retention relies on it.

Do not automatically:

- change product behavior to match possibly stale documentation;
- rewrite architecture to match an unaccepted common pattern;
- remove compatibility code without proving consumers are gone;
- refactor a repository because of a smell or low-confidence heuristic;
- fix unrelated test, build, lint, or runtime failures;
- create an archive merely to move garbage elsewhere.

## Build Deterministic Structural Tooling Conditionally

Create or extend a structural entry point when machine-checkable harness state
exists, many agent-facing documents and links recur, or the same invariant is
valuable enough to run repeatedly. Prefer an existing native linter, schema
validator, or maintenance command when it already covers the contract. Omit a
new helper when there is nothing durable to validate.

Use the repository's convention; default to `scripts/garden/check.*` only when
no better location exists. Use an already available runtime and dependencies.
Do not add a runtime, package, lockfile, or network dependency solely for the
checker.

Make the checker:

- resolve repository paths predictably and work from documented invocation
  locations;
- accept only documented, validated inputs;
- deterministic in ordering, output, and exit status;
- compact on success and actionable on failure;
- nonzero when any required invariant fails;
- explicit about skipped optional capabilities;
- explicit that it does not validate semantic correctness;
- read-only unless a separately named and authorized repair mode is genuinely
  needed;
- safe for spaces, metacharacters, symlinks, and paths outside expected roots;
- small enough that its invariants and fallback behavior remain auditable.

Avoid a universal stack guesser or a regex-based semantic oracle. Split helpers
only when parsing or invariant groups are independently reusable; do not create
one file per trivial check.

Test an executable checker with disposable fixtures. Exercise a clean pass,
each material failure class, invalid input, missing optional state, invocation
from the documented working directories, path edge cases, deterministic repeat
output, and nonzero failure propagation. Confirm that it leaves no mutation.

## Compact Feature and Documentation Garbage Safely

For completed feature state:

- remove stale Handoff and blocker content;
- retain details containing relevant accepted exceptions, or move each
  exception to a durable spec, decision, or follow-up before deletion;
- compact or remove low-value detail before pruning the index identity;
- retain compact `done` identity long enough to prevent duplicate planning;
- prune identity only under an explicit retention policy, after a milestone or
  real index-cost problem, with reliable history available;
- do not create `features/archive/` by default.

For documentation:

- delete empty placeholders that add no route or durable truth;
- merge duplicate facts into the canonical home;
- reduce repeated prose to links or one-sentence routing reminders;
- remove stale rows and routes only after confirming the destination or
  intentional removal;
- preserve focused documents whose distinct boundaries still earn their cost.

Do not use manually maintained dates as proof of freshness.

## Promote Recurring Problems Conservatively

Use this ladder:

```text
one-off finding
  -> durable documented rule after recurrence or accepted intent
  -> deterministic structural/lint check after repeated violation
  -> required verification gate only when cheap, precise, and high value
```

Do not promote a style preference, semantic heuristic, or low-confidence pattern
into a gate. Verify that a new rule has one canonical home and that the check
tests the rule rather than a fragile textual approximation.

## Migrate Legacy Maintenance Safely

When migrating `harness-slim` maintenance:

- inspect `scripts/check-state.sh`, `progress.md`, feature artifacts, `init.sh`,
  instruction routes, CI, and all command references;
- preserve valuable project-specific invariants while dropping the global
  one-active feature rule, priority semantics, and other obsolete assumptions
  only after the feature schema has been migrated;
- report the `harness-features` prerequisite when old feature-state semantics
  are still canonical instead of changing schema and work state in Garden;
- move reusable deterministic checks under the repository's garden convention
  without retaining mandatory Bash plus `jq` assumptions unless the repository
  itself requires them;
- preserve useful active state from `progress.md` through the canonical feature
  Handoff or other accepted home before removing redundant history;
- update every instruction, verification, and CI reference before removing an
  old checker path;
- report the `harness-verify` follow-up for public `doctor` removal or mode
  redesign when no mechanical hook migration is safe;
- keep a compatibility delegate only while real consumers require it.

Do not delete a legacy checker because ownership moved. Remove it only after the
replacement passes equivalent invariant fixtures and all known consumers use
the new path.

## Apply the Workflow

1. Declare audit versus cleanup, the smallest scope, and the mutation and safety
   boundary.
2. Inspect git state, canonical artifacts, existing checks, relevant history,
   and only representative semantic evidence.
3. Run existing structural checks and independently inspect their contract;
   distinguish a clean run from incomplete coverage.
4. Record structural failures and semantic findings separately with evidence
   and confidence.
5. Decide whether to report, repair, create or extend a deterministic check,
   migrate legacy tooling, or make no change.
6. Apply only authorized high-confidence repairs in canonical homes; preserve
   exceptions, consumers, human intent, and unrelated dirty changes.
7. Test structural tooling directly and run verification proportional to any
   changed docs, state, scripts, commands, or behavior.
8. Review links, paths, schemas, command references, deletions, and the final
   diff for false gates, scope expansion, or duplicated truth.
9. Rerun the relevant structural path and confirm that unchanged evidence yields
   no semantic diff.
10. Report repaired, unresolved, intentionally omitted, and follow-up items,
    then close the garden phase.

If existing maintenance already satisfies the quality gates and the scoped
evidence is clean, make no change and report an evidence-backed no-op.

## Respect Mutation and Safety Boundaries

- Preserve unrelated worktree changes and repository-native conventions.
- In audit mode, perform read-only inspection and safe verification only.
- In cleanup mode, limit writes to structural tooling, a conditionally persisted
  report, and evidenced repairs inside the declared scope.
- Keep code edits targeted to explicitly authorized semantic cleanup; leave
  product behavior decisions and broad refactors to the appropriate workflow.
- Do not install dependencies, access production systems, reset shared data, or
  run mutating external commands without explicit authorization.
- Use disposable fixtures for checker tests and remove only artifacts created by
  the invocation.
- Do not reset, stash, overwrite, or normalize the user's unrelated work.
- Report collisions with concurrent or dirty changes instead of silently
  resolving them.

Do not:

- treat a semantic finding as a deterministic completion gate;
- claim an unrun, skipped, missing, or incomplete check passed;
- persist a maintenance report by default;
- create placeholder docs, empty archives, or a fixed harness tree;
- rebuild feature schemas, verification modes, architecture maps, or specs while
  gardening;
- silently broaden from one subsystem or recent changes to the whole repository;
- delete a path before checking references and durable value;
- use finding count, deleted file count, or uniform formatting as success.

## Validate the Result

Require all applicable gates:

- The final scope matches the request and audit mode produced no mutation.
- Structural results are deterministic, reproducible, and separated from
  semantic interpretation.
- Each semantic finding has concrete evidence, authority for the expectation,
  and an honest confidence or uncertainty label.
- Every repair targets the canonical home and preserves human-authored intent,
  accepted exceptions, and unrelated work.
- Every deleted or compacted artifact has no unresolved consumer or durable
  value; routes changed before removal.
- Feature graph, paths, details, status, Handoff, blockers, and accepted
  exceptions remain consistent when feature state changed.
- Links, anchors, scripts, and commands touched by cleanup resolve and run.
- New structural tooling uses available dependencies, reports failures
  truthfully, stays read-only, and states its semantic limitation.
- Semantic code repair has explicit scope and proportional tests; documentation
  cleanup has link or routing validation; executable tooling has direct fixture
  tests.
- Existing unrelated failures remain distinct and unchanged.
- The final diff is focused, and an unchanged rerun is a no-op.

Never infer a passing check from reading code or from a subagent report. Inspect
the actual command output, exit status, and diff before claiming success.

## Report the Invocation

Report concisely:

- intent and final scope;
- reused maintenance tools and canonical sources;
- structural failures, semantic findings, confidence, and baseline distinctions;
- repaired, migrated, deleted, or intentionally preserved artifacts;
- omitted checks, uncertain deletions, and owning-workflow follow-ups;
- verification commands run, exit results, and applicable checks not run;
- whether a persistent report was created and why.

Measure success by reduced ambiguity, precise findings, safe cleanup, and lower
future maintenance cost—not by finding or file count.
