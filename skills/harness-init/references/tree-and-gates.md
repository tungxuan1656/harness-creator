# Canonical tree và gates

## Tree chuẩn

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
  work/receipts/*.json                                # chỉ sau check thực sự chạy
docs/
  specs/<id>.md
  plans/YYYY-MM-DD--plan--<subject-id>--<intent>.md
  references/<topic>.md
```

Không tạo `ARCHITECTURE.md`, docs, work hoặc receipts rỗng. Thư mục chỉ xuất hiện như
hệ quả của file có nội dung. `work/<id>.json` được tạo theo manifest entry; receipts
chỉ được runner tạo sau execution.

## Recon gate

Creator phải xác nhận target tồn tại và là directory, sau đó kiểm tra:

1. `.agents/harness` và `cairn` là hai layout cũ duy nhất được nhận diện.
2. Root `harness` vắng mặt thì scaffold canonical.
3. Root `harness` đã có nhưng `manifest.json` không phải object có `schemaVersion: 1`
   và `features` array thì là malformed/unrecognized, phải dừng.
4. Một file schemaVersion rời rạc ngoài `harness/manifest.json` không được coi là layout.

Layout cũ chỉ được xử lý với `--migrate-old-layout`. Action này có chủ đích, chỉ bổ
sung tree canonical và giữ nguyên dữ liệu cũ để owner review; không xóa hoặc âm thầm
chuyển đổi nội dung.

## Manifest và work gates

- Manifest top-level có đúng `schemaVersion`, `mode`, `features`; schemaVersion là 1.
- Mỗi entry có đúng `id`, `order`, `status`, `owners`, `dependsOn`, `spec`.
- ID kebab-case duy nhất; order là số nguyên dương tăng nghiêm ngặt.
- Owners không rỗng; prerequisite tồn tại, duy nhất và không tự trỏ.
- Spec luôn `docs/specs/<id>.md`, tồn tại, có `# Feature: <id>` và acceptance lines.
- Work luôn được suy ra ở `harness/work/<id>.json`, không lặp title/prose/status.
- Acceptance ID trong work phải khớp đúng sequence trong spec.
- Active/blocked cần next action; completed/cancelled/superseded cần completion object
  đúng lifecycle và evidence tương ứng.
- Sequential cho phép tối đa một active/blocked; prerequisite hard của active/blocked/
  completed phải completed và order trước feature active phải terminal.

## Check gates

Check có đúng `id`, `argv`, `cwd`, `quick`, `requiredByDefault`, `timeoutMs`,
`declaredEffects`. Effects là boolean exact gồm `network`, `writes`, `services`,
`installs`, `secrets`. `quick: true` chỉ hợp lệ khi tất cả effect false.

`quick` chỉ chạy check quick-safe. `full` chỉ chạy check required-by-default; mỗi effect
true phải có flag tương ứng (`--allow-network`, `--allow-writes`, `--allow-services`,
`--allow-installs`, `--allow-secrets`). Runner spawn argv với `shell:false`, timeout
hữu hạn, cwd trong root, output visible và receipt chỉ dưới `harness/work/receipts/`.
Registry rỗng là incomplete và runner trả nonzero.
