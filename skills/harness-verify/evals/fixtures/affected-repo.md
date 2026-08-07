# Affected-verification repository fixture

Repository state before the task:

```text
AGENTS.md
package.json
packages/api/package.json
packages/api/src/index.js
packages/web/package.json
packages/web/src/index.js
packages/shared/package.json
packages/shared/src/index.js
scripts/native-check.mjs
```

- Root package scripts expose real `lint`, `type`, `test`, and `build` commands.
- `api` and `web` both depend on `shared`; the native checker accepts a package
  name but the repository has no stable quick/affected/full agent command.
- An API source file is staged, a web source file is unstaged, and a new shared
  test is untracked. A separate user note is dirty and unrelated.
- Changing `shared`, a lockfile, root config, an unknown path, or either side of
  a rename/delete must widen coverage conservatively.
- Explicit paths may be supplied from repository root or a nested package.
  Repository escapes such as `../../../outside.js` must fail before any native
  check runs.
- A documented environment variable makes one required native check fail, so
  failure propagation can be exercised without changing production state.

The evaluator should materialize the fixture in a disposable git repository and
exercise success, invalid mode, nested invocation, escape rejection, widening,
and required failure.
