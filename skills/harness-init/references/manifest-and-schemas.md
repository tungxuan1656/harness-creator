# Manifest, work và schemas

Các file trong `templates/schemas/` là JSON Schema Draft 2020-12 cho structural shape.
Schema không tự quyết định file tồn tại, lifecycle, prerequisite hay correspondence
giữa spec và work; `harness/scripts/validate.mjs` thực thi semantic/cross-file rules.

## Manifest canonical

```json
{
  "schemaVersion": 1,
  "mode": "sequential",
  "features": [
    {
      "id": "example-feature",
      "order": 1,
      "status": "planned",
      "owners": ["team-example"],
      "dependsOn": [],
      "spec": "docs/specs/example-feature.md"
    }
  ]
}
```

Mọi manifest entry là feature tracked Tier 2/3. Tier 0/Tier 1 không được đăng ký.
Manifest không có title, behavior, acceptance prose hay work path. Spec path luôn suy
ra đúng theo ID và là nguồn chuẩn duy nhất cho title, behavior và acceptance.

Status hợp lệ là `proposed`, `planned`, `active`, `blocked`, `completed`, `cancelled`,
`superseded`. `owners` là mảng string không rỗng. `dependsOn` là mảng ID duy nhất,
mọi ID phải tồn tại và không tự trỏ. Sequential có một slot active/blocked; prerequisite
hard của active/blocked/completed phải completed.

## Work canonical

Work path được suy ra là `harness/work/<id>.json`. Top-level có đúng:
`schemaVersion`, `id`, `acceptanceResults`, `nextAction`, `completion`; schemaVersion là
1. Mỗi acceptance result có đúng `id`, `met`, `evidence`, evidence là string hoặc null.
`nextAction` là string hoặc null.

Completion null hoặc object chỉ có `verifiedAt`, `completedAt`, `cancellationSummary`,
`supersededBy`. Active/blocked cần next action không rỗng. Completed cần nextAction null,
verifiedAt/completedAt ISO UTC, mọi acceptance met và evidence. Cancelled cần nextAction
null cùng cancellationSummary không rỗng. Superseded cần nextAction null cùng
supersededBy tồn tại và khác chính nó. Các status còn lại cần completion null.

Work không lặp title, behavior, acceptance prose, status hay blocker. Evidence phải là
command/path/result/receipt có thể kiểm tra; không coi việc spawn command là acceptance.

## Spec và acceptance

Spec có identity heading và stable lines:

```markdown
# Feature: example-feature

## Acceptance criteria
- [a1] Validator rejects an unknown key.
- [a2] Runner writes an observable receipt.
```

Validator đọc ID theo đúng thứ tự và bắt work khớp exact sequence. Đổi behavior thì
đổi spec canonical trước, không sửa work để làm gate xanh.

## Checks

```json
{
  "schemaVersion": 1,
  "checks": [
    {
      "id": "safe-check",
      "argv": ["node", "--test"],
      "cwd": ".",
      "quick": true,
      "requiredByDefault": true,
      "timeoutMs": 120000,
      "declaredEffects": {
        "network": false,
        "writes": false,
        "services": false,
        "installs": false,
        "secrets": false
      }
    }
  ]
}
```

`argv` là array trực tiếp cho `spawn`, không phải shell string. Quick chỉ chọn check
safe; full chọn required-by-default và yêu cầu explicit effect flags.
