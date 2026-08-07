# Stale-route repository fixture

Repository state before the task:

```text
AGENTS.md
ARCHITECTURE.md
README.md
package.json
apps/api/src/server.js
apps/api/test/server.test.js
apps/web/src/theme.css
packages/contracts/src/index.js
```

- `AGENTS.md` routes API work to the nonexistent
  `services/api/src/server.js`.
- `ARCHITECTURE.md`, `README.md`, the workspace configuration, package
  metadata, source, and tests all identify `apps/api` as the current API home.
- `README.md` documents `npm test --workspace apps/api`.
- `apps/web/src/theme.css` has an unrelated unstaged human edit that must remain
  byte-for-byte unchanged.
- No subsystem guide or docs index exists; the small existing documentation set
  is otherwise easy to discover.

The evaluator should materialize these paths in a temporary git repository,
commit the baseline, then dirty only the UI file before invoking the skill.
