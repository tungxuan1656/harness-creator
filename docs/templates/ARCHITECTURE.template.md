# Architecture

## Purpose

<What the system does, one paragraph maximum.>

## Status

<!-- State whether this map is observed, intended/proposed, or a mixture. List important uncertainties. -->

## Bird's-eye view

```text
<Client>
  -> <Component A>
  -> <Component B>
  -> <Data or external system>
```

## Entry points

- `<stable symbol/path>` - <role>

## Code map

| Area | Responsibility |
|---|---|
| `<path/module>` | `<responsibility>` |

## Main flows

### <Flow name>

```text
A -> B -> C
```

## Boundaries and dependency direction

```text
A -> B -> C
```

Required:

- ...

Forbidden:

- `C -> A`

## Cross-cutting concerns

- Authentication/authorization:
- Configuration:
- Errors and validation:
- Logging/telemetry:

## Known exceptions or uncertainties

- ...

## Deeper docs

- `<doc>` - read when <condition>
