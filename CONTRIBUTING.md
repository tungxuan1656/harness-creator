# Contributing

Thank you for helping improve harness-slim. Contributions should keep the skill dependency-free, preserve the five-subsystem harness contracts, and make behavior or documentation easier to verify.

## Before opening a change

1. Read `skills/harness-slim/SKILL.md` and the relevant reference files under `skills/harness-slim/references/`.
2. Check the current state with `git status --short`.
3. Keep a change focused — one concern per PR.
4. Don't add package-manager metadata, CI workflows, badges, or generated artifacts unless a separate requirement calls for them.

## Documentation and skill changes

- Write public documentation in English.
- Preserve exact file paths, command names, JSON field names, and script behavior when editing skill instructions.
- When changing a contract (e.g., `feature_index.json` schema), update the templates, scorer logic in `harness-utils.mjs`, and SKILL.md together.
- Don't weaken a validator check merely to make validation pass — fix the template or scorer properly.

## Local validation

Run from the repository root:

```bash
# Syntax check all scripts
node --check skills/harness-slim/scripts/create-harness.mjs
node --check skills/harness-slim/scripts/validate-harness.mjs
node --check skills/harness-slim/scripts/lib/harness-utils.mjs
bash -n skills/harness-slim/scripts/check-state.sh
bash -n skills/harness-slim/templates/init.sh

# End-to-end: create a harness in a temp dir and validate it
TMPDIR=$(mktemp -d)
node skills/harness-slim/scripts/create-harness.mjs --target "$TMPDIR"
node skills/harness-slim/scripts/validate-harness.mjs --target "$TMPDIR"
rm -rf "$TMPDIR"
```

The end-to-end validation must score 100/100 with no bottleneck on an unmodified checkout.

## Pull requests

- Describe the motivation and list the important paths changed.
- Include exact validation commands and their output.
- Update `README.md` or `skills/harness-slim/README.md` when user-facing paths or usage change.
- Review diffs for accidental personal data, local paths, editor files, and unrelated cleanup before submitting.

## Scope

This repo contains `harness-slim` and 10 curated companion skills. PRs should stay within those skills. For new companion skills, open an issue first to discuss whether they belong here. PRs touching companion skills should not modify their upstream source logic — only the integration notes or `SKILL.md` references that are specific to this harness.
