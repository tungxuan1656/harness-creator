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
