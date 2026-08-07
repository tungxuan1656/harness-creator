# Harness Skill Pack — Design Corpus

## Mục đích

Bộ tài liệu này là **nguồn thiết kế chuẩn** để xây dựng một bộ skill mang tiền tố `harness-*` dành cho AI coding agent làm việc trên repository quy mô trung bình, team nhỏ khoảng 1–4 người.

Mục tiêu không phải tối đa hóa số quy trình. Mục tiêu là tạo một môi trường mà agent:

1. nắm codebase nhanh;
2. tìm đúng nguồn chân lý mà không phải đọc quá nhiều code;
3. biết feature/task hiện tại cần đạt gì;
4. sửa đúng phạm vi và theo đúng pattern;
5. nhận feedback kiểm chứng nhanh;
6. có thể tiếp tục công việc qua nhiều phiên khi cần;
7. không làm knowledge base, feature state và codebase tích tụ "AI garbage".

## Phạm vi mục tiêu

Thiết kế ưu tiên cho:

- project nhỏ đến trung bình, đặc biệt khoảng 10k–200k LOC;
- monorepo hoặc multi-component ở mức vừa phải;
- team 1–4 người;
- một hoặc vài AI coding agents làm việc cùng con người;
- feature/task thường hoàn thành trong một phiên hoặc vài phiên;
- throughput và tốc độ phản hồi quan trọng;
- không yêu cầu governance kiểu enterprise.

Không tối ưu mặc định cho:

- hàng trăm engineer hoặc hàng chục autonomous agent cùng ghi;
- workflow phải audit theo chuẩn compliance cao;
- distributed scheduler/lease/lock cho multi-agent;
- project management thay Jira/Linear/GitHub Issues;
- build system thay thế hệ thống build hiện có.

## Nguyên tắc tối cao

> **Slim không có nghĩa là ít file nhất. Slim nghĩa là agent chỉ trả chi phí đọc, suy luận và quy trình cho những capability mà task hiện tại thực sự cần.**

Một repo có thể có nhiều tài liệu, nhưng bug nhỏ lý tưởng chỉ cần:

```text
AGENTS.md
  → tài liệu subsystem liên quan
  → code/test liên quan
  → ./init.sh affected
```

## Skill pack đề xuất

| Skill | Trách nhiệm chính | Artifact chính |
|---|---|---|
| `harness-bootstrap` | Điều phối bootstrap/adoption | Không sở hữu nhiều artifact; điều phối |
| `harness-map` | Hiểu và lập bản đồ repo | `AGENTS.md`, `ARCHITECTURE.md`, subsystem docs |
| `harness-specs` | Chuẩn hóa product/domain behavior | `docs/specs/*` |
| `harness-features` | Phân rã execution backlog | `feature_index.json`, `features/*` |
| `harness-verify` | Feedback loop nhanh và đúng | `init.sh`, doctor/verify helpers nếu cần |
| `harness-garden` | Chống entropy và semantic drift | Audit/repair theo scope |

## Trình tự đọc bộ tài liệu

1. `01-VISION_AND_SCOPE.md`
2. `02-DESIGN_PHILOSOPHY.md`
3. `03-SYSTEM_ARCHITECTURE.md`
4. `04-KNOWLEDGE_ARCHITECTURE.md`
5. `05-SOURCE_OF_TRUTH_AND_OWNERSHIP.md`
6. `06-SKILL_PACK_ARCHITECTURE.md`
7. các tài liệu `07`–`12` cho từng skill
8. `13-DOCUMENT_WRITING_STANDARD.md`
9. `14-FEATURE_MODEL.md`
10. `15-VERIFICATION_DESIGN.md`
11. `16-GARDENING_AND_ENTROPY.md`
12. `17-WORKFLOWS.md`
13. `18-SKILL_AUTHORING_STANDARD.md`
14. `19-QUALITY_AND_EVALS.md`
15. `20-ANTI_PATTERNS.md`
16. `21-ROADMAP.md`
17. `22-DECISIONS_AND_OPEN_QUESTIONS.md`
18. `23-REFERENCE_TRACEABILITY.md`

## Normative language

Trong corpus này:

- **MUST**: yêu cầu bắt buộc để giữ tính đúng hoặc tránh failure mode lớn.
- **SHOULD**: mặc định nên làm, nhưng có thể bỏ nếu repo cung cấp bằng chứng hợp lý.
- **MAY**: tùy chọn.
- **MUST NOT**: cấm vì gây drift, duplication hoặc overhead đáng kể.

Các từ này được giữ bằng tiếng Anh để dễ chuyển trực tiếp sang `SKILL.md`.
