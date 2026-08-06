#!/usr/bin/env bash
# init.sh — environment health check
# Usage:
#   ./init.sh        quick check (type-check only, <5s)
#   ./init.sh full   full verification (lint + type + test, run before marking done)
set -euo pipefail

MODE="${1:-quick}"
STATUS=0
CONFIGURED_COMMANDS=(
{{CONFIGURED_COMMANDS}}
)

if [ "$MODE" != "quick" ] && [ "$MODE" != "full" ]; then
  echo "Usage: $0 [quick|full]" >&2
  exit 2
fi

echo "=== Init [mode: $MODE] ==="

absent() {
  echo "ABSENT $1 (not configured)"
  echo "⚠️  $1 is not configured; continuing."
}

not_applicable() {
  echo "NOT APPLICABLE $1"
}

run_check() {
  local label="$1"
  shift
  echo "RAN $label"
  if "$@"; then
    echo "PASS $label"
    return 0
  fi
  echo "FAIL $label"
  return 1
}

run_node_script() {
  local script="$1"
  if [ "$PM" = "npm" ]; then npm run "$script"; else "$PM" run "$script"; fi
}

has_node_script() {
  node -e "const scripts=require('./package.json').scripts||{}; process.exit(scripts[process.argv[1]] ? 0 : 1)" "$1" 2>/dev/null
}

node_check_or_absent() {
  local label="$1"
  local script="$2"
  if has_node_script "$script"; then
    run_check "$label ($script)" run_node_script "$script" || STATUS=1
  else
    absent "$label"
  fi
}

node_type_check() {
  if has_node_script check; then
    run_check "type-check (check)" run_node_script check || STATUS=1
  elif has_node_script typecheck; then
    run_check "type-check (typecheck)" run_node_script typecheck || STATUS=1
  elif has_node_script type-check; then
    run_check "type-check (type-check)" run_node_script type-check || STATUS=1
  else
    absent "type-check"
  fi
}

python_static_check() {
  if "$PY" -c 'import mypy' >/dev/null 2>&1; then
    run_check "type-check (mypy)" "$PY" -m mypy . || STATUS=1
  elif "$PY" -c 'import ruff' >/dev/null 2>&1; then
    run_check "type-check (ruff)" "$PY" -m ruff check . || STATUS=1
  elif "$PY" -c 'import flake8' >/dev/null 2>&1; then
    run_check "type-check (flake8)" "$PY" -m flake8 . || STATUS=1
  else
    absent "type-check (mypy/ruff/flake8)"
  fi
}

python_test_check() {
  echo "RAN test (pytest)"
  if "$PY" -m pytest; then
    echo "PASS test (pytest)"
    return 0
  else
    local exit_code=$?
  fi
  if [ "$exit_code" -eq 5 ]; then
    echo "ABSENT test (pytest; no tests collected; exit 5)"
    return 0
  fi
  echo "FAIL test (pytest; exit $exit_code)"
  return 1
}

run_configured_commands() {
  if [ "${#CONFIGURED_COMMANDS[@]}" -eq 0 ]; then
    return 0
  fi
  if [ "$MODE" = "quick" ]; then
    not_applicable "configured verification commands (full mode only)"
    return 0
  fi
  for command in "${CONFIGURED_COMMANDS[@]}"; do
    run_check "configured command: $command" bash -c "$command" || STATUS=1
  done
}

run_configured_commands

# ── Node.js ───────────────────────────────────────────────────────────────────
if [ -f package.json ]; then
  if [ -f pnpm-lock.yaml ]; then PM="pnpm"
  elif [ -f yarn.lock ]; then PM="yarn"
  elif [ -f bun.lock ] || [ -f bun.lockb ]; then PM="bun"
  else PM="npm"; fi

  [ -d node_modules ] || echo "⚠️  node_modules missing; no dependency installation will be attempted."
  node_type_check
  if [ "$MODE" = "quick" ]; then
    not_applicable "lint (full mode only)"
    not_applicable "test (full mode only)"
  else
    node_check_or_absent "lint" lint
    node_check_or_absent "test" test
  fi

# ── Python ────────────────────────────────────────────────────────────────────
elif [ -f pyproject.toml ] || [ -f requirements.txt ]; then
  PY="$(command -v python3 || command -v python || true)"
  if [ -z "$PY" ]; then
    absent "python checks"
  elif [ "$MODE" = "quick" ]; then
    python_static_check
    not_applicable "lint (full mode only)"
    not_applicable "test (full mode only)"
  else
    if "$PY" -c 'import ruff' >/dev/null 2>&1; then
      run_check "lint (ruff)" "$PY" -m ruff check . || STATUS=1
    elif "$PY" -c 'import flake8' >/dev/null 2>&1; then
      run_check "lint (flake8)" "$PY" -m flake8 . || STATUS=1
    else
      absent "lint (ruff/flake8)"
    fi
    if "$PY" -c 'import mypy' >/dev/null 2>&1; then
      run_check "type-check (mypy)" "$PY" -m mypy . || STATUS=1
    else
      absent "type-check (mypy)"
    fi
    if "$PY" -c 'import pytest' >/dev/null 2>&1; then
      python_test_check || STATUS=1
    else
      absent "test (pytest)"
    fi
  fi

# ── Go ────────────────────────────────────────────────────────────────────────
elif [ -f go.mod ]; then
  if [ "$MODE" = "quick" ]; then
    run_check "type-check (go vet)" go vet ./... || STATUS=1
    not_applicable "test (full mode only)"
  else
    run_check "type-check (go vet)" go vet ./... || STATUS=1
    run_check "test (go test)" go test ./... || STATUS=1
  fi

# ── Rust ──────────────────────────────────────────────────────────────────────
elif [ -f Cargo.toml ]; then
  if [ "$MODE" = "quick" ]; then
    run_check "type-check (cargo check)" cargo check || STATUS=1
    not_applicable "test (full mode only)"
  else
    run_check "type-check (cargo check)" cargo check || STATUS=1
    run_check "test (cargo test)" cargo test || STATUS=1
  fi

# ── Maven / Gradle / .NET ─────────────────────────────────────────────────────
elif [ -f pom.xml ]; then
  if [ "$MODE" = "quick" ]; then
    run_check "type-check (mvn validate)" mvn validate || STATUS=1
    not_applicable "test (full mode only)"
  else
    run_check "type-check (mvn validate)" mvn validate || STATUS=1
    run_check "test (mvn test)" mvn test || STATUS=1
  fi
elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then
  if [ "$MODE" = "quick" ]; then
    run_check "type-check (gradle check)" ./gradlew check || STATUS=1
    not_applicable "test (full mode only)"
  else
    run_check "type-check (gradle check)" ./gradlew check || STATUS=1
    run_check "test (gradle test)" ./gradlew test || STATUS=1
  fi
elif ls ./*.csproj ./*.sln >/dev/null 2>&1; then
  if [ "$MODE" = "quick" ]; then
    run_check "type-check (dotnet build)" dotnet build || STATUS=1
    not_applicable "test (full mode only)"
  else
    run_check "type-check (dotnet build)" dotnet build || STATUS=1
    run_check "test (dotnet test)" dotnet test || STATUS=1
  fi
else
  not_applicable "project verification (unrecognized stack)"
  echo "⚠️  No recognized stack or configured checks; continuing."
fi

echo ""
echo "=== Done ==="

# Show the active feature using JSON parsing, not line-oriented text matching.
if [ -f feature_index.json ]; then
  if ! node - feature_index.json <<'NODE'
const fs = require('node:fs');
const index = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const active = (index.features || []).filter((feature) => feature.status === 'active');
if (active.length === 1) {
  console.log(`Active feat: ${active[0].id} — ${active[0].title}`);
} else {
  console.log('No active feat — check feature_index.json');
}
NODE
  then
    echo "⚠️  Could not parse feature_index.json."
    STATUS=1
  fi
fi

exit "$STATUS"
