---
title: WTS agent guardrails — design
domain: meta
status: active
last-reviewed: 2026-05-06
---

# WTS agent guardrails — design

> **What's in this doc:** the design for a lightweight agent-orientation + claim-linting system that targets the recurring credibility-sweep failure mode on the WTS marketing site.
>
> **What's NOT:** an implementation plan. The plan is the next artifact (writing-plans skill, separate file). This doc is the agreed shape.

## 1. Context and motivation

WTS (`D:\code\WTS`) is a one-person consulting marketing site: 10 static HTML pages, Tailwind v4, plus an Express server (`server.js`) that proxies a chatbot through the Anthropic SDK. The chatbot's system prompt is a ~165-line template literal embedded at `server.js:28-194` that restates facts about William's career.

The master source of truth for those facts is `D:\code\cv\PROFILE.md` (different repo). Workspace-level guardrails live in `D:\code\CLAUDE.md` and auto-load every session.

### The recurring failure mode

`git log --oneline -5` on master at design time:

```
52a7255 fix(about): drop TestDome/HackerRank certifications block
bc0c582 fix(site): extend credibility sweep to about/services/case-studies/faq
481e350 fix(site): remove residual side-stripe borders site-wide
29e8c81 fix(index): credibility sweep per PROFILE.md framing rules
e5a7a72 docs(impeccable): add DESIGN.md and DESIGN.json visual spec
```

Four of the last five commits are credibility sweeps — agents inflated claims while editing copy and a human had to catch and revert. Examples seen across history:

- "15+ years" of experience (PROFILE.md says 12+).
- "BIS in 2 days" (PROFILE.md says ~7 weeks, 66 commits, 14 branches).
- "Room Booking in production" (PROFILE.md says in QA awaiting institutional go-live).
- "AI-replaced" / "AI automation" framing (PROFILE.md mandates "AI-accelerated").
- TestDome/HackerRank certifications block (dropped in commit `52a7255`; should not return).
- "Bill" used as the user's name (workspace `CLAUDE.md` mandates "Will" or "William").

The system prompt at `server.js:28-194` already contains explicit rules forbidding several of these (e.g. "Never claim Room Booking is in production"). They were violated anyway. **Prose-based guardrails alone have demonstrably failed.**

## 2. Goal

Reduce credibility-sweep commits to near zero by introducing a deterministic build-time check that fails on known-bad claim patterns, plus a thin orientation layer so any agent landing in WTS knows the source-of-truth chain and how to run the check.

Success criteria:

1. A pattern that has caused a credibility-sweep commit in the past cannot reach `master` again without an explicit, commented opt-out.
2. A fresh agent can land in `D:\code\WTS` and within ~60 seconds know: (a) where facts come from, (b) what the framing rules are, (c) what to run before committing copy changes.
3. Total artifact size is small enough to read end-to-end in one pass (target: < 250 lines across all new files combined, excluding the linter script).

## 3. Non-goals

- Catching *all* drift. The linter targets unambiguous violations; subtle inflation, vibe drift, and implied claims are out of scope and remain the human reviewer's job.
- Replacing `PRODUCT.md` or `DESIGN.md`. Those already cover positioning and visuals well; the new docs route to them, do not restate them.
- Cloning DogMap's six-domain vault. WTS has no schema, no RLS, no migrations — most of that machinery solves problems WTS doesn't have.
- Extracting the chatbot system prompt out of `server.js`. Identified as a real but separate concern; logged in `_backlog.md` for future work.
- Building a `match-docs.mjs`-style routing system. With three new files, routing overhead would exceed the thing being routed.

## 4. File layout

```
WTS/
├── CLAUDE.md                                    [NEW]  ~80 lines — agent entry point
├── docs/
│   ├── _backlog.md                              [NEW]  ~20 lines — uncertainty escape valve
│   ├── superpowers/specs/
│   │   └── 2026-05-06-wts-agent-guardrails-design.md   (this doc)
│   ├── launch-guide.md                          (existing, untouched)
│   └── sales/                                   (existing, untouched)
├── scripts/
│   └── check-claims.mjs                         [NEW]  ~120 lines — deterministic linter
├── package.json                                 [EDIT] add `check:claims`, gate `build`
├── PRODUCT.md / DESIGN.md / DESIGN.json / GRANTS.md   (existing, untouched)
└── server.js                                    (untouched in this design — see §10)
```

## 5. Component: `CLAUDE.md` (root)

Target ~80 lines. Sections in order:

1. **Source of truth** (~10 lines)
   - `D:\code\cv\PROFILE.md` is canonical for every fact about William's career, projects, timelines, and stack.
   - Workspace `D:\code\CLAUDE.md` framing rules apply (auto-loaded; restated here for proximity, not replaced).
   - Address the user as "Will" or "William." Never "Bill," even when older docs use it.

2. **The recurring failure** (~12 lines)
   - One paragraph naming it: agents have repeatedly inflated claims while editing copy. Last 4 of 5 commits before this doc were sweep fixes.
   - One line: **"Run `npm run check:claims` before committing any copy change. The build runs it automatically; if it fires, fix the copy — do not bypass."**
   - One line: when a credibility sweep happens anyway, the fix includes a new pattern in `scripts/check-claims.mjs` so it can't repeat.

3. **Framing rules** (~12 lines)
   The five rules from workspace `CLAUDE.md`, restated verbatim for proximity:
   - 12+ years professional experience (since 2013) — never "15+", never inflate.
   - Currently dual-role: VIU Programmer/Analyst AND WTS founder. WTS is not his sole employment.
   - AI-accelerated, never AI-replaced. Augmented senior engineering, not "generated" / "automated."
   - Room Booking is in QA, not production. BIS was ~7 weeks (66 commits, 14 branches), not 2 days.
   - Stack gaps are honest: no production MySQL, no AWS, no Salesforce, no native mobile, no modern PHP framework experience.

4. **Page → file table** (~12 lines, inline)

   | Page | File | Purpose |
   |---|---|---|
   | Home | `index.html` | Hero, dual-track positioning, top of funnel |
   | About | `about.html` | William's bio + work history |
   | Services | `services.html` | Modernization + AI consulting service tiers |
   | Case studies | `case-studies.html` | BIS, Room Booking, Oracle MCP server |
   | FAQ | `faq.html` | Process / pricing / scope answers |
   | Pricing | `pricing.html` | Service tier prices |
   | Contact | `contact.html` | Calendly + email |
   | Small business | `small-business.html` | Kelowna SMB-specific landing page |
   | Privacy | `privacy.html` | Privacy notice |
   | Checklist | `checklist.html` | Pre-engagement checklist |

5. **Topic → file table** (~8 lines, inline)

   | Topic | Where |
   |---|---|
   | Brand voice / positioning / framing rules | `PRODUCT.md` |
   | Visual spec, anti-references, design principles | `DESIGN.md` + `DESIGN.json` |
   | Chatbot system prompt | `server.js:28-194` (sync hazard — see §6 of CLAUDE.md) |
   | Deploy / launch process | `docs/launch-guide.md` |
   | Sales materials | `docs/sales/` |
   | Funding / grants | `GRANTS.md` |
   | Known drift / TODOs | `docs/_backlog.md` |

6. **Two parallel sources of truth** (~6 lines)
   - HTML page copy AND `server.js:28-194` both restate facts that originate in PROFILE.md.
   - When PROFILE.md changes, both surfaces must be updated together. The linter scans both.
   - Future enhancement: extract the system prompt to `prompts/chatbot-system.md`. Logged in `_backlog.md`.

7. **Project shape** (~6 lines)
   - Stack: static HTML + Tailwind v4 + Express (chatbot proxy only).
   - Commands: `npm run build` (Tailwind compile + claim check), `npm run watch` (Tailwind dev), `npm start` (Express). `npm run check:claims` (linter only).
   - Deploy: Railway runs `npm run build`. A linter failure breaks the deploy by design.

8. **Where to start** (~4 lines)
   - For copy changes: read PROFILE.md §10 (framing rules), edit the page, run `npm run check:claims`.
   - For uncertainty about a claim: log to `docs/_backlog.md` instead of guessing.
   - For unfamiliar areas: consult the topic table in §5 above.

## 6. Component: `docs/_backlog.md`

Target ~20 lines. Three sections, populated at inception with the items already identified during design:

```markdown
---
title: WTS Backlog
status: active
last-reviewed: 2026-05-06
---

# WTS Backlog

Known gaps, deferred work, and unverified claims. When you notice something
uncertain or out of scope, append here instead of confabulating or
silently fixing.

## Suspected drift

_(empty at inception)_

## Tooling enhancements

- **Extract chatbot system prompt from `server.js:28-194` to
  `prompts/chatbot-system.md`.** Reduces a ~165-line prose blob inside JS
  to an editable file. Adds a startup-time read with a hard-fail guard.
  Deferred — done as its own task when the prompt is next edited.

## TODO verify

_(empty at inception)_
```

## 7. Component: `scripts/check-claims.mjs`

Target ~120 lines. ESM (matches `package.json` `"type": "module"`).

### 7.1 Inputs

- Walks the repo from project root.
- **Scans:** `*.html` (top-level), `server.js`, `prompts/*.md` (if present), `PRODUCT.md`.
- **Skips:** `node_modules/`, `.git/`, `.claude/`, `.agents/`, `.superpowers/`, `.worktrees/`, `css/`, `js/` (Tailwind-generated and third-party), `img/`, `docs/superpowers/` (specs may legitimately quote forbidden phrases as examples).

### 7.2 Pattern catalog

Each pattern is a record:

```js
{
  id: 'years-inflated',
  rule: /\b1[3-9]\+?\s*years?\b/i,
  reason: 'PROFILE.md §10: 12+ years (since 2013). Use "12+" or rephrase.',
  scope: 'line',                  // line | proximity
}
```

For proximity rules:

```js
{
  id: 'bis-compressed',
  primary: /\b(BIS|Facilities Information System|Facilities Info)\b/i,
  near:    /\b[12]\s*days?\b/i,
  window:  240,                   // chars; ~one paragraph
  reason:  'PROFILE.md §10: BIS was ~7 weeks (66 commits, 14 branches). Do not compress to "2 days".',
  scope:   'proximity',
}
```

Initial catalog (final wording lives in the script; this table is the spec):

| id | type | pattern | reason |
|---|---|---|---|
| `years-inflated` | line | `/\b1[3-9]\+?\s*years?\b/i` | PROFILE.md §10: 12+ years. |
| `name-bill` | line | `/\bBill\b/` (case-sensitive) | Workspace CLAUDE.md: "Will" or "William." |
| `ai-replaced` | line | `/\bAI[\s-]*(replaces?|replaced)\b/i` | PROFILE.md §10: AI-accelerated, never AI-replaced. |
| `ai-automation` | line | `/\bAI[\s-]*automation\b/i` | PROFILE.md §10: augmented senior engineering, not automation. |
| `legacy-certs` | line | `/\b(HackerRank\|TestDome)\b/i` | Removed in commit 52a7255; do not reintroduce. |
| `room-booking-prod` | proximity | `/room\s*booking/i` near `/in\s+production\|production[-\s]?ready\|live\s+in\s+production/i` | PROFILE.md §10: Room Booking is in QA. |
| `bis-compressed` | proximity | `/\b(BIS\|Facilities Information System)\b/i` near `/\b[12]\s*days?\b/i` | PROFILE.md §10: BIS was ~7 weeks. |
| `mysql-prod` | proximity | `/\bMySQL\b/i` near `/\bproduction\b/i` | PROFILE.md §10: no production MySQL. |
| `aws-prod` | proximity | `/\bAWS\b/` near `/\bproduction\b/i` | PROFILE.md §10: no AWS experience. |
| `salesforce-prod` | proximity | `/\bSalesforce\b/i` near `/\bproduction\b/i` | PROFILE.md §10: no Salesforce experience. |

The catalog lives in the script as a `const PATTERNS = [ ... ]` array so adding a pattern is a one-line change.

### 7.3 Suppression

A line containing `<!-- check-claims-allow: <reason> -->` (HTML comment) or `// check-claims-allow: <reason>` (JS comment) suppresses violations *on that line only*. Reason text is required (>= 10 chars) and is logged at runtime so suppression is visible in build output.

Suppressions exist for genuinely legitimate uses (e.g. quoting a forbidden phrase as an anti-example). They are deliberately verbose — easier to grep, harder to add unthinkingly.

### 7.4 Output and exit

On clean run:

```
check-claims: scanned 14 files, 0 violations.
```

On violations:

```
check-claims: 3 violations found.

  case-studies.html:42  [years-inflated]
    matched: "15+ years"
    reason : PROFILE.md §10: 12+ years (since 2013). Use "12+" or rephrase.

  services.html:88-91   [bis-compressed]
    matched: "BIS" + "2 days" within 240 chars
    reason : PROFILE.md §10: BIS was ~7 weeks. Do not compress to "2 days".

  server.js:142         [room-booking-prod]
    matched: "Room Booking" + "in production" within 240 chars
    reason : PROFILE.md §10: Room Booking is in QA.

To suppress a known-good case, add a check-claims-allow comment on the
offending line with a >=10-char reason. Do not weaken patterns to make
violations disappear; add suppressions or fix the copy.
```

Exit code: `0` clean, `1` on any violation.

### 7.5 Performance

Trivial: ~14 files, ~30k characters total. Should complete in well under 1 second. No watch mode required.

## 8. Component: `package.json` edits

```json
{
  "scripts": {
    "build": "npm run check:claims && npx @tailwindcss/cli -i src/input.css -o css/styles.css --minify",
    "watch": "npx @tailwindcss/cli -i src/input.css -o css/styles.css --watch",
    "start": "node server.js",
    "check:claims": "node scripts/check-claims.mjs"
  }
}
```

The current `package.json` has a duplicate `scripts` block (lines 6-9 and 17-21). This is harmless because the second one wins, but it's confusing. The edit also de-duplicates.

The check runs *before* Tailwind compile. If claims fail, no CSS is written, deploy aborts. This is the correct gate ordering.

## 9. Trade-offs and acknowledged limits

### What this catches

- Verbatim violations of phrases that have caused credibility-sweep commits before.
- New violations by future agents who try to write the same wrong claim.

### What this does NOT catch

- **Subtle drift.** "Modernized" vs "rebuilt." Soft inflation. Implied claims. These remain human-review territory.
- **Novel hallucinations.** A claim never seen before — e.g. a fabricated client name — won't match any pattern.
- **Pattern coverage gaps.** The linter is only as good as its catalog. Discipline: every credibility-sweep commit going forward should add a pattern.

### Cost of false positives

The proximity rules use a 240-char window. Realistic false-positive risk:

- `mysql-prod` / `aws-prod` / `salesforce-prod` could fire on legitimate negative claims ("no MySQL in production"). The `<!-- check-claims-allow: ... -->` suppression handles these. The first occurrence of each will require one suppression; thereafter zero.
- `name-bill` could fire on the github username `billski` if it appears in copy. Mitigated by the case-sensitive `\bBill\b` (won't match `billski`).
- `room-booking-prod` could fire if a page legitimately says "Room Booking is NOT in production." Suppression handles it.

False positives that block deploys are the linter's largest UX risk. The mitigation is tight patterns plus an obvious suppression mechanism with required reason text.

### Cost of false negatives

A claim that should be flagged but isn't. The mitigation is: when a credibility sweep happens, the fix commit *also* adds a pattern. The catalog grows monotonically.

## 10. What's deliberately deferred

| Item | Why deferred |
|---|---|
| Extract chatbot system prompt to `prompts/chatbot-system.md` | Real fix; separate scope; introduces a deploy failure path that needs its own design. Logged in `_backlog.md`. |
| Generate prompt from PROFILE.md (build step) | Cleanest answer; cross-repo (`D:\code\cv\`) build dependency; revisit if the prompt-extraction task lands first. |
| Pre-commit hook | Build-step gating already covers the deploy path. Pre-commit adds friction without much extra coverage at this scale. |
| Per-section `verified-against` frontmatter | No schema to verify against. PROFILE.md is the only ground truth. |

## 11. Implementation order

When the writing-plans skill produces the plan, sequence should be:

1. Create `scripts/check-claims.mjs` with the initial pattern catalog.
2. Edit `package.json` — add `check:claims` script, gate `build`, de-duplicate the scripts block.
3. Run `npm run check:claims` — observe initial violations on the live codebase, fix or suppress them.
4. Create `docs/_backlog.md`.
5. Create `CLAUDE.md`.
6. Final `npm run build` to confirm clean state.
7. Commit.

The linter comes first because steps 1-3 surface real violations the docs need to reference, and because the linter is the load-bearing piece.

## 12. Open questions

None blocking. Items the implementation may surface:

- Initial scan may turn up violations that need real fixes (not suppressions). If so, those fixes are part of the implementation, not a follow-up.
- Whether to also scan `docs/launch-guide.md` and `docs/sales/`. Default: yes, scan them. They are public-adjacent and prone to the same drift.
- Whether suppressions should expire (e.g. require re-justification quarterly). Out of scope; revisit if suppressions accumulate.
