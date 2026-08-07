# Hybrid-adoption repository fixture

Existing repository capabilities:

```text
AGENTS.md                     # useful project rules, stale navigation
docs/architecture.md         # incomplete topology
docs/specs/billing.md        # current canonical behavior
package.json                 # real but fragmented checks
src/
test/
notes/user-work.md            # unrelated unstaged edit
```

- Agents repeatedly choose the wrong application entry point, so Map is
  justified.
- Lint, type, and test commands are real but fragmented and no affected path is
  documented, so Verify is justified.
- Billing behavior is current, sufficiently documented, and discoverable;
  Specs is not justified.
- Current work is clear and one-session, with no repository-native planned
  backlog or persistence need; Features is not justified.
- No stale-state, migration, or recurring-pattern evidence independently
  justifies Garden.
- The unrelated dirty note must remain byte-for-byte unchanged.

Legacy migration variant: add `progress.md`, a priority-bearing feature index,
an at-most-one-active rule, a public `doctor` mode, and a Bash-plus-`jq`
checker. Preserve project-specific content while migrating obsolete assumptions
only after the owning replacement phase is valid.
