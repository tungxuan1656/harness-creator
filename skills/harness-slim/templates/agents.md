# AGENTS.md

{{PROJECT_PURPOSE}}

Stack: [language + version]
Verify (quick): `./init.sh`
Verify (full):  `./init.sh full`

## When to Run This Workflow

**Skip for:** questions about the project, code review, one-off lookups.

**Run for:** implementing features, fixing bugs, any code changes.

## Startup Workflow (code work only)

1. `./init.sh` — environment health check
2. `git log --oneline -5` — recent state
3. Read `feature_index.json` — find active feat
4. Read `features/<active-id>.md` — objective + done criteria
5. Read first 10 lines of `progress.md` — prior session context

If baseline fails, repair it before adding new scope.

## Rules

- **One feature at a time**: pick exactly one `active` feature from `feature_index.json`.
- Run `./init.sh full` before marking any feature done.
- Commit when feat done: `feat(feat-XXX): <description>`
- WIP commit if session ends mid-feat: `wip(feat-XXX): <state>`
- **Stay in scope**: no changes outside current feature. Respect `depends_on` dependencies order.
- If baseline `./init.sh` fails, repair before adding new scope.

## Definition of Done

A feature is done only when ALL are true:

- [ ] All done criteria in `features/<id>.md` checked
- [ ] `./init.sh full` passes
- [ ] Evidence recorded in `features/<id>.md`
- [ ] Committed with descriptive message

## Blockers

Update `features/<id>.md`. Ask user.

## End of Session

1. Prepend new block to `progress.md` (never edit old blocks).
2. Update status in `feature_index.json`.
3. Commit.

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
