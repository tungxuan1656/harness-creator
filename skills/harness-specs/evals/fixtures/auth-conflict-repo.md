# Authentication-conflict repository fixture

Repository state before the task:

```text
AGENTS.md
docs/README.md
docs/requirements/auth.md
docs/specs/authentication.md
src/auth/validate-token.js
test/auth/validate-token.test.js
notes/release.md
```

- Accepted requirement `AUTH-7` says a revoked token returns
  `401 Unauthorized` and creates no session.
- The current canonical spec incorrectly presents `403 Forbidden` as intended.
- `validate-token.js` and its representative test currently return/assert 403;
  they are observed implementation evidence, not accepted authority.
- Active-token and missing-token behavior agree across requirement, code, and
  tests.
- `docs/README.md` already routes authentication changes to the canonical spec.
- `notes/release.md` has an unrelated unstaged human edit.

The evaluator should commit the baseline and dirty only the release note before
invoking the skill. Implementation and tests must remain unchanged.
