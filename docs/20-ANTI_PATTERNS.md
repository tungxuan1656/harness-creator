# Anti-Patterns and Failure Modes

## 1. Mega `AGENTS.md`

### Symptom
Mọi rule, architecture, specs, workflow vào một file.

### Harm
Context crowding, rule dilution, stale blob.

### Fix
Router + progressive disclosure.

---

## 2. Checklist-driven docs generation

### Symptom
Tạo `SECURITY.md`, `RELIABILITY.md`, `MOBILE.md` dù không có nội dung thực.

### Harm
Generic/stale docs trở thành false authority.

### Fix
Conditional evidence-based creation.

---

## 3. Manifest-only architecture

### Symptom
Đọc `package.json` rồi kết luận system architecture.

### Harm
Stack đúng nhưng flows/boundaries sai.

### Fix
Inspect representative entry points + code path + tests.

---

## 4. Jira clone in Git

### Symptom
Feature JSON chứa sprint, estimates, comments, assignees, due dates.

### Harm
Duplicate state systems drift.

### Fix
Execution-only index.

---

## 5. Global one-active-feature lock

### Symptom
Toàn repo chỉ được một feature active.

### Harm
Cản team 1–4 người parallel.

### Fix
Multiple `in_progress`; one primary feature per agent/session.

---

## 6. Mandatory progress diary

### Symptom
Mọi micro-change phải ghi chronological log dài.

### Harm
Non-code overhead và duplicated history.

### Fix
Per-feature handoff; global progress optional.

---

## 7. Full verification on every iteration

### Harm
Wall-clock lớn, agent tránh chạy checks.

### Fix
targeted/affected by default; full theo risk/milestone.

---

## 8. Naive parallelism

### Symptom
`command1 & command2 & command3`.

### Harm
Race, DB contention, unreadable output.

### Fix
Job DAG + bounded concurrency + aggregation.

---

## 9. Build-system reinvention

### Symptom
`init.sh` duplicate logic Nx/Gradle/Make đã làm.

### Fix
Thin stable adapter.

---

## 10. Silent missing checks

### Symptom
Tool/test absent nhưng output vẫn green.

### Fix
Required/optional/N/A semantics.

---

## 11. Semantic lint bằng regex

### Symptom
Script tuyên bố docs đúng/sai dựa keyword.

### Harm
False confidence.

### Fix
Mechanical doctor vs reasoning garden separation.

---

## 12. Garden auto-refactor

### Symptom
Audit tìm smell rồi rewrite rộng.

### Harm
Scope explosion, new defects.

### Fix
Audit-first; repair explicitly authorized.

---

## 13. "Code is always truth"

### Harm
Architectural drift được hợp thức hóa.

### Fix
Distinguish intended vs observed.

---

## 14. "Docs are always truth"

### Harm
Stale docs phá implementation đúng.

### Fix
Conflict protocol.

---

## 15. Rerun churn

### Symptom
Mỗi lần skill chạy lại rewrite wording/IDs/tree.

### Harm
Noisy diffs, loss of trust.

### Fix
Stable IDs, preserve correct content, patch only semantic changes.

---

## 16. Harness assumptions fossilize

### Symptom
Rule tạo cho model cũ vẫn bắt buộc dù model/tool mới không cần.

### Fix
Periodically reevaluate cost vs failure mode.
