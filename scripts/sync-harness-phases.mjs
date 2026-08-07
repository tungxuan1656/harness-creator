#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(scriptPath), "..");

export const phases = ["map", "specs", "features", "verify", "garden"];

function normalizeNewlines(value) {
  return value.replace(/\r\n?/g, "\n");
}

function splitFrontmatter(source, sourcePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter: ${sourcePath}`);
  }

  return { frontmatter: match[1], body: match[2] };
}

function readFrontmatterName(frontmatter, sourcePath) {
  const match = frontmatter.match(/^name:\s*([^\s]+)\s*$/m);
  if (!match) {
    throw new Error(`Missing frontmatter name: ${sourcePath}`);
  }

  return match[1];
}

function fallbackTitle(phase) {
  return `${phase[0].toUpperCase()}${phase.slice(1)} Fallback Phase`;
}

function repositoryPath(path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

async function readOptional(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function renderFallback(phase) {
  if (!phases.includes(phase)) {
    throw new Error(`Unknown harness phase: ${phase}`);
  }

  const sourcePath = resolve(
    repositoryRoot,
    "skills",
    `harness-${phase}`,
    "SKILL.md",
  );
  const source = normalizeNewlines(await readFile(sourcePath, "utf8"));
  const { frontmatter, body } = splitFrontmatter(source, sourcePath);
  const expectedName = `harness-${phase}`;
  const actualName = readFrontmatterName(frontmatter, sourcePath);

  if (actualName !== expectedName) {
    throw new Error(
      `Expected ${sourcePath} to declare ${expectedName}, found ${actualName}`,
    );
  }

  const normalizedBody = body.replace(/^\n/, "");
  const bodyWithoutTitle = normalizedBody.replace(/^# [^\n]+\n+/, "");
  if (bodyWithoutTitle === normalizedBody) {
    throw new Error(`Missing top-level title: ${sourcePath}`);
  }

  const sourceLabel = repositoryPath(sourcePath);
  return `# ${fallbackTitle(phase)}

<!-- Generated from \`${sourceLabel}\` by
\`scripts/sync-harness-phases.mjs\`. Do not edit directly. -->

Use this reference only when \`${expectedName}\` cannot be composed. The phase
rules below are identical to the independently installable specialist. Keep the
phase isolated until its quality gates pass, then return control to the router.

${bodyWithoutTitle}`;
}

export function fallbackPath(phase) {
  return resolve(
    repositoryRoot,
    "skills",
    "harness-router",
    "references",
    `${phase}.md`,
  );
}

export async function synchronize({ check = false } = {}) {
  const drifted = [];

  for (const phase of phases) {
    const targetPath = fallbackPath(phase);
    const expected = await renderFallback(phase);
    const current = await readOptional(targetPath);

    if (current !== null && normalizeNewlines(current) === expected) {
      continue;
    }

    if (check) {
      drifted.push(repositoryPath(targetPath));
      continue;
    }

    await writeFile(targetPath, expected, "utf8");
    process.stdout.write(`SYNC ${repositoryPath(targetPath)}\n`);
  }

  if (drifted.length > 0) {
    throw new Error(
      `Router fallback drift detected:\n${drifted.map((path) => `- ${path}`).join("\n")}\nRun node scripts/sync-harness-phases.mjs`,
    );
  }

  if (check) {
    process.stdout.write("PASS router fallback references are synchronized\n");
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === scriptPath;
if (isMain) {
  const unknownArgs = process.argv.slice(2).filter((arg) => arg !== "--check");
  if (unknownArgs.length > 0) {
    process.stderr.write(
      `Usage: node scripts/sync-harness-phases.mjs [--check]\n`,
    );
    process.exitCode = 2;
  } else {
    synchronize({ check: process.argv.includes("--check") }).catch((error) => {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    });
  }
}
