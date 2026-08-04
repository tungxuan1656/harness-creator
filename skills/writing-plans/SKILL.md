---
name: writing-plans
description: Write an implementation plan for work that needs multiple sessions, unclear sequencing, or durable tracking.
metadata:
  version: "1.0.0"
  license: MIT
---

# Writing Plans

Write a plan only when the task genuinely needs one: multi-step work with unclear
sequencing, multiple sessions, high-risk changes, or explicit tracking requirements.

For simple work, an inline note is enough. Do not force a formal plan on every task.

## When to write a plan

- Multiple implementation steps spanning files, layers, or sessions
- High-risk changes (breaking API, schema migration, irreversible side effects)
- Work with non-obvious sequencing or acceptance criteria
- The user explicitly requests a plan

## When not to write a plan

- Single-step or one-shot changes
- Work already covered by an approved plan with no open decisions

## Before writing

Confirm:
- The user-visible outcome and any useful optional way to verify it
- What is in scope and what is not
- Known risks or constraints

Ask concise clarifying questions if these are unclear.

## Plan structure

A good plan is self-contained and executable without the original conversation:

1. **Outcome** — what changes and how a human could optionally verify it
2. **Scope** — in-scope and explicitly out-of-scope
3. **Steps** — bite-sized tasks (one action each, in order)
4. **Verification support** — optional concrete command or check per step, plus an optional final verification
5. **Risks / rollback** — what could go wrong and how to recover
6. **Open decisions** — anything still unresolved

## Writing rules

- Use exact file paths — no placeholders like `TBD` or `fill in later`
- One step = one action. If a step covers two independent things, split it.
- Prefer test-first steps for behavior changes when that improves confidence.
- **Every step must have its own done condition** — a concrete observable result or, when useful,
  a runnable command/check that confirms this specific step. "Implemented" is not a done condition.
  "Running `node --test test/foo.test.js` passes" is one example.
- The done condition should be verifiable end-to-end when verification is available; a planned
  verification command is not a prerequisite for the feature owner to close the work.

## Self-review before handing off

- Does every requirement map to a step?
- Are all file paths and command names consistent?
- Is there a concrete optional verification artifact where one would improve confidence?
- Can someone execute this plan cold, without the chat history?

## After writing

Route to:
- `executing-plans` — to run it in the current session
- `harness` tracked feature — if the work needs multi-session progress tracking
