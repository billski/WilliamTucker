# CLAUDE.md

This file orients agents working in `D:\code\WTS` (the William Tucker
Solutions marketing site). Read it before editing any copy.

## Source of truth

- **`D:\code\cv\PROFILE.md` is canonical** for every fact about William's
  career, projects, timelines, and stack. When in doubt, read it.
- The workspace-level `D:\code\CLAUDE.md` framing rules apply (auto-loaded
  by Claude Code; restated below for proximity).
- Address the user as **Will** or **William**. Never **Bill**, even if
  older docs use it.

## The recurring failure mode

Four of the last five commits before this file existed were "credibility
sweeps" — agents had inflated claims while editing copy ("15+ years",
"BIS in 2 days", "Room Booking in production") and a human had to revert.

**Run `npm run check:claims` before committing copy changes.** The build
pipeline runs it automatically; if it fires, fix the copy. Do not weaken
the patterns to make violations disappear.

When a credibility sweep happens despite the linter, the fix should also
add a new pattern in `scripts/check-claims.mjs` so that specific drift
cannot recur.

## Framing rules (verbatim from workspace CLAUDE.md)

- **12+ years** professional software experience (since 2013) — never
  "15+", never inflate.
- **Currently dual-role:** Programmer/Analyst at Vancouver Island
  University (Jul 2016 – Present) AND Founder of William Tucker Solutions
  (2026 – Present). WTS is not his sole employment.
- **AI-accelerated, never AI-replaced.** Describe AI work as augmented
  senior engineering, not "generated" or "automated."
- **RoomBooking is in QA, not production** — go-live blocked on
  organizational approval.
- **BIS was ~7 weeks (66 commits, 14 branches), not 2 days.**
- **Stack gaps are honest:** no production MySQL, no AWS, no Salesforce,
  no native mobile, no modern PHP framework experience. Do not infer
  transferable skills from adjacent tech.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, three-track positioning, top of funnel |
| About | `about.html` | William's bio + work history |
| Services | `services.html` | Three AI service tracks |
| FAQ | `faq.html` | Process / pricing / scope answers |
| Pricing | `pricing.html` | Service tier prices |
| Contact | `contact.html` | Calendly + email |
| Small business | `small-business.html` | Kelowna SMB-specific landing page |
| Privacy | `privacy.html` | Privacy notice |

## Other places facts and rules live

| Topic | Where |
|---|---|
| Brand voice / positioning | `PRODUCT.md` |
| Visual spec, anti-references | `DESIGN.md` + `DESIGN.json` |
| Chatbot system prompt | `server.js:28-194` (sync hazard — see below) |
| Deploy / launch process | `docs/launch-guide.md` |
| Sales materials | `docs/sales/` |
| Funding / grants | `GRANTS.md` |
| Known drift / TODOs | `docs/_backlog.md` |
| Linter pattern catalog | `scripts/check-claims.mjs` |

## Two surfaces, one source of truth

HTML page copy AND `server.js:28-194` (the chatbot system prompt) both
restate facts that originate in `PROFILE.md`. When PROFILE.md changes,
both surfaces must be updated together. The linter scans both. A future
task — logged in `docs/_backlog.md` — will extract the system prompt to
`prompts/chatbot-system.md` so it can be edited as plain prose.

## Project shape

- **Stack:** static HTML + Tailwind v4 + Express (chatbot proxy only).
- **Deploy:** Railway runs `npm run build`. A linter failure breaks the
  deploy by design.
- **Commands:**
  - `npm run check:claims` — run the linter only
  - `npm run test:claims` — run the linter's own unit tests
  - `npm run build` — linter + Tailwind compile (the deploy command)
  - `npm run watch` — Tailwind dev (no linter)
  - `npm start` — Express chatbot proxy

## Where to start

- **Editing copy:** read `PROFILE.md` §10 framing rules, edit the page,
  run `npm run check:claims`.
- **Uncertain about a claim:** log to `docs/_backlog.md` under
  "Suspected drift" instead of guessing.
- **Adding/changing a linter pattern:** edit `scripts/check-claims.mjs`
  `PATTERNS` array; add a test in `tests/check-claims.test.mjs`.
- **Unfamiliar territory:** consult the topic table above.
