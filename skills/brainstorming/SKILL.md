---
name: brainstorming
description: Use for deeper structured exploration when initial thinking reveals ambiguity, competing approaches, unclear acceptance criteria, or product/design/architecture tradeoffs. Do not use for every task.
---

# Brainstorming

Use this skill only when the right implementation direction is not yet clear.

## Relationship to Initial Thinking

All tasks require initial thinking.

This skill is not the same as initial thinking.

This skill is for deeper structured exploration when initial thinking reveals ambiguity, tradeoffs, multiple viable approaches, unclear acceptance criteria, or meaningful behavior, design, or architecture impact.

Skipping this skill for a simple task does not mean skipping thought.

It means the initial triage found no need for formal brainstorming.

## Use This Skill When

- requirements are ambiguous
- the user is asking for a new behavior or feature
- acceptance criteria are unclear
- there are multiple viable approaches
- there are product, UX, API, data, architecture, security, reliability, or correctness tradeoffs
- the implementation direction is not obvious
- the change may affect long-term maintainability
- the user explicitly asks to explore options

## Do Not Use This Skill When

- typo fixes
- copy-only changes
- mechanical renames
- one-line config updates
- stale path or reference cleanup
- simple bug fixes with known cause and narrow scope
- test-only maintenance with clear expected behavior
- executing an already-approved ExecPlan

For these tasks, still perform initial thinking through `using-skills`, then proceed with the minimum sufficient process.

## Required Reading

`AGENTS.md` is already loaded.

Read only what the design question needs:
- `harness/feature_index.json` for related feature scope
- exact product/spec docs for behavior when they exist
- `docs/ARCHITECTURE.md` for app boundaries
- exact `docs/frontend/*.md` leaf for UI, routing, state/data, forms, or i18n questions
- exact `docs/features/*.md` leaf for feature workflow questions
- exact nearby source files for the design area

## Process

1. Understand the decision that is actually open.
2. Ask concise clarifying questions only when needed.
3. Compare 2-3 viable approaches when tradeoffs matter.
4. Recommend one approach with clear reasons.
5. Record the result in the smallest durable artifact that fits.

## Output

Use a compact structure:

```text
Brainstorm result:
- Problem understanding:
- Key assumptions:
- Options considered:
- Tradeoffs:
- Recommendation:
- Open questions:
- Whether this should become an ExecPlan:
```

## Artifact Rule

- If the decision is durable UI or architecture guidance, update the smallest relevant `docs/frontend/*` leaf or `docs/ARCHITECTURE.md`.
- If the result should become executable implementation work, hand off to `writing-plans`.
- If the work is small and already clear after discussion, continue without forcing a design doc.

## Forbidden Behavior

- Do not require brainstorming for every modification.
- Do not treat `brainstorming` as a substitute for the mandatory initial thinking done in `using-skills`.
- Do not create a parallel upstream doc tree for skill-specific notes.
- Do not block obvious low-risk execution with unnecessary design ceremony.
