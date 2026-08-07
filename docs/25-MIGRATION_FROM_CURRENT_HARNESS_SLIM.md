# Migration from Current `harness-slim`

## 1. Current model

Current `harness-slim` monolith combines:

- instruction generation;
- feature state;
- verification;
- progress lifecycle;
- docs map;
- state checker;
- audit/benchmark.

Migration không nên xóa mọi thứ cùng lúc. Preserve useful ideas, reassign ownership.

## 2. Artifact mapping

| Current | New owner / decision |
|---|---|
| `AGENTS.md` | `harness-map`; rewrite toward router |
| `docs/README.md` | `harness-map`; retain as docs router |
| optional architecture docs | `harness-map`; make `ARCHITECTURE.md` baseline |
| `feature_index.json` | `harness-features`; schema revised |
| `features/*` | `harness-features`; simplify detail |
| `progress.md` | optional; migrate useful current state into feature `Handoff` |
| `init.sh` | `harness-verify`; redesign modes |
| `scripts/check-state.sh` | evolve into `doctor` structural capability |
| validator/report | maintainer/conformance tooling, not core project artifact |
| references | distribute to specialized skills |

## 3. Remove/relax old assumptions

### Old: exactly/at most one active feature
New:
- multiple `in_progress` allowed;
- session focus one feature.

### Old: mandatory progress update each session
New:
- feature handoff;
- global progress optional.

### Old: quick/full only
New:
- quick/affected/full/doctor.

### Old: single detected stack chain
New:
- component-aware / monorepo-aware inspection.

### Old: Bash + jq requirement
New:
- choose portable/project-appropriate implementation.

## 4. Migration sequence

1. Tag current implementation / preserve tests.
2. Freeze current monolithic skill as legacy during transition.
3. Build `harness-map`.
4. Migrate docs references used by map.
5. Build `harness-verify`; keep compatibility `./init.sh` entry.
6. Build `harness-specs`.
7. Build `harness-features`; write migration for old index/detail.
8. Build bootstrap orchestrator.
9. Build garden.
10. Deprecate monolithic `harness-slim` or turn it into alias/bootstrap entry.

## 5. Backward compatibility

Possible strategy:

```text
harness-slim
  → becomes thin redirect/orchestrator to `harness-bootstrap`
```

Existing users vẫn có familiar entry name nhưng implementation modular.

## 6. Migration quality gate

Không được làm regression:

- repo cũ vẫn có thể verify;
- feature IDs không mất;
- useful progress state không bị xóa;
- existing human docs không bị overwrite;
- old commands có migration message rõ.
