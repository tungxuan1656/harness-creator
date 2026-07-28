---
name: task-router
description: Route tasks in v1.0 using the Direct, Tracked, and High-risk planned model on Node.js 20+.
license: MIT
---

# task-router v1.0

This is a **decision router**, not a mandatory project-management process for
every task. Its goal is to choose just enough record-keeping and verification,
clarify the work, and stop once the completion condition is met.

## Initial triage

Before selecting a mode, clarify briefly:

- the outcome the user wants;
- ambiguity, assumptions, and out-of-scope work;
- impact on behavior, contract, security/privacy, and side effects;
- the observable acceptance condition and expected verification.

Local instructions already loaded by the caller count as read. Otherwise, read
the nearest `AGENTS.md` and only the exact files relevant to the task. Do not
default to broadly reading docs, git history, architecture, or harness state.

If the outcome, scope, or verification cannot be established, ask before
selecting a mode. Do not turn assumptions into acceptance.

## Three modes

| Mode | Choose when | How to work |
| --- | --- | --- |
| **Direct** | The default for clear, bounded, reversible work that can finish in one session. | Create no harness tracking artifacts and no formal plan. State the small scope, done condition, and verification inline when useful. |
| **Tracked** | The work needs multiple sessions or a handoff; has substantial acceptance; involves multiple owners or milestones; needs a durable blocker/next action; or the user explicitly requests tracking. | Use or update only directly relevant artifacts in the manifest/spec/work set. Do not force global progress or plan updates. |
| **High-risk planned** | Migration; auth/security/privacy; a breaking API or schema; an irreversible data or external side effect; rollout/rollback; a dangerous sequence across multiple systems; or unresolved material uncertainty. | Create a compact plan with context/outcome, approach/milestones, verification, risk/rollback, and decisions/handoff. Do not impose a separate plan lifecycle or fixed-heading ceremony. |

Direct is the default, not a commitment at all costs. When scope expands,
acceptance grows, another owner appears, or new risk emerges, reclassify to
Tracked or High-risk planned. You may return to a lighter mode once uncertainty
and risk have been resolved with evidence.

## Canonical sources in Tracked mode

Apply the following rules only when the task actually uses tracking artifacts:

- `harness/manifest.json` is the feature registry and the only place that
  contains feature status.
- `docs/specs/<id>.md` is the source of truth for scope, behavior, and
  observable acceptance.
- `harness/work/<id>.json` is the derived execution record. Work contains
  `acceptanceResults`, `nextAction`, `completion`, and `schemaVersion: 1`; do
  not copy status, title, or blocker into work.
- `harness/checks.json` is the check registry; the validator and runner are the
  scripts designated by the registry/skill.

Do not create a competing canonical copy, change acceptance to make verification
green, or treat a log or file's existence as evidence. Report completion only
when acceptance and verification have checkable evidence. A blocker must state
its impact, what remains unverified, and the next action; never pretend to pass.

## Commands and checks

Run a command only when its result can change a decision, scope, or completion.
Do not repeat unchanged validation/checks without a new reason.

- Do not run the root initializer as a routine orientation step.
- Run `node harness/scripts/validate.mjs` only when using or changing tracked
  artifacts. Run it once for each meaningful state, and rerun it after a change
  that could affect the conclusion.
- Run `node harness/scripts/run-checks.mjs` only when a relevant configured
  check exists or acceptance requires it. Read the runner usage once per
  session, then select only the needed profile/check; do not run the entire
  registry by habit.
- Require effect approval only for effects of the selected check. The keys
  `network`, `writes`, `services`, `installs`, `secrets` and their corresponding
  flags must match the registry. Effect declarations are approval/audit
  metadata, **not a sandbox**.
- Do not invent a check that is absent from the registry. If a required check
  cannot run, report the unverified portion and the real blocker.

`harness-init` may be selected only after observing one specific missing
canonical scaffold artifact, or when the user has explicitly approved a
specific layout migration. Do not call it to repair general access,
dependencies, documentation, or capabilities. When it is called, preserve
harness-init's guarantees: missing-only, no-overwrite, and migration only with
explicit consent.

## Proportionate verification

| Work type | Appropriate minimum verification |
| --- | --- |
| Documentation/configuration | Review the diff, headings/paths/links, and relevant code samples. Run a syntax check only when the change could break a command or parser. |
| Narrow code | Run the nearest relevant test, syntax check, lint, or typecheck; add a boundary case when behavior gains a new branch. |
| Public/API behavior | Check successful and error contracts, input boundaries, backward compatibility, and observable output. |
| Cross-system | Run the relevant integration/fixture, check timeout/retry/cleanup, and grant approval only for selected effects. |
| High-risk | Confirm preconditions and owner approval; prefer dry-run/staging when available; verify rollback/recovery, failure modes, and the outcome after the side effect. |

Verification should record the command, exit/result, and path/evidence when
possible. Do not call a check “pass” when the baseline is failing without
establishing attribution. If required verification is unavailable or
inaccessible, stop and report a blocker.

## When to stop, ask, or block

Stop as soon as acceptance and verification are reached; do not add speculative
cleanup. Ask the user, block, or replan when any of the following occurs:

- material ambiguity about outcome, scope, authority, or acceptance;
- an unapproved side effect or irreversible action;
- overlapping local changes whose ownership or merge safety cannot be established;
- missing required access, secret, dependency, or environment;
- a baseline failure that cannot be attributed to the current change;
- the same failure repeats without new evidence;
- required verification is unavailable or its result cannot be trusted.

A blocker must have a concrete impact and next action. Do not retry forever,
lower the acceptance threshold, swallow stderr/exit codes, or change modes to
hide risk.

## Route and completion report

The route result should be short but sufficient for the implementer to understand
the decision:

```text
mode: Direct | Tracked | High-risk planned
outcome: <desired outcome>
scope: <specific artifact/code/doc; non-goal if needed>
done when: <observable condition>
verification: <command/check or reason not run>
artifacts: <only relevant sources, if any>
escalation: <none or trigger to watch>
```

The completion report needs only:

```text
mode: <mode used>
scope/change: <what changed>
verification/evidence: <result and evidence path>
blockers/uncertainty: <none or impact + next action>
```

Do not turn routing into a mandatory status matrix, broad reconnaissance,
global updates, or blanket check execution. Report honestly what was done, what
remains unverified, and the next decision.
