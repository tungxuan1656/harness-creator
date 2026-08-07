#!/usr/bin/env node

import { readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { phases, synchronize } from "./sync-harness-phases.mjs";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const skillNames = [
  ...phases.map((phase) => `harness-${phase}`),
  "harness-router",
];
const requiredTags = [
  "trigger-positive",
  "trigger-negative",
  "workflow",
  "rerun",
  "dirty-worktree",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/g, "\n");
}

function isInside(root, candidate) {
  const candidateRelative = relative(root, candidate);
  return (
    candidateRelative !== ".." &&
    !candidateRelative.startsWith(`..${sep}`) &&
    !isAbsolute(candidateRelative)
  );
}

async function validateSkill(skillName) {
  const skillDirectory = resolve(repositoryRoot, "skills", skillName);
  const skillPath = resolve(skillDirectory, "SKILL.md");
  const source = normalizeNewlines(await readFile(skillPath, "utf8"));
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  assert(frontmatter, `${skillPath}: missing YAML frontmatter`);
  const frontmatterKeys = [
    ...frontmatter[1].matchAll(/^([A-Za-z][A-Za-z0-9_-]*):/gm),
  ].map((match) => match[1]);
  assert(
    frontmatterKeys.length === 2 &&
      frontmatterKeys.includes("name") &&
      frontmatterKeys.includes("description"),
    `${skillPath}: frontmatter may contain only name and description`,
  );
  assert(
    new RegExp(`^name:[ \\t]*${skillName}[ \\t]*$`, "m").test(
      frontmatter[1],
    ),
    `${skillPath}: frontmatter name must be ${skillName}`,
  );
  assert(
    /^description:[ \t]*(?:[>|][+-]?[ \t]*|[^ \t\r\n].*)$/m.test(
      frontmatter[1],
    ),
    `${skillPath}: description must not be empty`,
  );

  const agentPath = resolve(skillDirectory, "agents", "openai.yaml");
  const agentSource = normalizeNewlines(await readFile(agentPath, "utf8"));
  for (const field of ["display_name", "short_description", "default_prompt"]) {
    assert(
      new RegExp(`^[ \\t]{2}${field}:[ \\t]*.+$`, "m").test(agentSource),
      `${agentPath}: missing ${field}`,
    );
  }

  const evalPath = resolve(skillDirectory, "evals", "evals.json");
  const corpus = JSON.parse(await readFile(evalPath, "utf8"));
  const realSkillDirectory = await realpath(skillDirectory);
  assert(corpus.skill_name === skillName, `${evalPath}: skill_name mismatch`);
  assert(
    Array.isArray(corpus.evals) && corpus.evals.length >= 4,
    `${evalPath}: require at least four evals`,
  );

  const ids = new Set();
  const coveredTags = new Set();
  for (const evaluation of corpus.evals) {
    assert(
      Number.isInteger(evaluation.id),
      `${evalPath}: eval id must be an integer`,
    );
    assert(
      !ids.has(evaluation.id),
      `${evalPath}: duplicate eval id ${evaluation.id}`,
    );
    ids.add(evaluation.id);
    for (const field of ["name", "prompt", "expected_output"]) {
      assert(
        typeof evaluation[field] === "string" && evaluation[field].trim(),
        `${evalPath}: eval ${evaluation.id} missing ${field}`,
      );
    }
    assert(
      Array.isArray(evaluation.files),
      `${evalPath}: eval ${evaluation.id} files must be an array`,
    );
    assert(
      evaluation.files.every(
        (file) => typeof file === "string" && file.trim(),
      ),
      `${evalPath}: eval ${evaluation.id} files must be non-empty strings`,
    );
    for (const file of evaluation.files) {
      const fixturePath = resolve(skillDirectory, file);
      assert(
        isInside(skillDirectory, fixturePath),
        `${evalPath}: eval ${evaluation.id} file escapes the skill directory`,
      );
      const realFixturePath = await realpath(fixturePath);
      assert(
        isInside(realSkillDirectory, realFixturePath),
        `${evalPath}: eval ${evaluation.id} fixture symlink escapes the skill directory`,
      );
      await readFile(fixturePath, "utf8");
    }
    assert(
      Array.isArray(evaluation.expectations) &&
        evaluation.expectations.length > 0,
      `${evalPath}: eval ${evaluation.id} needs expectations`,
    );
    assert(
      evaluation.expectations.every(
        (expectation) => typeof expectation === "string" && expectation.trim(),
      ),
      `${evalPath}: eval ${evaluation.id} expectations must be non-empty strings`,
    );
    assert(
      Array.isArray(evaluation.tags),
      `${evalPath}: eval ${evaluation.id} tags must be an array`,
    );
    assert(
      evaluation.tags.every(
        (tag) => typeof tag === "string" && tag.trim(),
      ),
      `${evalPath}: eval ${evaluation.id} tags must be non-empty strings`,
    );
    if (evaluation.tags.includes("dirty-worktree")) {
      assert(
        evaluation.files.length > 0,
        `${evalPath}: dirty-worktree eval ${evaluation.id} needs a fixture`,
      );
    }
    evaluation.tags.forEach((tag) => coveredTags.add(tag));
  }

  assert(
    corpus.evals.some((evaluation) => evaluation.files.length > 0),
    `${evalPath}: require at least one attached repository fixture`,
  );

  for (const tag of requiredTags) {
    assert(
      coveredTags.has(tag),
      `${evalPath}: missing required coverage tag ${tag}`,
    );
  }

  process.stdout.write(`PASS ${skillName} packaging and eval corpus\n`);
}

async function main() {
  await synchronize({ check: true });
  for (const skillName of skillNames) {
    await validateSkill(skillName);
  }
  process.stdout.write("PASS hybrid skill deterministic preflight\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
