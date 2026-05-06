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
      const nearLine = offsetToLine(found.index, lineOffsets);
      violations.push({
        patternId: pattern.id,
        type: 'proximity',
        lineNum,
        lineEnd: Math.max(lineNum, nearLine),
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

const SUPPRESS_RE = /(?:<!--|\/\/)\s*check-claims-allow:\s*([^>\n]+?)\s*(?:-->|$)/;
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
