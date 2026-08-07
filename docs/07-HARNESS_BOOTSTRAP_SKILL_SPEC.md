# Skill Spec — `harness-bootstrap`

## Purpose

Điều phối việc tạo/adopt harness phù hợp với repository mà không biến bootstrap thành một generator monolithic.

## Trigger

Dùng khi user muốn:

- "tạo harness";
- "chuẩn hóa repo cho coding agent";
- "setup bộ harness";
- adopt skill pack vào repo mới/existing.

Không dùng cho:

- chỉ update architecture;
- chỉ viết specs;
- chỉ sửa verify script;
- gardening.

## Inputs

MUST inspect tối thiểu:

- root tree;
- existing `AGENTS.md`/agent instructions;
- existing architecture/docs;
- manifests/workspace files;
- existing feature/task tracking trong repo;
- existing build/test entry points.

Không cần đọc sâu code; đó là việc của specialized skill.

## Classification

Xác định:

### Repository state
- greenfield / near-greenfield;
- existing active project.

### Topology
- single component;
- multi-component;
- monorepo.

### Existing harness capabilities
- navigation;
- knowledge;
- specs;
- feature state;
- verification;
- gardening.

## Decision matrix

### Greenfield
Prefer:
`map → specs → features → verify`

### Existing repo
Prefer:
`map → verify → specs-if-needed → features-if-needed`

### Existing good docs
Do not regenerate. Route/reuse.

### Existing task tracker only external
MAY create repo-local compact execution index nếu user muốn agent-native backlog; không copy PM metadata.

## Outputs

Bootstrap itself SHOULD tạo tối thiểu artifact.

Có thể tạo một temporary plan/report, nhưng không cần persist nếu không mang durable value.

## Completion report

Phải ghi:

- skills/phases đã chạy hoặc cần chạy;
- artifact nào mới;
- artifact nào reused;
- capability nào intentionally not created;
- unresolved ambiguity.

## Forbidden

MUST NOT:

- tự viết full architecture thay `harness-map`;
- tự tạo feature backlog từ suy đoán;
- overwrite existing harness files không phân tích;
- tạo empty docs để đạt checklist;
- gọi `harness-garden` như bước bootstrap mặc định.
