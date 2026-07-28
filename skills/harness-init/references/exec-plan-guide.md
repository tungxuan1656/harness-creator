# ExecPlan guide v2.1

ExecPlan dùng đúng một file trong target:
`docs/plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md`.
Không dùng tên ngắn khác, không đặt plan trong harness. File phải có standard
frontmatter và 12 heading dưới đây, đúng thứ tự. Plan self-contained: link spec để
truy nguyên nhưng ghi đủ context, quyết định, command và evidence cho người thực thi.

## Frontmatter chuẩn

```yaml
---
schemaVersion: 1
class: exec-plan
id: <plan-id>
featureId: <feature-id>
title: <title>
status: draft
owner: <owner>
dependsOnPlans: []
---
```

**Lifecycle và compatibility:** Plan status hợp lệ chính xác: `draft | ready | active | blocked | paused | completed |
cancelled | superseded`. Feature parent tương thích như sau: `proposed → draft`; `planned
→ draft/ready`; `active → draft/ready/active/blocked/paused`; `completed`, `cancelled` và
`superseded` không có plan nonterminal. Plan `active` hoặc `blocked` bắt buộc parent
feature `active`; plan `ready` bắt buộc parent `planned` hoặc `active`. Mọi hard
`dependsOnPlans` chỉ được thỏa mãn bởi plan `completed`.

## 12 heading bắt buộc

1. `Purpose / Big picture`
2. `Context and orientation`
3. `Plan of work`
4. `Concrete steps`
5. `Validation and acceptance`
6. `Idempotence and recovery`
7. `Artifacts and notes`
8. `Interfaces and dependencies`
9. `Progress`
10. `Surprises & discoveries`
11. `Decision log`
12. `Outcomes & retrospective`

Mỗi heading phải có nội dung cụ thể hoặc ghi rõ “none” kèm lý do. Validation map mọi
acceptance ID tới command và evidence. Progress ghi status/owner/next action thật,
không biến plan thành work record. Rollback, retry và boundary phải rõ để plan có thể
tiếp tục sau khi session bị gián đoạn.
