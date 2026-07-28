# Contributing

Thank you for helping improve Harness Skills. Contributions should keep the
repository dependency-free, preserve the canonical harness contracts, and
make behavior or documentation easier to verify.

## Before opening a change

1. Read the relevant `SKILL.md` and supporting reference files.
2. Check the current repository state with `git status --short`.
3. Keep a change focused. Do not add package-manager metadata, CI workflows,
   badges, or generated artifacts unless a separate requirement calls for them.
4. For version changes, update every release/skill-version reference identified
   by the skill package. Do not change structural `schemaVersion: 1` values in
   generated JSON; that field is a schema contract, not a release version.

## Documentation and skill changes

Public repository documentation should be written in English. Existing
inner skill guidance may remain in its established language. Preserve exact
paths, command names, JSON field names, and safety requirements when editing
skill instructions.

When changing a contract, update the corresponding schema, reference guidance,
templates, and validation behavior together. Avoid weakening a validator or
removing a check merely to make validation pass.

## Local validation

Run these commands from the repository root:

```sh
node --check skills/harness-init/scripts/create-harness.mjs
node --check skills/harness-init/templates/harness/scripts/validate.mjs
node --check skills/harness-init/templates/harness/scripts/run-checks.mjs
node --input-type=module --check < skills/harness-init/templates/init.mjs.tmpl
node skills/harness-init/scripts/create-harness.mjs . \
  --repo-name harness-init \
  --purpose "skill package" \
  --verification-command "node --check" \
  --dry-run
```

The final command must remain a dry run when run against this source
repository. It should report the files that would be created without changing
the checkout.

## Pull requests

Describe the motivation, list the important paths changed, and include the
exact validation commands and exit results. Update the README or relevant
skill references when user-facing paths or usage change. Review generated
diffs for accidental personal data, local paths, editor files, and unrelated
cleanup before submitting.
