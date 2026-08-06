# Repository Knowledge Architecture

Use this rubric when an initializer decides whether a repository needs a new
knowledge artifact. It is vendor-neutral: names and locations are examples,
not requirements.

## Source and scope

OpenAI's [Harness Engineering](https://openai.com/index/harness-engineering/)
describes a repository as an environment whose code, instructions, plans, and
feedback help agents work effectively. Its companion
[PLANS.md guidance](https://developers.openai.com/cookbook/articles/codex_exec_plans)
shows how a written, verifiable execution plan supports multi-hour work.
OpenAI's published layout is a useful case study/reference, **not a universal
standard** and not a mandate for exact filenames or paths.

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

Adapt the taxonomy to the repository's existing conventions. Preserve
progressive disclosure: keep startup guidance small, and link to detail that
agents can load when relevant.

## Decision matrix

Inspect the repository first, then use the strongest signal rather than
creating every artifact type:

| Signals in the evidence | Consider | Minimum useful content |
|---|---|---|
| Cross-cutting boundaries, dependencies, invariants, or repeated architectural questions | `ARCHITECTURE` | scope, constraints, current shape, and links to evidence |
| A consequential choice among alternatives, or a decision that must survive turnover | design doc / ADR | context, options, decision, consequences, status |
| User behavior, acceptance criteria, domain terms, or externally visible contract | product spec / glossary | intended behavior, non-goals, terms, and acceptance evidence |
| Stable upstream API, protocol, operational rule, or domain source used during work | reference | source, version/edition, applicability, and local interpretation |
| Documentation deterministically derived from code or schemas | generated docs | generator/source, command, and regeneration boundary; do not hand-edit |
| Multi-session work, multiple systems/interfaces, migration, security/data risk, or multi-agent coordination | detailed execution plan (`PLANS.md`-style) | ordered steps, dependencies, verification/done conditions, and rollback/stop points |
| UI system, interaction contract, accessibility, or frontend-specific constraint | `DESIGN` / `FRONTEND` | affected surfaces, states, constraints, and evidence (only if not already covered) |
| Trust boundary, authn/authz, secrets, privacy, compliance, or sensitive data | `SECURITY` | threat/risk, controls, owner, and verification |
| Availability, failure modes, SLOs, recovery, capacity, or operational runbook | `RELIABILITY` | failure assumptions, safeguards, observability, and recovery evidence |

These are considerations, not a checklist. If evidence does not support an
artifact, do not create it. A normal feature remains in
`features/<id>.md`; add or link a detailed plan only when the opt-in thresholds
above are met.

## Initializer workflow

1. **Inspect evidence**: read existing `AGENTS.md`, feature docs, docs indexes,
   code/config/tests, issue tracker links, and repository conventions. Search
   before adding a new document.
2. **Recommend**: state the signal, proposed artifact, expected owner, and
   where it should live under existing conventions. Prefer extending or
   linking an authoritative document over making a parallel copy.
3. **Ask when uncertain**: request a decision when ownership, authority,
   sensitivity, scope, or the right artifact type is ambiguous.
4. **Create only grounded docs**: record facts supported by inspected evidence,
   cite paths/URLs/versions, and mark unknowns as unknown. Link existing docs
   from `AGENTS.md` when that improves discoverability.
5. **Never create empty placeholders or invent facts**. A document without
   evidence, an owner, or a useful next action is repository noise.

## Plans are opt-in

Use a detailed execution plan when work is likely to span multiple sessions,
cross multiple systems or interfaces, includes a migration, carries security
or data risk, or is split across multiple agents. The plan should have
verifiable per-step done conditions and links to the relevant design/spec/ADR.
Do not turn every feature into a plan: keep ordinary work in
`features/<id>.md`, linking a plan only when complexity or risk justifies it.

## Freshness and gardening

For knowledge that can age, capture **owner**, **source**, **version**, and the
verified evidence (path, command output, test, or URL). Re-verify when a
referenced path or interface/contract changes; calendar dates are a soft
reminder, not proof of staleness. Prefer a source-of-truth link and a short
local interpretation over copied detail.

Gardening, documentation lint, and debt tracking are optional and
signal-driven. Lint should be advisory unless the repository explicitly makes
it a gate; there is no mandatory “N-feature” rule. Prefer the existing issue
tracker for debt. If a debt item is filed in repository documentation, include
an owner, impact, exit condition, and review date. Keep defaults slim: add
structure only when repository evidence makes its maintenance worthwhile.
