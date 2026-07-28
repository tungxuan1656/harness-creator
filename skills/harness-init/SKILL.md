---
name: harness-init
description: Initializes a dependency-free v1.0 harness for Node.js 20+ under a strict JSON contract.
license: MIT
---

# Harness Init v1.0

## Principles

This skill creates the canonical harness for a Node.js 20+ repository. It does
not install dependencies, run application migrations, or automatically add
another data model.

- **Recon-first**: inspect the root, `AGENTS.md`, architecture, manifest, spec,
  plan, references, and existing harness state before making changes.
- **Missing-only**: create only missing artifacts, report `CREATE`/`SKIP`, and
  use no-overwrite behavior.
- **Intentional old-layout migration**: recognize only `.agents/harness` and
  `cairn`; stop by default, add the canonical tree only when the caller passes
  `--migrate-old-layout`, and preserve the old data.
- The JSON manifest/work/check files are canonical state; do not infer state
  from logs, filenames, or comments.
- Do not create empty directories or placeholder files in the target. Create
  optional artifacts only when they have content.
- The optional entrypoint is the root `init.mjs`; do not use or generate `init.sh`.

## Creator workflow

Always dry-run first, inspect the output, then perform the real run with the
same metadata:

```sh
node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Repository purpose" \
  --verification-command "node --test" \
  --dry-run

node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Repository purpose" \
  --verification-command "node --test"
```

The creator requires the target to exist. It identifies a canonical root
`harness` by its `schemaVersion: 1` and `features` array; it does not infer one
from scattered schemaVersion files. When a canonical root already exists, the
creator augments only missing gaps.

Init is copied only with `--with-init` together with `--start-argv` and
`--smoke-argv` as explicit JSON arrays; `--readiness-url` is optional HTTP(S):

```sh
node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo --purpose "Repository purpose" --verification-command "node --test" \
  --with-init \
  --start-argv '["node","server.mjs"]' \
  --smoke-argv '["node","smoke.mjs"]' \
  --readiness-url 'http://127.0.0.1:3000/health'
```

Init uses `spawn` with argv and `shell:false`, applies a readiness time limit,
captures and displays output, and cleans up the process with `SIGTERM`; it does
not use a shell, install, or migrate.

## Canonical target tree

```text
AGENTS.md
ARCHITECTURE.md                                      # optional
init.mjs                                              # optional root entrypoint
harness/
  manifest.json
  checks.json
  progress.md
  schemas/{manifest,checks,work}.schema.json
  scripts/{validate,run-checks}.mjs
  work/<id>.json
  work/receipts/*.json                                # only after a check has actually run
docs/
  specs/<id>.md
  plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md
  references/<topic>.md
```

`ARCHITECTURE.md`, the root `init.mjs`, docs, work, and receipts are optional.
Do not create empty directories just to hold a place. Optional gate artifacts
(fixtures, snapshots, receipts, documentation) are meaningful only when the
spec names them with an acceptance ID and the evidence identifies the path and
command being checked.

## Ownership v1.0

The manifest registers only tracked Tier 2/3 features; Tier 0/Tier 1 are not
manifest entries. The top-level manifest contains exactly `schemaVersion`,
`mode`, and `features`, with `schemaVersion: 1` and mode `sequential` or
`parallel`. Each feature has exactly:
`id`, `order`, `status`, `owners`, `dependsOn`, `spec`.

- `owners` is a non-empty array of strings.
- `dependsOn` contains unique IDs that must exist and must not point to itself.
- `spec` is always exactly `docs/specs/<id>.md`; the spec is the source of truth
  for the title, behavior, and acceptance.
- Valid statuses: `proposed`, `planned`, `active`, `blocked`, `completed`,
  `cancelled`, `superseded`.
- The work path is derived and is not recorded in the manifest:
  `harness/work/<id>.json`.
- Sequential mode allows at most one `active` or `blocked` feature; hard
  prerequisites of `active`/`blocked`/`completed` features must be `completed`,
  and earlier orders must be terminal.

Work stores only execution results; it does not store the title, prose, status,
or blocker. Work has exactly the top-level keys `schemaVersion: 1`, `id`,
`acceptanceResults`, `nextAction`, and `completion`. A result has exactly `id`,
`met`, and `evidence`, where evidence is a string or null. `nextAction` is a
string or null. Completion is null or an object containing only `verifiedAt`,
`completedAt`, `cancellationSummary`, and `supersededBy`.

- `active`/`blocked` require a non-empty `nextAction`.
- `completed` requires `nextAction: null`, two ISO UTC timestamps, and every
  acceptance met with evidence.
- `cancelled` requires `nextAction: null` and a non-empty
  `cancellationSummary`.
- `superseded` requires `nextAction: null` and a `supersededBy` ID that exists
  and is not the feature itself.
- All other statuses have `completion: null`.

Specs use stable acceptance lines such as `- [a1] Observable condition`. The
validator compares the exact acceptance ID sequence between the spec and work.
JSON Schema describes only the structural shape; `validate.mjs` enforces the
semantic and cross-file rules.

## Anti-cheat

Do not mark `met: true` or completed because a file exists, code looks correct,
a command was tried, output was hidden, or a receipt only proves that a command
was spawned. Do not change acceptance IDs, weaken assertions, omit checks,
swallow stderr/exit codes, use shell injection, `|| true`, `; true`, fake mocks,
or modify the validator to bypass a gate. Without evidence, keep `met: false`,
record a concrete next action, and do not change the status to completed.

## Checks and local knowledge

`checks.json` has `schemaVersion: 1`. Each check has exactly `id`, `argv`,
`cwd`, `quick`, `requiredByDefault`, `timeoutMs`, and `declaredEffects`; effects
are an exact boolean object with `network`, `writes`, `services`, `installs`,
and `secrets`. `quick: true` is reserved for checks with no effects. The runner
validates first and spawns argv with `shell:false`; quick runs only quick-safe
checks, while full runs checks that are required by default and requires the
corresponding effect flags. Cwd must be inside the root; receipts are written
only to `harness/work/receipts/`. An empty registry means verification is
incomplete, not a pass.

`AGENTS.md` is a roughly 100-line map covering scope, source of truth,
invariants, validator/runner commands, spec/plan/reference locations, work, and
the progress workflow. `ARCHITECTURE.md` and `docs/references/` are repository-
local knowledge; read them after recon and before a plan, and do not treat local
assumptions as global policy.

ExecPlans use standard frontmatter and have the exact lifecycle `draft | ready |
active | blocked | paused | completed | cancelled | superseded`. Compatibility
with the parent feature is:
`proposed → draft`; `planned → draft/ready`; `active → draft/ready/active/blocked/paused`;
features `completed`/`cancelled`/`superseded` have no nonterminal plan. An
`active` or `blocked` plan requires an `active` parent, a `ready` plan requires
an `active` or `planned` parent, and hard `dependsOnPlans` are satisfied only by
a `completed` plan.

## Local testing guidance

```sh
node --check harness-init/scripts/create-harness.mjs
node --check harness-init/templates/harness/scripts/validate.mjs
node --check harness-init/templates/harness/scripts/run-checks.mjs
node --input-type=module --check < harness-init/templates/init.mjs.tmpl
node harness-init/scripts/create-harness.mjs . \
  --repo-name harness-init --purpose "skill package" \
  --verification-command "node --check" --dry-run
```
