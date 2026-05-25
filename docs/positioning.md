---
title: Positioning & Brand Voice
domain: positioning
status: active
last-reviewed: 2026-05-24
verified-against:
  - source: 8 HTML pages on 2026-05-18; Track 3 Discovery duration row corrected 2026-05-24
  - prompt: prompts/chatbot-system.md
  - profile: D:/code/cv/PROFILE.md §10 framing rules
---

# Positioning & Brand Voice

> **What's in this doc:** the three AI service tracks, the credibility framing rules every copy edit must follow, who the site is for, the brand voice in three words, what the site explicitly is NOT, and the discipline rule that prevents merging to master without local-test approval.
>
> **What's NOT:** the visual design system (→ [[visual-system]] when written; for now see `DESIGN.md` + `DESIGN.json`), the page-level structure (→ [[pages]]), the linter that enforces the framing rules at build time (→ [[linter]]).

The site is the entire top-of-funnel for a one-engineer consulting practice in Kelowna, BC. There is no paid acquisition, no sales team, no SDR. Most clients arrive via referral. The site's job is **service confirmation + booking, not credibility argument** — the referral already did the credibility work.

---

## The three service tracks

<!-- verified-against: services.html sections #ai-development, #ai-training, #ai-workflow-automation on 2026-05-18 -->

| Track | Pitch | Pricing anchors |
|---|---|---|
| **Track 1 — AI-Accelerated Software Development** | Custom software, modernizations, and apps. AI agents handle the boilerplate; William handles engineering, planning, and review. Client owns the codebase at handoff. | $2,500 audit · $10,000–$30,000 build · $1,500/mo ongoing support |
| **Track 2 — AI Training** | Hands-on AI training from a daily practitioner. In-person in Kelowna or online. 1:1, group workshops, or custom team curriculum. | $275 per 90-min session · $2,500 half-day · $4,000 full-day · from $7,500 custom curriculum · $1,250/mo retainer |
| **Track 3 — AI Workflow Automation** | AI plugged into the tools and systems the client already uses — chatbots, custom integrations, internal tooling, agents, MCP servers. | Free 60-min discovery · $2,500 small build · $7,500 medium build · $1,000/mo maintenance |

These exact prices appear in two surfaces simultaneously: `pricing.html` and `prompts/chatbot-system.md`. **When pricing changes, BOTH surfaces must be updated together.** The linter doesn't catch numeric drift; agent discipline does.

Each track has a section ID used as an anchor across multiple pages — see [[pages#anchor-naming]]. Track 3 specifically uses `#ai-workflow-automation` (not `#ai-automation`) to avoid colliding with the credibility linter.

---

## Framing rules (the credibility floor)

These rules are the source of truth for every copy edit. The linter enforces most of them at build time — see [[linter#pattern-catalog]] — but the discipline must be in the head of whoever's writing the copy, not just in the regex.

### Years of experience

**12+ years professional software experience** (since 2013). Never "15+", never inflate. Linter pattern `years-inflated` blocks anything from 13+ through 19+.

### AI framing

**AI-accelerated, never AI-replaced.** Describe AI work as augmented senior engineering. The line items work-by-line: AI handles boilerplate, research, mechanical edits; William handles planning, architecture, debugging, judgment, accountability. Linter patterns `ai-replaced`, `ai-replaces-engineers`, and `ai-automation` enforce variants of this.

The word "automation" is forbidden as a descriptor of *his work* (`ai-automation` pattern), but Track 3 is legitimately called **AI Workflow Automation** because "workflow" sits between "AI" and "automation" and breaks the regex. The phrase "workflow automation" is fine; "AI automation" alone is not.

### Currently dual-role

William is currently **both** a Programmer/Analyst at Vancouver Island University (Jul 2016 – Present) AND the founder of William Tucker Solutions (2026 – Present). WTS is not his sole employment. Don't imply otherwise in bios.

### RoomBooking status

**In QA, not production.** Go-live is blocked on organizational approval, not engineering work. Frame as *"delivered end-to-end in 5 days as sole author; currently in QA and technically ready for production. Reference available on request."* Linter pattern `room-booking-prod` enforces this — and the doubles as an accountability signal in copy.

### BIS (Facilities Information System) timeline

**~7 weeks of AI-augmented development, 66 commits across 14 branches.** Not "2 days" — that was an earlier draft's compressed claim. The 7-week number with a real commit history is a *stronger* claim than "2 days" because it demonstrates planned, iterated, tested work. Linter pattern `bis-compressed` blocks the compressed version.

### Stack gaps (honest)

Acknowledge directly, don't infer transferable skills from adjacent tech:

- **No production MySQL.** PostgreSQL via Supabase is the closest equivalent.
- **No AWS.** Cloud infra is Vercel + Railway + Supabase + DreamHost.
- **No Salesforce / Apex / Flows.**
- **No native mobile (iOS/Android).** PWA exposure only.
- **No modern PHP framework experience.** Only PHP exposure is a 2012 TRU co-op.

Linter patterns `mysql-prod`, `aws-prod`, `salesforce-prod` enforce these as proximity rules (they fire if the named tech appears near "production" on the same line/within a window).

### AI training credentials

William is **not a certified AI trainer**. Framing for Track 2 is "active daily practitioner who teaches what he ships with," not "credentialled." The chatbot prompt and `faq.html:142` both quote this rule; both are linter-suppressed because they legitimately quote the forbidden phrase to forbid it. Linter pattern `ai-certified` blocks the credential claim; `quantified-training` blocks "trained N students" counts.

---

## Audience

The site is **referral-driven, local Kelowna SMB-first**. Most visitors arrive convinced; the site's job is to confirm services exist, let them pick the right track, and let them book a call.

The previous dual-track audience model ("Legacy modernization" buyers + "AI consulting for finance teams") is **obsolete as of PR #4 (2026-05-15)**. The three-track structure replaced it. If you encounter older docs (`PRODUCT.md` Users section, archived specs) describing two tracks, that's stale — fix it forward.

Implications for any copy edit:
- **Plain outcome-language over stack details.** Kelowna SMB owners don't care about Blazor vs Next.js — they care about "we'll automate your invoicing."
- **No "12+ years senior engineering" piled everywhere.** One mention is plenty.
- **No testimonial / "trusted by" / proof-reel modules.** Credibility comes from the referral. Linter pattern `credibility-theater` enforces this.
- **No buzzword soup** ("revolutionary AI", "industry-leading", "cutting-edge"). Linter pattern `buzzword-soup` enforces this.
- **CTAs lead to a discovery call.** Don't try to close on the page.

The memory `project-site-audience` codifies this for future agents.

---

## Brand voice in three words

**Competent. Plainspoken. Unhyped.**

A senior staff engineer talking to another technical buyer — or to a small-business owner who hates being marketed at. Confident without performing confidence. Specific over abstract. Numbers and names over adjectives.

Concrete tactical applications:

- **Verbs not vibes.** "Build", "rebuild", "integrate", "audit", "train" — not "transform", "harness", "unlock", "synergize".
- **Present tense.** "I build X" not "We could help you build X."
- **First person singular.** "I" / "me" — not "we" / "our team". One engineer; the design system reinforces this (no oversized founder photo, no fake team page).
- **Numbers anchored to real artifacts.** "7 weeks (66 commits, 14 branches)" beats "fast turnaround." Round-number marketing metrics get cut.
- **Friendly, not detached.** Plainspoken doesn't mean cold. The chatbot system prompt explicitly says "friendly, plain-spoken, confident — the kind of person you'd want to grab a coffee with."

---

## What the site explicitly is NOT

Three anti-references (carried from `DESIGN.md` and `PRODUCT.md`):

1. **The "AI consultancy" Squarespace template.** Purple/teal gradient hero, glowing brain-circuit stock photo, "We harness the transformative power of AI to unlock value." Decorated promise, no specific referent.
2. **The LinkedIn-influencer landing page.** Oversized founder photo, hand-drawn arrows, "I helped 47 founders 10x their revenue", neon CTAs, fake-handwritten testimonials.
3. **The Big-4 services page** (Accenture, Deloitte, EY AI offerings). Slide-deck aesthetics, "transformation journeys", "synergies", six-figure procurement vibe.

The connecting thread is **decoration without referent**. WTS visuals and copy must read as proof, not as marketing of proof.

---

## Deploy discipline (do not bypass)

These rules are codified in memory but written here so they're vault-discoverable:

### Never merge to master without local-test approval

`master` push triggers a DreamHost deploy. There is no preview / staging slot. Lint passing is not the same as William having seen the rendered pages on a real device. See `feedback-local-test-before-merge` memory and [[deploy#debugging-cache-problems-the-2026-05-17-playbook]].

When implementing a UI change, end the work with *"Want to test locally before I open the PR / merge?"* — not *"Pushing now."*

### Never `git add -A` in this repo

The workspace `CLAUDE.md` says it, the global Bash guidance says it, the WTS `CLAUDE.md` says it. The 2026-05-17 incident proved it: `git add -A` swept in 134 local-tooling files (`.agents/`, `.claude/skills/`, `.superpowers/`, business-sensitive docs, cross-project screenshots). **Always specific file paths.**

The `.gitignore` added in PR #7 is a safety net for the worst cases but it isn't comprehensive — discipline still matters. See [[deploy#the-rule]] for the cache-buster bump procedure that's the most common multi-file operation in this repo, and the proper way to do it without `-A`.

### Refer-then-update doc discipline

When a copy / structural change is made (e.g., the three-track reframe), the corresponding vault docs MUST be updated in the same PR. See [[vault-conventions#touching-a-doc]] for the per-doc rules. Specifically:
- New tracks / new pages / removed pages → update [[pages]]
- New positioning / new audience / new framing rules → update this doc
- New CSS class usage that changes `css/styles.css` → update [[deploy#css-cache-busting-discipline]] is not affected, but the cache-buster bump is required and tracked in [[deploy]]

If the PR doesn't update affected docs, it shouldn't merge.

---

## Source-of-truth hierarchy (for facts about William)

Vault docs document **the codebase**. Facts about William's career, projects, employment history, credentials, and stack live in **`D:\code\cv\PROFILE.md`** (outside this repo). PROFILE.md §10 has the framing rules verbatim; if this doc and PROFILE.md ever conflict on a framing rule, PROFILE.md wins and this doc gets corrected.

Currently this doc paraphrases PROFILE.md §10 — if the rules change there, they need to be re-synced here.

---

## Anti-patterns

| Don't | Do |
|---|---|
| Add a "Track 4" without explicit user request | Stick with three — they're the entire positioning |
| Pile "12+ years senior engineering" on every page | One mention is plenty |
| Add testimonials, "trusted by" badges, or proof modules | None — referral-driven means credibility lives off-site |
| Use the word "automation" to describe William's work | He doesn't automate — he ships engineering work with AI assist |
| Rename `#ai-workflow-automation` to `#ai-automation` | The linter will fire on every cross-page link |
| Quote pricing numbers from memory in a draft | Read `pricing.html` or `prompts/chatbot-system.md` and copy verbatim |
| Update positioning copy without updating both surfaces | The chatbot system prompt at `prompts/chatbot-system.md` mirrors site copy — if they drift, the chatbot says one thing and the page says another |
