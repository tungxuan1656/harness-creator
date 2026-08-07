# Skill Spec — `harness-specs`

## Purpose

Đưa product/domain behavior quan trọng vào repository dưới dạng agent-legible specs.

## Owned artifacts

- `docs/specs/README.md`
- `docs/specs/<domain-or-flow>.md`

Có thể patch `docs/README.md` để thêm routing link.

## Inputs

Nguồn ưu tiên:

1. explicit user requirements;
2. existing product specs;
3. tests/behavior;
4. code;
5. external protocol/contract docs.

Không dùng code hiện tại làm "intended behavior" nếu có bằng chứng code có thể sai.

## Khi nào tạo spec

SHOULD create cho:

- core user workflows;
- business rules;
- domain invariants;
- permissions;
- state transitions;
- behavior nhiều layer cùng phụ thuộc;
- edge cases mà agent dễ đoán sai.

Không cần spec cho:

- CRUD hiển nhiên không có business rule;
- framework plumbing;
- implementation details chỉ sống trong code.

## Spec format

Ưu tiên:

### Goal
1–3 câu.

### Flow

```text
Input
  ↓
validate
  ├─ invalid → error
  └─ valid
       ↓
business rule
       ↓
output
```

### Rules
Bullet ngắn, một invariant mỗi bullet.

### State transitions
Table.

### Edge cases
Input → expected result.

### Interfaces
Chỉ nếu public contract cần rõ.

### Non-goals
Khi dễ scope creep.

## Implementation leakage

Specs SHOULD mô tả **what/behavior**, không "service class phải gọi repository method X" trừ khi đó là architectural contract.

## Compression standard

Nếu cùng một meaning có thể biểu diễn bằng table/flow ngắn hơn prose, ưu tiên dạng ngắn.

## Index

`docs/specs/README.md` route theo domain/flow và "read when".

## Quality gate

Một agent phải có thể dùng spec để:

- biết expected behavior;
- viết acceptance tests;
- phân biệt edge cases;
- không phải reverse-engineer business logic từ nhiều layers.

## Rerun

Update only affected specs.

Nếu spec conflict code/tests, flag conflict; không tự rewrite spec theo code.
