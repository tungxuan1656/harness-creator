# Repository Knowledge Architecture

## 1. Mục tiêu

Tạo một mental map externalized đủ tốt để agent mới không phải đọc code tuần tự.

Một knowledge base tốt trả lời nhanh:

- Project giải quyết vấn đề gì?
- Entry points là gì?
- "Thing X" nằm ở đâu?
- Request/data flow đi qua đâu?
- Dependency direction nào được phép?
- Business rule nào không suy ra an toàn từ code?
- Khi sửa subsystem X phải đọc document nào?

## 2. Tầng tài liệu

### Tầng 0 — Router

`AGENTS.md`

Chỉ chứa routing + rules mọi coding task cần.

### Tầng 1 — Stable system map

`ARCHITECTURE.md`

Bird's-eye view, code map, boundaries, invariants, cross-cutting concerns.

### Tầng 2 — Subsystem guides

Ví dụ:

- `docs/BACKEND.md`
- `docs/FRONTEND.md`
- `docs/MOBILE.md`
- `docs/DATA.md`
- `docs/INFRA.md`

Tập trung vào tech stack, patterns, local conventions, implementation flow.

### Tầng 3 — Domain/product truth

`docs/specs/*`

Tập trung behavior, rules, edge cases, workflows.

### Tầng 4 — Durable decisions / references

Chỉ tạo khi có recurring value:

- ADR/design decisions;
- external API protocol notes;
- generated schema;
- security/reliability docs.

## 3. `ARCHITECTURE.md` baseline

Với repo trung bình, `ARCHITECTURE.md` SHOULD tồn tại vì orientation cost rất cao so với chi phí duy trì.

Nó nên có:

1. Bird's-eye view.
2. Entry points.
3. Code map theo coarse-grained modules.
4. Dependency direction.
5. Architectural invariants.
6. Cross-cutting concerns.
7. Where to go deeper.

Nó không nên:

- mô tả từng function;
- liệt kê mọi folder;
- duplicate subsystem guide;
- ghi line numbers;
- chứa các chi tiết thay đổi hàng tuần.

## 4. Khi nào tạo subsystem doc?

Tạo nếu ít nhất một điều đúng:

- subsystem có tech stack/conventions riêng;
- nhiều folder cùng phục vụ một execution flow;
- pattern phải theo không dễ suy ra từ code;
- agent thường chọn sai nơi đặt logic;
- subsystem đủ lớn để `ARCHITECTURE.md` không nên chứa chi tiết.

Không tạo file generic như `BACKEND.md` chỉ để nói "backend uses REST".

## 5. Docs index

`docs/README.md` SHOULD là routing table:

```markdown
| Document | Read when |
|---|---|
| `BACKEND.md` | Changing API, services, persistence |
| `FRONTEND.md` | Changing UI, state, client data |
| `specs/auth.md` | Changing authentication behavior |
```

Một line mô tả "khi nào đọc" hữu ích hơn summary dài.

## 6. Stable naming

Ưu tiên tên dễ đoán:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/BACKEND.md`
- `docs/FRONTEND.md`
- `docs/specs/...`

Mục tiêu là discovery cost thấp.

## 7. Knowledge lifecycle

```text
Observation
   ↓
recurring / durable?
   ├─ no → keep in code/PR/chat
   └─ yes
       ↓
choose canonical document
       ↓
write concise rule/map/spec
       ↓
link from router if discoverability requires
       ↓
doctor/garden checks drift
```
