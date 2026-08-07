---
name: harness-docs-guide
description: >
  Shared writing standard for agent-facing repository documentation.
  Use when creating, reviewing, or rewriting AGENTS.md, ARCHITECTURE.md,
  subsystem guides such as BACKEND.md / FRONTEND.md / MOBILE.md,
  product/domain specs, feature documents, and durable design decisions.
  Optimizes documentation for fast AI comprehension, progressive disclosure,
  low token cost, explicit boundaries, and minimal duplication.
---

# Harness Docs Guide

## Purpose

This skill defines **how agent-facing repository documentation should be written**.

It is a shared guide for other harness skills. It does not own project artifacts by itself.

Primary goals:

1. Help a fresh agent locate relevant knowledge quickly.
2. Reduce inference from code when durable intent is already known.
3. Make relationships, boundaries, rules, and exceptions explicit.
4. Minimize token cost without sacrificing correctness.
5. Prevent duplicated or conflicting sources of truth.
6. Keep durable documentation stable and maintainable.

The target style is:

```text
MAP
  ↓
RELATIONSHIPS
  ↓
RULES
  ↓
EXCEPTIONS
  ↓
RATIONALE — only when needed
```

Prefer **high information density** over prose volume.

---

# 1. Core writing principles

## 1.1 Map before prose

When information can be represented accurately as a:

- flow,
- dependency graph,
- directory map,
- decision tree,
- table,
- state transition,
- invariant list,

use that representation before explanatory paragraphs.

Preferred:

```text
Request
  ↓
Route
  ↓
Service
  ↓
Repository
  ↓
Database
```

Avoid replacing a simple relationship with several paragraphs.

A diagram MUST carry semantics. Do not create decorative arrows that merely restate prose.

---

## 1.2 Relationships before descriptions

Prefer showing how components interact before describing each component independently.

Preferred:

```text
Checkout
  → PaymentService
  → PaymentProvider
  → PaymentWebhook
  → Order settlement
```

Then document responsibilities or exceptions.

---

## 1.3 Rules before rationale

State the actionable rule first.

Preferred:

```text
Rule:
Domain code MUST NOT import framework-specific modules.

Why:
The same domain logic is used by HTTP handlers and background workers.
```

Do not bury an important implementation rule at the end of a historical explanation.

---

## 1.4 One document = one class of truth

Each document MUST have a clear responsibility.

Typical ownership:

```text
AGENTS.md
→ navigation + repository-wide operating rules

ARCHITECTURE.md
→ system topology + boundaries + major flows

BACKEND.md / FRONTEND.md / MOBILE.md
→ subsystem implementation doctrine

docs/specs/*
→ durable product/domain behavior

feature_index + features/*
→ execution scope + acceptance + current work state

decision records
→ rationale for durable technical/product decisions
```

Do not copy the same rule into several documents.

Prefer links to the canonical source.

---

## 1.5 Stable facts before volatile facts

Durable documents SHOULD contain durable knowledge.

Good in `ARCHITECTURE.md`:

```text
Route → Service → Repository
```

Bad in `ARCHITECTURE.md`:

```text
feat-031 is currently being implemented.
```

Short-lived information belongs in work-state artifacts.

---

## 1.6 Explicit over inferred

Important rules MUST be stated directly.

Do not require an agent to infer an architectural invariant from dozens of files.

Preferred:

```text
Allowed:
Route → Service → Repository

Forbidden:
Route ✕ Repository
Route ✕ ORM
```

---

## 1.7 Distinguish truth status

When evidence and intent differ, label them.

Use these concepts when relevant:

```text
Observed  → what the repository currently does
Intended  → what the canonical design says should be done
Proposed  → a not-yet-adopted change
Uncertain → evidence is insufficient or conflicting
```

Example:

```text
Observed:
Some legacy auth routes access repositories directly.

Intended:
New auth routes MUST call AuthService.

Migration:
Legacy routes are being migrated incrementally.
```

Never convert a dominant legacy pattern into intended architecture without evidence.

---

## 1.8 Prefer canonical paths, symbols, and commands

Use searchable repository anchors.

Preferred:

```text
API entry point: `apps/api/main.py`
Authentication service: `AuthService`
Affected verification: `./init.sh affected`
```

Avoid vague phrases such as:

```text
check the backend code
run the relevant tests
look at the service layer
```

when exact paths or commands are known.

---

## 1.9 Exceptions must be explicit

Place exceptions close to the rule they modify.

Example:

```text
Default:
Service → Repository

Exception:
ReportingService MAY query ReadModel directly.
```

Do not make agents discover exceptions by pattern matching the codebase.

---

## 1.10 Reference canonical truth instead of duplicating it

If a behavior is defined in a product spec:

```text
Password reset invalidates all refresh tokens.
```

another document SHOULD link to that spec rather than restating the rule.

Example:

```text
Password-reset behavior:
`docs/specs/password-reset.md`
```

Duplication increases drift.

---

## 1.11 Optimize signal per token

Every section should help the agent do at least one of:

```text
Locate
Relate
Constrain
Decide
Verify
Navigate
```

Remove text that does not materially improve one of those functions.

Avoid:

- generic introductions,
- framework tutorials,
- motivational prose,
- repeated explanations of headings,
- obsolete history,
- implementation trivia with no decision value.

---

## 1.12 Progressive disclosure

A document SHOULD provide enough information for its layer and route deeper questions elsewhere.

Do not make every document self-contained at the cost of duplication.

Preferred navigation:

```text
AGENTS.md
  ↓
ARCHITECTURE.md
  ↓
BACKEND.md
  ↓
relevant product spec
  ↓
relevant code
```

An agent should not need to read the entire documentation tree for a local task.

---

# 2. Preferred information forms

Use the representation with the highest semantic density.

## 2.1 Flow

```text
Input
  → Validate
  → Transform
  → Persist
  → Output
```

Use for request lifecycles, workflows, data processing, and event pipelines.

---

## 2.2 Dependency direction

```text
Route → Service
Service → Repository
Repository → Database

Route ✕ Database
Domain ✕ Framework
```

Use for architecture boundaries.

---

## 2.3 Decision tree

```text
State belongs in URL?
├─ yes → route/search params
└─ no
   ↓
Shared across feature?
├─ yes → feature store
└─ no  → local component state
```

Use when implementation depends on conditions.

---

## 2.4 State transition

```text
draft
  ↓ submit
pending
  ↓ payment confirmed
paid
  ↓ fulfillment
shipped
  ↓ delivery
completed
```

Use for product/domain states.

---

## 2.5 Hierarchy / codemap

```text
apps/
├─ web/       → frontend
├─ api/       → HTTP API
└─ worker/    → background jobs

packages/
├─ domain/    → business logic
├─ database/  → persistence
└─ shared/    → shared primitives
```

Use for repository orientation.

Do not dump deep directory trees without interpretation.

---

## 2.6 Tables

Use tables for:

- comparisons,
- case → expected result,
- ownership,
- option trade-offs,
- compatibility matrices.

Example:

| Case | Result |
|---|---|
| Unknown user | `401` |
| Wrong password | `401` |
| Disabled account | `403` |

---

## 2.7 Invariant lists

Use concise bullets for durable non-negotiable rules.

```text
- Completed orders are immutable.
- Payment callbacks MUST be idempotent.
- Repository code MUST NOT contain business policy.
```

---

# 3. Semantic notation

Arrows and symbols SHOULD have stable meaning within a document.

Recommended defaults:

```text
A → B
A invokes, feeds, or leads to B

A ↓ B
vertical form of the same directed relationship

A ✕ B
A MUST NOT directly depend on or access B

A ⇄ B
bidirectional interaction

A ──HTTP──> B
labeled relationship when the edge type matters
```

If an arrow could be interpreted in more than one way, label it.

Do not use the same symbol for unrelated meanings in one document.

---

# 4. Rules for AGENTS.md

## 4.1 Responsibility

`AGENTS.md` is the repository router and top-level operating contract.

Every meaningful line SHOULD either:

1. route the agent to a canonical source, or
2. constrain repository-wide behavior.

It MUST NOT become an encyclopedia.

---

## 4.2 Recommended contents

Include only what is useful at repository entry:

```text
Project purpose
Repository map
Canonical documentation routes
Repository-wide invariants
Work-state location, when present
Verification commands
Important operating rules
```

Recommended shape:

```markdown
# AGENTS.md

## Project
<2–5 lines>

## Start here
- Architecture → `ARCHITECTURE.md`
- Backend rules → `docs/BACKEND.md`
- Product behavior → `docs/specs/`
- Work state → `feature_index.json`

## Repository map
<shallow interpreted map>

## Working rules
<repository-wide invariants only>

## Verification
<canonical commands>

## Documentation
<where deeper truth lives>
```

---

## 4.3 Do not put in AGENTS.md

Do not include:

- detailed architecture explanation,
- full product rules,
- framework tutorials,
- feature-specific implementation notes,
- long change history,
- extensive design rationale,
- generic software-engineering advice.

Move those to their canonical documents.

---

# 5. Rules for ARCHITECTURE.md

## 5.1 Responsibility

`ARCHITECTURE.md` explains:

```text
What are the major parts?
How are they connected?
Where does code live?
Which dependency directions are allowed?
Which boundaries must not be crossed?
```

It is a bird's-eye map, not an implementation manual.

---

## 5.2 Recommended contents

Prefer:

```text
1. System topology
2. Repository codemap
3. Dependency direction
4. Important runtime/data flows
5. Cross-cutting concerns
6. Deep-dive links
```

Example:

```text
Browser
  ↓ HTTPS
Web
  ↓ REST
API
  ↓
Domain Services
  ↓
Repositories
  ↓
PostgreSQL
```

Then:

```text
Allowed:
Route → Service
Service → Repository

Forbidden:
Route ✕ Database
Domain ✕ Framework
```

---

## 5.3 Architecture rules

`ARCHITECTURE.md` SHOULD:

- describe coarse-grained topology,
- name important modules and entry points,
- show dependency direction,
- show forbidden edges when meaningful,
- identify cross-cutting concerns,
- route subsystem-specific details elsewhere.

It SHOULD NOT:

- document every package,
- list every class or function,
- mirror the entire directory tree,
- duplicate subsystem rules,
- describe temporary feature state.

---

# 6. Rules for subsystem guides

Applies to documents such as:

```text
BACKEND.md
FRONTEND.md
MOBILE.md
DATA.md
INFRA.md
```

## 6.1 Responsibility

A subsystem guide answers:

> When changing code in this subsystem, which patterns, boundaries, and conventions should I follow?

---

## 6.2 Recommended structure

```text
Main flow
Responsibilities
Dependency rules
Canonical patterns
Forbidden patterns
Error/state/data model
Testing/verification
Good examples
Legacy examples to avoid
Deep links
```

Example:

```text
HTTP Request
  ↓
Route
  ↓ parse + validate
Service
  ↓ business rules
Repository
  ↓ persistence
Database
```

Then responsibilities:

```text
Route
- parse
- validate
- authorize
- call service

Service
- business logic
- transaction boundaries

Repository
- persistence only
```

---

## 6.3 Canonical vs legacy examples

When old and new patterns coexist, explicitly identify them.

```text
Canonical example:
`src/orders/OrderService.ts`

Legacy — DO NOT COPY:
`src/legacy/payment.ts`
```

This is preferred to expecting the agent to infer which repeated pattern is current.

---

# 7. Rules for product/domain specs

## 7.1 Responsibility

A spec defines **required durable behavior**.

It answers:

```text
What should the system do?
What rules must hold?
What are the state transitions?
What happens at edge cases?
```

It SHOULD NOT primarily describe implementation.

---

## 7.2 Recommended order

```text
FLOW
  ↓
RULES
  ↓
STATE TRANSITIONS
  ↓
EDGE CASES
  ↓
ACCEPTANCE EXAMPLES
  ↓
RATIONALE — only if needed
```

Example:

```text
Request reset
  ↓
Account exists?
├─ no  → generic success
└─ yes
     ↓
Create token
     ↓
Send email
```

Rules:

```text
- Response MUST NOT reveal whether the email exists.
- Token expires after 30 minutes.
- Token is single-use.
- Successful reset revokes all refresh tokens.
```

---

## 7.3 Implementation leakage

Avoid implementation details such as:

```text
Store token in Redis key `reset:{token}`
```

unless that technology is itself a durable accepted constraint.

Product behavior and implementation architecture are different classes of truth.

---

## 7.4 Edge cases are first-class

If edge behavior matters, state it explicitly.

| Case | Expected behavior |
|---|---|
| Unknown email | generic success |
| Expired token | reject |
| Reused token | reject |

Do not rely on agents to infer edge cases from tests or code.

---

# 8. Rules for feature documents

## 8.1 Responsibility

A feature document connects durable truth to a bounded execution unit.

It answers:

```text
What is this feature trying to achieve?
What is in scope?
What is out of scope?
What acceptance conditions define done?
Which canonical docs apply?
How should it be verified?
What must the next session know?
```

---

## 8.2 Keep feature documents thin

Feature documents SHOULD point to canonical truth instead of reproducing it.

Recommended structure:

```markdown
# feat-XXX — <title>

## Goal
...

## Scope
...

## Non-goals
...

## Acceptance
- [ ] ...

## Relevant docs
- `docs/specs/...`
- `docs/BACKEND.md`

## Verify
- `<affected verification command>`

## Accepted exceptions
<!-- only when needed -->

## Handoff
<!-- only when work spans sessions -->
```

Do not turn feature files into architecture documents or product specifications.

---

# 9. Rules for decision documents

Use durable decision records when the important question is:

> Why was option X chosen instead of Y?

Recommended shape:

```text
Context
  ↓
Decision
  ↓
Alternatives
  ↓
Consequences
  ↓
Status
```

Use tables when comparing alternatives.

Do not use decision records as a substitute for current architecture documentation.

---

# 10. Prose rules

Prose is appropriate for:

- rationale,
- trade-offs,
- ambiguity,
- migration context,
- exceptions that cannot be represented structurally,
- non-obvious constraints.

When prose is necessary:

1. Put the actionable conclusion first.
2. Keep paragraphs short.
3. Use concrete repository names.
4. Avoid rhetorical language.
5. Avoid repeating structured information in sentences.
6. Separate current fact from historical explanation.

---

# 11. Evidence rules

When deriving docs from an existing repository:

## MUST

- inspect actual code and configuration,
- prefer representative canonical implementations,
- cross-check existing docs,
- label uncertainty,
- preserve intentional repository-specific conventions.

## MUST NOT

- invent architecture,
- invent commands,
- invent business rules,
- infer intended design solely from frequency,
- treat legacy code as canonical without evidence,
- copy generic framework documentation into repository docs.

When evidence conflicts:

```text
Observed
  ≠
Documented intent
```

record the conflict instead of silently choosing one.

---

# 12. Navigation rules

Every durable document SHOULD make the next relevant source easy to discover.

Use explicit links such as:

```text
Backend implementation rules → `docs/BACKEND.md`
Authentication behavior → `docs/specs/authentication.md`
Current work state → `feature_index.json`
```

Avoid generic phrases such as:

```text
see the docs
see related files
check the architecture
```

when a canonical path exists.

---

# 13. Duplication rules

Before writing a rule, ask:

```text
Does this truth already have a canonical home?
```

If yes:

```text
link → do not restate
```

Duplication is acceptable only when the repeated fragment is necessary for local comprehension and is unlikely to drift.

When duplicating unavoidable information, keep it short and point to the canonical source.

---

# 14. Freshness rules

Durable docs SHOULD prefer facts unlikely to become stale.

Avoid embedding:

- temporary task ownership,
- short-lived branch names,
- current sprint state,
- transient rollout percentages,
- rapidly changing implementation details,

unless the document explicitly owns that state.

When code or behavior changes, update the smallest canonical document affected.

Do not perform unrelated documentation rewrites during ordinary feature work.

---

# 15. Quality gate

Before accepting an agent-facing document, evaluate it against this rubric.

## 15.1 Locate

Can a fresh agent identify where relevant code or deeper documentation lives?

## 15.2 Relate

Can the agent understand how the important parts interact?

## 15.3 Constrain

Are important allowed and forbidden behaviors explicit?

## 15.4 Decide

When there are meaningful alternatives, does the document explain which rule applies?

## 15.5 Verify

When applicable, can the agent identify the relevant verification path?

## 15.6 Navigate

Can the agent determine which canonical source to read next?

A section that serves none of these purposes SHOULD normally be removed.

---

# 16. Anti-patterns

Avoid the following.

## 16.1 Encyclopedia AGENTS.md

```text
AGENTS.md
= architecture
+ product spec
+ coding handbook
+ backlog
+ changelog
```

Wrong. Route to specialized sources instead.

---

## 16.2 Prose-first architecture

Bad:

> The controller is responsible for receiving HTTP requests and then it communicates with...

Preferred:

```text
HTTP
  → Route
  → Service
  → Repository
  → DB
```

---

## 16.3 Decorative diagrams

Bad:

```text
Authentication
  → is important
  → for security
```

Arrows must encode meaningful relationships.

---

## 16.4 Generic framework documentation

Do not explain how React, FastAPI, Django, Spring, Flutter, or similar frameworks generally work unless the repository uses them in a non-standard way that affects implementation.

Document the repository's conventions.

---

## 16.5 Unlabeled legacy patterns

If legacy code remains, mark it.

Otherwise agents may reinforce obsolete patterns.

---

## 16.6 Duplicate business rules

Do not restate the same product rule in:

```text
AGENTS
ARCHITECTURE
BACKEND
SPEC
FEATURE
```

Choose one canonical source and link to it.

---

## 16.7 False certainty

Do not write:

```text
The architecture is X.
```

when inspection only weakly suggests X.

Use:

```text
Observed:
...

Uncertain:
...
```

---

## 16.8 Exhaustiveness for its own sake

More documentation is not automatically better.

The objective is:

> minimum reading required for correct action.

---

# 17. Default writing sequence

When creating or rewriting agent-facing documentation:

```text
1. Identify the document's class of truth
      ↓
2. Identify canonical evidence
      ↓
3. Build the map / flow / topology
      ↓
4. State rules and invariants
      ↓
5. Add exceptions
      ↓
6. Add only necessary rationale
      ↓
7. Add canonical links
      ↓
8. Remove duplication and low-signal prose
      ↓
9. Run the quality gate
```

---

# 18. Final standard

When uncertain how to express something, prefer this order:

```text
MAP before PROSE.
RELATIONSHIPS before DESCRIPTION.
RULES before RATIONALE.
CANONICAL REFERENCES instead of DUPLICATION.
DETAIL only when the current layer needs it.
```

The objective is not the shortest document.

The objective is:

> **the smallest amount of structured knowledge that lets an agent navigate, understand, decide, implement, and verify correctly.**
