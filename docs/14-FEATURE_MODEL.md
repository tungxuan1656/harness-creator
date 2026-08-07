# Feature Model and Schema

## 1. Vai trò

Feature model giữ **execution intent**, không giữ toàn bộ product management.

## 2. Recommended index schema

```json
{
  "schema_version": 1,
  "features": [
    {
      "id": "feat-001",
      "title": "User authentication",
      "status": "in_progress",
      "depends_on": [],
      "detail": "features/feat-001.md",
      "specs": ["docs/specs/authentication.md"]
    }
  ]
}
```

## 3. Fields

### Required
- `id`
- `title`
- `status`
- `depends_on`
- `detail`

### Optional
- `specs`

Không thêm metadata nếu agent không dùng để thực thi.

## 4. Status semantics

### `todo`
Có intent đủ để lên backlog, chưa triển khai.

### `in_progress`
Có work thực sự đang diễn ra. Nhiều feature có thể in-progress trong team nhỏ.

### `blocked`
Không thể tiếp tục do dependency/external decision/resource.

Block reason nằm trong feature detail.

### `done`
Acceptance đã thỏa và verification phù hợp đã pass hoặc có explicit accepted exception.

## 5. Feature detail template

```markdown
# feat-001 — User authentication

## Goal
...

## Scope
- ...

## Non-goals
- ...

## Acceptance
- [ ] ...

## Relevant docs
- `docs/specs/authentication.md`
- `docs/BACKEND.md`

## Verification
- `./init.sh affected`
- ...

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

`Handoff` MAY bỏ khi feature chưa bắt đầu hoặc đã hoàn tất.

## 6. Acceptance quality

Acceptance MUST:

- observable/verifiable;
- không chỉ "code sạch";
- map tới behavior hoặc measurable technical condition.

Tốt:
- "Invalid refresh token returns 401 and does not create a session."

Xấu:
- "Authentication is implemented well."

## 7. Feature sizing heuristic

Split nếu feature có:

- nhiều independent outcomes;
- nhiều unrelated deployment paths;
- acceptance list quá dài không cohesive;
- dependency graph nội bộ phức tạp;
- không thể verify bằng một coherent test set.

## 8. State update rule

Feature chỉ chuyển `done` sau khi:

```text
acceptance satisfied
  + relevant verification passed
  + known exceptions recorded
```

Không bắt buộc một evidence manifest phức tạp.

## 9. Handoff vs progress log

Default: per-feature handoff.

Global `progress.md` chỉ MAY add khi:

- agents chạy nhiều context windows liên tục;
- nhiều micro tasks không thuộc feature;
- project cần chronological operations log;
- git/feature handoff không đủ để resume nhanh.
