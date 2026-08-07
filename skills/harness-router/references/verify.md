# Verify Fallback Phase

Use this reference only when `harness-verify` cannot be composed. Keep
verification-interface design isolated until its gates pass, then return to the
router.

## Inputs and Preconditions

Require:

- a concrete feedback problem such as fragmented commands, unclear coverage,
  missing affected feedback, unsafe execution, or legacy adapter drift;
- real native checks or an explicit decision to report their absence;
- user mutation authority, safety constraints, and the original git status;
- completed map outputs only to locate topology and instructions.

Own fallback generation and rerun behavior for a thin agent-facing adapter,
conditional helpers, quick/affected/full semantics, changed-file discovery,
bounded impact mapping, compact results, failure propagation, existing garden
check composition, and one minimal instruction-command patch.

Prefer a stable agent-friendly native Make, Taskfile, Nx, Turbo, Gradle,
package-manager, or similar interface. Add no wrapper when native commands
already satisfy the contract. Publish no runnable adapter in near-empty
greenfield before real checks exist.

## Inspection Budget

Inspect:

1. canonical instructions and verification routes;
2. manifests, lockfiles, workspace/build configuration, language/tool versions,
   and native command definitions;
3. CI only far enough to identify canonical gates, changed ranges, services,
   and environment assumptions;
4. representative lint, type, test, build, and integration configuration;
5. native dependency or affected facilities before custom mapping;
6. existing garden checks and when they apply, without redefining them;
7. databases, emulators, ports, fixtures, credentials, network access, shared
   state, and cleanup constraints;
8. existing adapters and their correct, stale, missing, conflicting, or
   uncertain behavior.

Classify checks by real command, purpose, required/optional/N/A status, cost,
coverage, environment, mutation risk, concurrency, and cleanup.

Stop when commands, local/CI change discovery, conservative bounded impact
mapping, fallback behavior, and integration constraints are clear. Stop before
building a second dependency engine.

## Stable Interface

Expose these meanings through native commands or a thin adapter:

- `quick`: cheap syntax/config/static/smoke health for startup and early
  iteration;
- `affected`: normal post-change feedback covering changed components,
  dependents, shared configuration, and relevant structural checks;
- `full`: the repository's canonical gate for risk, merge, or milestone use.

Do not expose a public `doctor` mode. Keep targeted native commands available
for tight feedback.

Define change discovery explicitly:

- use an explicit caller scope when supplied;
- include staged, unstaged, and untracked files in the local default;
- use the repository's configured base or merge-base in CI;
- account for old and new paths for renames/deletes;
- widen for lockfiles, root config, shared schemas, generators, build tooling,
  common packages, unknown paths, or contradictory graph evidence;
- require explicit scope or a broader safe check without usable git context.

Use native affected tooling first. Permit only small repository-evidenced
custom mappings with reverse dependents and a defined conservative fallback.
Resolve explicit paths against the documented caller directory, normalize them,
and reject any path that escapes the repository before mapping or dispatch.
Preserve deleted paths when the explicit or git scope names them. Parse paths as
data and never use unsafe `eval`.

## Workflow

1. Declare the feedback pain point, repository scope, and safety boundary.
2. Audit native commands, CI, topology, changed-range rules, structural checks,
   existing adapters, and integration resources.
3. Decide to reuse, create, migrate, patch, or make no change.
4. Assign only real checks to quick, affected, and full; label each required,
   optional, or N/A.
5. Define local, explicit, and CI change-set behavior and conservative widening.
6. Implement an adapter only to resolve root, validate mode/scope, show concise
   help, dispatch native tools/helpers, and preserve exits, signals, and cleanup.
7. Split helpers only for multiple toolchains, bounded mapping, services,
   concurrency, reusable dispatch, or compact log capture.
8. Compose an existing deterministic garden check for applicable harness,
   docs, feature-state, completion, affected, or full triggers. Do not invent
   garden invariants here.
9. Patch only the existing instruction verification route and validate every
   added path and command.
10. Directly test syntax, success, required failure, invalid input, nested
    invocation, path whitespace, repository-escape rejection, widening, failure
    propagation, cleanup, and structural composition when implemented.
11. Review the diff for copied build logic, false passes, unsafe evaluation,
    unbounded graphs, noisy output, invented checks, and unrelated rewrites.

Make no change when the current native interface already passes the gates.

## Result and Safety Rules

- Keep success output compact and failure excerpts actionable.
- Retain recoverable full-log paths only when real logs are captured.
- Return nonzero when any required job fails; never let summaries hide status.
- Report missing required tools as failures and missing optional tools as
  warning/N/A. Never call an absent test suite passed.
- Bound concurrency and serialize jobs sharing mutable resources.
- Install no dependencies, contact no production systems, and reset no
  non-disposable data without separate authorization.
- Distinguish pre-existing baseline failures from introduced failures.

## Mutation Boundary

Modify verification artifacts and one existing instruction command route. Do
not change product code, specs, feature content, architecture maps, garden
definitions, broad CI, or dependencies. Preserve working custom modes behind
the stable public interface and report ambiguous canonical-gate intent.

## Quality Gate

Require all applicable conditions:

- Every documented mode and command exists and help matches behavior.
- Modes delegate only to real checks; invalid input fails.
- Local discovery covers staged, unstaged, and untracked files; CI is explicit.
- Explicit paths resolve from the documented caller and repository escapes fail
  with an actionable usage error before any check runs.
- Unknown, shared, renamed, and deleted paths widen conservatively.
- Native graph tooling is reused or custom mapping stays small and auditable.
- Required, optional, and N/A results remain distinct; failures propagate.
- Structural checks remain garden-owned and run only when applicable.
- Output, retained logs, services, signals, and cleanup are truthful and safe.
- Instruction routes expose current commands; the diff is rerun-safe.

Inspect actual command output and exit status before claiming a pass. State
which native gates were not run.

## Close the Phase

Return to the router with reused and changed commands; local/explicit/CI
affected behavior and fallback; omitted adapters or checks; result
classification; safety or baseline decisions; and verification actually run.
Do not debug product failures here.
