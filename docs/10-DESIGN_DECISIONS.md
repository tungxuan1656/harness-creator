# Design Decisions

This decision log keeps only choices that materially affect skill architecture and the target repository. Detailed rules live in the canonical topic docs.

Every decision MAY be revisited with evaluation or ablation data; accepted does not mean permanently frozen.

## D001 - Optimize for medium repositories and small teams

**Status:** Accepted

The default target is a 10k-200k LOC project and a 1-4 person team. Correctness, fast feedback, and low task overhead matter more than enterprise governance.

## D002 - Instructions are a router, not an encyclopedia

**Status:** Accepted

Agent entry instructions route to focused architecture, specs, feature state, and verification. Progressive disclosure prevents task-context crowding.

## D003 - Baseline navigation capability

**Status:** Accepted

`AGENTS.md` or an equivalent MUST exist. An architecture overview SHOULD exist for a medium repository unless the repository is trivial or an existing doc already provides topology, entry points, and boundaries.

## D004 - Hybrid skill architecture

**Status:** Accepted

The preferred distribution includes a `harness` router and five specialist skills: `harness-map`, `harness-specs`, `harness-features`, `harness-verify`, and `harness-garden`.

When the platform cannot compose skills, the router uses the corresponding workflow references but enforces phase isolation. This reduces cognitive task interference while preserving a portable adoption experience.

## D005 - Feature state covers planned project memory

**Status:** Accepted

Feature state covers persistent execution needs and repository-native planned backlogs, especially greenfield decomposition. An ad-hoc one-session task does not need an artifact; a planned one-session feature MAY be tracked.

## D006 - Multiple features may be in progress

**Status:** Accepted

A small team may work in parallel. One agent/session focuses on one primary task, but the repository does not enforce a global one-active lock.

## D007 - No global progress log by default

**Status:** Accepted

Feature Handoff, git, and the external tracker cover normal resume needs. Add a global progress log only when measured resume cost remains high.

## D008 - Verification exposes quick, affected, and full

**Status:** Accepted

`affected` is the default post-change path; `full` is used by risk/milestone. The current design does not expose a public `doctor`; this is an interface choice that may be revisited, not a permanent invariant.

## D009 - Garden owns maintenance; verify composes structural checks

**Status:** Accepted

Garden owns deterministic structural checks and evidence-based semantic audits. Feature completion, affected harness changes, and full verification run cheap structural checks when applicable. Semantic findings normally do not gate delivery.

## D010 - `init.sh` is a thin adapter

**Status:** Accepted

The adapter resolves the root, parses modes, dispatches, and preserves exit semantics. Complex logic belongs in native tooling or conditional helpers. Harness does not build a second dependency engine.

## D011 - Intended and observed truth remain distinct

**Status:** Accepted

Specs/architecture describe intended or proposed truth; code/tests/runtime provide observed evidence. Conflicts require classification, not automatic normalization.

## D012 - Compact completed identity before pruning it

**Status:** Accepted

On completion, remove stale Handoff and compact low-value detail first. Keep compact done index identity longer to prevent duplicate planning; prune identity only when index cost is real and reliable history exists elsewhere.
