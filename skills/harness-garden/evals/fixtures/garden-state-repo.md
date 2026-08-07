# Garden structural-check repository fixture

Repository state before the task:

```text
docs/feature-state.schema.json
feature_index.json
features/feat-api.v2.md
features/feat-web.md
notes.txt
```

The canonical draft-2020-12 schema:

- accepts IDs matching `^feat-[A-Za-z0-9][A-Za-z0-9._-]*$`, including dotted
  IDs such as `feat-api.v2`;
- permits `specs` to be absent, empty, or a unique array of safe relative
  Markdown paths;
- requires unique IDs/detail paths and the four v1 statuses;
- rejects absolute paths and parent traversal.

Structural metadata additionally requires existing dependency targets, no
self-dependency or cycle, resolved detail/spec files, no symlink escape, and no
stale Handoff or blocker on `done` entries.

Fixture variants should cover a clean pass, dotted IDs, all optional `specs`
forms, spaces/metacharacters, missing/self/cyclic dependencies, duplicate IDs,
absolute/lexical/symlink escapes, deterministic output, and non-mutation.
`notes.txt` and an untracked user file represent unrelated dirty work whose
hashes must remain unchanged.
