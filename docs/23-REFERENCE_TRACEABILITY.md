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
