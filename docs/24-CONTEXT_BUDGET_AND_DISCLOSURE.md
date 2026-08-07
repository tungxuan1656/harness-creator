# Context Budget and Progressive Disclosure

## 1. Context là tài nguyên hữu hạn

Harness phải tối ưu không chỉ số file mà cả **read amplification**:

> Một thay đổi nhỏ buộc agent đọc bao nhiêu token trước khi có thể sửa đúng?

Đây là metric quan trọng hơn tổng kích thước thư mục `docs/`.

## 2. Read ladder

### Always/near-always
- `AGENTS.md`

### Read by task classification
- `ARCHITECTURE.md` khi agent chưa biết topology hoặc task cross-cutting;
- subsystem guide liên quan;
- feature detail nếu task thuộc feature;
- spec liên quan nếu behavior/domain rule cần.

### Read on demand
- decisions;
- external references;
- reliability/security;
- generated schema;
- garden reports.

## 3. Routing phải actionable

Không viết:

> See documentation for more details.

Viết:

```text
Changing API/service/data access → read `docs/BACKEND.md`
Changing authentication behavior → read `docs/specs/authentication.md`
Changing package boundaries → read `ARCHITECTURE.md`
```

## 4. Avoid recursive reading

Một doc không nên bắt agent mở 5 doc chỉ để hiểu 1 rule cơ bản.

Nếu một invariant bắt buộc cho mọi backend task, nó thuộc `BACKEND.md`, không chỉ nằm trong một ADR sâu.

## 5. Summary vs canonical detail

Router MAY restate một câu đủ để chọn đường đi, nhưng canonical detail vẫn ở doc sở hữu.

Example:

`AGENTS.md`:
> Backend follows Route → Service → Repository; details: `docs/BACKEND.md`.

Đây là acceptable duplication vì routing value cao và summary rất nhỏ.

## 6. Code reading budget

Skill tạo docs nên đọc representative code đủ để grounded nhưng không exhaustive.

Agent coding task nên:

1. locate bằng docs/search;
2. inspect narrow relevant slice;
3. expand only khi dependency/behavior unclear.

## 7. Documentation size heuristic

Không hardcode line count, nhưng khi doc dài:

- split theo cognitive boundary, không split arbitrary;
- giữ stable overview ở parent;
- route đến specialized child.

## 8. Token-saving verification

Verification output là context input.

Do đó:

- suppress successful verbose logs;
- summarize status/duration;
- show failure excerpt;
- keep full logs recoverable.

## 9. Context success metric

Một harness tốt cho task phổ biến sẽ có:

```text
small routing read
+ one focused knowledge doc
+ narrow code slice
+ compact verification feedback
```

không phải:

```text
AGENTS
+ all docs
+ all feature files
+ full test logs
```
