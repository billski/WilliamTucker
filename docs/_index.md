---
title: Documentation Vault — Home
domain: meta
status: active
last-reviewed: 2026-05-18
---

# Documentation Vault

**For AI agents and humans.** This is the root of the docs vault. Start here.

> If you are an agent working in this repo, read this note first, then the specific domain doc for your task. Do not grep the whole vault — domain docs are designed to be read directly.

---

## Scope

This vault documents the **williamtucker.ca marketing site** for William Tucker Solutions (WTS) — a one-engineer consulting practice based in Kelowna, BC. The site is a static HTML + Tailwind CSS v4 site with a small Node/Express server (`server.js`) that handles the chatbot proxy (`/api/chat`) and contact-form lead intake (`/api/contact`). Deployed to DreamHost via GitHub Actions; the server runs on Railway. Cloudflare sits in front of the public domain.

Per-feature design history (specs, plans, ADRs) lives under `docs/superpowers/` and is out of scope here.

---

## Domain docs

| Task context | Doc |
|---|---|
| Editing copy, positioning, three-track framing, brand-voice rules | [[positioning]] |
| Working on any HTML page — structure, anchor naming, mobile breakpoints, nav patterns | [[pages]] |
| Adding/changing claim-linter patterns, suppression comments, debugging linter failures | [[linter]] |
| Deploying, debugging cache issues, CSS cache-busting, GitHub Actions, Cloudflare CDN | [[deploy]] |
| Contact form, `/api/contact` endpoint, WTSAdmin/Supabase integration, Turnstile, Resend | [[contact-flow]] |
| Colors, typography, components, visual elevation, anti-references (stub — extract from DESIGN.md when first edited) | [[visual-system]] |
| Chatbot prompt content, `/api/chat` endpoint, chatbot widget JS (stub — extract from chatbot work when first edited) | [[chatbot]] |

---

## Cheatsheets

`docs/_cheatsheets/` holds ≤50-line quick-references for high-frequency lookups whose answers are buried in 300+ line domain docs. None yet — add as repetitive lookups emerge.

| Lookup | Cheatsheet | Parent doc |
|---|---|---|
| _(none yet)_ | | |

---

## Machinery

- [[vault-conventions]] — the playbook (naming, frontmatter, verification rules)
- [docs/_meta/doc-ownership.yml](_meta/doc-ownership.yml) — code-path → doc map consumed by `scripts/match-docs.mjs`
- [[docs-sync-prompt]] — the workflow followed when you say "update docs"
- [[_backlog]] — gaps, TODO-verify flags, undocumented behavior

---

## Conventions (see [[vault-conventions]] for full detail)

- Filenames: `kebab-case.md`
- Wikilinks: `[[filename]]` or `[[filename#section]]`
- Every doc: frontmatter with `title`, `domain`, `status`, `last-reviewed`, and (for verification-citing docs) `verified-against`
- Code citations include `file:line` anchors
- Schema/API/live-behavior content verified against ground truth at write time
- Archive, don't delete

---

## Source-of-truth hierarchy

The vault is the place to record what's true about THIS codebase. For facts about William's career, projects, employment history, and credentials, the canonical source is `D:\code\cv\PROFILE.md` (outside this repo). Vault docs may reference PROFILE.md but should not duplicate it.

`CLAUDE.md` at the repo root is the agent-orientation entry point and pointer to this vault. Workspace-level `D:\code\CLAUDE.md` framing rules apply to all WTS work.
