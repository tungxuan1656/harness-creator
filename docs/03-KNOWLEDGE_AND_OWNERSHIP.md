# Knowledge and Ownership

## 1. Read ladder

### Near-always

- root instruction file loaded by the target agent.

### By task classification

- architecture overview khi agent chưa biết topology hoặc task cross-cutting;
- một subsystem guide liên quan;
- feature detail nếu task thuộc persistent feature;
- spec nếu behavior/domain rule ảnh hưởng implementation.

### On demand

- decisions, external references, generated schema;
- garden findings;
- historical feature details.

Một doc không nên bắt agent mở nhiều doc chỉ để hiểu một invariant cơ bản.

## 2. Router contract

Instruction entry point SHOULD trả lời trong một lần scan:

1. Project làm gì và topology chính là gì?
2. Task loại X cần đọc doc nào?
3. Code area/entry point chính ở đâu?
4. Universal invariants nào áp dụng cho mọi task?
5. Verify bằng command nào?
6. Feature state nằm đâu nếu repo dùng nó?

Không nhúng framework tutorial, full architecture hoặc lịch sử feature.

## 3. Architecture map

Một architecture overview tốt chứa:

- bird's-eye flow;
- application entry points;
- coarse code map;
- dependency direction và boundaries;
- important cross-cutting concerns;
- explicit invariants;
- route tới docs sâu hơn.

Nó không liệt kê mọi folder/function, không dùng line numbers và không copy subsystem docs.

## 4. Subsystem docs

Chỉ tạo khi subsystem có ít nhất một đặc điểm:

- stack hoặc conventions riêng;
- flow xuyên nhiều folder khó tìm;
- agent thường đặt logic sai layer;
- boundary không thể suy ra an toàn;
- đủ lớn để overview không nên chứa chi tiết.

Nội dung ưu tiên actual symbols/paths, flow, rules, examples và test locations.

## 5. Product/domain specs

Tạo spec cho:

- core workflow;
- permissions hoặc state transitions;
- business invariants;
- public contracts;
- cross-layer behavior;
- edge cases dễ đoán sai.

Không tạo spec cho CRUD hiển nhiên hoặc framework plumbing.

Spec SHOULD có:

```text
Goal
Flow
Rules
State transitions nếu có
Edge cases
Interfaces nếu public contract cần
Non-goals nếu scope dễ trượt
Sources / uncertainties
```

`Sources / uncertainties` ghi ngắn gọn behavior đến từ requirement, existing canonical doc, test/evidence hay inference cần xác nhận.

## 6. Truth ownership

`Owner` trong hệ thống này nghĩa là **primary steward**, không phải exclusive writer.

| Truth | Primary steward | Ai có thể cập nhật |
|---|---|---|
| Instruction routing | Harness/map workflow | Coding agent khi canonical route thay đổi trong scope |
| Architecture intent | Architecture doc | Agent thực hiện accepted boundary change; garden sửa stale facts khi authorized |
| Product behavior | Specs | Agent thực hiện accepted behavior change; garden sửa proven stale facts khi authorized |
| Feature state/scope | Feature artifacts | Agent đang làm feature hoặc features workflow |
| Verification interface | Verify workflow | Agent thực hiện tooling change trong scope |
| Observed implementation | Code/tests | Coding workflow theo user task |

Skill ownership chỉ kiểm soát generation/rerun behavior. Nó MUST NOT ngăn một feature cập nhật canonical docs mà feature đó làm thay đổi.

## 7. One fact, one canonical home

Doc khác MAY:

- link;
- restate một câu để route;
- summarize invariant mà mọi task thực sự cần.

Không copy nguyên section. Link phải dẫn theo một chiều dễ hiểu:

```text
instructions -> architecture/subsystem -> spec -> code/tests
```

## 8. Mutation and rerun protocol

Trước khi sửa artifact, skill MUST:

1. đọc existing content và git state;
2. xác định canonical owner của fact;
3. phân loại content: correct, stale, missing, conflicting hoặc uncertain;
4. patch theo stable headings hoặc cấu trúc hiện có;
5. giữ human-authored decisions chưa bị chứng minh sai;
6. report conflict thay vì overwrite khi intent không rõ.

Managed markers chỉ MAY dùng cho section hoàn toàn generated. Không bao quanh human-maintained content mặc định.

## 9. Writing standard

Ưu tiên:

- map/rule trước prose;
- `A -> B -> C` cho flows;
- table cho mapping/state;
- một invariant mỗi bullet;
- stable symbols và paths;
- observed/intended/proposed labels khi cần.

Loại bỏ:

- lịch sử không ảnh hưởng quyết định;
- tutorial agent đã biết;
- prose lặp code;
- generic best practices không grounded trong repo;
- `Last updated` thủ công như proxy cho correctness.

## 10. Docs index

Tạo `docs/README.md` khi có nhiều doc cần routing. Mỗi row chủ yếu trả lời `Read when`, không viết summary dài.

```markdown
| Document | Read when |
|---|---|
| `BACKEND.md` | Changing API, service or persistence code |
| `specs/auth.md` | Changing authentication behavior |
```
