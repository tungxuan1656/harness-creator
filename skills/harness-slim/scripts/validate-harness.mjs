#!/usr/bin/env node
import path from 'node:path';
import {
  formatScoreReport,
  htmlReport,
  loadHarnessFiles,
  parseArgs,
  scoreHarness,
  validateHarnessTarget,
  writeText
} from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/validate-harness.mjs [--target DIR] [--json] [--html FILE]

Scores a project harness across five subsystems:
  instructions, state, verification, scope, lifecycle

Exit code is 0 when the harness scores at least --min-score (default 70).`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const minScore = Number(args.minScore || 70);
const files = await loadHarnessFiles(target);
const result = scoreHarness(files);
const validation = await validateHarnessTarget(target);
result.validation = validation;

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, htmlReport(result, `Harness Assessment: ${path.basename(target)}`));
  console.log(`HTML report written to ${htmlPath}`);
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(formatScoreReport(result, target));
  console.log('State/file gates:');
  for (const failure of validation.hardFailures) console.log(`  FAIL ${failure}`);
  if (validation.hardFailures.length === 0) console.log('  PASS required state and file gates');
}

if (result.overall < minScore || validation.hardFailures.length > 0) {
  process.exitCode = 1;
}
