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
