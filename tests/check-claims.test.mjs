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
