# BridgeAI Website Design Spec

## Overview

A static brochure website for BridgeAI, an AI consulting business targeting small/medium finance-sector businesses. Owned and operated by William Tucker, a senior software engineer with 12+ years of experience currently working in a finance department.

The site's primary goal is to establish credibility and funnel visitors to a free discovery call.

## Tech Stack

- **Static HTML** (5 pages)
- **Tailwind CSS v4** via standalone CLI
- **Vanilla JavaScript** (mobile nav toggle only)
- **Hosting:** Dreamhost (static file deployment via FTP/SSH or GitHub Actions)
- **No frameworks, no build dependencies at runtime**

## Site Structure

```
BridgeAI/
├── index.html          Homepage
├── services.html       Services overview
├── about.html          Founder story + CV highlights
├── case-studies.html   Portfolio (placeholder content)
├── contact.html        Contact form + Book a Call CTA
├── css/
│   └── styles.css      Tailwind output
├── js/
│   └── main.js         Mobile nav toggle, form handling
├── img/                Logo, headshot placeholder, icons
└── tailwind.config.js
```

## Brand & Visual Design

- **Primary color:** Dark navy (#1a2332)
- **Accent color:** Gold/amber (#d4a843)
- **Backgrounds:** White (#ffffff) and light gray (#f8f9fa)
- **Typography:** Inter (Google Fonts) -- single family, multiple weights
- **Logo:** Text-based "BridgeAI" mark, clean sans-serif, optional subtle bridge/connection icon
- **Overall feel:** Clean, minimal, professional -- "senior consultant" aesthetic
- **No stock robot/AI imagery**

## Page Designs

### Homepage (index.html)

1. **Navigation:** Logo left, nav links right (Services, About, Case Studies, Contact). Hamburger on mobile.
2. **Hero section:**
   - Headline: "Turn AI from buzzword to business advantage" (or similar)
   - Subtext: Positioning as hands-on engineer who builds, not just advises. Finance-sector focus.
   - CTA button: "Book a Free Discovery Call"
3. **Value propositions:** 3-column layout
   - Vendor-agnostic advice
   - Senior engineer does the work (no bait-and-switch)
   - Knowledge transfer (build independence, not dependency)
4. **Services preview:** Brief cards for each service linking to services.html
5. **Social proof:** Placeholder section for client testimonials/logos (styled, ready to populate)
6. **Footer:** Contact info, nav links, LinkedIn, GitHub (github.com/billski), email

### Services (services.html)

4 service offerings, each as a card with description of what the client gets:

1. **AI Strategy & Roadmapping**
   - Assess current operations for AI opportunities
   - Prioritize use cases by ROI potential
   - Deliver actionable roadmap with timeline

2. **AI Implementation & Prototyping**
   - Build working proofs of concept
   - Integrate AI into existing systems
   - Production-grade engineering (not just demos)

3. **Fractional AI Advisor**
   - Ongoing monthly retainer
   - Strategic guidance as AI landscape evolves
   - Vendor evaluation, team mentoring

4. **Training & Workshops**
   - Executive AI literacy sessions
   - Hands-on team workshops with real tools
   - Custom curriculum for your organization

Each card ends with CTA: "Book a Discovery Call"

**No pricing is displayed anywhere on the site.**

### About (about.html)

- **Your story arc:** Marine technician -> CS diploma -> 12+ years shipping production software -> finance department experience -> AI consulting
- **Key highlights from CV:**
  - Led full system modernizations (Classic ASP to .NET 8 Blazor in 4-6 weeks)
  - Architected CI/CD pipelines and developer workflows for teams
  - Built dogmap.ca from scratch (Next.js, Supabase, security-first)
  - Oracle, SQL, data pipelines, ETL, security (SSO, OAuth, RLS)
- **Your approach/philosophy:** Practical, no-hype, production-grade
- **Links:** LinkedIn, GitHub (github.com/billski)
- **Professional photo:** Placeholder image ready for replacement

### Case Studies (case-studies.html)

- 2-3 placeholder case studies using Problem -> Approach -> Result format
- Styled and structured, ready to fill in with real client work
- Optional: Include dogmap.ca as a technical showcase demonstrating full-stack capability
- Each case study shows quantified outcomes where possible

### Contact (contact.html)

- **Primary CTA:** "Book a Free Discovery Call" with Calendly embed placeholder
- **Secondary:** Contact form (name, email, company, message)
- **Also listed:** Email address, LinkedIn profile, GitHub profile
- **Form handling:** Formspree or Dreamhost server-side form processing

## Responsive Design

- Mobile-first approach
- Hamburger navigation on screens < 768px
- Single-column layouts on mobile, multi-column on desktop
- Touch-friendly tap targets

## SEO & Meta

- Semantic HTML5 elements (header, main, section, footer, nav)
- Meta title and description per page
- Open Graph tags for social sharing
- Fast load times (static HTML, minimal JS)

## External Integrations

- **Google Fonts:** Inter font family
- **Calendly:** Embed placeholder on contact page (user adds their own embed code)
- **Formspree (or similar):** Contact form submission handling
- **No analytics initially** (can add later)

## What's NOT Included (Future Additions)

- Blog / content marketing
- Analytics (Google Analytics, Plausible, etc.)
- CMS or admin panel
- Pricing page
- Client portal
