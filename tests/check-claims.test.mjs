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
