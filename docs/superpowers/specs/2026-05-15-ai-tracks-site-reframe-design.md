# WTS Site Reframe: Three AI Tracks — Design Spec

**Branch:** `feat/ai-tracks-reframe` (off `master`, post agent-guardrails merge)
**Date:** 2026-05-15
**Status:** Awaiting William's review before plan writing.
**Source-of-truth references:**
- `D:/code/CV/PROFILE.md` §10 framing rules (AI-accelerated, not AI-replaced)
- `D:/code/wts/CLAUDE.md` (linter discipline, framing rules)
- Memory: [[project-site-no-work-samples]], [[project-site-audience]], [[feedback-local-test-before-merge]]

---

## 1. Goal

Reframe the WTS public site around three AI service tracks, dropping the case-studies / modernization-led positioning. The site's job becomes: confirm what services exist, let a referral-warm visitor pick the right track, and book a discovery call.

**The three tracks:**

1. **AI-Accelerated Software Development** — modernizations, enhancements, greenfield builds
2. **AI Training** — 1:1 sessions, group workshops, custom curriculum, in-person (Kelowna) or online
3. **AI Workflow Automation** — chatbots, AI integrations, custom MCP servers, internal automation

**Audience:** referral-driven local SMBs (Kelowna and surrounding BC). The site is not a cold-acquisition funnel and is not a credibility billboard. It does not carry case studies, testimonials, project galleries, or quantified credentials.

---

## 2. Non-goals

- Adding case studies, portfolios, "selected work", or testimonial blocks. Confirmed removed per [[project-site-no-work-samples]].
- Adding "trusted by" / "as featured in" / logos / proof reels.
- Quantified credibility claims ("trained N students", "shipped N projects").
- Touching `privacy.html`.
- Building a Stripe checkout or paid-product page.
- A second voice for institutional buyers — the site is SMB-first; institutional buyers are referrals and the chatbot can flex if needed.

---

## 3. Page inventory

| Page | Fate | Notes |
|---|---|---|
| `index.html` | Surgical edit | Hero rewritten to lead with the three tracks. Three track teasers replace the current dual-track block. Existing CTAs preserved. |
| `services.html` | Full rewrite | Three stacked sections, one per track. Plain outcome-language. |
| `pricing.html` | Full rewrite | Three sections matching the tracks. Anchor price + "talk to me" CTA per track. Discovery-call block stays at top. |
| `small-business.html` | Rewrite | Kelowna SMB funnel into the three tracks. Friendlier voice than `services.html`. |
| `about.html` | Surgical edit | Career bio reframed around "12+ years engineering, AI-leveraged" (one mention, not a credibility paragraph). |
| `faq.html` | Surgical edit | Replace modernization-specific Q&As with track-relevant ones. Add Training and Automation Q&As. |
| `contact.html` | Surgical edit | Add one line: *"References and live demos available on the discovery call."* Otherwise unchanged. |
| `case-studies.html` | **DELETED** | Confirmed. |
| `checklist.html` | **DELETED** | Was a modernization pre-engagement checklist. Doesn't fit. |
| `privacy.html` | Untouched | Boilerplate. |
| `server.js` chatbot prompt (L28–194) | Extract + rewrite | New file `prompts/chatbot-system.md`; `server.js` reads at startup with hard-fail guard if missing. Honors existing `docs/_backlog.md` extraction item. |
| `scripts/check-claims.mjs` | Pattern additions | 4–5 new patterns (see §7). |
| Navigation (all pages with a nav) | Edit | Remove "Case Studies" link. Order: Services, Small Business, About, Pricing, Contact, Client Portal. |

---

## 4. Track content design

Each track section on `services.html` follows the same structure: positioning line, "who it's for" sub-blocks (1–2, kept casual), "what we sell" list, and a "let's talk" CTA. No case-study mini-proofs. No counter-trust "when this isn't a fit" block.

### 4.1 AI-Accelerated Software Development

- **Positioning line:** *"Custom software, modernizations, and apps — built faster because I use AI agents to do the grunt work."*
- **Who it's for:** any local business or organization that needs custom software, a rebuild of an aging system, or enhancements to what they already run.
- **What we sell:** new web apps, app rebuilds (modernizations), enhancements to existing apps, integrations.
- **Pitch:** same scope as a traditional dev shop, faster and cheaper, because AI handles the boilerplate while William handles the engineering, planning, and review. Client owns the codebase.
- **One mention of experience:** *"12+ years professional software engineering, AI-leveraged."* No further credentialism.

### 4.2 AI Training

- **Positioning line:** *"Learn to use AI well, from someone who uses it every day to ship real software."*
- **Who it's for:** individuals (devs, consultants, knowledge workers) and small teams who want to actually use AI in their work, not just talk about it.
- **What we sell:** 1:1 sessions, group workshops (half-day / full-day), custom team curriculum. In-person (Kelowna) or online.
- **Pitch:** hands-on, tied to real workflows, not slide decks. William teaches the workflow he ships with daily — Claude Code, planning-first AI patterns, agent tooling, prompt design.
- **Credibility caveat (enforced by linter):** no "certified AI trainer", no "N students trained", no "AI certified". Honest framing only: *daily practitioner who teaches what he ships with.*

### 4.3 AI Workflow Automation

- **Positioning line:** *"AI plugged into the tools and systems you already use."*
- **Who it's for:** businesses that want AI inside a specific business process — a chatbot on a site, an AI assistant tied to internal tools, a custom integration with an existing system.
- **What we sell:** chatbots, Claude API integrations, custom MCP servers, agent workflow design, internal automation.
- **Pitch:** figure out where AI is actually useful in the business (and where it isn't), build the integration, hand it over working. Discovery → build → optional retainer.

### 4.4 Voice notes (all three tracks)

- Confident-friendly, not technical-thought-leader. Kelowna SMB voice.
- Prefer outcome-language over stack details ("we'll automate your invoicing" > "we'll build a Next.js + Supabase pipeline").
- No buzzword soup. No "revolutionary", "cutting-edge", "industry-leading".
- The honesty about what AI does and doesn't do is the differentiator — lean into it lightly, don't moralize.

---

## 5. Pricing page design

Single page, three sections, one per track. Free 30-minute discovery call block stays at the top. Each section: one anchor price (or range), one CTA to contact.

### 5.1 Track 1 — Software Development pricing (existing structure retained)

| Tier | Price | Use |
|---|---|---|
| Discovery / Audit | $2,500 (fixed) | Audit one system, written plan, credited toward a build. |
| Build | $10,000–$30,000 (scoped per project) | Full delivery of one app, modernization, or enhancement. |
| Ongoing Support | $1,500/mo (monthly retainer) | Bug fixes, small enhancements, priority response. |

### 5.2 Track 2 — Training pricing (confirmed 2026-05-15 after market research)

| Tier | Price (CAD) | Use |
|---|---|---|
| 1:1 hands-on session | **$275 / 90 min** | Individual coaching, in-your-systems work. ~$185/hr. |
| Half-day workshop | **$2,500** | Group session, up to 12 people. 3–4 hours. |
| Full-day workshop | **$4,000** | Group session, up to 12 people. 6–7 hours. |
| Custom team curriculum | **Starts at $7,500** | Tailored to the team's actual workflows. |
| Training retainer (optional) | **$1,250 / month** | Ongoing 1:1 or small-group sessions, 2–3 hours per month, priority email between. |

**Pricing rationale:** positioned as the *hands-on, builder-who-teaches* tier — comparable to Roving Leads' $300 USD ($410 CAD) hands-on coaching and ChatGPT.ca's $2,000–$3,000 CAD half-day workshops. Deliberately *below* the US comparables (~$300/hr CAD market rate for senior boutique) to stay Kelowna-SMB-friendly without underselling. The shallower "strategic advisory" tier ($150 USD / 90 min) is explicitly *not* the comparable — different scope of work.

### 5.3 Track 3 — Workflow Automation pricing (confirmed 2026-05-15 after market research)

| Tier | Price (CAD) | Use |
|---|---|---|
| Discovery / scoping | **Free** (30–60 min) | Figure out what's actually useful to automate. |
| Small build | **$2,500** | Site chatbot, simple automation, single integration. |
| Medium build | **$7,500** | Custom MCP server, multi-step integration, internal tool. |
| Maintenance retainer | **$1,000 / month** | Ongoing care for shipped automations, priority response, small enhancements. |

**Pricing rationale:** Discovery stays free as a referral-friendly entry point (no friction). Small/medium build anchors sit at the floor and middle of ChatGPT.ca's Automation Starter ($2,500–$7,500) and AI agent ($5,000–$15,000) ranges respectively. Retainer raised from the original placeholder ($500/mo) to $1,000/mo — still well below market ($2,000/mo entry on ChatGPT.ca, $999 USD hands-on on Roving Leads) but defensible for solo SMB scope.

---

## 6. Chatbot prompt — extract + rewrite

### 6.1 Extract

- **New file:** `prompts/chatbot-system.md` — the system prompt as plain prose.
- **Edit `server.js`:** at startup, read `prompts/chatbot-system.md` synchronously and fail hard with a clear error if missing or empty. Remove the inline 165-line prompt block (L28–194).
- **Linter scope:** already covers `prompts/*.md` (per CLAUDE.md scope note), so the new file is automatically lint-checked.

### 6.2 Rewrite

The new prompt is built around three goals: help a referral-warm visitor (a) pick the right track, (b) understand what's in scope, (c) book a discovery call.

- Three tracks, plain friendly voice (matching the site).
- No case-study facts. If asked about specific past projects, redirect to the discovery call.
- No credentialism. One line about 12+ years of engineering. No "trained N teams" / "shipped N projects".
- Pricing: anchored to whatever lands in §5 (the bot must quote the same numbers as the page).
- Refusal patterns: politely deflect questions about specific clients, technical deep-dives outside the three tracks, or pricing arbitrage.
- **Preservation check before rewrite:** read `server.js:28–194` once and itemize any safety-relevant clauses already in the prompt (jailbreak resistance, response-length limits, persona discipline, off-topic deflection, "don't invent prices/dates" guards). Each one carries into the rewrite verbatim or with equivalent intent. Anything case-study-specific or modernization-framing-specific gets dropped.

---

## 7. Linter pattern additions

New patterns in `scripts/check-claims.mjs`, each with a unit test in `tests/check-claims.test.mjs`.

| Pattern (regex sketch) | Why |
|---|---|
| `\b(fully autonomous AI\|no[- ]human[- ]in[- ]the[- ]loop\|AI replaces (developers\|engineers))\b` | Violates §10 "AI-accelerated, never AI-replaced". |
| `\b(certified AI (trainer\|consultant)\|AI[- ]certified)\b` | William has no AI certifications. |
| `\b(thousands of (students\|trainees)\|trained \d{2,}\+? (teams\|people\|developers))\b` | Training-track quantified claims he can't back. |
| `\b(industry[- ]leading\|cutting[- ]edge\|revolutionary) (AI\|technology\|approach)\b` | Buzzword soup; off-voice for the referral-driven audience. |
| `\b(trusted by\|as featured in\|as seen in)\b` | Credibility theater; site is referral-driven per [[project-site-audience]]. |

Each pattern's test asserts: clean text passes; violating text fails with the expected reason; suppression comment works.

---

## 8. Commit shape (implementation order)

Each numbered item is one commit on `feat/ai-tracks-reframe`. Order is chosen so the working tree stays buildable and lint-clean between commits.

1. **Delete + nav cleanup** — remove `case-studies.html`, `checklist.html`, all nav links to them (every page).
2. **Extract chatbot prompt** — create `prompts/chatbot-system.md` with the *existing* prompt text verbatim. Edit `server.js` to read it at startup with a hard-fail guard. No content change yet.
3. **Add linter patterns + tests** — extend `scripts/check-claims.mjs` and `tests/check-claims.test.mjs` with §7 patterns. Verify `npm run test:claims` is green.
4. **Rewrite `services.html`** — three track sections per §4.
5. **Rewrite `pricing.html`** — three pricing sections per §5 (using whatever numbers William commits to in spec review).
6. **Rewrite `small-business.html`** — Kelowna SMB funnel into the three tracks, lighter voice.
7. **Rewrite `prompts/chatbot-system.md`** — three-track content per §6.2, matching the page voice.
8. **Surgical edits** — `index.html` hero + track teasers, `about.html` reframe, `faq.html` Q&As, `contact.html` references line. May be batched into 1–4 commits at the implementer's discretion.
9. **Final pass** — `npm run check:claims` (must pass), `npm run build` (must succeed), manual visual check of each page locally.

After all commits land: open PR `feat/ai-tracks-reframe` → `master`. Lint job runs on PR. **Do not merge until William has run the site locally and explicitly approved.** Per [[feedback-local-test-before-merge]].

---

## 9. Acceptance criteria

- `case-studies.html` and `checklist.html` no longer exist; no nav anywhere links to them.
- `services.html`, `pricing.html`, `small-business.html` reflect the three tracks per §§4–5.
- `prompts/chatbot-system.md` exists; `server.js` reads it at startup; the inline prompt block is removed.
- `npm run test:claims` passes (27 existing + at least 5 new tests for §7 patterns).
- `npm run check:claims` passes against all rewritten copy (zero violations).
- `npm run build` succeeds.
- The chatbot, when run locally (`npm start`), answers a "what services do you offer?" question with the three tracks.
- William has opened the site locally and confirmed it looks right before any merge to master.

---

## 10. Resolved decisions (post-market-research, 2026-05-15)

1. **Training pricing** — ✅ real numbers locked in §5.2.
2. **Automation pricing** — ✅ real numbers locked in §5.3.
3. **Discovery call for Automation** — ✅ Free (30–60 min). Referral-friendly entry, no friction.
4. **`small-business.html` voice** — ✅ Keep "Kelowna" + local framing. Local angle is the differentiator; broadening to BC dilutes it. SMB owners outside Kelowna will still recognize themselves in the copy.
5. **About page** — ✅ Trim VIU career history to one line (e.g., *"Senior engineer at a BC post-secondary institution since 2016"*). Per [[project-site-audience]], the site isn't selling credibility — a wall of work history is over-engineered for the referral funnel.
6. **Group workshop capacity** — ✅ Up to 12 people for the standard half/full-day workshops. Larger groups via the Custom team curriculum tier. Twelve is the sweet spot for hands-on workshop quality with a solo trainer; ChatGPT.ca's 8–25 range is wider because they're doing more presentation, less hands-on.

---

## 11. Out of scope (deferred to future tasks)

- Adding a paid product / Stripe checkout for training sessions.
- Building a separate landing page for any one track (current structure: all on `services.html`).
- Migrating WTS Admin / client portal integration into the marketing site.
- Replacing the chatbot model / SDK.
