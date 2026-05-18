---
title: Chatbot
domain: chatbot
status: stub
last-reviewed: 2026-05-18
---

# Chatbot

> **What's in this doc:** _(stub — will document the `/api/chat` endpoint, the system prompt content rules, and the widget JS once first edited)._
>
> **What's NOT:** the contact form on the same server (→ [[contact-flow]]), the deploy pipeline that runs `server.js` (→ [[deploy]]), the positioning rules the prompt content must obey (→ [[positioning]]).

This doc is a placeholder. The full chatbot system has three pieces that should be documented here when first edited:

1. **`/api/chat` endpoint** — Express handler at `server.js:76-105` proxying to Anthropic Claude. Rate-limited 15 req/IP/min. System prompt loaded from `prompts/chatbot-system.md` at startup with hard-fail guard (`server.js:36-47`).
2. **System prompt content** — `prompts/chatbot-system.md`. Mirrors site copy (three tracks, pricing anchors, framing rules). The linter scans this file via `SCAN_NESTED_FILES` (see [[linter#scope-what-gets-scanned]]).
3. **Widget JS** — `js/chatbot.js` (the floating widget, loaded on every page except `contact.html`) and `js/chatbot-demo.js` (the inline demo on `small-business.html`).

When this doc is fleshed out, key topics to cover:
- The two-surface sync hazard (pricing must match `pricing.html` exactly).
- The 3 active linter suppressions in the prompt (they quote forbidden phrases as anti-instructions to the model).
- The model in use (currently `claude-haiku-4-5-20251001` per `server.js:95`) and the rationale.
- The `?v=2` cache buster on the JS file references — same pattern as [[deploy#css-cache-busting-discipline]].
- How to update the prompt safely (lint + matches pricing + smoke test via curl).
