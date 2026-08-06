# AGENTS.md

{{PROJECT_PURPOSE}}

Stack: [language + version]
Verify (quick): `./init.sh`
Verify (full):  `./init.sh full`

## When to Run This Workflow

**Skip for:** questions about the project, code review, one-off lookups.

**Run for:** implementing features, fixing bugs, any code changes.

## Startup Workflow (code work only)

1. Classify the change as **feature work** or an eligible **micro-change**.
2. Run `./init.sh` and inspect `git log --oneline -5`. If baseline fails, repair it before adding scope.
3. For feature work, read `feature_index.json`, the active `features/<active-id>.md`, and the first 10 lines of `progress.md`.
4. For a micro-change, check `feature_index.json` for active work and read the first 10 lines of `progress.md`; do not create a feature or detailed plan unless the change is feature work.

Keep startup conditional: questions, reviews, and one-off lookups do not run this workflow.

## Rules

- **One feature at a time**: feature work picks exactly one `active` feature from `feature_index.json`.
- **Feature record is primary**: `features/<id>.md` is the feature's scope, short plan, done criteria, and evidence record. A detailed plan is only a linked supplement.
- **Micro-change is a planning shortcut only**: it never authorizes unrelated code work. It is limited to a bounded, non-behavior-changing maintenance change; an explicitly scoped exception requires direct user authorization. It must not change the active feature's state, scope, dependencies, or done criteria.
- Run `./init.sh full` before marking any feature done.
- Commit when feat done: `feat(feat-XXX): <description>`
- WIP commit if session ends mid-feat: `wip(feat-XXX): <state>`
- **Stay in scope**: no changes outside current feature. Respect `depends_on` dependencies order.
- **Dependency gate**: a non-done feature may be `active` only when every `depends_on` feature is `done`; dependent `todo` or `blocked` states remain valid.
- If baseline `./init.sh` fails, repair before adding new scope.

### Micro-change eligibility

Use a micro-change only for a small, well-understood, bounded maintenance change that does **not** involve:

- migrations;
- public API/contract changes;
- security/privacy/auth;
- concurrency/data integrity;
- multi-module work; or
- unclear behavior. An exception is allowed only when the user explicitly authorizes the exact scope; do not infer authorization.

If it affects the active feature's state, dependencies, scope, or done criteria, it belongs to that feature and is not a micro-change. When in doubt, use feature work. Run proportional applicable verification; run `./init.sh full` when configured checks, relevance, or risk demands it. Record the authorization, exact scope/files, verification commands and evidence, and next state in a new append-only `progress.md` block. Its entry does not require a commit hash.

## Definition of Done

A feature is done only when ALL are true:

- [ ] All done criteria in `features/<id>.md` checked
- [ ] `./init.sh full` passes
- [ ] Evidence recorded in `features/<id>.md`
- [ ] Committed with descriptive message

## Blockers

Update `features/<id>.md`. Ask user.

## End of Session

1. For feature work, prepend a new block to `progress.md` (never edit old blocks), update status in `feature_index.json`, and commit.
2. For a micro-change, prepend one structured block to `progress.md` (never edit old blocks) containing authorization, date, scope/files, evidence/verification, and next state. No feature-index update or commit hash is required in that entry.

---

## Verification Commands

```bash
{{VERIFICATION_COMMANDS}}
```

---

## Behavioral Guidelines

Reduce common LLM coding mistakes.

### Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly. Uncertain: ask.
- Multiple interpretations: present them, don't pick silently.
- Simpler approach exists: say so. Push back when warranted.
- Unclear: stop, name what's confusing, ask.

### Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" not requested.
- No error handling for impossible scenarios.
- 200 lines could be 50: rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't improve adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Notice unrelated dead code: mention it, don't delete it.
- Remove imports/variables/functions YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

Every changed line must trace directly to the request.

### Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

Multi-step tasks: state brief plan before starting:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Escalation

- **Architecture decisions**: check `docs/` if present, otherwise ask user.
- **Unclear requirements**: ask before implementing.
- **Repeated failures**: update `features/<id>.md`, flag for human review.
- **Scope ambiguity**: re-read `features/<id>.md` done criteria.
