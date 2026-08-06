# Repository Knowledge Architecture

Use this rubric when an initializer decides whether a repository needs a new knowledge artifact. It is vendor-neutral: names and locations are examples, not requirements.

## Source and scope

OpenAI's [Harness Engineering](https://openai.com/index/harness-engineering/) describes a repository as an environment whose code, instructions, plans, and feedback help agents work effectively. Its companion [PLANS.md guidance](https://developers.openai.com/cookbook/articles/codex_exec_plans) shows how a written, verifiable execution plan supports multi-hour work. OpenAI's published layout is a useful case study/reference, **not a universal standard** and not a mandate for exact filenames or paths.

At the level useful for initialization, that case study includes:

```text
AGENTS.md                    # navigation and local operating guidance
docs/
  design/                    # durable technical/design decisions
  product-specs/             # product intent and acceptance detail
  references/                # external or domain reference material
  generated/                 # derived documentation
  exec-plans/                # larger, verifiable work plans
    active/
    completed/
```

Adapt the taxonomy to the repository's evidence and conventions. `docs/README.md` is the stable map; it may point to a root-level source of truth when the repository already uses one. Preserve progressive disclosure: `AGENTS.md` routes to the map, and the map routes to details loaded only when relevant.

## Decision matrix

Inspect the repository first, then use the strongest signal rather than creating every artifact type:

| Signals in the evidence | Consider | Minimum useful content |
|---|---|---|
| Cross-cutting boundaries, dependencies, invariants, or repeated architectural questions | `ARCHITECTURE` | scope, status, owner, verified evidence, current shape with code links, boundaries and dependency direction, invariants and constraints, decisions with ADR/issue links, and change triggers |
| A consequential choice among alternatives, or a decision that must survive turnover | design doc / ADR | context, options, decision, consequences, status |
| User behavior, acceptance criteria, domain terms, or externally visible contract | product spec / glossary | intended behavior, non-goals, terms, and acceptance evidence |
| Stable upstream API, protocol, operational rule, or domain source used during work | reference | source, version/edition, applicability, and local interpretation |
| Documentation deterministically derived from code or schemas | generated docs | generator/source, command, and regeneration boundary; do not hand-edit |
| Multi-session work, multiple systems/interfaces, migration, security/data risk, or multi-agent coordination | detailed execution plan (`PLANS.md`-style) | ordered steps, dependencies, verification/done conditions, and rollback/stop points |
| UI system, interaction contract, accessibility, or frontend-specific constraint | `DESIGN` / `FRONTEND` | affected surfaces, states, constraints, and evidence (only if not already covered) |
| Trust boundary, authn/authz, secrets, privacy, compliance, or sensitive data | `SECURITY` | threat/risk, controls, owner, and verification |
| Availability, failure modes, SLOs, recovery, capacity, or operational runbook | `RELIABILITY` | failure assumptions, safeguards, observability, and recovery evidence |

These are considerations, not a checklist. If evidence does not support an artifact, do not create it. A normal feature remains in `features/<id>.md`; add or link a detailed plan only when the opt-in thresholds above are met.

## When and where to author optional docs

Create `ARCHITECTURE` only when inspection finds cross-cutting boundaries, dependency direction, invariants, or recurring architectural questions that need a durable record. Use the optional [architecture template](../templates/architecture.md) as a compact starting point, not as a reason to create the document. The finished document must state scope, status, owner, verified evidence, current shape with code links, boundaries and dependency direction, invariants and constraints, decisions with ADR or issue links, and change triggers.

Use the repository's established path convention: prefer an existing root document when root-level project guidance lives there, or the existing `docs/` taxonomy when technical documentation lives there. Add that source to `docs/README.md` rather than copying it. Apply the same evidence test to every optional artifact: create it only when its signal is present and its minimum content can be maintained.

Before creating any optional document:

1. Inspect existing `AGENTS.md`, feature docs, docs indexes, code/config/tests, issue links, and repository conventions. Search before adding a new document.
2. State the evidence signal, proposed artifact, owner, and path. Prefer extending or linking an authoritative document over making a parallel copy.
3. Ask when ownership, authority, sensitivity, scope, or artifact type is ambiguous.
4. Record only facts supported by inspected evidence, cite paths/URLs/versions, and mark unknowns as `Unknown` rather than guessing.
5. Add every accepted source of truth to `docs/README.md` with when-to-read and ownership/source information.
6. Do not create an empty placeholder or invent facts. A document without evidence, an owner, and a useful next action is repository noise.

`AGENTS.md` should route agents to `docs/README.md`, not enumerate every optional artifact. The index lists only sources that actually exist and explains when to read them.

## Plans are opt-in

Use a detailed execution plan when work is likely to span multiple sessions, cross multiple systems or interfaces, includes a migration, carries security or data risk, or is split across multiple agents. The plan should have verifiable per-step done conditions and links to the relevant design/spec/ADR. Do not turn every feature into a plan: keep ordinary work in `features/<id>.md`, linking a plan only when complexity or risk justifies it.

## Freshness and gardening

For knowledge that can age, capture **owner**, **source**, **version**, and the verified evidence (path, command output, test, or URL). Re-verify when a referenced path or interface/contract changes; calendar dates are a soft reminder, not proof of staleness. Prefer a source-of-truth link and a short local interpretation over copied detail.

Gardening, documentation lint, and debt tracking are optional and signal-driven. Lint should be advisory unless the repository explicitly makes it a gate; there is no mandatory “N-feature” rule. Prefer the existing issue tracker for debt. If a debt item is filed in repository documentation, include an owner, impact, exit condition, and review date. Keep defaults slim: add structure only when repository evidence makes its maintenance worthwhile.
