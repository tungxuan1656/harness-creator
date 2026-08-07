# Decisions and Open Questions

## Accepted design decisions

### D001 — Split monolithic harness skill
**Decision:** dùng skill pack chuyên trách.

**Reason:** giảm cognitive mode switching, cải thiện eval và rerun isolation.

### D002 — Baseline knowledge
**Decision:** `AGENTS.md` + `ARCHITECTURE.md` là baseline cho repo trung bình.

### D003 — Conditional subsystem docs
**Decision:** `BACKEND.md`, `FRONTEND.md`, `MOBILE.md`,... chỉ tạo theo topology/evidence.

### D004 — Repository-local specs
**Decision:** product/domain specs quan trọng sống trong repo để agent discover.

### D005 — Repo-local feature execution index
**Decision:** giữ `feature_index.json` + Markdown feature detail.

### D006 — Feature index is not PM system
**Decision:** minimal execution metadata only.

### D007 — Parallel team
**Decision:** không enforce global one-active feature; một session focus một primary feature.

### D008 — Progress log
**Decision:** không baseline; per-feature `Handoff` mặc định.

### D009 — Verification modes
**Decision:** `quick`, `affected`, `full`, `doctor`.

### D010 — Verification orchestration
**Decision:** reuse existing build tools, parallel independent jobs, compact output.

### D011 — Gardening separated
**Decision:** deterministic doctor tách khỏi semantic garden.

### D012 — Garden audit-first
**Decision:** không auto broad refactor.

### D013 — High-density docs
**Decision:** diagrams/tables/rules > verbose prose khi semantic tương đương.

### D014 — No empty docs
**Decision:** missing optional doc tốt hơn generic artifact.

### D015 — Intended vs observed truth
**Decision:** conflict phải investigate, không auto chọn code/docs.

## Open questions

### Q001 — `feature_index.json` hay YAML?
Current recommendation: JSON vì machine-friendly và hạn chế accidental prose edits.

Revisit nếu tooling/YAML ecosystem của repo tạo lợi ích rõ.

### Q002 — Feature detail Markdown có frontmatter không?
Current recommendation: không cần duplicate status; có thể chỉ header ID/title.

Frontmatter chỉ thêm khi machine tooling thực sự cần.

### Q003 — Doctor implementation language
Không có universal answer.

Options:
- Node;
- Python;
- shell;
- project-native task runner.

Decision per repo/tooling.

### Q004 — Có cần harness manifest?
Ví dụ `.harness/config.json`.

Current: **không** baseline.

Add only khi verify/component mapping hoặc tooling cần machine config shared.

### Q005 — Có cần `docs/decisions/` baseline?
Current: conditional.

Dùng khi decisions không thể suy ra và có durable consequences.

### Q006 — Có cần global `progress.md`?
Current: no.

Revisit bằng đo resume cost thực tế.

### Q007 — Bootstrap có thực sự gọi được skill khác?
Tool/environment dependent.

Contract phải hỗ trợ cả:
- direct orchestration;
- ordered manual sequence.
