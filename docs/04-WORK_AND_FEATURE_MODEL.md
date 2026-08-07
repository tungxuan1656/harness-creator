# Work and Feature Model

## 1. Task classes

### Class A - Local task

Examples: small bug, focused refactor, one config or test change.

```text
instructions
  -> focused code/test
  -> implement
  -> targeted/affected verify
```

MUST NOT require feature file, persistent plan hoặc progress log.

### Class B - Normal feature, usually one session

```text
instructions
  -> relevant spec/doc
  -> short ephemeral plan
  -> implement
  -> affected verify
  -> update existing feature state if present
```

Plan có thể ở conversation.

### Class C - Multi-session or cross-subsystem feature

```text
feature detail
  -> scoped steps
  -> incremental work
  -> proportional verification
  -> concise handoff when stopping
```

Persistent feature state tạo value vì resume cost thật sự tồn tại.

### Class D - Large migration

MAY dùng dedicated execution plan nếu cần giữ decisions, rollout hoặc checkpoints lâu dài. Đây là exception, không phải default feature format.

## 2. When feature state is justified

Tạo `feature_index.json` và `features/*` khi ít nhất một điều đúng:

- project có explicit repository-native planned backlog, đặc biệt sau greenfield requirements/spec decomposition;
- work kéo dài qua nhiều phiên;
- có execution dependencies;
- nhiều người/agent cần thấy current scope;
- acceptance đủ lớn để chat history không đáng tin;
- resume cost đã trở thành vấn đề.

Một planned feature thuộc project backlog MAY được track dù riêng feature đó dự kiến hoàn thành trong một session. Backlog trong trường hợp này là project memory, không chỉ session memory.

```text
Ad-hoc one-session task
  -> không cần feature artifact

Planned feature thuộc repository-native backlog
  -> MAY track dù execution chỉ một session
```

Không tạo backlog repo-local chỉ vì harness có template hoặc external tracker đã cung cấp execution context đầy đủ.

## 3. Execution index

Index giữ planned/current execution truth và MAY giữ compact identity của completed features:

- `id`;
- `title`;
- `status`;
- `depends_on`;
- `detail`;
- optional `specs` và `external_ref`.

Không mặc định thêm sprint, estimates, deadlines, comments hoặc assignee workflow.

## 4. Status semantics

| Status | Meaning |
|---|---|
| `todo` | Intent và acceptance đủ rõ, chưa bắt đầu |
| `in_progress` | Work thực sự đang diễn ra |
| `blocked` | Không thể tiến tiếp do dependency/decision/resource cụ thể |
| `done` | Acceptance thỏa và relevant verification pass hoặc exception được chấp nhận |

Nhiều `in_progress` MAY tồn tại. Status không phải lock và không tự cấp ownership cho agent.

## 5. Feature detail

Required khi feature được track:

- Goal;
- Scope;
- Acceptance;
- Relevant docs/specs;
- Verification.

Conditional:

- Non-goals khi scope dễ trượt;
- Handoff khi work dừng trước khi hoàn thành;
- Blocker details khi status là `blocked`.

Không duplicate status nếu index là canonical.

## 6. Acceptance quality

Acceptance MUST observable hoặc verifiable.

Tốt:

> Invalid refresh token returns 401 and does not create a session.

Không tốt:

> Authentication is implemented cleanly.

Feature chỉ `done` khi:

```text
acceptance satisfied
  + relevant verification passed
  + accepted exceptions recorded
```

## 7. Dependencies

Dependency phải là execution dependency thực, không chỉ “có liên quan”. Structural validation SHOULD kiểm tra:

- unique IDs và detail paths;
- referenced feature tồn tại;
- không self-dependency hoặc cycle;
- path nằm trong expected repository area;
- detail/spec file tồn tại;
- status consistency cơ bản.

JSON Schema chỉ validate shape; garden structural scan validate cross-record/file invariants.

## 8. Handoff

Handoff chỉ ghi state cần để resume:

```text
Done
Remaining
Blocker
Next
```

Không ghi diary, full command logs hoặc lịch sử đã có trong git.

Khi feature hoàn tất, remove stale Handoff hoặc giữ một completion note rất ngắn nếu nó còn value.

## 9. Completed feature retention

`done` không nên giữ detail/handoff rác vô hạn, nhưng compact feature identity có giá trị chống duplicate planning.

Default cho team nhỏ:

- remove stale Handoff/blocker khi completion;
- compact hoặc remove detail trước nếu nó không còn durable value;
- giữ compact index entry lâu hơn để agent biết feature đã tồn tại và hoàn thành;
- chỉ prune old done identity sau milestone/release hoặc khi index thực sự lớn và external/git history đáng tin;
- không tạo `features/archive/` mặc định.

Repo MAY chọn retention khác, nhưng phải ghi rõ và tránh index phình vô hạn.

## 10. External tracker

External tracker tiếp tục là source cho team management. `external_ref` MAY link issue liên quan.

Feature index không mirror metadata. Nếu external tracker đã cung cấp đủ scope, acceptance và handoff cho agent trong repo/tool context, không cần tạo index thứ hai.

## 11. Global progress log

Default off.

Chỉ thêm khi per-feature handoff và git history vẫn không đủ cho long-running autonomous work hoặc operations không map vào feature. Nếu dùng, log phải ngắn và không trở thành daily diary.
