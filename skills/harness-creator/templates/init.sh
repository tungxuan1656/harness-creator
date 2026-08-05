#!/usr/bin/env bash
# init.sh — environment health check
# Usage:
#   ./init.sh        quick check (type-check only, <5s)
#   ./init.sh full   full verification (lint + type + test, run before marking done)
set -euo pipefail

MODE="${1:-quick}"

echo "=== Init [mode: $MODE] ==="

# ── Node.js ───────────────────────────────────────────────────────────────────
if [ -f package.json ]; then
  if   [ -f pnpm-lock.yaml ]; then PM="pnpm"
  elif [ -f yarn.lock ];      then PM="yarn"
  elif [ -f bun.lock ] || [ -f bun.lockb ]; then PM="bun"
  else PM="npm"; fi

  [ -d node_modules ] || { echo "❌ node_modules missing. Run: $PM install"; exit 1; }

  _run() { [ "$PM" = "npm" ] && npm run "$1" || "$PM" run "$1"; }
  _has() { node -e "const s=require('./package.json').scripts||{};process.exit(s['$1']?0:1)" 2>/dev/null; }

  if [ "$MODE" = "quick" ]; then
    # type-check only — fast
    if   _has check;     then _run check
    elif _has typecheck; then _run typecheck
    elif _has type-check; then _run type-check
    else echo "⚠️  No type-check script found. Add 'check' or 'typecheck' to package.json scripts."; fi

  else
    # full: lint + type in parallel, then test sequential
    { _has lint && _run lint || true; } &
    PID_LINT=$!
    { if   _has check;     then _run check
      elif _has typecheck; then _run typecheck
      elif _has type-check; then _run type-check; fi; } &
    PID_TYPE=$!
    wait $PID_LINT || { echo "❌ Lint failed"; exit 1; }
    wait $PID_TYPE || { echo "❌ Type check failed"; exit 1; }
    _has test && _run test
  fi

# ── Python ────────────────────────────────────────────────────────────────────
elif [ -f pyproject.toml ] || [ -f requirements.txt ]; then
  PY="$(command -v python3 || command -v python)"
  if [ "$MODE" = "quick" ]; then
    "$PY" -m ruff check . 2>/dev/null || "$PY" -m flake8 . 2>/dev/null || true
  else
    "$PY" -m ruff check . 2>/dev/null || true
    "$PY" -m pytest || [ $? -eq 5 ]
  fi

# ── Go ────────────────────────────────────────────────────────────────────────
elif [ -f go.mod ]; then
  if [ "$MODE" = "quick" ]; then go vet ./...
  else go test ./...; fi

# ── Rust ──────────────────────────────────────────────────────────────────────
elif [ -f Cargo.toml ]; then
  if [ "$MODE" = "quick" ]; then cargo check
  else cargo test; fi

# ── Maven / Gradle / .NET ─────────────────────────────────────────────────────
elif [ -f pom.xml ]; then
  [ "$MODE" = "full" ] && mvn test || mvn validate
elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then
  [ "$MODE" = "full" ] && ./gradlew test || ./gradlew check
elif ls ./*.csproj ./*.sln >/dev/null 2>&1; then
  [ "$MODE" = "full" ] && dotnet test || dotnet build

else
  echo "No recognized stack. Replace this script with project-specific verify commands."
  exit 1
fi

echo ""
echo "=== Done ==="

# show active feature
active=$(grep -A4 '"active"' feature_index.json 2>/dev/null \
  | grep '"title"' | head -1 \
  | sed 's/.*"\([^"]*\)".*/\1/' || true)
[ -n "$active" ] && echo "Active feat: $active" || echo "No active feat — check feature_index.json"
