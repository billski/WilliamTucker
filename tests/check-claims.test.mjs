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

test('checkProximity normalizes line range when near appears before primary', () => {
  const text = 'this is in production\nlater the Room Booking system';
  const violations = checkProximity(text, roomProd);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].lineNum, 2, 'lineNum should point at the primary match line');
  assert.ok(violations[0].lineEnd >= violations[0].lineNum, 'lineEnd must not be smaller than lineNum');
});

test('checkProximity emits one violation per primary hit (no dedup)', () => {
  // Two Room Booking mentions, single in-production mention reachable from both within window.
  const text = 'Room Booking one. ' + 'Room Booking two is in production.';
  const violations = checkProximity(text, roomProd);
  assert.equal(violations.length, 2, 'each primary hit produces its own violation');
  for (const v of violations) {
    assert.equal(v.patternId, 'room-booking-prod');
  }
});

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

test('findFiles excludes underscore-prefixed top-level HTML (drafts)', async () => {
  const root = await mkdtemp(join(tmpdir(), 'check-claims-'));
  try {
    await writeFile(join(root, 'real.html'), '<p>x</p>');
    await writeFile(join(root, '_draft.html'), '<p>y</p>');
    const files = (await findFiles(root)).map(f => f.replace(root, '').replace(/\\/g, '/').replace(/^\//, ''));
    files.sort();
    assert.deepEqual(files, ['real.html'], '_draft.html must be skipped');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('findFiles only scans direct prompts/*.md, not deeper subdirectories', async () => {
  const root = await mkdtemp(join(tmpdir(), 'check-claims-'));
  try {
    await mkdir(join(root, 'prompts', 'sub'), { recursive: true });
    await writeFile(join(root, 'prompts', 'top.md'), 'x');
    await writeFile(join(root, 'prompts', 'sub', 'nested.md'), 'x');
    const files = (await findFiles(root)).map(f => f.replace(root, '').replace(/\\/g, '/').replace(/^\//, ''));
    files.sort();
    assert.deepEqual(files, ['prompts/top.md'], 'only direct prompts/*.md should be included');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

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
