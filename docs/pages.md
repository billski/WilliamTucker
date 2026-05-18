---
title: HTML Pages
domain: pages
status: active
last-reviewed: 2026-05-18
verified-against:
  - source: 8 HTML files at repo root on 2026-05-18
  - anchors: grep "id=" services.html / pricing.html
---

# HTML Pages

> **What's in this doc:** the 8 public HTML pages, what each one does, the anchor-naming convention that interacts with the linter, the breakpoint discipline for mobile-vs-desktop work, nav consistency rules, and where the chatbot widget loads.
>
> **What's NOT:** copy content / positioning (→ [[positioning]]), the contact form's server-side behaviour (→ [[contact-flow]]), the design tokens that style these pages (→ [[visual-system]]), cache-busting for the stylesheet (→ [[deploy#css-cache-busting-discipline]]).

The site is a flat collection of 8 hand-authored HTML pages, no framework, no router. Each page repeats the header, nav, and footer markup — so cross-page consistency is a maintenance discipline, not an enforced contract.

---

## Page inventory

<!-- verified-against: ls *.html in repo root on 2026-05-18 -->

| File | Role | Notable structural feature |
|---|---|---|
| `index.html` | Home — hero + three-track preview + stat strip + small-business CTA + lead-magnet section | Two CTA buttons in hero (`Book a Free Discovery Call` + `See the Three Tracks →`) |
| `services.html` | Three tracks long-form — each track has a labelled section with cards | Hero has anchor-button row jumping to the three section IDs |
| `pricing.html` | Three pricing sections matching the three tracks; free discovery-call banner at top | Pricing-card heading anchors don't link cross-page; mobile shows a 4-up grid that collapses to 2×2 then 1-col |
| `small-business.html` | Kelowna SMB landing — pain-card grid, before/after section, Quick Win package, three-track preview, interactive quiz, chatbot demo | Inline `<style>` block (lines 20–43) for `.pain-card` hover/reveal — the ONLY page-specific stylesheet on the site |
| `about.html` | Bio, expertise grid, education, independent projects, philosophy | Heaviest individual page in raw vertical height — long scroll |
| `faq.html` | 18 Q&As across 5 groups, wrapped in `<details>`/`<summary>` accordions | Each Q&A is a `<details class="group ...">` with a `group-open:rotate-180` chevron span |
| `contact.html` | "Let's Talk" hero + "How This Works" / "Send a Message" two-column layout + "Other Ways to Reach Me" | Form POSTs to `/api/contact` — see [[contact-flow]]. NO chatbot widget loads here. |
| `privacy.html` | Privacy notice | PIPEDA — must accurately name third-party processors. See known-drift backlog if this is stale. |

The site has **no** `case-studies.html` (deleted in PR #4) or `checklist.html` (deleted in PR #4). The page-routing memory `project-site-no-work-samples` codifies the "no portfolio on the public site" decision — see that memory before reintroducing.

---

## Anchor naming

The `ai-workflow-automation` choice (and the linter collision it dodges):

<!-- verified-against: services.html:102,173,238 and pricing.html section IDs on 2026-05-18 -->

The three service tracks have specific section anchors used by hero CTAs, pricing-page-internal links, index.html services-preview, and small-business.html three-track preview:

| Track | Section ID on `services.html` | Section ID on `pricing.html` | Why the name |
|---|---|---|---|
| 1 — Software Development | `#ai-development` | `#ai-development-pricing` | Short, mobile-first; doesn't collide with anything |
| 2 — Training | `#ai-training` | `#ai-training-pricing` | Same |
| 3 — Workflow Automation | **`#ai-workflow-automation`** | **`#ai-workflow-automation-pricing`** | **MUST include `-workflow-`** — see below |

**Why Track 3 is `ai-workflow-automation` and NOT `ai-automation`:** The claim linter's `ai-automation` pattern (`scripts/check-claims.mjs:28-32`) catches the phrase "AI automation" as a violation of the AI-accelerated framing rule. Its regex is `/\bAI[\s-]*automation\b/i` — which matches `ai-automation` (the kebab-case form an HTML id would use) but NOT `ai-workflow-automation` because the word `workflow` between `ai` and `automation` breaks the regex's positional adjacency.

If you rename the anchor to `ai-automation` you will trigger the linter on every page that links to that anchor (4+ pages today). See [[linter#pattern-catalog]] for the full pattern.

The page hero on `services.html:88-99` has three anchor buttons jumping to these IDs:

```html
<a href="#ai-development">AI Software Development</a>
<a href="#ai-training">AI Training</a>
<a href="#ai-workflow-automation">AI Workflow Automation</a>
```

Index and small-business pages link to the same anchors with `href="services.html#ai-development"` and so on.

---

## Header + nav consistency

Every page repeats the same header structure. There's no template engine — drift between pages is a maintenance hazard.

### Desktop nav

Every page's desktop nav (`<nav class="hidden md:flex items-center gap-8">`) should list these links in order:

1. Services
2. Small Business
3. About
4. Pricing
5. Contact
6. Client Portal (external link to `https://admin.williamtucker.ca/login`)
7. Book a Call (CTA button, gold fill)

All 8 pages are in compliance with this rule. (Earlier drift on `privacy.html` was resolved in the 2026-05-18 post-reframe-cleanup PR.)

### Mobile nav (hamburger)

Same 7 links in the same order, in the mobile menu drawer (`<nav class="flex flex-col px-4 py-4 gap-4">` inside `<div id="mobile-menu">`).

### Active-page indicator

The link to the current page uses `class="text-gold font-medium"` (gold text) instead of `class="text-white hover:text-gold font-medium"`. So on `services.html`, the Services link is gold; on `contact.html`, the Contact link is gold.

### Hamburger touch target

The mobile hamburger button (`<button id="mobile-menu-button">`) currently uses `class="md:hidden text-white p-2"` on every page. Apple HIG minimum is 44×44 px — `p-2` with a 24×24 icon renders at ~40 px, just under the floor. Open backlog item if a future mobile-polish pass.

---

## Footer consistency

Three columns:

1. **Logo + tagline** — "AI-accelerated software development, training & workflow automation" (current tagline as of 2026-05-18; old tagline "Legacy modernization & AI consulting" should be banished by linter or doc review)
2. **Quick Links list** — Services / Pricing / About / FAQ / Contact / Privacy Policy / Client Portal (7 links)
3. **Connect list** — LinkedIn / GitHub / Email

All 8 pages have the Client Portal `<li>` in the footer Quick Links. (Earlier drift on `pricing.html` / `faq.html` / `small-business.html` was resolved in the 2026-05-18 post-reframe-cleanup PR.) Bottom-bar line includes copyright + Privacy Policy backlink — consistent across all 8.

---

## Breakpoint discipline (mobile-first)

<!-- verified-against: contact.html:97 (py-8 md:py-16) and css/styles.css ?v=20260517b on 2026-05-18 -->

Tailwind v4. Breakpoints:
- Mobile (`< 640px`): no prefix — base classes apply
- `sm:` ≥ 640px
- `md:` ≥ 768px (this is the practical desktop boundary — iPhones are always below)
- `lg:` ≥ 1024px
- `xl:` ≥ 1280px

The mobile-specific patterns the contact page incident drove home (see [[deploy#debugging-cache-problems-the-2026-05-17-playbook]]):

### Pattern 1: order-swap on a 2-column grid

When a desktop two-column layout should reorder on mobile, use Tailwind's `order-*` utilities on the grid children:

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
  <div class="order-2 md:order-1"> <!-- second on mobile, first on desktop --> </div>
  <div class="order-1 md:order-2"> <!-- first on mobile, second on desktop --> </div>
</div>
```

Live example: `contact.html:107-141` — the "How This Works" steps go below the form on mobile so the user reaches the submit button without scrolling past the explanation.

### Pattern 2: compressed mobile padding

When section padding is too generous on mobile, compress with `py-8 md:py-16` (saves ~64px) and shrink the heading scale with `text-3xl md:text-4xl` (saves ~12px):

```html
<section class="py-8 md:py-16">
  <h1 class="text-3xl md:text-4xl font-bold ...">Heading</h1>
</section>
```

Live example: `contact.html:97-101`.

### Pattern 3: hidden-on-desktop affordance

When a mobile-only hint is needed (e.g., a "tap to reveal" cue for hover-driven UI), use `md:hidden`:

```html
<p class="md:hidden text-xs text-red-400">↓ Tap to see the fix</p>
```

**Gotcha:** if a page-level inline `<style>` block also sets `display: block` on the same selector unconditionally, the inline rule's specificity (0,2,0 for a 2-class selector) will beat Tailwind's `.md\:hidden` (0,1,0) and the hint shows on desktop too. Solution: wrap the inline rule in `:where()` to drop specificity to (0,0,0), or move the rule into a `@media (max-width: 47.99rem)` block. Cite: small-business.html (current state has the corrected `:where()` form).

---

## Chatbot widget loading

`js/chatbot.js` is the floating-bottom-right chat widget. It loads on every page EXCEPT `contact.html` (which has its own form as the primary CTA).

Page → script reference:
- `index.html`, `services.html`, `pricing.html`, `about.html`, `faq.html`, `privacy.html` → `<script src="js/chatbot.js?v=2"></script>`
- `small-business.html` → `<script src="js/chatbot-demo.js?v=2"></script>` (the inline demo widget on the page itself, distinct from the floating button)
- `contact.html` → no chatbot script

The `?v=2` query is a static cache-buster — it's been at `v=2` for a while. If JS changes, bump it like the CSS one. See [[deploy#css-cache-busting-discipline]] for the same pattern applied to JS files (the rule generalizes — any static asset whose contents change without the URL changing is a cache trap).

---

## Cache-busting in HTML (mirror of deploy doc)

Every page's stylesheet link has a version query:

```html
<link rel="stylesheet" href="css/styles.css?v=20260517b" />
```

When CSS output changes (new utility classes used, dropping a class), bump `v=YYYYMMDDx` ON ALL 8 PAGES — not just the page you're editing. The full procedure lives in [[deploy#how-to-bump-correctly]]. The 2026-05-17 incident's most damaging sub-failure was bumping the version on only one page.

---

## Reusable structural patterns

- **Sticky header.** Every page: `<header class="sticky top-0 z-50 bg-navy">` with `h-16` (64 px). This eats ~64 px from every page's usable viewport.
- **Section alternation.** White → off-white (`#f8f9fa`) → navy → white, repeated down. Per [[visual-system]], never three same-color surfaces in a row.
- **Card pattern.** `border border-gray-200 rounded-lg p-8` for default cards. Highlighted cards use `border-2 border-gold` plus an absolute-positioned "Most Requested" badge.
- **Eyebrow pill.** A small uppercase label above each track section heading: `<span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Track 1</span>`.

---

## Anti-patterns to refuse

- **Don't reintroduce a `case-studies.html` or `checklist.html`.** Both deleted intentionally. See `project-site-no-work-samples` memory.
- **Don't rename a section anchor without checking the linter.** `ai-automation` would re-trigger the credibility linter on every page that links to it.
- **Don't change one page's nav without updating all 8.** There's no shared template — drift sticks.
- **Don't add a new page without registering it** in `_index.md`, `doc-ownership.yml`, AND this doc's page inventory.

---

## Backlog

- Pre-existing nav gaps (privacy missing Client Portal; pricing/faq/small-business missing it in footer) deserve a one-PR cleanup. Tracked in main `_backlog.md`.
- The repeated nav block across 8 files is the strongest case for introducing a tiny build-time HTML partial system. Not done; cost of doing it ≈ cost of the next 5 nav-drift incidents.
- `privacy.html`'s reference to Formspree + Calendly is currently stale; the contact form actually posts to `/api/contact` (see [[contact-flow]]). The privacy notice needs a rewrite naming Supabase + Resend + Cloudflare + Railway.
