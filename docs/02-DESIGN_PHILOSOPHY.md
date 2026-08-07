# Design Philosophy

## 1. Map, not manual

`AGENTS.md` là entry point, không phải encyclopedia.

Nó SHOULD chứa:

- routing;
- universal invariants;
- canonical commands;
- cách chọn tài liệu tiếp theo.

Nó MUST NOT chứa toàn bộ architecture, backend conventions, product specs và lịch sử feature.

## 2. Progressive disclosure

Thông tin được phân tầng để agent chỉ load thứ cần thiết:

```text
AGENTS.md
   ↓
ARCHITECTURE.md / subsystem doc / feature detail
   ↓
spec hoặc decision liên quan
   ↓
code + tests
```

Không có yêu cầu "đọc tất cả docs trước khi code".

## 3. Repository-local knowledge

Knowledge ảnh hưởng đến code SHOULD có representation discoverable trong repo.

Thông tin chỉ tồn tại ở chat, Google Docs, Jira hoặc đầu con người không nên được coi là đủ cho agent. External trackers MAY tiếp tục là source cho team management, nhưng execution context quan trọng cần được link hoặc distilled vào repo.

## 4. Complexity must be earned

Mỗi artifact phải trả lời:

> Failure mode nào sẽ xảy ra nếu artifact này không tồn tại?

Nếu không trả lời được, không tạo.

Ví dụ:

- `ARCHITECTURE.md`: giảm orientation cost.
- `BACKEND.md`: codify recurring backend patterns.
- `feature_index.json`: giữ execution backlog và dependencies trong context.
- `init.sh`: chuẩn hóa fast feedback.
- `progress.md`: chỉ đáng có nếu feature-level handoff không đủ.

## 5. Invariants over micromanagement

Harness SHOULD enforce:

- dependency direction;
- public behavior;
- boundary validation;
- canonical verification;
- scope/acceptance.

Harness SHOULD NOT bắt agent theo một implementation style cụ thể nếu codebase không yêu cầu.

Nguyên tắc:

> Enforce boundaries centrally; allow autonomy locally.

## 6. High signal per token

Documentation cho agent ưu tiên:

- diagrams ASCII;
- tables;
- rule lists;
- decision trees;
- examples;
- `A → B → C`;
- named symbols và stable paths.

Giảm:

- lời dẫn dài;
- mô tả hiển nhiên;
- prose lặp lại code;
- framework tutorial;
- historical narrative không ảnh hưởng quyết định.

## 7. Intended truth vs observed truth

Không tuyên bố tuyệt đối "code luôn đúng" hoặc "docs luôn đúng".

- Specs/architecture mô tả **intended behavior/boundaries**.
- Code/tests cung cấp **observed implementation/evidence**.

Khi conflict:

```text
detect
  → collect evidence
  → classify: code violation vs stale doc vs incomplete migration
  → repair intentionally
```

Không auto-hợp thức hóa drift.

## 8. Fast feedback is a product feature

Verification không chỉ là correctness gate; nó là một phần của harness UX.

Nó SHOULD:

- tận dụng tool hiện có;
- chạy parallel khi independent;
- chạy affected subset khi an toàn;
- gom output;
- giữ exit code;
- hiển thị failure context ngắn gọn.

## 9. Entropy requires garbage collection

Agent học từ repository hiện tại. Bad pattern nếu tồn tại lâu sẽ được sao chép.

Do đó cần hai lớp:

1. **Mechanical doctor** — cheap, deterministic.
2. **Semantic gardening** — periodic/on-demand reasoning audit.

## 10. Harness assumptions are provisional

Model capability thay đổi. Rule từng cần thiết có thể trở thành overhead.

Mỗi rule SHOULD định kỳ được hỏi:

- failure mode này còn xảy ra không?
- tool/model hiện tại đã tự xử lý tốt chưa?
- rule có gây latency hoặc context cost lớn hơn lợi ích không?

Harness phải tiến hóa; không đóng băng assumptions.
