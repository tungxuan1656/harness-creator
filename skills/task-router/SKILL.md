---
name: task-router
description: Định tuyến và điều phối task theo harness v2.1 trên Node.js 20+.
license: MIT
---

# task-router

Skill này vận hành layout harness v2.1 tại repository root: `harness/`. Không dùng layout khác, đặc biệt không dùng `.agents/harness` hoặc chuyển nguồn chuẩn sang thư mục ẩn. Mọi đường dẫn dưới đây tính từ repository root và target Node.js là **20+**.

## Quy tắc nguồn chuẩn

- `harness/manifest.json` là registry duy nhất của feature và là nơi duy nhất chứa **feature status**.
- `docs/specs/<id>.md` là canonical spec, gồm scope, non-goals và acceptance observable.
- `harness/work/<id>.json` là work record dẫn xuất từ feature ID.
- `docs/plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md` là ExecPlan khi tier yêu cầu.
- `harness/progress.md` là tiến độ ngắn và evidence phù hợp; luôn cập nhật đúng contract.
- `harness/checks.json` là registry checks; `harness/scripts/validate.mjs` và `harness/scripts/run-checks.mjs` là target scripts.

Không biến prompt, ghi chú, log hay thông tin ngoài repository thành acceptance nếu chưa internalize vào owner document. Không xóa, làm yếu, bỏ qua hoặc hạ ngưỡng acceptance/check để có kết quả xanh. Nếu acceptance thật sự sai, sửa canonical spec trong **cùng thay đổi**, nêu reason và evidence, rồi cập nhật các nguồn bị ảnh hưởng.

## Step 0 — Presence và health

Trước khi route, kiểm tra `AGENTS.md` ở root và đúng bộ core files:

- `harness/manifest.json` — parse được và có top-level `schemaVersion: 1`, `mode`, `features`;
- `harness/checks.json` — parse được theo contract checks;
- `harness/progress.md` — đọc được;
- `harness/scripts/validate.mjs` — tồn tại và chạy được;
- `harness/scripts/run-checks.mjs` — tồn tại và chạy được.

Chạy validator của target harness:

```text
node harness/scripts/validate.mjs
```

Nếu thiếu hoặc malformed, chỉ gọi `harness-init` cho **một gap chính xác đã quan sát**: ghi path, lỗi và evidence. Không gọi init chung chung để tự chọn layout, không tự tạo registry/schema/script cạnh tranh. Sau bổ sung, chạy lại validator. Nếu không thể gọi init, ghi blocker rõ ràng thay vì giả định health đã đạt.

“Có file” chưa đủ: file phải đọc được, parse đúng contract và command phải có kết quả xác định. Lỗi Node/dependency/quyền/network/tool và lỗi app/validator/check đều phải báo cáo, không nuốt lỗi hay gọi là pass.

## Step 1 — Orientation

Thực hiện theo thứ tự, ghi lại command, status và evidence cần thiết:

1. Xác nhận repository root bằng `git rev-parse --show-toplevel`; xác nhận `harness/` nằm ngay dưới root.
2. Đọc `AGENTS.md` và architecture/design được file này chỉ dẫn, nếu có.
3. Đọc phần gần đây phù hợp của `harness/progress.md`.
4. Đọc git log gần đây, ví dụ `git log -n 10 --oneline`.
5. Đọc `harness/manifest.json` và feature/task entry liên quan.
6. Đọc matching mandatory `docs/specs/<id>.md`, work record `harness/work/<id>.json` và ExecPlan bắt buộc nếu có. ID/path phải khớp manifest; không thay bằng file tên gần giống.
7. Chạy `node harness/scripts/validate.mjs` sau orientation.
8. Nếu có `init.mjs` ở repository root, **phải chạy nó trước việc mới** như nghi thức orientation. Init template là bounded/cleanup/safe theo contract; không được biến điều kiện đó thành yêu cầu xem `--help`, safe thăm dò hoặc quyền bỏ qua tùy ý. Nếu init fail, báo lỗi và ưu tiên recovery trước khi route/thực thi; không tiếp tục như thể orientation đã đạt. Sau đó chạy quick checks an toàn phù hợp task.

Lỗi app hoặc environment ở bất kỳ bước nào có priority cao hơn việc tiếp tục route: báo lỗi, impact, phần chưa xác minh và next action. Không silently ignore và không retry vô hạn.

Mẫu orientation:

```text
root: <absolute repository root>
harness: <present/health result>
read: <AGENTS, architecture nếu có, progress, recent log, manifest, matching docs>
validator: <command, status, evidence>
quick-checks: <commands/status hoặc not run + reason>
app/environment issue: <none hoặc lỗi + impact>
```

## Step 2 — Route output

Route output luôn nêu rõ, không chỉ ghi nhãn tier:

```text
tier: Tier 0 | Tier 1 | Tier 2 | Tier 3
rationale: <evidence và vì sao tier khác không phù hợp>
sources read: <file/log/validator đã đọc>
artifacts to touch: <file/code/doc/check cụ thể>
observable done condition: <kết quả user/API/UI/validator có thể quan sát>
verification plan: <check, evidence location, effect flags>
done agreement: <optional; không phải approval gate>
```

Phân loại:

- **Tier 0 — stale maintenance:** chỉ khi user yêu cầu maintenance hoặc evidence chứng minh maintenance stale. Không để Tier 0 preempt incoming feature; route feature trước, maintenance là follow-up.
- **Tier 1 — isolated narrow session work:** thay đổi nhỏ, cô lập, acceptance đã rõ, không cần tracking feature xuyên session.
- **Tier 2 — tracked feature:** feature cần registry, canonical spec/work và lifecycle theo dõi.
- **Tier 3 — complex/risky/cross-session:** nhiều boundary/owner, migration/rollback, rủi ro đáng kể hoặc nhiều session; cần ExecPlan tự-contained.

Done agreement là tùy chọn và không phải approval gate. Tier 2/3 vẫn luôn cần acceptance observable dù có agreement hay không.

### Admission Tier 2/3

Mỗi entry trong `harness/manifest.json` đại diện cho Tier 2 hoặc Tier 3 và **chính xác** có các field:

```json
{
  "id": "<feature-id>",
  "order": 1,
  "status": "proposed",
  "owners": ["<owner>"],
  "dependsOn": [],
  "spec": "docs/specs/<feature-id>.md"
}
```

Top-level manifest **chỉ có** `schemaVersion: 1`, `mode`, `features`. Không thêm field `tier`, `dependencies` hoặc `work` vào entry; `dependsOn` là field duy nhất cho quan hệ phụ thuộc. Không thêm field entry tùy ý: mỗi entry phải đúng sáu field `id`, `order`, `status`, `owners`, `dependsOn`, `spec`.

Khi admit Tier 2/3, tạo hoặc cập nhật đồng bộ:

1. manifest entry đúng schema và owner;
2. canonical spec tại `docs/specs/<id>.md`, với ID khớp path/entry và acceptance observable;
3. work record dẫn xuất tại `harness/work/<id>.json`.

Tier 3 thêm ExecPlan đúng path và 12 heading ở dưới. Tier 0/1 chỉ là routing categories, **không** trở thành manifest feature entry.

Work record chỉ có schema sau ở mức field contract:

```json
{
  "schemaVersion": 1,
  "id": "<feature-id>",
  "acceptanceResults": [],
  "nextAction": "<non-empty next action>",
  "completion": null
}
```

Work không có `status` và không có `blocker`; feature status thuộc riêng manifest. Khi work chưa ở terminal state, `completion` là `null`. Với entry manifest `active` hoặc `blocked`, `nextAction` của work phải là chuỗi non-empty ghi hành động kế tiếp. Lý do/evidence của blocked nằm trong canonical plan, spec hoặc progress tùy nội dung; không phát minh field mới trong work schema.

Ở terminal state, `completion` là object đúng contract với các field `verifiedAt`, `completedAt`, `cancellationSummary`, `supersededBy`; giá trị không áp dụng là `null`. `completed` cần `nextAction: null`, `verifiedAt` và `completedAt` là UTC, cùng toàn bộ `acceptanceResults` đều met và có evidence. `cancelled` cần `nextAction: null` và `cancellationSummary` không rỗng. `superseded` cần `nextAction: null` và `supersededBy` là feature ID hợp lệ. Các terminal record không được dùng object completion để che acceptance chưa đạt.

### Manifest status model

Manifest chỉ dùng các status:

`proposed`, `planned`, `active`, `blocked`, `completed`, `cancelled`, `superseded`.

Ý nghĩa vận hành:

- `proposed`: đã nêu nhưng chưa đủ admission;
- `planned`: đã admitted, có acceptance và kế hoạch cần thiết;
- `active`: đang thực hiện;
- `blocked`: chưa thể tiến hành, phải có `nextAction` trong work và reason/evidence ở source phù hợp;
- `completed`: acceptance observable và verification có evidence;
- `cancelled`: dừng có chủ ý, ghi reason/evidence;
- `superseded`: bị thay bởi feature khác, ghi ID thay thế và lý do.

Transition có owner và evidence. Trong execution sequential, tại một thời điểm tối đa một feature là `active` hoặc `blocked`; feature khác ở status thích hợp như `proposed` hoặc `planned`. `blocked` không phải `completed`.

## ExecPlan Tier 3

Đặt plan tại:

```text
docs/plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md
```

`YYYY-MM-DD` là ngày tạo, `<subject-id>` khớp feature ID, `<intent>` là slug ngắn ổn định. Frontmatter phải parse được, tự-contained và **chính xác** có các field:

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

Plan initial là `draft`. Plan status riêng dùng đúng các giá trị `draft`, `ready`, `active`, `blocked`, `paused`, `completed`, `cancelled`, `superseded`; feature status vẫn chỉ nằm trong manifest. Compatibility giữa hai lifecycle là: feature `proposed` → plan `draft`; feature `planned` → plan `draft` hoặc `ready`; feature `active` → plan `draft`, `ready`, `active`, `blocked` hoặc `paused`. Khi feature ở terminal status (`completed`, `cancelled`, `superseded`), không được có plan nonterminal (`draft`, `ready`, `active`, `blocked`, `paused`). Không đặt plan ở path khác và không tạo bản sao. Plan phải ghi đủ context, quyết định, acceptance, commands, evidence, dependency, recovery và handoff để người khác tiếp tục mà không cần trí nhớ tác giả; plan là execution record tự-contained, không thay thế hoặc tuyên bố là bản sao của canonical product truth trong spec/manifest.

Phần thân phải có **đúng 12 mandatory headings theo đúng thứ tự**:

## Purpose / Big picture
## Context and orientation
## Plan of work
## Concrete steps
## Validation and acceptance
## Idempotence and recovery
## Artifacts and notes
## Interfaces and dependencies
## Progress
## Surprises & discoveries
## Decision log
## Outcomes & retrospective

Plan lifecycle dùng plan status ở frontmatter và phải tương thích với feature status trong manifest. Cập nhật `Progress` và source-of-truth liên quan ở mỗi mốc; khi superseded/cancelled phải giữ lịch sử, reason và liên kết thay thế. Chỉ chuyển plan sang terminal status khi acceptance và verification có evidence phù hợp; feature status terminal không được để plan nonterminal.

## Thực thi

1. Thông tin ngoài repository chỉ được dùng sau khi internalize vào owner document: requirement/acceptance vào spec; context, quyết định và evidence vào plan/progress/work theo contract. Ghi nguồn và phạm vi khi cần truy nguyên.
2. Không xóa hoặc loosen acceptance/check để pass. Nếu criterion thật sự sai, sửa canonical spec trong cùng change với reason/evidence; không chỉ sửa test hoặc work record.
3. Không mở rộng scope sang cleanup/refactor/maintenance chưa route. Ghi follow-up riêng.
4. Mỗi điểm dừng cập nhật đúng nguồn: manifest cho feature status, spec cho requirement/acceptance, work cho acceptanceResults/nextAction/completion, plan cho plan status/context, và plan/progress cho blocker reason cùng evidence.

## Verification

### Theo tier

- **Tier 1:** chạy mechanical check liên quan đến artifact/acceptance: validator, test, lint, typecheck, build hoặc command tương ứng; ghi command, exit status và evidence.
- **Tier 2/3:** self-check có cấu trúc và adversarial: liệt kê failure plausible (happy path, input biên, dependency, regression, permission/state, compatibility và failure mode riêng); test observable behavior của user/API/UI; ghi expected/actual, command, status, artifact/log và kết luận.
- Independent evaluator là tùy chọn cho risk có ý nghĩa, không bắt buộc. Self-score chủ quan không phải completion evidence. Coverage 100% chỉ áp dụng nếu canonical spec/policy yêu cầu.

### Checks và effect flags

`harness/checks.json` dùng effect model `declaredEffects` với đúng các key:

```text
{network, writes, services, installs, secrets}
```

Runner dùng đúng các flag tương ứng:

```text
--allow-network
--allow-writes
--allow-services
--allow-installs
--allow-secrets
```

Trước khi chạy `node harness/scripts/run-checks.mjs`, đọc registry và usage của runner. Chỉ truyền flag explicit tương ứng với effect đã khai báo/cần thiết; mặc định ưu tiên safe mode. Không tự chế tên flag, không dùng flag “allow all”, không ngầm cấp quyền. Ghi flags, effect profile và kết quả.

Registry checks rỗng là **incomplete/non-pass**. Không bịa check hoặc result; bổ sung check hợp lệ, hoặc ghi quyết định có reason/evidence rằng check không áp dụng, theo contract của owner. Ở handoff chạy full validation và checks được yêu cầu; nếu không chạy được, báo nguyên nhân app/environment, phần chưa xác minh và nextAction, không chuyển manifest sang `completed`.

## Clean handoff

Trước khi kết thúc session:

- cập nhật manifest entry đúng sáu field, đặc biệt status/owners/spec liên quan;
- cập nhật canonical spec nếu requirement/acceptance đổi;
- cập nhật work với đúng năm field `schemaVersion`, `id`, `acceptanceResults`, `nextAction`, `completion`, không thêm status hoặc blocker;
- nếu có ExecPlan, cập nhật frontmatter plan status tương thích và cả bốn heading `Progress`, `Surprises & discoveries`, `Decision log`, `Outcomes & retrospective`; plan là execution record, không phải bản sao của canonical product truth;
- cập nhật `harness/progress.md` bằng **một dòng** tiến độ ngắn;
- ghi kết quả `git status --short` và file ngoài scope nếu phát hiện.

Task incomplete/blocked phải có `nextAction` chính xác trong work. Block reason/evidence ghi ở plan/spec/progress phù hợp. Không dùng “tiếp tục sau” làm nextAction. Không auto-commit; chỉ commit khi user hoặc repository policy yêu cầu rõ ràng.

## Stuck loop

Sau retry hợp lý mà cùng lỗi lặp lại, dừng retry và phân loại gap là **missing capability**, **missing documentation**, **missing check** hoặc **missing access**. Ghi classification, command/evidence, impact và nextAction vào source phù hợp. Gọi `harness-init` cho một addition tập trung, nêu chính xác gap/capability/doc/check/access và contract cần bổ sung; không yêu cầu init sửa chung, không đổi layout, không nới acceptance.

## Checklist

- [ ] Root đúng; layout dùng `harness/` và `docs/` chuẩn.
- [ ] `AGENTS.md`, năm core files, validator và runner đã health-check.
- [ ] Orientation đã đọc progress, git log, manifest và matching docs; mọi app/environment failure đã báo.
- [ ] Route output đủ tier, rationale, sources, artifacts, observable done condition và verification plan.
- [ ] Tier 0/1 không vào manifest; Tier 2/3 có manifest + spec + derived work.
- [ ] Manifest entry đúng sáu field; work không có status/blocker.
- [ ] Tier 3 dùng đúng filename/frontmatter và 12 heading bắt buộc.
- [ ] Checks dùng đúng declaredEffects/flags; registry rỗng không bị coi là pass.
- [ ] Source-of-truth, progress một dòng và git status đã cập nhật; chưa auto-commit.
