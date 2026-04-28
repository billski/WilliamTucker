---
name: William Tucker Solutions
description: Marketing site for a one-engineer consulting practice (legacy modernization + AI consulting).
colors:
  drafting-navy: "#1a2332"
  drafting-navy-light: "#243044"
  drafting-navy-dark: "#111827"
  solder-gold: "#d4a843"
  solder-gold-light: "#e0be6a"
  solder-gold-dark: "#b8912e"
  page-off-white: "#f8f9fa"
  page-white: "#ffffff"
  ink-700: "#374151"
  ink-600: "#4b5563"
  ink-500: "#6b7280"
  ink-400: "#9ca3af"
  ink-300: "#d1d5db"
  ink-200: "#e5e7eb"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  pill: "9999px"
  card: "0.5rem"
  button: "0.25rem"
  panel: "0.75rem"
  input: "0.5rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "4rem"
  section-y: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.solder-gold}"
    textColor: "{colors.drafting-navy}"
    rounded: "{rounded.button}"
    padding: "1rem 2rem"
    typography: "{typography.title}"
  button-primary-hover:
    backgroundColor: "{colors.solder-gold-light}"
    textColor: "{colors.drafting-navy}"
    rounded: "{rounded.button}"
    padding: "1rem 2rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.solder-gold}"
    rounded: "{rounded.button}"
    padding: "1rem 2rem"
    typography: "{typography.title}"
  pill-eyebrow:
    backgroundColor: "{colors.solder-gold}"
    textColor: "{colors.solder-gold}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
    typography: "{typography.label}"
  pill-classifier-primary:
    backgroundColor: "{colors.solder-gold}"
    textColor: "{colors.drafting-navy}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
    typography: "{typography.label}"
  pill-classifier-secondary:
    backgroundColor: "{colors.drafting-navy}"
    textColor: "{colors.page-white}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.page-white}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.card}"
    padding: "2rem"
  input-text:
    backgroundColor: "{colors.page-white}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.input}"
    padding: "0.75rem 1rem"
---

# Design System: William Tucker Solutions

## 1. Overview

**Creative North Star: "The Engineer's Statement."**

The visual system reads as a technical document, not a marketing page. Drafting Navy and Solder Gold reference engineering conventions (blueprint ink, soldered brass) rather than financial-services convention (corporate navy, luxury gold). Inter at sharp weights, generous line height, and a single-shadow elevation vocabulary keep every page feeling closer to a printed spec sheet than a product landing page. The site sells competence as proof. The visual system has to read the same way: every element either carries information or steps aside.

What this system explicitly rejects, carried directly from PRODUCT.md anti-references: the "AI consultancy" Squarespace template (purple/teal gradient hero, glowing brain-circuit illustration, vague abstract copy); the LinkedIn-influencer landing page (oversized founder photo, hand-drawn arrows, neon CTA, fake testimonials); the Big-4 services page (corporate stock photography, slide-deck aesthetics, abstract nouns like "synergies" and "transformation journeys"). The connecting thread is decoration without referent, and the system rejects all of it.

**Key Characteristics:**
- Two-color system. Drafting Navy carries surface, Solder Gold carries voice.
- One typeface (Inter), four weights, eight roles. No display face, no script, no mono.
- Flat-by-default. One shadow value, used structurally on cards over off-white sections.
- Eyebrow pills as taxonomy. Every pill names what comes next.
- Numbers as proof, not as ornament. Stat strips reference verifiable artifacts.

## 2. Colors: The Drafting Studio Palette

A two-color system inspired by drafting-room conventions (blueprint navy, soldered brass), supported by a soft Page Off-White that signals alternating reading bands.

### Primary
- **Drafting Navy** (`#1a2332`, `oklch(20.6% 0.029 257)`): The dominant brand surface. Used on the sticky header, hero band, footer, and the secondary CTA section. Reads as ink, not as corporate-blue convention.
- **Drafting Navy Light** (`#243044`, `oklch(25.3% 0.029 257)`): Mobile menu drawer background, hover state on navy surfaces. One step lighter, same hue.
- **Drafting Navy Dark** (`#111827`, `oklch(15.5% 0.027 257)`): Reserved for occasional deep-fill blocks; rarely used on this site at present.

### Secondary
- **Solder Gold** (`#d4a843`, `oklch(75.3% 0.113 86)`): The single accent. Carries every primary button, eyebrow pill, link emphasis, and statistic underline. Treated as voice, not decoration.
- **Solder Gold Light** (`#e0be6a`, `oklch(82.4% 0.103 87)`): Hover state on the primary button. The gold "warms up" on hover rather than darkening.
- **Solder Gold Dark** (`#b8912e`, `oklch(67.1% 0.115 84)`): Inline link color on light backgrounds (used as `text-gold-dark`) where the default Solder Gold would lose contrast.

### Neutral
- **Page Off-White** (`#f8f9fa`, `oklch(98.4% 0.001 247)`): Alternating section background. Functions as the "next page" signal in a long scroll, separating white card sections from white card sections.
- **Page White** (`#ffffff`): Card surface and primary section background.
- **Ink** (gray-700 through gray-200, Tailwind defaults): Body copy and dividers. Default body sits at `#374151` (gray-700 equivalent in current usage).

### Named Rules

**The One Voice Rule.** Solder Gold appears on ≤10% of any screen surface. Reserve it for the call-to-action, eyebrow pills, single-word emphasis in headlines, and link affordances. If gold is doing more than carrying the brand voice, the page is shouting.

**The Two-Surface Rule.** Sections alternate between Page White and Page Off-White, or between Page White and Drafting Navy. Never three surface tones in a row without a structural reason. The rhythm carries the eye down the page; breaking it costs visual coherence.

**The No-Tinted-Card Rule.** Cards are always Page White. Cards on Page Off-White sections gain elevation by shadow, never by tint. Tinted cards on tinted sections are forbidden, the contrast collapses.

## 3. Typography

**Body / Display Font:** Inter, with `system-ui, sans-serif` fallback. Weights loaded: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

**Character:** A single sans-serif carries every role on the site. Inter is the engineer's font, technical, neutral, screen-optimized. The hierarchy is built from weight and scale, not from contrasting families. The result reads as a single voice talking at different volumes, not as marketing copy with display flourishes.

### Hierarchy

- **Display** (700 / `clamp(2.25rem, 5vw, 3.75rem)` / `1.1` line-height / `-0.01em` tracking): Hero h1 only. One per page.
- **Headline** (700 / `clamp(1.875rem, 3vw, 2.25rem)` / `1.2` line-height): Section h2. Each major scroll section opens with one.
- **Title** (600 / `1.25rem` / `1.4` line-height): Card h3 / h4. Used inside cards, value-prop blocks, and sub-track headers.
- **Body Large** (400 / `1.125rem` / `1.625` line-height, max 65–75ch): Hero subhead and lead paragraphs. The reading-distance default for any content above the fold.
- **Body** (400 / `1rem` / `1.625` line-height, max 65–75ch): Default paragraph. Color: Ink-700 (`#374151`).
- **Label** (700 / `0.75rem` / `0.1em` letter-spacing / UPPERCASE): Eyebrow pills, classifier pills, statistic captions. Wide tracking compensates for the small size and signals "this is metadata, not body."

### Named Rules

**The Single-Voice Rule.** No second typeface for accents. No serif display, no monospace stat readouts, no script signature blocks. Inter does every job. Hierarchy is achieved by weight (400 → 700) and scale (1rem → ~3.75rem), never by family contrast.

**The Reading-Width Rule.** Any block of body copy that wraps more than two lines is constrained to 65 to 75 characters per line. Wider lines on a marketing site read as PDF dumps, not as thoughtful writing.

## 4. Elevation

The system is flat-by-default. There is exactly one shadow value in the entire vocabulary, and it appears in exactly one role.

### Shadow Vocabulary

- **Card Lift** (`box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`): Used only on Page White cards floating over Page Off-White sections. Purely structural separation. Never used on dark backgrounds, never used on inputs, never used on pills, never used on buttons.

### Named Rules

**The Flat-By-Default Rule.** Every surface is flat at rest. The single Card Lift shadow exists to separate cards from their off-white parent section, not to convey mood, not to create depth-as-decoration. If a designer reaches for a shadow to "make something pop," the right answer is almost always to change weight, color, or spacing instead.

**The No-Glow Rule.** Glowing borders, soft focus halos, ambient drop shadows under accent elements: all forbidden. The nearest neighbor in the anti-references is the "AI consultancy Squarespace template" with its glowing brain-circuit hero illustration. The visual system rejects glow as a category.

## 5. Components

### Buttons

A two-tier button system. Both tiers are the same shape and padding; they differ only in fill.

- **Shape:** Tight `rounded` corners (0.25rem). Not pill, not square. The slight curve reads as form-control, not as marketing pill.
- **Padding:** Vertical `1rem`, horizontal `2rem` (large CTAs use `1rem` / `3rem`). Generous but not bloated.
- **Primary** (Solder Gold fill, Drafting Navy text, font-weight 600): The single brand voice. Used for the main CTA on each section ("Book a Free Discovery Call", "Send Me the Checklist"). Hover: Solder Gold Light, no transform. Transition: `200ms` color-only.
- **Ghost** (transparent fill, 2px Solder Gold/60 border, Solder Gold text): Secondary CTA. Used alongside Primary for the "See the Proof" inverse action. Hover: Solder Gold/10 background tint. Same shape and padding as Primary.

### Pills

Two distinct pill roles, never visually conflated.

- **Eyebrow Pill** (Solder Gold/15 fill, Solder Gold text, label typography, `rounded-full`): Sits above a headline as a category tag. Examples: `AI-ACCELERATED SOFTWARE ENGINEERING`, `FREE RESOURCE`, `FOR SMALL BUSINESS OWNERS`. Always uppercase, always taxonomic, never decorative.
- **Classifier Pill** (Solder Gold solid fill OR Drafting Navy solid fill, opposing text color, `rounded-full`, label typography): Used to discriminate between buyer-track sections. Gold pill = primary / featured track. Navy pill = secondary / "also". Pure information design.

### Cards

Cards are content containers, not decorative frames.

- **Corner Style:** `rounded-lg` (0.5rem). Slightly more curved than buttons; reads as paper-block, not form-control.
- **Background:** Page White. Always.
- **Shadow:** Card Lift only. Never an alternate elevation.
- **Border:** None. Cards rely on shadow and white-on-off-white contrast for separation, not on stroke.
- **Internal Padding:** `2rem` on all sides (`p-8`). Tight enough to feel content-dense, generous enough that two-line headlines have breathing room.

### Inputs

A single input style, optimized for the email-capture and contact forms.

- **Style:** 1px Ink-300 border, Page White fill, `rounded-lg` corners, `0.75rem` vertical / `1rem` horizontal padding.
- **Focus:** 2px Solder Gold ring, transparent border. The gold ring is the only place on the site where a glow-adjacent treatment is allowed; it's purely functional (focus indication for accessibility).
- **Error / Disabled:** Not yet specified. When added, error state should pair Ink-color with text, never rely on color alone (per WCAG 2.2 AA).

### Navigation

The sticky site header.

- **Background:** Drafting Navy. Always.
- **Logo:** WT (white) + S (Solder Gold) wordmark. Letter-color split signals the WTS abbreviation without an external mark.
- **Default link state:** White text, font-medium.
- **Hover state:** Solder Gold text. Color-only transition, 200ms.
- **CTA in nav:** Primary Button variant, sits at the right edge of the desktop nav.
- **Mobile:** Hamburger reveals a Drafting Navy Light drawer with the same link list, vertically stacked.

### Stat Strip (Signature Component)

The three-up statistics block on the homepage.

- **Container:** Ink-200 1px border, `rounded-xl` (0.75rem) corners, three columns separated by 1px Ink-200 internal dividers. No shadow.
- **Cell:** Vertical center-aligned, generous vertical padding (`py-10`). Stat number (`text-4xl font-bold text-navy`), 8px gap, caption (`text-gray-600`).
- **Strict invariant:** Every number in this strip references a verifiable artifact (years of practice, line count of a real codebase, count of paid affiliations). Round numbers without referents are forbidden.

## 6. Do's and Don'ts

### Do:

- **Do** use Solder Gold on ≤10% of any screen surface, reserved for CTAs, eyebrow pills, single-word emphasis, and link affordances.
- **Do** alternate Page White and Page Off-White (or Page White and Drafting Navy) for section rhythm.
- **Do** lead every major section with a labelled eyebrow pill (`AI-ACCELERATED SOFTWARE ENGINEERING`, `FREE RESOURCE`). Pills name categories.
- **Do** keep body copy at 65 to 75 characters per line. Wider lines read as bureaucratic.
- **Do** hold the type system to Inter, four weights, eight roles. Hierarchy through weight and scale.
- **Do** ground every statistic in a verifiable artifact. Prefer specific numbers (`705,714 lines`) to round ones (`750k+`).
- **Do** honor `prefers-reduced-motion` on every transition.

### Don't:

- **Don't** introduce gradient text, gradient buttons, or gradient hero backgrounds. The visual system is solid color, not transition.
- **Don't** introduce a second typeface for "personality" (no serif display, no script, no mono accent). Inter is the single voice.
- **Don't** add ambient drop-shadow, glassmorphism, glow halos, or backdrop-blur effects. These are slop-test failures pulled directly from PRODUCT.md anti-references.
- **Don't** use `border-left` greater than 1px as a colored accent on cards, alerts, or callouts. (The current site has one residual `border-l-4` to remove.)
- **Don't** use a brain icon, abstract circuit illustration, generic AI stock photography, or any "we harness the power of AI" framing. Direct quote-by-name from the Squarespace-template anti-reference.
- **Don't** use a hand-drawn arrow, oversized founder portrait, or neon-accent CTA. Direct quote-by-name from the LinkedIn-influencer anti-reference.
- **Don't** use abstract enterprise nouns ("synergies", "transformation journey", "value unlock"). Direct quote-by-name from the Big-4 anti-reference.
- **Don't** use round-number marketing metrics without a referent (`10x`, `400% improvement`, `100s of clients`). Every stat resolves to a real artifact or it gets cut.
- **Don't** style cards with internal tints, nested cards, or borders combined with shadow. Cards are Page White, shadowed, no border.
- **Don't** introduce a second elevation level. There is one shadow on this site.
