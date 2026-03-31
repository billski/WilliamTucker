# BridgeAI Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page static brochure website for BridgeAI, an AI consulting business targeting small/medium finance-sector businesses.

**Architecture:** Static HTML pages styled with Tailwind CSS v4 (standalone CLI). No frameworks. Vanilla JS for mobile nav only. Designed for Dreamhost static hosting.

**Tech Stack:** HTML5, Tailwind CSS v4 (standalone CLI), vanilla JavaScript, Google Fonts (Inter)

**Spec:** `docs/superpowers/specs/2026-03-31-bridgeai-website-design.md`

**Brand:**
- Primary: #1a2332 (dark navy)
- Accent: #d4a843 (gold/amber)
- Backgrounds: #ffffff, #f8f9fa
- Font: Inter (Google Fonts)

---

## File Structure

```
BridgeAI/
├── index.html              Homepage
├── services.html           Services overview
├── about.html              Founder story + CV highlights
├── case-studies.html       Portfolio (placeholder content)
├── contact.html            Contact form + Book a Call CTA
├── src/
│   └── input.css           Tailwind source CSS (imports + custom)
├── css/
│   └── styles.css          Tailwind compiled output
├── js/
│   └── main.js             Mobile nav toggle
├── img/
│   └── placeholder.svg     Headshot placeholder
├── tailwind.config.js      Tailwind configuration
├── package.json            Scripts for Tailwind CLI build/watch
└── .gitignore
```

---

### Task 1: Project Setup & Tailwind Configuration

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `src/input.css`
- Create: `css/styles.css` (generated)
- Create: `.gitignore`

- [ ] **Step 1: Initialize project with package.json**

```json
{
  "name": "bridgeai-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "npx @tailwindcss/cli -i src/input.css -o css/styles.css --minify",
    "watch": "npx @tailwindcss/cli -i src/input.css -o css/styles.css --watch"
  }
}
```

- [ ] **Step 2: Create Tailwind config**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2332',
          light: '#243044',
          dark: '#111827',
        },
        gold: {
          DEFAULT: '#d4a843',
          light: '#e0be6a',
          dark: '#b8912e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create Tailwind source CSS**

```css
@import "tailwindcss";
@config "../tailwind.config.js";

@layer base {
  body {
    @apply font-sans text-gray-800 antialiased;
  }
  h1, h2, h3, h4 {
    @apply text-navy;
  }
  a {
    @apply transition-colors duration-200;
  }
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
.DS_Store
Thumbs.db
```

- [ ] **Step 5: Install Tailwind and build CSS**

Run: `npm install tailwindcss @tailwindcss/cli && npm run build`
Expected: `css/styles.css` is generated with compiled Tailwind output.

- [ ] **Step 6: Create placeholder SVG for headshot**

Create `img/placeholder.svg` — a simple gray circle with a person silhouette icon, 200x200.

- [ ] **Step 7: Commit**

```bash
git add package.json tailwind.config.js src/input.css css/styles.css .gitignore img/placeholder.svg
git commit -m "chore: project setup with Tailwind CSS v4"
```

---

### Task 2: Shared Navigation & Footer + JavaScript

**Files:**
- Create: `js/main.js`

This task creates the nav and footer HTML patterns that will be copy-pasted into each page. Also creates the mobile nav toggle JS.

- [ ] **Step 1: Write mobile nav toggle JS**

```js
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(!isOpen));
    });
  }
});
```

- [ ] **Step 2: Verify JS loads without errors**

Create a minimal `index.html` with just the doctype, the script tag `<script src="js/main.js"></script>`, and open in browser. Console should show no errors.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add mobile nav toggle script"
```

---

### Task 3: Homepage (index.html)

**Files:**
- Create: `index.html`

The homepage includes: nav, hero, value propositions (3-col), services preview (4 cards), social proof placeholder, and footer. This is the longest page and establishes the HTML patterns for all other pages.

- [ ] **Step 1: Build full index.html**

The page must include these sections in order:

1. **`<head>`**: charset, viewport, title "BridgeAI | AI Consulting for Finance", meta description, Open Graph tags (og:title, og:description, og:type=website), Google Fonts link for Inter (weights 400,500,600,700), link to `css/styles.css`.

2. **`<header>`** (sticky, navy background):
   - Logo text "BridgeAI" linking to `index.html`, styled in white with gold accent on "AI"
   - Desktop nav links: Services, About, Case Studies, Contact — white text, gold on hover
   - "Book a Call" button styled gold bg with navy text, linking to `contact.html`
   - Mobile: hamburger button (3-line SVG icon, white) with `id="mobile-menu-button"`, `aria-expanded="false"`, `aria-controls="mobile-menu"`
   - Mobile menu div with `id="mobile-menu"`, class `hidden`, containing same nav links stacked vertically

3. **`<main>`**:

   a. **Hero section** (navy bg, full-width, generous padding):
   - h1: "Turn AI from Buzzword to Business Advantage"
   - p: "I help finance teams and small businesses cut through the AI hype. With 12+ years of engineering experience, I don't just advise — I build production-grade solutions that deliver real results."
   - CTA link styled as gold button: "Book a Free Discovery Call" -> `contact.html`

   b. **Value propositions** (white bg):
   - Section heading: "Why Work With BridgeAI"
   - 3 columns (stack on mobile), each with:
     - SVG icon (simple inline SVG — shield for vendor-agnostic, user for senior engineer, lightbulb for knowledge transfer)
     - h3 title
     - p description
   - Column 1: "Vendor-Agnostic Advice" / "No platform affiliations or commission-driven recommendations. Just honest guidance on what works for your business."
   - Column 2: "Senior Engineer Does the Work" / "No bait-and-switch with junior staff. The person you meet is the person who does the work."
   - Column 3: "Knowledge Transfer" / "My goal is to make your team self-sufficient, not dependent on outside consultants."

   c. **Services preview** (light gray bg #f8f9fa):
   - Section heading: "How I Can Help"
   - 4 cards (2x2 grid on desktop, stack on mobile), each with:
     - h3 title
     - Brief 1-sentence description
     - "Learn more →" link to `services.html`
   - Cards: AI Strategy & Roadmapping, AI Implementation & Prototyping, Fractional AI Advisor, Training & Workshops

   d. **Social proof** (white bg):
   - Section heading: "Trusted By" (or "What Clients Say")
   - 3 placeholder testimonial cards with italic quote text, name, and company — use realistic placeholder text like "BridgeAI helped us identify three AI opportunities we hadn't considered..." attributed to "— Coming Soon"
   - Styled and ready to replace with real testimonials

4. **`<footer>`** (navy bg):
   - 3-column layout (stack on mobile):
     - Col 1: "BridgeAI" logo text, one-liner tagline "AI consulting for finance"
     - Col 2: Nav links (Services, About, Case Studies, Contact)
     - Col 3: "Connect" — LinkedIn link, GitHub link (github.com/billski), email (william@williamtucker.ca)
   - Bottom bar: "© 2026 BridgeAI. All rights reserved."

5. **Script tag**: `<script src="js/main.js"></script>` before `</body>`

- [ ] **Step 2: Build CSS and test in browser**

Run: `npm run build`
Open `index.html` in browser. Verify:
- Nav shows on desktop, hamburger on mobile (<768px)
- Hamburger toggles mobile menu
- All sections render with correct colors/spacing
- Responsive layout works (3-col -> 1-col, 2x2 -> 1-col)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: build homepage with hero, value props, services preview, footer"
```

---

### Task 4: Services Page (services.html)

**Files:**
- Create: `services.html`

- [ ] **Step 1: Build services.html**

Same `<head>` as index.html but title "Services | BridgeAI" and description about AI consulting services. Same `<header>` and `<footer>` as index.html (copy). Mark "Services" nav link as active (gold text or underline).

**`<main>`**:

1. **Page hero** (navy bg, shorter than homepage hero):
   - h1: "Services"
   - p: "From strategy to implementation, I help finance teams harness AI with practical, production-grade solutions."

2. **Services section** (white bg):
   4 service cards, each as a bordered card with generous padding:

   **Card 1: AI Strategy & Roadmapping**
   - Icon: simple inline SVG (compass or map icon)
   - h2: "AI Strategy & Roadmapping"
   - Description: "Not sure where AI fits in your operations? I'll assess your current workflows, identify the highest-ROI opportunities, and deliver an actionable roadmap with clear priorities and timelines. You'll know exactly where to invest — and where not to."
   - Bullet list of deliverables:
     - "Comprehensive AI opportunity assessment"
     - "Prioritized use cases ranked by ROI and feasibility"
     - "Phased implementation roadmap with timeline"
     - "Vendor and technology recommendations"
   - CTA button: "Book a Discovery Call" -> `contact.html`

   **Card 2: AI Implementation & Prototyping**
   - Icon: simple inline SVG (code/terminal icon)
   - h2: "AI Implementation & Prototyping"
   - Description: "I don't just hand you a slide deck and walk away. I build working proofs of concept and integrate AI into your existing systems. With 12+ years of production engineering experience, I deliver solutions that actually work — not just demos."
   - Bullet list:
     - "Rapid proof-of-concept development"
     - "Integration with existing systems and data pipelines"
     - "Production-grade code, not throwaway prototypes"
     - "Documentation and handoff to your team"
   - CTA button: "Book a Discovery Call" -> `contact.html`

   **Card 3: Fractional AI Advisor**
   - Icon: simple inline SVG (chat/advisor icon)
   - h2: "Fractional AI Advisor"
   - Description: "Need ongoing AI guidance without the cost of a full-time hire? As your fractional AI advisor, I provide strategic direction as the landscape evolves, evaluate vendors, and mentor your team — on a flexible monthly retainer."
   - Bullet list:
     - "Monthly strategic guidance sessions"
     - "Vendor and tool evaluation"
     - "Team mentoring and upskilling"
     - "Ongoing roadmap adjustments"
   - CTA button: "Book a Discovery Call" -> `contact.html`

   **Card 4: Training & Workshops**
   - Icon: simple inline SVG (presentation/people icon)
   - h2: "Training & Workshops"
   - Description: "Your team doesn't need to be AI experts — they need to know enough to make smart decisions and use the right tools. I deliver hands-on sessions tailored to your organization, from executive briefings to technical deep-dives."
   - Bullet list:
     - "Executive AI literacy sessions"
     - "Hands-on workshops with real tools and data"
     - "Custom curriculum for your team's needs"
     - "Follow-up resources and support"
   - CTA button: "Book a Discovery Call" -> `contact.html`

3. **Process section** (light gray bg):
   - h2: "How It Works"
   - 3 steps in a horizontal flow (stack on mobile):
     - Step 1: "Discovery Call" / "We discuss your goals, challenges, and where AI might fit. Free, no obligation."
     - Step 2: "Assessment & Plan" / "I dig into your operations and deliver a clear recommendation with priorities and next steps."
     - Step 3: "Build & Deliver" / "I implement the solution, integrate it with your systems, and make sure your team can run with it."

- [ ] **Step 2: Build CSS and test**

Run: `npm run build`
Verify page renders correctly, all cards display, responsive layout works, CTAs link to contact.html.

- [ ] **Step 3: Commit**

```bash
git add services.html
git commit -m "feat: build services page with 4 service cards and process section"
```

---

### Task 5: About Page (about.html)

**Files:**
- Create: `about.html`

- [ ] **Step 1: Build about.html**

Same head/header/footer pattern. Title "About | BridgeAI". Mark "About" nav link as active.

**`<main>`**:

1. **Page hero** (navy bg):
   - h1: "About"
   - p: "The engineer behind BridgeAI."

2. **Bio section** (white bg):
   - 2-column layout on desktop (stack on mobile): left = placeholder headshot image (img/placeholder.svg in a rounded container), right = bio text
   - h2: "William Tucker"
   - Subtitle: "Senior Software Engineer · AI Consultant"
   - Bio paragraphs (3 short paragraphs):
     - "I've spent over 12 years building production software — from legacy system modernizations to full-stack applications, CI/CD pipelines to secure authentication systems. I've shipped code that thousands of people rely on daily."
     - "Working in the finance department at a large institution, I've seen firsthand how the right technology can transform operations — and how the wrong approach wastes time and money. That experience is what drives BridgeAI: practical, no-hype AI consulting grounded in real engineering."
     - "Before software, I was a journeyman marine technician. I know what it means to build things that have to work, and I bring that same mindset to every project."

3. **Expertise section** (light gray bg):
   - h2: "What I Bring to the Table"
   - Grid of skill/expertise cards (3 columns, stack on mobile):
     - "System Modernization" / "Led full application rewrites from legacy platforms to modern frameworks — delivered in weeks, not months."
     - "Data & Integration" / "Oracle, SQL, PostgreSQL, ETL pipelines, REST/SOAP APIs. I make systems talk to each other."
     - "Security-First Engineering" / "SSO, OAuth, JWT, Row Level Security — I build secure systems by default, not as an afterthought."
     - "Full-Stack Development" / ".NET, Blazor, Next.js, React, TypeScript. Backend to frontend, I ship the whole stack."
     - "DevOps & CI/CD" / "Git workflows, automated pipelines, review-gated deploys. I set up the infrastructure that lets teams move fast safely."
     - "Team Leadership" / "Mentored developers, wrote team handbooks, established development workflows for teams of six."

4. **Philosophy section** (white bg):
   - h2: "My Approach"
   - 3 short principles:
     - "No Hype" / "I won't tell you AI will solve everything. I'll tell you where it fits and where it doesn't."
     - "Production-Grade" / "Demos are easy. I build solutions that work in the real world, at scale, with your existing systems."
     - "Knowledge Transfer" / "I want your team to own the solution. I document everything and train your people."

5. **Links section:**
   - LinkedIn and GitHub (github.com/billski) as styled icon links
   - CTA: "Book a Discovery Call" -> `contact.html`

- [ ] **Step 2: Build CSS and test**

Run: `npm run build`
Verify layout, responsive behavior, links work.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: build about page with bio, expertise, and philosophy sections"
```

---

### Task 6: Case Studies Page (case-studies.html)

**Files:**
- Create: `case-studies.html`

- [ ] **Step 1: Build case-studies.html**

Same head/header/footer pattern. Title "Case Studies | BridgeAI". Mark "Case Studies" nav link as active.

**`<main>`**:

1. **Page hero** (navy bg):
   - h1: "Case Studies"
   - p: "Real problems. Practical solutions. Measurable results."

2. **Case studies section** (white bg):
   3 case study cards, each with a left-border accent in gold (#d4a843):

   **Case Study 1: dogmap.ca (Technical Showcase)**
   - Tag/badge: "Technical Showcase"
   - h2: "Building a Full-Stack PWA from Scratch"
   - **Problem:** "Needed a production-quality progressive web app with real-time data, geospatial features, OAuth authentication, and role-based access control — built and shipped as a solo developer."
   - **Approach:** "Designed and built dogmap.ca using Next.js, TypeScript, Supabase (PostgreSQL + PostGIS), and Vercel. Implemented Row Level Security on all tables, OAuth with Google and Apple, JWT-protected API routes, admin dashboard with moderation queue, and MapLibre-powered interactive maps."
   - **Result:** "Live production application at dogmap.ca serving real users. Demonstrates full-stack architecture, security-first design, cloud infrastructure, and the ability to ship end-to-end as a solo engineer."
   - Link: "Visit dogmap.ca →"

   **Case Study 2: Placeholder**
   - Tag/badge: "Finance"
   - h2: "AI-Powered Financial Reporting Automation"
   - **Problem:** "A mid-size company spent 40+ hours per month manually compiling financial reports from multiple data sources."
   - **Approach:** "Assessed existing workflows, identified automation opportunities, and built an AI-assisted pipeline to extract, reconcile, and generate reports."
   - **Result:** "Reduced reporting time by 75% and eliminated manual data entry errors. Team redirected to higher-value analysis work."
   - Note: Small italic text at bottom: "Details available upon request."

   **Case Study 3: Placeholder**
   - Tag/badge: "Strategy"
   - h2: "AI Readiness Assessment for Growing Firm"
   - **Problem:** "A 50-person financial services firm wanted to leverage AI but didn't know where to start or what was realistic."
   - **Approach:** "Conducted a 2-week assessment: interviewed stakeholders, audited data infrastructure, and mapped 12 potential AI use cases against ROI and feasibility."
   - **Result:** "Delivered a prioritized 12-month roadmap. The firm implemented the top-priority use case within 3 months, saving an estimated $200K annually."
   - Note: Small italic text at bottom: "Details available upon request."

3. **CTA section** (light gray bg):
   - h2: "Let's Build Your Success Story"
   - p: "Every engagement starts with a conversation."
   - CTA button: "Book a Free Discovery Call" -> `contact.html`

- [ ] **Step 2: Build CSS and test**

Run: `npm run build`
Verify cards render, gold left-border accent shows, responsive layout works.

- [ ] **Step 3: Commit**

```bash
git add case-studies.html
git commit -m "feat: build case studies page with dogmap.ca showcase and placeholders"
```

---

### Task 7: Contact Page (contact.html)

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Build contact.html**

Same head/header/footer pattern. Title "Contact | BridgeAI". Mark "Contact" nav link as active.

**`<main>`**:

1. **Page hero** (navy bg):
   - h1: "Let's Talk"
   - p: "Every engagement starts with a free discovery call. No pressure, no obligation — just a conversation about your goals."

2. **Contact section** (white bg):
   2-column layout (stack on mobile):

   **Left column: Book a Call**
   - h2: "Book a Free Discovery Call"
   - p: "30 minutes to discuss your business, your challenges, and whether AI is the right fit."
   - Calendly placeholder: a styled div with dashed border, containing text "Calendly scheduling widget will appear here" and an HTML comment `<!-- Replace this div with your Calendly inline widget embed code -->` so William knows exactly where to paste it.

   **Right column: Contact Form**
   - h2: "Send a Message"
   - Form with `action="https://formspree.io/f/YOUR_FORM_ID"` method="POST" (with HTML comment to replace YOUR_FORM_ID):
     - Name: `<input type="text" name="name" required placeholder="Your name">`
     - Email: `<input type="email" name="email" required placeholder="your@email.com">`
     - Company: `<input type="text" name="company" placeholder="Company name (optional)">`
     - Message: `<textarea name="message" required rows="5" placeholder="Tell me about your project or question..."></textarea>`
     - Submit button: "Send Message" (gold bg, navy text)
   - All inputs styled with border, rounded, focus ring in gold

3. **Direct contact section** (light gray bg):
   - h2: "Other Ways to Reach Me"
   - 3 items in a row (stack on mobile), each with icon + text:
     - Email: william@williamtucker.ca (mailto link)
     - LinkedIn: linkedin.com/in/william-tucker-06203044/ (external link)
     - GitHub: github.com/billski (external link)

- [ ] **Step 2: Build CSS and test**

Run: `npm run build`
Verify form renders, placeholder is clear, links work, responsive layout correct.

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "feat: build contact page with form and Calendly placeholder"
```

---

### Task 8: Final Polish & Cross-Page Verification

**Files:**
- Modify: all HTML files
- Modify: `src/input.css` (if needed)

- [ ] **Step 1: Verify all nav links work across all pages**

Open each page in browser and click every nav link. Verify:
- Logo links to index.html from every page
- All 4 nav links work from every page
- Active page is highlighted in nav
- Mobile hamburger works on every page
- "Book a Call" header button links to contact.html

- [ ] **Step 2: Verify all CTA buttons link correctly**

Every "Book a Discovery Call" / "Book a Free Discovery Call" button on every page should link to `contact.html`.

- [ ] **Step 3: Verify responsive design on all pages**

Check each page at mobile (375px), tablet (768px), and desktop (1280px) widths:
- Navigation collapses to hamburger on mobile
- Multi-column layouts stack on mobile
- Text is readable at all sizes
- No horizontal overflow

- [ ] **Step 4: Verify footer consistency**

All 5 pages must have identical footers with:
- BridgeAI logo text and tagline
- Nav links (Services, About, Case Studies, Contact)
- LinkedIn, GitHub (github.com/billski), email links
- Copyright 2026

- [ ] **Step 5: Run final CSS build**

Run: `npm run build`
Ensure `css/styles.css` is up to date with all classes used across all pages.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: final polish and cross-page verification"
```

---
