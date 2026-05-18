# CLAUDE.md

This file orients agents working in `D:\code\WTS` (the William Tucker
Solutions marketing site). Read it before editing any copy.

## Read the vault first

This project has a documentation vault at `docs/` — start there before
guessing anything about architecture, deploy, contact-form, or
positioning. The vault is the authoritative source for codebase facts;
this CLAUDE.md is just orientation.

- **`docs/_index.md`** — vault home; lists every domain doc with
  one-line task hints. Read this before grepping the repo.
- **`docs/_meta/vault-conventions.md`** — REQUIRED before editing any
  doc under `docs/`.
- **`docs/_meta/docs-sync-prompt.md`** — REQUIRED when the user says
  "update docs" / "sync docs".

If you're debugging a failure mode and a domain doc seems relevant
(e.g., deploy caching, linter behavior, contact-form handler), read
that doc end-to-end before guessing. The vault was created on
2026-05-18 after a 3-hour cache-debugging incident that a 5-minute
read of a deploy doc would have prevented.

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
| Contact | `contact.html` | Reply-in-1-business-day form → posts to `/api/contact` |
| Small business | `small-business.html` | Kelowna SMB-specific landing page |
| Privacy | `privacy.html` | Privacy notice |

## Other places facts and rules live

For full docs use the vault. Quick-reference:

| Topic | Vault doc | Other |
|---|---|---|
| Three tracks / brand voice / framing rules | `docs/positioning.md` | `PRODUCT.md` (legacy — being migrated) |
| HTML page map / anchor naming / breakpoints | `docs/pages.md` | — |
| Linter patterns / suppressions / build integration | `docs/linter.md` | `scripts/check-claims.mjs` |
| GitHub Actions → DreamHost / Cloudflare / cache-busting | `docs/deploy.md` | `.github/workflows/deploy.yml` |
| `/api/contact` flow / Supabase / Turnstile / Resend | `docs/contact-flow.md` | `server.js`, `.env.example` |
| Visual system (colors, type, components) | `docs/visual-system.md` (stub) | `DESIGN.md` + `DESIGN.json` (current source) |
| Chatbot prompt / `/api/chat` / widget | `docs/chatbot.md` (stub) | `prompts/chatbot-system.md` (loaded by `server.js` at startup) |
| Known drift / TODO-verify | `docs/_backlog.md` | — |

Local-only / off-site:
- Launch process: `docs/launch-guide.md` (gitignored — local only)
- Sales materials: `docs/sales/` (gitignored — local only)
- Funding / grants: `GRANTS.md` (gitignored — local only)

## Two surfaces, one source of truth

HTML page copy AND `prompts/chatbot-system.md` (the chatbot system
prompt — loaded by `server.js` at startup) both restate facts that
originate in `PROFILE.md`. When PROFILE.md changes, both surfaces
must be updated together. The linter scans both. Pricing numbers,
in particular, must match exactly between `pricing.html` and the
prompt — see `docs/positioning.md` for the discipline.

## Project shape

- **Stack:** static HTML + Tailwind v4 + Express (chatbot proxy + contact-form endpoint).
- **Deploy:** Railway runs `npm run build`. A linter failure breaks the
  deploy by design.
- **Commands:**
  - `npm run check:claims` — run the linter only
  - `npm run test:claims` — run the linter's own unit tests
  - `npm run build` — linter + Tailwind compile (the deploy command)
  - `npm run watch` — Tailwind dev (no linter)
  - `npm start` — Express server (chatbot + contact form)

## Server endpoints

Express server (`server.js`, deployed to Railway):

| Route | Purpose | Notes |
|---|---|---|
| `POST /api/chat` | Anthropic chatbot proxy | Rate-limited 15/min/IP |
| `POST /api/contact` | Contact form lead intake | Upserts into WTSAdmin `contacts` table (Supabase service-role key), sends notification + auto-reply via Resend, verifies Cloudflare Turnstile token. See `.env.example` for required env vars. |
| `GET /health` | Health check | Reports whether the Anthropic API key is configured |

## Where to start

- **Editing copy:** read `PROFILE.md` §10 framing rules, edit the page,
  run `npm run check:claims`.
- **Uncertain about a claim:** log to `docs/_backlog.md` under
  "Suspected drift" instead of guessing.
- **Adding/changing a linter pattern:** edit `scripts/check-claims.mjs`
  `PATTERNS` array; add a test in `tests/check-claims.test.mjs`.
- **Unfamiliar territory:** consult the topic table above.
