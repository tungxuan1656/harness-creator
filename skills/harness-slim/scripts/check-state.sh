#!/usr/bin/env bash
# check-state.sh — show harness state from feature_index.json
# Usage: ./check-state.sh [path/to/feature_index.json]
# No external dependencies (grep/sed only).
set -euo pipefail

INDEX="${1:-feature_index.json}"

[ -f "$INDEX" ] || { echo "❌ $INDEX not found"; exit 1; }

echo "=== Harness State ==="

# Active
active_id=$(grep -B1 '"active"' "$INDEX" | grep '"id"' | head -1 \
  | sed 's/.*"\([^"]*\)".*/\1/' || true)
active_title=$(grep -A4 '"active"' "$INDEX" | grep '"title"' | head -1 \
  | sed 's/.*"\([^"]*\)".*/\1/' || true)
if [ -n "$active_id" ]; then
  echo "✅ Active : $active_id — $active_title"
else
  echo "⬜ No active feature"
fi

# Blocked
blocked_ids=$(grep -B1 '"blocked"' "$INDEX" | grep '"id"' \
  | sed 's/.*"\([^"]*\)".*/\1/' || true)
if [ -n "$blocked_ids" ]; then
  echo "🔴 Blocked:"
  echo "$blocked_ids" | sed 's/^/  - /'
fi

# Todo (first 5)
todo_ids=$(grep -B1 '"todo"' "$INDEX" | grep '"id"' \
  | sed 's/.*"\([^"]*\)".*/\1/' | head -5 || true)
if [ -n "$todo_ids" ]; then
  echo "🔵 Todo:"
  echo "$todo_ids" | sed 's/^/  - /'
fi

# Summary
total=$(grep -c '"id"' "$INDEX" || true)
done_count=$(grep -c '"done"' "$INDEX" || true)
echo "📊 Progress: $done_count/$total done"

# Feature file check
if [ -n "$active_id" ] && [ ! -f "features/${active_id}.md" ]; then
  echo "⚠️  features/${active_id}.md missing — create it before starting"
fi
