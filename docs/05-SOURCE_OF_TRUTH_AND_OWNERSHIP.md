# Source of Truth and Artifact Ownership

## 1. Vì sao cần ownership

Nếu nhiều skill cùng rewrite cùng một artifact, rerun sẽ gây:

- duplication;
- contradictory rules;
- lost edits;
- oscillating output.

Mỗi artifact cần **primary owner** và quyền chỉnh sửa chéo hạn chế.

## 2. Ownership matrix

| Artifact | Primary owner | Cross-edit được phép |
|---|---|---|
| `AGENTS.md` | `harness-map` | `harness-bootstrap` patch routing tối thiểu; `harness-garden` repair stale refs |
| `ARCHITECTURE.md` | `harness-map` | `harness-garden` repair khi audit có evidence |
| `docs/README.md` | `harness-map` | skill khác MAY thêm link đúng section; không rewrite phần khác |
| Subsystem docs | `harness-map` | `harness-garden` repair |
| `docs/specs/*` | `harness-specs` | `harness-garden` repair sau semantic audit |
| `feature_index.json` | `harness-features` | doctor MAY validate; garden MAY repair state khi evidence rõ |
| `features/*` | `harness-features` | coding agent cập nhật handoff/acceptance trong scope feature |
| `init.sh` | `harness-verify` | garden chỉ report; repair chỉ khi được authorize |
| verify helpers | `harness-verify` | tương tự |
| audit findings | `harness-garden` | không skill khác sở hữu |

## 3. Truth domains

### Product intent

`docs/specs/*` là canonical intended behavior.

Tests/code không được tự động dùng để rewrite spec theo hành vi hiện tại nếu chưa xác định đó là behavior đúng.

### Architecture intent

`ARCHITECTURE.md` + subsystem rules mô tả intended boundaries.

Nếu code vi phạm, có hai khả năng:

- architectural drift;
- documentation stale.

Cần evidence để phân loại.

### Feature state

`feature_index.json` là canonical machine-readable status/dependency index.

Feature detail không nên duplicate `status` nếu không cần; giảm hai nguồn state.

### Feature scope

`features/<id>.md` là canonical scope/acceptance/handoff của feature.

### Observed behavior

Code + tests + runtime evidence mô tả điều hệ thống hiện đang làm.

## 4. Conflict protocol

Khi hai truth domain conflict:

```text
DO NOT silently choose
  ↓
identify intended source
  ↓
collect implementation/test evidence
  ↓
classify
  ├─ stale documentation
  ├─ implementation defect
  ├─ incomplete migration
  ├─ ambiguous requirement
  └─ test defect
  ↓
repair only the incorrect layer(s)
```

## 5. Duplication rule

Một fact SHOULD có một canonical home.

Tài liệu khác MAY:

- link;
- summarize một dòng;
- restate invariant nếu mọi task thực sự cần thấy.

Không copy nguyên section giữa docs.

## 6. Cross-link rule

Links dùng để route, không dùng để tạo circular dependency khó hiểu.

Ví dụ tốt:

```text
AGENTS → BACKEND → spec → code
```

Ví dụ xấu:

```text
AGENTS ↔ BACKEND ↔ ARCHITECTURE ↔ feature ↔ AGENTS
```

mà mỗi file đều chứa cùng rule.
