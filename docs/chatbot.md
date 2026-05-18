---
title: Chatbot
domain: chatbot
status: active
last-reviewed: 2026-05-18
verified-against:
  - server: server.js:36-105 (/api/chat handler + prompt loader)
  - prompt: prompts/chatbot-system.md (full content) on 2026-05-18
  - widget: js/chatbot.js (floating widget) on 2026-05-18
  - widget: js/chatbot-demo.js (inline demo on small-business.html) on 2026-05-18
---

# Chatbot

> **What's in this doc:** the `/api/chat` Express endpoint, the system prompt file and how it loads at server startup, the two front-end surfaces (floating widget + inline demo), the Claude model in use, rate limiting + session limits, the two-surface pricing-sync hazard, the markdown rendering both widgets implement, and the discipline rules for editing the prompt.
>
> **What's NOT:** the contact form on the same server (→ [[contact-flow]]), the deploy pipeline that runs `server.js` on Railway (→ [[deploy]]), the positioning rules the prompt content must obey (→ [[positioning]]), or the linter that polices forbidden phrases (→ [[linter]]).

The chatbot is the only "live AI" surface on the marketing site. It runs on the same Express server as the contact form (`server.js`, deployed to Railway), proxies to Anthropic's Claude API, and is rendered on the front-end through two distinct widgets that share the same backend.

---

## Server endpoint

### Startup: prompt load with hard-fail guard

<!-- verified-against: server.js:36-47 on 2026-05-18 -->

`server.js:36-47` reads `prompts/chatbot-system.md` at startup, trims whitespace, and refuses to start if the file is missing or empty:

```javascript
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

This is intentional — a missing prompt file is fatal. A chatbot running without its system prompt would hallucinate freely; better to crash on boot than serve junk.

### `POST /api/chat`

<!-- verified-against: server.js:76-105 on 2026-05-18 -->

```
POST /api/chat
Content-Type: application/json
Body: {
  messages: [
    { role: 'user' | 'assistant', content: string },
    ...
  ]
}
→ 200 { content: string }              // assistant's reply
→ 400 { error: 'Invalid request.' }   // messages must be a non-empty array
→ 429 { error: 'Too many requests — please wait a moment.' }
→ 500 { error: 'Something went wrong. Please try again or email william@williamtucker.ca.' }
```

The handler (`server.js:76-105`):

1. **Rate-limit check** (`server.js:78-80`) — 15 requests / IP / minute, shared with `/api/contact` via the in-memory `rateLimitMap`.
2. **Validate** (`server.js:82-85`) — `messages` must be a non-empty array.
3. **Sanitize + cap** (`server.js:88-91`) — filter to `user` / `assistant` roles only, keep last 12 messages, slice each `content` to 2000 chars.
4. **Call Anthropic** (`server.js:94-99`) — `claude-haiku-4-5-20251001`, max 400 tokens, system prompt + sanitized history.
5. **Return** the text of the first content block.

### Model choice

Currently `claude-haiku-4-5-20251001` per `server.js:95`. Rationale: chatbot responses are short, latency matters more than depth, and the system prompt is rigorous enough that a smaller model suffices. If responses start feeling shallow or the model starts violating the prompt rules, escalate to a Sonnet or Opus variant — but expect roughly 3–5× the latency.

`max_tokens: 400` keeps replies short by design (matches the "Keep responses short" rule in the prompt). If a future change wants longer answers, bump this — but the prompt itself also constrains length so changing one without the other won't produce longer replies.

---

## System prompt

The prompt lives at **`prompts/chatbot-system.md`** (extracted in PR #4, commit `a89a4b7`, from a previous inline location in `server.js`). The linter scans this file via `SCAN_NESTED_FILES` in `scripts/check-claims.mjs:234-235`, so credibility-drift in the prompt fails the build same as in HTML.

### What the prompt does

<!-- verified-against: prompts/chatbot-system.md on 2026-05-18 -->

The prompt at `prompts/chatbot-system.md` is 63 lines, structured as:

1. **Job statement** (line 1) — help visitors pick a track + book a call.
2. **About William Tucker** (lines 3-5) — 12+ years, Kelowna, solo practice, AI-augmented engineer.
3. **The three services** (lines 7-30) — Track 1 / Track 2 / Track 3 with exact pricing.
4. **How William works** (lines 32-39) — three-step process, referral-driven local SMB focus.
5. **Your job** (lines 41-48) — track-mapping, price-quoting discipline, redirect rules for specific projects and out-of-scope tech questions.
6. **What you don't do** (lines 50-57) — no invented prices, no un-scoped promises, no missing-credential claims, no autonomous-AI framing, no industry speculation, no contact-info beyond the site.
7. **Tone** (lines 59-63) — friendly, plain-spoken, confident.

### Active suppression comments (3)

<!-- verified-against: grep "check-claims-allow" prompts/chatbot-system.md on 2026-05-18 — 3 occurrences -->

The prompt legitimately quotes forbidden phrases as anti-instructions to the model. Each one has a `<!-- check-claims-allow: ... -->` suppression with a meaningful reason:

| Line | What it suppresses | Why it's legitimate |
|---|---|---|
| 48 | `buzzword-soup` (`revolutionary AI`, `cutting-edge`) + `credibility-theater` (`trusted by`, `as featured in`) | The rule literally tells the model NOT to use these — the prompt has to quote them to forbid them |
| 54 | `ai-certified` (`certified AI trainer`) + `quantified-training` (`thousands of students trained`) | Same — the rule names the forbidden credentials to forbid them |
| 55 | `ai-replaced` (the phrase "AI replaces ...") | Same — naming the framing the model must avoid |

These are the textbook use case for `check-claims-allow`. See [[linter#suppression-comments]] for the broader rules.

---

## The two-surface pricing sync hazard

**`prompts/chatbot-system.md` AND `pricing.html` both contain the canonical pricing.** They must match exactly. The linter doesn't catch numeric drift — agent discipline does.

Pricing currently in lockstep (verified 2026-05-18):

| Tier | Both surfaces say |
|---|---|
| Track 1 Discovery / Audit | $2,500 |
| Track 1 Build | $10,000–$30,000 |
| Track 1 Ongoing Support | $1,500/month |
| Track 2 1:1 session | $275 per 90 min |
| Track 2 Half-day workshop | $2,500 |
| Track 2 Full-day workshop | $4,000 |
| Track 2 Custom curriculum | starts at $7,500 |
| Track 2 Training retainer | $1,250/month |
| Track 3 Discovery | Free 30–60 min |
| Track 3 Small Build | starting at $2,500 |
| Track 3 Medium Build | starting at $7,500 |
| Track 3 Maintenance | $1,000/month |

**When pricing changes in `pricing.html`, the prompt MUST be updated in the same commit.** The reverse is also true. If only one surface changes, the chatbot will quote a different price than the page — exactly the kind of credibility-broker failure mode the site can't afford.

The matching task is small enough that running `grep "\$" prompts/chatbot-system.md` and `grep "\$" pricing.html` before merging any pricing change is a 30-second check that prevents the drift.

---

## Front-end widgets

Two distinct front-end widgets share the same `/api/chat` backend. Both implement their own markdown rendering and session management.

### Widget 1: Floating bottom-right panel (`js/chatbot.js`)

<!-- verified-against: js/chatbot.js (307 lines) on 2026-05-18 -->

The default chatbot — a closed bubble in the bottom-right corner that expands into a 360 × 520 panel when clicked. Loaded on every page EXCEPT `contact.html` (which is the primary conversion surface and doesn't need a competing CTA — see [[pages#chatbot-widget-loading]]).

Key implementation details from `js/chatbot.js`:

| Concern | Where | Notes |
|---|---|---|
| API URL routing | `js/chatbot.js:6-7` | Localhost → `/api/chat`. Otherwise → `https://williamtucker-production.up.railway.app/api/chat` (the Railway-deployed server). |
| Session limit | `js/chatbot.js:5` | `SESSION_LIMIT = 15` — after 15 user messages, the input disables and a "book a discovery call" link appears (`js/chatbot.js:231-240`). |
| Cooldown | `js/chatbot.js:288-292` | 2-second cooldown between sends after each reply. |
| Markdown renderer | `js/chatbot.js:157-190` | Custom inline implementation: escapes HTML, supports `**bold**`, `*italic*`, `` `code` ``, `## h2`, `### h3`, and `- bullet` lists. NOT a full markdown parser — only what the prompt is likely to emit. |
| Greeting | `js/chatbot.js:201-203` | Hardcoded: *"Hi! I'm here to answer questions about William Tucker Solutions — services, process, or anything else. What can I help you with?"* |
| Styling | `js/chatbot.js:9-111` | All CSS injected via `<style>` tag at runtime. Theme: Navy header + Gold accent + Page White panel. |

Errors return a `wts-msg-error` red bubble (`js/chatbot.js:265-269`). Network failures fall back to *"Could not connect. Please email william@williamtucker.ca."* (`js/chatbot.js:274-279`).

### Widget 2: Inline demo on small-business.html (`js/chatbot-demo.js`)

<!-- verified-against: js/chatbot-demo.js (293 lines) on 2026-05-18 -->

A version of the same chatbot rendered inline on `small-business.html` (in the `<div id="wts-smb-demo-root">` near the bottom of the page — see [[pages#chatbot-widget-loading]]). Same backend, different theme + smaller session budget.

Differences from Widget 1:

| Concern | Widget 1 (floating) | Widget 2 (inline demo) |
|---|---|---|
| Session limit | 15 user messages | **12 user messages** (`js/chatbot-demo.js:10`) |
| Cooldown | 2 seconds | 1.5 seconds (`js/chatbot-demo.js:273`) |
| Theme | Navy header + Page White panel | Dark navy panel with gold-accented bubbles (`js/chatbot-demo.js:14-125`) |
| Open/close UI | Bubble toggle | Always-open inline | 
| Suggestion chips | None | 4 starter prompts (`js/chatbot-demo.js:142-147`) |
| Markdown subset | Includes headings | Lists only — no `##`/`###` heading support (`js/chatbot-demo.js:174-191`) |
| Greeting | "Hi! I'm here to answer questions..." | *"Hi! I'm the assistant for William Tucker Solutions. Ask me about services, pricing, process, or William's background..."* (`js/chatbot-demo.js:278`) |

The intent of the inline demo is *demonstration*: it shows a chatbot-on-your-site as a Track 3 Small Build use case. The dark theme + Live Chatbot tag + suggestion chips all sell the experience to a small-business visitor.

---

## CORS

<!-- verified-against: server.js:16-29 on 2026-05-18 -->

`/api/chat` is reachable from:
- `https://williamtucker.ca`
- `https://www.williamtucker.ca`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Any other origin can't read the response. Both widgets respect this via the `API_URL` routing above (localhost → local server; everything else → Railway production).

---

## Cache-busting

Both widget files are referenced from HTML with a `?v=2` query suffix — e.g., `<script src="js/chatbot.js?v=2"></script>` (every page except `contact.html` and `small-business.html`) and `<script src="js/chatbot-demo.js?v=2"></script>` (small-business.html only).

Same pattern as the CSS cache-buster — see [[deploy#css-cache-busting-discipline]]. If a widget JS file changes, bump `v=2` to `v=3` across every HTML file that loads it. Currently both widgets are at `v=2` and have been for a while.

---

## Editing the prompt

When changing `prompts/chatbot-system.md`:

1. **Read [[positioning]] first.** The prompt is bound by the same framing rules as the rest of the site (12+ years, AI-accelerated never AI-replaced, RoomBooking in QA, no credentialism, no buzzword soup). Edits that violate these rules will fail the linter at build time.
2. **Cross-check pricing against `pricing.html`** before saving. Either match it exactly or update both surfaces in the same commit.
3. **Run `npm run check:claims`** — confirm 0 violations.
4. **Run `npm run build`** — confirm the build still passes (the linter is the first step of build).
5. **Smoke-test locally** if non-trivial: `npm start`, then `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"What services do you offer?"}]}'` — confirm the response mentions all three tracks and quotes prices that match `pricing.html`.
6. **Commit** with specific paths (not `git add -A` — see [[positioning#never-git-add--a-in-this-repo]]).

---

## Anti-patterns

| Don't | Do |
|---|---|
| Quote prices in the prompt from memory | Read `pricing.html` and copy verbatim |
| Update `pricing.html` without updating the prompt | Update both in the same commit |
| Edit the prompt to be "more helpful" by removing the redirect rules | The redirect rules (no specific project details, no out-of-scope tech Q&A, no fabricated credentials) ARE the safety layer. Keep them. |
| Suppress a linter violation in the prompt because "it's just an example" | If the example phrase isn't being used as an anti-instruction (with a meaningful reason), it's drift. Fix the wording instead of suppressing. |
| Swap to a larger model thinking it'll fix bad prompt behaviour | The prompt is the contract. Fix the prompt; the model size is a different lever |
| Add a third widget surface | Two are already a maintenance hazard. If a new surface is genuinely needed, refactor both widgets to share a common base first |

---

## Backlog

- The two widget files duplicate ~70% of their logic (markdown renderer, session management, error handling, typing indicator). A future refactor could extract a shared `chatbot-core.js` and keep only the theme/wrapper code per surface.
- The markdown renderer in Widget 1 supports `##` and `###` headings; the one in Widget 2 doesn't. If the prompt ever produces a `## heading`, Widget 2 will render it as a plain paragraph. Low-impact today; flag if response shape changes.
- The session-limit "book a discovery call" link is hardcoded to `/contact.html`. If the contact-page URL ever changes (it won't, but), both widgets need updating.
- `prefers-reduced-motion` is not currently honored in the typing-indicator bounce animation (`js/chatbot.js:88`, `js/chatbot-demo.js:82`). [[visual-system#accessibility-commitments]] commits to honoring it across the site — this is the open audit item.
