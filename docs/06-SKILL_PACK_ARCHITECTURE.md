# Skill Pack Architecture

## 1. Danh sách skill

```text
harness-bootstrap
harness-map
harness-specs
harness-features
harness-verify
harness-garden
```

## 2. Nguyên tắc chia skill

Chia theo **cognitive responsibility**, không chia theo file.

Ví dụ `AGENTS.md`, `ARCHITECTURE.md` và `BACKEND.md` cùng cần một mental model của repo nên thuộc `harness-map`.

## 3. Dependency graph

```text
                 harness-bootstrap
                   /     |      \
                  v      v       v
          harness-map  harness-verify
                |
                v
          harness-specs
                |
                v
        harness-features

harness-garden  ← lifecycle/on-demand, không nằm trong bootstrap mặc định
```

Đây không phải dependency runtime cứng. Nó là design ordering.

## 4. Greenfield default

```text
harness-map
  → harness-specs
  → harness-features
  → harness-verify
```

Lý do: requirements phải được chuẩn hóa thành specs trước khi backlog phân rã.

## 5. Existing repo default

```text
harness-map
  → harness-verify
  → harness-specs (only where durable behavior is missing/ambiguous)
  → harness-features (for planned/current work)
```

## 6. Skill isolation

Mỗi skill MUST:

- có scope rõ;
- biết artifact mình sở hữu;
- đọc output trước đó thay vì re-derive mọi thứ;
- vẫn cross-check code khi correctness phụ thuộc code;
- không rewrite artifact của skill khác chỉ vì "có thể cải thiện".

## 7. Rerun semantics

Rerun SHOULD là incremental:

- `harness-map`: update map/doc sections dựa trên changed topology, không reset specs/features.
- `harness-specs`: update affected specs, không rewrite architecture.
- `harness-features`: preserve existing feature IDs/history; add/update backlog intentionally.
- `harness-verify`: inspect current build tooling and update orchestrator safely.
- `harness-garden`: audit first; repair only authorized findings.

## 8. Bootstrap là orchestrator, không phải mega-skill

`harness-bootstrap` không nên chứa chi tiết "cách viết architecture tốt" hoặc "cách build init.sh".

Nó chỉ cần:

1. classify repo;
2. inspect existing harness artifacts;
3. determine missing capabilities;
4. sequence specialized skills;
5. run final cross-link sanity check.

Nếu environment không hỗ trợ skill gọi skill, bootstrap SHOULD xuất một ordered execution plan thay vì cố tự làm mọi phần.
