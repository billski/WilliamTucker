---
title: Claim Linter
domain: linter
status: active
last-reviewed: 2026-05-18
verified-against:
  - script: scripts/check-claims.mjs (15 patterns at time of audit)
  - tests: tests/check-claims.test.mjs (47 tests pass)
---

# Claim Linter

> **What's in this doc:** what the `check-claims` linter does, how it's wired into the build, the pattern catalog, how to add a new pattern, suppression-comment syntax, scope rules (what gets scanned), and the failure-mode it's designed to prevent.
>
> **What's NOT:** deploy mechanics (→ [[deploy]]), the framing rules the linter enforces in plain language (→ [[positioning]]).

The linter exists to prevent credibility drift on copy. Four of the five commits immediately before its creation were "credibility sweeps" — agents had inflated William's experience or compressed project timelines while editing, and a human had to revert. The linter catches these regressions automatically before they ship.

---

## How it runs

<!-- verified-against: package.json scripts on 2026-05-18 -->

Two entry points, defined in `package.json:7-9`:

| Command | What it does | When it runs |
|---|---|---|
| `npm run check:claims` | Scans copy files for forbidden phrase patterns | Standalone; also as the first step of `npm run build`; also in the GitHub Actions `lint` job on every PR and master push |
| `npm run test:claims` | Runs `tests/check-claims.test.mjs` against the linter itself | Standalone; not in CI — tests are for local validation when adding patterns |

A non-zero exit from `check:claims` fails the build and (in CI) blocks the deploy. Treat the linter as a hard gate.

---

## Scope: what gets scanned

<!-- verified-against: scripts/check-claims.mjs:222-235 on 2026-05-18 -->

The walker in `scripts/check-claims.mjs:241-272` enumerates files using two rules:

**Top-level files** (`SCAN_TOP_LEVEL_FILES`, `scripts/check-claims.mjs:229-232`):
- `server.js`
- `PRODUCT.md`
- Any `*.html` file at the repo root that does NOT start with an underscore

**Nested files** (`SCAN_NESTED_FILES`, `scripts/check-claims.mjs:234-235`):
- `prompts/*.md` (so `prompts/chatbot-system.md` is scanned)

**Skipped directories** (`SKIP_DIRS`, `scripts/check-claims.mjs:222-225`):
`node_modules`, `.git`, `.claude`, `.agents`, `.superpowers`, `.worktrees`, `css`, `js`, `img`, `dist`, `.next`.

**Skipped path fragments** (`SKIP_PATH_FRAGMENTS`, `scripts/check-claims.mjs:227`):
`docs/superpowers/` — historical specs and plans aren't policed.

**Important:** vault docs under `docs/` are NOT currently scanned. If a vault doc starts citing forbidden phrases (e.g., "trained thousands of students" appearing in `positioning.md`), the linter won't catch it. This is a known scope gap — see [[_backlog]] if it becomes a problem.

A typical run scans 11 files (8 HTML + `server.js` + `PRODUCT.md` + `prompts/chatbot-system.md`). Output:

```
check-claims: scanned 11 files, 0 violations.
```

---

## Pattern catalog

<!-- verified-against: scripts/check-claims.mjs PATTERNS array on 2026-05-18 (15 patterns) -->

Patterns live in `scripts/check-claims.mjs:9-110` as a single `PATTERNS` array. Each pattern has an `id`, a `type` (`line` or `proximity`), and a `reason` string included in violation output.

### Line patterns

Run line-by-line. A regex match anywhere on a line fires the violation.

| `id` | What it catches | Why |
|---|---|---|
| `years-inflated` | `13+` through `19+` years | PROFILE.md §10: 12+ years since 2013. |
| `name-bill` | `Bill` as a standalone word | Workspace CLAUDE.md: address user as Will/William, never Bill. |
| `ai-replaced` | `AI replaces / replaced` | PROFILE.md §10: AI-accelerated, never AI-replaced. |
| `ai-automation` | `AI automation` as a phrase (NOT `AI Workflow Automation` — `workflow` breaks the regex) | PROFILE.md §10: augmented senior engineering, not automation. **This is why Track 3's anchor is `#ai-workflow-automation`, not `#ai-automation`** — see [[pages#anchor-naming]] for the full discussion. |
| `legacy-certs` | `HackerRank`, `TestDome` | Removed in earlier credibility sweep — do not reintroduce. |
| `ai-replaces-engineers` | `fully autonomous AI`, `no human in the loop`, `AI replaces developers/engineers` | Three-track reframe failure mode. |
| `ai-certified` | `certified AI trainer / consultant / practitioner`, `AI-certified` | William has no AI certifications. |
| `quantified-training` | `thousands of students/trainees/people`, `trained 10+/50+/100+ teams` | Training-track quantified claims aren't backed. |
| `buzzword-soup` | `industry-leading AI`, `cutting-edge technology`, `revolutionary AI/approach/platform` | Referral-driven plain voice; buzzwords are off-tone. |
| `credibility-theater` | `trusted by`, `as featured in`, `as seen in` | Site is referral-driven, not authority-led. |

### Proximity patterns

Match when two regexes both fire within a character window. Used for compound claims that need both halves to be wrong together.

| `id` | Primary regex | Near regex | Window | Why |
|---|---|---|---|---|
| `room-booking-prod` | `Room Booking` | `in production`, `production[-\s]?ready`, `live in production` | 240 chars | RoomBooking is in QA, not production. |
| `bis-compressed` | `BIS / Facilities Information System / Facilities Info` | `1 day / 2 days / etc.` | 240 chars | BIS was ~7 weeks, 66 commits, 14 branches. |
| `mysql-prod` | `MySQL` | `production` | 160 chars | No production MySQL experience. |
| `aws-prod` | `AWS` | `production` | 160 chars | No AWS experience. |
| `salesforce-prod` | `Salesforce` | `production` | 160 chars | No Salesforce experience. |

### Output format

A violation looks like (from `scripts/check-claims.mjs:309-320`):

```
check-claims: 1 violations found.

  contact.html:42  [name-bill]
    matched: Bill
    reason : Workspace CLAUDE.md: address the user as "Will" or "William," never "Bill."
```

---

## Adding a new pattern

When you notice a new failure mode (e.g., agents keep writing some forbidden phrase you didn't anticipate), add a pattern.

1. **Write the failing test first.** In `tests/check-claims.test.mjs`, append a block like:
   ```javascript
   const myPattern = PATTERNS.find(p => p.id === 'my-new-pattern');

   test('my-new-pattern flags the bad phrase', () => {
     assert.ok(myPattern, 'pattern not found in catalog');
     assert.ok(checkLine('Some text with the bad phrase here', 1, myPattern));
   });

   test('my-new-pattern does not flag legitimate copy', () => {
     assert.equal(checkLine('A clean sentence.', 1, myPattern), null);
   });
   ```
2. **Run `npm run test:claims` and watch it fail** with `pattern not found in catalog`. This confirms the test is actually checking the pattern existence.
3. **Add the pattern to the `PATTERNS` array** in `scripts/check-claims.mjs`. Match the existing style:
   ```javascript
   {
     id: 'my-new-pattern',
     type: 'line',
     rule: /\b(bad\s+phrase|other\s+bad\s+phrase)\b/i,
     reason: 'Why this is forbidden — cite the source-of-truth doc or memory.',
   },
   ```
4. **Run `npm run test:claims`** — all tests should now pass.
5. **Run `npm run check:claims`** against current content — must report `0 violations`. If it fires on real existing content, that means there's real drift to fix; DO NOT soften the pattern to make the violation disappear.
6. **Commit pattern + tests together** in one commit with a `feat(linter):` prefix.

The current 47-test suite (15 patterns × ~3 tests each on average + structural tests) is the floor. Don't ship a pattern without tests.

---

## Suppression comments

<!-- verified-against: scripts/check-claims.mjs:207-220 (SUPPRESS_RE) on 2026-05-18 -->

Sometimes a forbidden phrase appears legitimately — for example, a "What you don't do" rule that quotes the phrase to forbid it. The suppression mechanism is the escape valve.

### Syntax

The regex is `/(?:<!--|\/\/)\s*check-claims-allow:\s*([^>\n]+?)\s*(?:-->|$)/` — `scripts/check-claims.mjs:207`.

Two forms work:

```html
<!-- check-claims-allow: explain why this is OK in 10+ chars -->
```

```javascript
// check-claims-allow: explain why this is OK in 10+ chars
```

The reason text MUST be at least 10 characters (`MIN_REASON_LEN`, `scripts/check-claims.mjs:208`). Shorter reasons are rejected — the comment is treated as if it weren't there, and the violation fires.

### Placement

- For **line patterns**: the suppression comment must be on the SAME line as the matched text (`scripts/check-claims.mjs:288`).
- For **proximity patterns**: the suppression must be on the line of the PRIMARY match (`scripts/check-claims.mjs:298-299`). If the suppression is only on the near-match line, the violation still fires.

### When suppression is appropriate

✅ Quoting forbidden phrases to forbid them in agent-facing rules (`prompts/chatbot-system.md` does this 3 times).
✅ FAQ questions that themselves quote the forbidden phrase rhetorically (`faq.html:142` — "Are you a certified AI trainer?" with answer "No.").
✅ Inline doc comments in `PRODUCT.md` listing honest stack gaps (the rule itself names the forbidden word).

❌ Silencing a real claim that turns out to need fixing. If the linter fires on real copy and the suppression is being used to ship a credibility sweep, **stop**. Either fix the copy or refuse to ship.

The 6 active suppressions in this repo (as of 2026-05-18): 3 in `prompts/chatbot-system.md`, 3 in `PRODUCT.md`, 1 in `faq.html`. All legitimate.

---

## Build integration

`npm run build` runs `npm run check:claims` FIRST (`package.json:9`). If the linter fails, Tailwind never compiles and the CSS file isn't regenerated. This means a broken-copy commit can't accidentally ship just because the build technically succeeded.

The GitHub Actions deploy workflow runs `npm run check:claims` as a separate lint job (`.github/workflows/deploy.yml:10-21`) on every PR and master push. Failed lint = no deploy. See [[deploy#github-actions-workflow]].

---

## Anti-patterns

- **Weakening a pattern to silence a real violation.** The pattern is the canary. If it fires on real content, the content is wrong, not the pattern.
- **Adding suppressions without a meaningful reason.** Reasons under 10 chars are rejected; reasons like "needed" or "fine here" pass the length check but defeat the audit-trail purpose. Write a sentence explaining why this specific occurrence is legitimate.
- **Adding a pattern without a test.** Tests are how we know the pattern catches what it's supposed to and doesn't false-positive on adjacent legitimate content. Skipping them is how patterns rot.
- **Scoping the scanner more broadly without thinking about cost.** Adding all `docs/**/*.md` to scope would catch vault drift but would also re-scan ~5 large doc files on every build. If you go there, also add an HTML-comment-aware skip for the "What's in / What's NOT" examples that may quote forbidden phrases as anti-references.
