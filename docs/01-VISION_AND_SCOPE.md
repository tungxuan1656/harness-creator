# Vision and Scope

## 1. Vấn đề cần giải quyết

AI coding agent thường mất thời gian và chất lượng ở bốn điểm:

1. **Orientation cost** — không biết "thing X nằm ở đâu", phải đọc rất nhiều file để dựng mental model.
2. **Intent loss** — nghiệp vụ, architectural decisions và team conventions sống ngoài repository hoặc bị rải rác.
3. **Execution drift** — agent cố làm quá nhiều, đi ngoài scope, hoặc tuyên bố xong trước khi behavior được kiểm chứng.
4. **Entropy** — agent sao chép pattern hiện hữu, bao gồm cả pattern xấu; docs, feature state và code có thể drift theo thời gian.

Harness phải giảm các chi phí này mà không tạo ra một "project management framework" mới.

## 2. Vision

`harness-*` là một **repository cognition + execution feedback layer**.

Nó phải giúp một agent mới có thể:

```text
Find → Understand → Focus → Change → Verify → Leave clean state
```

với số bước non-code nhỏ nhất có thể.

## 3. Mục tiêu định lượng định hướng

Đây là design targets, không phải SLA cứng:

- Một agent mới hiểu được high-level code map sau khi đọc `AGENTS.md` + `ARCHITECTURE.md`.
- Một task cục bộ không cần đọc toàn bộ documentation tree.
- Feature acceptance phải có thể kiểm chứng.
- Verification mặc định ưu tiên `affected`, không ép full suite cho mọi thay đổi.
- Output verify phải ưu tiên summary + failures, không bơm log pass dài vào context.
- Tài liệu phải có signal/token ratio cao.
- Rerun một skill không được tùy tiện phá artifact do skill khác sở hữu.

## 4. Không-mục-tiêu

Harness MUST NOT cố trở thành:

- Jira/Linear replacement;
- workflow engine cho con người;
- lock manager cho concurrent agents;
- framework kiến trúc chung áp cho mọi codebase;
- generator tạo tài liệu chỉ để "đủ bộ";
- build tool cạnh tranh với Nx, Turborepo, Gradle, Make, Task, Just, Bazel, v.v.;
- semantic correctness oracle.

## 5. Đối tượng project

### Greenfield

Harness có thể giúp chuyển:

```text
requirements
  → product/domain specs
  → feature backlog
  → implementation
  → verification
```

### Existing repo

Harness phải ưu tiên:

```text
inspect existing truths
  → map
  → reuse existing commands
  → document only durable gaps
  → create execution state only for planned/current work
```

Nó MUST NOT "reverse engineer toàn bộ code thành backlog" nếu người dùng không yêu cầu.

## 6. Team model

Team 1–4 người có thể làm song song. Vì vậy:

- repository MAY có nhiều feature `in_progress`;
- một agent/session SHOULD tập trung vào một primary feature/task;
- harness không nên áp invariant "toàn repo chỉ có một active feature" trừ khi project explicitly chọn single-stream mode.

## 7. Success condition

Harness thành công khi:

> Agent phải đọc ít hơn, đoán ít hơn, làm đúng hơn và verify nhanh hơn — chứ không phải khi repository có nhiều file harness hơn.
