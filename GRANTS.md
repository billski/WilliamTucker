# WTS Grant Funding Research — May 2026

**Prepared:** 2026-05-02
**Subject:** William Tucker Solutions (sole proprietorship, Kelowna BC, founded 2026)
**Need:** ~$500/month licensing + ~$5,000 hardware (~$11K total over Year 1)
**Status:** No paying clients yet (a couple pro bono websites, 1 pro bono AI engagement). William is dual-employed (VIU full-time + WTS founder).

---

## TL;DR — what I found, ranked

| # | Program | Type | Amount | Eligible now? | Effort | Verdict |
|---|---------|------|--------|---------------|--------|---------|
| 1 | **SR&ED tax credit (federal)** | Non-refundable tax credit | 15% of eligible R&D spend | ✅ Yes — sole props qualify | Medium (proper documentation) | **Best fit available right now** |
| 2 | **Community Futures Central Okanagan** | Loan (not grant) | Up to $150K | ✅ Likely — Kelowna resident | Low | **Best non-bank financing for hardware** |
| 3 | **Launch Online BC** | Grant | Up to $7,500 (75% cost coverage) | ❌ Need $30K in past-year sales | Low | Apply once you hit revenue |
| 4 | **BDC Small Business Loan** | Loan | Up to $100K (no collateral) | ⚠️ Need ~12 months revenue | Low–Medium | Backup financing route |
| 5 | **Futurpreneur Canada** | Loan + mentorship | Up to $75K | ❌ Likely aged out (18–39 cap) | — | Skip unless under 40 at application |
| 6 | **NRC IRAP** | Non-repayable contribution | $75K–$200K typical | ❌ Sole props excluded; **incorporation unlocks** | High | Incorporate first, then apply |
| 7 | **Mitacs Accelerate** | R&D project funding | Varies | ❌ Sole props excluded; incorporation required | High | Same as IRAP |
| 8 | **PacifiCan BSP** | Non-repayable | $200K min – $5M | ❌ Need 2+ yrs operating, 20% YoY growth | High | Years away |
| 9 | **AI Compute Access Fund** | Federal | $100K–$5M | ❌ Closed (last call ended 2025-07-31); Series A–stage SMEs | — | Watch for next intake; require incorporation |
| 10 | **Innovate BC Ignite** | Grant | Up to $300K | ❌ Needs academic + industry partner + 2:1 matching | High | Wrong scale for WTS |
| 11 | **Canada Digital Adoption Program (CDAP)** | — | — | ❌ **Ended March 2024**, no federal replacement | — | Do not pursue |
| 12 | **WorkBC Self-Employment Program** | Income support | Living allowance during launch | ❌ Requires unemployed / <20 hrs/week | — | Conflicts with VIU job |
| 13 | **BC Employer Training Grant** | Grant | Up to $10K/employee | ❌ Need employees | — | Future option once you hire |

---

## The honest summary

The Canadian funding landscape in 2026 is built around **incorporated companies**. The headline programs LLMs and grant blogs talk about — IRAP, Mitacs, AI Compute Access Fund, PacifiCan BSP — all gate at incorporation. As a sole proprietor with no client revenue and a full-time day job, you are filtered out of about 80% of the publicly listed "AI grants for Canadian businesses." That's the hard truth before the recommendations.

**Three paths that actually work for your situation:**

1. **Claim SR&ED for the R&D you're already doing.** You wrote a custom MCP server, you're integrating Claude API into production apps, you're solving non-trivial Blazor + Oracle integration problems. Some of that qualifies as Scientific Research & Experimental Development. As a sole proprietor you get a 15% non-refundable credit against personal income tax — not as good as the 35% refundable rate corporations get, but it directly offsets your VIU T4 income tax bill. On ~$10K of eligible expenses that's ~$1,500 back at tax time. Document now, claim with your 2026 personal return.

2. **Walk into Community Futures Central Okanagan in Kelowna.** They lend up to $150K to local businesses that can't get traditional bank financing — exactly your demographic. Rates are prime + 4–6%. For your $5K hardware ask, this is the lowest-friction route. Loan, not grant, but the qualifying bar is dramatically lower than a bank.

3. **Incorporate WTS as a CCPC, then revisit the federal stack.** This is the single highest-leverage move you can make. Incorporation unlocks: IRAP advisory + funding, Mitacs research partnerships (you could partner with VIU as the academic side), AI Compute Access Fund when it reopens, the 35% refundable SR&ED rate, and most provincial digital programs. Cost is ~$200–$400 federally + a few hundred for accounting. You don't need it to start, but you need it before any of the big federal grants will look at you.

**What about the $11K specifically?** No single Canadian government grant program will hand $11K to an unincorporated, pre-revenue AI consulting sole proprietorship in BC. The pieces have to come from a combination: SR&ED reduces taxes paid (~$1.5K), Community Futures finances hardware ($5K loan), and the rest gets covered by your first paying client (which based on your portfolio shouldn't be hard to land). Once revenue exists, Launch Online BC becomes accessible ($7.5K grant for digital storefront work — and you have web dev as a billable service).

---

## Detailed program profiles

### 1. SR&ED Tax Credit (Scientific Research & Experimental Development) — RECOMMENDED

- **Administrator:** Canada Revenue Agency (federal)
- **Type:** Non-refundable tax credit (sole proprietors); refundable for CCPCs
- **Amount for sole prop:** 15% of qualified expenses (BC has a provincial top-up of 10% for corporations)
- **Eligible activities:** Novel algorithms, AI/ML model development, integrating systems where technical barriers exist, custom tooling that solves non-obvious technical problems
- **Why this fits you:** Your custom Oracle MCP server (thick-mode LDAP init, multi-DB pooling, read/write separation guardrails) is exactly the kind of work SR&ED contemplates. Your Claude API integration in `williamtucker.ca` qualifies if you can document the technical uncertainty you resolved. Your pro bono AI work is also potentially eligible if you tracked hours and expenses.
- **What you need:** Time logs, technical writeups of "what was uncertain", expense records (software licenses, hardware, contracted services). Hire a CPA who specifically does SR&ED — they take 15–20% of the recovered amount but the documentation requirements are unforgiving and they pay for themselves.
- **2026 changes worth knowing:** Expenditure limit doubled to $6M; capital expenditures (i.e., your $5K hardware) are SR&ED-eligible again.
- **Deadline:** 18 months after fiscal year-end. Your 2026 personal tax filing deadline + 18 months gives you until mid-2028 to claim 2026 work — but document as you go.
- **Source:** [CRA SR&ED program](https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program.html)

### 2. Community Futures Central Okanagan — RECOMMENDED for hardware

- **Administrator:** Federally-funded, locally delivered. Office in Kelowna.
- **Type:** Loan (term up to 5 years)
- **Amount:** Up to $150K
- **Rate:** Prime + 4–6%
- **Eligibility:** Resident of Central Okanagan (Oyama to Peachland — you qualify), business operating in the region, **must not be able to access traditional bank financing.** That last clause is actually advantageous to you — pre-revenue sole props rarely qualify for bank lines of credit, so you fit their target demographic.
- **What you need:** Business plan, cash-flow projection, personal credit check
- **Why this fits:** They explicitly serve people the banks won't lend to. Walking into their Kelowna office with your `williamtucker.ca` site, the WTS Admin SaaS demo, and the Oracle MCP server on GitHub is a strong narrative. They want to fund local businesses that show competence.
- **Caveat:** It's a loan — you pay it back with interest. Not "free money."
- **Source:** [Community Futures Central Okanagan](https://cfdcco.com/services/business-lending)

### 3. Launch Online BC — APPLY ONCE YOU HAVE REVENUE

- **Administrator:** Province of BC (Small Business BC)
- **Type:** Grant
- **Amount:** Up to $7,500 (covers up to 75% of eligible costs)
- **Eligibility:** BC-resident-owned, BC-registered, **$30K+ in sales in the past year**. You don't qualify yet.
- **Use:** E-commerce build, online booking, digital marketing (must use BC-based service providers — you ARE one)
- **Strategic angle:** You could be the BC-based service provider for *other* small businesses applying for this grant. Their Launch Online dollars become your billable work. That's an indirect way to benefit before you qualify directly.
- **When to revisit:** Once WTS hits $30K in trailing-12-months revenue.
- **Source:** [launchonline.ca](https://launchonline.ca/)

### 4. BDC Small Business Loan — BACKUP FINANCING

- **Administrator:** Business Development Bank of Canada (federal Crown corp)
- **Amount:** Up to $100K with no collateral; up to $350K with
- **Eligibility:** Sole proprietors qualify; need to be operating + revenue-generating
- **Caveat:** Need ~12 months of revenue history for startup financing, or ~24 months for the regular small business loan. Not immediate.
- **Why mention:** Once you have a few clients, BDC is more flexible than the big banks for sole props. Worth knowing about.
- **Source:** [BDC small business loan](https://www.bdc.ca/en/financing/small-business-loan)

### 5. Futurpreneur Canada — CHECK YOUR AGE

- **Administrator:** National non-profit, federally funded
- **Type:** Loan + 2 years mentorship
- **Amount:** Up to $25K from Futurpreneur (CIBC prime + 3%, capped at 9%) + up to $50K from BDC
- **Eligibility:** **Aged 18–39 at application time.** If you're 40+, you're out.
- **Worth checking:** The cutoff is your 40th birthday at application submission. If you're under 40 right now, fast-track this — it's the most generous program a sole prop can access.
- **Source:** [futurpreneur.ca](https://futurpreneur.ca/en/eligibility/)

### 6. NRC IRAP (Industrial Research Assistance Program) — REQUIRES INCORPORATION

- **Administrator:** National Research Council Canada
- **Type:** Non-repayable contribution
- **Amount:** First-time recipients typically $75K–$200K; average ~$94K–$168K
- **Eligibility:** **Incorporated, for-profit, <500 FTE, profit-oriented, project with technical uncertainty, can co-fund.** Sole proprietors cannot apply for funding contributions.
- **Advisory services exception:** ~6,000 of NRC's 9,187 annual clients receive advisory services without funding. As a sole prop, you may still be able to get a free chat with an Industrial Technology Advisor (ITA) about what to incorporate around.
- **Action:** Call NRC IRAP directly at 1-877-994-4727. Ask about advisory access for unincorporated AI consultants. Worst case: free advice; best case: ITA who wants to fund you tells you exactly how to structure incorporation.
- **Source:** [NRC IRAP](https://nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation)

### 7. Mitacs Accelerate — REQUIRES INCORPORATION + ACADEMIC PARTNER

- **Administrator:** Mitacs (federally funded)
- **Type:** Research internship co-funding (you + a university partner)
- **Eligibility for Accelerate Entrepreneur:** Incorporated startup in an approved incubator. Sole props excluded.
- **Eligibility for standard Accelerate:** Incorporated for-profit. Routine consulting doesn't qualify; needs genuine R&D.
- **Why it matters for you specifically:** You have a VIU connection. Once incorporated, partnering WTS with a VIU faculty member to do AI research (Claude API tooling, MCP server work, RAG over institutional data) is exactly the structure Mitacs funds. Mitacs co-funds the student/postdoc, you provide direction.
- **Source:** [Mitacs Accelerate](https://www.mitacs.ca/our-programs/accelerate/)

### 8. AI Compute Access Fund — CLOSED, WATCH FOR NEXT INTAKE

- **Administrator:** ISED (Innovation, Science & Economic Development Canada)
- **Type:** Cost-share for AI compute (cloud GPU/TPU)
- **Amount:** $100K minimum – $5M maximum; covers 2/3 of Canadian cloud costs, 1/2 of non-Canadian
- **Status:** **Last call closed 2025-07-31. Not currently accepting applications.** Watch for re-opening.
- **Eligibility (when open):** Canadian-registered for-profit, incorporated, <500 FTE, R&D in Canada, revenue-generating OR Series A interest demonstrable
- **Relevance to you:** Your hardware ask is local hardware, not cloud compute. This program targets cloud spend, not GPUs on your desk. Different problem. Bookmark for if you ever pivot to fine-tuning workloads.
- **Source:** [AI Compute Access Fund](https://ised-isde.canada.ca/site/ised/en/canadian-sovereign-ai-compute-strategy/ai-compute-access-fund)

### 9. Innovate BC Ignite — WRONG SCALE

- **Type:** Grant up to $300K, requires 2:1 matching ($600K from other sources for max)
- **Eligibility:** Academic + industry partnership, TRL 3+ innovation
- **Verdict:** Designed for university spinouts and serious tech ventures. WTS isn't there.

### 10. Canada Digital Adoption Program (CDAP) — DEAD

- Ended March 2024. Disbursed $1.2B before closing. **No federal replacement announced as of May 2026.** Anyone advertising "CDAP grants in 2026" is selling stale information.

### 11. WorkBC Self-Employment Program — CONFLICTS WITH VIU JOB

- Designed to support people transitioning from unemployment into self-employment. Requires you be unemployed or working <20 hrs/week. You have a full-time VIU role. Doesn't fit your situation.

### 12. BC Employer Training Grant — NEED EMPLOYEES FIRST

- Up to $10K/employee, 80% cost coverage. Useful **after** you hire your first contractor or employee. Worth remembering for Year 2+.

---

## Recommended action plan (priority order)

### This month (May 2026)
1. **Set up SR&ED documentation now.** Spreadsheet: date, project, hours, technical-uncertainty description. Treat it like a research log. Cost: $0. Time: 15 min/day.
2. **Call NRC IRAP** (1-877-994-4727) and ask for an Industrial Technology Advisor consult. Advisory services are open to non-incorporated entities.
3. **Visit Community Futures Central Okanagan** (cfdcco.com) — book a free intake meeting. Bring your `williamtucker.ca` site, WTS Admin demo, GitHub. Get clarity on loan amount you'd qualify for.

### Within 60 days
4. **Decide on incorporation.** If you plan to pursue any meaningful federal funding (IRAP, Mitacs, AI Compute Access Fund when reopened), incorporate WTS as a federal CCPC. Cost ~$200–$400 federal incorporation + ~$500–$1,500 for an accountant to set up properly. Quote-shop in Kelowna.
5. **Hire a CPA who does SR&ED.** Don't DIY this. Boast.ai, MNP, or local Kelowna firms. Vet them — ask for AI/software-specific SR&ED experience.

### When revenue arrives
6. **Once you hit $30K trailing revenue:** apply for **Launch Online BC** ($7,500). Use it for client-facing booking/quote system on `williamtucker.ca` or for a client engagement.
7. **Once incorporated + revenue:** apply for **NRC IRAP**. Realistic ask for first-time applicants is $75K–$100K for a defined R&D project (not consulting).
8. **Once incorporated + VIU faculty partner identified:** **Mitacs Accelerate** with VIU as academic partner. Funds a graduate student to work on a defined research problem inside your business.

### Always
9. **Don't pay for "grant finder" services or pre-paid grant-writing subscriptions.** Most of the value is on free .gc.ca, hellodarwin.com, and grantcompass.ca. The genuinely useful intermediary is your CPA.
10. **The Zensurance Small Business Grant ($10K)** — private not government, but worth applying. Annual contest, ~10 minute application. Search "Zensurance small business grant".

---

## Things that look like grants but aren't (avoid)

- **"170+ BC small business grants" listings.** Most are loans, tax credits, or training subsidies — not grants. Useful as a directory but don't take the headline at face value.
- **Anything that asks for an upfront fee to "find you grants."** Government grant programs are free to apply for. Pay accountants and grant writers on contingency or hourly, never upfront.
- **CDAP-branded services from consultancies.** The federal program is dead. Some consultancies still market under that name selling their own digital strategy work.

---

## Sources

- [BC Government — Resources for businesses and entrepreneurs](https://www2.gov.bc.ca/gov/content/employment-business/business/small-business)
- [Community Futures Central Okanagan](https://cfdcco.com/services/business-lending)
- [Launch Online BC](https://launchonline.ca/)
- [Futurpreneur Canada eligibility](https://futurpreneur.ca/en/eligibility/)
- [NRC IRAP — Financial support for technology innovation](https://nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation)
- [Mitacs Accelerate](https://www.mitacs.ca/our-programs/accelerate/)
- [BDC Small Business Loan](https://www.bdc.ca/en/financing/small-business-loan)
- [PacifiCan — funding for businesses](https://www.canada.ca/en/pacific-economic-development/services/funding.html)
- [Innovate BC — Ignite](https://www.innovatebc.ca/programs/ignite)
- [AI Compute Access Fund](https://ised-isde.canada.ca/site/ised/en/canadian-sovereign-ai-compute-strategy/ai-compute-access-fund)
- [WorkBC — Find loans and grants](https://www.workbc.ca/find-loans-and-grants)
- [CDAP status update (GrantCompass)](https://grantcompass.ca/cdap-digital-adoption-program-canada.html)
- [SR&ED Tax Credit guide 2026 (Boast)](https://boast.ai/en-us/resources/guides/the-complete-guide-to-sred-tax-credits-2026)
- [Innovate BC — programs directory](https://www.innovatebc.ca/programs/)
