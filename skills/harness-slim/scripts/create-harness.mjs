#!/usr/bin/env node
import { chmod, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  copyTemplate,
  detectPackageManager,
  detectProject,
  exists,
  parseArgs,
  verificationCommands,
  writeText
} from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/create-harness.mjs [--target DIR] [--package-manager npm|pnpm|yarn|bun] [--force]

Creates a minimal harness in target directory:
  AGENTS.md
  feature_index.json
  features/feat-001.md
  init.sh
  progress.md
  check-state.sh

Existing files are skipped unless --force is set.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const force = Boolean(args.force);
const project = await detectProject(target);
project.packageManager = detectPackageManager(target, args.packageManager);
const commands = args.commands
  ? String(args.commands).split(',').map((command) => command.trim()).filter(Boolean)
  : verificationCommands(project, args.packageManager);

await mkdir(target, { recursive: true });

const replacements = {
  PROJECT_PURPOSE: project.stack === 'generic'
    ? 'Project harness for reliable agent-assisted development.'
    : `Project harness for reliable agent-assisted development in a ${project.stack} codebase.`,
  VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n')
};

const results = [];

// Core files
results.push(await copyTemplate('agents.md', path.join(target, 'AGENTS.md'), replacements, { force }));
results.push(await copyTemplate('feature_index.json', path.join(target, 'feature_index.json'), {}, { force }));
results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));

// Feature detail directory + first placeholder
const featuresDir = path.join(target, 'features');
await mkdir(featuresDir, { recursive: true });
results.push(await copyTemplate('features/feat-001.md', path.join(featuresDir, 'feat-001.md'), {}, { force }));

// init.sh (template already has full 2-mode content — copy as-is)
const initPath = path.join(target, 'init.sh');
if (force || !await exists(initPath)) {
  const templatePath = new URL('../templates/init.sh', import.meta.url).pathname;
  const { readFile } = await import('node:fs/promises');
  const content = await readFile(templatePath, 'utf8');
  await writeText(initPath, content);
  await chmod(initPath, 0o755);
  results.push({ path: initPath, status: 'written' });
} else {
  results.push({ path: initPath, status: 'skipped', reason: 'exists' });
}

// check-state.sh
const checkStatePath = path.join(target, 'check-state.sh');
if (force || !await exists(checkStatePath)) {
  const templatePath = new URL('../scripts/check-state.sh', import.meta.url).pathname;
  const { readFile } = await import('node:fs/promises');
  const content = await readFile(templatePath, 'utf8');
  await writeText(checkStatePath, content);
  await chmod(checkStatePath, 0o755);
  results.push({ path: checkStatePath, status: 'written' });
} else {
  results.push({ path: checkStatePath, status: 'skipped', reason: 'exists' });
}

console.log(`Created harness for ${target}`);
console.log(`Detected stack: ${project.stack}`);
console.log('');
for (const result of results) {
  console.log(`${result.status.toUpperCase()} ${path.relative(target, result.path)}${result.reason ? ` (${result.reason})` : ''}`);
}
