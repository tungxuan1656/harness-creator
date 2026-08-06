## Summary

<!-- What does this change do, and why? -->

## Changed paths

-

## Validation

<!-- Include exact commands and results. -->

- [ ] `node --check skills/harness-slim/scripts/create-harness.mjs`
- [ ] `node --check skills/harness-slim/scripts/validate-harness.mjs`
- [ ] `node --check skills/harness-slim/scripts/lib/harness-utils.mjs`
- [ ] `bash -n skills/harness-slim/scripts/check-state.sh`
- [ ] `bash -n skills/harness-slim/templates/init.sh`
- [ ] Generated state check: `./scripts/check-state.sh feature_index.json`
- [ ] End-to-end harness creation + validation scores 100/100

## Checklist

- [ ] Documentation uses accurate paths and commands.
- [ ] Baseline failures are reported rather than repaired outside the selected scope.
- [ ] No universal commit policy is imposed; repository convention is followed.
- [ ] No secrets, personal data, editor files, or unrelated generated artifacts included.
- [ ] README updated if user-facing paths or usage changed.
