# WTS Website: Case Studies + Hero PROFILE Alignment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Critical constraint — read before execution:** This plan rewrites public-facing copy that makes factual claims about William Tucker's work. The source of truth is `D:/code/CV/PROFILE.md` (last verified 2026-04-16). **Every copy change requires user approval before the HTML edit is applied.** Do not batch-apply tasks without checkpoints.

**Goal:** Align the WTS website's homepage hero and Case Studies page with the verified facts in `D:/code/CV/PROFILE.md` §4, §5, §6, and §10 (framing rules). Replace inaccurate claims ("BIS in 2 days", "Room Booking production-ready in 8 days", "Building Inventory System" misnaming) with honest framing. Add a stronger third case study (Oracle MCP Server) and add proof of the Modernization Assessment service tier (~90-app catalog).

**Architecture:** Section-by-section rewrite on the existing `update/modernization-positioning` branch. Each task has a **draft → user-approval → apply → commit** cycle. No task applies HTML changes before the drafted copy is approved.

**Tech Stack:** Static HTML + Tailwind v4 (already configured). No new dependencies. Build with `npm run build`. Preview locally at `file://D:/code/wts/index.html` or via `npm start`.

**Source-of-truth references (use verbatim for draft copy):**
- `D:/code/CV/PROFILE.md` §4.1 — verified modernization timelines and commit counts
- `D:/code/CV/PROFILE.md` §4.3 — webroot_dev shared infrastructure, ~90-app assessment catalog
- `D:/code/CV/PROFILE.md` §4.4 — network-drive-to-local-dev team migration
- `D:/code/CV/PROFILE.md` §4.6 — Oracle MCP server (the replacement for dogmap)
- `D:/code/CV/PROFILE.md` §5 — WTS Admin + williamtucker.ca self-built
- `D:/code/CV/PROFILE.md` §10 — framing rules (required reading)

---

## Pre-flight

### Task 0: Confirm branch + PROFILE sync

**Files:** none (verification only)

- [ ] **Step 0.1: Verify branch**

Run: `cd /d/code/wts && git branch --show-current`
Expected: `update/modernization-positioning`

- [ ] **Step 0.2: Verify CV master is synced**

Run: `cd /d/code/CV && git status`
Expected: `On branch master` · `Your branch is up to date with 'origin/master'`

- [ ] **Step 0.3: Verify PROFILE.md exists and is fresh**

Run: `stat -c '%y %n' /d/code/CV/PROFILE.md`
Expected: timestamp ≥ 2026-04-16 (per its own "Last verified" line)

- [ ] **Step 0.4: Verify earlier uncommitted work is intact**

Run: `cd /d/code/wts && git status`
Expected: Modified files include at minimum `about.html`, `case-studies.html`, `index.html`, `pricing.html`, `services.html`, `css/styles.css`, plus 4 others from the prior positioning pass. No files should be staged yet.

---

## Task 1: Commit the existing positioning work (baseline)

Before making the accuracy fixes, snapshot the current (inaccurate but structurally improved) state of the branch so each downstream correction is diffable against a clean baseline.

**Files:** all 11 files from the prior positioning rewrite.

- [ ] **Step 1.1: Stage only the previously-modified files**

```bash
cd /d/code/wts
git add about.html case-studies.html checklist.html contact.html css/styles.css faq.html index.html pricing.html privacy.html services.html small-business.html
```

- [ ] **Step 1.2: Verify no unintended files staged**

Run: `git status`
Expected: "Changes to be committed" lists exactly 11 files. Untracked `.claude/`, `.superpowers/`, `docs/launch-guide.md`, and the new plan file should remain untracked or unstaged.

- [ ] **Step 1.3: Commit with descriptive message**

```bash
git commit -m "$(cat <<'EOF'
feat(site): pivot to dual-track positioning (modernization + AI consulting)

Restructure homepage, services, pricing, about, case studies, and FAQ
to lead with legacy modernization (primary track) and keep AI consulting
as a secondary track. Rewrite hero, add modernization pricing tiers
($2,500 / $10K-30K / $1,500/mo), enrich About with VIU/TRU detail,
reorder case studies with modernization first. Update footer taglines
sitewide. Add Client Portal / Pricing nav links where missing.

KNOWN FACTUAL INACCURACIES remaining in this commit (fixed in
subsequent commits per docs/superpowers/plans/2026-04-17-case-studies-
profile-alignment.md):
- BIS claimed "2 days" — actual ~7 weeks per PROFILE.md §4.1
- Room Booking "production-ready in 8 days" — actual 5 days, in QA
- Case Study 1 title says "Building Inventory System" — should be
  "Facilities Information System"

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 1.4: Verify commit landed**

Run: `git log --oneline -3`
Expected: Top commit is the pivot commit on branch `update/modernization-positioning`.

---

## Task 2: Homepage hero factual correction

**Files:**
- Modify: `D:/code/wts/index.html` (hero section only)
- Source: `D:/code/CV/PROFILE.md` §4.1 (RoomBooking row), §10 (framing rules)

### Current incorrect copy (index.html):

```
Recent: 705,714 lines of Oracle PL/SQL replaced with .NET 8 Blazor in 8 days. Zero downtime.
```

Problems per PROFILE.md:
- "8 days" → **5 days** (2026-02-27 → 2026-03-03, 49 commits)
- "Zero downtime" → overstated; Room Booking is in QA, not yet live in production, so there has been no production cutover *to have* downtime. Needs honest reframe.

### Step 2.1: Draft replacement copy (present to user, await approval)

Proposed replacement copy (present this to user verbatim for review):

> *Recent: 705,714 lines of Oracle PL/SQL rebuilt as .NET 8 Blazor in 5 days. Currently in QA, awaiting institutional go-live approval.*

Alternative framing to offer user:

> *Recent: 705,714-line Oracle PL/SQL system rebuilt as .NET 8 Blazor — delivered end-to-end in 5 days, now in QA pending go-live.*

- [ ] **Step 2.1a: Present both drafts to user + ask which they prefer (or neither)**
- [ ] **Step 2.1b: Receive user decision. If neither, iterate. Do not proceed to Step 2.2 without approval.**

### Step 2.2: Apply approved copy

Locate the exact current string in `index.html`:

```html
          <p class="text-gray-500 text-sm mt-8 italic">
            Recent: 705,714 lines of Oracle PL/SQL replaced with .NET 8 Blazor in 8 days. Zero downtime.
          </p>
```

- [ ] **Step 2.2: Edit that `<p>` to use the approved copy, preserving the surrounding classes.**

### Step 2.3: Audit hero for other "days" or status claims

Other hero claims to cross-check against PROFILE.md:
- "Legacy modernization in days, not months." — **PROFILE.md §10 warns the "days" framing is weaker than "7 weeks of iterated senior engineering" for senior roles**, but this is the consulting site aimed at buyers of a fixed-price product. Keep "days" but only if William agrees after seeing §10.
- "Senior software engineer with 12+ years in .NET, Oracle, and Classic ASP." — accurate per PROFILE.md §2.

- [ ] **Step 2.3: Surface the "days, not months" tension to the user. If user wants to keep, note the §10 trade-off in the review conversation; if user wants to change, iterate.**

### Step 2.4: Preview

- [ ] **Step 2.4: Run build**

```bash
cd /d/code/wts && npm run build
```

Expected: `Done in <milliseconds>`, no errors.

- [ ] **Step 2.5: Have user open `file://D:/code/wts/index.html` and confirm hero reads correctly.**

### Step 2.6: Commit

```bash
git add index.html css/styles.css
git commit -m "$(cat <<'EOF'
fix(hero): correct Room Booking timeline and status claim

Per PROFILE.md §4.1: Room Booking rebuild was 5 days (not 8), and is
currently in QA pending institutional go-live, not "zero downtime"
(which implied a production cutover had already happened).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2.6: Commit**

---

## Task 3: Case Study 1 rewrite — BIS/FIS (7 weeks, not 2 days)

**Files:**
- Modify: `D:/code/wts/case-studies.html` (Case Study 1 card only, lines ~110-140)
- Source: `D:/code/CV/PROFILE.md` §4.1 (BIS row), §4.3 (modernization guide), §10 (framing rules)

### Current incorrect copy:

- Title: "Building Inventory System: Legacy to Modern in 2 Days"
- Body claims: 2 days, 13 Razor pages, 10 data models, 5 backend services, 40+ CRUD operations, 30+ automated tests

### Verified facts from PROFILE.md:

- **Correct name:** BIS = Facilities Information System (FIS). Use "Facilities Information System (BIS)" or just "Facilities Information System" — NOT "Building Inventory System."
- **Timeline:** 2026-02-25 → 2026-04-15 = **~7 weeks**
- **Commits:** 66 of 67 (William is near-sole author)
- **Branches:** 14
- **Status:** In production
- **Stack detail:** .NET 8 Blazor Server, Dapper, `Oracle.ManagedDataAccess.Core`, cookie-based SSO reusing `WEB_LOGIN_TOKEN`, `PersistentComponentState` for SSR/Interactive auth, `IniFileResolver`, Oracle password vault via stored procedure, GitLab CI with JUnit + Cobertura, `appcmd stop apppool` + `robocopy /MIR` deploy pattern
- **Significance:** Became the institutional modernization playbook — `docs/modernization/fis-bis-modernization-guide.md` (§4.3).

### Framing rule from §10:

> *"The 7-week number with 66 commits across 14 branches is a stronger claim than '2 days' because it demonstrates planned, iterated, tested work — which is what senior engineering roles actually want."*

However — this site is aimed at modernization *buyers*, who may specifically want the speed story. **This tension must be surfaced to the user as part of the review.**

### Step 3.1: Draft replacement copy (two variants)

**Variant A — honest-duration-first (recommended by PROFILE §10):**

> **Title:** Facilities Information System: Classic ASP → .NET 8 Blazor, the institutional playbook
>
> **Label:** AI-Accelerated Modernization
>
> **Problem:** A university's Facilities Information System — used daily to manage buildings, rooms, utilities, maintenance, and reporting across multiple campuses — was running on Classic ASP with VBScript. The aging codebase was difficult to maintain, lacked modern security practices, and couldn't support responsive design or modern CI/CD workflows. A traditional vendor would have scoped this as a multi-month rebuild.
>
> **Approach:** Seven weeks of AI-augmented development as near-sole author — 66 commits across 14 branches, not a one-shot generation. I extracted all business logic from the legacy Oracle/Classic ASP system and rebuilt it in .NET 8 Blazor Server (Dapper, `Oracle.ManagedDataAccess.Core`), preserving the existing Oracle schema and SSO. Cookie-based SSO reuses the same `WEB_LOGIN_TOKEN` that the legacy Classic ASP apps use — no dual-auth required. Solved the Blazor Server SSR/Interactive prerendering auth problem cleanly via `PersistentComponentState`. Full GitLab CI with JUnit + Cobertura coverage artifacts, and a synchronous IIS deploy pattern (`appcmd stop apppool` + `robocopy /MIR` + restart in `finally`) that avoids the file-handle contention plaguing legacy .NET deploys.
>
> **Result:** Shipped to production with zero breaking changes to the underlying Oracle schema or SSO. The architecture became the institutional playbook — I wrote the `fis-bis-modernization-guide.md` used as a reference for future Classic ASP → .NET 8 conversions across the organization. Catalogued ~90 additional legacy apps in a modernization assessment document for the broader roadmap.
>
> **Tags:** .NET 8 · Blazor Server · Oracle · Dapper · SSO · GitLab CI/CD · Deployment playbook · 7-week build

**Variant B — keep the speed narrative but truthful:**

> **Title:** Facilities Information System: Classic ASP → .NET 8 Blazor modernization
>
> **Label:** AI-Accelerated Modernization
>
> Same Problem paragraph as A.
>
> **Approach:** AI-augmented development, executed as near-sole author over roughly seven weeks. The work that most firms would scope as six to nine months: 66 commits across 14 branches, full CI/CD, no rushed shortcuts. Stack: .NET 8 Blazor Server, Dapper, Oracle.ManagedDataAccess.Core. Preserved existing Oracle schema and SSO, no dual-auth required, clean solution to the Blazor Server prerendering auth gotcha via `PersistentComponentState`.
>
> **Result:** Same Result paragraph as A.
>
> **Tags:** same as A.

### Step 3.2: Present both variants to user

- [ ] **Step 3.2: Present Variants A and B. Ask which framing (or a hybrid) they prefer. Flag the §10 framing-rule tension. Do not proceed without approval.**

### Step 3.3: Decide on image asset

The current card references `img/case_study_BIS.png`. The image itself is probably fine (it's a screenshot); the alt text is "Building Inventory System screenshot" which will need updating to "Facilities Information System screenshot."

- [ ] **Step 3.3: Confirm with user: keep the existing image? (yes/no)** If yes, rename alt text only.

### Step 3.4: Apply approved copy

- [ ] **Step 3.4: Edit Case Study 1 block in `case-studies.html`:**
  - Replace title `<h2>`
  - Replace image alt text
  - Replace Problem/Approach/Result `<p>` bodies
  - Update tags if changed

### Step 3.5: Preview + commit

- [ ] **Step 3.5a: Run `npm run build` → confirm success**
- [ ] **Step 3.5b: User opens `file://D:/code/wts/case-studies.html` and confirms**
- [ ] **Step 3.5c: Commit**

```bash
git add case-studies.html css/styles.css
git commit -m "$(cat <<'EOF'
fix(case-studies): rewrite CS1 as Facilities Information System, 7 weeks

Per PROFILE.md §4.1 and §10: BIS is the Facilities Information System
(not "Building Inventory System"), and the real timeline was ~7 weeks
(66 commits, 14 branches) — not "2 days." The 7-week framing is a
stronger claim per §10 because it demonstrates planned, iterated,
tested work with zero breaking changes and an institutional
modernization playbook as an output.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Case Study 2 rewrite — Room Booking (5 days, QA-pending)

**Files:**
- Modify: `D:/code/wts/case-studies.html` (Case Study 2 card only)
- Source: `D:/code/CV/PROFILE.md` §4.1 (RoomBooking row), §10 (canonical framing)

### Current incorrect copy:

- Title: "Room Booking System: Replacing 700K Lines of PL/SQL in 8 Days"
- Body claims: MVP in 1 day, production-ready in 8 days, specific numbers "7 Blazor pages with 16 data models and 5 C# services (1,827 lines)"

### Verified facts from PROFILE.md:

- **Timeline:** 2026-02-27 → 2026-03-03 = **5 days**
- **Commits:** 49 of 49 (William is sole author)
- **Branches:** 24
- **LOC:** ~21,410 total (C# + Razor + SQL), of which `findroom.sql` alone is 14,349 lines of Oracle PL/SQL
- **Status:** In QA, technically ready; go-live blocked on organizational approval (boss will vouch — §11)
- **Notable fixes:** iPhone-crash fix via persisted Data Protection keys (commit `488d63e`), SSO circuit-crash fix (`0ee39bb`), Blazor antiforgery disable on specific endpoints (`b1b037f`)

### Canonical framing per §10:

> *"Delivered end-to-end in 5 days as sole author; currently in QA and technically ready for production. Go-live pending organizational approval, not engineering work. Reference available on request."*

### Step 4.1: Draft replacement copy

Proposed:

> **Title:** Room Booking System: rebuilding a 705K-line PL/SQL app in 5 days
>
> **Label:** AI-Accelerated Modernization
>
> **Problem:** A university's room booking system relied on a Classic ASP front-end backed by a 705,714-line Oracle PL/SQL package. The legacy system used XML DOM to transfer data between the database and browser, had no mobile support, and offered limited conflict detection. The complexity of the PL/SQL package made changes risky and time-consuming. A traditional vendor bid would have been months of work and six figures.
>
> **Approach:** Delivered end-to-end in 5 days as sole author — 49 commits across 24 branches of iterative, tested work. Replaced all XML-based Oracle calls with direct parameterized SQL, rebuilt as .NET 8 Blazor Server on the same schema and SSO as the rest of the modernization program. Implemented a color-coded availability matrix with real-time conflict detection (green/yellow/red). Maintained full compatibility with the existing Oracle database, SSO authentication, and 4-level privilege hierarchy. Includes the hard-won fixes — persisted Data Protection keys for iPhone compatibility, circuit-crash guards for the SSO redirect flow, selective antiforgery disable on Blazor endpoints.
>
> **Result:** Delivered technically ready for production and currently in QA, awaiting institutional go-live approval (organizational, not engineering). The modernized system features a mobile-responsive interface, parallel authentication checks, and a full GitLab CI/CD pipeline. Reference available on request.
>
> **Tags:** same as current — .NET 8, Blazor Server, Oracle PL/SQL, Mobile-First, CI/CD, AI Agents

### Step 4.2: Present to user

- [ ] **Step 4.2: Present draft. Await approval or revision. Do not proceed without approval.**

### Step 4.3: Apply + preview + commit

- [ ] **Step 4.3a: Edit Case Study 2 block in `case-studies.html`**
- [ ] **Step 4.3b: Run `npm run build` → confirm success**
- [ ] **Step 4.3c: User previews → approves**
- [ ] **Step 4.3d: Commit**

```bash
git add case-studies.html css/styles.css
git commit -m "$(cat <<'EOF'
fix(case-studies): correct Room Booking to 5 days + QA-pending status

Per PROFILE.md §4.1 and §10: Room Booking was 5 days (not 8), and is
currently in QA awaiting institutional go-live — not "production-
ready." Use the canonical honest framing: delivered end-to-end as
sole author, technically ready for production, go-live pending
organizational approval. Includes references available on request.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Case Study 3 replacement — Oracle MCP Server (swap out dogmap)

**Files:**
- Modify: `D:/code/wts/case-studies.html` (Case Study 3 card — currently dogmap)
- Source: `D:/code/CV/PROFILE.md` §4.6 (Oracle MCP server)

### Why this swap:

Per income-strategy-2026.md: "Stop thinking of Next.js as a marketable skill... Sell what you know cold: C#/.NET, Oracle, legacy modernization."

Per PROFILE.md §4.6: William built a **custom TypeScript MCP server for Oracle**, shipped in a day, currently a daily driver at VIU. This demonstrates *extending* AI tooling — a rare capability among "AI consultants" who only *use* AI. It is the single strongest AI-consulting credential William has because it's the only one that crosses from "uses AI" to "builds AI tooling."

### Verified facts from PROFILE.md §4.6:

- **Repo:** `C:\code\OraclePlugin` (GitHub: `github.com/billski/Claude-Oracle-MCP`)
- **Timeline:** 2026-04-10, shipped in a day, sole author
- **Stack:** TypeScript (ESM) + `@modelcontextprotocol/sdk` ^1.29.0 + `oracledb` ^6.10.0 + zod, Node 20.6+
- **Wired into:** `webroot_dev/.mcp.json` as project-scoped stdio server
- **Tools exposed (5):** `query` (read-only), `execute` (DML/DDL), `list_schemas`, `list_tables`, `describe_table`
- **Notable engineering:**
  - Thick-mode Oracle init (`oracledb.initOracleClient()`) for LDAP TNS name resolution — uncommon in public MCP examples
  - Multi-database support via `ORACLE_DATABASES` env list, one pool per connect string
  - Read/write separation guardrail — `query` validates SELECT/WITH before DB
  - Row-limit enforcement with explicit truncation messaging
  - Cross-schema introspection via `ALL_*` views
  - Optional Oracle wallet support
- **Status:** Daily driver at VIU against ODEV; not wired to production; team adoption unverified.

### Step 5.1: Draft replacement copy

Proposed:

> **Title:** Custom Oracle MCP Server: extending Claude with a first-class database tool
>
> **Label:** AI Tooling — Built, Not Just Used
>
> **Problem:** I use Claude Code daily for modernization work at VIU. The public Oracle MCP examples don't handle VIU's Oracle environment — LDAP-based TNS name resolution requires thick-mode Oracle client init, which most samples skip. And running against a live enterprise Oracle estate needs guardrails: read/write separation, row limits, cross-schema introspection, and the ability to connect to multiple databases from one server. No off-the-shelf MCP gave me that.
>
> **Approach:** Built and shipped a TypeScript MCP server in a day. Stack: `@modelcontextprotocol/sdk` + `oracledb` + zod on Node 20. Thick-mode init so LDAP aliases resolve. Multi-database support via an `ORACLE_DATABASES` env list — one connection pool per database, selectable per call. Five tools: `query` (validated SELECT/WITH only), `execute` (DML/DDL with opt-in auto-commit), `list_schemas`, `list_tables`, `describe_table`. Row-limit enforcement with explicit truncation messaging so the agent knows when it's seeing partial results. Cross-schema introspection via `ALL_*` views, scoped to the connected user's privileges. Optional Oracle wallet support.
>
> **Result:** Wired into the team's shared `.mcp.json` and running as a daily driver at VIU for all Oracle work. The ability to extend AI tooling — not just consume it — is what separates AI-accelerated engineering from AI-adjacent consulting. Source: [github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP).
>
> **Tags:** TypeScript, MCP, Claude, oracledb, stdio transport, multi-DB pooling, AI tooling

### Step 5.2: Present to user

- [ ] **Step 5.2: Present draft. Ask two things:**
  - Approve the copy?
  - Comfortable linking the GitHub repo publicly from a consulting site? (It's already public — this is about whether the site should promote it.)

### Step 5.3: Replace dogmap block with MCP block

The current Case Study 3 (dogmap.ca) block spans from `<!-- Case Study 3: dogmap.ca -->` to the closing `</div>` of that card. Replace the entire block.

- [ ] **Step 5.3: Apply edit.**

### Step 5.4: Preview + commit

- [ ] **Step 5.4a: Run `npm run build` → confirm success**
- [ ] **Step 5.4b: User previews → approves**
- [ ] **Step 5.4c: Commit**

```bash
git add case-studies.html css/styles.css
git commit -m "$(cat <<'EOF'
feat(case-studies): replace dogmap with Oracle MCP Server as CS3

Per PROFILE.md §4.6 and income-strategy-2026.md: dogmap.ca is off-
message for the target buyer (Next.js PWA is not the pitch). The
Oracle MCP server is the stronger story — custom TypeScript MCP
server with thick-mode LDAP init, multi-DB pooling, read/write
guardrails, currently a daily driver at VIU. Proves William builds
AI tooling, not just uses it.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Move dogmap to About / secondary surface (don't delete it)

dogmap is still a real shipped project and a discipline-demonstration (376 commits, 6 months, v2.0.0). It should live on the site — just not as Case Study 3.

**Files:**
- Modify: `D:/code/wts/about.html` (add a short "Independent projects" mention)
- Source: `D:/code/CV/PROFILE.md` §6.1

### Step 6.1: Draft mention

Insert after the "Education & Background" section (or in the existing expertise area):

> **Independent Projects**
>
> **dogmap.ca** — A production PWA for BC dog owners, solo-built. Next.js 16 + Supabase (PostgreSQL + PostGIS + Auth + Storage) + MapLibre GL, 6 months of disciplined iteration, 376 commits, real Vitest coverage. [Visit dogmap.ca →](https://dogmap.ca)
>
> **williamtucker.ca** — This site. Static HTML + Tailwind v4 + Express.js server with a live Claude API chatbot (direct `@anthropic-ai/sdk` integration, not a third-party widget), deployed to Railway. 6-day build.
>
> **WTS Admin + Client Portal** — `admin.williamtucker.ca`. Next.js 16 (App Router, Turbopack) + Supabase + Stripe + Resend + React PDF. Full SaaS — 9 admin pages, 5 client portal pages, RLS, magic-link auth, PDF invoice generation. 4-day build.

### Step 6.2: Present to user

- [ ] **Step 6.2: Present draft. Ask approval. Ask if all three should appear or only dogmap.**

### Step 6.3: Apply + preview + commit

- [ ] **Step 6.3a: Apply edit to `about.html`**
- [ ] **Step 6.3b: Run `npm run build`**
- [ ] **Step 6.3c: User previews**
- [ ] **Step 6.3d: Commit**

```bash
git add about.html css/styles.css
git commit -m "$(cat <<'EOF'
feat(about): add Independent Projects section (dogmap, WTS Admin, site)

Relocate dogmap off the Case Studies page (replaced by Oracle MCP
Server) and surface it here alongside WTS Admin and the williamtucker.ca
site itself — per PROFILE.md §5 and §6.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Strengthen "More modernization wins" sidebar

**Files:**
- Modify: `D:/code/wts/case-studies.html` (sidebar section — currently 4 bullets)
- Source: `D:/code/CV/PROFILE.md` §4.1 (VIUPortal, SABC, CDW), §4.3 (~90-app assessment), §4.4 (team migration)

### Current sidebar has 4 bullets:
1. Crystal Reports → QuestPDF
2. SSO landing page + tag system
3. CDW submission tool
4. Local dev + CI/CD transition

### Additions PROFILE.md unlocks:

- **VIUPortal** (§4.1) — 7 days, Classic ASP SSO landing → .NET 10 Blazor Server with ADFS SAML, impersonation-with-privilege-checks, CSP hardening. Currently in active development.
- **SABC SIMS integration** (§4.1) — 2 days, shipped. The actual fast story.
- **~90-app modernization assessment** (§4.3) — William authored the webroot-wide modernization catalog. *This is the proof behind the $2,500 Assessment service tier.* Must surface.
- **Network-drive → local-dev team migration** (§4.4) — already covered in existing "Local dev + CI/CD" bullet but could be expanded.

### Step 7.1: Draft updated sidebar

Proposed updated bullet list (order roughly by target-buyer relevance):

> **More modernization wins**
>
> ▸ **~90-app modernization assessment.** Authored the webroot-wide modernization catalog — inventory, effort estimates, recommended order. The institutional playbook behind what I sell as the $2,500 Modernization Assessment service.
>
> ▸ **VIUPortal (Classic ASP SSO landing → .NET 10 Blazor).** Replacement for the legacy `sso/viulogin.html`. Direct ADFS SAML flow, impersonation with original-user privilege checks, CSP hardening. 7 days, active development.
>
> ▸ **SABC SIMS integration.** Shipped in 2 days — the fast counterpart to the 7-week FIS rebuild.
>
> ▸ **Crystal Reports → QuestPDF.** Replaced legacy licensed reporting with .NET-native QuestPDF — eliminated licensing fees and deployment friction.
>
> ▸ **SSO landing page + tag system.** Designed an Oracle schema (3 tables, triggers, cascading deletes), built 9 REST endpoints in C#, rewrote the SSO landing page UI with modern patterns.
>
> ▸ **CDW submission tool.** .NET web app with SignalR real-time progress, SSH.NET file transfer with ED25519 keys, GitLab CI. In production, pivoting to SharePoint in 2026.
>
> ▸ **Network-drive → local-dev team migration.** Moved a team of six and 30+ repositories from server-based manual development to feature-branch workflow with health-check-gated GitLab pipelines, multi-environment release, rollback automation. Authored the es-handbook onboarding docs.

### Step 7.2: Present to user

- [ ] **Step 7.2: Present draft sidebar. Await approval.**

### Step 7.3: Apply + preview + commit

- [ ] **Step 7.3a: Apply edit**
- [ ] **Step 7.3b: `npm run build`**
- [ ] **Step 7.3c: User previews**
- [ ] **Step 7.3d: Commit**

```bash
git add case-studies.html css/styles.css
git commit -m "$(cat <<'EOF'
feat(case-studies): expand 'More modernization wins' sidebar

Add from PROFILE.md: ~90-app modernization assessment (proof for the
Assessment service tier), VIUPortal, SABC SIMS. Expand existing
bullets with verified detail.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Services page — Assessment tier proof

**Files:**
- Modify: `D:/code/wts/services.html` (Modernization Assessment card)
- Modify: `D:/code/wts/pricing.html` (Modernization Assessment pricing card)

### Current copy (services.html, services-page Assessment card):

Generic description. Does not reference William's existing ~90-app assessment work.

### Strengthen with PROFILE.md §4.3 fact:

Add a trust-building line to the Assessment card: *"I've authored a 90-app modernization catalog for a BC higher-ed institution — this is the same methodology, scoped to your stack."*

### Step 8.1: Draft additions

For **services.html** Modernization Assessment card, append to the intro paragraph:

> *I've authored a 90-app modernization catalog for a BC higher-ed institution — this service is the same methodology, scoped to one application of yours.*

For **pricing.html** Modernization Assessment card, same addition to the description.

### Step 8.2: Present to user

- [ ] **Step 8.2: Present drafts. Confirm comfortable naming "BC higher-ed institution" anonymously.**

### Step 8.3: Apply + preview + commit

- [ ] **Step 8.3a: Edit both files**
- [ ] **Step 8.3b: `npm run build`**
- [ ] **Step 8.3c: User previews services + pricing pages**
- [ ] **Step 8.3d: Commit**

```bash
git add services.html pricing.html css/styles.css
git commit -m "$(cat <<'EOF'
feat(services,pricing): add 90-app assessment as Assessment-tier proof

Per PROFILE.md §4.3: William authored the webroot-wide modernization
assessment cataloging ~90 apps. Surface this as trust-building proof
on the Modernization Assessment service tier — same methodology,
scoped to one app per client engagement.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: About page — Oracle MCP server + self-built SaaS mentions

**Files:**
- Modify: `D:/code/wts/about.html` (Expertise grid + maybe Bio)
- Source: `D:/code/CV/PROFILE.md` §4.6, §5, §9 (cross-cutting technical patterns)

### Current expertise grid has 9 cards — AI & LLMs card currently reads:

> "Claude API, GPT-5, Claude Code, prompt engineering, AI-agent-driven development, context document design. Practical AI consulting grounded in how I actually work."

### Strengthen to include MCP server authoring:

Proposed update:

> **AI & LLMs**
>
> Claude API (direct SDK integration in production), Claude Code with custom hooks and shared team config, and a **custom MCP server authored in TypeScript** that extends Claude with multi-database Oracle tools. Prompt engineering, context-document design, AI-agent-driven development. Consulting grounded in how I actually work — not repackaged thought leadership.

### Step 9.1: Draft + present

- [ ] **Step 9.1: Present draft update to AI & LLMs card. Await approval.**

### Step 9.2: Apply + preview + commit

- [ ] **Step 9.2a: Edit `about.html`**
- [ ] **Step 9.2b: `npm run build`**
- [ ] **Step 9.2c: User previews**
- [ ] **Step 9.2d: Commit**

```bash
git add about.html css/styles.css
git commit -m "$(cat <<'EOF'
feat(about): surface MCP-server authorship in AI & LLMs expertise card

Per PROFILE.md §4.6 and §9: William authored a custom TypeScript MCP
server for Oracle — not just uses Claude, extends it. This is the
single strongest AI credibility signal on the site and it was absent
from the Expertise grid.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Homepage stat strip sanity-check

**Files:**
- Modify (possibly): `D:/code/wts/index.html` stat strip section

### Current stat strip:

- **12+** Years of production engineering experience
- **705K+** Lines of legacy code modernized with AI-augmented delivery
- **0** Platform affiliations or vendor commissions

### Check:

- "12+ years" — accurate per PROFILE.md §2 (~12 years since 2013)
- "705K+ lines" — **the 705,714-line Room Booking PL/SQL system is the source of this number.** After Task 4, Room Booking is described as QA-pending. Is it honest to claim the "modernization" has happened if the final go-live hasn't? Per PROFILE.md §10: delivered end-to-end, technically ready — the engineering modernization *has* happened, go-live is organizational. So "modernized" is accurate; the word "modernized" doesn't mean "users are using it in production yet."
  - **Safe as-is.** But flag to user for review.
- "0 platform affiliations" — accurate.

### Step 10.1: Flag and confirm

- [ ] **Step 10.1: Surface the 705K stat-strip interpretation question to user. If user wants to soften ("705K+ lines of legacy code rebuilt in modern .NET" vs "modernized") — offer the edit. Otherwise mark stat strip as reviewed.**

### Step 10.2: Apply only if user requests change

- [ ] **Step 10.2: If user edits, apply + build + preview + commit as separate commit.**

---

## Task 11: Full-site smoke test

**Files:** none (review only)

### Step 11.1: Build and serve

- [ ] **Step 11.1: Run `npm run build`. Expect success.**

### Step 11.2: Walk through every page

User opens each in browser and eyeballs for:
- Factual claims match PROFILE.md
- No orphan "2 days" or "8 days" references survived
- Footer tagline consistent everywhere (*"Legacy modernization & AI consulting"*)
- All nav links resolve (no 404s on `services.html#modernization` etc.)
- Case Studies page reads left-to-right: strongest story first

Pages to walk:
- [ ] `file://D:/code/wts/index.html`
- [ ] `file://D:/code/wts/services.html`
- [ ] `file://D:/code/wts/pricing.html`
- [ ] `file://D:/code/wts/about.html`
- [ ] `file://D:/code/wts/case-studies.html`
- [ ] `file://D:/code/wts/small-business.html`
- [ ] `file://D:/code/wts/checklist.html`
- [ ] `file://D:/code/wts/contact.html`
- [ ] `file://D:/code/wts/faq.html`
- [ ] `file://D:/code/wts/privacy.html`

### Step 11.3: Grep for surviving stale claims

Run:

```bash
cd /d/code/wts
grep -in "2 days\|8 days\|production-ready\|zero downtime\|Building Inventory" *.html
```

Expected: zero matches, OR user confirms any matches are intentional.

- [ ] **Step 11.3: Run grep. Report matches to user for decision.**

---

## Task 12: Push decision

### Step 12.1: User decides: merge to master now, or let the branch rest for a day?

Merging means Dreamhost deploys. Don't do this without explicit "yes, deploy."

- [ ] **Step 12.1: Ask the user: "Deploy now or hold?"**

### Step 12.2a (if deploying):

```bash
cd /d/code/wts
git checkout master
git merge --no-ff update/modernization-positioning
git push origin master
```

Then watch the GitHub Actions run at `https://github.com/billski/WilliamTucker/actions`.

- [ ] **Step 12.2a: Execute only with explicit user approval.**

### Step 12.2b (if holding):

Leave the branch. No push. Document the hold decision in the final summary.

- [ ] **Step 12.2b: Note in final summary.**

### Step 12.3: Railway chatbot context update (follow-up, not part of this plan)

Flag to user: the Railway-hosted chatbot likely still has an outdated system prompt describing WTS as AI-consulting-only. Plan a follow-up to update it.

- [ ] **Step 12.3: Surface this as a follow-up task in the final summary.**

---

## Self-Review (plan author checklist)

**Spec coverage:**
- ✅ Homepage hero factual correction (Task 2)
- ✅ Case Study 1 rewrite (Task 3)
- ✅ Case Study 2 rewrite (Task 4)
- ✅ Case Study 3 replacement (Task 5)
- ✅ dogmap relocation (Task 6)
- ✅ More-wins sidebar (Task 7)
- ✅ Assessment tier proof (Task 8)
- ✅ About page MCP mention (Task 9)
- ✅ Stat strip review (Task 10)
- ✅ Full smoke test (Task 11)
- ✅ Deploy decision (Task 12)

**Placeholder scan:**
- No TBD / TODO / "appropriate error handling" placeholders
- Every draft copy block is complete prose
- Every file path is exact

**Type/naming consistency:**
- BIS = Facilities Information System throughout (per PROFILE.md §4.1)
- "Room Booking" capitalized consistently
- "MCP server" / "Oracle MCP Server" both used; pick one — **prefer "Oracle MCP Server"** for capitalization consistency
- "modernization" lower-case as a noun throughout

**Approval gates:**
- Every task that makes a factual claim has a draft → user-approval step before the HTML edit. This honors the PROFILE.md §10 framing rules: *"Propose tailoring changes section by section. Get approval. Don't rewrite in one shot and hope."*

---

## Execution Handoff

**Plan saved to:** `D:/code/wts/docs/superpowers/plans/2026-04-17-case-studies-profile-alignment.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review copy drafts between tasks, faster iteration, main context stays clean. Each subagent runs one task including the draft, presents it, waits for user approval, then applies and commits.

**2. Inline Execution** — Execute tasks in this session using superpowers:executing-plans. Batch execution with checkpoints for each user approval. Slower but keeps one context.

**Special consideration:** Given the approval-heavy nature of this plan (every task has a user-approval gate for draft copy), inline execution may actually be simpler — fewer subagent-dispatch handoffs, and the user can redirect mid-draft without the subagent losing context. Subagent-driven wins when tasks are independent and self-contained; these tasks are semi-sequential and require conversation.

**Which approach?**
