# Contact Page — Discovery-Call Booking Widget — Design Spec

**Branch:** `feat/contact-booking-widget` (off `master`)
**Date:** 2026-05-18
**Status:** Awaiting William's review before plan writing.
**Source-of-truth references:**
- `D:/code/WTS/docs/contact-flow.md` — current `/api/contact` pipeline (not changed by this work)
- `D:/code/WTS/docs/pages.md` — page map / anchor naming / breakpoints
- `D:/code/WTS/docs/positioning.md` — voice and framing rules
- Workspace `D:/code/CLAUDE.md` — framing rules

---

## 1. Goal

Replace the implicit "fill the form → wait for William to email times" flow with an inline self-serve booker on `contact.html`. Keep the contact form as the fallback for visitors who prefer to write a message before committing to a slot. Zero recurring vendor cost. Branch is disposable — if the UX disappoints in preview, the branch gets deleted and nothing else changes.

The hero already promises a free 30-minute discovery call. Today, the only way to get one is via the form. This adds a direct path.

---

## 2. Non-goals (v1)

These are explicitly out of scope. A v2 may revisit some.

- Mirroring confirmed bookings into the WTSAdmin `contacts` table. (Google's native scheduler has no webhook on the free tier; v2 could add a Calendar-API poller on the Railway server.)
- Custom-branded booking page / whitelabel. The booker uses Google's styling.
- Stripe deposit at booking time.
- Reminder emails beyond what Google sends natively.
- Touching `server.js`, adding env vars, or adding any third-party paid vendor.
- Changing the contact form, the `/api/contact` flow, or the `contacts`-table write path.
- Touching `index.html`, `services.html`, `pricing.html`, `small-business.html`, `about.html`, `faq.html`, or the chatbot prompt.

---

## 3. Approach

Embed **Google Calendar Appointment Schedule** as an iframe in a new section on `contact.html`, between the hero and the existing two-column "How This Works / Send a Message" block.

- William's business email (`william@williamtucker.ca`) is on Google Workspace, so Google Meet links auto-attach to confirmed bookings.
- No backend changes. No new dependencies. No env vars.
- Booking events land in William's Google Calendar; Google's native host-email is the only notification path in v1.
- The contact form remains for visitors who want to send a written message first.

---

## 4. Page layout

```
+----------------------------------------+
| HERO: Let's Talk                       |  (existing — untouched)
+----------------------------------------+
| NEW SECTION: Pick a Time               |
| Short blurb + Google Appt iframe       |
| (responsive, ~720px tall on desktop,   |
|  ~900px on mobile)                     |
+----------------------------------------+
| How This Works  |  Send a Message      |  (existing — copy reworked)
| 1. Pick a time  |  [contact form]      |  (form code untouched)
| 2. Confirmation |                      |
| 3. We talk      |                      |
+----------------------------------------+
| Other Ways to Reach Me                 |  (existing — untouched)
+----------------------------------------+
```

The success banner at the top of `<main>` (shown when the form returns 200) stays exactly as-is.

---

## 5. Copy

### 5.1 New "Pick a Time" section

**Heading:** Pick a Time
**Blurb:** Free 30 minutes, no obligation. The calendar below pulls live from my schedule — grab a slot that works and you'll get a Google Calendar invite with a Meet link.

### 5.2 Rewritten "How This Works" steps

Step 1 retitle and copy:
- **Pick a time** — Use the calendar above to grab a slot. Or, if you'd rather write a message first, use the form on the right and I'll suggest times by email.

Step 2 retitle and copy:
- **You get a calendar invite** — With a Google Meet link, a short agenda, and my email.

Step 3 stays as written:
- **We talk for 30 minutes** — Discuss your goals, the work, whether AI is the right fit. No pressure, no obligation.

The "References and live demos available on the discovery call." footer line under the steps stays.

### 5.3 Hero blurb

Unchanged. The current hero ("Every engagement starts with a free discovery call. No pressure, no obligation — just a conversation about your goals.") still reads correctly with a booker added.

### 5.4 "Send a Message" heading

Unchanged.

### 5.5 Privacy notice

Add one sentence to `privacy.html` naming Google (Calendar/Meet) as a data processor for booking data. Single sentence; no rewrite. Goes in the same section that already names Supabase / Resend / Cloudflare Turnstile / Railway.

---

## 6. Iframe specification

- **Container:** white card on the existing light-gray section background (or stay on the hero's navy with the iframe in a white panel — pick during implementation based on visual flow). Tailwind classes: `bg-white rounded-xl border border-gray-200 p-2 md:p-4`.
- **Iframe attributes (verbatim minimum):**
  - `src` from Google's embed snippet — pasted in after William creates the appointment schedule in his Google Workspace calendar.
  - `width="100%"`
  - `height="720"` (desktop), with a mobile override via Tailwind utilities to ~900px.
  - `frameborder="0"`
  - `loading="lazy"`
  - `title="Book a discovery call with William Tucker"`
- **No `sandbox` attribute.** Google sets its own framing rules and over-sandboxing breaks the widget.
- **No CSP changes required** — the repo doesn't set a Content-Security-Policy header. If one is ever added, `frame-src https://calendar.google.com https://calendar.app.google` will need to be included.

---

## 7. One-time setup (William's side)

Before the iframe `src` can be filled in, William does the following in `calendar.google.com` (signed in as `william@williamtucker.ca`):

1. **Create → Appointment schedule.** Name: "Discovery Call (30 min)".
2. **Duration:** 30 minutes. **Buffer:** 15 minutes between appointments. **Min advance notice:** 24 hours.
3. **Availability window:** William's choice. Suggested starting point: Tue–Thu, 10:00–16:00 Pacific. Easy to adjust later.
4. **Intake form fields:** Name (required), Email (required), free-text "What would you like to talk about?" (required).
5. **Conferencing:** Google Meet (auto-attaches because Workspace).
6. **Save → Share → Embed.** Copy the `<iframe ...>` snippet.
7. Paste the snippet into the placeholder in `contact.html` that the implementation leaves clearly marked.

The implementation will include a clearly-commented placeholder so step 7 is a one-line swap.

---

## 8. Files touched

| File | Change |
|---|---|
| `contact.html` | Insert new `<section>` between hero and the "Contact Section" two-column block. Reword three list items inside the existing "How This Works" `<ol>`. Bump the `?v=` cache-buster on the stylesheet link (per `docs/deploy.md` convention). |
| `privacy.html` | Add one sentence naming Google (Calendar/Meet) as a data processor. |
| `docs/contact-flow.md` | Add a short note at the top: "A self-serve booker (Google Appointment Schedule) was added to `contact.html` in 2026-05-18; the booker bypasses this endpoint and writes directly to William's Google Calendar. The form path documented below is unchanged." |
| `docs/_backlog.md` | Add an item: "v2 — mirror Google Calendar bookings into WTSAdmin `contacts` table via Calendar-API poller on Railway." |

No JS file changes. No CSS file changes beyond what Tailwind generates from new utility classes. No `server.js` changes. No package.json changes.

---

## 9. Branch + deployment

- **Branch:** `feat/contact-booking-widget` off `master`. (WTS uses `master`, not `develop`.)
- **Local preview:** `npm run watch` + `npm start` for live editing.
- **Hosted preview:** push the branch → Railway preview URL if branch-preview is configured (verify against `docs/deploy.md`). If Railway only auto-deploys `master`, William previews locally.
- **Linter:** `npm run check:claims` must pass. This change adds no credibility claims, but the build runs the linter regardless.
- **Tailwind build:** the Railway deploy already runs `npm run build` which compiles Tailwind. Any new utility classes get picked up automatically.
- **Bailout:** if William doesn't like the UX in preview, `git checkout master && git branch -D feat/contact-booking-widget`. Nothing else changed.

---

## 10. Risks and edge cases

- **Iframe height jank on mobile.** Google's embed picks its own internal height; the wrapper height may need a media-query tweak after first preview.
- **Privacy notice drift.** Easy to forget the one-line `privacy.html` update. Bundled into the same PR to prevent this.
- **Booker availability gaps.** If William sets a very narrow availability window (e.g., 4 hours/week), the embed will show mostly empty days, which looks bad. Mitigation: start with a generous window; tighten later.
- **No WTSAdmin record on booking.** A booking that doesn't follow up via the form creates no row in `contacts`. William manually adds the contact in WTSAdmin if a booking turns into a real lead. v2 fixes this with a poller.
- **Double-booking via the form path.** A visitor who fills the form AND books a slot creates one contact row (from the form) and one calendar event (from the booker). Same person, two surfaces. Acceptable at solo-consultancy scale; flag in v2 design if it becomes painful.
- **CSP regression.** None today. Anyone adding CSP later must whitelist `calendar.google.com` and `calendar.app.google` in `frame-src`.

---

## 11. Acceptance criteria

1. `contact.html` shows a new "Pick a Time" section between the hero and the existing two-column block, with a working Google Calendar Appointment Schedule iframe.
2. Booking through the iframe creates an event in William's Google Calendar with a Google Meet link.
3. The existing contact form still works (same POST, same Supabase write, same Resend emails).
4. The "How This Works" steps reflect the new dual-path (pick-a-time OR send-a-message).
5. `privacy.html` names Google as a data processor in the same list that names Supabase / Resend / Cloudflare / Railway.
6. `npm run build` passes (linter + Tailwind compile).
7. The page renders correctly at desktop and mobile breakpoints (matches existing breakpoint conventions in `docs/pages.md`).

---

## 12. Out of scope but worth noting for a possible v2

- **WTSAdmin mirror.** Add a small Node job on the Railway server that polls Google Calendar API every ~10 min, finds new "Discovery Call" events, and upserts them into the WTSAdmin `contacts` table with `source='booking'`. Needs Google OAuth refresh-token or service-account credentials in Railway env. Roughly half a day of work.
- **Booking analytics.** Count bookings per week, no-show rate, conversion to project. Out of scope until volume warrants it.
- **Pre-call intake automation.** Auto-send a brief "what to bring to the call" email an hour before the meeting. Can be done with Resend + a Calendar-API listener.
