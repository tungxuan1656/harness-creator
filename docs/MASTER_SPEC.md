# Harness Skill Pack — Master Design Specification


---

# Source: `01-VISION_AND_SCOPE.md`

# Vision and Scope

## 1. Vấn đề cần giải quyết

AI coding agent thường mất thời gian và chất lượng ở bốn điểm:

1. **Orientation cost** — không biết "thing X nằm ở đâu", phải đọc rất nhiều file để dựng mental model.
2. **Intent loss** — nghiệp vụ, architectural decisions và team conventions sống ngoài repository hoặc bị rải rác.
3. **Execution drift** — agent cố làm quá nhiều, đi ngoài scope, hoặc tuyên bố xong trước khi behavior được kiểm chứng.
4. **Entropy** — agent sao chép pattern hiện hữu, bao gồm cả pattern xấu; docs, feature state và code có thể drift theo thời gian.

Harness phải giảm các chi phí này mà không tạo ra một "project management framework" mới.

## 2. Vision

`harness-*` là một **repository cognition + execution feedback layer**.

Nó phải giúp một agent mới có thể:

```text
Find → Understand → Focus → Change → Verify → Leave clean state
```

với số bước non-code nhỏ nhất có thể.

## 3. Mục tiêu định lượng định hướng

Đây là design targets, không phải SLA cứng:

- Một agent mới hiểu được high-level code map sau khi đọc `AGENTS.md` + `ARCHITECTURE.md`.
- Một task cục bộ không cần đọc toàn bộ documentation tree.
- Feature acceptance phải có thể kiểm chứng.
- Verification mặc định ưu tiên `affected`, không ép full suite cho mọi thay đổi.
- Output verify phải ưu tiên summary + failures, không bơm log pass dài vào context.
- Tài liệu phải có signal/token ratio cao.
- Rerun một skill không được tùy tiện phá artifact do skill khác sở hữu.

## 4. Không-mục-tiêu

Harness MUST NOT cố trở thành:

- Jira/Linear replacement;
- workflow engine cho con người;
- lock manager cho concurrent agents;
- framework kiến trúc chung áp cho mọi codebase;
- generator tạo tài liệu chỉ để "đủ bộ";
- build tool cạnh tranh với Nx, Turborepo, Gradle, Make, Task, Just, Bazel, v.v.;
- semantic correctness oracle.

## 5. Đối tượng project

### Greenfield

Harness có thể giúp chuyển:

```text
requirements
  → product/domain specs
  → feature backlog
  → implementation
  → verification
```

### Existing repo

Harness phải ưu tiên:

```text
inspect existing truths
  → map
  → reuse existing commands
  → document only durable gaps
  → create execution state only for planned/current work
```

Nó MUST NOT "reverse engineer toàn bộ code thành backlog" nếu người dùng không yêu cầu.

## 6. Team model

Team 1–4 người có thể làm song song. Vì vậy:

- repository MAY có nhiều feature `in_progress`;
- một agent/session SHOULD tập trung vào một primary feature/task;
- harness không nên áp invariant "toàn repo chỉ có một active feature" trừ khi project explicitly chọn single-stream mode.

## 7. Success condition

Harness thành công khi:

> Agent phải đọc ít hơn, đoán ít hơn, làm đúng hơn và verify nhanh hơn — chứ không phải khi repository có nhiều file harness hơn.


---

# Source: `02-DESIGN_PHILOSOPHY.md`

# Design Philosophy

## 1. Map, not manual

`AGENTS.md` là entry point, không phải encyclopedia.

Nó SHOULD chứa:

- routing;
- universal invariants;
- canonical commands;
- cách chọn tài liệu tiếp theo.

Nó MUST NOT chứa toàn bộ architecture, backend conventions, product specs và lịch sử feature.

## 2. Progressive disclosure

Thông tin được phân tầng để agent chỉ load thứ cần thiết:

```text
AGENTS.md
   ↓
ARCHITECTURE.md / subsystem doc / feature detail
   ↓
spec hoặc decision liên quan
   ↓
code + tests
```

Không có yêu cầu "đọc tất cả docs trước khi code".

## 3. Repository-local knowledge

Knowledge ảnh hưởng đến code SHOULD có representation discoverable trong repo.

Thông tin chỉ tồn tại ở chat, Google Docs, Jira hoặc đầu con người không nên được coi là đủ cho agent. External trackers MAY tiếp tục là source cho team management, nhưng execution context quan trọng cần được link hoặc distilled vào repo.

## 4. Complexity must be earned

Mỗi artifact phải trả lời:

> Failure mode nào sẽ xảy ra nếu artifact này không tồn tại?

Nếu không trả lời được, không tạo.

Ví dụ:

- `ARCHITECTURE.md`: giảm orientation cost.
- `BACKEND.md`: codify recurring backend patterns.
- `feature_index.json`: giữ execution backlog và dependencies trong context.
- `init.sh`: chuẩn hóa fast feedback.
- `progress.md`: chỉ đáng có nếu feature-level handoff không đủ.

## 5. Invariants over micromanagement

Harness SHOULD enforce:

- dependency direction;
- public behavior;
- boundary validation;
- canonical verification;
- scope/acceptance.

Harness SHOULD NOT bắt agent theo một implementation style cụ thể nếu codebase không yêu cầu.

Nguyên tắc:

> Enforce boundaries centrally; allow autonomy locally.

## 6. High signal per token

Documentation cho agent ưu tiên:

- diagrams ASCII;
- tables;
- rule lists;
- decision trees;
- examples;
- `A → B → C`;
- named symbols và stable paths.

Giảm:

- lời dẫn dài;
- mô tả hiển nhiên;
- prose lặp lại code;
- framework tutorial;
- historical narrative không ảnh hưởng quyết định.

## 7. Intended truth vs observed truth

Không tuyên bố tuyệt đối "code luôn đúng" hoặc "docs luôn đúng".

- Specs/architecture mô tả **intended behavior/boundaries**.
- Code/tests cung cấp **observed implementation/evidence**.

Khi conflict:

```text
detect
  → collect evidence
  → classify: code violation vs stale doc vs incomplete migration
  → repair intentionally
```

Không auto-hợp thức hóa drift.

## 8. Fast feedback is a product feature

Verification không chỉ là correctness gate; nó là một phần của harness UX.

Nó SHOULD:

- tận dụng tool hiện có;
- chạy parallel khi independent;
- chạy affected subset khi an toàn;
- gom output;
- giữ exit code;
- hiển thị failure context ngắn gọn.

## 9. Entropy requires garbage collection

Agent học từ repository hiện tại. Bad pattern nếu tồn tại lâu sẽ được sao chép.

Do đó cần hai lớp:

1. **Mechanical doctor** — cheap, deterministic.
2. **Semantic gardening** — periodic/on-demand reasoning audit.

## 10. Harness assumptions are provisional

Model capability thay đổi. Rule từng cần thiết có thể trở thành overhead.

Mỗi rule SHOULD định kỳ được hỏi:

- failure mode này còn xảy ra không?
- tool/model hiện tại đã tự xử lý tốt chưa?
- rule có gây latency hoặc context cost lớn hơn lợi ích không?

Harness phải tiến hóa; không đóng băng assumptions.


---

# Source: `03-SYSTEM_ARCHITECTURE.md`

# Harness System Architecture

## 1. Khái niệm tổng thể

Harness được chia thành 5 capability vận hành:

```text
NAVIGATE
   ↓
UNDERSTAND
   ↓
FOCUS
   ↓
VERIFY
   ↓
MAINTAIN
```

### Navigate
Agent biết nên đọc gì.

### Understand
Agent hiểu system boundaries, patterns, product/domain rules.

### Focus
Agent biết feature/task hiện tại, scope, dependencies, acceptance.

### Verify
Agent nhận feedback nhanh và đáng tin.

### Maintain
Harness tự phát hiện drift/garbage đủ sớm để không khuếch đại.

## 2. Artifact architecture đề xuất

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
│
├── docs/
│   ├── README.md
│   ├── BACKEND.md          # conditional
│   ├── FRONTEND.md         # conditional
│   ├── MOBILE.md           # conditional
│   ├── DATA.md             # conditional
│   ├── INFRA.md            # conditional
│   │
│   ├── specs/
│   │   ├── README.md
│   │   └── <domain-or-flow>.md
│   │
│   ├── decisions/          # conditional
│   ├── generated/          # conditional
│   └── references/         # conditional
│
├── features/
│   ├── feat-template.md
│   └── feat-<id>.md
│
└── scripts/
    └── ...                 # only helpers actually needed
```

Không phải mọi repo đều có tất cả file conditional.

## 3. Control plane vs knowledge plane

### Knowledge plane

```text
AGENTS
ARCHITECTURE
subsystem docs
specs
decisions
```

Trả lời: "Hệ thống là gì và nên hoạt động thế nào?"

### Execution plane

```text
feature_index
feature detail
handoff
```

Trả lời: "Đang xây gì, scope nào, còn gì?"

### Feedback plane

```text
init.sh
existing build/test tools
doctor
CI
```

Trả lời: "Thay đổi này có hợp lệ không?"

### Maintenance plane

```text
harness-garden
doctor findings
golden rules/invariants where justified
```

Trả lời: "Knowledge và code có đang drift/decay không?"

## 4. Không tạo một nguồn chân lý duy nhất cho mọi loại sự thật

Một repository có nhiều domain của truth:

| Domain | Canonical intent |
|---|---|
| Product behavior | `docs/specs/*` |
| System topology/boundaries | `ARCHITECTURE.md` |
| Subsystem implementation conventions | `BACKEND.md`, `FRONTEND.md`,... |
| Planned/current work | `feature_index.json` |
| Feature scope/acceptance | `features/<id>.md` |
| Actual implementation | code |
| Regression evidence | tests + verification |
| External protocol semantics | `docs/references/*` hoặc canonical external source |

## 5. Data flow khi agent bắt đầu một task

```text
User request
   ↓
AGENTS.md
   ↓
classify task/component
   ↓
relevant feature detail? ── yes → read
   ↓
relevant subsystem doc
   ↓
relevant spec/decision
   ↓
code + tests
   ↓
implement
   ↓
init.sh affected
```

Không cần load toàn bộ knowledge plane.

## 6. Design constraint

Mọi skill MUST giữ kiến trúc này dễ hiểu hơn sau khi chạy, không chỉ "thêm file".


---

# Source: `04-KNOWLEDGE_ARCHITECTURE.md`

# Repository Knowledge Architecture

## 1. Mục tiêu

Tạo một mental map externalized đủ tốt để agent mới không phải đọc code tuần tự.

Một knowledge base tốt trả lời nhanh:

- Project giải quyết vấn đề gì?
- Entry points là gì?
- "Thing X" nằm ở đâu?
- Request/data flow đi qua đâu?
- Dependency direction nào được phép?
- Business rule nào không suy ra an toàn từ code?
- Khi sửa subsystem X phải đọc document nào?

## 2. Tầng tài liệu

### Tầng 0 — Router

`AGENTS.md`

Chỉ chứa routing + rules mọi coding task cần.

### Tầng 1 — Stable system map

`ARCHITECTURE.md`

Bird's-eye view, code map, boundaries, invariants, cross-cutting concerns.

### Tầng 2 — Subsystem guides

Ví dụ:

- `docs/BACKEND.md`
- `docs/FRONTEND.md`
- `docs/MOBILE.md`
- `docs/DATA.md`
- `docs/INFRA.md`

Tập trung vào tech stack, patterns, local conventions, implementation flow.

### Tầng 3 — Domain/product truth

`docs/specs/*`

Tập trung behavior, rules, edge cases, workflows.

### Tầng 4 — Durable decisions / references

Chỉ tạo khi có recurring value:

- ADR/design decisions;
- external API protocol notes;
- generated schema;
- security/reliability docs.

## 3. `ARCHITECTURE.md` baseline

Với repo trung bình, `ARCHITECTURE.md` SHOULD tồn tại vì orientation cost rất cao so với chi phí duy trì.

Nó nên có:

1. Bird's-eye view.
2. Entry points.
3. Code map theo coarse-grained modules.
4. Dependency direction.
5. Architectural invariants.
6. Cross-cutting concerns.
7. Where to go deeper.

Nó không nên:

- mô tả từng function;
- liệt kê mọi folder;
- duplicate subsystem guide;
- ghi line numbers;
- chứa các chi tiết thay đổi hàng tuần.

## 4. Khi nào tạo subsystem doc?

Tạo nếu ít nhất một điều đúng:

- subsystem có tech stack/conventions riêng;
- nhiều folder cùng phục vụ một execution flow;
- pattern phải theo không dễ suy ra từ code;
- agent thường chọn sai nơi đặt logic;
- subsystem đủ lớn để `ARCHITECTURE.md` không nên chứa chi tiết.

Không tạo file generic như `BACKEND.md` chỉ để nói "backend uses REST".

## 5. Docs index

`docs/README.md` SHOULD là routing table:

```markdown
| Document | Read when |
|---|---|
| `BACKEND.md` | Changing API, services, persistence |
| `FRONTEND.md` | Changing UI, state, client data |
| `specs/auth.md` | Changing authentication behavior |
```

Một line mô tả "khi nào đọc" hữu ích hơn summary dài.

## 6. Stable naming

Ưu tiên tên dễ đoán:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/BACKEND.md`
- `docs/FRONTEND.md`
- `docs/specs/...`

Mục tiêu là discovery cost thấp.

## 7. Knowledge lifecycle

```text
Observation
   ↓
recurring / durable?
   ├─ no → keep in code/PR/chat
   └─ yes
       ↓
choose canonical document
       ↓
write concise rule/map/spec
       ↓
link from router if discoverability requires
       ↓
doctor/garden checks drift
```


---

# Source: `05-SOURCE_OF_TRUTH_AND_OWNERSHIP.md`

# Source of Truth and Artifact Ownership

## 1. Vì sao cần ownership

Nếu nhiều skill cùng rewrite cùng một artifact, rerun sẽ gây:

- duplication;
- contradictory rules;
- lost edits;
- oscillating output.

Mỗi artifact cần **primary owner** và quyền chỉnh sửa chéo hạn chế.

## 2. Ownership matrix

| Artifact | Primary owner | Cross-edit được phép |
|---|---|---|
| `AGENTS.md` | `harness-map` | `harness-bootstrap` patch routing tối thiểu; `harness-garden` repair stale refs |
| `ARCHITECTURE.md` | `harness-map` | `harness-garden` repair khi audit có evidence |
| `docs/README.md` | `harness-map` | skill khác MAY thêm link đúng section; không rewrite phần khác |
| Subsystem docs | `harness-map` | `harness-garden` repair |
| `docs/specs/*` | `harness-specs` | `harness-garden` repair sau semantic audit |
| `feature_index.json` | `harness-features` | doctor MAY validate; garden MAY repair state khi evidence rõ |
| `features/*` | `harness-features` | coding agent cập nhật handoff/acceptance trong scope feature |
| `init.sh` | `harness-verify` | garden chỉ report; repair chỉ khi được authorize |
| verify helpers | `harness-verify` | tương tự |
| audit findings | `harness-garden` | không skill khác sở hữu |

## 3. Truth domains

### Product intent

`docs/specs/*` là canonical intended behavior.

Tests/code không được tự động dùng để rewrite spec theo hành vi hiện tại nếu chưa xác định đó là behavior đúng.

### Architecture intent

`ARCHITECTURE.md` + subsystem rules mô tả intended boundaries.

Nếu code vi phạm, có hai khả năng:

- architectural drift;
- documentation stale.

Cần evidence để phân loại.

### Feature state

`feature_index.json` là canonical machine-readable status/dependency index.

Feature detail không nên duplicate `status` nếu không cần; giảm hai nguồn state.

### Feature scope

`features/<id>.md` là canonical scope/acceptance/handoff của feature.

### Observed behavior

Code + tests + runtime evidence mô tả điều hệ thống hiện đang làm.

## 4. Conflict protocol

Khi hai truth domain conflict:

```text
DO NOT silently choose
  ↓
identify intended source
  ↓
collect implementation/test evidence
  ↓
classify
  ├─ stale documentation
  ├─ implementation defect
  ├─ incomplete migration
  ├─ ambiguous requirement
  └─ test defect
  ↓
repair only the incorrect layer(s)
```

## 5. Duplication rule

Một fact SHOULD có một canonical home.

Tài liệu khác MAY:

- link;
- summarize một dòng;
- restate invariant nếu mọi task thực sự cần thấy.

Không copy nguyên section giữa docs.

## 6. Cross-link rule

Links dùng để route, không dùng để tạo circular dependency khó hiểu.

Ví dụ tốt:

```text
AGENTS → BACKEND → spec → code
```

Ví dụ xấu:

```text
AGENTS ↔ BACKEND ↔ ARCHITECTURE ↔ feature ↔ AGENTS
```

mà mỗi file đều chứa cùng rule.


---

# Source: `06-SKILL_PACK_ARCHITECTURE.md`

# Skill Pack Architecture

## 1. Danh sách skill

```text
harness-bootstrap
harness-map
harness-specs
harness-features
harness-verify
harness-garden
```

## 2. Nguyên tắc chia skill

Chia theo **cognitive responsibility**, không chia theo file.

Ví dụ `AGENTS.md`, `ARCHITECTURE.md` và `BACKEND.md` cùng cần một mental model của repo nên thuộc `harness-map`.

## 3. Dependency graph

```text
                 harness-bootstrap
                   /     |      \
                  v      v       v
          harness-map  harness-verify
                |
                v
          harness-specs
                |
                v
        harness-features

harness-garden  ← lifecycle/on-demand, không nằm trong bootstrap mặc định
```

Đây không phải dependency runtime cứng. Nó là design ordering.

## 4. Greenfield default

```text
harness-map
  → harness-specs
  → harness-features
  → harness-verify
```

Lý do: requirements phải được chuẩn hóa thành specs trước khi backlog phân rã.

## 5. Existing repo default

```text
harness-map
  → harness-verify
  → harness-specs (only where durable behavior is missing/ambiguous)
  → harness-features (for planned/current work)
```

## 6. Skill isolation

Mỗi skill MUST:

- có scope rõ;
- biết artifact mình sở hữu;
- đọc output trước đó thay vì re-derive mọi thứ;
- vẫn cross-check code khi correctness phụ thuộc code;
- không rewrite artifact của skill khác chỉ vì "có thể cải thiện".

## 7. Rerun semantics

Rerun SHOULD là incremental:

- `harness-map`: update map/doc sections dựa trên changed topology, không reset specs/features.
- `harness-specs`: update affected specs, không rewrite architecture.
- `harness-features`: preserve existing feature IDs/history; add/update backlog intentionally.
- `harness-verify`: inspect current build tooling and update orchestrator safely.
- `harness-garden`: audit first; repair only authorized findings.

## 8. Bootstrap là orchestrator, không phải mega-skill

`harness-bootstrap` không nên chứa chi tiết "cách viết architecture tốt" hoặc "cách build init.sh".

Nó chỉ cần:

1. classify repo;
2. inspect existing harness artifacts;
3. determine missing capabilities;
4. sequence specialized skills;
5. run final cross-link sanity check.

Nếu environment không hỗ trợ skill gọi skill, bootstrap SHOULD xuất một ordered execution plan thay vì cố tự làm mọi phần.


---

# Source: `07-HARNESS_BOOTSTRAP_SKILL_SPEC.md`

# Skill Spec — `harness-bootstrap`

## Purpose

Điều phối việc tạo/adopt harness phù hợp với repository mà không biến bootstrap thành một generator monolithic.

## Trigger

Dùng khi user muốn:

- "tạo harness";
- "chuẩn hóa repo cho coding agent";
- "setup bộ harness";
- adopt skill pack vào repo mới/existing.

Không dùng cho:

- chỉ update architecture;
- chỉ viết specs;
- chỉ sửa verify script;
- gardening.

## Inputs

MUST inspect tối thiểu:

- root tree;
- existing `AGENTS.md`/agent instructions;
- existing architecture/docs;
- manifests/workspace files;
- existing feature/task tracking trong repo;
- existing build/test entry points.

Không cần đọc sâu code; đó là việc của specialized skill.

## Classification

Xác định:

### Repository state
- greenfield / near-greenfield;
- existing active project.

### Topology
- single component;
- multi-component;
- monorepo.

### Existing harness capabilities
- navigation;
- knowledge;
- specs;
- feature state;
- verification;
- gardening.

## Decision matrix

### Greenfield
Prefer:
`map → specs → features → verify`

### Existing repo
Prefer:
`map → verify → specs-if-needed → features-if-needed`

### Existing good docs
Do not regenerate. Route/reuse.

### Existing task tracker only external
MAY create repo-local compact execution index nếu user muốn agent-native backlog; không copy PM metadata.

## Outputs

Bootstrap itself SHOULD tạo tối thiểu artifact.

Có thể tạo một temporary plan/report, nhưng không cần persist nếu không mang durable value.

## Completion report

Phải ghi:

- skills/phases đã chạy hoặc cần chạy;
- artifact nào mới;
- artifact nào reused;
- capability nào intentionally not created;
- unresolved ambiguity.

## Forbidden

MUST NOT:

- tự viết full architecture thay `harness-map`;
- tự tạo feature backlog từ suy đoán;
- overwrite existing harness files không phân tích;
- tạo empty docs để đạt checklist;
- gọi `harness-garden` như bước bootstrap mặc định.


---

# Source: `08-HARNESS_MAP_SKILL_SPEC.md`

# Skill Spec — `harness-map`

## Purpose

Tạo repository mental model có signal cao giúp agent tìm đúng code và hiểu boundaries nhanh.

## Owned artifacts

Baseline:

- `AGENTS.md`
- `ARCHITECTURE.md`

Conditional:

- `docs/README.md`
- `docs/BACKEND.md`
- `docs/FRONTEND.md`
- `docs/MOBILE.md`
- `docs/DATA.md`
- `docs/INFRA.md`
- các subsystem guide khác dựa trên topology thật.

## Inspection strategy

### Stage 1 — topology

Inspect:

- root tree 1–2 levels;
- manifests/workspaces;
- README/contributing;
- CI/build configs;
- existing docs.

### Stage 2 — representative code

Chọn representative files, không đọc toàn repo:

- application entry points;
- routing/controllers;
- core services/domain;
- persistence/data access;
- shared types/config;
- representative tests;
- one or two flows xuyên layer.

### Stage 3 — validate mental model

Trước khi viết, kiểm tra:

- entry point thực;
- module responsibility;
- dependency direction;
- cross-cutting concerns;
- exceptions đáng kể.

## `AGENTS.md` contract

MUST answer:

1. project là gì;
2. đi đâu để hiểu architecture/subsystem/spec;
3. canonical run/verify commands nằm đâu;
4. universal rules nào mọi task cần biết;
5. feature state nằm đâu nếu có.

SHOULD ngắn. Không có hard line limit, nhưng nếu một section chỉ cần cho backend task thì nó không nên nằm ở đây.

## `ARCHITECTURE.md` contract

MUST include:

- bird's-eye overview;
- entry points;
- code map;
- important flows;
- boundaries/dependency direction;
- cross-cutting concerns;
- explicit invariants;
- links/pointers deeper.

Ưu tiên:

```text
HTTP
  ↓
Route
  ↓
Service
  ↓
Repository
  ↓
DB
```

thay vì nhiều đoạn prose.

## Subsystem guide contract

Ví dụ `BACKEND.md`:

- actual tech stack;
- request/processing flow;
- where logic belongs;
- core patterns;
- error/validation/data conventions;
- forbidden dependencies/patterns;
- testing location;
- examples từ code hiện có.

Không viết framework tutorial.

## Evidence rules

MUST NOT invent:

- architecture;
- naming conventions;
- patterns;
- stack;
- business rules.

Nếu code inconsistent, document:

- dominant pattern;
- known exception nếu quan trọng;
- uncertainty.

Không silently chọn một pattern ngẫu nhiên làm "rule".

## Rerun

Preserve human-authored durable content nếu vẫn đúng.

Update only facts impacted by repository change.

## Quality gate

Một fresh agent sau khi đọc docs phải trả lời được:

- "entry point ở đâu?";
- "logic X nên nằm layer nào?";
- "module Y làm gì?";
- "test command nào?";
- "cần đọc doc nào cho task Z?"

mà không scan toàn repo.


---

# Source: `09-HARNESS_SPECS_SKILL_SPEC.md`

# Skill Spec — `harness-specs`

## Purpose

Đưa product/domain behavior quan trọng vào repository dưới dạng agent-legible specs.

## Owned artifacts

- `docs/specs/README.md`
- `docs/specs/<domain-or-flow>.md`

Có thể patch `docs/README.md` để thêm routing link.

## Inputs

Nguồn ưu tiên:

1. explicit user requirements;
2. existing product specs;
3. tests/behavior;
4. code;
5. external protocol/contract docs.

Không dùng code hiện tại làm "intended behavior" nếu có bằng chứng code có thể sai.

## Khi nào tạo spec

SHOULD create cho:

- core user workflows;
- business rules;
- domain invariants;
- permissions;
- state transitions;
- behavior nhiều layer cùng phụ thuộc;
- edge cases mà agent dễ đoán sai.

Không cần spec cho:

- CRUD hiển nhiên không có business rule;
- framework plumbing;
- implementation details chỉ sống trong code.

## Spec format

Ưu tiên:

### Goal
1–3 câu.

### Flow

```text
Input
  ↓
validate
  ├─ invalid → error
  └─ valid
       ↓
business rule
       ↓
output
```

### Rules
Bullet ngắn, một invariant mỗi bullet.

### State transitions
Table.

### Edge cases
Input → expected result.

### Interfaces
Chỉ nếu public contract cần rõ.

### Non-goals
Khi dễ scope creep.

## Implementation leakage

Specs SHOULD mô tả **what/behavior**, không "service class phải gọi repository method X" trừ khi đó là architectural contract.

## Compression standard

Nếu cùng một meaning có thể biểu diễn bằng table/flow ngắn hơn prose, ưu tiên dạng ngắn.

## Index

`docs/specs/README.md` route theo domain/flow và "read when".

## Quality gate

Một agent phải có thể dùng spec để:

- biết expected behavior;
- viết acceptance tests;
- phân biệt edge cases;
- không phải reverse-engineer business logic từ nhiều layers.

## Rerun

Update only affected specs.

Nếu spec conflict code/tests, flag conflict; không tự rewrite spec theo code.


---

# Source: `10-HARNESS_FEATURES_SKILL_SPEC.md`

# Skill Spec — `harness-features`

## Purpose

Biến requirements/specs thành một execution backlog compact, repo-local và dễ dùng bởi coding agent.

## Owned artifacts

- `feature_index.json`
- `features/feat-template.md`
- `features/<id>.md`

## Hai mode

### Greenfield decomposition

```text
requirements/specs
  → coherent features
  → dependencies
  → acceptance
```

### Existing project

Chỉ track planned/current work.

MUST NOT reverse-engineer toàn bộ functionality hiện có thành feature backlog nếu không được yêu cầu.

## `feature_index.json`

Nó là **execution index**, không phải Jira.

SHOULD giữ:

- id;
- title;
- status;
- dependencies;
- detail path;
- optional spec references.

MUST NOT mặc định chứa:

- sprint;
- story points;
- deadline;
- comments;
- full assignee workflow;
- business PM metadata.

## Status model

Recommended:

```text
todo
in_progress
blocked
done
```

Nhiều `in_progress` MAY tồn tại vì team 1–4 người có thể làm song song.

Agent/session SHOULD focus on một primary feature.

## Feature detail

MUST include:

- Goal;
- Scope;
- Non-goals khi cần;
- Acceptance;
- Relevant docs/specs;
- Verification;
- Handoff khi feature chưa hoàn tất.

Không cần duplicate status nếu index đã canonical.

## Feature sizing

Một feature tốt:

- tạo một coherent user/system outcome;
- có acceptance kiểm chứng được;
- không cần đổi quá nhiều unrelated subsystems;
- đủ nhỏ để agent hoàn thành trong một hoặc vài phiên.

Không ép "mỗi feature phải cực nhỏ". Split khi:

- acceptance quá rộng;
- dependencies không rõ;
- feature có nhiều independent user outcomes;
- verification không thể xác định gọn.

## Dependency rules

Dependencies phải:

- là execution dependencies thực;
- không chỉ là "có liên quan";
- không cyclic.

## Handoff

Default progress state nên nằm trong feature detail:

```markdown
## Handoff
Done:
- ...

Remaining:
- ...

Blocker:
- none

Next:
- ...
```

Chỉ dùng khi chưa hoàn thành.

## `progress.md`

Không phải baseline.

MAY dùng khi project có long-running autonomous sessions và feature-level handoff không đủ.

## Quality gate

- mọi feature có acceptance verifiable;
- index/detail/spec links hợp lệ;
- không duplicate PM system;
- backlog không chứa placeholder giả;
- feature IDs stable qua rerun.


---

# Source: `11-HARNESS_VERIFY_SKILL_SPEC.md`

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


---

# Source: `12-HARNESS_GARDEN_SKILL_SPEC.md`

# Skill Spec — `harness-garden`

## Purpose

Kiểm soát entropy của harness, docs và recurring code patterns.

Skill này **không chạy mặc định trong bootstrap**.

## Trigger

Dùng khi:

- docs có dấu hiệu stale/conflict;
- nhiều feature đã hoàn thành;
- refactor/migration lớn vừa xong;
- agent liên tục lặp pattern xấu;
- trước milestone;
- user yêu cầu audit/cleanup.

## Default behavior

Audit-first.

MUST NOT auto-refactor rộng chỉ vì phát hiện smell.

## Levels

### Level 0 — Structural

Cheap/deterministic; thường delegate cho `init.sh doctor`.

- broken links;
- missing files;
- invalid feature JSON;
- duplicate IDs;
- dependency cycles;
- orphan feature files;
- references tới path không tồn tại.

### Level 1 — Consistency

- index/detail/spec links inconsistent;
- `done` nhưng acceptance/handoff cho thấy chưa xong;
- `AGENTS.md` route tới doc đã đổi tên;
- architecture nói module/path không còn tồn tại;
- duplicate/conflicting docs có thể phát hiện trực tiếp.

### Level 2 — Semantic drift

Reasoning audit:

- docs nói pattern A, representative code dùng B;
- spec nói behavior X, tests/code cho Y;
- architecture dependency direction bị phá;
- docs mô tả flow cũ sau migration.

Kết quả phải phân biệt "suspicion" và "proven conflict".

### Level 3 — Pattern garbage collection

Tìm recurring:

- deprecated abstraction;
- duplicated helper;
- stale compatibility shim;
- bypass pattern;
- boundary validation bị bỏ;
- guessed data shapes;
- dead flags;
- old API usage;
- TODO/debt hết hạn nếu có evidence.

### Level 4 — Repair

Chỉ chạy khi user/flow cho phép.

Repair SHOULD:

- targeted;
- small;
- verified;
- update canonical docs nếu cần;
- không "cleanup toàn repo" ngoài scope.

## Finding format

Mỗi finding:

```text
ID
Level
Severity
Observed
Expected
Evidence
Likely classification
Recommended action
Confidence
```

## Golden principles

Nếu một issue lặp lại nhiều lần, garden MAY đề xuất promote thành:

- documented invariant;
- lint;
- structural test;
- verify rule.

Không tạo `GOLDEN_PRINCIPLES.md` mặc định nếu rules đã có canonical home trong subsystem docs.

## Quality gate

Garden phải tối ưu **precision**, không tối ưu số finding.

10 finding đúng > 100 speculative smell.


---

# Source: `13-DOCUMENT_WRITING_STANDARD.md`

# Document Writing Standard for Agent-Legible Repositories

## 1. Mục tiêu

Documentation phải giảm reasoning cost, không tạo thêm reading cost.

## 2. Quy tắc viết

### 2.1 Lead with map/rule

Không mở đầu bằng lịch sử dài.

Tốt:

```text
Request → Route → Service → Repository → DB
```

Sau đó mới giải thích exception.

### 2.2 One fact, one canonical home

Không copy nguyên rules giữa nhiều file.

### 2.3 Prefer stable facts

Architecture docs chỉ nên chứa facts ít thay đổi:

- boundaries;
- entry points;
- module purpose;
- dependency direction;
- invariants.

Chi tiết thay đổi thường xuyên nên ở code/tests/generated docs.

### 2.4 Use actual names

Nêu tên:

- package;
- module;
- type;
- command;
- stable path.

Tránh line number vì stale nhanh.

### 2.5 Separate kinds of information

Nên phân biệt rõ:

- **Rule**
- **Flow**
- **Invariant**
- **Example**
- **Exception**
- **Decision**
- **Open question**

### 2.6 Optimize for scanning

Ưu tiên:

- headings;
- tables;
- bullets;
- ASCII diagrams;
- short examples.

## 3. Anti-verbosity test

Trước khi giữ một paragraph, hỏi:

- table có ngắn hơn không?
- `A → B → C` có đủ không?
- đây có phải framework knowledge agent đã biết?
- fact này có dễ suy ra từ một file duy nhất không?
- agent có cần fact này để quyết định nơi/behavior/safety không?

Nếu không, bỏ.

## 4. AGENTS standard

SHOULD fit trong một lần scan.

Recommended sections:

```text
Project
Start here
Repository map
Working invariants
Feature routing
Verification
Documentation map
```

Không nhúng long coding-style guide.

## 5. Architecture standard

Recommended:

```text
Purpose
Bird's eye
Entry points
Code map
Main flows
Boundaries
Invariants
Cross-cutting concerns
Deeper docs
```

## 6. Subsystem guide standard

Recommended:

```text
Purpose
Stack
Code map
Main flow
Patterns
Rules/invariants
Error/data/state conventions
Testing
Common mistakes
```

## 7. Spec standard

Recommended:

```text
Goal
Flow
Rules
State transitions
Edge cases
Interfaces
Non-goals
```

## 8. Freshness

Không thêm `Last updated: <date>` thủ công như một proxy cho correctness.

Nếu freshness metadata được dùng, SHOULD được tooling cập nhật hoặc garden validate.

## 9. Empty docs

MUST NOT create empty/placeholder docs chỉ để match tree.

Một missing optional doc tốt hơn một generic doc sai.


---

# Source: `14-FEATURE_MODEL.md`

# Feature Model and Schema

## 1. Vai trò

Feature model giữ **execution intent**, không giữ toàn bộ product management.

## 2. Recommended index schema

```json
{
  "schema_version": 1,
  "features": [
    {
      "id": "feat-001",
      "title": "User authentication",
      "status": "in_progress",
      "depends_on": [],
      "detail": "features/feat-001.md",
      "specs": ["docs/specs/authentication.md"]
    }
  ]
}
```

## 3. Fields

### Required
- `id`
- `title`
- `status`
- `depends_on`
- `detail`

### Optional
- `specs`

Không thêm metadata nếu agent không dùng để thực thi.

## 4. Status semantics

### `todo`
Có intent đủ để lên backlog, chưa triển khai.

### `in_progress`
Có work thực sự đang diễn ra. Nhiều feature có thể in-progress trong team nhỏ.

### `blocked`
Không thể tiếp tục do dependency/external decision/resource.

Block reason nằm trong feature detail.

### `done`
Acceptance đã thỏa và verification phù hợp đã pass hoặc có explicit accepted exception.

## 5. Feature detail template

```markdown
# feat-001 — User authentication

## Goal
...

## Scope
- ...

## Non-goals
- ...

## Acceptance
- [ ] ...

## Relevant docs
- `docs/specs/authentication.md`
- `docs/BACKEND.md`

## Verification
- `./init.sh affected`
- ...

## Handoff
Done:
- ...

Remaining:
- ...

Blocker:
- none

Next:
- ...
```

`Handoff` MAY bỏ khi feature chưa bắt đầu hoặc đã hoàn tất.

## 6. Acceptance quality

Acceptance MUST:

- observable/verifiable;
- không chỉ "code sạch";
- map tới behavior hoặc measurable technical condition.

Tốt:
- "Invalid refresh token returns 401 and does not create a session."

Xấu:
- "Authentication is implemented well."

## 7. Feature sizing heuristic

Split nếu feature có:

- nhiều independent outcomes;
- nhiều unrelated deployment paths;
- acceptance list quá dài không cohesive;
- dependency graph nội bộ phức tạp;
- không thể verify bằng một coherent test set.

## 8. State update rule

Feature chỉ chuyển `done` sau khi:

```text
acceptance satisfied
  + relevant verification passed
  + known exceptions recorded
```

Không bắt buộc một evidence manifest phức tạp.

## 9. Handoff vs progress log

Default: per-feature handoff.

Global `progress.md` chỉ MAY add khi:

- agents chạy nhiều context windows liên tục;
- nhiều micro tasks không thuộc feature;
- project cần chronological operations log;
- git/feature handoff không đủ để resume nhanh.


---

# Source: `15-VERIFICATION_DESIGN.md`

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


---

# Source: `16-GARDENING_AND_ENTROPY.md`

# Gardening and Entropy Control

## 1. Threat model

AI agent có tendency học từ local precedent.

Nếu repo chứa:

- workaround xấu;
- stale docs;
- duplicate helper;
- deprecated API;
- inconsistent boundary;

thì future agent có thể sao chép nó.

Entropy vì vậy có tính compounding.

## 2. Two-layer maintenance

### Mechanical layer

Fast deterministic checks:

```text
broken references
invalid schemas
orphan files
dependency cycles
missing canonical docs
obvious path drift
```

Run bằng `init.sh doctor`.

### Semantic layer

LLM/agent audit:

```text
intended rule
vs
representative implementation
```

Run bằng `harness-garden`.

## 3. Promotion ladder

Khi một review comment lặp lại:

```text
one-off observation
  ↓ recurring
documentation rule
  ↓ repeatedly violated
lint / structural test
  ↓ high-value invariant
verify gate
```

Không promote mọi preference thành gate.

## 4. Gardening cadence

Không hardcode lịch.

Suggested:

- on demand khi có smell;
- sau migration lớn;
- trước release/milestone;
- sau N feature nếu team thấy drift;
- periodic automation chỉ sau khi audit có precision tốt.

## 5. Audit sampling

Semantic audit không nhất thiết đọc toàn repo.

Sample:

- representative modules;
- recent changed files;
- code paths referenced by docs;
- known hot spots;
- occurrences của candidate pattern.

## 6. False-positive control

Finding phải có evidence.

Nếu confidence thấp:

- label as suspicion;
- do not repair automatically.

## 7. Repair policy

Auto/agent repair SHOULD ưu tiên:

- broken links;
- stale path names;
- feature state clearly inconsistent;
- duplicated doc section có canonical home.

Code refactor rộng cần explicit scope.

## 8. Pattern catalog

Garden MAY maintain internal candidate catalog, nhưng đừng tạo một public "garbage list" dài nếu không dùng.

Các recurring golden principles nên sống ở canonical engineering docs hoặc lint.

## 9. Completion

Garden output tốt là một repo **ít ambiguous hơn**, không phải một repo vừa bị rewrite hàng trăm file.


---

# Source: `17-WORKFLOWS.md`

# Workflows and Lifecycle

## 1. Task classes

### Class A — Small/local change

```text
AGENTS
  → relevant subsystem doc
  → code/test
  → implement
  → affected/targeted verify
```

Không cần persistent plan.

### Class B — Normal feature, one session

```text
AGENTS
  → feature detail/spec
  → brief ephemeral plan
  → implement
  → affected verify
  → update feature state
```

Plan có thể ở conversation.

### Class C — Multi-session/cross-subsystem feature

```text
feature detail
  → plan/steps
  → incremental implementation
  → verification
  → Handoff update
```

Persistent handoff nằm trong feature detail.

### Class D — Large migration / complex execution plan

MAY dùng dedicated execution-plan artifact nếu cần decisions/progress lâu dài.

Không dùng cho mọi feature.

## 2. Session startup

Coding agent SHOULD:

1. read `AGENTS.md`;
2. identify primary feature/task nếu relevant;
3. load only relevant subsystem/spec docs;
4. inspect recent code/history cần thiết;
5. run baseline quick check only if useful/risk warrants.

Không bắt buộc full suite trước coding.

## 3. During work

- keep scope;
- follow existing patterns unless spec/architecture requires migration;
- run targeted tests during iteration;
- escalate verification depth khi risk tăng.

## 4. End of feature work

Before `done`:

```text
acceptance review
  ↓
relevant verification
  ↓
update handoff/remove stale blocker
  ↓
set index status done
  ↓
docs-impact check
```

Docs-impact check là câu hỏi ngắn:

- behavior spec changed?
- architecture boundary changed?
- subsystem pattern changed?
- canonical command changed?

Nếu no → không update docs.

## 5. Team concurrency

Repository MAY có nhiều `in_progress`.

Agent MUST NOT "take over" feature chỉ vì thấy status.

User/task context xác định primary work.

Không cần lock/lease framework ở baseline.

## 6. External tracker

Jira/Linear/GitHub Issues vẫn dùng cho team.

Repo feature index chứa minimal execution truth agent cần.

Có thể link external issue ID nếu hữu ích, nhưng không mirror toàn bộ metadata.

## 7. Progress log decision

Default off.

Enable only khi:

- resume cost vẫn cao dù có per-feature handoff;
- nhiều operations không map tốt tới feature;
- long-horizon autonomous loop cần chronological history.

Nếu enable, log SHOULD ngắn và immutable, không trở thành daily diary.


---

# Source: `18-SKILL_AUTHORING_STANDARD.md`

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


---

# Source: `19-QUALITY_AND_EVALS.md`

# Quality Rubric and Evaluation Strategy

## 1. Nguyên tắc

Không đánh giá skill chủ yếu bằng:

- số file tạo;
- keyword presence;
- tự chấm template của chính nó.

Đánh giá outcome trên representative repositories.

## 2. Shared quality dimensions

Mỗi skill score theo:

1. **Groundedness** — facts có evidence.
2. **Navigation utility** — agent tìm đúng nơi nhanh hơn.
3. **Concision** — signal/token ratio.
4. **Non-duplication** — truth không bị copy.
5. **Correctness** — rules/commands/schema đúng.
6. **Rerun stability** — không churn.
7. **Scope discipline** — không sửa artifact ngoài ownership.
8. **Portability** — phù hợp repo thực.
9. **Maintenance cost** — không tạo upkeep vô ích.

## 3. `harness-map` evals

Fixture repos:

- simple backend;
- frontend+backend monorepo;
- inconsistent legacy repo.

Tests:

- agent dùng docs có locate đúng entry point không?
- dependency direction có đúng code không?
- docs có invent rule không?
- conditional docs có được tạo đúng topology không?
- token size so với utility.

## 4. `harness-specs` evals

- behavior extracted đúng requirements?
- edge cases preserved?
- implementation detail leakage?
- spec có đủ để viết test?
- conflict code-vs-requirement có bị flag?

## 5. `harness-features` evals

- decomposition coverage;
- feature coherence;
- acceptance verifiability;
- dependency graph correctness;
- stable IDs on rerun;
- existing repo không bị reverse-engineered thành fake backlog.

## 6. `harness-verify` evals

Fixtures:

- Node;
- Python;
- polyglot monorepo;
- Nx/Turbo;
- shared integration DB.

Tests:

- failures propagate;
- parallel safe;
- affected skips unrelated component;
- uncertain affected widens;
- summary compact;
- logs recoverable;
- native build tool reused.

Measure:

- wall clock;
- output tokens/chars;
- false pass/false skip.

## 7. `harness-garden` evals

Inject known defects:

- broken link;
- stale path;
- spec/code mismatch;
- deprecated pattern;
- deliberate exception.

Measure precision/recall separately.

Ưu tiên precision cho semantic findings.

## 8. Bootstrap evals

Scenario matrix:

| Repo | Expected sequence |
|---|---|
| Greenfield | map → specs → features → verify |
| Existing + good docs + bad verify | map minimal → verify |
| Existing + no specs | map → verify → specs where valuable |
| Existing harness complete | audit/report, avoid regeneration |

## 9. End-to-end eval

Đây mới là reliability benchmark đáng tin:

Same repo/task/model budget:

- baseline without harness;
- with harness pack.

Measure:

- completion correctness;
- time;
- token use;
- files read;
- scope violations;
- premature completion;
- resume success after context reset;
- verification pass;
- stale-doc incidents.

## 10. Structural conformance

Có thể giữ structural validator, nhưng gọi đúng tên:

- conformance audit;
- schema check;
- harness health.

Không gọi nó là evidence rằng agent productivity tăng.


---

# Source: `20-ANTI_PATTERNS.md`

# Anti-Patterns and Failure Modes

## 1. Mega `AGENTS.md`

### Symptom
Mọi rule, architecture, specs, workflow vào một file.

### Harm
Context crowding, rule dilution, stale blob.

### Fix
Router + progressive disclosure.

---

## 2. Checklist-driven docs generation

### Symptom
Tạo `SECURITY.md`, `RELIABILITY.md`, `MOBILE.md` dù không có nội dung thực.

### Harm
Generic/stale docs trở thành false authority.

### Fix
Conditional evidence-based creation.

---

## 3. Manifest-only architecture

### Symptom
Đọc `package.json` rồi kết luận system architecture.

### Harm
Stack đúng nhưng flows/boundaries sai.

### Fix
Inspect representative entry points + code path + tests.

---

## 4. Jira clone in Git

### Symptom
Feature JSON chứa sprint, estimates, comments, assignees, due dates.

### Harm
Duplicate state systems drift.

### Fix
Execution-only index.

---

## 5. Global one-active-feature lock

### Symptom
Toàn repo chỉ được một feature active.

### Harm
Cản team 1–4 người parallel.

### Fix
Multiple `in_progress`; one primary feature per agent/session.

---

## 6. Mandatory progress diary

### Symptom
Mọi micro-change phải ghi chronological log dài.

### Harm
Non-code overhead và duplicated history.

### Fix
Per-feature handoff; global progress optional.

---

## 7. Full verification on every iteration

### Harm
Wall-clock lớn, agent tránh chạy checks.

### Fix
targeted/affected by default; full theo risk/milestone.

---

## 8. Naive parallelism

### Symptom
`command1 & command2 & command3`.

### Harm
Race, DB contention, unreadable output.

### Fix
Job DAG + bounded concurrency + aggregation.

---

## 9. Build-system reinvention

### Symptom
`init.sh` duplicate logic Nx/Gradle/Make đã làm.

### Fix
Thin stable adapter.

---

## 10. Silent missing checks

### Symptom
Tool/test absent nhưng output vẫn green.

### Fix
Required/optional/N/A semantics.

---

## 11. Semantic lint bằng regex

### Symptom
Script tuyên bố docs đúng/sai dựa keyword.

### Harm
False confidence.

### Fix
Mechanical doctor vs reasoning garden separation.

---

## 12. Garden auto-refactor

### Symptom
Audit tìm smell rồi rewrite rộng.

### Harm
Scope explosion, new defects.

### Fix
Audit-first; repair explicitly authorized.

---

## 13. "Code is always truth"

### Harm
Architectural drift được hợp thức hóa.

### Fix
Distinguish intended vs observed.

---

## 14. "Docs are always truth"

### Harm
Stale docs phá implementation đúng.

### Fix
Conflict protocol.

---

## 15. Rerun churn

### Symptom
Mỗi lần skill chạy lại rewrite wording/IDs/tree.

### Harm
Noisy diffs, loss of trust.

### Fix
Stable IDs, preserve correct content, patch only semantic changes.

---

## 16. Harness assumptions fossilize

### Symptom
Rule tạo cho model cũ vẫn bắt buộc dù model/tool mới không cần.

### Fix
Periodically reevaluate cost vs failure mode.


---

# Source: `21-ROADMAP.md`

# Implementation Roadmap

## Phase 0 — Freeze design contracts

Deliver:

- corpus này;
- artifact ownership;
- feature schema;
- skill authoring standard;
- initial eval plan.

Không code generator lớn trước khi contracts ổn.

## Phase 1 — Build `harness-map`

Lý do làm đầu tiên:

- highest leverage;
- dễ test trên nhiều repo;
- tạo canonical knowledge để skill khác dùng.

Deliver:

- `SKILL.md`;
- map/reference docs;
- templates;
- 3–5 eval fixtures.

## Phase 2 — Build `harness-verify`

Lý do:

- độc lập tương đối với specs/features;
- feedback speed là core value;
- có deterministic eval tốt.

Deliver:

- skill;
- generated/wrapper interface;
- quick/affected/full/doctor design;
- Node/Python/polyglot fixtures.

## Phase 3 — Build `harness-specs`

Deliver:

- agent-legible spec templates;
- requirement extraction rules;
- conflict handling;
- evals cho behavior/edge case.

## Phase 4 — Build `harness-features`

Deliver:

- feature schema;
- template;
- decomposition rules;
- state validator;
- greenfield/existing modes.

## Phase 5 — Build `harness-bootstrap`

Chỉ khi 4 specialized skills đã có stable contracts.

Bootstrap orchestrates; không reimplement.

## Phase 6 — Build `harness-garden`

Bắt đầu audit-only.

Order:

1. structural findings;
2. consistency;
3. semantic drift;
4. pattern garbage;
5. optional repair.

## Phase 7 — End-to-end benchmark

Chạy representative tasks before/after harness.

Metrics:

- correctness;
- token consumption;
- time;
- resume success;
- scope violations;
- verify latency;
- doc drift.

## Phase 8 — Simplification pass

Sau dữ liệu thực:

- remove rules không tạo value;
- merge skills nếu boundary không hữu ích;
- promote recurring semantic rules thành mechanical checks;
- avoid adding framework layers chỉ vì có thể.

## Recommended development order

```text
map
  ↓
verify
  ↓
specs
  ↓
features
  ↓
bootstrap
  ↓
garden
  ↓
end-to-end eval
  ↓
simplify
```


---

# Source: `22-DECISIONS_AND_OPEN_QUESTIONS.md`

# Decisions and Open Questions

## Accepted design decisions

### D001 — Split monolithic harness skill
**Decision:** dùng skill pack chuyên trách.

**Reason:** giảm cognitive mode switching, cải thiện eval và rerun isolation.

### D002 — Baseline knowledge
**Decision:** `AGENTS.md` + `ARCHITECTURE.md` là baseline cho repo trung bình.

### D003 — Conditional subsystem docs
**Decision:** `BACKEND.md`, `FRONTEND.md`, `MOBILE.md`,... chỉ tạo theo topology/evidence.

### D004 — Repository-local specs
**Decision:** product/domain specs quan trọng sống trong repo để agent discover.

### D005 — Repo-local feature execution index
**Decision:** giữ `feature_index.json` + Markdown feature detail.

### D006 — Feature index is not PM system
**Decision:** minimal execution metadata only.

### D007 — Parallel team
**Decision:** không enforce global one-active feature; một session focus một primary feature.

### D008 — Progress log
**Decision:** không baseline; per-feature `Handoff` mặc định.

### D009 — Verification modes
**Decision:** `quick`, `affected`, `full`, `doctor`.

### D010 — Verification orchestration
**Decision:** reuse existing build tools, parallel independent jobs, compact output.

### D011 — Gardening separated
**Decision:** deterministic doctor tách khỏi semantic garden.

### D012 — Garden audit-first
**Decision:** không auto broad refactor.

### D013 — High-density docs
**Decision:** diagrams/tables/rules > verbose prose khi semantic tương đương.

### D014 — No empty docs
**Decision:** missing optional doc tốt hơn generic artifact.

### D015 — Intended vs observed truth
**Decision:** conflict phải investigate, không auto chọn code/docs.

## Open questions

### Q001 — `feature_index.json` hay YAML?
Current recommendation: JSON vì machine-friendly và hạn chế accidental prose edits.

Revisit nếu tooling/YAML ecosystem của repo tạo lợi ích rõ.

### Q002 — Feature detail Markdown có frontmatter không?
Current recommendation: không cần duplicate status; có thể chỉ header ID/title.

Frontmatter chỉ thêm khi machine tooling thực sự cần.

### Q003 — Doctor implementation language
Không có universal answer.

Options:
- Node;
- Python;
- shell;
- project-native task runner.

Decision per repo/tooling.

### Q004 — Có cần harness manifest?
Ví dụ `.harness/config.json`.

Current: **không** baseline.

Add only khi verify/component mapping hoặc tooling cần machine config shared.

### Q005 — Có cần `docs/decisions/` baseline?
Current: conditional.

Dùng khi decisions không thể suy ra và có durable consequences.

### Q006 — Có cần global `progress.md`?
Current: no.

Revisit bằng đo resume cost thực tế.

### Q007 — Bootstrap có thực sự gọi được skill khác?
Tool/environment dependent.

Contract phải hỗ trợ cả:
- direct orchestration;
- ordered manual sequence.


---

# Source: `23-REFERENCE_TRACEABILITY.md`

# Reference Traceability

## 1. OpenAI — Harness engineering

Source:
https://openai.com/index/harness-engineering/

Key observations adopted:

- `AGENTS.md` nên là map/table of contents, không phải manual lớn.
- repository-local structured docs làm system of record.
- progressive disclosure.
- architecture docs + deeper specialized docs.
- lightweight plans cho small work, persistent execution plans cho complex work.
- mechanical enforcement cho knowledge structure.
- recurring doc-gardening.
- agent legibility.
- enforce invariants/boundaries, allow local autonomy.
- entropy/garbage collection.
- repository-specific investment, không giả định mọi pattern generalize nguyên xi.

Adaptation for small team:

- không copy toàn bộ docs tree của OpenAI;
- không tạo quality/security/reliability docs mặc định;
- không chạy background garden mặc định;
- giữ skill pack modular.

## 2. Anthropic — Effective harnesses for long-running agents

Source:
https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

Adopted:

- feature list giúp tránh one-shot và premature completion;
- incremental feature work;
- init script giảm startup cost;
- persistent handoff có giá trị khi context reset;
- clean state / self-verification.

Adapted:

- feature index không nhất thiết chỉ một active global;
- progress log không baseline cho task ngắn;
- harness này không chỉ target autonomous multi-day app build.

## 3. Anthropic — Managed Agents

Source:
https://www.anthropic.com/engineering/managed-agents

Adopted:

- harness encodes assumptions về model limitations;
- assumptions có thể stale khi model cải thiện;
- thiết kế phải định kỳ reevaluate rule cost/benefit.

## 4. matklad — ARCHITECTURE.md

Source:
https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html

Adopted:

- architecture doc high leverage cho codebase cỡ trung bình;
- bird's-eye + codemap;
- answer "where is thing X?";
- keep it short/stable;
- explicit boundaries/invariants;
- cross-cutting concerns;
- avoid low-level detail.

Adapted for agents:

- stable paths/named symbols có thể hữu ích cho navigation;
- avoid fragile line links.

## 5. Current `harness-slim`

Repository:
https://github.com/tungxuan1656/harness-slim

Current ideas retained:

- compact harness;
- `AGENTS.md`;
- feature index/detail;
- init verification entry;
- evidence before done;
- progressive documentation;
- state validation.

Ideas revised:

- split monolithic skill;
- remove mandatory global progress log;
- relax global one-active feature for small team concurrency;
- replace narrow `check-state` concept with broader doctor + garden;
- verification becomes multi-component/affected/parallel-aware;
- map/spec creation gets specialized deep inspection.

## 6. Evidence status

Các nguồn trên là engineering reports/practitioner guidance, không phải controlled peer-reviewed trials.

Do đó:

- chúng hỗ trợ architecture hypotheses;
- effectiveness phải được xác nhận bằng eval/benchmark trên representative repositories.


---

# Source: `24-CONTEXT_BUDGET_AND_DISCLOSURE.md`

# Context Budget and Progressive Disclosure

## 1. Context là tài nguyên hữu hạn

Harness phải tối ưu không chỉ số file mà cả **read amplification**:

> Một thay đổi nhỏ buộc agent đọc bao nhiêu token trước khi có thể sửa đúng?

Đây là metric quan trọng hơn tổng kích thước thư mục `docs/`.

## 2. Read ladder

### Always/near-always
- `AGENTS.md`

### Read by task classification
- `ARCHITECTURE.md` khi agent chưa biết topology hoặc task cross-cutting;
- subsystem guide liên quan;
- feature detail nếu task thuộc feature;
- spec liên quan nếu behavior/domain rule cần.

### Read on demand
- decisions;
- external references;
- reliability/security;
- generated schema;
- garden reports.

## 3. Routing phải actionable

Không viết:

> See documentation for more details.

Viết:

```text
Changing API/service/data access → read `docs/BACKEND.md`
Changing authentication behavior → read `docs/specs/authentication.md`
Changing package boundaries → read `ARCHITECTURE.md`
```

## 4. Avoid recursive reading

Một doc không nên bắt agent mở 5 doc chỉ để hiểu 1 rule cơ bản.

Nếu một invariant bắt buộc cho mọi backend task, nó thuộc `BACKEND.md`, không chỉ nằm trong một ADR sâu.

## 5. Summary vs canonical detail

Router MAY restate một câu đủ để chọn đường đi, nhưng canonical detail vẫn ở doc sở hữu.

Example:

`AGENTS.md`:
> Backend follows Route → Service → Repository; details: `docs/BACKEND.md`.

Đây là acceptable duplication vì routing value cao và summary rất nhỏ.

## 6. Code reading budget

Skill tạo docs nên đọc representative code đủ để grounded nhưng không exhaustive.

Agent coding task nên:

1. locate bằng docs/search;
2. inspect narrow relevant slice;
3. expand only khi dependency/behavior unclear.

## 7. Documentation size heuristic

Không hardcode line count, nhưng khi doc dài:

- split theo cognitive boundary, không split arbitrary;
- giữ stable overview ở parent;
- route đến specialized child.

## 8. Token-saving verification

Verification output là context input.

Do đó:

- suppress successful verbose logs;
- summarize status/duration;
- show failure excerpt;
- keep full logs recoverable.

## 9. Context success metric

Một harness tốt cho task phổ biến sẽ có:

```text
small routing read
+ one focused knowledge doc
+ narrow code slice
+ compact verification feedback
```

không phải:

```text
AGENTS
+ all docs
+ all feature files
+ full test logs
```


---

# Source: `25-MIGRATION_FROM_CURRENT_HARNESS_SLIM.md`

# Migration from Current `harness-slim`

## 1. Current model

Current `harness-slim` monolith combines:

- instruction generation;
- feature state;
- verification;
- progress lifecycle;
- docs map;
- state checker;
- audit/benchmark.

Migration không nên xóa mọi thứ cùng lúc. Preserve useful ideas, reassign ownership.

## 2. Artifact mapping

| Current | New owner / decision |
|---|---|
| `AGENTS.md` | `harness-map`; rewrite toward router |
| `docs/README.md` | `harness-map`; retain as docs router |
| optional architecture docs | `harness-map`; make `ARCHITECTURE.md` baseline |
| `feature_index.json` | `harness-features`; schema revised |
| `features/*` | `harness-features`; simplify detail |
| `progress.md` | optional; migrate useful current state into feature `Handoff` |
| `init.sh` | `harness-verify`; redesign modes |
| `scripts/check-state.sh` | evolve into `doctor` structural capability |
| validator/report | maintainer/conformance tooling, not core project artifact |
| references | distribute to specialized skills |

## 3. Remove/relax old assumptions

### Old: exactly/at most one active feature
New:
- multiple `in_progress` allowed;
- session focus one feature.

### Old: mandatory progress update each session
New:
- feature handoff;
- global progress optional.

### Old: quick/full only
New:
- quick/affected/full/doctor.

### Old: single detected stack chain
New:
- component-aware / monorepo-aware inspection.

### Old: Bash + jq requirement
New:
- choose portable/project-appropriate implementation.

## 4. Migration sequence

1. Tag current implementation / preserve tests.
2. Freeze current monolithic skill as legacy during transition.
3. Build `harness-map`.
4. Migrate docs references used by map.
5. Build `harness-verify`; keep compatibility `./init.sh` entry.
6. Build `harness-specs`.
7. Build `harness-features`; write migration for old index/detail.
8. Build bootstrap orchestrator.
9. Build garden.
10. Deprecate monolithic `harness-slim` or turn it into alias/bootstrap entry.

## 5. Backward compatibility

Possible strategy:

```text
harness-slim
  → becomes thin redirect/orchestrator to `harness-bootstrap`
```

Existing users vẫn có familiar entry name nhưng implementation modular.

## 6. Migration quality gate

Không được làm regression:

- repo cũ vẫn có thể verify;
- feature IDs không mất;
- useful progress state không bị xóa;
- existing human docs không bị overwrite;
- old commands có migration message rõ.


---

# Source: `26-SKILL_IMPLEMENTATION_CHECKLIST.md`

# Skill Implementation Checklist

## Shared checklist cho mọi `harness-*` skill

### Scope
- [ ] Một cognitive responsibility rõ.
- [ ] Có `Use When` và `Do Not Use When`.
- [ ] Có primary owned artifacts.
- [ ] Mutation boundary rõ.

### Grounding
- [ ] Inspection strategy cụ thể.
- [ ] Không suy luận project facts chỉ từ tên file.
- [ ] Có behavior khi evidence thiếu.

### Output
- [ ] Mandatory vs conditional outputs rõ.
- [ ] Không tạo empty placeholders.
- [ ] Cross-links tối thiểu và đúng owner.
- [ ] Format/templates có ví dụ.

### Rerun
- [ ] Existing artifact được inspect.
- [ ] Stable IDs/names.
- [ ] Không duplicate section.
- [ ] Không rewrite unrelated artifact.

### Efficiency
- [ ] Có stopping rule để không đọc toàn repo.
- [ ] Không load reference không cần.
- [ ] Output có signal/token cao.

### Quality
- [ ] Có eval fixture.
- [ ] Eval outcome, không chỉ file existence.
- [ ] Có negative test / anti-pattern fixture.
- [ ] Có rerun/idempotence test.

## `harness-map`
- [ ] Baseline AGENTS + ARCHITECTURE.
- [ ] Subsystem docs conditional.
- [ ] Representative flows inspected.
- [ ] Architecture invariants grounded.
- [ ] Fresh agent navigation eval.

## `harness-specs`
- [ ] Requirements/source precedence.
- [ ] Behavior vs implementation separation.
- [ ] Edge case representation.
- [ ] Conflict handling.
- [ ] Spec useful để derive tests.

## `harness-features`
- [ ] Minimal JSON schema.
- [ ] Multiple `in_progress` supported.
- [ ] Feature detail template.
- [ ] Acceptance verifiable.
- [ ] Dependency cycle validation.
- [ ] Greenfield + existing modes.
- [ ] Progress log not required.

## `harness-verify`
- [ ] Existing commands/tools inspected.
- [ ] quick/affected/full/doctor.
- [ ] Component aware.
- [ ] Safe parallel DAG.
- [ ] Output compression.
- [ ] Required/optional/N/A semantics.
- [ ] Failure exit codes.
- [ ] Baseline failure handling.

## `harness-garden`
- [ ] Audit levels 0–4.
- [ ] Audit-first.
- [ ] Finding evidence/confidence.
- [ ] Semantic vs mechanical separated.
- [ ] Broad repair requires authorization.
- [ ] Precision-focused eval.

## `harness-bootstrap`
- [ ] Repo classification.
- [ ] Existing capability detection.
- [ ] Adaptive sequence.
- [ ] Does not reimplement specialized skills.
- [ ] Graceful manual sequence if subskill invocation unavailable.


---

# Source: `27-EXAMPLE_TARGET_STRUCTURES.md`

# Example Target Repository Structures

Các ví dụ dưới đây là **patterns**, không phải scaffold bắt buộc.

## 1. Single backend service

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   └── specs/
│       ├── README.md
│       └── authentication.md
└── features/
    ├── feat-template.md
    └── feat-001.md
```

Không cần FRONTEND/MOBILE.

## 2. Full-stack app

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   └── specs/
│       ├── README.md
│       ├── onboarding.md
│       └── billing.md
└── features/
```

## 3. Backend + frontend + mobile monorepo

```text
repo/
├── AGENTS.md
├── ARCHITECTURE.md
├── feature_index.json
├── init.sh
├── docs/
│   ├── README.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   ├── MOBILE.md
│   ├── DATA.md          # only if shared data contracts are non-trivial
│   └── specs/
├── features/
└── scripts/
    └── verify/          # only if init orchestration needs helpers
```

`init.sh affected` có thể map changed workspace đến component jobs.

## 4. Existing legacy repo with good docs

Có thể chỉ cần:

```text
AGENTS.md
existing ARCHITECTURE.md
existing docs/
feature_index.json
features/
init.sh
```

`harness-map` SHOULD reuse links; không duplicate existing docs under new names.

## 5. Very small repo

Nếu project thực sự nhỏ, target có thể là:

```text
AGENTS.md
ARCHITECTURE.md
init.sh
```

Feature/spec layer MAY không cần nếu work đơn giản.

Corpus target là medium projects, nhưng "complexity must be earned" vẫn áp dụng.

## 6. Documentation-heavy/domain-heavy app

```text
docs/
├── README.md
├── BACKEND.md
├── FRONTEND.md
├── specs/
│   ├── README.md
│   ├── orders.md
│   ├── refunds.md
│   └── permissions.md
├── decisions/
│   └── event-delivery-semantics.md
└── references/
    └── payment-provider-contract.md
```

Chỉ thêm `decisions`/`references` khi behavior không thể hiểu an toàn nếu thiếu chúng.
