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

# ExecPlan: <plan-id>

Plan này self-contained. Người thực thi chỉ cần repository hiện tại, repo-local
knowledge, spec canonical và nội dung plan này; không phụ thuộc instruction ẩn. Cập
nhật plan trong lúc thực thi. File target phải có tên
`YYYY-MM-DD--plan--<subject-id>--<intent>.md` dưới `docs/plans/`.

Plan status hợp lệ chính xác là `draft`, `ready`, `active`, `blocked`, `paused`,
`completed`, `cancelled`, `superseded`. Compatibility với feature parent: feature
`proposed` chỉ cho plan `draft`; `planned` cho `draft` hoặc `ready`; `active` cho
`draft`, `ready`, `active`, `blocked` hoặc `paused`; feature `completed`, `cancelled`
hoặc `superseded` không còn plan nonterminal. Plan `active` hoặc `blocked` cần parent
feature `active`; plan `ready` cần parent `planned` hoặc `active`. Mọi hard
`dependsOnPlans` phải trỏ tới plan đã `completed`.

## Purpose / Big picture

Nêu vấn đề, giá trị user/operator, feature ID, kết quả observable và mục tiêu đo được.
Link spec canonical tại `docs/specs/<feature-id>.md`.

## Context and orientation

Ghi root, AGENTS, architecture, references, manifest entry, spec, work, code path,
constraint và command đã đọc/chạy trong recon. Nêu rõ assumption nào là repo-local.

## Plan of work

Mô tả approach nhỏ nhất đáp ứng spec, scope, non-goals, invariants và thứ tự work cấp cao.

## Concrete steps

Đưa các bước theo thứ tự, chỉ rõ file/artifact, input, output, owner, điều kiện chuyển
bước và cách step sau kiểm tra kết quả. Không giấu work bằng “v.v.”.

## Validation and acceptance

Map từng acceptance ID từ spec tới command, expected exit/status và evidence path. Ghi
negative case, anti-cheat check và effect flag cần approval.

## Idempotence and recovery

Nêu cách chạy lại an toàn, dry-run, cleanup, rollback, recovery sau timeout hoặc session
bị gián đoạn. Xác định thao tác nào không được tự động hóa.

## Artifacts and notes

Liệt kê file, fixture, receipt, snapshot, tài liệu và artifact gate sẽ tạo hoặc cập nhật.
Artifact không phải evidence nếu chưa có cách kiểm tra cụ thể.

## Interfaces and dependencies

Mô tả API, CLI argv, schema, boundary, interface compatibility và prerequisite của repo.
Nêu external service/capability cần có; không giấu effect.

## Progress

Ghi entry có ngày, status, owner, command, kết quả, evidence và next action. Đây là log
thực thi, không thay cho work JSON.

## Surprises & discoveries

Ghi phát hiện khác dự kiến, failure mode, constraint mới và ảnh hưởng tới plan/spec.
Không xóa lịch sử phát hiện.

## Decision log

Ghi quyết định, ngày, người quyết định, lựa chọn bị loại và rationale. Nếu acceptance
thay đổi, sửa spec canonical cùng thay đổi và ghi lý do/evidence.

## Outcomes & retrospective

Đối chiếu mục tiêu với kết quả observable, acceptance/evidence đã đạt, phần còn thiếu,
rủi ro còn lại, follow-up và điều kiện handoff/lifecycle cuối cùng.
