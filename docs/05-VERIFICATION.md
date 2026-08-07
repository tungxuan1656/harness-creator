# Verification Design

## 1. Goal

Verification phải tạo feedback nhanh và đáng tin mà không biến `init.sh` thành build system mới.

Stable agent-facing modes:

```bash
./init.sh quick
./init.sh affected
./init.sh full
```

Không có `doctor`. Harness/docs/state maintenance thuộc garden workflow.

## 2. Mode semantics

### `quick`

Cheap health check phù hợp startup hoặc iteration sớm:

- syntax/config validation;
- fast type/static check;
- smallest useful smoke test.

`./init.sh` không argument MAY default `quick` để tương thích và tránh surprising cost. Agent sau code change SHOULD gọi explicit `affected` hoặc targeted native command.

### `affected`

Default post-change verification:

```text
changed files
  -> component/package mapping
  -> reverse dependencies/shared config impact
  -> native affected tooling hoặc conservative fallback
  -> relevant lint/type/test/build jobs
```

Mapping uncertain phải widen, không skip.

### `full`

Canonical repository gate theo convention hiện có. Dùng trước merge/milestone hoặc khi risk cao; không bắt mọi iteration chạy.

## 3. Change-set contract

Implementation phải nói rõ cách xác định changed files:

- explicit file list/target nếu caller cung cấp;
- local default gồm staged, unstaged và untracked files;
- CI dùng configured base hoặc merge-base;
- rename/delete phải map cả old/new area khi relevant;
- lockfile, root config, shared schema hoặc build tooling SHOULD widen tới dependent components;
- không có git context thì fallback theo explicit scope hoặc broader safe check.

Không dùng một `git diff` mơ hồ cho mọi environment.

## 4. `init.sh` is an adapter

`init.sh` SHOULD chỉ:

1. resolve repository root;
2. parse/validate mode;
3. show concise help for invalid input;
4. dispatch tới native tool hoặc helper;
5. preserve exit code và signals.

Preferred shapes:

```text
init.sh -> make/nx/turbo/gradle/npm/pytest/etc.
```

Hoặc khi orchestration phức tạp:

```text
init.sh
  -> scripts/verify/quick.sh
  -> scripts/verify/affected.sh
  -> scripts/verify/full.sh
  -> shared runner/library nếu thật sự cần
```

Helper không bắt buộc là shell. Dùng runtime chắc chắn có trong repo.

## 5. When to split helpers

Tách logic khỏi `init.sh` khi có một hoặc nhiều dấu hiệu:

- nhiều component hoặc toolchain;
- affected mapping không trivial;
- setup/cleanup services;
- bounded parallel jobs;
- log capture/summary;
- shared logic giữa modes;
- adapter trở nên khó scan hoặc khó test.

Không split thành nhiều file chỉ để mỗi command nằm một file.

## 6. Reuse native tooling

Nếu repo đã có `make check`, Nx/Turbo affected, Gradle tasks, Taskfile hoặc CI-local runner tốt, wrapper phải delegate thay vì copy logic.

`init.sh` có thể không cần tồn tại nếu existing command đã stable, discoverable và phù hợp agent. Khi cần backward-compatible interface, giữ adapter rất mỏng.

## 7. Job graph and concurrency

Parallelize only independent jobs với bounded concurrency.

```text
lint -----\
type ------> parallel summary
unit -----/

services up -> migrate -> integration
```

Không chạy song song jobs dùng chung mutable DB, fixture, emulator hoặc port nếu chưa isolate.

## 8. Output contract

Default output ưu tiên summary:

```text
PASS backend:type   2.1s
PASS backend:unit   4.8s
FAIL frontend:type  3.0s

2 passed, 1 failed
Failure: frontend:type
<short relevant excerpt>
Full log: <path if retained>
```

Requirements:

- successful verbose logs không dump vào context;
- failed excerpt đủ để hành động;
- full log recoverable khi capture;
- command failure giữ nonzero exit;
- signal/cleanup không để process hoặc service mồ côi.

## 9. Required, optional, N/A

Mỗi check phải được phân loại:

- required;
- optional;
- not applicable.

Missing required tool/check là failure hoặc actionable configuration error. Missing optional check có thể warning/N/A. Không gọi linter là type checker và không biến “no tests configured” thành evidence tests pass.

## 10. Baseline failures

Khi repo đã fail trước change:

- record relevant baseline;
- so sánh new failures khi feasible;
- không tự sửa unrelated failures;
- xác định failure có block requested work không;
- report accepted exception rõ ràng.

Không cần chạy full baseline cho mọi local task.

## 11. Risk-proportional verification

| Change | Default evidence |
|---|---|
| Local pure logic | Targeted test + relevant static check |
| Normal component change | Affected checks |
| Cross-component/public API/schema/auth/persistence | Affected + relevant integration/full gate |
| Build/config/tooling | Relevant full build |

Project convention và actual risk có thể widen hoặc narrow table này.

## 12. Safety

Verification MUST NOT:

- install dependencies tự động nếu chưa authorized;
- mutate production resources;
- reset data ngoài disposable test scope;
- hide failures;
- execute unsafe shared-state jobs concurrently.
