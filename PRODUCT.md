# Product

> **Note:** the deep version of this doc — the three tracks, framing rules, audience, anti-references — lives in the docs vault at `docs/positioning.md`. Read that for the canonical, code-cited treatment. This file remains as the brand-voice / design-principles / accessibility quick reference.

## Register

brand

## Users

Referral-driven Kelowna SMB-first. Most visitors arrive via referral; the site is service confirmation + booking, not credibility argument.

Three service tracks (full detail in `docs/positioning.md`):

1. **AI-Accelerated Software Development** — custom software, modernizations, enhancements. AI handles boilerplate; William handles engineering and review.
2. **AI Training** — 1:1, group workshops, custom curriculum. In-person Kelowna or online. From a daily practitioner, not a credentialled trainer.
3. **AI Workflow Automation** — chatbots, custom integrations, internal tooling. AI plugged into systems the client already uses.

The previous dual-track structure ("Legacy modernization" + "AI consulting for finance teams") was retired in PR #4 (2026-05-15). Don't reintroduce it.

## Product Purpose

Convert a one-engineer consulting practice (William Tucker Solutions) into booked discovery calls. The site is the entire top-of-funnel — there is no paid acquisition, no sales team, no SDR. Most clients arrive via referral.

Success is a discovery call booked by a referral-warm visitor who picked the right track from the three above and arrives with a real project, not a vague "tell me about AI" inquiry.

## Brand Personality

Three words: **competent, plainspoken, unhyped.**

Voice: a senior staff engineer who has shipped real systems, talking to another technical buyer. Confident without performing confidence. Specific over abstract. Numbers and names over adjectives.

The site sells competence as proof, not promise. Every claim has a referent: a project name, a line count, a timeline, a stack, a client (when there is one). Anything that cannot survive being asked "show me" gets cut.

Critical framing rules that govern all copy:

- **12+ years** professional software experience (since 2013). Never "15+", never inflate.
- **AI-accelerated, never AI-replaced.** The work is augmented senior engineering, not generated automation. William reviews and owns every line. <!-- check-claims-allow: framing rule quotes the forbidden phrase intentionally -->
- **Dual-role honesty.** William is currently both Programmer/Analyst at Vancouver Island University and the founder of WTS. The site does not pretend WTS is his sole employment.
- **Project status accuracy.** RoomBooking is in QA pending organizational approval, not in production. BIS was approximately seven weeks of work (66 commits, 14 branches), not two days. No rounding-up. <!-- check-claims-allow: framing rule quotes the forbidden phrase intentionally -->
- **Honest stack gaps.** No production MySQL, no AWS, no Salesforce, no native mobile, no modern PHP framework experience. Adjacent skills do not get framed as transferable when they are not. <!-- check-claims-allow: framing rule listing honest stack gaps -->

## Anti-references

The visual and verbal posture of WTS should not be confused with any of these:

1. **The "AI consultancy" Squarespace template.** Purple/teal gradient hero, glowing brain-circuit stock photo, evergreen-stock illustrations, copy like "We harness the transformative power of AI to unlock value." Decorated promise with no specific referent.
2. **The LinkedIn-influencer landing page.** Oversized founder photo, hand-drawn arrows, "I helped 47 founders 10x their revenue", neon CTAs, fake-handwritten testimonials. Performative confidence aimed at a different buyer.
3. **The Big-4 services page** (Accenture, Deloitte, EY AI offerings). Corporate stock photography, slide-deck aesthetics, abstract nouns like "synergies" and "transformation journeys", zero specifics, six-figure procurement vibe. WTS is the structural opposite: one named engineer, named projects, verifiable numbers.

The connecting thread is decoration without referent. WTS visuals must read as proof, not as marketing of proof.

## Design Principles

1. **Proof, not promise.** Every page-level claim resolves to a specific project, number, or stack. If a sentence cannot be verified by clicking through to evidence, it gets cut or rewritten.
2. **No hype, no slide decks.** Direct from the site's own positioning. The aesthetic must reinforce this: no gradient text, no glassmorphism, no decorative AI imagery, no animated count-ups, no "transformation journey" diagrams.
3. **Solo-engineer credibility.** A one-person practice cannot fake enterprise-scale theater, and the design should not try. Tight typography, real names, real timelines, modest scale. Boutique, not boutique-pretending-to-be-enterprise.
4. **Senior-engineer voice.** Copy reads as one technical professional talking to another. No marketing-speak, no first-person-plural ("our team"), no future-tense vague promises. Present tense, specific verbs, concrete nouns.
5. **Wide net, sharp evidence.** The site offers three service tracks, so navigation and entry points must serve all three without diluting any of them. Each track gets its own dedicated section, not a generic shared frame.

## Accessibility & Inclusion

Target: **WCAG 2.2 AA** for all public marketing pages.

Concrete commitments:

- Body text contrast ratio at least 4.5:1; large heading contrast at least 3:1.
- Every interactive element reachable by keyboard, with a visible focus ring that is not removed for aesthetic reasons.
- Meaningful images carry alt text; decorative images use empty alt or `aria-hidden`.
- Form fields have associated labels; error messages are readable by assistive tech.
- No content depends on color alone (e.g. status indicators pair color with text or icon).
- `prefers-reduced-motion` is honored — animations either disable or degrade gracefully.

AAA is not a target; it would over-constrain typography and color choices for marginal real-world benefit on a marketing surface.
