#!/usr/bin/env node
// check-docs-freshness.mjs — pre-commit hook that prevents code-touches-doc
// drift at the source.
//
// vault-doctor detects drift AFTER it happens (next CI run). This script
// prevents the COMMIT that creates drift. For each staged code file, it
// finds which doc owns that file path via `docs/_meta/doc-ownership.yml`,
// then checks that the doc's frontmatter `last-reviewed` equals today —
// OR that the doc itself is staged in the same commit (you're editing it
// right now, presumably to reflect the code change).
//
// Usage:
//   node scripts/check-docs-freshness.mjs        # check this repo's staged files
//   node scripts/check-docs-freshness.mjs --help
//
// Install as a pre-commit hook:
//   See templates/ci/pre-commit-hook.example.
//
// Bypass (legitimate WIP commits):
//   git commit --no-verify
//
// Exit codes:
//   0 — nothing to check, or all affected docs are fresh
//   1 — at least one affected doc is stale (commit aborted)
//   2 — fatal error
//
// Zero runtime deps — composes match-docs's routing helpers.

import { promises as fs } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  loadOwnership,
  compileOwnership,
  matchPathToDocs,
  matchSqlToDocs,
} from './match-docs.mjs';

const HELP = `check-docs-freshness — prevent commits that touch code without updating the owning doc.

USAGE
  node scripts/check-docs-freshness.mjs
  node scripts/check-docs-freshness.mjs --help

EXIT CODES
  0   pass
  1   stale doc(s) — commit aborted
  2   fatal (ownership file missing, etc.)

BYPASS
  git commit --no-verify
`;

const CWD = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);

function getStagedFiles() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    cwd: CWD, encoding: 'utf8',
  });
  return out.split('\n').map(s => s.trim()).filter(Boolean);
}

// Mirrors vault-doctor's frontmatter-field reader but minimal — we only need
// one specific field from one specific file at a time.
async function readFrontmatterField(filePath, field) {
  let content;
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const block = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const line = block[1].match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'));
  return line ? line[1] : null;
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP);
    return 0;
  }

  const staged = getStagedFiles();
  if (staged.length === 0) return 0;

  let ownership;
  try {
    ({ ownership } = await loadOwnership());
  } catch (err) {
    console.error(`check-docs-freshness: ${err.message}`);
    console.error('Skipping freshness check — pre-commit hook is a no-op until ownership is set up.');
    return 0; // don't block commits in a half-bootstrapped project
  }
  const compiled = compileOwnership(ownership);
  const sqlRoutingEnabled = compiled.some(c => c.dbObjects.length > 0);

  const stagedSet = new Set(staged);
  const affectedDocs = new Set();

  for (const file of staged) {
    for (const doc of matchPathToDocs(file, compiled)) {
      affectedDocs.add(doc);
    }
    // SQL routing: if this staged file is a .sql file and SQL routing is
    // enabled, parse it and add docs whose db_objects match.
    if (sqlRoutingEnabled && file.endsWith('.sql')) {
      let sql;
      try {
        sql = await fs.readFile(path.join(CWD, file), 'utf8');
      } catch {
        continue; // deleted or unreadable — skip
      }
      for (const doc of matchSqlToDocs(sql, compiled).keys()) {
        affectedDocs.add(doc);
      }
    }
  }

  if (affectedDocs.size === 0) return 0;

  const stale = [];
  for (const doc of affectedDocs) {
    const docPath = `docs/${doc}.md`;
    // If the doc itself is in the staged set, the author is editing it now;
    // skip the date check — they can bump last-reviewed in this commit.
    if (stagedSet.has(docPath)) continue;
    const lastReviewed = await readFrontmatterField(path.join(CWD, docPath), 'last-reviewed');
    if (lastReviewed !== TODAY) {
      stale.push({ doc, docPath, lastReviewed });
    }
  }

  if (stale.length === 0) return 0;

  console.error('');
  console.error('check-docs-freshness: commit blocked.');
  console.error('');
  console.error(`The following doc(s) own code paths in this commit but their`);
  console.error(`last-reviewed date is not today (${TODAY}):`);
  console.error('');
  for (const { docPath, lastReviewed } of stale) {
    console.error(`  - ${docPath} — last-reviewed: ${lastReviewed ?? '(none)'}`);
  }
  console.error('');
  console.error('Either:');
  console.error('  1. Update each doc to reflect the code change, then bump');
  console.error(`     its frontmatter \`last-reviewed: ${TODAY}\`, then re-stage.`);
  console.error('  2. If the change genuinely doesn\'t affect the doc, bump');
  console.error(`     last-reviewed: ${TODAY} on the doc anyway (you\'ve now`);
  console.error('     verified it\'s still accurate post-change).');
  console.error('  3. Legitimate WIP commit: `git commit --no-verify`.');
  console.error('');
  return 1;
}

const invokedDirectly = (() => {
  try { return fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || ''); }
  catch { return false; }
})();
if (invokedDirectly) {
  main().then(code => process.exit(code)).catch(err => {
    console.error(`check-docs-freshness failed: ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(2);
  });
}

// Test-only exports.
export { readFrontmatterField, main as runCheckDocsFreshness };
