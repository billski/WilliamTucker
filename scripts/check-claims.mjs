// Claim linter for WTS. Scans copy for forbidden phrase patterns drawn
// from PROFILE.md framing rules and prior credibility-sweep commits.
// See docs/superpowers/specs/2026-05-06-wts-agent-guardrails-design.md.

import { readdir, readFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  {
    id: 'ai-replaces-engineers',
    type: 'line',
    rule: /\b(fully\s+autonomous\s+AI|no[\s-]human[\s-]in[\s-]the[\s-]loop|AI\s+replaces?\s+(developers?|engineers?))\b/i,
    reason: 'PROFILE.md §10: AI-accelerated, never AI-replaced. Human is in the loop.',
  },
  {
    id: 'ai-certified',
    type: 'line',
    rule: /\b(certified\s+AI\s+(trainer|consultant|practitioner)|AI[\s-]certified)\b/i,
    reason: 'William has no AI certifications. Frame as "daily practitioner", not credentialed.',
  },
  {
    id: 'quantified-training',
    type: 'line',
    rule: /\b(thousands\s+of\s+(students|trainees|people)|trained\s+\d{2,}\+?\s+(teams|people|developers|trainees|students))\b/i,
    reason: 'Training-track quantified claims (thousands trained / 10+/50+/100+ teams) are not backed. Use qualitative framing.',
  },
  {
    id: 'buzzword-soup',
    type: 'line',
    rule: /\b(industry[\s-]leading|cutting[\s-]edge|revolutionary)\s+(AI|technology|approach|solution|platform)\b/i,
    reason: 'Per project-site-audience memory: WTS site is referral-driven, plain-spoken. Buzzword soup is off-voice.',
  },
  {
    id: 'credibility-theater',
    type: 'line',
    rule: /\b(trusted\s+by|as\s+featured\s+in|as\s+seen\s+in)\b/i,
    reason: 'Per project-site-audience memory: WTS is referral-driven, not authority-led. Credibility theater is off-voice.',
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
    'offending line with a >=10-char reason. For proximity violations',
    '(file:N-M), place the suppression on line N (the first/primary line).',
    'Do not weaken patterns to make violations disappear; add suppressions',
    'or fix the copy.',
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
const isDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  const root = process.cwd();
  const { violations, fileCount } = await runCheck(root);
  process.stdout.write(formatViolations(violations, { fileCount }));
  process.exit(violations.length === 0 ? 0 : 1);
}
