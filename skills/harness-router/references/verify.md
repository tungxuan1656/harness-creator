# Verify Fallback Phase

<!-- Generated from `skills/harness-verify/SKILL.md` by
`scripts/sync-harness-phases.mjs`. Do not edit directly. -->

Use this reference only when `harness-verify` cannot be composed. The phase
rules below are identical to the independently installable specialist. Keep the
phase isolated until its quality gates pass, then return control to the router.

## Purpose

Create the smallest stable feedback interface that lets an agent answer:

- Which cheap check confirms basic repository health?
- Which checks cover the current change and its dependents?
- Which command represents the repository's canonical gate?
- Which checks were required, optional, not applicable, passed, or failed?
- What evidence supports the result?

Keep this invocation isolated to verification design. Read build topology and
native tools, not product behavior, unless accepted work explicitly names a
required check. Do not drift into feature planning, architecture mapping,
product debugging, semantic gardening, or broad CI redesign.

## Own the Verification Interface

Own generation and rerun behavior for:

- a thin agent-facing adapter, defaulting to `init.sh` when one is justified;
- conditional verification helpers or focused configuration;
- the `quick`, `affected`, and `full` mode contract;
- changed-file discovery and bounded affected mapping;
- compact summaries, failure propagation, cleanup, and retained logs;
- composition of existing garden-owned structural checks;
- the minimal verification-command patch in the canonical agent instructions.

Prefer a useful repository-native interface over the default name. Do not add
`init.sh` when an existing Make, Taskfile, Nx, Turbo, Gradle, package-manager,
or other command is already stable, discoverable, fast enough, and friendly to
agents. If compatibility requires an adapter, keep it as a delegate.

Do not create runnable commands before real checks exist. In a near-empty
greenfield repository, report the missing build/test scaffold and make no
verification artifact rather than publishing commands that only look real.

## Inspect Verification Evidence

Inspect before asking questions or writing:

1. Read git status and preserve unrelated changes.
2. Locate the canonical agent instruction entry point and existing verification
   routes.
3. Inspect the root tree, manifests, lockfiles, workspace declarations, build
   configuration, and language/tool versions.
4. Read native command definitions in Makefiles, Taskfiles, package scripts,
   project files, and repository helpers.
5. Read CI only far enough to identify canonical gates, changed-range
   conventions, required services, and environment assumptions.
6. Locate test, lint, type, build, and integration configuration plus the
   smallest representative checks.
7. Prefer the repository's native dependency graph or affected command. Infer a
   static mapping only when topology is simple and evidence is explicit.
8. Locate garden-owned structural checks and determine when they apply. Do not
   implement their invariants in this phase.
9. Identify shared databases, emulators, ports, fixtures, credentials, network
   access, and setup/cleanup constraints before composing jobs.
10. Read any existing adapter and classify each relevant behavior as correct,
    stale, missing, conflicting, or uncertain.

Classify candidate checks by:

- command and owning native tool;
- purpose stated accurately;
- required, optional, or not applicable status;
- cost and intended mode;
- component and reverse-dependency coverage;
- local and CI environment requirements;
- mutation, service, concurrency, and cleanup risk.

Ask only when missing information materially changes a required gate, affected
coverage, safety, or the public interface. Stop inspection when native commands,
change discovery, bounded impact mapping, and integration constraints are clear.
Stop before reconstructing a substantial dependency engine.

## Make the Artifact Earn Its Cost

Choose one outcome:

| Evidence | Action |
|---|---|
| Existing commands already provide a clear stable interface | Reuse them; patch only discoverability when needed |
| Commands are sound but fragmented | Add a thin adapter that delegates |
| A native affected facility exists | Expose it rather than remapping the graph |
| Topology is simple and no native affected facility exists | Add a small evidence-backed mapping with a conservative fallback |
| Topology or impact is uncertain | Widen to a broader native check |
| No real checks exist yet | Make no runnable adapter; report the prerequisite |

Do not create helpers merely to place one command in each file. Split logic out
of the adapter only for multiple toolchains, non-trivial but bounded affected
mapping, service lifecycle, bounded parallelism, reusable dispatch, or compact
log capture.

## Define the Stable Modes

Expose these semantics, whether through `init.sh` or a repository-native
equivalent:

### `quick`

Run cheap startup and early-iteration health checks:

- syntax or configuration validation;
- a fast type or static check;
- the smallest useful smoke test.

Allow no-argument invocation to mean `quick` only when compatibility or local
convention benefits. After a code change, direct agents to a targeted native
check or explicit `affected`, not an ambiguous default.

### `affected`

Make this the normal post-change path. Derive the change set, map it to impacted
components plus dependents and shared configuration, then run the relevant
native lint, type, test, build, integration, and structural jobs. Widen whenever
coverage is uncertain.

### `full`

Run the canonical repository gate represented by existing conventions and CI.
Include cheap applicable structural hygiene when native gates do not already
cover it. Reserve this mode for merge or milestone conventions and high-risk
changes; do not make every edit pay its cost.

Do not expose a public `doctor` mode. Garden owns hygiene definitions; verify
only composes deterministic checks into relevant lifecycle paths.

Keep targeted native commands available for tight inner-loop feedback. The
three modes are a stable agent interface, not a replacement for focused tests.

## Define the Change-Set Contract

Define changed files explicitly for each environment:

1. Prefer an explicit caller-provided file list, target, or native affected
   scope when supplied.
2. For the local default, include staged, unstaged, and untracked files.
3. For CI, use the repository's configured base, event range, or merge-base.
4. For renames and deletes, map both old and new areas when they can affect
   coverage.
5. Treat lockfiles, root configuration, shared schemas, generators, build
   tooling, and common packages as widening signals.
6. Without usable git context, require explicit scope or run a broader safe
   check.

Document the chosen explicit-scope mechanism instead of inventing a universal
flag syntax. Deduplicate overlapping sources. Parse paths as data, preserve
spaces and metacharacters, and prefer NUL-delimited machine output where the
tool supports it. Resolve explicit paths against the documented caller
directory, normalize them, and reject any path that escapes the repository
before mapping or dispatch. Preserve deleted paths when the explicit or git
scope names them. Never execute a path or caller value through unsafe `eval`.

Do not use one ambiguous `git diff` form for local changes, committed branch
changes, and CI. State exactly what each path covers and what makes it widen.

## Keep Affected Mapping Conservative and Bounded

Apply this order:

```text
changed files
  -> native affected/dependency facility when available
  -> small repository-evidenced component mapping when necessary
  -> reverse dependents and shared configuration impact
  -> relevant native jobs
  -> conservative broader fallback when uncertain
```

Use existing Nx, Turbo, Gradle, Bazel, Make, workspace, or equivalent graph
knowledge before writing custom traversal. A small static mapping such as a
shared package to a known set of applications is acceptable when it is easy to
audit. Define the fallback before implementing the mapping.

Widen when:

- a changed path is unknown or matches more than one component;
- a root, lock, build, generator, schema, or shared configuration changes;
- dependency metadata is missing, stale, or contradictory;
- a rename or deletion invalidates the normal route;
- a public API, persistence schema, authentication boundary, or shared contract
  crosses components;
- maintaining the custom graph is approaching build-system complexity.

Never silently skip an unknown path. Prefer one broader native check to a
precise-looking false pass.

## Implement a Thin Adapter

Keep the adapter limited to:

1. Resolve the repository root independent of the caller's working directory.
2. Parse and validate the mode and any documented explicit scope.
3. Print concise help for invalid input and exit with a usage error.
4. Dispatch to native tools or conditional helpers.
5. Preserve command failures, signals, and cleanup behavior.

Use a runtime already reliable in the repository. Do not add `jq`, Python,
Node, or another runtime solely for the adapter when a current native runtime
or simpler shell is sufficient. Avoid copying native lint/test/build command
definitions into several helpers.

For a single delegated job, preserve its exit status. For aggregated jobs,
retain each job's result, return nonzero when any required job fails, and never
let summary generation mask the failure. Forward termination signals and clean
up only resources the adapter started.

Make every mode's help and behavior agree. Reject unknown modes rather than
falling through to a cheaper or successful check.

## Classify and Schedule Jobs Honestly

Label every check as required, optional, or not applicable for the active mode
and change:

- Treat a missing required tool or check as failure or actionable configuration
  error.
- Treat an unavailable optional check as warning or not applicable.
- Report an absent test suite as absent, never as passed.
- Name checks by what they prove; do not call lint a type check or build a test.
- Do not downgrade a required failure because another check passed.

Parallelize only independent jobs and keep concurrency bounded. Serialize jobs
that share a mutable database, fixture, emulator, output directory, cache,
service, or port unless the repository provides isolation. Encode service
startup, readiness, migration, execution, and cleanup as an ordered lifecycle.

Do not install dependencies automatically. Report missing dependencies with the
repository's documented setup route. Do not contact production resources or
reset data outside an explicitly disposable test scope.

## Compose Structural Hygiene Without Owning It

Invoke an existing deterministic garden check when:

- feature completion requires index, detail, or link validation;
- harness, documentation, feature state, or verification artifacts changed;
- `full` runs and the check is cheap and applicable;
- native CI does not already provide equivalent coverage.

Treat a deterministic structural failure as a possible completion gate. Do not
turn semantic garden findings into automatic verification failures. If no
garden check exists, report that absence when relevant; do not create regex
hygiene rules inside verification to fill the gap.

## Preserve Evidence and Baseline Truth

Default to a compact summary such as:

```text
PASS api:type      2.1s
PASS api:unit      4.8s
FAIL web:type      3.0s

2 passed, 1 failed
Failure: web:type
<short actionable excerpt>
Full log: <path when retained>
```

Keep successful verbose logs out of agent context. Provide an actionable failure
excerpt and a recoverable full-log path only when logs are retained. Do not
discard the original result if capture, formatting, or cleanup fails.

When a relevant baseline already fails:

1. Record the known baseline evidence and its freshness.
2. Compare new failures when feasible and trustworthy.
3. Determine whether the existing failure blocks the requested work.
4. Report accepted exceptions with their authority and follow-up when relevant.
5. Leave unrelated failures unchanged.

Do not run a full baseline for every local task. Do not reset, stash, or rewrite
the user's worktree merely to manufacture a baseline. Distinguish adapter tests,
targeted checks, affected coverage, and a real full gate in the final report;
one does not prove the others.

## Integrate Discoverability Minimally

When creating or changing the public verification command, patch only the
verification route in the canonical agent instruction entry point. Prefer a
compact form:

```text
Quick: <real command>
Affected: <real command>
Full: <real command>
```

Preserve the router's structure, terminology, human-authored intent, and
unrelated dirty changes. Do not redesign instruction routing. Validate every
added command and path in the same invocation. If no canonical entry point
exists or adding the route requires resolving ambiguous ownership, report the
`harness-map` prerequisite instead of inventing a routing system.

## Migrate and Rerun Safely

When migrating legacy `harness-slim` verification:

- preserve real project-specific commands and compatible no-argument behavior;
- replace the giant stack-guesser with native delegation;
- add the missing `affected` path and define its local/CI change sources;
- remove the old public `doctor` mode rather than silently aliasing it;
- remove mandatory Bash-plus-`jq` assumptions unless the repository itself
  requires them;
- delegate structural state checks to garden-owned tooling;
- update instruction routes before removing obsolete command paths;
- keep legacy compatibility only when current consumers require it.

Do not delete a legacy structural checker merely because ownership moved. Leave
it in place and report the garden migration when safe removal is outside verify
scope or references remain.

On every rerun, read existing behavior and tests before editing. Preserve
working custom modes behind the stable public interface, human-authored command
choices, required service ordering, CI assumptions, and valid exceptions.
Patch only stale or missing behavior. With unchanged evidence, produce no
semantic diff.

## Apply the Workflow

1. Declare the verification pain point, repository scope, and safety boundary.
2. Audit native commands, CI, topology, changed-range rules, existing adapters,
   structural checks, and integration resources.
3. Decide to reuse, create, migrate, patch, or make no change.
4. Classify real checks and assign only justified work to `quick`, `affected`,
   and `full`.
5. Define local, explicit, and CI change-set behavior plus a conservative
   affected fallback.
6. Implement the thin adapter and only the helpers or focused configuration it
   genuinely needs.
7. Compose applicable existing structural checks and add the minimal agent
   instruction route.
8. Test the interface, failure propagation, mapping, safety, and cleanup with
   disposable fixtures or the repository's safe checks.
9. Review the diff for copied build logic, false pass states, unsafe evaluation,
   unbounded graphs, noisy output, invented commands, and unrelated rewrites.
10. Close the verify phase before suggesting another harness specialist.

If existing capabilities already satisfy the quality gates, make no change and
report the evidence-backed no-op.

## Respect Mutation and Safety Boundaries

- Preserve unrelated worktree changes and repository-native conventions.
- Make focused changes to verification artifacts and the one integration route.
- Avoid product code, feature/spec content, architecture maps, garden invariant
  definitions, and unrelated CI or dependency changes.
- Ask before any check that needs dependency installation, credentials, network
  access, non-disposable shared state, or production-like mutation.
- Use disposable resources for adapter tests and remove their artifacts.
- Report conflicting command intent instead of choosing a new canonical gate.

Do not:

- build a second package or dependency engine;
- infer affected coverage only from directory names when native evidence exists;
- silently ignore unknown, untracked, renamed, deleted, or shared files;
- claim missing, skipped, timed-out, or optional checks passed;
- catch failures and return success;
- run unsafe shared-state jobs concurrently;
- auto-install tools or dependencies;
- add a universal multi-stack script, public `doctor` mode, or unrelated garden
  ceremony;
- run `full` mechanically after every edit;
- overwrite unrelated dirty changes or ambiguous human decisions.

## Validate the Result

Require all applicable gates:

- Every documented mode and command exists and help matches behavior.
- `quick`, `affected`, and `full` dispatch only to real native checks.
- Invalid input fails with concise actionable usage.
- Local affected discovery covers staged, unstaged, and untracked paths.
- CI/base behavior is explicit; rename/delete and shared changes widen correctly.
- Explicit paths resolve from the documented caller directory; repository
  escapes fail before any check runs.
- Unknown paths take the conservative fallback.
- Native affected tooling is reused, or custom mapping remains small and
  evidence-backed.
- Required, optional, and not-applicable results remain distinguishable.
- Required command failures, signals, and cleanup failures cannot become
  success.
- Output is compact and retained failure logs resolve when promised.
- Structural checks run only for applicable triggers and remain garden-owned.
- Agent instructions expose the current real commands through a minimal patch.
- No dependency is installed and no non-disposable resource is mutated without
  authorization.
- The final diff is focused and rerun-safe.

For executable adapters or helpers, run syntax/static checks and direct
behavior tests. Exercise success, required failure, invalid mode, invocation
from a nested directory, path whitespace, repository-escape rejection,
affected widening, and structural composition when those behaviors exist. Use
a disposable git fixture for changed-file cases when practical. Run actual
repository commands in proportion to risk, and state clearly which native
gates were not run.

Never infer correctness from reading the script or from a subagent report.
Inspect command output and exit status before making a passing claim.

## Report the Invocation

Report concisely:

- reused native tools, commands, and structural checks;
- created, migrated, or changed verification artifacts;
- local, explicit, and CI affected behavior plus the conservative fallback;
- intentionally omitted adapter, helpers, modes, or optional checks and why;
- required, optional, N/A, baseline, conflict, and safety decisions;
- verification performed, exit results, and any native gate not run.

Measure success by feedback speed and false-pass resistance, not script count or
the number of commands executed.
