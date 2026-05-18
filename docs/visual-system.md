---
title: Visual System
domain: visual-system
status: stub
last-reviewed: 2026-05-18
---

# Visual System

> **What's in this doc:** _(stub — will document the design system once first edited)._
>
> **What's NOT:** the positioning copy (→ [[positioning]]), the page structure (→ [[pages]]), the visual anti-references in `PRODUCT.md` until they're migrated here.

This doc is a placeholder. The full visual system — colors, typography, components, elevation, animation rules, anti-references — currently lives in `DESIGN.md` and `DESIGN.json` at the repo root.

When the visual system is next edited substantively, migrate its content into this doc using the [[vault-conventions]] format: frontmatter, "What's in / What's NOT" callout, code citations to `tailwind.config.*` and `src/input.css` where applicable.

## Current source of truth (legacy)

- `DESIGN.md` — full visual spec, drafting-studio palette, type hierarchy, component rules, anti-references
- `DESIGN.json` — machine-readable design tokens (colors, typography scales, spacing, components)
- `src/input.css` — Tailwind v4 input that compiles to `css/styles.css`

Things to verify when migrating:
- Are the colors in `DESIGN.json` still the actual colors used in `css/styles.css`? (Run a grep for `#d4a843` and `#1a2332`.)
- Does the type scale in `DESIGN.json` match what's actually used in HTML (`text-4xl`, `text-3xl`, etc.)?
- Are the anti-references (Squarespace template / LinkedIn-influencer / Big-4) still accurate descriptions of "what NOT to look like"? They've been stable, but periodically re-verify the framing still matches the market.

## Note

`DESIGN.md` line 3 currently has a stale `description:` frontmatter field that says "legacy modernization + AI consulting." Fix that next time you're in the file (now reframed as three AI tracks — see [[positioning]]).
