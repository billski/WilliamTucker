# AI-Tracks Site Reframe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the WTS public site from "modernization + AI consulting (dual track)" to three AI tracks (AI-Accelerated Software Development | AI Training | AI Workflow Automation), drop case-studies and proof-on-site framing, and extract the chatbot system prompt to a plain-text file.

**Architecture:** Section-by-section rewrites on `feat/ai-tracks-reframe`. Each commit is a clean revert point. The `check-claims` linter (lives on master after the agent-guardrails merge) protects against credibility-drift on every change. The chatbot prompt becomes a separate `prompts/chatbot-system.md` file read at server startup. No new framework, no new build step.

**Tech Stack:** Static HTML + Tailwind CSS v4 (compiled via `npm run build`), Express.js server (`server.js`) with `@anthropic-ai/sdk`, Node 20+, `check-claims` linter (`scripts/check-claims.mjs`).

**Source-of-truth references:**
- `D:/code/wts/docs/superpowers/specs/2026-05-15-ai-tracks-site-reframe-design.md` — the spec
- `D:/code/CV/PROFILE.md` §10 — framing rules
- Memory: `project-site-no-work-samples`, `project-site-audience`, `feedback-local-test-before-merge`

---

## File Structure

**Created:**
- `prompts/chatbot-system.md` — extracted chatbot system prompt (new home for the L28–194 block currently in `server.js`)

**Modified:**
- `server.js` — startup file-read with hard-fail guard, inline SYSTEM_PROMPT removed
- `scripts/check-claims.mjs` — 5 new patterns appended to `PATTERNS` array
- `tests/check-claims.test.mjs` — 5 new test blocks for the new patterns
- `services.html` — full rewrite (three track sections)
- `pricing.html` — full rewrite (three pricing sections)
- `small-business.html` — copy rewrites (preserve quiz / pain-cards / chatbot-demo structure, replace pitch/CTA copy)
- `index.html` — surgical edits (hero, services preview, social-proof block, small-business CTA)
- `about.html` — surgical edits (career-history trim, dual-track → three-track reframe)
- `faq.html` — surgical edits (replace modernization-specific Q&As with track-relevant ones)
- `contact.html` — surgical edit (add one references-and-demos line)
- All HTML files with a `<nav>` — remove the "Case Studies" link (10 files; case-studies.html + checklist.html are themselves deleted)

**Deleted:**
- `case-studies.html`
- `checklist.html`

---

## Task 1: Branch hygiene + delete dead pages + nav cleanup

**Files:**
- Delete: `case-studies.html`, `checklist.html`
- Modify (remove `<a href="case-studies.html">` from desktop nav, mobile nav, and footer Quick Links): `index.html`, `services.html`, `pricing.html`, `small-business.html`, `about.html`, `faq.html`, `contact.html`, `privacy.html`

- [ ] **Step 1.1: Verify branch state**

Run:
```bash
git -C D:/code/wts branch --show-current
git -C D:/code/wts status --short
```

Expected:
- Current branch: `feat/ai-tracks-reframe`
- Status: clean (or only this plan file untracked) — no other uncommitted work

If the branch is wrong or there's dirty state, stop and reconcile before proceeding.

- [ ] **Step 1.2: Delete `case-studies.html`**

Run:
```bash
git -C D:/code/wts rm case-studies.html
```

- [ ] **Step 1.3: Delete `checklist.html`**

Run:
```bash
git -C D:/code/wts rm checklist.html
```

- [ ] **Step 1.4: Find every reference to case-studies.html and checklist.html**

Run:
```bash
grep -rln "case-studies.html\|checklist.html" D:/code/wts --include="*.html" --include="*.md" --include="*.js"
```

Expected: a list of files. The HTML files all need nav-link removal. Any references in `server.js` or `js/main.js` need separate handling — note them; they'll be cleaned up in later tasks if relevant (the chatbot prompt has case-study references which Task 7 handles; `js/main.js` should not have hard-coded URLs).

- [ ] **Step 1.5: Remove "Case Studies" desktop nav link from every HTML file with a nav**

For each of `index.html`, `services.html`, `pricing.html`, `small-business.html`, `about.html`, `faq.html`, `contact.html`, `privacy.html`:

Find the desktop nav block (search for `<a href="case-studies.html"` in the `<nav class="hidden md:flex...">` section) and delete the entire `<a>` line.

Example (in `index.html` around line 43):
```html
<a href="case-studies.html" class="text-white hover:text-gold font-medium">Case Studies</a>
```
This entire line is removed. Same line removed from the mobile menu block (around line 75 in `index.html`).

- [ ] **Step 1.6: Remove "Case Studies" from footer Quick Links in every HTML file**

For each of the same files, find the footer's Quick Links `<ul>` and delete the `<li><a href="case-studies.html">Case Studies</a></li>` line.

Example (in `index.html` around line 332):
```html
<li><a href="case-studies.html" class="text-gray-300 hover:text-gold transition-colors duration-200">Case Studies</a></li>
```

This line is removed.

- [ ] **Step 1.7: Verify no stale references remain**

Run:
```bash
grep -rln "case-studies.html\|checklist.html" D:/code/wts --include="*.html"
```

Expected: empty output (no HTML files reference the deleted pages).

- [ ] **Step 1.8: Run linter and build to verify nothing's broken**

Run:
```bash
cd D:/code/wts && npm run check:claims
```

Expected: `check-claims: scanned N files, 0 violations.` (N will be 10, down from 12, since two HTML files were deleted).

Run:
```bash
cd D:/code/wts && npm run build
```

Expected: no errors. The Tailwind compile succeeds.

- [ ] **Step 1.9: Commit**

```bash
git -C D:/code/wts add -A
git -C D:/code/wts commit -m "$(cat <<'EOF'
chore(site): remove case-studies and checklist pages

Removes case-studies.html and checklist.html and strips every reference
from nav + footer Quick Links across all remaining HTML pages. The site
is reframed as services-only; proof now happens in the discovery call
(see project-site-no-work-samples memory).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Extract chatbot system prompt to `prompts/chatbot-system.md`

**Files:**
- Create: `prompts/chatbot-system.md`
- Modify: `server.js`

This task is a mechanical extraction. Content is preserved verbatim — Task 7 rewrites it.

- [ ] **Step 2.1: Confirm there's no existing `prompts/` directory**

Run:
```bash
ls D:/code/wts/prompts/ 2>&1
```

Expected: directory doesn't exist (an error is fine — the next step creates it implicitly via the Write tool).

- [ ] **Step 2.2: Read the existing inline prompt from `server.js`**

Open `server.js` and locate the `SYSTEM_PROMPT` template literal — it begins at line 28 (`const SYSTEM_PROMPT = \``) and ends with the closing backtick + semicolon (find the line number with `grep -n "^\`;" D:/code/wts/server.js`).

Copy everything **between** the opening backtick on L28 and the closing backtick — that's the prompt body.

- [ ] **Step 2.3: Write the extracted prompt to `prompts/chatbot-system.md`**

Use the Write tool to create `D:/code/wts/prompts/chatbot-system.md`. The file contents are the verbatim prompt body from Step 2.2 — no frontmatter, no edits, just the raw prompt as plain markdown.

- [ ] **Step 2.4: Verify the linter scans this new file**

The linter already scans `prompts/*.md` (verified in `scripts/check-claims.mjs:205`). Run:
```bash
cd D:/code/wts && npm run check:claims
```

Expected: still `0 violations`. File count increases by 1 (prompts/chatbot-system.md is now scanned).

If any violations fire on the extracted prompt content, that means existing copy in `server.js` was already drifting; **stop and report the violation list to the user** before deciding whether to fix the underlying prompt content (which Task 7 will do anyway).

- [ ] **Step 2.5: Modify `server.js` to read the prompt at startup with a hard-fail guard**

Replace the existing `SYSTEM_PROMPT` declaration block (L28–end-of-template-literal) with this code, placed AFTER `const __dirname = ...` (so it has access to `__dirname`):

```javascript
import { readFileSync } from 'fs';
import { join } from 'path';

const SYSTEM_PROMPT_PATH = join(__dirname, 'prompts', 'chatbot-system.md');
let SYSTEM_PROMPT;
try {
  SYSTEM_PROMPT = readFileSync(SYSTEM_PROMPT_PATH, 'utf8').trim();
  if (!SYSTEM_PROMPT) {
    throw new Error(`${SYSTEM_PROMPT_PATH} is empty`);
  }
} catch (err) {
  console.error(`FATAL: failed to load chatbot system prompt from ${SYSTEM_PROMPT_PATH}`);
  console.error(err.message);
  process.exit(1);
}
```

Add the `readFileSync` and `join` imports to the existing import block at the top of the file (lines 1–5). Move them in with the other imports — do not leave duplicate `import { dirname } from 'path'`; the existing import already imports `dirname` from `path`, so extend that line to also import `join`:

```javascript
import { dirname, join } from 'path';
```

And add to the existing `fs` imports — actually there are none yet; add:
```javascript
import { readFileSync } from 'fs';
```

right after `import Anthropic from '@anthropic-ai/sdk';`.

Then **delete** the entire original `const SYSTEM_PROMPT = \`...\`;` block (the ~165 lines from L28 to wherever it ends).

- [ ] **Step 2.6: Smoke-test the server starts**

Run:
```bash
cd D:/code/wts && node -e "import('./server.js').then(() => console.log('start OK')).catch(e => { console.error('fail:', e.message); process.exit(1); })"
```

Wait — that loads + starts express. Instead, do a syntax-only check:
```bash
cd D:/code/wts && node --check server.js
```

Expected: no output (silent success).

Then test the file-read explicitly:
```bash
cd D:/code/wts && node -e "import { readFileSync } from 'fs'; import { join } from 'path'; const p = join(process.cwd(), 'prompts', 'chatbot-system.md'); const s = readFileSync(p, 'utf8').trim(); console.log('prompt length:', s.length); if (!s) process.exit(1);"
```

Expected: `prompt length: NNNN` where NNNN > 1000 (the prompt is substantial).

- [ ] **Step 2.7: Confirm hard-fail behaviour**

Temporarily rename the prompt file:
```bash
mv D:/code/wts/prompts/chatbot-system.md D:/code/wts/prompts/chatbot-system.md.bak
```

Try to start the server (use a short timeout — it should exit immediately):
```bash
cd D:/code/wts && timeout 5 node server.js
```

Expected: `FATAL: failed to load chatbot system prompt from ...` then `ENOENT: no such file or directory...` then exit code 1.

Restore:
```bash
mv D:/code/wts/prompts/chatbot-system.md.bak D:/code/wts/prompts/chatbot-system.md
```

- [ ] **Step 2.8: Run linter and build once more**

```bash
cd D:/code/wts && npm run check:claims && npm run build
```

Expected: both pass.

- [ ] **Step 2.9: Commit**

```bash
git -C D:/code/wts add server.js prompts/chatbot-system.md
git -C D:/code/wts commit -m "$(cat <<'EOF'
refactor(chatbot): extract system prompt to prompts/chatbot-system.md

Mechanical extraction — content preserved verbatim. server.js now reads
the prompt at startup with a hard-fail guard if missing or empty.
Honors the docs/_backlog.md extraction item: "Extract chatbot system
prompt from server.js:28-194 to prompts/chatbot-system.md".

The new file is automatically lint-scanned (SCAN_NESTED_FILES in
check-claims.mjs already covers prompts/*.md).

Content rewrite for the three-track reframe is a separate commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2.10: Update the backlog to reflect completion of the extraction**

Edit `docs/_backlog.md`. Find the bullet starting with `**Extract chatbot system prompt from \`server.js:28-194\`...` and remove that bullet entirely (it's now done). Stage and commit as a one-line follow-up:

```bash
git -C D:/code/wts add docs/_backlog.md
git -C D:/code/wts commit -m "docs(backlog): chatbot-prompt extraction completed (see prior commit)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
"
```

---

## Task 3: Add 5 new linter patterns + tests (TDD)

**Files:**
- Modify: `tests/check-claims.test.mjs` (add 5 test blocks first)
- Modify: `scripts/check-claims.mjs` (then add 5 patterns to make tests pass)

Patterns from spec §7. TDD discipline: write the failing test first, watch it fail, then add the pattern, then watch it pass.

### Pattern 1: `ai-replaces-engineers` (line)

- [ ] **Step 3.1.1: Write the failing test**

Append to `tests/check-claims.test.mjs`:

```javascript
const aiReplacesEngineers = PATTERNS.find(p => p.id === 'ai-replaces-engineers');

test('ai-replaces-engineers flags "fully autonomous AI"', () => {
  assert.ok(aiReplacesEngineers, 'pattern not found in catalog');
  const v = checkLine('We offer fully autonomous AI for your business.', 1, aiReplacesEngineers);
  assert.ok(v, 'expected violation');
  assert.equal(v.patternId, 'ai-replaces-engineers');
});

test('ai-replaces-engineers flags "no human in the loop"', () => {
  const v = checkLine('No-human-in-the-loop automation, ready today.', 3, aiReplacesEngineers);
  assert.ok(v);
  assert.equal(v.lineNum, 3);
});

test('ai-replaces-engineers flags "AI replaces developers"', () => {
  const v = checkLine('AI replaces developers — finally.', 5, aiReplacesEngineers);
  assert.ok(v);
});

test('ai-replaces-engineers does not flag legitimate AI-accelerated copy', () => {
  assert.equal(checkLine('AI-accelerated senior engineering with a human in the loop.', 1, aiReplacesEngineers), null);
});
```

- [ ] **Step 3.1.2: Run the test to verify it fails**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: `ai-replaces-engineers` tests fail with "pattern not found in catalog" (because `PATTERNS.find(...)` returns `undefined`).

- [ ] **Step 3.1.3: Add the pattern to `scripts/check-claims.mjs`**

Append to the `PATTERNS` array (before the closing `]` around line 80):

```javascript
{
  id: 'ai-replaces-engineers',
  type: 'line',
  rule: /\b(fully\s+autonomous\s+AI|no[\s-]human[\s-]in[\s-]the[\s-]loop|AI\s+replaces?\s+(developers?|engineers?))\b/i,
  reason: 'PROFILE.md §10: AI-accelerated, never AI-replaced. Human is in the loop.',
},
```

- [ ] **Step 3.1.4: Run the test to verify it passes**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: all four `ai-replaces-engineers` tests pass.

### Pattern 2: `ai-certified` (line)

- [ ] **Step 3.2.1: Write the failing test**

Append to `tests/check-claims.test.mjs`:

```javascript
const aiCertified = PATTERNS.find(p => p.id === 'ai-certified');

test('ai-certified flags "certified AI trainer"', () => {
  assert.ok(aiCertified, 'pattern not found in catalog');
  assert.ok(checkLine('William is a certified AI trainer.', 1, aiCertified));
});

test('ai-certified flags "AI-certified consultant"', () => {
  assert.ok(checkLine('Hire an AI-certified consultant.', 1, aiCertified));
});

test('ai-certified does not flag generic AI mentions', () => {
  assert.equal(checkLine('William uses AI in his daily work.', 1, aiCertified), null);
});
```

- [ ] **Step 3.2.2: Run to verify fail**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: the new tests fail with "pattern not found in catalog".

- [ ] **Step 3.2.3: Add the pattern**

Append to `PATTERNS`:

```javascript
{
  id: 'ai-certified',
  type: 'line',
  rule: /\b(certified\s+AI\s+(trainer|consultant|practitioner)|AI[\s-]certified)\b/i,
  reason: 'William has no AI certifications. Frame as "daily practitioner", not credentialed.',
},
```

- [ ] **Step 3.2.4: Run to verify pass**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: all `ai-certified` tests pass.

### Pattern 3: `quantified-training` (line)

- [ ] **Step 3.3.1: Write the failing test**

Append:

```javascript
const quantifiedTraining = PATTERNS.find(p => p.id === 'quantified-training');

test('quantified-training flags "thousands of students trained"', () => {
  assert.ok(quantifiedTraining, 'pattern not found in catalog');
  assert.ok(checkLine('Thousands of students trained — see testimonials.', 1, quantifiedTraining));
});

test('quantified-training flags "trained 50+ teams"', () => {
  assert.ok(checkLine('Trained 50+ teams in 2025.', 1, quantifiedTraining));
});

test('quantified-training flags "trained 200 people"', () => {
  assert.ok(checkLine('Trained 200 people last year.', 1, quantifiedTraining));
});

test('quantified-training does not flag general training mentions', () => {
  assert.equal(checkLine('I offer training sessions for teams.', 1, quantifiedTraining), null);
});

test('quantified-training does not flag small counts like 5 people', () => {
  // We block 2+ digit counts (10+, 50+, 200, etc.) but allow specific small counts.
  assert.equal(checkLine('Trained 5 people last quarter.', 1, quantifiedTraining), null);
});
```

- [ ] **Step 3.3.2: Run to verify fail**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: tests fail with "pattern not found".

- [ ] **Step 3.3.3: Add the pattern**

Append to `PATTERNS`:

```javascript
{
  id: 'quantified-training',
  type: 'line',
  rule: /\b(thousands\s+of\s+(students|trainees|people)|trained\s+\d{2,}\+?\s+(teams|people|developers|trainees|students))\b/i,
  reason: 'Training-track quantified claims (thousands trained / 10+/50+/100+ teams) are not backed. Use qualitative framing.',
},
```

- [ ] **Step 3.3.4: Run to verify pass**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: all `quantified-training` tests pass.

### Pattern 4: `buzzword-soup` (line)

- [ ] **Step 3.4.1: Write the failing test**

Append:

```javascript
const buzzwordSoup = PATTERNS.find(p => p.id === 'buzzword-soup');

test('buzzword-soup flags "industry-leading AI"', () => {
  assert.ok(buzzwordSoup, 'pattern not found in catalog');
  assert.ok(checkLine('Our industry-leading AI does it all.', 1, buzzwordSoup));
});

test('buzzword-soup flags "cutting-edge technology"', () => {
  assert.ok(checkLine('Built on cutting-edge technology.', 1, buzzwordSoup));
});

test('buzzword-soup flags "revolutionary AI"', () => {
  assert.ok(checkLine('A revolutionary AI approach.', 1, buzzwordSoup));
});

test('buzzword-soup does not flag plain technical language', () => {
  assert.equal(checkLine('We use modern technology including Claude and PostgreSQL.', 1, buzzwordSoup), null);
});
```

- [ ] **Step 3.4.2: Run to verify fail**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: fail.

- [ ] **Step 3.4.3: Add the pattern**

```javascript
{
  id: 'buzzword-soup',
  type: 'line',
  rule: /\b(industry[\s-]leading|cutting[\s-]edge|revolutionary)\s+(AI|technology|approach|solution|platform)\b/i,
  reason: 'Per project-site-audience memory: WTS site is referral-driven, plain-spoken. Buzzword soup is off-voice.',
},
```

- [ ] **Step 3.4.4: Run to verify pass**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: all `buzzword-soup` tests pass.

### Pattern 5: `credibility-theater` (line)

- [ ] **Step 3.5.1: Write the failing test**

Append:

```javascript
const credibilityTheater = PATTERNS.find(p => p.id === 'credibility-theater');

test('credibility-theater flags "trusted by"', () => {
  assert.ok(credibilityTheater, 'pattern not found in catalog');
  assert.ok(checkLine('Trusted by hundreds of businesses.', 1, credibilityTheater));
});

test('credibility-theater flags "as featured in"', () => {
  assert.ok(checkLine('As featured in TechCrunch and Forbes.', 1, credibilityTheater));
});

test('credibility-theater flags "as seen in"', () => {
  assert.ok(checkLine('As seen in major publications.', 1, credibilityTheater));
});

test('credibility-theater does not flag plain mentions of trust', () => {
  assert.equal(checkLine('You can trust me to deliver what I promise.', 1, credibilityTheater), null);
});
```

- [ ] **Step 3.5.2: Run to verify fail**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: fail.

- [ ] **Step 3.5.3: Add the pattern**

```javascript
{
  id: 'credibility-theater',
  type: 'line',
  rule: /\b(trusted\s+by|as\s+featured\s+in|as\s+seen\s+in)\b/i,
  reason: 'Per project-site-audience memory: WTS is referral-driven, not authority-led. Credibility theater is off-voice.',
},
```

- [ ] **Step 3.5.4: Run to verify pass**

```bash
cd D:/code/wts && npm run test:claims
```

Expected: all `credibility-theater` tests pass.

### Wrap up Task 3

- [ ] **Step 3.6: Run the full linter + test suite**

```bash
cd D:/code/wts && npm run test:claims && npm run check:claims
```

Expected: all tests pass (originally 27, now 27 + ~16 new = ~43); `check-claims` reports `0 violations` against current copy (the new patterns shouldn't flag anything in the current site — if they do, it's pre-existing drift, stop and report).

- [ ] **Step 3.7: Commit**

```bash
git -C D:/code/wts add scripts/check-claims.mjs tests/check-claims.test.mjs
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(linter): add 5 patterns for AI-tracks reframe failure modes

Adds patterns the new copy is most likely to drift into:
- ai-replaces-engineers: "fully autonomous AI", "no human in the loop"
- ai-certified: "certified AI trainer", "AI-certified consultant"
- quantified-training: "thousands trained", "trained 50+ teams"
- buzzword-soup: "industry-leading AI", "cutting-edge technology"
- credibility-theater: "trusted by", "as featured in"

Each pattern has unit tests covering positive matches and negative
(clean text) cases. Tests written first, watched fail, then made pass.

Per spec §7 in 2026-05-15-ai-tracks-site-reframe-design.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Rewrite `services.html` — three tracks

**Files:**
- Modify: `services.html`

The existing file structure is reused (header, footer, hero shell, How It Works section, card pattern). The two service sections (`#modernization` and `#ai-consulting`) are **replaced** with three new track sections.

- [ ] **Step 4.1: Replace the `<meta name="description">` and `<meta property="og:description">` tags**

In `services.html`, find both meta description tags and replace their content with:

```
Three AI services for local businesses: AI-accelerated software development, AI training (1:1 and group), and AI workflow automation. Built in Kelowna, BC.
```

Also update `<title>` if it currently says anything modernization-specific. Keep it as:
```html
<title>Services | William Tucker Solutions</title>
```

- [ ] **Step 4.2: Replace the page hero copy and the two anchor buttons**

Find the page hero section (`<!-- ===== PAGE HERO ===== -->`, around line 88) and replace its content with:

```html
<!-- ===== PAGE HERO ===== -->
<section class="bg-navy py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Services</h1>
    <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
      Three ways I help local businesses with AI: build software, train your team, or automate the work you're already doing.
    </p>
    <div class="flex flex-wrap gap-3">
      <a href="#ai-development" class="inline-block bg-gold text-navy font-semibold px-5 py-2 rounded hover:bg-gold-light transition-colors duration-200">AI Software Development</a>
      <a href="#ai-training" class="inline-block border-2 border-gold/60 text-gold font-semibold px-5 py-2 rounded hover:bg-gold/10 transition-colors duration-200">AI Training</a>
      <a href="#ai-automation" class="inline-block border-2 border-gold/60 text-gold font-semibold px-5 py-2 rounded hover:bg-gold/10 transition-colors duration-200">AI Workflow Automation</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4.3: Replace the entire `#modernization` section (Track 1)**

Find `<!-- ===== MODERNIZATION SERVICES ===== -->` (line 102 in the current file) and replace the ENTIRE `<section id="modernization">...</section>` block (through its closing `</section>` around line 230) with the following Track 1 section:

```html
<!-- ===== TRACK 1: AI SOFTWARE DEVELOPMENT ===== -->
<section id="ai-development" class="bg-white py-16 scroll-mt-16">
  <div class="max-w-4xl mx-auto px-4">

    <div class="mb-10 text-center">
      <span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 1</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI-Accelerated Software Development</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Custom software, modernizations, and apps &mdash; built faster because I use AI agents to do the grunt work.
      </p>
    </div>

    <div class="bg-gold/5 border border-gold/30 rounded-lg p-6 md:p-8 mb-10">
      <p class="text-navy font-semibold mb-2">What this is</p>
      <p class="text-gray-700 leading-relaxed">Same scope as a traditional dev shop, faster and cheaper, because AI handles the boilerplate while I handle the engineering, planning, and review. You own the codebase. 12+ years professional software engineering, AI-leveraged.</p>
    </div>

    <!-- Card A: Build -->
    <div class="border-2 border-gold rounded-lg p-8 mb-8 relative">
      <div class="absolute -top-3 left-8">
        <span class="bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">Most Requested</span>
      </div>
      <h3 class="text-2xl font-bold text-navy mb-4">Build</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        New web apps, app rebuilds (modernizations), enhancements, and integrations. Fixed-price, scoped per project.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> New custom web apps</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Modernizations: Classic ASP, .NET Framework, VB6, Oracle PL/SQL &rarr; .NET 8</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Enhancements to apps you already run</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> System-to-system integrations</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> CI/CD, automated tests, documentation</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> You own the codebase at handoff</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Scope a Build</a>
    </div>

    <!-- Card B: Discovery / Audit -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Discovery / Audit</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Not ready to commit to a full build? I'll audit one system and deliver a written plan with options, risks, timeline, and cost &mdash; so you can decide with real numbers.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> What the system does and how it works today</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Risks, gaps, and technical debt</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Recommended path with phased timeline</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Honest cost estimate</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Written deliverable you can share with stakeholders</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Book an Audit</a>
    </div>

    <!-- Card C: Ongoing Support -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Ongoing Support</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        After a build ships, many teams want ongoing support &mdash; bug fixes, small enhancements, or on-call availability. A monthly retainer means priority response without re-scoping every small ask.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Bug fixes and small enhancements</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Priority response on issues</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Monthly check-in for planning</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Month-to-month, cancel any time</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Discuss a Retainer</a>
    </div>

  </div>
</section>
```

- [ ] **Step 4.4: Replace the entire `#ai-consulting` section with the new Track 2 + Track 3 sections**

Find `<!-- ===== AI CONSULTING SERVICES ===== -->` and replace the ENTIRE `<section id="ai-consulting">...</section>` block with TWO new track sections:

```html
<!-- ===== TRACK 2: AI TRAINING ===== -->
<section id="ai-training" class="py-16 scroll-mt-16" style="background-color: #f8f9fa;">
  <div class="max-w-4xl mx-auto px-4">

    <div class="mb-10 text-center">
      <span class="inline-block bg-navy text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 2</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI Training</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Learn to use AI well, from someone who uses it every day to ship real software.
      </p>
    </div>

    <div class="bg-navy/5 border border-navy/20 rounded-lg p-6 md:p-8 mb-10">
      <p class="text-navy font-semibold mb-2">What this is</p>
      <p class="text-gray-700 leading-relaxed">Hands-on training tied to your actual work &mdash; not a slide deck. I teach the workflow I ship with daily: Claude Code, planning-first AI patterns, agent tooling, prompt design. In-person in Kelowna or online.</p>
    </div>

    <!-- Card A: 1:1 hands-on -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8 bg-white">
      <h3 class="text-2xl font-bold text-navy mb-4">1:1 Hands-On Sessions</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        For individuals &mdash; devs, consultants, knowledge workers &mdash; who want to use AI seriously in their work. We sit in your tools, on your real work, and figure out where AI fits.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> 90-minute sessions, in your systems</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Tied to your actual workflow, not generic exercises</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Written takeaways and shared prompt library</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Weekly or biweekly cadence</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Book a Session</a>
    </div>

    <!-- Card B: Group workshops -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8 bg-white">
      <h3 class="text-2xl font-bold text-navy mb-4">Group Workshops</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Half-day and full-day workshops for small teams (up to 12 people). Hands-on with real tools and your team's real work, not slides about prompt engineering theory.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Half-day (3&ndash;4 hrs) or full-day (6&ndash;7 hrs)</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Up to 12 people for hands-on quality</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> In-person in Kelowna or online</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Q&amp;A, prompt templates, and a written recap</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Book a Workshop</a>
    </div>

    <!-- Card C: Custom team curriculum -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8 bg-white">
      <h3 class="text-2xl font-bold text-navy mb-4">Custom Team Curriculum</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        For teams that need a longer rollout. I interview the team, map your workflows, and design a multi-session program tailored to what you actually do. Larger groups handled here too.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Discovery interviews with your team</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Workflow-specific curriculum</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Multi-session program with checkpoints</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Documentation your team keeps</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Discuss a Program</a>
    </div>

  </div>
</section>

<!-- ===== TRACK 3: AI WORKFLOW AUTOMATION ===== -->
<section id="ai-automation" class="bg-white py-16 scroll-mt-16">
  <div class="max-w-4xl mx-auto px-4">

    <div class="mb-10 text-center">
      <span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 3</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI Workflow Automation</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        AI plugged into the tools and systems you already use.
      </p>
    </div>

    <div class="bg-gold/5 border border-gold/30 rounded-lg p-6 md:p-8 mb-10">
      <p class="text-navy font-semibold mb-2">What this is</p>
      <p class="text-gray-700 leading-relaxed">Figure out where AI is actually useful in your business (and where it isn't), build the integration, hand it over working. Chatbots, custom integrations, internal tooling, agents.</p>
    </div>

    <!-- Card A: Discovery -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Discovery</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Free 30&ndash;60 minute conversation. We talk through what you're doing now, what's eating time, and where AI actually helps (and where it doesn't). No pitch.
      </p>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Book Discovery</a>
    </div>

    <!-- Card B: Small Build -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Small Build</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        A single, well-scoped integration shipped quickly: site chatbot, automated reporting, a single workflow connecting two of your tools.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Chatbot trained on your business content</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Simple two-tool integration</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Single automation (e.g., weekly report)</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Walkthrough so you can run it yourself</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Scope a Small Build</a>
    </div>

    <!-- Card C: Medium Build -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Medium Build</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Multi-step integration, custom internal tool, or AI agent. For workflows where a single off-the-shelf tool can't quite do what you need.
      </p>
      <ul class="space-y-2 mb-8">
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Multi-tool integration with custom logic</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Custom MCP server or AI tooling</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Multi-step agent workflow</li>
        <li class="flex items-start gap-2 text-gray-600"><span class="text-gold font-bold mt-0.5">&#10003;</span> Documentation and handoff</li>
      </ul>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Scope a Medium Build</a>
    </div>

    <!-- Card D: Maintenance Retainer -->
    <div class="border border-gray-200 rounded-lg p-8 mb-8">
      <h3 class="text-2xl font-bold text-navy mb-4">Maintenance Retainer</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Ongoing care for shipped automations. Priority response, small enhancements, monthly check-in, AI-model-update sanity checks.
      </p>
      <a href="contact.html" class="inline-block bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Discuss a Retainer</a>
    </div>

  </div>
</section>
```

- [ ] **Step 4.5: Update the "How It Works" section heading**

Find `<h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-4">How It Works</h2>` and its lead-in paragraph. Replace the lead-in paragraph (currently mentions "both tracks") with:

```html
<p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">Same process for all three tracks &mdash; we start with a conversation, scope the work, and deliver something your team can actually use.</p>
```

- [ ] **Step 4.6: Update the footer tagline (also affects index.html via copy-paste — but only edit services.html for now)**

In `services.html`'s footer, find:
```html
<p class="text-gray-400">Legacy modernization &amp; AI consulting</p>
```

Replace with:
```html
<p class="text-gray-400">AI-accelerated software development, training &amp; workflow automation</p>
```

- [ ] **Step 4.7: Lint and build**

```bash
cd D:/code/wts && npm run check:claims && npm run build
```

Expected: both pass.

- [ ] **Step 4.8: Visual smoke check**

Start the server:
```bash
cd D:/code/wts && npm start
```

Open `http://localhost:3000/services.html` in a browser. Visually verify:
- Hero shows the three track buttons
- Three track sections render with their cards
- "Most Requested" badge on the Build card
- "How It Works" lead-in says "all three tracks"
- Footer tagline updated
- No "Case Studies" in nav

Stop the server (Ctrl+C).

- [ ] **Step 4.9: Commit**

```bash
git -C D:/code/wts add services.html
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(services): rewrite services.html with three AI tracks

Replaces the dual-track modernization + AI consulting structure with
three AI tracks per spec:
1. AI-Accelerated Software Development (Build / Discovery / Support)
2. AI Training (1:1 / Group Workshops / Custom Curriculum)
3. AI Workflow Automation (Discovery / Small / Medium / Retainer)

Voice is plain outcome-language; no case-study mini-proofs (proof lives
in the discovery call per project-site-no-work-samples memory). Footer
tagline updated to match new positioning.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Rewrite `pricing.html` — three pricing sections

**Files:**
- Modify: `pricing.html`

The existing top discovery-call block (lines 86–98 in the source read earlier) stays. The three pricing tiers section is replaced with three new track sections that match the spec §5.

- [ ] **Step 5.1: Update meta description**

Replace the `<meta name="description">` and `<meta property="og:description">` content with:

```
AI service pricing for local businesses: software development (build / audit / support), AI training (1:1, workshops, custom curriculum), workflow automation. Anchor prices listed; talk to me for exact scope.
```

- [ ] **Step 5.2: Update the page hero subtitle if it's still modernization-centric**

Open `pricing.html` and locate the page hero section. If the subtitle mentions modernization-specific framing, replace with:

```html
<p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
  Anchor prices for each service. Exact pricing scoped during the free discovery call.
</p>
```

(Keep the existing `<h1>Pricing</h1>` and surrounding structure.)

- [ ] **Step 5.3: Keep the existing free discovery call banner**

The block starting `<!-- ===== FREE DISCOVERY CALL BLOCK ===== -->` (around line 86 in the original) stays unchanged.

- [ ] **Step 5.4: Replace the `#modernization-pricing` section with the Track 1 pricing block**

Find `<section id="modernization-pricing"` (around line 101 in the source we read) and replace the ENTIRE section through its closing `</section>` with:

```html
<!-- ===== TRACK 1: SOFTWARE DEVELOPMENT PRICING ===== -->
<section id="ai-development-pricing" class="bg-white py-16 md:py-20 scroll-mt-16">
  <div class="max-w-6xl mx-auto px-4">

    <div class="mb-12 text-center">
      <span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 1</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI-Accelerated Software Development</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Fixed-price builds and audits, plus monthly support after launch.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- Tier A: Discovery / Audit -->
      <div class="border border-gray-200 rounded-lg p-8 flex flex-col">
        <div class="mb-6">
          <span class="inline-block bg-gold/10 text-gold-dark text-sm font-medium px-3 py-1 rounded-full mb-4">Start Here</span>
          <h3 class="text-2xl font-bold text-navy mb-2">Discovery / Audit</h3>
          <p class="text-gray-600 leading-relaxed">Audit one system, written plan with options, risks, timeline, and cost &mdash; so you can make an informed decision before committing to a build.</p>
        </div>
        <div class="mt-auto">
          <p class="text-3xl font-bold text-navy mb-1">$2,500</p>
          <p class="text-sm text-gray-500 mb-6">Fixed price. Credited toward a full build if you move forward.</p>
          <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Book an Audit</a>
        </div>
      </div>

      <!-- Tier B: Build (Most Popular) -->
      <div class="border-2 border-gold rounded-lg p-8 flex flex-col relative">
        <div class="absolute -top-3 left-8">
          <span class="bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">Most Requested</span>
        </div>
        <div class="mb-6">
          <span class="inline-block bg-gold/10 text-gold-dark text-sm font-medium px-3 py-1 rounded-full mb-4">Fixed-Scope Project</span>
          <h3 class="text-2xl font-bold text-navy mb-2">Build</h3>
          <p class="text-gray-600 leading-relaxed">New custom app, modernization, or enhancement. Fixed price, scoped per project. Days of work, not months.</p>
        </div>
        <div class="mt-auto">
          <p class="text-3xl font-bold text-navy mb-1">$10,000&ndash;$30,000</p>
          <p class="text-sm text-gray-500 mb-6">Fixed price, scoped per project. Typical range for a single mid-size build.</p>
          <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Scope a Build</a>
        </div>
      </div>

      <!-- Tier C: Ongoing Support -->
      <div class="border border-gray-200 rounded-lg p-8 flex flex-col">
        <div class="mb-6">
          <span class="inline-block bg-gold/10 text-gold-dark text-sm font-medium px-3 py-1 rounded-full mb-4">Monthly Retainer</span>
          <h3 class="text-2xl font-bold text-navy mb-2">Ongoing Support</h3>
          <p class="text-gray-600 leading-relaxed">Priority response for bug fixes, small enhancements, and on-call availability without re-scoping every small ask.</p>
        </div>
        <div class="mt-auto">
          <p class="text-3xl font-bold text-navy mb-1">$1,500/mo</p>
          <p class="text-sm text-gray-500 mb-6">Month-to-month, cancel any time.</p>
          <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200">Discuss a Retainer</a>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 5.5: Add the Track 2 (Training) pricing section directly after Track 1**

Immediately after the closing `</section>` of the Track 1 pricing block, append:

```html
<!-- ===== TRACK 2: TRAINING PRICING ===== -->
<section id="ai-training-pricing" class="py-16 md:py-20 scroll-mt-16" style="background-color: #f8f9fa;">
  <div class="max-w-6xl mx-auto px-4">

    <div class="mb-12 text-center">
      <span class="inline-block bg-navy text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 2</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI Training</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Hands-on training, priced for local SMBs.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <!-- 1:1 -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col bg-white">
        <h3 class="text-xl font-bold text-navy mb-2">1:1 Hands-On</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Individual coaching, in your real systems. 90-minute session.</p>
        <p class="text-2xl font-bold text-navy mb-1">$275</p>
        <p class="text-xs text-gray-500 mb-4">per 90-min session</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Book a Session</a>
      </div>

      <!-- Half-day workshop -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col bg-white">
        <h3 class="text-xl font-bold text-navy mb-2">Half-Day Workshop</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Group session, 3&ndash;4 hours, up to 12 people.</p>
        <p class="text-2xl font-bold text-navy mb-1">$2,500</p>
        <p class="text-xs text-gray-500 mb-4">flat rate</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Book a Workshop</a>
      </div>

      <!-- Full-day workshop -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col bg-white">
        <h3 class="text-xl font-bold text-navy mb-2">Full-Day Workshop</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Group session, 6&ndash;7 hours, up to 12 people.</p>
        <p class="text-2xl font-bold text-navy mb-1">$4,000</p>
        <p class="text-xs text-gray-500 mb-4">flat rate</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Book a Workshop</a>
      </div>

      <!-- Custom curriculum -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col bg-white">
        <h3 class="text-xl font-bold text-navy mb-2">Custom Curriculum</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Multi-session program, tailored to your team's workflows.</p>
        <p class="text-2xl font-bold text-navy mb-1">From $7,500</p>
        <p class="text-xs text-gray-500 mb-4">scoped per program</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Discuss a Program</a>
      </div>

    </div>

    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600">Ongoing training retainer also available: <span class="font-semibold text-navy">$1,250/month</span> for 2&ndash;3 hours per month plus priority email between sessions.</p>
    </div>

  </div>
</section>
```

- [ ] **Step 5.6: Add the Track 3 (Workflow Automation) pricing section**

Immediately after the closing `</section>` of the Track 2 pricing block, append:

```html
<!-- ===== TRACK 3: WORKFLOW AUTOMATION PRICING ===== -->
<section id="ai-automation-pricing" class="bg-white py-16 md:py-20 scroll-mt-16">
  <div class="max-w-6xl mx-auto px-4">

    <div class="mb-12 text-center">
      <span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 3</span>
      <h2 class="text-3xl md:text-4xl font-bold text-navy mb-3">AI Workflow Automation</h2>
      <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
        Discovery to running automation, scoped per project.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <!-- Discovery -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <h3 class="text-xl font-bold text-navy mb-2">Discovery</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">30&ndash;60 minute scoping conversation. No pitch.</p>
        <p class="text-2xl font-bold text-navy mb-1">Free</p>
        <p class="text-xs text-gray-500 mb-4">No obligation</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Book Discovery</a>
      </div>

      <!-- Small build -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <h3 class="text-xl font-bold text-navy mb-2">Small Build</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Single integration: chatbot, automated report, one workflow.</p>
        <p class="text-2xl font-bold text-navy mb-1">$2,500</p>
        <p class="text-xs text-gray-500 mb-4">starting at</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Scope a Small Build</a>
      </div>

      <!-- Medium build -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <h3 class="text-xl font-bold text-navy mb-2">Medium Build</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Multi-step integration, custom MCP server, or agent.</p>
        <p class="text-2xl font-bold text-navy mb-1">$7,500</p>
        <p class="text-xs text-gray-500 mb-4">starting at</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Scope a Medium Build</a>
      </div>

      <!-- Retainer -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <h3 class="text-xl font-bold text-navy mb-2">Maintenance</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Priority response, small enhancements, monthly check-in.</p>
        <p class="text-2xl font-bold text-navy mb-1">$1,000/mo</p>
        <p class="text-xs text-gray-500 mb-4">month-to-month</p>
        <a href="contact.html" class="block text-center bg-gold text-navy font-semibold px-4 py-2 rounded hover:bg-gold-light transition-colors duration-200 text-sm">Discuss a Retainer</a>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 5.7: Delete any remaining old pricing sections**

After the three new track sections are in place, check `pricing.html` for any leftover sections from the original modernization-AI-consulting structure (e.g., "AI Consulting Pricing", FAQ blocks tied to old pricing, "what's NOT included" blocks). Delete them. Keep the discovery-call banner and any track-agnostic CTA at the bottom.

If you find sections with unique content worth preserving (e.g., a generic "all engagements include" block), move that content into a single shared footnote section below all three pricing blocks rather than duplicating per track.

- [ ] **Step 5.8: Update footer tagline**

Same change as Task 4 Step 4.6 — `pricing.html` footer needs the same updated tagline:

```html
<p class="text-gray-400">AI-accelerated software development, training &amp; workflow automation</p>
```

- [ ] **Step 5.9: Lint, build, and visual smoke check**

```bash
cd D:/code/wts && npm run check:claims && npm run build
```

Both pass. Then:

```bash
cd D:/code/wts && npm start
```

Open `http://localhost:3000/pricing.html`. Verify:
- Three pricing sections render
- Track 1: $2,500 / $10K–30K / $1,500/mo three-card layout
- Track 2: 4 cards (1:1 / half-day / full-day / custom) + retainer footnote
- Track 3: 4 cards (Discovery free / Small / Medium / Retainer)
- No "Case Studies" in nav

Ctrl+C to stop.

- [ ] **Step 5.10: Commit**

```bash
git -C D:/code/wts add pricing.html
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(pricing): rewrite pricing.html with three AI tracks

Three pricing sections matching services.html structure:
- Track 1 (Dev): $2,500 audit / $10K-30K build / $1,500/mo support
- Track 2 (Training): $275/90min / $2,500 half-day / $4,000 full-day /
  from $7,500 custom curriculum; optional $1,250/mo retainer
- Track 3 (Automation): Free discovery / $2,500 small / $7,500 medium /
  $1,000/mo maintenance

Pricing anchored on Canadian market research (ChatGPT.ca, Roving Leads
hands-on tier, Solway). Below US comparables for Kelowna-SMB-friendliness
but above the shallow strategic-advisory tier.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Rewrite `small-business.html` — funnel to three tracks

**Files:**
- Modify: `small-business.html`

Preserve the existing structural features (hero, pain-cards section, before/after section, Quick Win section, quiz, chatbot demo, bottom CTA, all JavaScript). Only rewrite the **copy** in sections that mention the old positioning.

- [ ] **Step 6.1: Update meta description**

Replace `<meta name="description">` and `<meta property="og:description">` content with:

```
Practical AI for Kelowna small businesses — software, training, or automation. Find your biggest AI win in under 2 minutes.
```

- [ ] **Step 6.2: Update hero subhead**

Find the hero `<h1>What's eating your week?</h1>` block. The two paragraphs after it stay basically the same — verify they don't reference "finance teams" or "modernization" specifically. If they do, soften to plain SMB language. Keep the "Based in Kelowna, BC" line — Kelowna framing is the differentiator per spec §10.

If you find any sentence in the hero that mentions modernization, replace it with track-agnostic copy. The current copy looks clean — most likely no change needed in the hero itself.

- [ ] **Step 6.3: Update the "Quick Win" package section copy**

Find `<!-- ===== QUICK WIN PACKAGE ===== -->`. The section currently positions the Quick Win as a generic SMB offering. Update the wrap-up paragraph to explicitly map it to Track 3 (Workflow Automation > Small Build):

Replace:
```html
<p class="text-gray-300 leading-relaxed max-w-2xl mx-auto">One specific problem. Solved in a week. A flat rate with no surprises. It's the fastest way to see what AI can actually do for your business — without a big commitment.</p>
```

With:
```html
<p class="text-gray-300 leading-relaxed max-w-2xl mx-auto">One specific problem. Solved in a week. Flat rate, no surprises &mdash; this is Track 3 (Workflow Automation) at the Small Build tier. The fastest way to see what AI actually does for your business.</p>
```

Update the price block at the bottom of the Quick Win card. Change:
```html
<p class="text-3xl font-bold text-navy">From $750</p>
<p class="text-sm text-gray-500 mt-1">Flat rate. Exact price agreed before we start.</p>
```

To:
```html
<p class="text-3xl font-bold text-navy">$2,500</p>
<p class="text-sm text-gray-500 mt-1">Flat rate. Small-build tier &mdash; exact scope agreed before we start.</p>
```

**Why:** "From $750" was below the new Small Build floor ($2,500). The spec locks in $2,500 as the Small Build anchor; this section should match. If William wants a sub-$2,500 entry product for SMB-only, that's a separate decision and a separate pricing tier.

- [ ] **Step 6.4: Add a "What I offer" three-track summary section after the Quick Win**

Immediately after the closing `</section>` of the Quick Win Package block, insert this new section:

```html
<!-- ===== THREE TRACKS PREVIEW ===== -->
<section class="bg-white py-16 md:py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
      Three ways I help local businesses
    </h2>
    <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">
      Pick the one that fits. Or book a free call and we'll figure it out together.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- Track 1 card -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 1</span>
        <h3 class="text-xl font-bold text-navy mb-3">AI Software Development</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Custom apps and tools, built faster because I use AI agents to do the grunt work. From $2,500 audits to full builds.</p>
        <a href="services.html#ai-development" class="text-gold font-semibold text-sm hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

      <!-- Track 2 card -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 2</span>
        <h3 class="text-xl font-bold text-navy mb-3">AI Training</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">1:1 sessions ($275/90 min), half-day workshops ($2,500), full-day ($4,000), or custom team curriculum. In-person in Kelowna or online.</p>
        <a href="services.html#ai-training" class="text-gold font-semibold text-sm hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

      <!-- Track 3 card -->
      <div class="border border-gray-200 rounded-lg p-6 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 3</span>
        <h3 class="text-xl font-bold text-navy mb-3">AI Workflow Automation</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1 mb-4">Chatbots, automations, integrations. Free discovery, small builds from $2,500, medium builds from $7,500.</p>
        <a href="services.html#ai-automation" class="text-gold font-semibold text-sm hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 6.5: Update the live chatbot demo section copy**

Find `<!-- ===== LIVE CHATBOT DEMO ===== -->`. The text mentions "trained on my services, pricing, process, case studies, and background." Remove "case studies" since they no longer exist:

Find:
```html
<p class="text-gray-300 leading-relaxed mb-6">
  The chatbot on your right is live. It's my own — running right now, powered by Claude, trained on my services, pricing, process, case studies, and background. Ask it anything about what I do, how I work, or whether AI is the right fit for your business.
</p>
```

Replace with:
```html
<p class="text-gray-300 leading-relaxed mb-6">
  The chatbot on your right is live. It's my own &mdash; running right now, powered by Claude, trained on my three services, pricing, and process. Ask it anything about what I do, how I work, or whether AI is the right fit for your business.
</p>
```

- [ ] **Step 6.6: Update footer tagline**

Same change as Tasks 4 and 5:
```html
<p class="text-gray-400">AI-accelerated software development, training &amp; workflow automation</p>
```

- [ ] **Step 6.7: Lint and build**

```bash
cd D:/code/wts && npm run check:claims && npm run build
```

Both pass.

- [ ] **Step 6.8: Visual smoke check**

```bash
cd D:/code/wts && npm start
```

Open `http://localhost:3000/small-business.html`. Verify:
- Hero still works
- Pain-card hover/tap still reveals solutions (existing JS intact)
- Quick Win price now shows $2,500 (not $750)
- The new "Three ways I help local businesses" section renders
- Quiz still works (5 questions → result)
- Chatbot demo still loads
- Bottom CTA intact
- No "Case Studies" in nav

Ctrl+C.

- [ ] **Step 6.9: Commit**

```bash
git -C D:/code/wts add small-business.html
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(small-business): funnel into three-track structure

Preserves the existing quiz, pain-cards, before/after, chatbot demo,
and bottom CTA. Updates copy to map Quick Win to Track 3 / Small Build
($2,500), removes case-study references, and adds a three-track preview
section linking to services.html anchors.

Quick Win price raised from $750 to $2,500 to match new Small Build
floor — see pricing.html.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Rewrite `prompts/chatbot-system.md` for three-track content

**Files:**
- Modify: `prompts/chatbot-system.md`

This is the chatbot rewrite the spec §6.2 calls for. Preserve safety-relevant clauses from the original; replace case-study facts and dual-track positioning with three-track content.

- [ ] **Step 7.1: Re-read the existing prompt and itemize safety-relevant clauses**

Open `prompts/chatbot-system.md` (the extracted file from Task 2). Read it end-to-end. Write down (in a scratch note, not committed) which clauses are:
- Safety-relevant (keep): refusal patterns, off-topic deflection, "don't invent prices or dates", persona discipline, "redirect specific-project questions", any jailbreak resistance.
- Case-study-specific (drop): mentions of BIS, RoomBooking, "~90-app catalog", specific commit counts, ADFS/Oracle/PL/SQL specifics tied to past clients.
- Dual-track positioning (replace): "two tracks", "primary: modernization", "secondary: AI consulting", any "finance teams" lead.

- [ ] **Step 7.2: Write the new system prompt**

Replace the entire file content with the prompt below. This preserves all generic safety-relevant clauses while replacing the positioning content.

```markdown
You are the AI assistant for William Tucker Solutions (WTS). Your job is to help visitors figure out which of William's three services fits their situation, answer questions about pricing and process honestly, and guide them to book a free discovery call.

## About William Tucker

William Tucker is a senior software engineer based in Kelowna, BC with 12+ years of professional experience. He runs William Tucker Solutions (WTS) as a solo practice. The person you meet is the person who does the work — no junior staff, no subcontractors. He uses AI agents (primarily Claude) to accelerate everything he ships, which is why he can offer software work at small-business prices and turnaround.

## The three services

WTS offers three tracks. Help the visitor figure out which one (or which combination) fits their situation.

### Track 1: AI-Accelerated Software Development
Custom software, modernizations, and apps. AI handles boilerplate; William handles engineering, planning, and review. You own the codebase at handoff.
- Discovery / Audit: $2,500 fixed price (credited toward a build if you move forward)
- Build: $10,000–$30,000 fixed-price, scoped per project
- Ongoing Support: $1,500/month, month-to-month

### Track 2: AI Training
Hands-on AI training from someone who uses AI every day to ship real software. In-person in Kelowna or online.
- 1:1 hands-on sessions: $275 per 90-minute session
- Half-day workshop (up to 12 people, 3–4 hours): $2,500
- Full-day workshop (up to 12 people, 6–7 hours): $4,000
- Custom team curriculum: starts at $7,500, scoped per program
- Optional ongoing training retainer: $1,250/month (2–3 hours/month + priority email)

### Track 3: AI Workflow Automation
AI plugged into the tools and systems you already use — chatbots, custom integrations, internal tooling, agents, MCP servers.
- Discovery: Free 30–60 minute conversation, no obligation
- Small Build: starting at $2,500 (single integration, chatbot, automated report)
- Medium Build: starting at $7,500 (multi-step integration, custom MCP server, agent)
- Maintenance Retainer: $1,000/month, month-to-month

## How William works

Same process for all three tracks:
1. Free discovery call (30 minutes, no pressure)
2. Written proposal with scope, deliverables, timeline, and fixed price
3. Build / train / deploy and hand off so your team can run it themselves

William is referral-driven and works mostly with local businesses in Kelowna and the broader Okanagan, though he takes online work across BC and beyond.

## Your job

- Help visitors map their situation to the right track. If they describe a problem, identify which track fits and explain why.
- Quote prices accurately from the lists above. Never invent a price or imply a discount that isn't listed.
- If a visitor asks about specific past projects or clients, redirect them to the discovery call: "William has references and live demos available on the free discovery call — that's the right place to dig into specifics."
- If someone asks a technical question outside William's services (e.g., "how do I configure Kubernetes?"), redirect to the discovery call or politely decline: "That's outside what WTS offers — but if there's a project where it fits in, the discovery call is a good place to start."
- If a visitor seems unsure, recommend the free Track 3 Discovery as the lowest-commitment first step.
- Keep responses short. Use plain language. No buzzword soup ("revolutionary AI", "industry-leading", "cutting-edge"). No credibility theater ("trusted by", "as featured in"). Honest, friendly, direct.

## What you don't do

- Don't quote prices that aren't on the lists above.
- Don't promise outcomes or timelines that haven't been scoped. ("It depends on your specific situation — that's what the discovery call is for.")
- Don't claim William has credentials he doesn't have (no "certified AI trainer", no "thousands of students trained").
- Don't describe AI as autonomous, replacing developers, or operating without human oversight. WTS is **AI-accelerated**, not AI-replaced. William stays in the loop on design, code review, and judgment.
- Don't speculate about which industries or contexts William has worked in. He's worked across post-secondary education, finance, and a range of small-business contexts. Beyond that, the discovery call is the right place.
- Don't share contact information beyond what's already on the site. The Contact page has email and a booking link.

## Tone

Friendly, plain-spoken, confident. The kind of person you'd want to grab a coffee with to figure out whether AI is right for your business. Not a sales bot, not a thought-leader, not a hype merchant. If AI isn't the right fit for something, say so.

If a visitor wants to book a call, point them to the Contact page.
```

- [ ] **Step 7.3: Verify the rewritten prompt lints clean**

```bash
cd D:/code/wts && npm run check:claims
```

Expected: `0 violations`. The new prompt is written specifically to pass the linter — if anything fires, it's a real drift to fix.

- [ ] **Step 7.4: Smoke-test the chatbot answers a basic question**

```bash
cd D:/code/wts && npm start
```

In a separate terminal:
```bash
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"What services do you offer?\"}]}"
```

Expected: a coherent response that lists the three tracks (Software Development, Training, Workflow Automation) with rough prices. The exact wording will vary by Claude run; what matters is:
- All three tracks are mentioned
- No case-study specifics (BIS, RoomBooking, ~90 apps)
- No buzzword soup
- Steers toward a discovery call

Stop the server.

- [ ] **Step 7.5: Commit**

```bash
git -C D:/code/wts add prompts/chatbot-system.md
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(chatbot): rewrite system prompt for three-track positioning

Replaces dual-track modernization + AI consulting framing with the
three-track structure (AI Software Dev / AI Training / AI Workflow
Automation). Removes case-study facts (BIS, RoomBooking, ~90-app catalog)
since the public site no longer carries them. Preserves safety patterns:
no invented prices, redirect specific-project questions to the discovery
call, no autonomous-AI framing, no credibility theater.

Pricing in the prompt matches pricing.html exactly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Surgical edits to `index.html`, `about.html`, `faq.html`, `contact.html`

**Files:**
- Modify: `index.html`, `about.html`, `faq.html`, `contact.html`

These are smaller, targeted changes. Group into one commit at the end.

### 8a. `index.html`

- [ ] **Step 8.1.1: Update hero**

Find the hero section. Replace the headline, two paragraphs, and the "See the Proof" button block:

Find:
```html
<span class="inline-block bg-gold/15 text-gold text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">AI-Accelerated Software Engineering</span>
<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
  Legacy modernization in <span class="text-gold">days</span>, not months.
</h1>
<p class="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
  Senior software engineer with 12+ years in .NET, Oracle, and Classic ASP. AI-augmented delivery means rebuilds that traditional firms quote in months ship in days, fully tested, fully documented, owned by your team.
</p>
<p class="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
  Also: practical AI consulting for finance teams and small businesses. No hype, no slide decks, just working software.
</p>
<div class="flex flex-col sm:flex-row gap-4">
  <a href="contact.html" class="inline-block bg-gold text-navy font-semibold text-lg px-8 py-4 rounded hover:bg-gold-light transition-colors duration-200 text-center">
    Book a Free Discovery Call
  </a>
  <a href="case-studies.html" class="inline-block border-2 border-gold/60 text-gold font-semibold text-lg px-8 py-4 rounded hover:bg-gold/10 transition-colors duration-200 text-center">
    See the Proof →
  </a>
</div>
<p class="text-gray-400 text-sm mt-8 max-w-2xl">
  Recent: RoomBooking, a legacy Oracle PL/SQL booking app rebuilt as .NET 8 Blazor Server in 5 days. Currently in QA, go-live pending organizational approval.
</p>
```

Replace with:
```html
<span class="inline-block bg-gold/15 text-gold text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">AI for Local Business</span>
<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
  Practical <span class="text-gold">AI services</span> for Kelowna business.
</h1>
<p class="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
  Three ways I help: AI-accelerated software development, hands-on AI training, and AI workflow automation. Senior engineering, plain language, fixed prices.
</p>
<p class="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
  12+ years professional engineering, AI-leveraged. No hype, no slide decks, no junior staff — just working software, working automations, and training that sticks.
</p>
<div class="flex flex-col sm:flex-row gap-4">
  <a href="contact.html" class="inline-block bg-gold text-navy font-semibold text-lg px-8 py-4 rounded hover:bg-gold-light transition-colors duration-200 text-center">
    Book a Free Discovery Call
  </a>
  <a href="services.html" class="inline-block border-2 border-gold/60 text-gold font-semibold text-lg px-8 py-4 rounded hover:bg-gold/10 transition-colors duration-200 text-center">
    See the Three Tracks →
  </a>
</div>
```

(Note: the "Recent: RoomBooking..." paragraph is removed entirely — proof off-site.)

- [ ] **Step 8.1.2: Replace the "Services Preview" section**

Find `<!-- ===== SERVICES PREVIEW ===== -->` and replace the entire `<section>` block with:

```html
<!-- ===== SERVICES PREVIEW ===== -->
<section class="py-16 md:py-20" style="background-color: #f8f9fa;">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
      Three tracks, one engineer
    </h2>
    <p class="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-12">
      Pick the one that fits. Or book a free call and I'll help you figure it out.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Track 1 -->
      <div class="bg-white rounded-lg shadow p-8 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 1</span>
        <h3 class="text-xl font-semibold text-navy mb-3">AI Software Development</h3>
        <p class="text-gray-600 mb-4 flex-1">Custom apps, modernizations, and enhancements. Built faster because AI does the grunt work. From $2,500 audits to fixed-price builds.</p>
        <a href="services.html#ai-development" class="text-gold font-medium hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

      <!-- Track 2 -->
      <div class="bg-white rounded-lg shadow p-8 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 2</span>
        <h3 class="text-xl font-semibold text-navy mb-3">AI Training</h3>
        <p class="text-gray-600 mb-4 flex-1">1:1 hands-on sessions, group workshops, or custom curriculum for your team. In-person in Kelowna or online.</p>
        <a href="services.html#ai-training" class="text-gold font-medium hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

      <!-- Track 3 -->
      <div class="bg-white rounded-lg shadow p-8 flex flex-col">
        <span class="text-xs font-bold uppercase tracking-widest text-gold-dark mb-3">Track 3</span>
        <h3 class="text-xl font-semibold text-navy mb-3">AI Workflow Automation</h3>
        <p class="text-gray-600 mb-4 flex-1">Chatbots, integrations, internal tooling. Free discovery, small builds from $2,500, scoped per project.</p>
        <a href="services.html#ai-automation" class="text-gold font-medium hover:text-gold-dark transition-colors duration-200">Learn more &rarr;</a>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 8.1.3: Update the "Why Work With" section**

Find `<h2>Why Work With William Tucker Solutions</h2>` and verify the three columns still apply (they should — "Days, Not Months" / "Senior Engineer Start to Finish" / "You Own the Outcome"). The content is reusable; no change needed unless any phrasing references modernization specifically. Spot-check the prose and adjust only if the text is modernization-only. Most likely no edit needed.

- [ ] **Step 8.1.4: Update the social-proof stat strip**

Find the section with three stat blocks (12+, 5, 0). Replace the middle stat:

Find:
```html
<div class="flex flex-col items-center text-center py-10 px-8 border-b md:border-b-0 md:border-r border-gray-200">
  <p class="text-4xl font-bold text-navy mb-2">5</p>
  <p class="text-gray-600">Legacy systems rebuilt as .NET 8 Blazor in 2026</p>
</div>
```

Replace with:
```html
<div class="flex flex-col items-center text-center py-10 px-8 border-b md:border-b-0 md:border-r border-gray-200">
  <p class="text-4xl font-bold text-navy mb-2">3</p>
  <p class="text-gray-600">Service tracks: dev, training, automation</p>
</div>
```

(Removes the "5 modernizations" claim, which was proof-on-site language. The 12+ years and 0 affiliations stats stay.)

- [ ] **Step 8.1.5: Remove the "Small Business CTA" duplicate or update it**

The "For Small Business Owners" section near the bottom currently positions "not a finance team? AI still works for you." Since the dual-track / finance-team framing is gone, simplify:

Find:
```html
<p class="text-gold font-semibold uppercase tracking-widest text-sm mb-3">For Small Business Owners</p>
<h2 class="text-3xl font-bold text-white mb-4">Not a finance team? AI still works for you.</h2>
<p class="text-gray-300 leading-relaxed">
  Stop copying data between spreadsheets. Stop answering the same customer questions all week. Stop writing proposals from scratch. There's an AI solution for every one of these, built for businesses of any size.
</p>
```

Replace with:
```html
<p class="text-gold font-semibold uppercase tracking-widest text-sm mb-3">For Small Business Owners</p>
<h2 class="text-3xl font-bold text-white mb-4">Local business AI — without the buzzwords.</h2>
<p class="text-gray-300 leading-relaxed">
  Stop copying data between spreadsheets. Stop answering the same customer questions all week. Stop writing proposals from scratch. There's an AI solution for every one of these, built for businesses of any size.
</p>
```

- [ ] **Step 8.1.6: Update footer tagline**

Same as Tasks 4–6:
```html
<p class="text-gray-400">AI-accelerated software development, training &amp; workflow automation</p>
```

- [ ] **Step 8.1.7: Update meta description and OG description**

Replace both with:
```
AI services for Kelowna small business: AI-accelerated software development, hands-on AI training, and AI workflow automation. Senior engineering, plain language, fixed prices.
```

### 8b. `about.html`

- [ ] **Step 8.2.1: Read current about.html structure**

```bash
cd D:/code/wts && wc -l about.html
```

Read it via the Read tool to see the structure.

- [ ] **Step 8.2.2: Trim career history to one line**

Per spec §10.5 and `project-site-audience` memory, the site isn't selling credibility. Find the work-history block. If it lists multiple roles in detail, replace the whole block with a single paragraph:

```html
<p class="text-gray-600 leading-relaxed mb-6">
  Senior software engineer with 12+ years of professional experience. Currently a programmer/analyst at a BC post-secondary institution since 2016, and the founder of WTS in 2026. Background includes deep Oracle, .NET, Classic ASP modernization work, and AI-accelerated delivery since 2024.
</p>
```

Remove dated TRU history, employer names, and quantified work (e.g., "delivered N modernizations"). Keep one mention of "12+ years professional experience."

If about.html has a "What I work on" / "Specialties" section, replace any dual-track language with three-track:

```html
<p class="text-gray-600 leading-relaxed">
  WTS offers three services: AI-accelerated software development, AI training (1:1 and group), and AI workflow automation. The common thread is hands-on senior engineering plus AI agents doing the boilerplate — which is what makes small-business pricing and turnaround possible.
</p>
```

- [ ] **Step 8.2.3: Update footer tagline + meta description**

Same footer tagline change. Update meta to reflect three-track positioning.

### 8c. `faq.html`

- [ ] **Step 8.3.1: Read current faq.html**

Read it via the Read tool to inventory current Q&A items.

- [ ] **Step 8.3.2: Replace modernization-specific Q&As with track-relevant ones**

For each Q&A, classify it:
- **Generic (keep):** anything about pricing process, working remotely, contracts, payment.
- **Modernization-specific (replace or drop):** "What languages do you modernize?" / "How does the Oracle migration work?" / "What's the modernization assessment?"
- **AI-track-relevant (add):** these are missing.

Add Q&As covering:

```html
<h3 class="text-lg font-semibold text-navy mb-2">Which of the three tracks fits my situation?</h3>
<p class="text-gray-600">If you need software built or modernized: Track 1. If you or your team want to learn to use AI properly: Track 2. If you have a process or workflow you want AI to handle: Track 3. Not sure? The free 30-minute discovery call is exactly for figuring that out.</p>
```

```html
<h3 class="text-lg font-semibold text-navy mb-2">What does "AI-accelerated" actually mean?</h3>
<p class="text-gray-600">I use AI agents (mostly Claude) to handle the boilerplate, repetitive, and search-the-docs parts of software work. I still do the engineering, planning, code review, and architectural decisions — AI doesn't replace any of that. The result is roughly the same scope a traditional dev shop would quote in months, shipped in days.</p>
```

```html
<h3 class="text-lg font-semibold text-navy mb-2">Are you a certified AI trainer?</h3>
<p class="text-gray-600">No. I'm a working software engineer who happens to use AI every day to ship production software, and I teach the workflow I actually ship with. If you want certification-track training, look elsewhere. If you want hands-on, in-your-real-systems training, that's me.</p>
```

```html
<h3 class="text-lg font-semibold text-navy mb-2">Do you take work outside Kelowna / BC?</h3>
<p class="text-gray-600">Yes — most work is remote-friendly. In-person workshops happen in the Okanagan; everything else can run online. I'm referral-driven, so most clients arrive that way regardless of location.</p>
```

Drop any Q&As that specifically reference modernization-only context (Crystal Reports, PL/SQL, .NET 8 Blazor — unless wrapped in the broader "Track 1" framing).

- [ ] **Step 8.3.3: Update footer tagline + meta description.**

### 8d. `contact.html`

- [ ] **Step 8.4.1: Add the "references and demos" line**

Per spec §3 contact.html row: add one line near the booking CTA.

Find an appropriate spot — likely just below the Calendly embed or the main CTA paragraph. Add:

```html
<p class="text-sm text-gray-500 mt-4">
  References and live demos available on the discovery call.
</p>
```

- [ ] **Step 8.4.2: Update footer tagline + meta description.**

### Wrap up Task 8

- [ ] **Step 8.5: Lint and build**

```bash
cd D:/code/wts && npm run check:claims && npm run build
```

Both pass.

- [ ] **Step 8.6: Visual smoke check each page**

```bash
cd D:/code/wts && npm start
```

Open and visually verify each of:
- `http://localhost:3000/index.html`
- `http://localhost:3000/about.html`
- `http://localhost:3000/faq.html`
- `http://localhost:3000/contact.html`

For each: hero/intro reads cleanly, three-track references are consistent, no "Case Studies" link, footer tagline updated, no orphaned modernization claims.

Stop server.

- [ ] **Step 8.7: Commit**

```bash
git -C D:/code/wts add index.html about.html faq.html contact.html
git -C D:/code/wts commit -m "$(cat <<'EOF'
feat(site): surgical reframe of index/about/faq/contact for three tracks

- index.html: hero, services preview, stat strip, SMB CTA all rewritten
  around three-track positioning. RoomBooking proof line removed.
- about.html: career history trimmed to one line; dual-track replaced
  with three-track summary (per project-site-audience memory).
- faq.html: modernization-specific Q&As replaced with track-relevant
  ones including "which track fits" and "are you certified".
- contact.html: added "references and demos on the discovery call" line.
- All four files: footer tagline updated to match new positioning.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Final pass — full verification

**Files:** none modified

- [ ] **Step 9.1: Full linter + test sweep**

```bash
cd D:/code/wts && npm run test:claims && npm run check:claims && npm run build
```

Expected: tests pass, linter reports 0 violations, build succeeds.

- [ ] **Step 9.2: Cross-page consistency check**

Run:
```bash
grep -rln "case-studies\|Case Studies\|modernization-pricing\|ai-consulting" D:/code/wts --include="*.html"
```

Expected: empty output (no stale modernization-era anchors or labels).

```bash
grep -rln "checklist.html" D:/code/wts --include="*.html"
```

Expected: empty.

```bash
grep -rln "Legacy modernization &amp; AI consulting" D:/code/wts --include="*.html"
```

Expected: empty (footer tagline updated everywhere).

- [ ] **Step 9.3: Manual visual review — every page**

```bash
cd D:/code/wts && npm start
```

Open each page in a browser, click through every nav link, and verify:
- `http://localhost:3000/` (index.html)
- `http://localhost:3000/services.html`
- `http://localhost:3000/pricing.html`
- `http://localhost:3000/small-business.html`
- `http://localhost:3000/about.html`
- `http://localhost:3000/faq.html`
- `http://localhost:3000/contact.html`
- `http://localhost:3000/privacy.html`

Checks per page:
- Nav has no "Case Studies" link
- Footer Quick Links has no "Case Studies"
- Footer tagline reads "AI-accelerated software development, training & workflow automation"
- No orphan references to BIS, RoomBooking, "~90-app catalog", modernization-tier-specific copy outside the AI Software Development track

Confirm the chatbot still loads on pages that include it (index.html, small-business.html) and answers a basic question coherently with three-track content.

Stop server.

- [ ] **Step 9.4: Push the branch to origin**

```bash
git -C D:/code/wts push -u origin feat/ai-tracks-reframe
```

- [ ] **Step 9.5: Open a PR (but do NOT merge yet)**

```bash
gh pr create --title "feat: reframe site around three AI service tracks" --body "$(cat <<'EOF'
## Summary

Reframes the WTS public site from dual-track (Modernization + AI Consulting) to three AI service tracks:

1. **AI-Accelerated Software Development** — modernizations, enhancements, greenfield builds
2. **AI Training** — 1:1 sessions, group workshops, custom curriculum
3. **AI Workflow Automation** — chatbots, integrations, custom MCP servers, internal tooling

Drops case-studies and checklist pages; proof now happens in the discovery call (per `project-site-no-work-samples` memory). Extracts the chatbot system prompt to `prompts/chatbot-system.md` and rewrites it for three-track positioning. Adds 5 new linter patterns guarding against the new failure modes (autonomous-AI framing, AI certifications, quantified-training claims, buzzword soup, credibility theater).

Pricing anchored on market research (ChatGPT.ca, Roving Leads, Solway):
- Training: $275/90min · $2,500 half-day · $4,000 full-day · from $7,500 custom · optional $1,250/mo retainer
- Automation: Free discovery · $2,500 small · $7,500 medium · $1,000/mo retainer
- Software dev: $2,500 audit · $10–30K build · $1,500/mo support (unchanged)

Spec: `docs/superpowers/specs/2026-05-15-ai-tracks-site-reframe-design.md`
Plan: `docs/superpowers/plans/2026-05-15-ai-tracks-site-reframe.md`

## Test plan

- [ ] `npm run test:claims` — passes (existing 27 + 16 new = 43 tests)
- [ ] `npm run check:claims` — 0 violations across all HTML and `prompts/chatbot-system.md`
- [ ] `npm run build` — succeeds (Tailwind compile clean)
- [ ] `npm start` and visually verify each page (index, services, pricing, small-business, about, faq, contact, privacy)
- [ ] Chatbot answers "What services do you offer?" with three tracks (no case-study facts)
- [ ] **William explicitly approves locally before merge** (per `feedback-local-test-before-merge` memory — master push triggers deploy)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 9.6: STOP — wait for William's local approval before merging**

**Critical:** per the `feedback-local-test-before-merge` memory, do NOT merge to master without William's explicit local-test approval. Master push triggers a deploy to the live site.

Report PR URL to William. Wait for his explicit "merge it" go-ahead.

When approved, merge via:
```bash
gh pr merge --merge --delete-branch
```

(Or via the PR UI — either is fine. Use `--merge` not `--squash` so the commit-by-commit history is preserved as revert points.)

---

## Self-review against spec

After the plan is written, verify every spec requirement is covered:

**§1 Goal:** three-track reframe → Tasks 4, 5, 6, 7, 8 ✅
**§2 Non-goals:** no case-studies → Task 1 deletes ✅
**§3 Page inventory:** every row mapped → Tasks 1 (deletes), 4 (services), 5 (pricing), 6 (small-business), 7 (chatbot), 8 (index/about/faq/contact) ✅
**§4 Track content design:** Tasks 4, 6 ✅
**§5 Pricing:** Task 5 ✅
**§6 Chatbot:** Tasks 2 (extract), 7 (rewrite) ✅
**§7 Linter patterns:** Task 3 (5 patterns + tests) ✅
**§8 Commit shape:** plan ordered to match ✅
**§9 Acceptance criteria:** verified in Task 9 ✅
**§10 Resolved decisions:** all pricing locked in Tasks 4, 5, 6; about.html trim in Task 8 ✅
**§11 Out of scope:** nothing added beyond scope ✅
