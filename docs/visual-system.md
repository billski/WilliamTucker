---
title: Visual System
domain: visual-system
status: active
last-reviewed: 2026-05-18
verified-against:
  - source: DESIGN.md (full spec) + DESIGN.json (tokens)
  - source: tailwind.config.js (color/font extensions)
  - source: src/input.css (base layer)
  - sample: css/styles.css (compiled output) on 2026-05-18
---

# Visual System

> **What's in this doc:** the engineer's-statement visual posture, the two-color palette (Drafting Navy + Solder Gold), the single-typeface system (Inter), the flat-by-default elevation model, the component vocabulary (buttons, pills, cards, inputs, nav, stat strip), the named rules that govern usage, and the anti-references the system actively rejects.
>
> **What's NOT:** the positioning copy the visuals support (→ [[positioning]]), the page-level structure / breakpoints / mobile patterns (→ [[pages]]), or the build pipeline that compiles Tailwind to CSS (→ [[deploy]]).

The visual system reads as a technical document, not a marketing page. Every element either carries information or steps aside. Two colors, one typeface, one shadow value. That's the posture; everything below is the playbook.

---

## North Star

**Creative direction:** "The Engineer's Statement."

Drafting Navy + Solder Gold reference engineering conventions (blueprint ink, soldered brass), not financial-services convention (corporate navy + luxury gold). Inter at sharp weights with generous line height keeps every page closer to a printed spec sheet than a product landing page. The site sells competence as proof. The visuals have to read the same way.

The source-of-truth file for the rules is **`DESIGN.md`** at the repo root (~275 lines). Machine-readable tokens live in **`DESIGN.json`** (frontmatter of `DESIGN.md`). Tailwind picks up the `navy`/`gold` palettes via `tailwind.config.js:6-19`. The base layer (body font, heading color, link transition) is set in `src/input.css:5-15`.

When this doc and `DESIGN.md` conflict on a rule, `DESIGN.md` is the source. This doc summarizes; `DESIGN.md` has the full prose.

---

## Colors

<!-- verified-against: tailwind.config.js:6-19, DESIGN.json frontmatter (DESIGN.md:4-18), and compiled css/styles.css on 2026-05-18 — all three agree -->

Two-color system. Drafting Navy carries surface; Solder Gold carries voice. Page Off-White separates white-on-white sections.

### Primary surfaces

| Token | Hex | Tailwind class | Where it shows up |
|---|---|---|---|
| Drafting Navy | `#1a2332` | `bg-navy`, `text-navy`, `border-navy` | Sticky header, hero band, footer, navy CTA section |
| Drafting Navy Light | `#243044` | `bg-navy-light` | Mobile menu drawer; hover state on navy surfaces |
| Drafting Navy Dark | `#111827` | `bg-navy-dark` | Reserved for deep-fill blocks; rarely used currently |

### Voice accent

| Token | Hex | Tailwind class | Where it shows up |
|---|---|---|---|
| Solder Gold | `#d4a843` | `bg-gold`, `text-gold`, `border-gold` | Primary buttons, eyebrow pills, link emphasis, statistic underline |
| Solder Gold Light | `#e0be6a` | `bg-gold-light` | Primary button hover |
| Solder Gold Dark | `#b8912e` | `text-gold-dark` | Inline link color on light backgrounds (where default Solder Gold would lose contrast) |

### Neutrals

| Token | Hex | Tailwind class | Where it shows up |
|---|---|---|---|
| Page Off-White | `#f8f9fa` | inline `style="background-color: #f8f9fa;"` (NOT a tailwind token — applied inline) | Alternating section background; "next page" signal in long scrolls |
| Page White | `#ffffff` | `bg-white` | Card surface + primary section background |
| Ink (gray-700) | `#374151` | `text-gray-700` | Default body copy color |
| Ink (gray-200) | `#e5e7eb` | `border-gray-200` | Dividers, card borders when used |

### Named rules

These are non-negotiable. Each is stated in `DESIGN.md`; the linter doesn't enforce them, but agent discipline must.

**The One Voice Rule** (`DESIGN.md:156`): Solder Gold appears on ≤10% of any screen surface. Reserve it for CTAs, eyebrow pills, single-word emphasis in headlines, and link affordances. If gold is doing more than carrying brand voice, the page is shouting.

**The Two-Surface Rule** (`DESIGN.md:158`): Sections alternate between Page White and Page Off-White, OR between Page White and Drafting Navy. **Never three surface tones in a row** without a structural reason. Note: per the audit on 2026-05-18, `small-business.html` has two consecutive `bg-white` sections (the new "Three ways I help" block + the Quiz block) — flagged in `_backlog.md` as a polish item.

**The No-Tinted-Card Rule** (`DESIGN.md:160`): Cards are always Page White. Cards on Page Off-White sections gain elevation via shadow only — never by tint. Tinted cards on tinted sections collapse contrast.

---

## Typography

<!-- verified-against: tailwind.config.js:21-23 (fontFamily.sans = Inter), src/input.css:7 (body @apply font-sans), and DESIGN.json typography block on 2026-05-18 -->

**Single typeface.** Inter, with `system-ui, sans-serif` fallback. Four weights loaded: 400 / 500 / 600 / 700. The hierarchy is built from weight + scale, not from contrasting families.

### Hierarchy (eight roles)

| Role | Weight | Size | Line height | Tailwind |
|---|---|---|---|---|
| Display | 700 | `clamp(2.25rem, 5vw, 3.75rem)` | 1.1 | hero `<h1>` only, often `text-4xl md:text-5xl lg:text-6xl` |
| Headline | 700 | `clamp(1.875rem, 3vw, 2.25rem)` | 1.2 | section `<h2>`, often `text-3xl md:text-4xl` |
| Title | 600 | 1.25rem | 1.4 | card `<h3>`/`<h4>`, often `text-xl` or `text-2xl` |
| Body Large | 400 | 1.125rem | 1.625 | hero subhead / lead paragraph, often `text-lg md:text-xl` |
| Body | 400 | 1rem | 1.625 | default paragraph, `text-base` (color: `text-gray-700` via base layer in `src/input.css`) |
| Label | 700 | 0.75rem | letter-spacing 0.1em | eyebrow pills, classifier pills, stat captions — often `text-xs font-bold uppercase tracking-widest` |

The base layer in `src/input.css:5-15` sets:
- `body` → font-sans (Inter), text-gray-800, antialiased
- `h1, h2, h3, h4` → text-navy (color override)
- `a` → transition-colors duration-200 (color-only animation on links)

### Named rules

**The Single-Voice Rule** (`DESIGN.md:179`): No second typeface for accents. No serif display, no monospace stat readouts, no script signature blocks. Inter does every job. Hierarchy = weight (400 → 700) × scale (1rem → ~3.75rem), never family contrast.

**The Reading-Width Rule** (`DESIGN.md:181`): Body copy that wraps more than two lines is constrained to 65–75 characters per line. Wider lines read as PDF dumps, not as thoughtful writing. Practical pattern: wrap paragraphs in `<div class="max-w-2xl">` or similar.

---

## Elevation

<!-- verified-against: DESIGN.md:185-195 and grep "box-shadow" css/styles.css → exactly one Card Lift value -->

Flat-by-default. Exactly one shadow value in the entire vocabulary, in exactly one role.

**Card Lift:** `box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` — Tailwind class `shadow`.

Used only on Page White cards sitting over Page Off-White sections. Purely structural separation. **Never** on dark backgrounds. **Never** on inputs, pills, or buttons. **Never** as decoration.

### Named rules

**The Flat-By-Default Rule** (`DESIGN.md:193`): Every surface flat at rest. The single Card Lift shadow separates cards from their off-white parent — not depth-as-decoration. If a designer reaches for a shadow to "make something pop," the right answer is almost always to change weight, color, or spacing instead.

**The No-Glow Rule** (`DESIGN.md:195`): Glowing borders, soft focus halos, ambient drop shadows under accent elements — all forbidden. The Squarespace-template anti-reference (see below) is the nearest neighbour, and the system rejects glow as a category.

---

## Components

The system's component vocabulary as it lives in HTML + Tailwind today. When components grow custom variants (more than the two-tier button system, more than the two pill roles), update this section.

### Buttons

Two tiers, same shape, same padding, different fill.

**Primary** (gold fill, navy text):
```html
<a class="inline-block bg-gold text-navy font-semibold px-8 py-4 rounded hover:bg-gold-light transition-colors duration-200">
  Book a Free Discovery Call
</a>
```

**Ghost** (transparent fill, gold border):
```html
<a class="inline-block border-2 border-gold/60 text-gold font-semibold px-8 py-4 rounded hover:bg-gold/10 transition-colors duration-200">
  See the Three Tracks →
</a>
```

Shape: `rounded` (0.25rem) — slight curve reads as form-control, not as marketing pill.
Padding: vertical `1rem` (`py-4`), horizontal `2rem` (`px-8`). Large CTAs may use `px-10`.
Transition: 200ms color-only, no transform.

### Pills

Two distinct roles, never visually conflated.

**Eyebrow Pill** — small uppercase tag above a heading. Solder Gold/15 fill, Solder Gold text, `rounded-full`, label typography:
```html
<span class="inline-block bg-gold/15 text-gold text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
  AI for Local Business
</span>
```
Always uppercase, always taxonomic — names what comes next. Never decorative.

**Classifier Pill** — discriminates between buyer-track sections. Gold solid OR Navy solid, opposing text color, same `rounded-full` + label typography:
```html
<span class="inline-block bg-gold text-navy text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
  Track 1
</span>
```
Gold pill = primary / featured. Navy pill = secondary / "also". Pure information design.

### Cards

`rounded-lg` (0.5rem) corners, Page White fill, internal padding `p-8` (2rem all sides), no border (rely on shadow + white-on-off-white contrast). For highlighted cards, switch to `border-2 border-gold` + absolute-positioned "Most Requested" badge:

```html
<div class="border-2 border-gold rounded-lg p-8 mb-8 relative">
  <div class="absolute -top-3 left-8">
    <span class="bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">Most Requested</span>
  </div>
  ...
</div>
```

Live examples: `services.html:115-156` (Build card), `pricing.html:114-150` (Build pricing card).

### Inputs

Single style, optimized for the email-capture and contact forms.
- Border: 1px `border-gray-300` (Ink-300)
- Background: Page White
- Radius: `rounded-lg` (0.5rem)
- Padding: `py-3 px-4` (~12px vertical, 16px horizontal)
- Focus: 2px Solder Gold ring (`focus:ring-2 focus:ring-gold`), transparent border (`focus:border-transparent`)

The Solder Gold focus ring is the **only** place on the site where a glow-adjacent treatment is permitted. It's purely functional (focus indication for accessibility).

### Navigation (sticky header)

Drafting Navy background, white wordmark with Solder Gold "S" letter-color split (signals the WTS abbreviation without an external logo). Default link state: white text, `font-medium`. Hover: Solder Gold, 200ms color-only.

The CTA button at the right edge of the desktop nav uses the Primary Button variant. The mobile hamburger reveals a Drafting Navy Light drawer with the same link list vertically stacked. See [[pages#header--nav-consistency]] for the per-page consistency rules.

### Stat Strip (signature component)

The three-up statistics block on the homepage (`index.html:236-249`):
- Container: Ink-200 1px border, `rounded-xl` (0.75rem), three columns separated by 1px internal dividers. No shadow.
- Cell: vertical center-aligned, `py-10` (40px vertical padding). Stat number is `text-4xl font-bold text-navy`, 8px gap, caption is `text-gray-600`.

**Strict invariant:** every number in this strip references a verifiable artifact. Round numbers without referents are forbidden. The 2026-05-18 audit flagged the current middle stat ("3 / Service tracks: dev, training, automation") as tautological — see `_backlog.md` for the replace-with-a-real-stat backlog item.

---

## Anti-references

These are the visual postures the system **actively rejects**. Stated verbatim from `DESIGN.md:126` and `PRODUCT.md`.

1. **The "AI consultancy" Squarespace template.** Purple/teal gradient hero, glowing brain-circuit stock photo, evergreen-stock illustrations, copy like *"We harness the transformative power of AI to unlock value."* Decorated promise with no specific referent.
2. **The LinkedIn-influencer landing page.** Oversized founder photo, hand-drawn arrows, *"I helped 47 founders 10x their revenue"*, neon CTAs, fake-handwritten testimonials. Performative confidence aimed at a different buyer.
3. **The Big-4 services page** (Accenture, Deloitte, EY AI offerings). Corporate stock photography, slide-deck aesthetics, abstract nouns like *"synergies"* and *"transformation journeys"*, zero specifics, six-figure procurement vibe.

The connecting thread is **decoration without referent**. WTS visuals must read as proof, not as marketing of proof.

The credibility linter (see [[linter#pattern-catalog]]) enforces the verbal correlates — buzzword-soup pattern, credibility-theater pattern, AI-replaced patterns — but the visual postures are agent-discipline-only.

---

## Do / Don't (verbatim from DESIGN.md:255-275)

### Do

- Use Solder Gold on ≤10% of any screen surface; reserve it for CTAs, eyebrow pills, single-word emphasis, link affordances.
- Alternate Page White ↔ Page Off-White (or Page White ↔ Drafting Navy) for section rhythm.
- Lead every major section with a labelled eyebrow pill.
- Keep body copy at 65–75 characters per line.
- Hold the type system to Inter, four weights, eight roles.
- Ground every statistic in a verifiable artifact. Prefer specific numbers (`705,714 lines`) to round ones (`750k+`).
- Honor `prefers-reduced-motion` on every transition.

### Don't

- Introduce gradient text, gradient buttons, or gradient hero backgrounds.
- Introduce a second typeface for "personality" (no serif display, no script, no mono accent).
- Add ambient drop-shadow, glassmorphism, glow halos, or backdrop-blur effects.
- Use a brain icon, abstract circuit illustration, generic AI stock photography, or any "we harness the power of AI" framing.
- Use a hand-drawn arrow, oversized founder portrait, or neon-accent CTA.
- Use abstract enterprise nouns (*"synergies"*, *"transformation journey"*, *"value unlock"*).
- Use round-number marketing metrics without a referent (`10x`, `400% improvement`, `100s of clients`).
- Style cards with internal tints, nested cards, or borders combined with shadow.
- Introduce a second elevation level.

---

## Accessibility commitments

<!-- verified-against: DESIGN.md does not specify per-element AA verification; PRODUCT.md §Accessibility (lines 57-70) is the source -->

Target: **WCAG 2.2 AA** for all public marketing pages. Concrete commitments stated in `PRODUCT.md` lines 61-69:

- Body text contrast ≥ 4.5:1; large heading contrast ≥ 3:1
- Every interactive element keyboard-reachable, visible focus ring (not removed for aesthetic reasons)
- Meaningful images carry alt text; decorative use empty alt or `aria-hidden`
- Form fields have labels; error messages readable by assistive tech
- No content depends on color alone (status indicators pair color with text or icon)
- `prefers-reduced-motion` honored on every transition (chatbot widget JS verified 2026-05-18: bounce animation + panel slide transform disabled under the media query)

AAA is not a target (would over-constrain typography + color choices for marginal real-world benefit).

---

## Anti-patterns

| Don't | Do |
|---|---|
| Add a new color outside the two-color palette | If a new role genuinely needs differentiation, use weight or scale, not color |
| Reach for a shadow to "make something pop" | Change weight, color, or spacing instead. Cards on Off-White get the one Card Lift shadow; that's it |
| Use `border-left: 4px solid gold` as a left-side accent on cards or alerts | Cards rely on shadow + contrast; alerts use neutral icons + color, not stripes |
| Introduce a second typeface for "personality" | Inter does every job. If a role isn't expressible in Inter at one of the eight scales, the role is wrong |
| Apply `text-gold` to a multi-sentence paragraph | Solder Gold is for single-word emphasis. A whole gold paragraph is a slop-test failure |
| Add a `prefers-reduced-motion` exemption | All transitions must degrade gracefully or disable. This is an accessibility commitment |

---

## Backlog

- `small-business.html` has two consecutive `bg-white` sections (audit 2026-05-18). Either insert a Page Off-White transition or accept the violation as a documented exception.
- The middle stat strip cell ("3 service tracks") is tautological — replace with a verifiable artifact reference.
- ~~`prefers-reduced-motion` honoring in chatbot widgets.~~ Resolved 2026-05-18 — see [[chatbot#backlog]] for the verifying commit.
- A planned cheatsheet `docs/_cheatsheets/color-tokens.md` could distill the hex/token/Tailwind-class triple from this doc into a ≤30-line lookup. Hold off until the lookup proves repetitive.
