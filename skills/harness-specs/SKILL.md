---
name: harness-specs
description: >-
  Create, migrate, or repair canonical repository-local product and domain
  specifications by grounding intended behavior in requirements and accepted
  decisions while keeping code, tests, and runtime evidence explicitly
  observed. Use when permissions, state transitions, business invariants,
  public contracts, cross-layer workflows, or easy-to-misread edge cases are
  unsafe to infer; when an accepted behavior change needs durable repository
  truth; or when legacy harness product docs need migration. Do not use for
  obvious CRUD or framework plumbing, ordinary implementation whose behavior
  is already clear, architecture maps, subsystem conventions, feature backlog
  or acceptance state, verification design, or broad documentation cleanup.
---

# Harness Specs

## Purpose

Create the smallest durable behavior specification that lets a coding agent
answer:

- What product or domain outcome must hold?
- Which actors, inputs, states, and events change that outcome?
- What must happen on valid, invalid, duplicate, or exceptional paths?
- Which statements are intended, observed, proposed, or unresolved?
- Which tests could prove or disprove the contract?

Keep this invocation isolated to product and domain truth. Read architecture
routes when they help locate evidence, but investigate behavior independently.
Do not drift into architecture mapping, backlog decomposition, implementation,
verification orchestration, or broad gardening.

## Own Canonical Behavior Specs

Own generation and rerun behavior for canonical repository-local specs and the
smallest route needed to expose them. Prefer an existing product requirements,
domain, protocol, policy, or contract document over a new default path. Use
`docs/specs/<focused-name>.md` only when the repository has no better convention.

Treat specs as the primary home for durable intended product behavior, not as
exclusive-write artifacts. A feature or coding agent may update a canonical
spec when its accepted change alters the behavior.

Use this artifact test:

| Evidence | Action |
|---|---|
| A current canonical spec already owns the behavior | Patch only stale or missing sections |
| A canonical requirement, decision, schema, or external contract already states the behavior sufficiently | Reuse and route it; do not create a parallel spec |
| Durable behavior is unsafe to infer and its intended source is clear | Create one focused canonical spec |
| Only implementation or tests suggest a rule | Record them as observed evidence; do not silently promote the rule to intended truth |
| Core behavior has conflicting sources and no deciding authority | Report the conflict and decision needed; write only the unambiguous subset when still useful |
| Behavior is obvious CRUD, framework plumbing, or transient task detail | Omit a spec |

Do not create empty placeholders, an endpoint-by-endpoint catalog, or a fixed
spec tree. Missing optional artifacts are better than generic prose.

## Gather Behavior Evidence

Inspect before asking questions or writing:

1. Read git status and preserve unrelated changes.
2. Locate the canonical agent instructions and existing routes to product or
   domain documentation.
3. Inspect the root tree, README, docs index, architecture routes, decision
   records, requirements, schemas, API contracts, and existing specs.
4. Read relevant feature detail only for requested scope, linked sources, and
   accepted behavior; do not redesign feature state or derive product truth
   from acceptance wording alone.
5. Trace representative implementation, tests, fixtures, and runtime evidence
   for the behavior under study. Inspect callers and consumers when the
   contract crosses layers or is public.
6. Inspect recent history only when it explains an intentional decision,
   migration, compatibility promise, or apparently stale source.
7. Identify the repository's terminology and the canonical home of each fact.
8. Classify every material claim or section as correct, stale, missing,
   conflicting, or uncertain.

Ask only for information that cannot be inferred safely and materially changes
the contract. If an external normative source is necessary but unavailable or
its version is unclear, request or cite that prerequisite rather than recalling
rules from memory.

Stop inspection when expected behavior, meaningful edge cases, and remaining
uncertainties are sufficient to derive implementation and tests. Do not
reverse-engineer the full product, enumerate every route, or read unrelated
subsystems merely to make the document look complete.

## Keep Truth Planes Distinct

Label the source class wherever readers could otherwise mistake evidence for
authority:

- **Intended**: supported by a current requirement, accepted decision,
  canonical contract, or explicit user direction.
- **Observed**: supported by code, tests, configuration, or runtime evidence.
- **Proposed**: a candidate future behavior not yet accepted or implemented.
- **Uncertain**: evidence conflicts, authority is missing, or a decision remains.

Do not invent a universal precedence among requirements, specs, tests, and
code. Determine authority from the repository, the current request, accepted
decisions, and source freshness. A passing test proves observed behavior, not
that the behavior is intended. A written spec proves intent only when it is
still canonical and current.

Keep one fact in one canonical home:

- Let architecture and subsystem docs own topology, dependency direction, and
  implementation conventions.
- Let specs own durable product and domain behavior.
- Let feature artifacts own scoped work, acceptance, dependencies, and handoff.
- Let code and tests own observed implementation and executable evidence.
- Link to generated schemas or external contracts instead of manually copying
  material that will drift.

Restate at most the short invariant required for routing or local clarity.

## Resolve Conflicts Without Normalizing Them

When sources disagree:

1. State the conflicting claims and their evidence precisely.
2. Check source ownership, version, recency, accepted decisions, and current
   user authority.
3. Classify the conflict as a stale spec, code defect, test defect, incomplete
   migration, changed external contract, or unresolved ambiguity only when the
   evidence supports that classification.
4. Patch the spec when intended truth is clear and the request authorizes that
   documentation change.
5. Leave implementation and test mismatches unchanged in this phase; report
   the concrete follow-up they require.
6. Preserve both claims and mark the decision needed when intended truth is not
   clear. Do not select the most common or most recently edited behavior by
   default.

If uncertainty affects a peripheral edge case, publish the grounded contract
with a focused unresolved item. If it affects the goal, permission boundary,
state model, public compatibility, or another core rule, do not present the
spec as settled. Write less or stop for the missing decision.

## Shape a Focused, Testable Spec

Adapt the repository's existing structure. For a new spec, include only the
applicable parts:

```text
Goal
Flow
Rules
State transitions          # when a state machine exists
Edge cases
Interfaces                 # when a public contract needs precision
Non-goals                  # when scope can drift
Sources and uncertainties
```

### Goal and flow

State one product or domain outcome. Show the normal and important failure
branches compactly:

```text
request
  -> validate actor and input
     | invalid -> defined failure
     | valid
       -> apply domain rule
       -> defined result and durable side effects
```

Describe observable behavior, not a tour of controllers, services, tables, or
framework calls.

### Rules

Write one invariant per bullet. Name the actor, precondition, operation, result,
and failure behavior when those distinctions matter. Use normative wording only
for grounded intent. Avoid qualitative phrases such as "works correctly" or
"handles errors gracefully."

### State transitions

Use a table when state changes matter:

| From | Event and preconditions | To | Observable result |
|---|---|---|---|
| `<state>` | `<event>` | `<state>` | `<result or rejection>` |

Cover forbidden transitions and idempotent repeats when relevant. Do not infer
an elaborate state machine from incidental status fields.

### Edge cases

Select only cases that materially change the contract. Consider invalid or
missing inputs, permission denial, duplicates, retries, concurrency, ordering,
timeouts, partial failure, clock or precision boundaries, and compatibility
only when repository evidence makes them relevant. Give each case an expected
observable result.

### Interfaces

Document public inputs, outputs, errors, side effects, idempotency, ordering,
and compatibility promises only to the precision consumers need. Link to the
canonical schema or protocol. Keep internal implementation details out unless
they are themselves contractual.

### Sources and uncertainties

Make provenance brief but traceable:

```markdown
## Sources and uncertainties

- Intended: `<requirement, decision, canonical document, or explicit direction>`
- Observed: `<representative test, code path, fixture, or runtime evidence>`
- Proposed: `<proposal and decision owner, when applicable>`
- Unresolved: `none` or `<specific question and consequence>`
```

Do not use manually maintained update dates as evidence of correctness. Prefer
stable paths, symbols, decision IDs, versions, or requirement references; avoid
line numbers that churn.

## Choose Scope and Granularity Deliberately

Prefer one cohesive workflow or bounded domain contract per spec. Split when
readers, authority, lifecycle, or change cadence differ. Combine closely
related rules when splitting would force an agent to open several files to
understand one invariant.

Avoid both extremes:

- one product encyclopedia containing architecture, plans, runbooks, and every
  behavior;
- one tiny file per endpoint, validation clause, or test case.

Use repository language in titles and filenames. Preserve stable names and
anchors on rerun unless a rename has clear value and every route can be updated
safely.

## Integrate Discoverability Minimally

When creating or changing a spec area, add only the route needed for agents to
find the canonical behavior:

- Prefer one `Read when` row in an existing docs index.
- Otherwise add one focused task route in the canonical instruction entry
  point when that structure already supports it.
- Reuse an existing local index or product-doc route when it is sufficient.

Preserve the routing artifact's structure, terminology, human-authored intent,
and unrelated dirty changes. Do not create a docs index solely for a single
obvious document, redesign `AGENTS.md`, or update feature records just to add
links. If no canonical entry point exists or discoverability requires resolving
ambiguous ownership, report the `harness-map` prerequisite instead of inventing
a routing system.

Validate every added path and link in the same invocation.

## Migrate and Rerun Safely

When migrating legacy or scattered product documentation:

- identify the existing canonical source before choosing a new default path;
- preserve accepted decisions, repository terminology, stable anchors, and
  useful human-authored rationale;
- consolidate duplicate behavior only when ownership and intent are clear;
- keep existing paths when they already work, or update every in-scope route
  before moving a file;
- distinguish legacy observed descriptions from accepted intended behavior;
- leave broad stale-doc cleanup and unrelated link repair to garden;
- do not bulk-convert implementation, issues, TODOs, or feature acceptance into
  canonical product rules.

On every rerun, read the current artifact, source evidence, and git diff before
editing. Preserve correct sections and patch only changed truth. Do not reflow
unrelated prose, normalize all headings, recreate an intentionally deleted
optional spec, or overwrite a human decision merely for template uniformity.
With unchanged evidence, produce no semantic diff.

## Apply the Workflow

1. Declare the behavior scope, why durable truth is needed, and the mutation
   boundary.
2. Audit existing canonical sources and discoverability routes.
3. Gather intended and observed evidence until the stopping rule is met.
4. Build a claim ledger that records authority, evidence, conflict, and
   uncertainty for every material rule.
5. Decide to reuse, create, migrate, patch, partially document, or make no
   change.
6. Write the smallest focused spec in repository terminology, omitting
   irrelevant template sections.
7. Add the minimal discoverability route when safe.
8. Validate sources, internal links, behavior coverage, and testability against
   representative evidence.
9. Review the diff for duplicated truth, leaked implementation detail,
   unsupported normative language, hidden conflicts, placeholders, and
   unrelated rewrites.
10. Close the specs phase before suggesting another harness specialist.

If existing canonical sources already satisfy the quality gates, make no change
and report the evidence-backed no-op.

## Respect Mutation and Safety Boundaries

- Preserve unrelated worktree changes and repository-native conventions.
- Modify canonical specs and at most one minimal discoverability route.
- Report ambiguous intent rather than forcing consistency.
- Read code and tests as evidence; do not modify them in this phase.
- Do not install dependencies, contact external systems, or mutate production
  resources without separate authorization.

Do not:

- invent product behavior, source authority, errors, permissions, states, or
  compatibility promises;
- treat implementation frequency, a passing test, or an old document as intent
  without evidence;
- generate specs for every feature, endpoint, model, or CRUD path;
- copy schemas, architecture maps, feature scope, test plans, or external docs
  into the spec;
- create or redesign feature state, architecture, verification helpers, garden
  rules, or product implementation;
- resolve unrelated documentation drift or refactor code while gathering
  evidence;
- overwrite unrelated dirty changes or ambiguous human decisions.

## Validate the Result

Require all applicable gates:

- The spec owns behavior that is genuinely durable and unsafe to infer.
- Every normative claim has an intended source or is visibly proposed or
  unresolved.
- Observed evidence remains distinguishable from intended truth.
- Goal, normal flow, important failures, rules, and material edge cases are
  coherent enough to derive acceptance tests.
- State transitions and public interfaces are included only when applicable and
  contain observable results.
- No core conflict is hidden or silently normalized.
- Implementation detail appears only when it is contractual.
- Canonical schemas and external material are linked rather than duplicated.
- New or repaired specs are discoverable through one minimal valid route.
- Paths, internal links, source references, and stable symbols resolve.
- Existing markdown, documentation, or garden-owned structural checks pass when
  available and applicable.
- The final diff is focused and rerun-safe.

Test the document by deriving at least one normal-path assertion, one relevant
failure assertion, and one material edge assertion from it. These are a review
probe, not a new test-plan artifact. Compare them with representative tests and
code; report mismatches without editing implementation. Do not run a full code
suite for a specs-only change unless repository policy or the actual contract
change requires it.

## Report the Invocation

Report concisely:

- reused canonical sources and routes;
- created, migrated, or changed specs;
- intentionally omitted specs or optional sections and why;
- intended, observed, proposed, conflicting, and unresolved truth;
- implementation or test follow-up required by an accepted spec change;
- validation performed and its result.

Measure success by reduced behavior ambiguity and testable truth, not spec
count or document length.
