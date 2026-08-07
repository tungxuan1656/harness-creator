# Harness Design Corpus

## Mục đích

Bộ tài liệu này là nguồn thiết kế chuẩn để xây dựng **một skill `harness`**. Skill giúp AI coding agent thiết lập hoặc cải thiện bộ khung làm việc trong nhiều repository khác nhau.

Đối tượng mặc định:

- project khoảng 10k-200k LOC;
- team 1-4 người;
- một hoặc vài agent làm việc cùng con người;
- feature thường hoàn thành trong một hoặc vài phiên;
- tốc độ delivery và feedback quan trọng hơn governance nặng.

## Mục tiêu

Harness phải giúp agent:

```text
Find nhanh
  -> Understand đủ
  -> Change đúng scope
  -> Verify theo risk
  -> Leave clean state
```

Task nhỏ lý tưởng chỉ cần:

```text
AGENTS.md
  -> một doc liên quan nếu cần
  -> code/test liên quan
  -> targeted hoặc affected verification
```

Không bắt task nhỏ tạo feature file, persistent plan, progress log hoặc chạy full suite nếu chúng không tạo giá trị.

## Một skill, nhiều workflow

`harness` là public skill duy nhất. Sau khi inspect request và repository, skill chỉ chạy workflow cần thiết:

| Workflow | Dùng khi | Artifact thường gặp |
|---|---|---|
| `adopt` | Tạo hoặc nâng cấp harness | Điều phối các workflow cần thiết |
| `map` | Agent khó tìm code hoặc hiểu boundaries | `AGENTS.md`, architecture/subsystem docs |
| `specs` | Product/domain behavior khó suy ra an toàn | `docs/specs/*` |
| `features` | Work đủ lớn để cần persistent scope/handoff | `feature_index.json`, `features/*` |
| `verify` | Chuẩn hóa feedback loop | `init.sh`, `scripts/verify/*` khi cần |
| `garden` | Dọn stale docs/state/code patterns | Structural scan, semantic audit, targeted repair |

Workflow không phải sub-skill và không cần cơ chế skill gọi skill.

## Tài liệu canonical

1. `01-SCOPE_AND_PRINCIPLES.md` - scope, priorities và non-goals.
2. `02-TARGET_HARNESS.md` - kiến trúc artifact trong target repository.
3. `03-KNOWLEDGE_AND_OWNERSHIP.md` - progressive disclosure, truth và mutation rules.
4. `04-WORK_AND_FEATURE_MODEL.md` - task classes, feature state và handoff.
5. `05-VERIFICATION.md` - `init.sh` adapter và verification contract.
6. `06-GARDENING.md` - structural, semantic và cleanup workflow.
7. `07-HARNESS_SKILL_SPEC.md` - contract của public skill.
8. `08-WORKFLOWS.md` - end-to-end flows.
9. `09-EVALS_AND_MIGRATION.md` - quality gates, evals và migration.

Templates trong `templates/` là starting points, không phải scaffold bắt buộc.

## Normative language

- **MUST**: cần để giữ correctness hoặc tránh failure mode lớn.
- **SHOULD**: mặc định nên làm, có thể bỏ khi repo có evidence hợp lý.
- **MAY**: tùy chọn.
- **MUST NOT**: gây drift, false confidence hoặc overhead đáng kể.

## Nguồn tham khảo

- OpenAI, Harness engineering: https://openai.com/index/harness-engineering/
- Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic, Harness design for long-running application development: https://www.anthropic.com/engineering/harness-design-long-running-apps
- matklad, ARCHITECTURE.md: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html

Các nguồn này cung cấp design hypotheses. Hiệu quả của skill vẫn phải được kiểm chứng trên representative repositories và tasks.
