---
name: harness-init
description: Khởi tạo harness v2.1 dependency-free cho Node.js 20+ theo contract JSON nghiêm ngặt.
license: MIT
---

# Harness Init v2.1

## Nguyên tắc

Skill này tạo harness canonical cho một repository Node.js 20+. Nó không cài dependency,
không chạy migration ứng dụng và không tự thêm data model khác.

- **Recon-first**: đọc root, `AGENTS.md`, architecture, manifest, spec, plan, reference
  và trạng thái harness hiện hữu trước khi thay đổi.
- **Missing-only**: chỉ tạo artifact còn thiếu, báo rõ `CREATE`/`SKIP`, không overwrite.
- **Migrate-old-layout có chủ đích**: chỉ nhận diện `.agents/harness` và `cairn`; mặc định
  dừng, chỉ bổ sung canonical tree khi caller đưa `--migrate-old-layout`, giữ nguyên dữ liệu cũ.
- JSON manifest/work/check là state canonical; không suy luận state từ log, tên file hay comment.
- Không tạo thư mục rỗng hoặc file placeholder trong target. Artifact tùy chọn chỉ tạo khi có nội dung.
- Entrypoint tùy chọn là root `init.mjs`; không dùng hoặc sinh `init.sh`.

## Quy trình creator

Luôn dry-run trước, đọc output, sau đó real-run bằng cùng metadata:

```sh
node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Mục đích repository" \
  --verification-command "node --test" \
  --dry-run

node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo \
  --purpose "Mục đích repository" \
  --verification-command "node --test"
```

Creator yêu cầu target đã tồn tại, nhận diện root `harness` canonical bằng
`schemaVersion: 1` và `features` array, không đoán từ file schemaVersion rời rạc. Với
root canonical hiện có, creator chỉ augment gap còn thiếu.

Init chỉ được copy khi có `--with-init` cùng `--start-argv` và `--smoke-argv` là JSON
array tường minh; `--readiness-url` là HTTP(S) tùy chọn:

```sh
node harness-init/scripts/create-harness.mjs /path/to/repo \
  --repo-name my-repo --purpose "Mục đích" --verification-command "node --test" \
  --with-init \
  --start-argv '["node","server.mjs"]' \
  --smoke-argv '["node","smoke.mjs"]' \
  --readiness-url 'http://127.0.0.1:3000/health'
```

Init dùng `spawn` với argv và `shell:false`, readiness có giới hạn thời gian, output được
capture/hiển thị, cleanup process bằng `SIGTERM`; không shell, install hoặc migrate.

## Canonical target tree

```text
AGENTS.md
ARCHITECTURE.md                                      # optional
init.mjs                                              # optional root entrypoint
harness/
  manifest.json
  checks.json
  progress.md
  schemas/{manifest,checks,work}.schema.json
  scripts/{validate,run-checks}.mjs
  work/<id>.json
  work/receipts/*.json                                # chỉ sau một lần check thực sự chạy
docs/
  specs/<id>.md
  plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md
  references/<topic>.md
```

`ARCHITECTURE.md`, root `init.mjs`, docs, work và receipts là optional. Không tạo
directory rỗng để giữ chỗ. Artifact gate tùy chọn (fixture, snapshot, receipt, tài liệu)
chỉ có ý nghĩa khi spec nêu nó bằng acceptance ID và evidence chỉ rõ path/command kiểm tra.

## Ownership v2.1

Manifest chỉ đăng ký feature tracked Tier 2/3; Tier 0/Tier 1 không phải manifest entry.
Top-level manifest có đúng `schemaVersion`, `mode`, `features`, với `schemaVersion: 1` và
mode `sequential` hoặc `parallel`. Mỗi feature có đúng:
`id`, `order`, `status`, `owners`, `dependsOn`, `spec`.

- `owners` là mảng string không rỗng.
- `dependsOn` là các ID duy nhất, phải tồn tại và không được tự trỏ.
- `spec` luôn đúng `docs/specs/<id>.md`; spec là nguồn chuẩn cho title, behavior và acceptance.
- Status hợp lệ: `proposed`, `planned`, `active`, `blocked`, `completed`, `cancelled`, `superseded`.
- Work path được suy ra, không ghi trong manifest: `harness/work/<id>.json`.
- Sequential có tối đa một feature `active` hoặc `blocked`; prerequisite hard của
  `active`/`blocked`/`completed` phải `completed`, order trước phải terminal.

Work chỉ giữ execution result, không giữ title, prose, status hay blocker. Work có đúng
top-level `schemaVersion: 1`, `id`, `acceptanceResults`, `nextAction`, `completion`.
Result có đúng `id`, `met`, `evidence`, trong đó evidence là string hoặc null. `nextAction`
là string hoặc null. Completion là null hoặc object chỉ có `verifiedAt`, `completedAt`,
`cancellationSummary`, `supersededBy`.

- `active`/`blocked` cần `nextAction` không rỗng.
- `completed` cần `nextAction: null`, hai timestamp ISO UTC, mọi acceptance met và evidence.
- `cancelled` cần `nextAction: null` và `cancellationSummary` không rỗng.
- `superseded` cần `nextAction: null` và `supersededBy` là ID tồn tại, không phải chính nó.
- Status còn lại có `completion: null`.

Spec dùng stable acceptance lines như `- [a1] Điều kiện observable`. Validator đối chiếu
đúng sequence acceptance ID giữa spec và work. JSON Schema chỉ mô tả structural shape;
semantic và cross-file rules do `validate.mjs` thực thi.

## Anti-cheat

Không đánh dấu `met: true` hoặc completed vì file tồn tại, code có vẻ đúng, command đã
được thử, output bị ẩn hoặc receipt chỉ chứng minh command đã spawn. Không đổi acceptance
ID, làm yếu assertion, bỏ check, nuốt stderr/exit code, dùng shell injection, `|| true`,
`; true`, mock giả kết quả, hay sửa validator để né gate. Chưa có bằng chứng thì giữ
`met: false`, ghi next action cụ thể, và không chuyển status thành completed.

## Checks và local knowledge

`checks.json` có schemaVersion 1. Check có đúng `id`, `argv`, `cwd`, `quick`,
`requiredByDefault`, `timeoutMs`, `declaredEffects`; effects là object boolean exact với
`network`, `writes`, `services`, `installs`, `secrets`. `quick: true` chỉ dành cho check
không có effect. Runner validate trước, spawn argv bằng `shell:false`, quick chỉ chạy
check quick-safe, full chạy check required-by-default và yêu cầu cờ effect tương ứng.
Cwd phải ở trong root; receipt chỉ ghi `harness/work/receipts/`. Registry rỗng là
verification incomplete, không phải pass.

`AGENTS.md` là map khoảng 100 dòng: scope, source of truth, invariants, lệnh validator/
runner, vị trí spec/plan/reference, work và quy trình progress. `ARCHITECTURE.md` cùng
`docs/references/` là repo-local knowledge; phải đọc sau recon và trước plan, không coi
assumption local là policy toàn cục.

ExecPlan dùng frontmatter chuẩn và có lifecycle chính xác `draft | ready | active | blocked |
paused | completed | cancelled | superseded`. Compatibility với feature parent là:
`proposed → draft`; `planned → draft/ready`; `active → draft/ready/active/blocked/paused`;
feature `completed`/`cancelled`/`superseded` không có plan nonterminal. Plan `active` hoặc
`blocked` cần parent `active`, plan `ready` cần parent `planned` hoặc `active`, và hard
`dependsOnPlans` chỉ được satisfied bởi plan `completed`.

## Hướng dẫn test local

```sh
node --check harness-init/scripts/create-harness.mjs
node --check harness-init/templates/harness/scripts/validate.mjs
node --check harness-init/templates/harness/scripts/run-checks.mjs
node --input-type=module --check < harness-init/templates/init.mjs.tmpl
node harness-init/scripts/create-harness.mjs . \
  --repo-name harness-init --purpose "skill package" \
  --verification-command "node --check" --dry-run
```
