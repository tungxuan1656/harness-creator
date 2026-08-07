# Architecture

## Purpose
<What system does, one paragraph max>

## Bird's-eye view

```text
<Client>
   ↓
<Component A>
   ↓
<Component B>
   ↓
<Data/External system>
```

## Entry points
- `<symbol/path>` — <role>

## Code map
| Area | Responsibility |
|---|---|
| `<path/module>` | <responsibility> |

## Main flows

### <Flow name>
```text
A → B → C
```

## Dependency direction

```text
A → B → C
```

Forbidden:
- `C → A`
- ...

## Architectural invariants
- ...

## Cross-cutting concerns
- Auth:
- Logging/telemetry:
- Config:
- Error handling:

## Deeper docs
- ...
