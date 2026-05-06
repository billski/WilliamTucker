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
