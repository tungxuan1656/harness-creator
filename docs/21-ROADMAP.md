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
