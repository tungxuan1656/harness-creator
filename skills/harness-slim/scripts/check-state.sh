#!/usr/bin/env bash
# check-state.sh — show and validate harness state from feature_index.json
# Usage: ./check-state.sh [path/to/feature_index.json]
# Requires only bash and Node.js 20+.
set -euo pipefail

INDEX="${1:-feature_index.json}"

[ -f "$INDEX" ] || { echo "ERROR $INDEX not found" >&2; exit 1; }

node - "$INDEX" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');

const indexPath = path.resolve(process.argv[2]);
const detailDir = path.join(path.dirname(indexPath), 'features');
const allowedStatuses = new Set(['todo', 'active', 'blocked', 'done']);
const featureIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];
let index;

if (path.basename(indexPath) !== 'feature_index.json') {
  console.error(`ERROR unsupported feature index filename: ${path.basename(indexPath)}; use feature_index.json`);
  process.exit(1);
}

try {
  index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`ERROR malformed feature index JSON: ${error.message}`);
  process.exit(1);
}

if (!index || typeof index !== 'object' || Array.isArray(index)) {
  errors.push('feature index must be a JSON object');
} else if (!Array.isArray(index.features) || index.features.length === 0) {
  errors.push('feature index.features must be a non-empty array');
}

const features = Array.isArray(index?.features) ? index.features : [];
const ids = new Set();
for (const [position, feature] of features.entries()) {
  const label = `features[${position}]`;
  if (!feature || typeof feature !== 'object' || Array.isArray(feature)) {
    errors.push(`${label} must be an object`);
    continue;
  }
  if (typeof feature.id !== 'string' || feature.id.trim() === '') {
    errors.push(`${label}.id must be a non-empty string`);
  } else if (!featureIdPattern.test(feature.id)) {
    errors.push(`${label}.id must contain only lowercase letters, numbers, and single hyphens (for example, feat-001)`);
  } else if (ids.has(feature.id)) {
    errors.push(`duplicate feature id: ${feature.id}`);
  } else {
    ids.add(feature.id);
  }
  if (typeof feature.title !== 'string' || feature.title.trim() === '') {
    errors.push(`${label}.title must be a non-empty string`);
  }
  if (!allowedStatuses.has(feature.status)) {
    errors.push(`${label}.status must be one of: todo, active, blocked, done`);
  }
  if (!Number.isInteger(feature.priority)) {
    errors.push(`${label}.priority must be an integer`);
  }
  if (!Array.isArray(feature.depends_on)) {
    errors.push(`${label}.depends_on must be an array`);
    continue;
  }
  const dependencies = new Set();
  for (const dependency of feature.depends_on) {
    if (typeof dependency !== 'string' || dependency.trim() === '') {
      errors.push(`${label}.depends_on must contain non-empty feature ids`);
    } else if (!featureIdPattern.test(dependency)) {
      errors.push(`${label}.depends_on contains unsafe feature id: ${dependency}`);
    } else if (dependency === feature.id) {
      errors.push(`${label}.depends_on cannot contain its own id`);
    } else if (dependencies.has(dependency)) {
      errors.push(`${label}.depends_on contains duplicate id: ${dependency}`);
    } else {
      dependencies.add(dependency);
    }
  }
}

for (const feature of features) {
  if (!feature || typeof feature !== 'object' || !Array.isArray(feature.depends_on)) continue;
  for (const dependency of feature.depends_on) {
    if (typeof dependency === 'string' && !ids.has(dependency)) {
      errors.push(`${feature.id || 'feature'} depends on missing feature: ${dependency}`);
    }
  }
}

const active = features.filter((feature) => feature?.status === 'active');
const blocked = features.filter((feature) => feature?.status === 'blocked');
const todo = features.filter((feature) => feature?.status === 'todo');
const done = features.filter((feature) => feature?.status === 'done');
if (active.length > 1) errors.push('feature index must have at most one active feature');
if (active.length === 0 && (todo.length > 0 || blocked.length > 0)) {
  errors.push('feature index must have exactly one active feature while todo or blocked work remains');
}
const featuresById = new Map(features.map((feature) => [feature?.id, feature]));
for (const feature of active) {
  const unmet = (feature.depends_on || [])
    .filter((dependency) => featuresById.get(dependency)?.status !== 'done');
  if (unmet.length) errors.push(`${feature.id} cannot be active until dependencies are done: ${unmet.join(', ')}`);
}
if (active.length === 1) {
  const detailRoot = path.resolve(detailDir);
  const detailPath = path.resolve(detailRoot, `${active[0].id}.md`);
  const relativeDetailPath = path.relative(detailRoot, detailPath);
  if (relativeDetailPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeDetailPath)) {
    errors.push(`active feature detail path must stay beneath features: ${detailPath}`);
  } else if (!fs.existsSync(detailPath)) {
    errors.push(`active feature detail missing: ${detailPath}`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

console.log('=== Harness State ===');
if (active.length) {
  console.log(`✅ Active : ${active[0].id} — ${active[0].title}`);
} else {
  console.log('⬜ No active feature');
}
if (blocked.length) {
  console.log('🔴 Blocked:');
  for (const feature of blocked) console.log(`  - ${feature.id}`);
} else {
  console.log('🔴 Blocked: none');
}
if (todo.length) {
  console.log('🔵 Todo:');
  for (const feature of todo.slice(0, 5)) console.log(`  - ${feature.id}`);
} else {
  console.log('🔵 Todo: none');
}
console.log(`📊 Progress: ${done.length}/${features.length} done`);
NODE
