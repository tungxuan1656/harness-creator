# Skill Spec — `harness-garden`

## Purpose

Kiểm soát entropy của harness, docs và recurring code patterns.

Skill này **không chạy mặc định trong bootstrap**.

## Trigger

Dùng khi:

- docs có dấu hiệu stale/conflict;
- nhiều feature đã hoàn thành;
- refactor/migration lớn vừa xong;
- agent liên tục lặp pattern xấu;
- trước milestone;
- user yêu cầu audit/cleanup.

## Default behavior

Audit-first.

MUST NOT auto-refactor rộng chỉ vì phát hiện smell.

## Levels

### Level 0 — Structural

Cheap/deterministic; thường delegate cho `init.sh doctor`.

- broken links;
- missing files;
- invalid feature JSON;
- duplicate IDs;
- dependency cycles;
- orphan feature files;
- references tới path không tồn tại.

### Level 1 — Consistency

- index/detail/spec links inconsistent;
- `done` nhưng acceptance/handoff cho thấy chưa xong;
- `AGENTS.md` route tới doc đã đổi tên;
- architecture nói module/path không còn tồn tại;
- duplicate/conflicting docs có thể phát hiện trực tiếp.

### Level 2 — Semantic drift

Reasoning audit:

- docs nói pattern A, representative code dùng B;
- spec nói behavior X, tests/code cho Y;
- architecture dependency direction bị phá;
- docs mô tả flow cũ sau migration.

Kết quả phải phân biệt "suspicion" và "proven conflict".

### Level 3 — Pattern garbage collection

Tìm recurring:

- deprecated abstraction;
- duplicated helper;
- stale compatibility shim;
- bypass pattern;
- boundary validation bị bỏ;
- guessed data shapes;
- dead flags;
- old API usage;
- TODO/debt hết hạn nếu có evidence.

### Level 4 — Repair

Chỉ chạy khi user/flow cho phép.

Repair SHOULD:

- targeted;
- small;
- verified;
- update canonical docs nếu cần;
- không "cleanup toàn repo" ngoài scope.

## Finding format

Mỗi finding:

```text
ID
Level
Severity
Observed
Expected
Evidence
Likely classification
Recommended action
Confidence
```

## Golden principles

Nếu một issue lặp lại nhiều lần, garden MAY đề xuất promote thành:

- documented invariant;
- lint;
- structural test;
- verify rule.

Không tạo `GOLDEN_PRINCIPLES.md` mặc định nếu rules đã có canonical home trong subsystem docs.

## Quality gate

Garden phải tối ưu **precision**, không tối ưu số finding.

10 finding đúng > 100 speculative smell.
