# Manifest, work, and schemas

Files under `templates/schemas/` are JSON Schema Draft 2020-12 definitions of
the structural shape. The schema does not itself determine file existence,
lifecycle, prerequisites, or correspondence between spec and work;
`harness/scripts/validate.mjs` enforces the semantic/cross-file rules.

## Canonical manifest

```json
{
  "schemaVersion": 1,
  "mode": "sequential",
  "features": [
    {
      "id": "example-feature",
      "order": 1,
      "status": "planned",
      "owners": ["team-example"],
      "dependsOn": [],
      "spec": "docs/specs/example-feature.md"
    }
  ]
}
```

Every manifest entry is a tracked Tier 2/3 feature. Tier 0/Tier 1 features are
not registered. The manifest has no title, behavior, acceptance prose, or work
path. The spec path is always derived from the ID and is the sole source of
truth for the title, behavior, and acceptance.

Valid statuses are `proposed`, `planned`, `active`, `blocked`, `completed`,
`cancelled`, `superseded`. `owners` is a non-empty array of strings.
`dependsOn` is an array of unique IDs; every ID must exist and must not point to
itself. Sequential mode has one active/blocked slot; hard prerequisites of
active/blocked/completed features must be completed.

## Canonical work

The work path is derived as `harness/work/<id>.json`. Its top level has exactly:
`schemaVersion`, `id`, `acceptanceResults`, `nextAction`, and, when supplied,
`completion`; its schemaVersion is 1. Each acceptance result has exactly `id`,
`met`, `evidence`, where evidence is a string or null. `nextAction` is a string
or null. Completion metadata is optional and, when supplied, may contain only
`verifiedAt`, `completedAt`, `cancellationSummary`, and `supersededBy`, each a
string or null.

Active/blocked requires a non-empty next action. Completed requires
`nextAction: null` for lifecycle consistency, but does not require acceptance
results to be met, evidence, a completion object, timestamps, or an explanation.
The feature owner decides whether the feature is done; self-test, code review,
validation, and evidence are optional confidence sources. Cancelled requires
`nextAction` null and a non-empty `cancellationSummary`. Superseded requires
`nextAction` null and an existing `supersededBy` that is not the feature itself.
Other non-terminal statuses use `completion: null` when the field is present.

Work does not repeat the title, behavior, acceptance prose, status, or blocker.
When recorded, evidence must be a checkable command/path/result/receipt; spawning
a command is not acceptance. `met: true` still requires non-empty evidence, but
verification evidence is not a prerequisite for closing a feature.

## Spec and acceptance

A spec has an identity heading and stable lines:

```markdown
# Feature: example-feature

## Acceptance criteria
- [a1] Validator rejects an unknown key.
- [a2] Runner writes an observable receipt.
```

The validator reads IDs in exact order and requires work to match the exact
sequence. Acceptance criteria define useful scope and verification targets; they
are not a close gate. To change behavior, change the canonical spec first; do
not edit work to make a quality check appear green.

## Checks

```json
{
  "schemaVersion": 1,
  "checks": [
    {
      "id": "safe-check",
      "argv": ["node", "--test"],
      "cwd": ".",
      "quick": true,
      "requiredByDefault": true,
      "timeoutMs": 120000,
      "declaredEffects": {
        "network": false,
        "writes": false,
        "services": false,
        "installs": false,
        "secrets": false
      }
    }
  ]
}
```

`argv` is a direct array for `spawn`, not a shell string. Quick selects only
safe checks; full selects required-by-default checks and requires explicit
effect flags.
