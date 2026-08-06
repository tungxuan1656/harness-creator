# AGENTS.md

# PROJECT

{{PROJECT_PURPOSE}}

Detected stack: `{{PROJECT_STACK}}`
Verify (quick): `./init.sh`
Verify (full): `./init.sh full`

## When to Run This Workflow

Run this workflow for implementation and bug-fix work. Skip it for questions, code review, and one-off lookups.

## Startup (code work only)

1. Run the quick verification and inspect recent history. Record any baseline failure. If it blocks the requested work, stop and ask; repair it only when authorized or when it is in the selected scope.
2. Run `./scripts/check-state.sh feature_index.json`, then read `feature_index.json` and the latest relevant block in `progress.md`.
3. If exactly one feature is `active`, read only `features/<active-id>.md` for its scope, dependencies, done criteria, and evidence. If none is active, the repository is idle; do not invent an active feature. If more than one is active, stop and resolve the state before coding.
4. Read `docs/README.md`, then load only the project documents relevant to the current task.

## Routing and invariants

- `feature_index.json` has at most one `active` feature. Zero active features means idle.
- An `active` feature must have its detail file, and every `depends_on` feature must be `done`. Do not activate work with unresolved dependencies.
- Keep implementation within the selected feature's scope and done criteria. A micro-change is not permission for unrelated work.
- The feature detail is the primary scope and evidence record. Use a linked detailed plan only when the work needs one.
- Keep this file as a concise map. Put durable project knowledge in documents listed by `docs/README.md`; add repository-specific rules here only when every coding task must see them.

- A small maintenance change outside an active feature requires explicit user scope. Record its files, verification, evidence, and next state in `progress.md`; when risk or intent is unclear, use a feature.

## Editing and verification

- Respect the target repository's Markdown convention. Write paragraphs and lists naturally by semantic unit; do not force 80-character wrapping. Never reflow unrelated text or alter code fences, tables, URLs, commands, or links.
- Run proportional, applicable verification and record the commands and evidence. Run `./init.sh full` before marking a feature done when it is configured or warranted by relevance and risk.
- Mark a feature done only after its done criteria, verification, and evidence are complete. Keep unknowns explicit.

## Blockers and end of session

If requested work is blocked, record the blocker in the relevant feature detail or `progress.md` and ask the user. Do not repair unrelated baseline failures without authorization.

1. Prepend a new block to `progress.md`; never rewrite old blocks.
2. For feature work, update the feature status and evidence. For a micro-change, include authorization, scope/files, verification, evidence, and next state; no feature-index change is needed unless state changed.
3. Leave the worktree according to the target repository's documented convention. Do not impose a commit policy here.

## Verification commands

{{VERIFICATION_COMMANDS}}

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
