# Skill Spec — `harness-verify`

## Purpose

Tạo một canonical feedback entry point nhanh, portable và phù hợp topology của repo.

## Owned artifacts

Baseline nếu có giá trị:

- `init.sh`

Conditional:

- `scripts/verify/*`
- `scripts/harness-doctor.*`

Nếu repo đã có canonical entry point tốt (`make check`, `nx affected`, `turbo`, `just`, `task`, v.v.), `init.sh` SHOULD wrap/reuse thay vì reinvent.

## Inspection

MUST inspect:

- manifests/workspaces;
- lockfiles;
- package scripts;
- Makefile/Taskfile/Justfile;
- CI;
- test configs;
- monorepo tooling;
- backend/frontend/mobile components;
- integration test dependencies.

## Interface đề xuất

```bash
./init.sh quick
./init.sh affected
./init.sh full
./init.sh doctor
```

### `quick`

Fast sanity/static feedback.

Không gắn promise "<5s" nếu repo/tool không đảm bảo.

### `affected`

Default cho agent sau local change.

- derive changed paths;
- map to affected component(s);
- use native affected tooling nếu có;
- fallback conservatively khi mapping uncertain.

### `full`

All required repository checks relevant trước merge/milestone/major change.

### `doctor`

Cheap deterministic harness/docs/state checks.

Không semantic-audit code-vs-docs.

## Parallelism

Independent jobs SHOULD chạy concurrent với bounded concurrency.

Dependency chain MUST giữ sequential.

Ví dụ:

```text
backend lint ───┐
backend type ───┤ parallel
backend unit ───┘

start services
  ↓
migrate
  ↓
integration tests
```

## Output compression

Default output:

```text
✓ backend:lint      1.4s
✓ backend:type      3.1s
✗ frontend:type     4.2s

2 passed · 1 failed

Failure: frontend:type
<relevant failure excerpt>
```

Successful verbose logs SHOULD lưu temporary/artifact nếu cần nhưng không dump vào agent context.

## Failure semantics

- command configured/required và fail → nonzero;
- not applicable → explicit N/A;
- missing required tool/check → fail hoặc actionable configuration error;
- missing optional check → warning/N/A.

Không đánh đồng `ruff`/`flake8` với type checker.

## Portability

Không bắt buộc Bash+jq nếu target environment không thuận lợi.

Implementation language SHOULD dựa trên runtime chắc chắn có trong repo hoặc một dependency tối thiểu được chấp nhận.

## Safety

MUST NOT:

- install dependencies tự động trừ khi authorized;
- mutate production resources;
- reset DB/data không rõ scope;
- hide command failures;
- parallelize unsafe shared-state tests.

## Quality gate

- real commands run được;
- exit codes preserved;
- existing tools reused;
- `affected` không bỏ sót obvious affected component;
- parallelism không gây race trên fixtures;
- summary compact.
