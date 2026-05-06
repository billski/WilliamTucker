# Agent Guardrails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop credibility-sweep commits by adding a build-gated claim linter, a short root `CLAUDE.md`, and a backlog file. Implements `docs/superpowers/specs/2026-05-06-wts-agent-guardrails-design.md`.

**Architecture:** A pure-Node ESM script (`scripts/check-claims.mjs`) scans HTML/JS/MD files for forbidden phrase patterns (line-scoped and proximity-scoped) and exits non-zero on violations. It runs first inside `npm run build`, so a Railway deploy cannot ship a sweep regression. `CLAUDE.md` orients fresh agents and surfaces the linter; `docs/_backlog.md` is an uncertainty escape valve.

**Tech Stack:** Node 20+ ESM, built-in `node:test` runner, built-in `node:fs/promises`, no new dependencies.

---

## File structure

```
WTS/
├── CLAUDE.md                                    [Task 10]
├── docs/
│   └── _backlog.md                              [Task 9]
├── scripts/
│   └── check-claims.mjs                         [Tasks 1-6]
├── tests/
│   └── check-claims.test.mjs                    [Tasks 1-6]
└── package.json                                 [Task 7]
```

`scripts/check-claims.mjs` exports the pure functions so `tests/check-claims.test.mjs` can import them. CLI behavior runs only when the file is invoked directly.

Branch: `feat/agent-guardrails` (already created; spec already committed there).

---

### Task 1: Bootstrap test infra and pattern catalog skeleton

**Files:**
- Create: `D:\code\WTS\scripts\check-claims.mjs`
- Create: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Create the script skeleton**

Write `scripts/check-claims.mjs`:

```js
// Claim linter for WTS. Scans copy for forbidden phrase patterns drawn
// from PROFILE.md framing rules and prior credibility-sweep commits.
// See docs/superpowers/specs/2026-05-06-wts-agent-guardrails-design.md.

export const PATTERNS = [
  {
    id: 'years-inflated',
    type: 'line',
    rule: /\b1[3-9]\+?\s*years?\b/i,
    reason: 'PROFILE.md §10: 12+ years (since 2013). Use "12+" or rephrase.',
  },
  {
    id: 'name-bill',
    type: 'line',
    rule: /\bBill\b/,
    reason: 'Workspace CLAUDE.md: address the user as "Will" or "William," never "Bill."',
  },
  {
    id: 'ai-replaced',
    type: 'line',
    rule: /\bAI[\s-]*(replaces?|replaced)\b/i,
    reason: 'PROFILE.md §10: AI-accelerated, never AI-replaced.',
  },
  {
    id: 'ai-automation',
    type: 'line',
    rule: /\bAI[\s-]*automation\b/i,
    reason: 'PROFILE.md §10: augmented senior engineering, not automation.',
  },
  {
    id: 'legacy-certs',
    type: 'line',
    rule: /\b(HackerRank|TestDome)\b/i,
    reason: 'Removed in commit 52a7255; do not reintroduce.',
  },
  {
    id: 'room-booking-prod',
    type: 'proximity',
    primary: /room\s*booking/i,
    near: /\b(in\s+production|production[-\s]?ready|live\s+in\s+production)\b/i,
    window: 240,
    reason: 'PROFILE.md §10: Room Booking is in QA awaiting institutional go-live.',
  },
  {
    id: 'bis-compressed',
    type: 'proximity',
    primary: /\b(BIS|Facilities Information System|Facilities Info)\b/i,
    near: /\b[12]\s*days?\b/i,
    window: 240,
    reason: 'PROFILE.md §10: BIS was ~7 weeks (66 commits, 14 branches). Do not compress to "2 days".',
  },
  {
    id: 'mysql-prod',
    type: 'proximity',
    primary: /\bMySQL\b/i,
    near: /\bproduction\b/i,
    window: 160,
    reason: 'PROFILE.md §10: no production MySQL experience.',
  },
  {
    id: 'aws-prod',
    type: 'proximity',
    primary: /\bAWS\b/,
    near: /\bproduction\b/i,
    window: 160,
    reason: 'PROFILE.md §10: no AWS experience.',
  },
  {
    id: 'salesforce-prod',
    type: 'proximity',
    primary: /\bSalesforce\b/i,
    near: /\bproduction\b/i,
    window: 160,
    reason: 'PROFILE.md §10: no Salesforce experience.',
  },
];
```

- [ ] **Step 2: Create the test file with a smoke test**

Write `tests/check-claims.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PATTERNS } from '../scripts/check-claims.mjs';

test('PATTERNS catalog is non-empty and well-formed', () => {
  assert.ok(Array.isArray(PATTERNS));
  assert.ok(PATTERNS.length >= 10);
  for (const p of PATTERNS) {
    assert.ok(typeof p.id === 'string' && p.id.length > 0, `pattern missing id`);
    assert.ok(p.type === 'line' || p.type === 'proximity', `pattern ${p.id} bad type`);
    assert.ok(typeof p.reason === 'string' && p.reason.length > 0, `pattern ${p.id} missing reason`);
  }
});
```

- [ ] **Step 3: Run the test to confirm it passes**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 1 test passing, exit 0.

- [ ] **Step 4: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): scaffold check-claims pattern catalog"
```

---

### Task 2: Line-pattern matcher

**Files:**
- Modify: `D:\code\WTS\scripts\check-claims.mjs`
- Modify: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Write failing tests for `checkLine`**

Append to `tests/check-claims.test.mjs`:

```js
import { checkLine } from '../scripts/check-claims.mjs';

const yearsPattern = PATTERNS.find(p => p.id === 'years-inflated');
const billPattern = PATTERNS.find(p => p.id === 'name-bill');

test('checkLine returns null when line is clean', () => {
  assert.equal(checkLine('William has 12+ years of experience', 1, yearsPattern), null);
});

test('checkLine flags inflated years claim', () => {
  const v = checkLine('William has 15+ years of experience', 7, yearsPattern);
  assert.ok(v, 'expected violation');
  assert.equal(v.lineNum, 7);
  assert.equal(v.patternId, 'years-inflated');
  assert.match(v.matched, /15\+\s*years/i);
});

test('checkLine is case-sensitive when the regex is', () => {
  // billski (github username) must NOT trigger; "Bill" as a standalone word must.
  assert.equal(checkLine('see github.com/billski', 1, billPattern), null);
  assert.ok(checkLine('Hi Bill, thanks for reaching out', 1, billPattern));
});

test('checkLine ignores proximity-type patterns', () => {
  const proxPattern = PATTERNS.find(p => p.type === 'proximity');
  assert.equal(checkLine('any text', 1, proxPattern), null);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 4 failures with "checkLine is not exported" or similar.

- [ ] **Step 3: Implement `checkLine`**

Append to `scripts/check-claims.mjs`:

```js
/**
 * Check a single line against a single line-type pattern.
 * Returns a violation object or null.
 */
export function checkLine(line, lineNum, pattern) {
  if (pattern.type !== 'line') return null;
  const m = line.match(pattern.rule);
  if (!m) return null;
  return {
    patternId: pattern.id,
    type: 'line',
    lineNum,
    lineEnd: lineNum,
    matched: m[0],
    reason: pattern.reason,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 5 tests passing (1 smoke + 4 new), exit 0.

- [ ] **Step 5: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): add line-pattern matcher"
```

---

### Task 3: Proximity-pattern matcher

**Files:**
- Modify: `D:\code\WTS\scripts\check-claims.mjs`
- Modify: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Write failing tests for `checkProximity`**

Append to `tests/check-claims.test.mjs`:

```js
import { checkProximity } from '../scripts/check-claims.mjs';

const roomProd = PATTERNS.find(p => p.id === 'room-booking-prod');
const bisDays = PATTERNS.find(p => p.id === 'bis-compressed');

test('checkProximity returns empty when neither pattern present', () => {
  const violations = checkProximity('all clean here', roomProd);
  assert.deepEqual(violations, []);
});

test('checkProximity returns empty when only one of the two matches', () => {
  assert.deepEqual(checkProximity('Room Booking is in QA', roomProd), []);
  assert.deepEqual(checkProximity('this is in production', roomProd), []);
});

test('checkProximity flags both patterns within window', () => {
  const text = 'Our Room Booking system is now in production.';
  const violations = checkProximity(text, roomProd);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].patternId, 'room-booking-prod');
  assert.equal(violations[0].lineNum, 1);
});

test('checkProximity ignores matches separated by more than the window', () => {
  // Build a string where the two phrases are 500+ chars apart, exceeding window=240.
  const text = 'Room Booking system\n' + 'x'.repeat(500) + '\nin production';
  const violations = checkProximity(text, roomProd);
  assert.deepEqual(violations, []);
});

test('checkProximity reports the line number of the primary match', () => {
  const text = 'line one\nline two\nthe BIS rebuild took 2 days\nline four';
  const violations = checkProximity(text, bisDays);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].lineNum, 3);
});

test('checkProximity ignores line-type patterns', () => {
  const linePattern = PATTERNS.find(p => p.type === 'line');
  assert.deepEqual(checkProximity('any text', linePattern), []);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 6 failures with "checkProximity is not a function".

- [ ] **Step 3: Implement `checkProximity`**

Append to `scripts/check-claims.mjs`:

```js
/**
 * Check whole-file content against a single proximity-type pattern.
 * Returns an array of violations (zero or more — proximity patterns can match more than once).
 */
export function checkProximity(content, pattern) {
  if (pattern.type !== 'proximity') return [];
  const violations = [];
  const lineOffsets = computeLineOffsets(content);

  // Use the global flag clones so we can iterate matches.
  const primaryRe = new RegExp(pattern.primary.source, pattern.primary.flags.includes('g') ? pattern.primary.flags : pattern.primary.flags + 'g');
  const nearRe = new RegExp(pattern.near.source, pattern.near.flags.includes('g') ? pattern.near.flags : pattern.near.flags + 'g');

  // Collect every primary match position.
  const primaryHits = [];
  let m;
  while ((m = primaryRe.exec(content)) !== null) {
    primaryHits.push({ index: m.index, length: m[0].length, text: m[0] });
    if (m.index === primaryRe.lastIndex) primaryRe.lastIndex++; // safety for zero-width
  }

  if (primaryHits.length === 0) return [];

  // Collect near-pattern hits.
  const nearHits = [];
  while ((m = nearRe.exec(content)) !== null) {
    nearHits.push({ index: m.index, length: m[0].length, text: m[0] });
    if (m.index === nearRe.lastIndex) nearRe.lastIndex++;
  }

  if (nearHits.length === 0) return [];

  // For each primary hit, see whether any near hit lies within the window.
  for (const p of primaryHits) {
    const found = nearHits.find((n) => {
      const distance =
        n.index >= p.index
          ? n.index - (p.index + p.length)
          : p.index - (n.index + n.length);
      return distance <= pattern.window;
    });
    if (found) {
      const lineNum = offsetToLine(p.index, lineOffsets);
      violations.push({
        patternId: pattern.id,
        type: 'proximity',
        lineNum,
        lineEnd: offsetToLine(found.index, lineOffsets),
        matched: `"${p.text}" + "${found.text}" within ${pattern.window} chars`,
        reason: pattern.reason,
      });
    }
  }
  return violations;
}

function computeLineOffsets(content) {
  const offsets = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') offsets.push(i + 1);
  }
  return offsets;
}

function offsetToLine(offset, offsets) {
  // Binary search for the largest offset <= target.
  let lo = 0;
  let hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (offsets[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 11 tests passing, exit 0.

- [ ] **Step 5: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): add proximity-pattern matcher"
```

---

### Task 4: Suppression parser

**Files:**
- Modify: `D:\code\WTS\scripts\check-claims.mjs`
- Modify: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Write failing tests for `extractSuppression`**

Append to `tests/check-claims.test.mjs`:

```js
import { extractSuppression } from '../scripts/check-claims.mjs';

test('extractSuppression returns null for plain line', () => {
  assert.equal(extractSuppression('plain text with no comment'), null);
});

test('extractSuppression accepts an HTML comment with sufficient reason', () => {
  const r = extractSuppression('quoted phrase here <!-- check-claims-allow: anti-example in DESIGN.md -->');
  assert.ok(r, 'expected suppression');
  assert.equal(r.reason, 'anti-example in DESIGN.md');
});

test('extractSuppression accepts a JS-style comment with sufficient reason', () => {
  const r = extractSuppression(`const x = "value"; // check-claims-allow: testing only path`);
  assert.ok(r);
  assert.equal(r.reason, 'testing only path');
});

test('extractSuppression rejects reason shorter than 10 chars', () => {
  assert.equal(extractSuppression('text <!-- check-claims-allow: short -->'), null);
  assert.equal(extractSuppression('text // check-claims-allow: nope'), null);
});

test('extractSuppression rejects empty reason', () => {
  assert.equal(extractSuppression('text <!-- check-claims-allow: -->'), null);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 5 failures with "extractSuppression is not a function".

- [ ] **Step 3: Implement `extractSuppression`**

Append to `scripts/check-claims.mjs`:

```js
const SUPPRESS_RE = /(?:<!--|\/\/)\s*check-claims-allow:\s*([^->\n]+?)\s*(?:-->|$)/;
const MIN_REASON_LEN = 10;

/**
 * Parse a single line for a check-claims suppression directive.
 * Returns { reason } or null. Reason text < 10 chars is rejected.
 */
export function extractSuppression(line) {
  const m = line.match(SUPPRESS_RE);
  if (!m) return null;
  const reason = m[1].trim();
  if (reason.length < MIN_REASON_LEN) return null;
  return { reason };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 16 tests passing, exit 0.

- [ ] **Step 5: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): add suppression-comment parser"
```

---

### Task 5: File scope walker

**Files:**
- Modify: `D:\code\WTS\scripts\check-claims.mjs`
- Modify: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Write failing tests for `findFiles`**

Append to `tests/check-claims.test.mjs`:

```js
import { findFiles } from '../scripts/check-claims.mjs';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('findFiles returns expected files and skips excluded dirs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'check-claims-'));
  try {
    await writeFile(join(root, 'index.html'), '<p>x</p>');
    await writeFile(join(root, 'about.html'), '<p>y</p>');
    await writeFile(join(root, 'server.js'), 'export {};');
    await writeFile(join(root, 'PRODUCT.md'), '# x');
    await mkdir(join(root, 'prompts'));
    await writeFile(join(root, 'prompts', 'foo.md'), 'x');
    await mkdir(join(root, 'node_modules', 'pkg'), { recursive: true });
    await writeFile(join(root, 'node_modules', 'pkg', 'index.js'), 'x');
    await mkdir(join(root, 'css'));
    await writeFile(join(root, 'css', 'styles.css'), 'x');
    await mkdir(join(root, 'docs', 'superpowers', 'specs'), { recursive: true });
    await writeFile(join(root, 'docs', 'superpowers', 'specs', 'spec.md'), 'x');

    const files = (await findFiles(root)).map(f => f.replace(root, '').replace(/\\/g, '/').replace(/^\//, ''));
    files.sort();

    assert.deepEqual(files, [
      'PRODUCT.md',
      'about.html',
      'index.html',
      'prompts/foo.md',
      'server.js',
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 1 failure ("findFiles is not a function").

- [ ] **Step 3: Implement `findFiles`**

Append to `scripts/check-claims.mjs`:

```js
import { readdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.claude', '.agents', '.superpowers',
  '.worktrees', 'css', 'js', 'img', 'dist', '.next',
]);

const SKIP_PATH_FRAGMENTS = ['docs/superpowers/']; // forward-slash form; matched after normalization

const SCAN_TOP_LEVEL_FILES = (name) =>
  name === 'server.js' ||
  name === 'PRODUCT.md' ||
  (name.endsWith('.html') && !name.startsWith('_'));

const SCAN_NESTED_FILES = (relDir, name) =>
  relDir === 'prompts' && extname(name) === '.md';

/**
 * Walk the project root and return absolute file paths to scan.
 * Uses the scope rules from the design spec §7.1.
 */
export async function findFiles(rootDir) {
  const out = [];
  await walk(rootDir, '', out);
  return out;

  async function walk(absDir, relDir, results) {
    const entries = await readdir(absDir, { withFileTypes: true });
    for (const entry of entries) {
      const absPath = join(absDir, entry.name);
      const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (SKIP_PATH_FRAGMENTS.some(frag => `${relPath}/`.startsWith(frag))) continue;
        await walk(absPath, relPath, results);
        continue;
      }

      if (!entry.isFile()) continue;

      // Top-level file inclusion.
      if (relDir === '' && SCAN_TOP_LEVEL_FILES(entry.name)) {
        results.push(absPath);
        continue;
      }

      if (SCAN_NESTED_FILES(relDir, entry.name)) {
        results.push(absPath);
      }
    }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 17 tests passing, exit 0.

- [ ] **Step 5: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): add file-scope walker"
```

---

### Task 6: Orchestrator, output formatter, CLI entry

**Files:**
- Modify: `D:\code\WTS\scripts\check-claims.mjs`
- Modify: `D:\code\WTS\tests\check-claims.test.mjs`

- [ ] **Step 1: Write failing tests for `scanContent` and `formatViolations`**

Append to `tests/check-claims.test.mjs`:

```js
import { scanContent, formatViolations } from '../scripts/check-claims.mjs';

test('scanContent returns no violations for clean text', () => {
  const v = scanContent('William has 12+ years of experience.\nBIS was 7 weeks of work.');
  assert.deepEqual(v, []);
});

test('scanContent flags both line and proximity violations', () => {
  const text = 'William has 15+ years.\nThe Room Booking system is in production.';
  const v = scanContent(text);
  const ids = v.map(x => x.patternId).sort();
  assert.deepEqual(ids, ['room-booking-prod', 'years-inflated']);
});

test('scanContent suppresses violations on lines with allow-comment', () => {
  const text = 'antipattern: 15+ years <!-- check-claims-allow: quoting an anti-example in spec -->';
  assert.deepEqual(scanContent(text), []);
});

test('scanContent suppresses proximity violation when allow-comment is on the primary line', () => {
  const text = 'Room Booking is in production <!-- check-claims-allow: quoting forbidden phrase as example -->';
  assert.deepEqual(scanContent(text), []);
});

test('formatViolations renders a clean summary when no violations', () => {
  const out = formatViolations([], { fileCount: 14 });
  assert.match(out, /scanned 14 files/);
  assert.match(out, /0 violations/);
});

test('formatViolations renders file:line and reason for each violation', () => {
  const violations = [
    { file: 'case-studies.html', patternId: 'years-inflated', lineNum: 42, lineEnd: 42, matched: '15+ years', reason: 'PROFILE.md §10' },
  ];
  const out = formatViolations(violations, { fileCount: 14 });
  assert.match(out, /case-studies\.html:42/);
  assert.match(out, /years-inflated/);
  assert.match(out, /PROFILE\.md §10/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 6 failures with "scanContent is not a function" / "formatViolations is not a function".

- [ ] **Step 3: Implement orchestrator and formatter**

Append to `scripts/check-claims.mjs`:

```js
import { readFile } from 'node:fs/promises';

/**
 * Scan a single piece of text content against the full PATTERNS catalog,
 * applying suppression directives. Returns array of violations (no `file` field).
 */
export function scanContent(content, patterns = PATTERNS) {
  const lines = content.split(/\r?\n/);
  const violations = [];

  // Line-type passes.
  for (const pattern of patterns) {
    if (pattern.type !== 'line') continue;
    for (let i = 0; i < lines.length; i++) {
      const v = checkLine(lines[i], i + 1, pattern);
      if (!v) continue;
      if (extractSuppression(lines[i])) continue;
      violations.push(v);
    }
  }

  // Proximity-type passes.
  for (const pattern of patterns) {
    if (pattern.type !== 'proximity') continue;
    const proxHits = checkProximity(content, pattern);
    for (const v of proxHits) {
      const primaryLine = lines[v.lineNum - 1] ?? '';
      if (extractSuppression(primaryLine)) continue;
      violations.push(v);
    }
  }
  return violations;
}

/**
 * Render the violation report. Always returns a single trailing-newline string.
 */
export function formatViolations(violations, { fileCount }) {
  if (violations.length === 0) {
    return `check-claims: scanned ${fileCount} files, 0 violations.\n`;
  }

  const lines = [`check-claims: ${violations.length} violations found.`, ''];
  for (const v of violations) {
    const range = v.lineNum === v.lineEnd ? `${v.lineNum}` : `${v.lineNum}-${v.lineEnd}`;
    lines.push(`  ${v.file}:${range}  [${v.patternId}]`);
    lines.push(`    matched: ${v.matched}`);
    lines.push(`    reason : ${v.reason}`);
    lines.push('');
  }
  lines.push(
    'To suppress a known-good case, add a check-claims-allow comment on the',
    'offending line with a >=10-char reason. Do not weaken patterns to make',
    'violations disappear; add suppressions or fix the copy.',
  );
  return lines.join('\n') + '\n';
}

/**
 * Top-level orchestrator. Reads every in-scope file from rootDir, scans, returns
 * { violations, fileCount }. Pure-ish — does I/O but no console / process work.
 */
export async function runCheck(rootDir) {
  const files = await findFiles(rootDir);
  const violations = [];
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const fileViolations = scanContent(content);
    for (const v of fileViolations) violations.push({ ...v, file: relPath(rootDir, file) });
  }
  return { violations, fileCount: files.length };
}

function relPath(rootDir, absPath) {
  const r = absPath.startsWith(rootDir) ? absPath.slice(rootDir.length) : absPath;
  return r.replace(/^[\\/]/, '').replace(/\\/g, '/');
}

// CLI entry — only when invoked directly, not when imported by tests.
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const isDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  const root = process.cwd();
  const { violations, fileCount } = await runCheck(root);
  process.stdout.write(formatViolations(violations, { fileCount }));
  process.exit(violations.length === 0 ? 0 : 1);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:/code/WTS && node --test tests/check-claims.test.mjs`
Expected: 23 tests passing, exit 0.

- [ ] **Step 5: Run the CLI end-to-end against the live codebase**

Run: `cd D:/code/WTS && node scripts/check-claims.mjs`
Expected: either "0 violations" OR a list of real violations (which Task 8 will fix). Either is fine here — we are just confirming the CLI works.

- [ ] **Step 6: Commit**

```bash
git -C D:/code/WTS add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/WTS commit -m "feat(linter): add scan orchestrator, output formatter, CLI entry"
```

---

### Task 7: Wire linter into `package.json`

**Files:**
- Modify: `D:\code\WTS\package.json`

- [ ] **Step 1: Inspect current `package.json`**

Run: `cat D:/code/WTS/package.json` (or `Get-Content`).
Note: the file currently contains a duplicate `scripts` block (one with build/watch only, one with build/watch/start). The duplicate is harmless because the second overrides the first, but the edit below removes it.

- [ ] **Step 2: Replace the file with the consolidated version**

Write `package.json` (full contents):

```json
{
  "name": "williamtucker-website",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check:claims": "node scripts/check-claims.mjs",
    "test:claims": "node --test tests/check-claims.test.mjs",
    "build": "npm run check:claims && npx @tailwindcss/cli -i src/input.css -o css/styles.css --minify",
    "watch": "npx @tailwindcss/cli -i src/input.css -o css/styles.css --watch",
    "start": "node server.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@tailwindcss/cli": "^4.2.2",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "tailwindcss": "^4.2.2"
  }
}
```

- [ ] **Step 3: Verify `npm run test:claims` runs**

Run: `cd D:/code/WTS && npm run test:claims`
Expected: 23 tests pass, exit 0.

- [ ] **Step 4: Verify `npm run check:claims` runs**

Run: `cd D:/code/WTS && npm run check:claims`
Expected: either clean ("0 violations") or real violations (handled in Task 8).

- [ ] **Step 5: Commit**

```bash
git -C D:/code/WTS add package.json
git -C D:/code/WTS commit -m "build: wire check-claims into npm build pipeline"
```

---

### Task 8: Run linter against live codebase, fix or suppress violations

**Goal:** reach a clean `npm run check:claims` state on the current `master` content. This task does not modify the linter; it only edits site copy or adds suppressions.

**Files (depends on what the linter reports):**
- Likely modify one or more of: `index.html`, `about.html`, `services.html`, `case-studies.html`, `faq.html`, `pricing.html`, `contact.html`, `small-business.html`, `privacy.html`, `checklist.html`, `server.js`, `PRODUCT.md`.

- [ ] **Step 1: Run the linter and capture output**

Run: `cd D:/code/WTS && npm run check:claims`
Expected: a list of violations (or 0 violations — if 0, skip to Step 4).

- [ ] **Step 2: For each violation, decide fix vs suppress**

Decision rules (apply in order):

1. **If the matched text is wrong relative to PROFILE.md** → fix the copy. Examples: "15+ years" → "12+ years", "BIS in 2 days" → "BIS over 7 weeks".
2. **If the matched text is a legitimate quotation of a forbidden phrase** (e.g. PRODUCT.md anti-references) → add a suppression on the offending line:
   ```html
   <p>...phrase...</p> <!-- check-claims-allow: quoting forbidden phrase in anti-reference list -->
   ```
3. **If you are uncertain** → log to `docs/_backlog.md` (created in Task 9) under "Suspected drift" and skip for now. Do not fix or suppress.

- [ ] **Step 3: Apply fixes/suppressions and re-run until clean**

Re-run `npm run check:claims` after each batch of edits until it reports 0 violations.

- [ ] **Step 4: Confirm `npm run build` is clean**

Run: `cd D:/code/WTS && npm run build`
Expected: linter passes, then Tailwind compiles `css/styles.css`. Exit 0.

- [ ] **Step 5: Commit (only if files changed in Step 3)**

```bash
git -C D:/code/WTS add -u   # stages tracked file modifications only
git -C D:/code/WTS commit -m "fix(site): resolve check-claims violations on initial scan"
```

If Step 3 made no edits, skip the commit.

---

### Task 9: Create `docs/_backlog.md`

**Files:**
- Create: `D:\code\WTS\docs\_backlog.md`

- [ ] **Step 1: Write the file**

```markdown
---
title: WTS Backlog
status: active
last-reviewed: 2026-05-06
---

# WTS Backlog

Known gaps, deferred work, and unverified claims. When you notice
something uncertain or out of scope, append here instead of confabulating
or silently fixing.

## Suspected drift

_(empty at inception)_

## Tooling enhancements

- **Extract chatbot system prompt from `server.js:28-194` to
  `prompts/chatbot-system.md`.** Reduces a ~165-line prose blob inside JS
  to an editable file. Adds a startup-time read with a hard-fail guard.
  Deferred — done as its own task when the prompt is next edited.

## TODO verify

_(empty at inception)_
```

- [ ] **Step 2: Verify the linter still passes after the addition**

`docs/_backlog.md` will be scanned because it lives outside the skip list and `*.md` files at non-prompt locations aren't currently in scope per `findFiles` — confirm by re-running:

Run: `cd D:/code/WTS && npm run check:claims`
Expected: still 0 violations. (If `findFiles` does pick this up due to a scope misread, that's a Task 5 bug — fix the walker, not the doc.)

- [ ] **Step 3: Commit**

```bash
git -C D:/code/WTS add docs/_backlog.md
git -C D:/code/WTS commit -m "docs: add WTS backlog escape valve"
```

---

### Task 10: Create root `CLAUDE.md`

**Files:**
- Create: `D:\code\WTS\CLAUDE.md`

- [ ] **Step 1: Write the file**

```markdown
# CLAUDE.md

This file orients agents working in `D:\code\WTS` (the William Tucker
Solutions marketing site). Read it before editing any copy.

## Source of truth

- **`D:\code\cv\PROFILE.md` is canonical** for every fact about William's
  career, projects, timelines, and stack. When in doubt, read it.
- The workspace-level `D:\code\CLAUDE.md` framing rules apply (auto-loaded
  by Claude Code; restated below for proximity).
- Address the user as **Will** or **William**. Never **Bill**, even if
  older docs use it.

## The recurring failure mode

Four of the last five commits before this file existed were "credibility
sweeps" — agents had inflated claims while editing copy ("15+ years",
"BIS in 2 days", "Room Booking in production") and a human had to revert.

**Run `npm run check:claims` before committing copy changes.** The build
pipeline runs it automatically; if it fires, fix the copy. Do not weaken
the patterns to make violations disappear.

When a credibility sweep happens despite the linter, the fix should also
add a new pattern in `scripts/check-claims.mjs` so that specific drift
cannot recur.

## Framing rules (verbatim from workspace CLAUDE.md)

- **12+ years** professional software experience (since 2013) — never
  "15+", never inflate.
- **Currently dual-role:** Programmer/Analyst at Vancouver Island
  University (Jul 2016 – Present) AND Founder of William Tucker Solutions
  (2026 – Present). WTS is not his sole employment.
- **AI-accelerated, never AI-replaced.** Describe AI work as augmented
  senior engineering, not "generated" or "automated."
- **RoomBooking is in QA, not production** — go-live blocked on
  organizational approval.
- **BIS was ~7 weeks (66 commits, 14 branches), not 2 days.**
- **Stack gaps are honest:** no production MySQL, no AWS, no Salesforce,
  no native mobile, no modern PHP framework experience. Do not infer
  transferable skills from adjacent tech.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, dual-track positioning, top of funnel |
| About | `about.html` | William's bio + work history |
| Services | `services.html` | Modernization + AI consulting service tiers |
| Case studies | `case-studies.html` | BIS, Room Booking, Oracle MCP server |
| FAQ | `faq.html` | Process / pricing / scope answers |
| Pricing | `pricing.html` | Service tier prices |
| Contact | `contact.html` | Calendly + email |
| Small business | `small-business.html` | Kelowna SMB-specific landing page |
| Privacy | `privacy.html` | Privacy notice |
| Checklist | `checklist.html` | Pre-engagement checklist |

## Other places facts and rules live

| Topic | Where |
|---|---|
| Brand voice / positioning | `PRODUCT.md` |
| Visual spec, anti-references | `DESIGN.md` + `DESIGN.json` |
| Chatbot system prompt | `server.js:28-194` (sync hazard — see below) |
| Deploy / launch process | `docs/launch-guide.md` |
| Sales materials | `docs/sales/` |
| Funding / grants | `GRANTS.md` |
| Known drift / TODOs | `docs/_backlog.md` |
| Linter pattern catalog | `scripts/check-claims.mjs` |

## Two surfaces, one source of truth

HTML page copy AND `server.js:28-194` (the chatbot system prompt) both
restate facts that originate in `PROFILE.md`. When PROFILE.md changes,
both surfaces must be updated together. The linter scans both. A future
task — logged in `docs/_backlog.md` — will extract the system prompt to
`prompts/chatbot-system.md` so it can be edited as plain prose.

## Project shape

- **Stack:** static HTML + Tailwind v4 + Express (chatbot proxy only).
- **Deploy:** Railway runs `npm run build`. A linter failure breaks the
  deploy by design.
- **Commands:**
  - `npm run check:claims` — run the linter only
  - `npm run test:claims` — run the linter's own unit tests
  - `npm run build` — linter + Tailwind compile (the deploy command)
  - `npm run watch` — Tailwind dev (no linter)
  - `npm start` — Express chatbot proxy

## Where to start

- **Editing copy:** read `PROFILE.md` §10 framing rules, edit the page,
  run `npm run check:claims`.
- **Uncertain about a claim:** log to `docs/_backlog.md` under
  "Suspected drift" instead of guessing.
- **Adding/changing a linter pattern:** edit `scripts/check-claims.mjs`
  `PATTERNS` array; add a test in `tests/check-claims.test.mjs`.
- **Unfamiliar territory:** consult the topic table above.
```

- [ ] **Step 2: Verify the linter still passes**

Run: `cd D:/code/WTS && npm run check:claims`
Expected: 0 violations.

The framing-rules section quotes phrases like "15+", "AI-replaced", "Bill" inside backticks/quoted text. These will not match the patterns because: `\b1[3-9]\+?\s*years?\b` requires the digit + `years?` together (the rule shows "15+", not "15+ years"); `\bBill\b` is case-sensitive but the doc uses **Bill** in bold which the regex does not match (no — the regex matches the literal word "Bill" regardless of markdown bold). Verify by running the linter; if it fires, add a `<!-- check-claims-allow: ... -->` comment per offending line.

- [ ] **Step 3: Commit**

```bash
git -C D:/code/WTS add CLAUDE.md
git -C D:/code/WTS commit -m "docs: add root CLAUDE.md agent orientation"
```

---

### Task 11: Final verification and merge readiness

- [ ] **Step 1: Full pipeline run**

Run: `cd D:/code/WTS && npm run test:claims && npm run build`
Expected: tests pass, linter passes, Tailwind emits `css/styles.css`, exit 0.

- [ ] **Step 2: Confirm git status is clean**

Run: `git -C D:/code/WTS status`
Expected: working tree clean (or only `css/styles.css` modified, which is build output and should not be committed).

- [ ] **Step 3: List the new files for review**

Run: `git -C D:/code/WTS log --stat master..HEAD`
Expected: a sequence of small commits — pattern catalog, line matcher, proximity matcher, suppression parser, file walker, orchestrator/CLI, package.json wiring, optional copy fixes, _backlog.md, CLAUDE.md.

- [ ] **Step 4: Stop here**

Do not push, do not merge to master, do not open a PR. The user will review the branch and decide. Report back with the final commit hash and a one-line summary of each commit.

---

## Self-review notes

**Spec coverage check.** Each spec section has at least one task:

- §4 file layout — Tasks 1, 9, 10 (files), Task 7 (package.json)
- §5 CLAUDE.md sections — Task 10 includes all 8 sections
- §6 _backlog.md — Task 9
- §7 linter (catalog, line matcher, proximity, suppression, walker, orchestrator, output, exit codes) — Tasks 1-6
- §8 package.json — Task 7
- §9 trade-offs — captured in Task 8 decision rules
- §10 deferrals — preserved in Task 9 backlog content
- §11 implementation order — Tasks 1-11 in this order
- §12 open questions — addressed in Task 8 (initial-scan fixes happen during implementation)

**Type / name consistency check.**

- `PATTERNS` array used identically across Tasks 1-6.
- `checkLine(line, lineNum, pattern)` signature is stable from Task 2.
- `checkProximity(content, pattern)` signature is stable from Task 3.
- `extractSuppression(line)` returns `{ reason } | null` consistently from Task 4.
- `findFiles(rootDir)` returns `Promise<string[]>` (absolute paths) from Task 5; `runCheck` consumes that and adds `file` field.
- Violation object shape is consistent: `{ patternId, type, lineNum, lineEnd, matched, reason }` plus `file` (added in `runCheck`).

**Placeholder scan.** No TBDs, TODOs, or "implement later" markers. Each test code block is full and runnable.
