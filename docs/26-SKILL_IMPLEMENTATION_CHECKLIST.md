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
