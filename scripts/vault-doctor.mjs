#!/usr/bin/env node
// vault-doctor.mjs — lint a wts-ai-docs vault for structural and freshness issues.
//
// Usage:
//   node scripts/vault-doctor.mjs [--root <path>] [--max-age <days>] [--json]
//   node scripts/vault-doctor.mjs --help
//
// Exit codes:
//   0 — no violations
//   1 — at least one violation
//   2 — fatal error (vault not found, bad args, etc.)
//
// Checks:
//   1. Frontmatter shape — every .md under docs/ (except _archive/) has the
//      required keys: title, domain, status, last-reviewed.
//   2. last-reviewed staleness — older than --max-age days (default 60).
//   3. "What's in / What's NOT" callout — required on every top-level
//      docs/<slug>.md domain doc (not under _meta/, _archive/, _cheatsheets/,
//      and not underscore-prefixed like _index.md / _backlog.md).
//   4. Wikilinks resolve — every [[target]] and [[target#anchor]] resolves to
//      an existing doc and (if anchor) to an actual heading in that doc.
//   5. Domain stem match — for top-level domain docs, frontmatter `domain:`
//      equals the filename stem.
//   6. Doc length — domain docs longer than --max-doc-lines (default 600)
//      cost the agent context budget. The warning triggers a "split or extract
//      a cheatsheet" conversation before the doc becomes unreadable.
//
// Deferred to a later milestone:
//   * doc-ownership.yml cite-against-paths.
//
// Zero runtime deps — Node built-ins only. The YAML frontmatter parser handles
// only the constrained shape vault docs use (string values, date values, simple
// `- item` lists). It is NOT a general YAML parser.

import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DEFAULT_MAX_AGE_DAYS = 60;
const DEFAULT_MAX_DOC_LINES = 600;

// ---- CLI ----------------------------------------------------------------

const HELP = `vault-doctor — lint a wts-ai-docs vault.

USAGE
  node scripts/vault-doctor.mjs [--root <path>] [--max-age <days>]
                                [--max-doc-lines <n>] [--json]
  node scripts/vault-doctor.mjs --help

OPTIONS
  --root <path>           Vault root (default: ./docs relative to cwd).
  --max-age <days>        Default freshness threshold (default: ${DEFAULT_MAX_AGE_DAYS}).
                          Per-doc override: frontmatter \`max-age: N\`.
  --max-doc-lines <n>     Warn when a domain doc exceeds N lines (default: ${DEFAULT_MAX_DOC_LINES}).
                          A long doc burns agent context budget; split or
                          extract a cheatsheet. Per-doc override: frontmatter
                          \`max-doc-lines: N\` (set to 0 to disable for that doc).
  --json                  Emit machine-readable JSON instead of human text.
  --help, -h              Show this help.

ESCAPE HATCHES (frontmatter, per-doc)
  vault-doctor: skip                              # skip ALL checks on this doc
  vault-doctor-skip-checks: [stale, wikilink]     # skip a subset
  max-age: 30                                     # override --max-age for this doc
  max-doc-lines: 800                              # override --max-doc-lines for this doc

INLINE ESCAPE HATCH (in doc body)
  See [[business#planned-section]] <!-- vault-doctor: ignore -->

EXIT CODES
  0   no violations
  1   at least one violation
  2   fatal (e.g. vault root missing)
`;

function parseArgs(argv) {
  const args = {
    root: null,
    maxAge: DEFAULT_MAX_AGE_DAYS,
    maxDocLines: DEFAULT_MAX_DOC_LINES,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--json') args.json = true;
    else if (a === '--root') args.root = argv[++i];
    else if (a === '--max-age') {
      const n = parseInt(argv[++i], 10);
      if (!Number.isFinite(n) || n < 0) die(`--max-age must be a non-negative integer, got "${argv[i]}".`, 2);
      args.maxAge = n;
    } else if (a === '--max-doc-lines') {
      const n = parseInt(argv[++i], 10);
      if (!Number.isFinite(n) || n < 0) die(`--max-doc-lines must be a non-negative integer, got "${argv[i]}".`, 2);
      args.maxDocLines = n;
    } else {
      die(`Unknown argument: ${a}\nRun --help for usage.`, 2);
    }
  }
  return args;
}

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

// ---- YAML frontmatter parser (constrained subset) ----------------------
//
// Handles: --- delimiters, `key: value` strings (quoted or not), date values
// (YYYY-MM-DD as string), and `- item` lists under a key. Rejects anything
// else (anchors, nested objects, multi-line scalars) with a useful error.

function parseFrontmatter(text) {
  // Strip UTF-8 BOM.
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  // Normalize line endings.
  const lines = text.split(/\r?\n/);

  // Frontmatter must start at line 1 with `---`.
  if (lines[0] !== '---') return { found: false };

  // Find closing `---`.
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { endIdx = i; break; }
  }
  if (endIdx === -1) return { found: true, error: 'unterminated frontmatter (no closing `---`)' };

  const fm = {};
  let currentListKey = null;

  for (let i = 1; i < endIdx; i++) {
    const raw = lines[i];
    const stripped = raw.replace(/\s+$/, '');
    if (!stripped.trim()) { currentListKey = null; continue; }
    if (stripped.trimStart().startsWith('#')) continue; // comment

    const indent = stripped.length - stripped.trimStart().length;

    // List item under the previous key.
    if (currentListKey && indent > 0 && stripped.trimStart().startsWith('-')) {
      const value = stripped.trimStart().slice(1).trim();
      const unquoted = unquote(value);
      fm[currentListKey].push(unquoted);
      continue;
    }

    // key: value or key:
    if (indent !== 0) {
      return { found: true, error: `line ${i + 1}: unexpected indent (parser supports flat key:value and one-level lists only)` };
    }
    const m = stripped.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) {
      return { found: true, error: `line ${i + 1}: could not parse "${stripped}" — expected \`key: value\` or \`key:\`` };
    }
    const key = m[1];
    const valueRaw = m[2];
    if (valueRaw === '') {
      // Begin a block list (or a sub-block — but we don't support sub-blocks).
      fm[key] = [];
      currentListKey = key;
    } else if (valueRaw.startsWith('[') && valueRaw.endsWith(']')) {
      // Inline list: `key: [a, b, "c"]`. Items are split on commas and unquoted.
      // Commas inside quoted values aren't supported (parser stays simple).
      const inner = valueRaw.slice(1, -1).trim();
      fm[key] = inner === ''
        ? []
        : inner.split(',').map(s => unquote(s.trim()));
      currentListKey = null;
    } else {
      fm[key] = unquote(valueRaw);
      currentListKey = null;
    }
  }

  return { found: true, data: fm, bodyStartLine: endIdx + 1 };
}

function unquote(s) {
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

// ---- File discovery -----------------------------------------------------

async function walk(dir, excludeDirs) {
  const out = [];
  async function recurse(d) {
    let entries;
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch (err) {
      throw new Error(`cannot read directory ${d}: ${err.message}`);
    }
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (excludeDirs.has(ent.name)) continue;
        await recurse(full);
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        out.push(full);
      }
    }
  }
  await recurse(dir);
  return out;
}

// ---- Doc classification -------------------------------------------------
//
// Given a path relative to vault root (e.g. "auth.md", "_meta/foo.md",
// "session-review/2026-04-14.md"), return a classification:
//   - 'domain'      : top-level docs/<slug>.md — full checks (incl. callout + stem)
//   - 'meta'        : docs/_meta/*.md — frontmatter + wikilinks only
//   - 'cheatsheet'  : docs/_cheatsheets/*.md — frontmatter + wikilinks only
//   - 'index-like'  : docs/_index.md, docs/_backlog.md — frontmatter + wikilinks only
//   - 'other'       : subdirs not part of the vault convention (e.g. session-review/,
//                     superpowers/, adr/) — skipped entirely. README.md is also skipped.

function classify(relPosix) {
  const segments = relPosix.split('/');
  if (segments[0] === '_archive') return 'skip';
  if (segments[0] === '_meta') return 'meta';
  if (segments[0] === '_cheatsheets') return 'cheatsheet';
  if (segments.length === 1) {
    const name = segments[0];
    if (name === '_index.md' || name === '_backlog.md') return 'index-like';
    if (name.toLowerCase() === 'readme.md') return 'skip';
    if (name.startsWith('_')) return 'index-like';
    return 'domain';
  }
  // Anything in a non-convention subdir.
  return 'skip';
}

// ---- Checks -------------------------------------------------------------

const REQUIRED_FRONTMATTER_KEYS = ['title', 'domain', 'status', 'last-reviewed'];

function checkFrontmatter(doc) {
  const violations = [];
  if (!doc.frontmatter.found) {
    violations.push({ check: 'frontmatter', detail: 'missing frontmatter block (file must start with `---`)' });
    return violations;
  }
  if (doc.frontmatter.error) {
    violations.push({ check: 'frontmatter', detail: `parse error: ${doc.frontmatter.error}` });
    return violations;
  }
  for (const key of REQUIRED_FRONTMATTER_KEYS) {
    if (!(key in doc.frontmatter.data)) {
      violations.push({ check: 'frontmatter', detail: `missing required key \`${key}\`` });
    }
  }
  return violations;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function checkStaleness(doc, defaultMaxAge, today) {
  if (!doc.frontmatter.data) return [];
  const value = doc.frontmatter.data['last-reviewed'];
  if (!value) return []; // already reported by frontmatter check
  if (!DATE_RE.test(value)) {
    return [{ check: 'stale', detail: `last-reviewed \`${value}\` is not a valid YYYY-MM-DD date` }];
  }
  // Per-doc max-age overrides the CLI default. Useful when one runbook needs
  // tighter freshness than the rest of the vault (or looser).
  const docMaxAge = doc.frontmatter.data['max-age'];
  let maxAge = defaultMaxAge;
  if (docMaxAge !== undefined) {
    const n = parseInt(docMaxAge, 10);
    if (!Number.isFinite(n) || n < 0) {
      return [{ check: 'stale', detail: `frontmatter max-age \`${docMaxAge}\` is not a non-negative integer` }];
    }
    maxAge = n;
  }
  const ageMs = today.getTime() - Date.parse(value + 'T00:00:00Z');
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  if (ageDays > maxAge) {
    return [{ check: 'stale', detail: `last-reviewed ${value} is ${ageDays} days old (max ${maxAge})` }];
  }
  return [];
}

const CALLOUT_IN_RE = /What['’]s in this doc:/;
const CALLOUT_NOT_RE = /What['’]s NOT:/;

function checkCallout(doc) {
  // Scan the first ~40 body lines for both phrases inside a blockquote.
  const body = doc.body.split(/\r?\n/).slice(0, 60).join('\n');
  if (!CALLOUT_IN_RE.test(body)) {
    return [{ check: 'callout', detail: 'missing "What’s in this doc:" line near top of doc' }];
  }
  if (!CALLOUT_NOT_RE.test(body)) {
    return [{ check: 'callout', detail: 'missing "What’s NOT:" line near top of doc' }];
  }
  return [];
}

function checkDomainStem(doc) {
  if (!doc.frontmatter.data) return [];
  const domain = doc.frontmatter.data['domain'];
  if (!domain) return [];
  const stem = path.basename(doc.relPath, '.md');
  if (domain !== stem) {
    return [{ check: 'domain-stem', detail: `frontmatter domain \`${domain}\` does not match filename stem \`${stem}\`` }];
  }
  return [];
}

// Doc length is a context-efficiency check, not a hallucination check. A
// 600+ line domain doc forces the agent to load lots of mostly-irrelevant
// content. The fix is usually one of: (a) split into two narrower docs,
// (b) extract a cheatsheet for the highest-frequency lookup, or
// (c) move stale sections to `_archive/`. Per-doc override via frontmatter
// `max-doc-lines: N` (use 0 to disable for that doc).
function checkDocLength(doc, defaultMax) {
  const docMax = doc.frontmatter.data?.['max-doc-lines'];
  let max = defaultMax;
  if (docMax !== undefined) {
    const n = parseInt(docMax, 10);
    if (!Number.isFinite(n) || n < 0) {
      return [{ check: 'length', detail: `frontmatter max-doc-lines \`${docMax}\` is not a non-negative integer` }];
    }
    max = n;
  }
  if (max === 0) return []; // explicit opt-out per-doc
  const lineCount = doc.text.split(/\r?\n/).length;
  if (lineCount > max) {
    return [{
      check: 'length',
      detail: `${lineCount} lines exceeds limit ${max} — split, extract a cheatsheet, or archive stale sections`,
    }];
  }
  return [];
}

// GitHub-style heading slug: lowercase, drop most punctuation, EACH whitespace
// char → one hyphen (no collapsing — that's how GitHub renders "X & Y" as
// `x--y`). Tested against real headings like:
//   "What's NOT:"                 → whats-not
//   "Known Quirks & Gotchas"      → known-quirks--gotchas
//   "Next.js version"             → nextjs-version
function slugifyHeading(h) {
  return h
    .toLowerCase()
    .replace(/[’']/g, '')              // smart and dumb apostrophes
    .replace(/[^\w\sÀ-ɏ-]/g, '')  // drop punctuation but keep Latin extended
    .replace(/^\s+|\s+$/g, '')         // trim only — don't collapse interior whitespace
    .replace(/\s/g, '-');              // each space → one hyphen (matches GitHub)
}

function extractHeadings(body) {
  const slugs = new Set();
  const seen = {};
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    let slug = slugifyHeading(m[1]);
    if (slug in seen) {
      seen[slug]++;
      slug = `${slug}-${seen[slug]}`;
    } else {
      seen[slug] = 0;
    }
    slugs.add(slug);
  }
  return slugs;
}

const WIKILINK_RE = /\[\[([^\]\|#]+?)(?:#([^\]\|]+?))?(?:\|[^\]]+)?\]\]/g;

// Strip fenced (``` / ~~~) and inline-code (`...`) spans from body before
// extracting wikilinks, so example syntax inside docs doesn't fire wikilink
// resolution. Convention docs intentionally show `[[filename]]` in code blocks.
function stripCode(body) {
  const lines = body.split(/\r?\n/);
  let inFence = false;
  let fenceMarker = '';
  const out = [];
  for (const line of lines) {
    const fence = line.match(/^\s*(```|~~~)/);
    if (fence) {
      if (!inFence) { inFence = true; fenceMarker = fence[1]; out.push(''); continue; }
      if (line.includes(fenceMarker)) { inFence = false; fenceMarker = ''; out.push(''); continue; }
    }
    if (inFence) { out.push(''); continue; }
    // Strip inline code spans.
    out.push(line.replace(/`[^`]*`/g, ''));
  }
  return out.join('\n');
}

// Inline ignore marker — placed on the same line as a wikilink to suppress
// just that wikilink's resolution check. Useful for known-broken links you
// haven't fixed yet, or links pointing at planned-but-unwritten docs.
const INLINE_IGNORE_RE = /<!--\s*vault-doctor:\s*ignore\s*-->/;

function checkWikilinks(doc, docsByStem) {
  const violations = [];
  const seen = new Set();
  const scannable = stripCode(doc.body);
  // Iterate line-by-line so we can honor inline ignores adjacent to the link.
  for (const line of scannable.split(/\r?\n/)) {
    if (INLINE_IGNORE_RE.test(line)) continue;
    for (const match of line.matchAll(WIKILINK_RE)) {
      const target = match[1].trim();
      const anchor = match[2] ? match[2].trim() : null;
      const key = `${target}#${anchor || ''}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const targetDoc = docsByStem.get(target);
      if (!targetDoc) {
        violations.push({
          check: 'wikilink',
          detail: `[[${target}${anchor ? '#' + anchor : ''}]] — target file not found in vault`,
        });
        continue;
      }
      if (anchor) {
        const anchorSlug = slugifyHeading(anchor);
        if (!targetDoc.headings.has(anchorSlug)) {
          violations.push({
            check: 'wikilink',
            detail: `[[${target}#${anchor}]] — anchor \`${anchorSlug}\` not found in ${targetDoc.relPath}`,
          });
        }
      }
    }
  }
  return violations;
}

// ---- Pipeline -----------------------------------------------------------

async function loadDoc(absPath, rootAbs) {
  const text = await fs.readFile(absPath, 'utf8');
  const relPath = path.relative(rootAbs, absPath).split(path.sep).join('/');
  const fm = parseFrontmatter(text);
  // Body is everything after the frontmatter block (or the whole file if none).
  let body = text;
  if (fm.found && fm.bodyStartLine) {
    body = text.split(/\r?\n/).slice(fm.bodyStartLine).join('\n');
  }
  return {
    absPath,
    relPath,
    text,
    frontmatter: fm,
    body,
    headings: extractHeadings(body),
    klass: classify(relPath),
  };
}

async function audit({ root, maxAge, maxDocLines }) {
  const rootAbs = path.resolve(root);
  let stat;
  try {
    stat = await fs.stat(rootAbs);
  } catch {
    die(`Vault root not found: ${rootAbs}`, 2);
  }
  if (!stat.isDirectory()) die(`Vault root is not a directory: ${rootAbs}`, 2);

  const files = await walk(rootAbs, new Set(['_archive']));
  const docs = await Promise.all(files.map(f => loadDoc(f, rootAbs)));

  // Index by stem (filename without .md, relative path components joined with /).
  // Wikilinks use bare stems like [[auth]] or [[vault-conventions]] (without path),
  // so register by stem only. Last-wins is fine because vault filenames should be
  // globally unique.
  const docsByStem = new Map();
  for (const d of docs) {
    const stem = path.basename(d.relPath, '.md');
    docsByStem.set(stem, d);
  }

  const today = new Date();
  const report = []; // { relPath, klass, violations: [], skipped: bool }

  for (const d of docs) {
    if (d.klass === 'skip') continue;

    // File-level escape hatches via frontmatter:
    //   vault-doctor: skip                          # skip ALL checks
    //   vault-doctor: skip-checks: [stale, callout] # skip a subset
    // Both shapes are honored. `skip` short-circuits; the list form filters.
    const vdValue = d.frontmatter.data?.['vault-doctor'];
    const vdSkipChecks = d.frontmatter.data?.['vault-doctor-skip-checks'];
    if (vdValue === 'skip') {
      report.push({ relPath: d.relPath, klass: d.klass, violations: [], skipped: true });
      continue;
    }
    const skipChecks = new Set();
    if (Array.isArray(vdSkipChecks)) {
      for (const c of vdSkipChecks) skipChecks.add(String(c).trim());
    }

    const violations = [];

    // Frontmatter applies to everything except 'skip'.
    if (!skipChecks.has('frontmatter')) {
      violations.push(...checkFrontmatter(d));
    }

    // Staleness applies if frontmatter parsed.
    if (d.frontmatter.data && !skipChecks.has('stale')) {
      violations.push(...checkStaleness(d, maxAge, today));
    }

    // Callout only on 'domain'.
    if (d.klass === 'domain' && !skipChecks.has('callout')) {
      violations.push(...checkCallout(d));
    }

    // Domain stem only on 'domain'.
    if (d.klass === 'domain' && !skipChecks.has('domain-stem')) {
      violations.push(...checkDomainStem(d));
    }

    // Doc length only on 'domain'. Context-efficiency signal — too-long docs
    // burn the agent's budget on irrelevant sections.
    if (d.klass === 'domain' && !skipChecks.has('length')) {
      violations.push(...checkDocLength(d, maxDocLines));
    }

    // Wikilinks apply to everything except 'skip'.
    if (!skipChecks.has('wikilink')) {
      violations.push(...checkWikilinks(d, docsByStem));
    }

    report.push({ relPath: d.relPath, klass: d.klass, violations, skipped: false });
  }

  return { rootAbs, report };
}

// ---- Output -------------------------------------------------------------

function printHuman(rootAbs, report) {
  let totalViolations = 0;
  let skippedCount = 0;
  const sorted = [...report].sort((a, b) => a.relPath.localeCompare(b.relPath));
  for (const r of sorted) {
    if (r.skipped) {
      console.log(`· ${r.relPath} (skipped via frontmatter vault-doctor: skip)`);
      skippedCount++;
      continue;
    }
    if (r.violations.length === 0) {
      console.log(`✓ ${r.relPath}`);
    } else {
      for (const v of r.violations) {
        console.log(`✗ ${r.relPath}: [${v.check}] ${v.detail}`);
        totalViolations++;
      }
    }
  }
  console.log('');
  const checked = report.length - skippedCount;
  if (totalViolations === 0) {
    console.log(`${checked} docs checked${skippedCount ? `, ${skippedCount} skipped` : ''}, 0 violations.`);
  } else {
    console.log(`${totalViolations} violation(s) across ${checked} doc(s)${skippedCount ? ` (${skippedCount} skipped)` : ''} in ${rootAbs}.`);
  }
  return totalViolations;
}

function printJson(rootAbs, report) {
  let totalViolations = 0;
  const violations = [];
  for (const r of report) {
    for (const v of r.violations) {
      violations.push({ file: r.relPath, check: v.check, detail: v.detail });
      totalViolations++;
    }
  }
  const out = {
    summary: {
      root: rootAbs,
      totalDocs: report.length,
      violations: totalViolations,
      exitCode: totalViolations === 0 ? 0 : 1,
    },
    violations,
  };
  console.log(JSON.stringify(out, null, 2));
  return totalViolations;
}

// ---- Entry --------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return 0;
  }
  const root = args.root || path.join(process.cwd(), 'docs');
  const { rootAbs, report } = await audit({
    root,
    maxAge: args.maxAge,
    maxDocLines: args.maxDocLines,
  });
  const violations = args.json ? printJson(rootAbs, report) : printHuman(rootAbs, report);
  return violations === 0 ? 0 : 1;
}

// Run main() only when executed directly (not when imported as a module
// for tests). The path comparison handles Windows + symlinked entrypoints.
const invokedDirectly = (() => {
  try { return fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || ''); }
  catch { return false; }
})();
if (invokedDirectly) {
  main().then(code => process.exit(code)).catch(err => {
    console.error(`vault-doctor failed: ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(2);
  });
}

// Test-only exports. Not part of the CLI contract; do not depend on these
// from outside `tests/`.
export {
  parseFrontmatter,
  unquote,
  classify,
  slugifyHeading,
  extractHeadings,
  stripCode,
  checkFrontmatter,
  checkStaleness,
  checkCallout,
  checkDomainStem,
  checkDocLength,
  checkWikilinks,
  WIKILINK_RE,
};
