# Scope and Principles

## 1. Problem

AI coding agent thường mất hiệu quả ở bốn điểm:

1. **Orientation cost** - không biết code liên quan nằm ở đâu.
2. **Intent loss** - behavior, boundaries và conventions không discoverable.
3. **Execution drift** - làm quá scope hoặc tuyên bố xong trước khi verify.
4. **Entropy** - stale docs và bad patterns tiếp tục được sao chép.

Harness tồn tại để giảm bốn chi phí này. Nó không phải project-management framework.

## 2. Priority order

Khi hai mục tiêu xung đột, ưu tiên:

```text
Correctness
  -> fast feedback
  -> low task overhead
  -> resumability
  -> documentation completeness
```

Documentation completeness đứng sau vì nhiều file không đồng nghĩa agent làm tốt hơn.

## 3. Success conditions

Một harness tốt giúp agent:

- tìm entry point và code owner nhanh;
- đọc ít tài liệu hơn nhưng đoán ít hơn;
- phân biệt intended behavior với observed implementation;
- giữ scope theo user request hoặc feature acceptance;
- chạy check đúng mức risk;
- resume feature dài mà không cần đọc lại toàn repo;
- không để state/docs rác tích tụ lâu dài.

## 4. Complexity must be earned

Trước khi tạo artifact, hỏi:

> Failure mode cụ thể nào sẽ xảy ra nếu artifact này không tồn tại?

Ví dụ:

| Artifact | Chỉ đáng tạo khi |
|---|---|
| Architecture overview | Repo đủ lớn để orientation từ code tốn kém; target medium repo mặc định đã đạt ngưỡng này |
| Subsystem doc | Pattern/boundary của subsystem khó suy ra hoặc hay bị làm sai |
| Product spec | Business rule hoặc edge case không thể đoán an toàn |
| Feature state | Project cần planned backlog hoặc work có dependency/handoff/persistence |
| Verify helper | Existing tool không cung cấp agent-facing command đủ rõ |
| Persistent garden report | Cleanup kéo dài qua nhiều phiên hoặc cần review riêng |

Missing optional artifact tốt hơn placeholder hoặc generic prose.

Với target 10k-200k LOC của corpus này:

- agent instruction entry point (`AGENTS.md` hoặc equivalent) MUST tồn tại;
- architecture overview (`ARCHITECTURE.md` hoặc existing equivalent) SHOULD tồn tại;
- chỉ omit architecture overview khi repo thực sự trivial hoặc existing docs đã trả lời đủ topology, entry points và boundaries.

Subsystem docs, specs, feature state và helper scripts vẫn hoàn toàn conditional.

## 5. Progressive disclosure

Không yêu cầu agent đọc toàn bộ docs trước khi code.

```text
AGENTS.md
  -> classify task
  -> focused architecture/subsystem/spec/feature doc nếu cần
  -> narrow code slice
  -> targeted feedback
```

`AGENTS.md` là router, không phải encyclopedia.

## 6. Flexible work model

Team 1-4 người cần coordination nhẹ:

- nhiều feature MAY cùng `in_progress`;
- một agent/session SHOULD có một primary task;
- feature index không phải lock hoặc ownership system;
- branch/worktree/issue assignment tiếp tục theo convention của repo;
- không thêm lease, scheduler hoặc workflow approval mặc định.

## 7. Intended vs observed truth

- Specs và architecture rules mô tả **intended** behavior/boundaries.
- Code, tests và runtime evidence mô tả **observed** implementation.

Khi conflict:

```text
collect evidence
  -> classify stale doc / code defect / test defect / incomplete migration / ambiguity
  -> repair đúng layer
```

MUST NOT tự động chọn code hoặc docs là đúng.

## 8. Stable interfaces, replaceable implementation

Agent-facing interfaces nên ít và ổn định:

- instruction entry point;
- documentation routes;
- optional feature state;
- verification commands.

Implementation phía sau có thể dùng Make, Nx, Turbo, Gradle, npm, pytest, shell, Node hoặc Python tùy repo.

## 9. Non-goals

Harness MUST NOT cố trở thành:

- Jira/Linear/GitHub Issues replacement;
- build system mới;
- universal architecture framework;
- full repository reverse-engineering report;
- semantic correctness oracle;
- enterprise governance hoặc compliance layer;
- mandatory multi-agent coordination protocol;
- generator tạo mọi file trong một fixed tree.

## 10. Decision test

Mỗi rule hoặc artifact mới phải vượt qua ba câu hỏi:

1. Nó ngăn failure mode nào đã thấy hoặc có xác suất cao?
2. Agent có phải trả chi phí này cho mọi task không?
3. Có cách nhẹ hơn để đạt cùng kết quả không?

Nếu lợi ích chưa rõ, mặc định không thêm.
