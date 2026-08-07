# Target Harness Architecture

## 1. Capability model

Target repository có năm capability, không phải năm bộ quy trình bắt buộc:

```text
NAVIGATE -> UNDERSTAND -> FOCUS -> VERIFY -> MAINTAIN
```

| Capability | Câu hỏi |
|---|---|
| Navigate | Tôi nên đọc gì và sửa ở đâu? |
| Understand | Boundaries, behavior và conventions nào quan trọng? |
| Focus | Task hiện tại gồm gì và xong khi nào? |
| Verify | Evidence nào đủ cho thay đổi này? |
| Maintain | Docs, state và patterns có đang drift không? |

## 2. Adaptive artifact set

Một repo trung bình thường có instruction entry point và architecture overview; verification adapter chỉ xuất hiện khi native interface chưa đủ rõ:

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── docs/
│   └── README.md
└── init.sh                 # conditional adapter
```

Chỉ thêm khi có nhu cầu:

```text
docs/<SUBSYSTEM>.md         # subsystem phức tạp hoặc conventions riêng
docs/specs/*                # domain/product behavior
feature_index.json          # planned backlog or persistent work
features/*                  # scope, acceptance, handoff
scripts/garden/*            # recurring deterministic maintenance checks
scripts/verify/*            # complex verification orchestration
```

Không có target tree duy nhất cho mọi repo.

## 3. Minimal profiles

### Small or already well-structured repo

```text
AGENTS.md
existing docs/build commands
```

Không tạo wrapper hoặc docs mới nếu existing interface đã rõ và agent dùng được.

### Typical medium repo

```text
AGENTS.md
ARCHITECTURE.md hoặc existing equivalent
docs/README.md nếu có nhiều doc
init.sh hoặc existing stable verify command
```

`AGENTS.md` hoặc equivalent là required capability. Architecture overview SHOULD tồn tại cho target medium repo, trừ khi repo trivial hoặc existing docs đã làm đúng chức năng đó.

### Domain-heavy or multi-session work

Thêm focused specs và feature state. Không bật cho mọi task.

## 4. Planes of truth

| Plane | Canonical artifacts | Purpose |
|---|---|---|
| Knowledge | instructions, architecture, subsystem docs, specs | System là gì và nên hoạt động thế nào |
| Execution | feature index/detail, handoff | Đang xây gì và còn gì |
| Feedback | tests, native build tools, `init.sh`, CI | Thay đổi có hợp lệ không |
| Maintenance | garden checks/findings | Truth và implementation có drift không |

Không gom mọi loại truth vào một manifest lớn.

## 5. Agent instruction entry point

Skill MUST inspect instruction mechanisms repo đang dùng:

- `AGENTS.md`, kể cả nested files;
- `CLAUDE.md`;
- `.github/copilot-instructions.md`;
- Cursor hoặc tool-specific rules;
- existing contributor instructions.

Prefer một canonical rule home. Tool-specific file SHOULD route tới canonical content thay vì copy toàn bộ rules. Không rewrite nested instruction files ngoài scope.

## 6. Existing artifacts win

Tên file trong corpus là defaults, không phải lý do để duplicate:

- existing architecture doc tốt có thể thay `ARCHITECTURE.md`;
- existing `make check` có thể thay phần lớn `init.sh`;
- existing issue tracker có thể thay feature index cho task ngắn;
- existing product specs phải được reuse và routed.

Skill tạo capability còn thiếu, không tạo parallel ecosystem.

## 7. Greenfield vs existing repo

### Empty or near-empty greenfield

Không thể viết observed architecture từ code chưa tồn tại.

```text
requirements
  -> product/domain specs khi cần
  -> proposed architecture với assumptions rõ
  -> initial feature slices
  -> code scaffold
  -> verification adapter khi real commands tồn tại
```

### Existing repo

```text
inspect existing truth
  -> map representative code
  -> reuse verification
  -> fill only durable knowledge gaps
  -> track only planned/current work
```

MUST NOT reverse-engineer toàn bộ existing functionality thành backlog.

## 8. Proposed vs observed documentation

Architecture/spec content phải phân biệt khi cần:

- **Observed** - có evidence trong code/test/runtime.
- **Intended** - có source từ user requirement, accepted decision hoặc canonical spec.
- **Proposed** - chưa được implementation chứng minh.
- **Uncertain** - cần quyết định hoặc evidence thêm.

Không biến dominant code pattern thành mandatory rule nếu chưa có evidence đó là intended pattern.

## 9. Stable lifecycle

Harness thay đổi incrementally:

```text
inspect existing
  -> preserve correct
  -> update stale facts in scope
  -> add missing capability
  -> remove obsolete artifact when safe
```

Rerun MUST NOT reset IDs, rewrite unrelated prose hoặc overwrite human decisions để tạo output đồng đều.
