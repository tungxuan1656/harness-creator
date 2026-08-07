# <Behavior or domain>

## Goal

<Expected product/domain outcome.>

## Flow

```text
Input
  -> validate
     | invalid -> <result>
     | valid
       -> <business rule>
       -> <result>
```

## Rules

- ...

## State transitions

<!-- Remove when the behavior has no meaningful state machine. -->

| From | Event | To | Result |
|---|---|---|---|
| ... | ... | ... | ... |

## Edge cases

| Case | Expected result |
|---|---|
| ... | ... |

## Interfaces

<!-- Include only when a public contract needs to be explicit. -->

## Non-goals

<!-- Include only when scope creep is likely. -->

- ...

## Sources and uncertainties

- Intended source: `<requirement, accepted decision, or canonical document>`
- Observed evidence: `<test, code path, or runtime evidence if relevant>`
- Unresolved: `none` or <question>
