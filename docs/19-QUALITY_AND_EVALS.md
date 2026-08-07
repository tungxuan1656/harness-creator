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
