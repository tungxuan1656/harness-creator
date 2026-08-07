# Skill Spec - `harness`

## 1. Purpose

Build, adopt, audit và improve một lightweight repository harness giúp coding agents hiểu code nhanh, giữ scope và nhận feedback đúng mức risk.

Skill phục vụ nhiều repository trung bình và team 1-4 người. Nó ưu tiên delivery speed, progressive disclosure và existing project conventions.

## 2. Use when

Trigger khi user muốn:

- setup/upgrade repo cho AI coding agents;
- tạo hoặc cải thiện agent instructions và repository map;
- giảm thời gian agent tìm code hoặc hiểu boundaries;
- chuẩn hóa product specs hoặc multi-session feature state;
- tạo/cải thiện verification entry point;
- audit/cleanup stale harness, docs, state hoặc recurring bad patterns;
- migrate từ `harness-slim` cũ.

Description của skill phải nói outcome/problem, không chỉ liệt kê filenames.

## 3. Do not use when

Không trigger cho:

- coding task bình thường chỉ vì repo có harness;
- generic architecture refactor không liên quan agent legibility;
- project-management workflow;
- model selection hoặc prompt tuning riêng lẻ;
- enterprise governance/compliance framework.

## 4. Internal workflows

Skill classify request rồi chỉ load workflow cần:

| Workflow | Responsibility |
|---|---|
| `adopt` | Capability audit và minimal setup/upgrade |
| `map` | Instructions, architecture và focused subsystem routing |
| `specs` | Durable product/domain behavior |
| `features` | Persistent execution scope/state/handoff |
| `verify` | Fast canonical feedback interface |
| `garden` | Structural + semantic cleanup |

Đây là internal workflows/references, không phải separate installed skills.

## 5. First move

Inspect trước khi hỏi hoặc tạo file:

- root tree 1-2 levels;
- git status;
- agent instruction files, kể cả nested;
- README/contributing/existing docs;
- manifests, workspace and build configs;
- CI and existing test commands;
- existing issue/feature state;
- representative code only when map/spec correctness needs it.

Chỉ hỏi user cho information không thể infer an toàn và có ảnh hưởng lớn. Không hỏi để xác nhận defaults ít rủi ro.

## 6. Capability audit

Classify:

- greenfield/near-greenfield vs existing repo;
- single component vs monorepo;
- existing navigation/knowledge/spec/state/verification/maintenance capabilities;
- target agents/tool-specific instruction mechanisms;
- current pain point và requested scope.

Output một minimal change set. Không mặc định chạy mọi workflow.

## 7. Inspection budgets

### Map

Read topology, entry points, representative flow, shared boundaries và representative tests. Stop khi mental model đủ trả lời “thing X ở đâu?” và dependency direction chính.

### Specs

Read user requirements/canonical docs trước, sau đó tests/code/evidence liên quan. Stop khi behavior, rules và uncertainties đủ để implementation/test không cần reverse-engineer nhiều layer.

### Features

Read requested requirements/specs và planned work only. Không inventory toàn bộ existing functionality.

### Verify

Read native commands, CI, tool configs, dependency graph và integration resource constraints. Không viết generic multi-language script chỉ từ manifest detection.

### Garden

Start structural/recent/focused; expand semantic sampling chỉ khi evidence cho thấy recurring drift.

## 8. Output contract

Mỗi invocation phải report ngắn:

- reused artifacts/capabilities;
- created or changed artifacts;
- intentionally omitted capabilities;
- uncertainty hoặc follow-up decision;
- verification performed.

Không đánh giá thành công bằng số file tạo.

## 9. Mutation boundaries

Skill MAY sửa artifact liên quan trực tiếp workflow đã chọn. Nó MUST:

- inspect existing content;
- preserve correct human-authored intent;
- patch focused sections;
- avoid unrelated rewrite;
- honor dirty worktree changes;
- ask before destructive/ambiguous broad overwrite.

Garden cleanup được phép cross artifact boundaries trong explicit cleanup scope, theo repair policy.

## 10. Rerun behavior

Rerun cùng evidence SHOULD tạo no-op hoặc semantic minimal diff.

MUST NOT:

- tạo duplicate headings/links;
- đổi stable feature IDs;
- rename docs vô cớ;
- reset human content;
- recreate deleted optional artifacts không còn value;
- oscillate wording giữa runs.

Nếu merge intent không rõ, report conflict thay vì force consistency.

## 11. Forbidden actions

Skill MUST NOT:

- generate full docs tree từ checklist;
- claim architecture inferred chỉ từ manifests;
- reverse-engineer existing app thành fake backlog;
- add global progress log by default;
- enforce one active feature globally;
- create `doctor` mode;
- duplicate native build system;
- run semantic lint bằng regex;
- auto-install dependencies hoặc mutate production resources;
- broad-refactor code từ low-confidence garden finding.

## 12. Bundled skill layout

Planned implementation:

```text
skills/harness/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── knowledge.md
│   ├── work-model.md
│   ├── verification.md
│   └── gardening.md
├── assets/
│   └── templates/
└── scripts/                  # only deterministic reusable tooling
```

`SKILL.md` giữ classification, workflow và guardrails cốt lõi. Detailed contracts nằm một level trong `references/` và chỉ load khi cần.

Không bundle README/changelog/process notes vào installed skill.

## 13. Quality gates

Before completion, evaluate only relevant gates:

### Shared

- facts grounded hoặc uncertainty labeled;
- artifact count justified;
- links/commands valid;
- no duplicate truth;
- rerun-safe change;
- task path không dài hơn cần thiết.

### Map

- fresh agent locate entry points và relevant docs nhanh;
- observed pattern không bị biến thành intended rule vô căn cứ.

### Specs

- behavior đủ derive acceptance tests;
- source/uncertainty visible;
- implementation details không leak trừ architectural contract.

### Features

- acceptance verifiable;
- graph/state valid;
- only planned/current work tracked;
- handoff concise.

### Verify

- real commands run;
- affected mapping conservative;
- failures propagate;
- adapter thin;
- output compact.

### Garden

- findings evidence-based;
- repair đúng scope;
- semantic uncertainty không bị auto-resolve;
- obsolete artifacts được remove khi safe.

## 14. Skill implementation rule

Script chỉ thêm khi deterministic task lặp lại, rẻ hơn và đáng tin hơn reasoning. Templates là starting points; skill phải adapt hoặc omit section thay vì copy placeholder nguyên xi.
