# Design Decisions

Decision log này chỉ giữ các lựa chọn ảnh hưởng lớn đến skill architecture và target repository. Detailed rules sống trong canonical topic docs.

Mọi decision MAY được revisit bằng eval/ablation data; accepted không có nghĩa bất biến vĩnh viễn.

## D001 - Optimize for medium repositories and small teams

**Status:** Accepted

Target mặc định là project khoảng 10k-200k LOC và team 1-4 người. Correctness, fast feedback và low task overhead quan trọng hơn enterprise governance.

## D002 - Instructions are a router, not an encyclopedia

**Status:** Accepted

Agent entry instructions route tới focused architecture, specs, feature state và verification. Progressive disclosure tránh crowding task context.

## D003 - Baseline navigation capability

**Status:** Accepted

`AGENTS.md` hoặc equivalent MUST tồn tại. Architecture overview SHOULD tồn tại cho medium repo, trừ khi repo trivial hoặc existing doc đã cung cấp topology, entry points và boundaries.

## D004 - Hybrid skill architecture

**Status:** Accepted

Preferred distribution gồm router `harness` và năm specialist skills: `harness-map`, `harness-specs`, `harness-features`, `harness-verify`, `harness-garden`.

Khi platform không compose được skills, router dùng workflow references tương ứng nhưng bắt buộc phase isolation. Lý do là giảm cognitive task interference mà vẫn giữ portable adoption UX.

## D005 - Feature state covers planned project memory

**Status:** Accepted

Feature state dùng cho persistent execution needs và repository-native planned backlog, đặc biệt greenfield decomposition. Ad-hoc one-session task không cần artifact; planned one-session feature MAY được track.

## D006 - Multiple features may be in progress

**Status:** Accepted

Team nhỏ có thể làm song song. Một agent/session focus một primary task, nhưng repository không enforce global one-active lock.

## D007 - No global progress log by default

**Status:** Accepted

Feature Handoff, git và external tracker cover normal resume needs. Global progress log chỉ thêm khi measured resume cost vẫn cao.

## D008 - Verification exposes quick, affected and full

**Status:** Accepted

`affected` là default post-change path; `full` theo risk/milestone. Current design không expose public `doctor`; đây là interface decision có thể revisit, không phải invariant vĩnh viễn.

## D009 - Garden owns maintenance; verify composes structural checks

**Status:** Accepted

Garden owns deterministic structural checks và evidence-based semantic audit. Feature completion, affected harness changes và full verification run cheap structural checks when applicable. Semantic findings normally do not gate delivery.

## D010 - `init.sh` is a thin adapter

**Status:** Accepted

Adapter resolves root, parses mode, dispatches và preserves exit semantics. Complex logic belongs in native tooling or conditional helpers. Harness does not build a second dependency engine.

## D011 - Intended and observed truth remain distinct

**Status:** Accepted

Specs/architecture describe intended or proposed truth; code/tests/runtime provide observed evidence. Conflict requires classification, not automatic normalization.

## D012 - Compact completed identity before pruning it

**Status:** Accepted

On completion remove stale Handoff and compact low-value detail first. Keep compact done index identity longer to prevent duplicate planning; prune identity only when index cost is real and reliable history exists elsewhere.
