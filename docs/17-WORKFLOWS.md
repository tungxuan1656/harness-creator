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
