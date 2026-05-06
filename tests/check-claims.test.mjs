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
