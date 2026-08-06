import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
  loadHarnessFiles,
  scoreHarness,
  validateFeatureIndex,
  validateFeatureIndexFile
} from '../scripts/lib/harness-utils.mjs';

const execFileAsync = promisify(execFile);
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const createScript = path.join(skillRoot, 'scripts', 'create-harness.mjs');
const checkState = path.join(skillRoot, 'scripts', 'check-state.sh');
const validateScript = path.join(skillRoot, 'scripts', 'validate-harness.mjs');
const renderScript = path.join(skillRoot, 'scripts', 'render-assessment-html.mjs');
const benchmarkScript = path.join(skillRoot, 'scripts', 'run-benchmark.mjs');
const agentsTemplate = path.join(skillRoot, 'templates', 'agents.md');

async function tempDir() {
  return mkdtemp(path.join(os.tmpdir(), 'harness-slim-p0-'));
}

async function writeIndex(root, index, { detail = true, relativeDir = '' } = {}) {
  const stateDir = path.join(root, relativeDir);
  await mkdir(path.join(stateDir, 'features'), { recursive: true });
  await writeFile(path.join(stateDir, 'feature_index.json'), JSON.stringify(index), 'utf8');
  if (detail) {
    const active = index.features?.find((feature) => feature.status === 'active');
    if (active) await writeFile(path.join(stateDir, 'features', `${active.id}.md`), '# detail\n', 'utf8');
  }
  return path.join(stateDir, 'feature_index.json');
}

function indexWith(features) {
  return { features };
}

async function writePythonStub(root) {
  const stub = `#!/usr/bin/env bash
if [ "\${1:-}" = "-c" ]; then
  case "\${2:-}" in
    *"import mypy"*) exit 1 ;;
    *"import ruff"*) [ "\${STATIC_CHECKER:-}" = "ruff" ] && exit 0 || exit 1 ;;
    *"import flake8"*) [ "\${STATIC_CHECKER:-}" = "flake8" ] && exit 0 || exit 1 ;;
    *"import pytest"*) exit 0 ;;
  esac
fi
if [ "\${1:-}" = "-m" ] && [ "\${2:-}" = "pytest" ]; then
  exit "\${PYTEST_EXIT:-0}"
fi
if [ "\${1:-}" = "-m" ] && [ "\${2:-}" = "ruff" ]; then
  exit "\${RUFF_EXIT:-0}"
fi
if [ "\${1:-}" = "-m" ] && [ "\${2:-}" = "flake8" ]; then
  exit "\${FLAKE8_EXIT:-0}"
fi
exit 0
`;
  const stubPath = path.join(root, 'python3');
  await writeFile(stubPath, stub, 'utf8');
  await chmod(stubPath, 0o755);
}

const feature = (id, status, depends_on = []) => ({
  id,
  title: id,
  status,
  priority: 1,
  depends_on
});

test('generator creates an idle bootstrap harness with the shell state checker and docs map', async () => {
  const root = await tempDir();
  try {
    await execFileAsync('node', [createScript, '--target', root]);
    const index = JSON.parse(await readFile(path.join(root, 'feature_index.json'), 'utf8'));
    assert.equal(index.features.find((item) => item.id === 'feat-001').status, 'todo');
    assert.ok(index.features.filter((item) => item.status === 'todo').some((item) => item.id === 'feat-002'));
    assert.equal(existsSync(path.join(root, 'scripts', 'check-state.sh')), true);
    assert.equal(existsSync(path.join(root, 'check-state.mjs')), false);
    assert.equal(existsSync(path.join(root, 'scripts', 'lib', 'harness-utils.mjs')), false);
    assert.equal(existsSync(path.join(root, 'docs', 'README.md')), true);
    assert.equal(existsSync(path.join(root, 'architecture.md')), false);
    const docsMap = await readFile(path.join(root, 'docs', 'README.md'), 'utf8');
    assert.match(docsMap, /This is a menu, not a required scaffold/);
    assert.match(docsMap, /Small or straightforward project/);
    assert.match(docsMap, /Large, regulated, or operationally critical project/);
    const generatedAgents = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
    assert.match(generatedAgents, /Detected stack: `generic`/);
    assert.doesNotMatch(generatedAgents, /\[language \+ version\]/);
    const state = await execFileAsync('bash', [path.join(root, 'scripts', 'check-state.sh'), 'feature_index.json'], { cwd: root });
    assert.match(state.stdout, /none \(idle\)/);
    assert.match(state.stdout, /Progress: 0\/2 done/);
    const init = await execFileAsync('bash', [path.join(root, 'init.sh')], { cwd: root });
    assert.match(init.stdout, /Active: none \(idle\)/);
    const generatedInit = await readFile(path.join(root, 'init.sh'), 'utf8');
    assert.doesNotMatch(generatedInit, /node -e|<<['"]?NODE|require\(/);
    const score = scoreHarness(await loadHarnessFiles(root));
    assert.ok(score.overall >= 90, `fresh harness score was ${score.overall}`);
    const validation = await execFileAsync('node', [validateScript, '--target', root]);
    assert.match(validation.stdout, /State\/file gates:\n  PASS/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('generator aborts on conflicts and --force overwrites the complete harness', async () => {
  const root = await tempDir();
  try {
    await mkdir(path.join(root, 'scripts'), { recursive: true });
    await writeFile(path.join(root, 'AGENTS.md'), 'old instructions\n', 'utf8');
    await writeFile(path.join(root, 'check-state.sh'), '#!/usr/bin/env bash\nexit 0\n', 'utf8');
    await writeFile(path.join(root, 'scripts', 'check-state.sh'), '#!/usr/bin/env bash\nexit 0\n', 'utf8');

    await assert.rejects(
      execFileAsync('node', [createScript, '--target', root]),
      (error) => /No files were changed.*--force/s.test(`${error.stdout}\n${error.stderr}`)
    );
    assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), 'old instructions\n');
    assert.equal(existsSync(path.join(root, 'feature_index.json')), false);

    await execFileAsync('node', [createScript, '--target', root, '--force']);
    assert.doesNotMatch(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), /old instructions/);
    assert.match(await readFile(path.join(root, 'scripts', 'check-state.sh'), 'utf8'), /command -v jq/);
    assert.equal(existsSync(path.join(root, 'check-state.sh')), false);
    assert.equal(existsSync(path.join(root, 'feature_index.json')), true);
    assert.equal(existsSync(path.join(root, 'docs', 'README.md')), true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('semantic validator rejects malformed JSON and schema', async () => {
  const root = await tempDir();
  try {
    const indexPath = path.join(root, 'feature_index.json');
    await writeFile(indexPath, '{not json', 'utf8');
    const malformed = await validateFeatureIndexFile(indexPath);
    assert.equal(malformed.valid, false);
    assert.match(malformed.errors[0], /malformed/);

    const schema = validateFeatureIndex({ features: [{ id: 'feat-001', status: 'wat' }] });
    assert.equal(schema.valid, false);
    assert.ok(schema.errors.some((error) => /title/.test(error)));
    assert.ok(schema.errors.some((error) => /status/.test(error)));
    assert.ok(schema.errors.some((error) => /priority/.test(error)));
    assert.ok(schema.errors.some((error) => /depends_on/.test(error)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('semantic validator enforces active and dependency invariants', async () => {
  const multiple = validateFeatureIndex(indexWith([feature('a', 'active'), feature('b', 'active')]));
  assert.equal(multiple.valid, false);
  assert.ok(multiple.errors.some((error) => /at most one active/.test(error)));

  const zeroWithWork = validateFeatureIndex(indexWith([feature('a', 'todo')]));
  assert.equal(zeroWithWork.valid, true);
  assert.deepEqual(zeroWithWork.errors, []);

  const duplicate = validateFeatureIndex(indexWith([feature('a', 'active'), feature('a', 'done')]));
  assert.equal(duplicate.valid, false);
  assert.ok(duplicate.errors.some((error) => /duplicate/.test(error)));

  const missingDependency = validateFeatureIndex(indexWith([feature('a', 'active', ['missing'])]));
  assert.equal(missingDependency.valid, false);
  assert.ok(missingDependency.errors.some((error) => /missing feature/.test(error)));

  const cycle = validateFeatureIndex(indexWith([
    feature('feat-a', 'todo', ['feat-b']),
    feature('feat-b', 'todo', ['feat-a'])
  ]));
  assert.equal(cycle.valid, false);
  assert.ok(cycle.errors.some((error) => /dependency cycle detected/.test(error)));
});

test('shell state checker rejects malformed, duplicate, and missing-dependency state', async () => {
  const root = await tempDir();
  try {
    const malformed = path.join(root, 'feature_index.json');
    await writeFile(malformed, '{bad json', 'utf8');
    await assert.rejects(
      execFileAsync('bash', [checkState, malformed]),
      (error) => /malformed feature_index\.json/.test(`${error.stdout}\n${error.stderr}`)
    );

    await writeFile(malformed, '{}{}', 'utf8');
    await assert.rejects(
      execFileAsync('bash', [checkState, malformed]),
      (error) => /must contain one JSON document/.test(`${error.stdout}\n${error.stderr}`)
    );

    const duplicate = await writeIndex(root, indexWith([
      feature('feat-001', 'active'),
      feature('feat-001', 'done')
    ]));
    await assert.rejects(
      execFileAsync('bash', [checkState, duplicate]),
      (error) => /duplicate feature id/.test(`${error.stdout}\n${error.stderr}`)
    );

    const missingDependency = await writeIndex(root, indexWith([
      feature('feat-001', 'active', ['feat-999'])
    ]));
    await assert.rejects(
      execFileAsync('bash', [checkState, missingDependency]),
      (error) => /missing dependency/.test(`${error.stdout}\n${error.stderr}`)
    );

    const cycle = await writeIndex(root, indexWith([
      feature('feat-a', 'todo', ['feat-b']),
      feature('feat-b', 'todo', ['feat-a'])
    ]));
    await assert.rejects(
      execFileAsync('bash', [checkState, cycle]),
      (error) => /dependency cycle detected/.test(`${error.stdout}\n${error.stderr}`)
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('init fails early with an accurate error when jq is unavailable', async () => {
  const root = await tempDir();
  try {
    await execFileAsync('node', [createScript, '--target', root]);
    await assert.rejects(
      execFileAsync('/bin/bash', [path.join(root, 'init.sh')], {
        cwd: root,
        env: { ...process.env, PATH: root }
      }),
      (error) => /FAIL jq is required/.test(`${error.stdout}\n${error.stderr}`)
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('active detail is required and index-relative paths are honored', async () => {
  const root = await tempDir();
  try {
    const missingDetail = await writeIndex(root, indexWith([feature('a', 'active')]), { detail: false });
    const invalid = await validateFeatureIndexFile(missingDetail);
    assert.equal(invalid.valid, false);
    assert.ok(invalid.errors.some((error) => /detail missing/.test(error)));
    await assert.rejects(
      execFileAsync('bash', [checkState, missingDetail]),
      (error) => /detail missing/.test(`${error.stdout}\n${error.stderr}`)
    );

    const nestedIndex = await writeIndex(root, indexWith([feature('nested', 'active')]), { relativeDir: 'state' });
    const checked = await execFileAsync('bash', [checkState, path.relative(root, nestedIndex)], { cwd: root });
    assert.match(checked.stdout, /Active: nested/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('configured full check failure is not masked', async () => {
  const root = await tempDir();
  try {
    await writeFile(path.join(root, 'package.json'), JSON.stringify({
      scripts: {
        check: 'node -e "process.exit(0)"',
        test: 'node -e "process.exit(1)"'
      }
    }), 'utf8');
    await execFileAsync('node', [createScript, '--target', root]);
    await assert.rejects(
      execFileAsync('bash', [path.join(root, 'init.sh'), 'full'], { cwd: root }),
      (error) => /FAIL test/.test(`${error.stdout}\n${error.stderr}`)
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('--commands are transported into init.sh and run in full mode', async () => {
  const root = await tempDir();
  try {
    const command = `node -e "require('node:fs').writeFileSync('configured-ran','yes'); process.exit(1)"`;
    await execFileAsync('node', [createScript, '--target', root, '--commands', command]);
    const generated = await readFile(path.join(root, 'init.sh'), 'utf8');
    assert.match(generated, /CONFIGURED_COMMANDS/);
    await assert.rejects(
      execFileAsync('bash', [path.join(root, 'init.sh'), 'full'], { cwd: root }),
      (error) => /configured command/.test(`${error.stdout}\n${error.stderr}`)
    );
    assert.equal(await readFile(path.join(root, 'configured-ran'), 'utf8'), 'yes');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Python full verification treats pytest 5 as absent but fails pytest 1', async () => {
  for (const pytestExit of ['5', '1']) {
    const root = await tempDir();
    try {
      await writeFile(path.join(root, 'pyproject.toml'), '[project]\nname = "stub"\n', 'utf8');
      await writePythonStub(root);
      await execFileAsync('node', [createScript, '--target', root]);
      const options = {
        cwd: root,
        env: { ...process.env, PATH: `${root}${path.delimiter}${process.env.PATH}`, PYTEST_EXIT: pytestExit }
      };
      if (pytestExit === '5') {
        const result = await execFileAsync('bash', [path.join(root, 'init.sh'), 'full'], options);
        assert.match(result.stdout, /ABSENT test \(pytest; no tests collected; exit 5\)/);
      } else {
        await assert.rejects(
          execFileAsync('bash', [path.join(root, 'init.sh'), 'full'], options),
          (error) => /FAIL test \(pytest; exit 1\)/.test(`${error.stdout}\n${error.stderr}`)
        );
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
});

test('Python quick verification runs and propagates ruff or flake8 failures', async () => {
  for (const checker of ['ruff', 'flake8']) {
    const root = await tempDir();
    try {
      await writeFile(path.join(root, 'pyproject.toml'), '[project]\nname = "stub"\n', 'utf8');
      await writePythonStub(root);
      await execFileAsync('node', [createScript, '--target', root]);
      await assert.rejects(
        execFileAsync('bash', [path.join(root, 'init.sh')], {
          cwd: root,
          env: {
            ...process.env,
            PATH: `${root}${path.delimiter}${process.env.PATH}`,
            STATIC_CHECKER: checker,
            [`${checker.toUpperCase()}_EXIT`]: '1'
          }
        }),
        (error) => new RegExp(`FAIL type-check \\(${checker}\\)`).test(`${error.stdout}\n${error.stderr}`)
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
});

test('unsafe feature IDs are rejected by the shared validator and check-state', async () => {
  const root = await tempDir();
  try {
    const indexPath = await writeIndex(root, indexWith([feature('../escape', 'active')]), { detail: false });
    const semantic = await validateFeatureIndexFile(indexPath);
    assert.equal(semantic.valid, false);
    assert.ok(semantic.errors.some((error) => /lowercase|unsafe|hyphens/.test(error)));
    await assert.rejects(
      execFileAsync('bash', [checkState, indexPath]),
      (error) => /invalid feature schema/.test(`${error.stdout}\n${error.stderr}`)
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('active dependency ordering is enforced in both state validators', async () => {
  const root = await tempDir();
  try {
    const invalidIndex = await writeIndex(root, indexWith([
      feature('feat-001', 'todo'),
      feature('feat-002', 'active', ['feat-001'])
    ]));
    const semantic = await validateFeatureIndexFile(invalidIndex);
    assert.equal(semantic.valid, false);
    assert.ok(semantic.errors.some((error) => /cannot be active until dependencies are done/.test(error)));
    await assert.rejects(
      execFileAsync('bash', [checkState, invalidIndex]),
      (error) => /active feature has unfinished dependencies/.test(`${error.stdout}\n${error.stderr}`)
    );

    const validIndex = await writeIndex(root, indexWith([
      feature('feat-001', 'active'),
      feature('feat-002', 'todo', ['feat-001'])
    ]));
    assert.equal((await validateFeatureIndexFile(validIndex)).valid, true);
    await execFileAsync('bash', [checkState, validIndex]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('legacy feature-list names are not discovered or accepted', async () => {
  const root = await tempDir();
  try {
    await mkdir(path.join(root, 'features'), { recursive: true });
    await writeFile(path.join(root, 'AGENTS.md'), '# AGENTS\n');
    await writeFile(path.join(root, 'progress.md'), '# Progress\n');
    await writeFile(path.join(root, 'init.sh'), '#!/usr/bin/env bash\n');
    const legacyPath = path.join(root, 'feature_list.json');
    await writeFile(legacyPath, JSON.stringify(indexWith([feature('feat-001', 'active')])), 'utf8');
    await writeFile(path.join(root, 'features', 'feat-001.md'), '# detail\n');
    assert.equal((await validateFeatureIndexFile(legacyPath)).valid, false);
    await assert.rejects(
      execFileAsync('node', [validateScript, '--target', root]),
      (error) => /unsupported|feature_index\.json is missing/.test(`${error.stdout}\n${error.stderr}`)
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('HTML and benchmark reports expose invalid hard gates and fail', async () => {
  const root = await tempDir();
  try {
    await mkdir(path.join(root, 'features'), { recursive: true });
    await writeFile(path.join(root, 'AGENTS.md'), '# AGENTS\n');
    await writeFile(path.join(root, 'progress.md'), '# Progress\n');
    await writeFile(path.join(root, 'init.sh'), '#!/usr/bin/env bash\n');
    const htmlPath = path.join(root, 'assessment.html');
    await assert.rejects(
      execFileAsync('node', [renderScript, '--target', root, '--output', htmlPath]),
      (error) => /INVALID|feature_index\.json is missing/.test(`${error.stdout}\n${error.stderr}`)
    );
    assert.match(await readFile(htmlPath, 'utf8'), /INVALID|hard state\/file gates failed/);

    const jsonPath = path.join(root, 'benchmark.json');
    const benchmarkHtmlPath = path.join(root, 'benchmark.html');
    await assert.rejects(
      execFileAsync('node', [benchmarkScript, '--target', root, '--no-self-check', '--output', jsonPath, '--html', benchmarkHtmlPath]),
      (error) => /INVALID|feature_index\.json is missing/.test(`${error.stdout}\n${error.stderr}`)
    );
    const report = JSON.parse(await readFile(jsonPath, 'utf8'));
    assert.ok(report.validation.hardFailures.length > 0);
    assert.match(await readFile(benchmarkHtmlPath, 'utf8'), /INVALID|hard state\/file gates failed/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('generated micro-change rules are bounded and evidence-driven', async () => {
  const agents = await readFile(agentsTemplate, 'utf8');
  assert.match(agents, /small maintenance change outside an active feature requires explicit user scope/);
  assert.match(agents, /Record its files, verification, evidence, and next state/);
  assert.match(agents, /when risk or intent is unclear, use a feature/);
  assert.match(agents, /Run proportional, applicable verification/);
});

test('generated instructions route project knowledge through the docs map', async () => {
  const agents = await readFile(agentsTemplate, 'utf8');
  assert.match(agents, /docs\/README\.md/);
  assert.match(agents, /concise map/);
  assert.match(agents, /do not force 80-character wrapping/);
});
