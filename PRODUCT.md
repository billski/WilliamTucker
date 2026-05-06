# Product

## Register

brand

## Users

The site fishes for two distinct buyer tracks, and is intentionally scoped wide because William has no signed clients yet and is testing where revenue lands first.

**Track A — Legacy modernization.** Decision-maker inside an organization stuck on .NET, Classic ASP, Oracle PL/SQL, or comparable older stacks. Likely titles: IT director, head of applications, CTO at a small org, or the senior dev who has been quietly rewriting the same system for five years. They have been quoted by traditional consultancies in months and six-figure ranges. They arrive skeptical that "AI-accelerated" means anything real.

**Track B — AI consulting for finance teams and small businesses.** Finance manager, controller, or owner-operator who has heard about AI but has been burned by hype, by slide-deck firms, or by tools that did not survive contact with their actual workflow. They want working software, not a strategy deck.

Both tracks share a posture: they trust evidence over claims, and they have already filtered out the obvious AI-hype consultancies before landing here.

## Product Purpose

Convert a one-person consulting practice (William Tucker Solutions) into booked discovery calls. The site is the entire top-of-funnel — there is no paid acquisition, no sales team, no SDR. Every page has to earn the call by itself.

Success is a discovery call booked by a buyer who already understands which track applies to them and arrives with a real project, not a vague "tell me about AI" inquiry.

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
5. **Wide net, sharp evidence.** The site fishes for two distinct buyer tracks, so navigation and entry points must serve both without diluting either. Each track gets its own dedicated proof, not a generic shared frame.

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
