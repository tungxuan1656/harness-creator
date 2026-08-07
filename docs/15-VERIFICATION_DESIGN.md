# Verification System Design

## 1. Goals

Verification phải:

- nhanh đủ để agent chạy thường xuyên;
- đúng enough để không tạo false confidence;
- portable;
- output compact;
- reuse project-native tooling;
- scale từ single component đến backend+frontend+mobile.

## 2. Four modes

### Quick

Mục tiêu: cheap local health.

Examples:

- fast type/static check;
- syntax/config validation;
- smallest smoke test;
- harness structural sanity nếu rất rẻ.

### Affected

Mục tiêu: default post-change verification.

Pipeline:

```text
git diff / explicit changed files
  ↓
component mapping
  ↓
native affected tool if available
  ↓
relevant lint/type/test/build jobs
```

Nếu mapping uncertain → widen, không skip.

### Full

Canonical repository gate theo project convention.

Không nhất thiết chạy mỗi task iteration.

### Doctor

Harness consistency only:

- feature index schema;
- links;
- required artifact refs;
- dependency graph;
- obvious stale paths;
- script/config integrity.

## 3. Job graph

Represent conceptual checks như DAG:

```text
lint ───────┐
type ───────┼─ independent
unit ───────┘

services up
  ↓
migrate
  ↓
integration
```

Parallelize only nodes không share unsafe mutable resources.

## 4. Bounded concurrency

Không `&` mọi command không giới hạn.

Concurrency SHOULD account for:

- CPU;
- memory;
- test DB contention;
- emulator/device count.

Default conservative.

## 5. Output model

Capture per-job logs.

Print:

1. job name;
2. status;
3. duration;
4. final summary;
5. failed logs only, trimmed to useful context.

Optionally preserve full log path.

## 6. Required vs optional checks

Mỗi check conceptually là:

```text
required
optional
not_applicable
```

Missing required check/tool ≠ pass.

## 7. Baseline failures

Nếu repo đã fail trước change:

- record baseline;
- do not silently fix unrelated failure;
- determine whether requested change is blocked;
- compare new failures vs baseline when feasible.

## 8. Build system relationship

`init.sh` là stable agent-facing entry point.

Nó SHOULD delegate:

```text
init.sh → make/nx/turbo/gradle/npm/pytest/etc.
```

không replicate logic đã có.

## 9. Platform strategy

Generated implementation SHOULD chọn runtime available.

Examples:

- Node repo → Node helper acceptable;
- Python repo → Python helper acceptable;
- cross-platform polyglot → Node/Python portable runner hoặc existing task tool.

Không bắt buộc `jq` nếu không cần.

## 10. Verification depth by risk

### Local pure function change
targeted test + static check.

### Cross-module behavior
affected suite.

### Public API/schema/auth/persistence
affected + integration/full relevant gates.

### Build/config/tooling
full relevant build.

Harness SHOULD encode proportionality, không ceremony cố định.
