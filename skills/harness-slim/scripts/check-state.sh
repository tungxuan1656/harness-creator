#!/usr/bin/env bash
set -euo pipefail

INDEX="${1:-feature_index.json}"

fail() {
  echo "ERROR $1" >&2
  exit 1
}

command -v jq >/dev/null 2>&1 || fail "jq is required"
[ -f "$INDEX" ] || fail "$INDEX not found"
[ "$(basename "$INDEX")" = "feature_index.json" ] || fail "use feature_index.json"

jq empty "$INDEX" >/dev/null 2>&1 || fail "malformed feature_index.json"
jq -e -s 'length == 1' "$INDEX" >/dev/null || fail "feature_index.json must contain one JSON document"
jq -e '
  type == "object" and
  (.features | type == "array" and length > 0) and
  all(.features[];
    type == "object" and
    (.id | type == "string" and test("^[a-z0-9]+(-[a-z0-9]+)*$")) and
    (.title | type == "string" and test("\\S")) and
    (.status as $status | ($status | type == "string") and (["todo", "active", "blocked", "done"] | index($status) != null)) and
    (.priority | type == "number" and floor == .) and
    (.depends_on | type == "array") and
    (. as $feature | all(.depends_on[];
      type == "string" and
      test("^[a-z0-9]+(-[a-z0-9]+)*$") and
      . != $feature.id
    )) and
    ((.depends_on | length) == (.depends_on | unique | length))
  )
' "$INDEX" >/dev/null || fail "invalid feature schema"

jq -e '([.features[].id] | length) == ([.features[].id] | unique | length)' "$INDEX" >/dev/null || fail "duplicate feature id"
jq -e '.features as $features | [$features[].id] as $ids | all($features[]; all(.depends_on[]; . as $id | $ids | index($id) != null))' "$INDEX" >/dev/null || fail "missing dependency"
jq -e '
  def acyclic:
    if length == 0 then true
    else
      . as $nodes
      | [$nodes[].id] as $ids
      | [$nodes[] | select(any(.depends_on[]; . as $id | $ids | index($id) != null))] as $remaining
      | if ($remaining | length) == ($nodes | length) then false else ($remaining | acyclic) end
    end;
  .features | acyclic
' "$INDEX" >/dev/null || fail "dependency cycle detected"
jq -e '[.features[] | select(.status == "active")] | length <= 1' "$INDEX" >/dev/null || fail "more than one active feature"
jq -e '.features as $features | all($features[] | select(.status == "active"); all(.depends_on[]; . as $id | any($features[]; .id == $id and .status == "done")))' "$INDEX" >/dev/null || fail "active feature has unfinished dependencies"

ROOT="$(cd "$(dirname "$INDEX")" && pwd)"
ACTIVE_ID="$(jq -r '.features[] | select(.status == "active") | .id' "$INDEX")"
if [ -n "$ACTIVE_ID" ] && [ ! -f "$ROOT/features/$ACTIVE_ID.md" ]; then
  fail "active feature detail missing: features/$ACTIVE_ID.md"
fi

echo "=== Harness State ==="
if [ -n "$ACTIVE_ID" ]; then
  jq -r '.features[] | select(.status == "active") | "Active: \(.id) — \(.title)"' "$INDEX"
else
  echo "Active: none (idle)"
fi

for status in blocked todo; do
  ids="$(jq -r --arg status "$status" '[.features[] | select(.status == $status) | .id] | if length == 0 then "none" else join(", ") end' "$INDEX")"
  case "$status" in
    blocked) label="Blocked" ;;
    todo) label="Todo" ;;
  esac
  printf '%s: %s\n' "$label" "$ids"
done

jq -r '(.features | length) as $total | ([.features[] | select(.status == "done")] | length) as $done | "Progress: \($done)/\($total) done"' "$INDEX"
