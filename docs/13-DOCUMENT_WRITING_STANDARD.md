# Document Writing Standard for Agent-Legible Repositories

## 1. Mục tiêu

Documentation phải giảm reasoning cost, không tạo thêm reading cost.

## 2. Quy tắc viết

### 2.1 Lead with map/rule

Không mở đầu bằng lịch sử dài.

Tốt:

```text
Request → Route → Service → Repository → DB
```

Sau đó mới giải thích exception.

### 2.2 One fact, one canonical home

Không copy nguyên rules giữa nhiều file.

### 2.3 Prefer stable facts

Architecture docs chỉ nên chứa facts ít thay đổi:

- boundaries;
- entry points;
- module purpose;
- dependency direction;
- invariants.

Chi tiết thay đổi thường xuyên nên ở code/tests/generated docs.

### 2.4 Use actual names

Nêu tên:

- package;
- module;
- type;
- command;
- stable path.

Tránh line number vì stale nhanh.

### 2.5 Separate kinds of information

Nên phân biệt rõ:

- **Rule**
- **Flow**
- **Invariant**
- **Example**
- **Exception**
- **Decision**
- **Open question**

### 2.6 Optimize for scanning

Ưu tiên:

- headings;
- tables;
- bullets;
- ASCII diagrams;
- short examples.

## 3. Anti-verbosity test

Trước khi giữ một paragraph, hỏi:

- table có ngắn hơn không?
- `A → B → C` có đủ không?
- đây có phải framework knowledge agent đã biết?
- fact này có dễ suy ra từ một file duy nhất không?
- agent có cần fact này để quyết định nơi/behavior/safety không?

Nếu không, bỏ.

## 4. AGENTS standard

SHOULD fit trong một lần scan.

Recommended sections:

```text
Project
Start here
Repository map
Working invariants
Feature routing
Verification
Documentation map
```

Không nhúng long coding-style guide.

## 5. Architecture standard

Recommended:

```text
Purpose
Bird's eye
Entry points
Code map
Main flows
Boundaries
Invariants
Cross-cutting concerns
Deeper docs
```

## 6. Subsystem guide standard

Recommended:

```text
Purpose
Stack
Code map
Main flow
Patterns
Rules/invariants
Error/data/state conventions
Testing
Common mistakes
```

## 7. Spec standard

Recommended:

```text
Goal
Flow
Rules
State transitions
Edge cases
Interfaces
Non-goals
```

## 8. Freshness

Không thêm `Last updated: <date>` thủ công như một proxy cho correctness.

Nếu freshness metadata được dùng, SHOULD được tooling cập nhật hoặc garden validate.

## 9. Empty docs

MUST NOT create empty/placeholder docs chỉ để match tree.

Một missing optional doc tốt hơn một generic doc sai.
