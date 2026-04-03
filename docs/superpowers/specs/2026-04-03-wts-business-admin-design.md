# William Tucker Solutions — Business Administration Application

**Date:** 2026-04-03
**Status:** Design approved
**Stack:** Next.js 15 (App Router) + Supabase + Tailwind CSS + Vercel

## Overview

A unified business administration application for William Tucker Solutions, a solo AI consulting business offering strategy, implementation, fractional advisory, and training services. The app covers the full lifecycle from lead capture through invoicing and payment, with a client-facing portal.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | Known stack, SSR + API routes, Vercel deployment |
| Database | Supabase (PostgreSQL) | Auth, RLS, Storage, real-time — all built-in |
| Auth | Supabase Auth | Admin: email/password. Clients: magic link (passwordless) |
| Storage | Supabase Storage | Documents, receipts, invoice PDFs |
| Styling | Tailwind CSS | Matches existing website, rapid development |
| Hosting | Vercel | Zero-config deployment, serverless functions, cron jobs |
| Payments | Stripe Checkout | Per-invoice payment links, webhook for auto-confirmation |
| Email | Resend | Transactional emails (invoice sent, payment confirmed, reminders) |
| PDF | React-PDF or html-to-pdf | Server-side invoice PDF generation |

## Brand

| Token | Value |
|-------|-------|
| Navy (primary) | `#1a2332` |
| Navy light | `#243044` |
| Navy dark | `#111827` |
| Gold (accent) | `#d4a843` |
| Gold light | `#e0be6a` |
| Gold dark | `#b8912e` |
| Background | `#f8f9fa`, `#ffffff` |
| Font | Inter (400, 500, 600, 700) |

## Data Model

### Contact (Client Profile & CRM)

The central entity — tracks people from lead to client.

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| name | text | Required |
| email | text | Required, unique |
| phone | text | |
| company | text | |
| job_title | text | |
| website | text | |
| linkedin_url | text | |
| avatar_url | text | Supabase Storage |
| industry | text | |
| company_size | text | e.g., "1-10", "11-50", "51-200" |
| address_street | text | |
| address_city | text | |
| address_province | text | |
| address_postal | text | |
| billing_email | text | If different from primary email |
| preferred_payment_method | text | stripe, e_transfer, cheque, wire |
| source | text | calendly, referral, networking, website, other |
| referred_by | uuid | FK → contact.id (self-referencing) |
| tags | text[] | e.g., ["finance", "AI-ready"] |
| status | text | lead → prospect → client → archived |
| notes | text | General notes |
| user_id | uuid | FK → auth.users (for portal login, null until portal enabled) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Status definitions:**
- **lead** — discovery call booked or initial contact made
- **prospect** — proposal sent
- **client** — signed engagement / accepted proposal
- **archived** — inactive, engagement ended

### Proposal

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| contact_id | uuid | FK → contact |
| title | text | e.g., "AI Assessment — Acme Corp" |
| service_type | text | assessment, implementation, retainer, workshop |
| billing_model | text | fixed, retainer, day_rate |
| amount | numeric | Total value |
| description | text | Scope summary |
| scope_of_work | text | Detailed scope |
| terms_and_conditions | text | Engagement terms |
| valid_until | date | Expiry date |
| status | text | draft → sent → accepted / declined |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Project

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| contact_id | uuid | FK → contact |
| proposal_id | uuid | FK → proposal (nullable — not all projects come from proposals) |
| name | text | |
| description | text | |
| billing_model | text | fixed, retainer, day_rate |
| rate | numeric | Hourly, daily, fixed, or monthly rate |
| budget | numeric | Total project budget |
| start_date | date | |
| end_date | date | |
| deliverables | jsonb | Array of {name, status, due_date} |
| status | text | planned → active → completed → archived |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Time Entry

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| project_id | uuid | FK → project |
| date | date | |
| hours | numeric | |
| description | text | What was done |
| billable | boolean | Default true. Optional for fixed/retainer. |
| invoice_id | uuid | FK → invoice (null until invoiced) |
| created_at | timestamptz | |

### Invoice

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| project_id | uuid | FK → project |
| contact_id | uuid | FK → contact |
| number | text | Format: WTS-YYYY-NNN (e.g., WTS-2026-001) |
| issue_date | date | |
| due_date | date | Based on payment terms from settings |
| line_items | jsonb | Array of {description, quantity, rate, amount} |
| subtotal | numeric | Computed from line items |
| tax_rate | numeric | From settings (default 0) |
| tax_amount | numeric | subtotal × tax_rate |
| total | numeric | subtotal + tax_amount |
| status | text | draft → sent → paid / overdue |
| payment_method | text | stripe, e_transfer, cheque, wire (set on payment) |
| payment_date | date | When payment was received |
| stripe_checkout_session_id | text | For Stripe payments |
| notes | text | |
| pdf_url | text | Supabase Storage path |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Expense

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| project_id | uuid | FK → project (nullable — not all expenses are project-related) |
| category | text | software, travel, office, marketing, other |
| amount | numeric | |
| date | date | |
| vendor | text | |
| description | text | |
| receipt_url | text | Supabase Storage path |
| tax_deductible | boolean | Default true |
| created_at | timestamptz | |

### Activity Log

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| contact_id | uuid | FK → contact |
| project_id | uuid | FK → project (nullable) |
| type | text | call, email, meeting, note, follow_up |
| description | text | |
| date | timestamptz | |
| follow_up_date | date | Nullable — surfaces in dashboard follow-ups |
| created_at | timestamptz | |

### Document

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| project_id | uuid | FK → project (nullable) |
| contact_id | uuid | FK → contact |
| type | text | proposal_pdf, contract, deliverable, receipt |
| name | text | Display name |
| file_url | text | Supabase Storage path |
| visible_to_client | boolean | Controls client portal visibility |
| created_at | timestamptz | |

### Settings (single-row config table)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK (single row) |
| business_name | text | "William Tucker Solutions" |
| business_address | text | |
| business_email | text | |
| business_phone | text | |
| gst_number | text | Nullable — set when registered |
| default_tax_rate | numeric | 0 until GST registration |
| default_payment_terms | integer | Days (e.g., 14 for Net 14) |
| invoice_prefix | text | "WTS" |
| invoice_next_number | integer | Auto-increment |
| stripe_account_id | text | |

## Application Structure

### Admin App (You)

**Auth:** Email/password via Supabase Auth. Single admin account.

**Navigation (sidebar):**

| Section | Pages |
|---------|-------|
| Overview | Dashboard |
| Pipeline | Contacts, Proposals |
| Work | Projects, Time Tracking |
| Finance | Invoices, Expenses |
| System | Documents, Settings |

**Pages:**

1. **Dashboard** — Revenue (month), outstanding balance, hours/utilization (week), active pipeline value. Panels: upcoming follow-ups, recent invoices.
2. **Contacts** — List/filter by status (lead/prospect/client/archived). Search by name/company. Badges show count.
3. **Contact Detail** — Full profile (identity, business info, tags). Activity timeline. Linked proposals, projects, invoices, documents. Add notes, log interactions.
4. **Proposals** — List by status. Create new from service type template. Send to client (email + portal). Track acceptance. Convert accepted → project.
5. **Projects** — List active engagements. Budget tracking, deliverables checklist, hours logged vs budget.
6. **Time Tracking** — Weekly timesheet view. Log hours by project with description. Mark billable/non-billable. Timer option for real-time tracking.
7. **Invoices** — Create from project. Auto-pull unbilled time entries (hourly/day-rate). Add/edit line items. Apply GST/HST. Preview/generate PDF. Send via email. Track payment status.
8. **Expenses** — Log by category, upload receipt, link to project. Filter by date range and category for tax reporting.
9. **Documents** — Central file browser. Upload, categorize, toggle client visibility.
10. **Settings** — Business info, GST#, tax rate, payment terms, invoice numbering, email templates.

### Client Portal

**Auth:** Magic link (passwordless email). Account created by admin when contact becomes a client.

**Navigation (sidebar):**

| Page | What clients see |
|------|-----------------|
| Overview | Active projects, outstanding balance, document count |
| Projects | Project status, description, dates, billing model (read-only) |
| Invoices | All their invoices, download PDF, pay via Stripe ("Pay Now" button) |
| Documents | Only documents where visible_to_client = true |
| Proposals | View and accept/decline proposals |

**What clients cannot see:** CRM/contacts, time tracking, expenses, settings, other clients' data.

**Data isolation:** Supabase Row-Level Security. All queries scoped by `contact_id` matching the authenticated user's linked contact record. Enforced at database level.

## Invoice & Payment Flow

### Lifecycle

1. **Create** — From project page or invoices list. Auto-populates client, rate, billing model. Pulls unbilled time entries for day-rate work.
2. **Review & Edit** — Add/edit line items, adjust amounts, add notes. Toggle GST/HST. Preview PDF. Save as draft.
3. **Send** — Email with PDF attached + link to client portal. Status → "sent". Client sees it in portal.
4. **Payment** — Client pays via Stripe (portal), e-transfer, cheque, or wire. Status → "paid".

### Billing Model Invoice Generation

- **Fixed price:** Single line item for agreed amount. Can split into milestone invoices (e.g., 50% upfront, 50% on delivery).
- **Monthly retainer:** One line item for the monthly amount. Auto-generate each month — one click to review and send.
- **Day rate:** Pulls billable time entries for the period. Line items show each day worked with description. Total = days × daily rate.

### Payment Methods

- **Stripe:** Client clicks "Pay Now" in portal → Stripe Checkout session → webhook confirms payment → auto-updates invoice status to "paid".
- **E-transfer:** Client sends to business email. Admin manually marks as paid.
- **Cheque:** Admin manually marks as paid + records date.
- **Wire/Other:** Admin manually records.

### GST/HST

- Tax rate configurable in Settings. Default 0% (pre-registration).
- When registered, set rate to 5% (GST) or applicable rate. GST# appears on invoices.
- Applied to all new invoices automatically. Existing invoices unaffected.

### Overdue Detection

- Vercel cron job runs daily.
- Invoices past `due_date` with status "sent" → marked "overdue".
- Optional email reminder sent to client.

## Error Handling

### User-Facing

- **Form validation:** Inline field-level errors with clear messages. Validate on blur and on submit.
- **Toast notifications:** Success/error feedback on all actions (save, send, delete, pay).
- **Loading states:** Skeleton loaders on all data-fetching pages. No blank screens.
- **Confirmation dialogs:** Required for destructive actions (delete invoice, archive client, remove document).
- **Empty states:** Friendly "no data yet" screens with CTAs (e.g., "No invoices yet — create your first one").
- **404 page:** Branded, with navigation back to dashboard.
- **Global error boundary:** Catches unhandled errors, shows friendly message, no white screen of death.

### Payment Errors

- **Card declined:** Show clear message in portal, suggest retry or alternative method.
- **Network error:** Retry with backoff, show user-friendly message.
- **Webhook failure:** Stripe retries automatically. Idempotent handler prevents duplicate processing.
- **Partial failure:** If Stripe succeeds but DB update fails, webhook retry catches it.

### Technical

- **API error responses:** Consistent JSON shape: `{error: string, code: string, details?: object}`.
- **Logging:** Server-side error logging for debugging (Vercel logs).
- **RLS errors:** Graceful handling — if a client tries to access another client's data, returns empty result (not a 403 that leaks existence).

## Seed Data (Test Environment)

A `seed` script that populates the system with realistic test data for end-to-end testing.

### Test Contacts

| Name | Company | Status | Source | Notes |
|------|---------|--------|--------|-------|
| Sarah Chen | Acme Corp | client | calendly | Has active retainer project, multiple invoices |
| Mike Ross | FinTech Inc | prospect | referral | Has a sent proposal, discovery call logged |
| Lisa Park | Valley Credit Union | lead | networking | Initial contact, follow-up scheduled |

### Test Proposals

| Contact | Service | Status | Amount |
|---------|---------|--------|--------|
| Sarah Chen | Implementation | accepted | $32,000 |
| Mike Ross | Assessment | sent | $7,500 |
| Sarah Chen | Retainer | accepted | $8,000/mo |

### Test Projects

| Name | Contact | Billing | Status |
|------|---------|---------|--------|
| AI Implementation — Workflow Automation | Sarah Chen | retainer ($8,000/mo) | active |
| AI Assessment — Phase 1 | Sarah Chen | fixed ($7,500) | completed |

### Test Time Entries

- 2 weeks of time entries on the active project (6-8 hrs/day, varied descriptions)
- Completed project has historical time entries
- Mix of billable and non-billable

### Test Invoices

| Number | Contact | Amount | Status |
|--------|---------|--------|--------|
| WTS-2026-003 | Sarah Chen | $5,000 | paid |
| WTS-2026-005 | Sarah Chen | $7,500 | paid |
| WTS-2026-006 | Sarah Chen | $8,000 | sent |
| WTS-2026-004 | Valley CU | $4,200 | overdue |

### Test Expenses

- Software subscriptions (GitHub, Supabase, Vercel)
- Travel expense to client site
- Office supplies

### Test Activity Log

- Discovery calls, emails, meetings, follow-up reminders across all contacts

### Test Documents

- Proposal PDFs, a sample contract, deliverable documents
- Mix of visible_to_client true/false

### Test Client Portal User

- Email: `testclient@example.com` linked to Sarah Chen contact
- Can log in via magic link to see Sarah's projects, invoices, documents

### Seed Script Behavior

- Runs via `npm run seed` or `npx supabase db seed`
- Idempotent — safe to run multiple times (upserts, not duplicates)
- Only runs against non-production environments (checks `NEXT_PUBLIC_ENV` or Supabase project)
- Includes a `npm run seed:reset` to wipe and re-seed

## Deployment

| Environment | Purpose |
|-------------|---------|
| Local | Development with Supabase CLI (local Postgres + Auth) |
| Preview | Vercel preview deployments per PR, linked to Supabase staging project |
| Production | Vercel production, linked to Supabase production project |

## Future Considerations (Not in scope)

- Multi-user / team support (add role column when hiring)
- Recurring invoice automation (currently one-click manual)
- Accounting integrations (QuickBooks, Wave)
- Advanced reporting / charts
- Mobile app
