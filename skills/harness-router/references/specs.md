# Specs Fallback Phase

Use this reference only when `harness-specs` cannot be composed. Keep behavior
specification isolated until its gates pass, then return to the router.

## Inputs and Preconditions

Require:

- a focused durable behavior problem that is unsafe to infer;
- user mutation authority and the original git status;
- accepted requirements, decisions, or other candidate sources of intended
  behavior;
- completed map routes only as locators, not as product authority.

Own fallback generation and rerun behavior for canonical repository-local
product or domain specs and at most one minimal discoverability route. Prefer a
current product requirements, policy, protocol, domain, schema, or contract
document over a new `docs/specs/*` path.

## Inspection Budget

Inspect:

1. canonical instructions and routes to product or domain documentation;
2. requirements, accepted decisions, existing specs, schemas, external
   contracts, docs indexes, and relevant architecture routes;
3. representative code, tests, fixtures, callers, and runtime evidence for the
   scoped behavior;
4. feature detail only for requested scope and linked sources, never as sole
   product authority;
5. history only when it explains a decision, migration, compatibility promise,
   or apparently stale source.

Classify material claims as intended, observed, proposed, or uncertain. A
passing test establishes observed behavior, not intent. Determine authority
from repository-specific ownership, accepted decisions, user direction, and
source freshness; do not apply a universal precedence rule.

Stop when normal behavior, important failures, edge cases, and remaining
uncertainty are sufficient to derive implementation and tests. Do not
reverse-engineer the full product or enumerate every endpoint.

## Artifact Decision

| Evidence | Action |
|---|---|
| A current canonical spec owns the behavior | Patch only proven stale or missing content |
| A requirement, decision, schema, or external contract is already sufficient | Reuse and route it |
| Durable behavior is unsafe to infer and intended authority is clear | Create one focused spec |
| Only code or tests suggest the rule | Record observed evidence; do not promote it silently |
| Core sources conflict without deciding authority | Report the decision needed; write only an unambiguous subset when useful |
| Behavior is obvious CRUD, plumbing, or transient task detail | Omit a spec |

Create no fixed spec tree, endpoint catalog, or empty placeholder.

## Workflow

1. Declare the behavior scope, need for durable truth, and mutation boundary.
2. Audit existing canonical sources and discoverability routes.
3. Gather intended and observed evidence until the stopping rule is met.
4. Keep a compact claim ledger in working context: claim, authority, observed
   evidence, conflict, and uncertainty.
5. Resolve conflicts only when authority is clear. Classify stale spec, code
   defect, test defect, incomplete migration, changed contract, or ambiguity
   only when evidence supports it.
6. Reuse, patch, create, partially document, or make no change.
7. For a new spec, include only applicable sections:

   ```text
   Goal
   Flow
   Rules
   State transitions when applicable
   Edge cases
   Interfaces when public contracts need precision
   Non-goals when scope can drift
   Sources and uncertainties
   ```

8. State observable outcomes rather than controller, service, table, or
   framework tours. Write one grounded invariant per bullet.
9. Link canonical schemas and external contracts instead of copying them.
10. Add one `Read when` row to an existing docs index, or one focused existing
    instruction route, only when needed. Report a map prerequisite if no safe
    canonical route exists.
11. Validate sources, links, testability, and representative evidence. Review
    the diff for duplicated truth, hidden conflicts, leaked implementation,
    placeholders, and unrelated rewrites.

Make no change when existing canonical truth already passes the gates.

## Mutation Boundary

- Modify canonical specs and at most one minimal discoverability route.
- Preserve stable names, anchors, terminology, accepted decisions, and
  unrelated work.
- Read code and tests as evidence; do not modify them in this phase.
- Do not create architecture maps, feature state, verification helpers, garden
  rules, product implementation, or broad doc cleanup.
- Report ambiguous intent instead of forcing consistency.

## Quality Gate

Require all applicable conditions:

- The spec owns behavior that is durable and genuinely unsafe to infer.
- Every normative claim has intended authority or is visibly proposed or
  unresolved.
- Intended and observed truth remain distinct.
- Normal flow, important failures, rules, and material edge cases can drive
  acceptance tests.
- Core conflicts remain visible; internal implementation appears only when it
  is contractual.
- Canonical schemas and external material are linked rather than duplicated.
- The spec is discoverable through one minimal valid route.
- Paths, links, sources, and stable symbols resolve.
- Documentation or structural checks pass when available and applicable.
- The diff is focused and an unchanged rerun is a no-op.

Derive one normal-path assertion, one relevant failure assertion, and one
material edge assertion as a review probe. Compare them with representative
code and tests; report mismatches without editing implementation.

## Close the Phase

Return to the router with reused and changed canonical sources; intended,
observed, proposed, conflicting, and unresolved claims; intentionally omitted
specs or sections; validation performed; and implementation or test follow-up.
Do not begin features or implementation here.
