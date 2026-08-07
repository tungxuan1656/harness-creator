# Gardening and Entropy Control

## 1. Purpose

Garden là workflow maintenance duy nhất của `harness`. Nó dọn entropy trong:

- agent instructions và knowledge docs;
- specs và feature state;
- verification adapters/config;
- recurring code patterns có khả năng bị agent sao chép.

Current interface dùng garden thay cho một public maintenance mode riêng trong verification.

## 2. One workflow, two engines

Garden giữ distinction kỹ thuật nhưng không bắt người dùng chọn hai hệ thống:

### Structural engine

Cheap, deterministic và có thể script hóa:

- invalid feature schema;
- duplicate IDs, missing dependencies, cycles;
- missing/orphan detail files;
- broken internal links và stale paths;
- missing referenced verify helpers;
- obvious duplicate routing entries;
- completed state còn stale Handoff/blocker.

### Reasoning engine

Agent audit theo evidence:

- architecture/spec nói A nhưng representative code/test cho thấy B;
- intended dependency direction bị phá;
- flow docs stale sau migration;
- deprecated/bypass/duplicated pattern đang lặp lại;
- obsolete shim, flag hoặc API usage có evidence đủ mạnh.

Structural result có thể deterministic. Semantic result phải phân biệt proven conflict với suspicion.

**Structural invariant** là deterministic và MAY gate completion/CI. **Semantic finding** cần evidence + confidence và normally MUST NOT gate delivery tự động.

## 3. Triggers

Chạy garden khi:

- user yêu cầu audit/cleanup/dọn repo;
- stale link/doc/state đã thấy;
- migration/refactor lớn vừa hoàn thành;
- nhiều feature done cần compact;
- cùng review comment hoặc bad pattern lặp lại;
- trước milestone nếu repository có maintenance debt thực.

Không chạy full semantic garden mặc định trong mọi bootstrap hoặc task.

## 4. Scope selection

Garden MUST chọn scope nhỏ nhất có ích:

```text
structural-only
docs/specs
feature state
verification harness
one subsystem
recent changes
repository-wide only when explicitly justified
```

Semantic audit nên sample representative modules, recent changes, code paths referenced by docs và known hotspots trước khi mở rộng.

## 5. Audit and cleanup semantics

User intent quyết định mutation level:

- **audit/check/review** -> report findings, không sửa rộng;
- **cleanup/fix/dọn** -> sửa high-confidence mechanical issues và targeted issues trong stated scope;
- semantic refactor hoặc behavior change -> cần evidence và explicit scope; report ambiguity trước khi chọn truth.

Một cleanup invocation MAY audit rồi repair trong cùng turn. Không bắt user chạy ceremony hai bước cho broken links hoặc stale state hiển nhiên.

## 6. Finding format

Chỉ dùng fields tạo giá trị:

```text
Severity
Observed
Expected
Evidence
Classification or confidence
Action
```

IDs chỉ cần khi có nhiều findings, persistent report hoặc user sẽ chọn subset để repair.

Garden tối ưu precision. Một finding không có evidence phải được label suspicion hoặc bỏ.

## 7. Repair policy

Garden MAY sửa trực tiếp khi user yêu cầu cleanup và issue có confidence cao:

- broken links/path renames;
- invalid or stale feature state;
- obsolete empty/duplicate doc section có canonical home rõ;
- dead generated helper không còn referenced;
- completed feature artifacts theo retention policy.

Garden MUST NOT tự động:

- đổi product behavior để match stale docs;
- rewrite architecture rộng dựa trên dominant pattern chưa được chấp nhận;
- refactor toàn repo vì smell;
- xóa compatibility code khi chưa chứng minh consumer không còn;
- sửa unrelated test/build failures.

Sau repair, chạy verification phù hợp với files/behavior đã đổi.

## 8. Structural tooling

Khi target repository bật feature state hoặc có nhiều agent-facing docs/links, garden SHOULD cung cấp một deterministic structural entry point, ví dụ:

```text
scripts/garden/check.*
```

MAY omit helper nếu repo không có machine-checkable harness state hoặc native tooling đã cover cùng invariants.

Script phải:

- deterministic;
- runnable bằng runtime repo có;
- output compact;
- nonzero khi required invariant fail;
- không pretend validate semantic correctness.

Garden vẫn owns invariant/check. Verify compose nó vào feature completion, affected harness changes và full verification theo contract trong `05-VERIFICATION.md`.

## 9. Promotion ladder

Khi issue lặp lại:

```text
one-off finding
  -> durable documented rule
  -> repeatedly violated structural/lint check
  -> high-value required verification gate
```

Không promote style preference hoặc low-confidence heuristic thành gate.

## 10. Feature and doc garbage collection

Garden SHOULD xem xét:

- remove stale Handoff/blocker;
- compact/remove low-value completed detail trước;
- retain compact `done` index identity để tránh duplicate planning;
- prune old identity chỉ khi retention policy cho phép và reliable history tồn tại;
- delete empty placeholder docs;
- merge duplicate facts về canonical home;
- remove stale routing rows;
- preserve git/external tracker as history thay vì tạo archive mặc định.

Deletion phải kiểm tra references và human-authored durable value.

## 11. Output persistence

Default output nằm trong response/session. Chỉ persist report khi:

- cleanup kéo dài qua nhiều phiên;
- findings cần human review riêng;
- milestone cần tracked remediation.

Không tạo permanent garbage catalog mặc định.

## 12. Completion

Garden hoàn tất khi scoped high-confidence issues đã được report hoặc repaired, checks phù hợp đã chạy, và repo ít ambiguous hơn. Số finding hoặc số file thay đổi không phải success metric.
