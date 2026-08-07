# Skill Authoring Standard

## 1. Mục đích

Mọi `harness-*` skill nên có cùng contract để dễ reasoning, eval và maintain.

## 2. Required sections trong `SKILL.md`

Recommended skeleton:

```markdown
---
name: harness-...
description: ...
---

# Purpose

# Use When

# Do Not Use When

# Owned Artifacts

# Inputs / Preconditions

# Inspection Strategy

# Workflow

# Output Contract

# Rules / Invariants

# Forbidden Actions

# Rerun / Existing Artifact Behavior

# Quality Gates

# When to Load References
```

## 3. Description

Description phải trigger đúng problem, không chỉ liệt kê file.

Tốt:

> Map a repository for coding agents by inspecting real entry points, module boundaries and recurring implementation patterns...

Không tốt:

> Create AGENTS.md and ARCHITECTURE.md.

## 4. Inspection budget

Skill phải nói rõ:

- inspect gì trước;
- representative sampling;
- khi nào stop reading;
- khi nào deepen inspection.

Điều này giảm hai failure:

- shallow hallucinated docs;
- scan toàn repo tốn context.

## 5. Output contract

Phải nêu:

- mandatory outputs;
- conditional outputs;
- không tạo khi không có evidence;
- format/sections;
- cross-link responsibilities.

## 6. Mutation boundary

Mỗi skill phải nói rõ file nào:

- owns;
- may patch minimally;
- must not rewrite.

## 7. Existing artifact behavior

Skill MUST inspect existing content trước khi create/overwrite.

Default:

```text
preserve correct
update stale
add missing
do not reset
```

## 8. Rerun safety

Rerun cùng input SHOULD không gây:

- duplicate sections;
- new random IDs;
- renamed files vô cớ;
- output churn không semantic.

## 9. Quality gates

Quality gate phải test outcome, không chỉ "file exists".

Ví dụ map:

- entry points grounded;
- dependency direction evidenced;
- no generic framework prose.

## 10. Reference strategy

Skill chỉ load reference liên quan.

Không nhồi toàn bộ design corpus vào context mỗi invocation.

Ví dụ:

- map → knowledge architecture + writing standard;
- verify → verification design;
- garden → gardening + source-of-truth.

## 11. Error handling

Nếu evidence insufficient:

- state uncertainty;
- write less;
- do not invent.

"Không đủ dữ liệu để tạo subsystem rule" là kết quả hợp lệ.

## 12. Tooling

Script/tool chỉ nên được thêm nếu:

- deterministic task lặp lại;
- cheaper/more reliable hơn LLM;
- có clear input/output.

Không automate semantic judgment bằng regex chỉ để nói "có automation".
