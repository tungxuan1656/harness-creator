---
name: executing-plans
description: Execute an existing written plan step by step, with optional verification checkpoints.
metadata:
  version: "1.0.0"
  license: MIT
---

# Executing Plans

Load the plan, review it critically, execute step by step, and use its optional verification support
without treating verification as a close gate.

## Process

1. **Read the plan completely.** Raise any concerns before starting — do not guess through ambiguity.
2. **Execute each step in order.** Mark steps done as you go.
3. **Run planned verification after each step that changes observable behavior when useful.**
4. **Stop and ask** when blocked — a missing dependency, an unclear instruction, or a failure that
   materially prevents the requested change. Report failed optional checks without turning them into
   a close gate.

## When to stop and escalate

Go back to `brainstorming` or `writing-plans` when execution reveals:
- Invalid assumptions in the plan
- Missing acceptance criteria
- Unexpected constraints that change the approach

## Completion

If the plan specifies a final verification, run it before reporting that verification result. Use
`verification-before-completion` when useful and record evidence when available. The feature owner may
close the work without running the planned verification or recording a reason.

If stopping mid-plan, write a handoff using `handoff`.
