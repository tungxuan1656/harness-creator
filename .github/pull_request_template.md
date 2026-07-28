## Summary

<!-- What does this change do, and why? -->

## Changed paths

-

## Validation

<!-- Include exact commands and results. -->

- [ ] `node --check skills/harness-init/scripts/create-harness.mjs`
- [ ] `node --check skills/harness-init/templates/harness/scripts/validate.mjs`
- [ ] `node --check skills/harness-init/templates/harness/scripts/run-checks.mjs`
- [ ] `node --input-type=module --check < skills/harness-init/templates/init.mjs.tmpl`
- [ ] Dry-run creator command completed without modifying the checkout

## Checklist

- [ ] Documentation uses accurate paths and commands.
- [ ] Structural `schemaVersion: 1` values were not changed as release versions.
- [ ] No secrets, personal data, editor files, or unrelated generated artifacts are included.
