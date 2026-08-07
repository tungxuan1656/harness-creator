# Harness System Architecture

## 1. Khái niệm tổng thể

Harness được chia thành 5 capability vận hành:

```text
NAVIGATE
   ↓
UNDERSTAND
   ↓
FOCUS
   ↓
VERIFY
   ↓
MAINTAIN
```

### Navigate
Agent biết nên đọc gì.

### Understand
Agent hiểu system boundaries, patterns, product/domain rules.

### Focus
Agent biết feature/task hiện tại, scope, dependencies, acceptance.

### Verify
Agent nhận feedback nhanh và đáng tin.

### Maintain
Harness tự phát hiện drift/garbage đủ sớm để không khuếch đại.

## 2. Artifact architecture đề xuất

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
│
├── docs/
│   ├── README.md
│   ├── BACKEND.md          # conditional
│   ├── FRONTEND.md         # conditional
│   ├── MOBILE.md           # conditional
│   ├── DATA.md             # conditional
│   ├── INFRA.md            # conditional
│   │
│   ├── specs/
│   │   ├── README.md
│   │   └── <domain-or-flow>.md
│   │
│   ├── decisions/          # conditional
│   ├── generated/          # conditional
│   └── references/         # conditional
│
├── features/
│   ├── feat-template.md
│   └── feat-<id>.md
│
└── scripts/
    └── ...                 # only helpers actually needed
```

Không phải mọi repo đều có tất cả file conditional.

## 3. Control plane vs knowledge plane

### Knowledge plane

```text
AGENTS
ARCHITECTURE
subsystem docs
specs
decisions
```

Trả lời: "Hệ thống là gì và nên hoạt động thế nào?"

### Execution plane

```text
feature_index
feature detail
handoff
```

Trả lời: "Đang xây gì, scope nào, còn gì?"

### Feedback plane

```text
init.sh
existing build/test tools
doctor
CI
```

Trả lời: "Thay đổi này có hợp lệ không?"

### Maintenance plane

```text
harness-garden
doctor findings
golden rules/invariants where justified
```

Trả lời: "Knowledge và code có đang drift/decay không?"

## 4. Không tạo một nguồn chân lý duy nhất cho mọi loại sự thật

Một repository có nhiều domain của truth:

| Domain | Canonical intent |
|---|---|
| Product behavior | `docs/specs/*` |
| System topology/boundaries | `ARCHITECTURE.md` |
| Subsystem implementation conventions | `BACKEND.md`, `FRONTEND.md`,... |
| Planned/current work | `feature_index.json` |
| Feature scope/acceptance | `features/<id>.md` |
| Actual implementation | code |
| Regression evidence | tests + verification |
| External protocol semantics | `docs/references/*` hoặc canonical external source |

## 5. Data flow khi agent bắt đầu một task

```text
User request
   ↓
AGENTS.md
   ↓
classify task/component
   ↓
relevant feature detail? ── yes → read
   ↓
relevant subsystem doc
   ↓
relevant spec/decision
   ↓
code + tests
   ↓
implement
   ↓
init.sh affected
```

Không cần load toàn bộ knowledge plane.

## 6. Design constraint

Mọi skill MUST giữ kiến trúc này dễ hiểu hơn sau khi chạy, không chỉ "thêm file".
