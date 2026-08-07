# Skill Spec — `harness-features`

## Purpose

Biến requirements/specs thành một execution backlog compact, repo-local và dễ dùng bởi coding agent.

## Owned artifacts

- `feature_index.json`
- `features/feat-template.md`
- `features/<id>.md`

## Hai mode

### Greenfield decomposition

```text
requirements/specs
  → coherent features
  → dependencies
  → acceptance
```

### Existing project

Chỉ track planned/current work.

MUST NOT reverse-engineer toàn bộ functionality hiện có thành feature backlog nếu không được yêu cầu.

## `feature_index.json`

Nó là **execution index**, không phải Jira.

SHOULD giữ:

- id;
- title;
- status;
- dependencies;
- detail path;
- optional spec references.

MUST NOT mặc định chứa:

- sprint;
- story points;
- deadline;
- comments;
- full assignee workflow;
- business PM metadata.

## Status model

Recommended:

```text
todo
in_progress
blocked
done
```

Nhiều `in_progress` MAY tồn tại vì team 1–4 người có thể làm song song.

Agent/session SHOULD focus on một primary feature.

## Feature detail

MUST include:

- Goal;
- Scope;
- Non-goals khi cần;
- Acceptance;
- Relevant docs/specs;
- Verification;
- Handoff khi feature chưa hoàn tất.

Không cần duplicate status nếu index đã canonical.

## Feature sizing

Một feature tốt:

- tạo một coherent user/system outcome;
- có acceptance kiểm chứng được;
- không cần đổi quá nhiều unrelated subsystems;
- đủ nhỏ để agent hoàn thành trong một hoặc vài phiên.

Không ép "mỗi feature phải cực nhỏ". Split khi:

- acceptance quá rộng;
- dependencies không rõ;
- feature có nhiều independent user outcomes;
- verification không thể xác định gọn.

## Dependency rules

Dependencies phải:

- là execution dependencies thực;
- không chỉ là "có liên quan";
- không cyclic.

## Handoff

Default progress state nên nằm trong feature detail:

```markdown
## Handoff
Done:
- ...

Remaining:
- ...

Blocker:
- none

Next:
- ...
```

Chỉ dùng khi chưa hoàn thành.

## `progress.md`

Không phải baseline.

MAY dùng khi project có long-running autonomous sessions và feature-level handoff không đủ.

## Quality gate

- mọi feature có acceptance verifiable;
- index/detail/spec links hợp lệ;
- không duplicate PM system;
- backlog không chứa placeholder giả;
- feature IDs stable qua rerun.
