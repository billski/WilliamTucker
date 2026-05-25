---
title: WTS Backlog
domain: meta
status: active
last-reviewed: 2026-05-24
---

# WTS Backlog

Known gaps, deferred work, and unverified claims. When you notice
something uncertain or out of scope, append here instead of confabulating
or silently fixing.

## Suspected drift

- **`pricing.html:84` still says "Free 30-Minute Discovery Call"** (the
  big navy promo card H2 at the top of the page) — the 2026-05-18
  copy-fix commit `e770f76` updated lines 233 and 275 ("Discovery card
  subtitle + closing CTA blurb") but missed the hero promo card title.
  Production currently has 30 in one place, 60 in two. Out of scope for
  a docs sync (the rule is "do not touch files outside `docs/**` and
  `docs/_backlog.md`"); needs a one-line copy fix on a separate branch.
  When fixed, add a `discovery-call-duration` claim-linter pattern in
  `scripts/check-claims.mjs` so a future drift in either direction trips
  the build — same discipline as the other recurring-drift patterns.

- **Brand assets shipped 2026-05-24 have no doc owner.** The `linkedin/`
  directory (announcement.png + svg, banner.png + svg, preview.html) and
  the refreshed `img/og-image.png` + new `img/og-image.svg` from commit
  `89a1c66` are unmatched by `doc-ownership.yml`. Two options worth
  picking one of: (a) extend `visual-system:` ownership to include
  `img/og-image.*` and `linkedin/**`, with a short "Brand assets" section
  added to `visual-system.md` listing each artifact and where it's used;
  or (b) confirm these are out-of-band launch artifacts that legitimately
  don't belong to any domain doc, and add a `coverage-exclude:` entry on
  `visual-system.md`. Decide before the next docs sync — silence here
  becomes the new precedent.

## Feature follow-ups

- **Mirror Google Calendar bookings into WTSAdmin `contacts`.** v1 of the
  discovery-call booking widget (`contact.html`, 2026-05-18) embeds a
  Google Appointment Schedule iframe but does not write bookings to the
  WTSAdmin database — Google's free tier has no webhook. A v2 would add
  a small Node poller on the Railway server that queries the Google
  Calendar API every ~10 min, finds new "Discovery Call (60 min)" events,
  and upserts a row into `contacts` with `source='booking'`. Needs a
  Google OAuth refresh token or service-account credentials in Railway
  env. Roughly half a day of work. Spec:
  `docs/superpowers/specs/2026-05-18-contact-booking-widget-design.md` §12.

## Tooling enhancements

- **Try `vault-doctor --check-coverage` against the live vault.** Synced
  in from `wts-ai-docs` v0.3 on 2026-05-24 alongside this entry. For
  each domain doc with `paths:` in `doc-ownership.yml`, the check reports
  source files matching the glob that the doc does not cite. Run it once
  to surface gaps (`node scripts/vault-doctor.mjs --check-coverage`),
  decide which findings are real vs noise, then opt the noisy ones out
  per-doc via frontmatter `coverage-exclude:` / `coverage-extensions:`
  before enabling `--enforce-coverage <pct>` in CI. See
  `_meta/vault-conventions.md` §Coverage for the full rule.

- **Document an emergency-deploy escape hatch.** If the linter false-positives
  and blocks a legitimate hot-fix deploy, the path forward is undocumented.
  Two options worth picking one of: (a) honor a `SKIP_CLAIMS_CHECK=1` env var
  in `scripts/check-claims.mjs` and document its use, with the discipline that
  any use must be followed by a real fix; or (b) document the existing
  workaround (add a temporary `<!-- check-claims-allow: emergency hot-fix; ... -->`
  suppression and a matching `## TODO verify` entry here for cleanup).
  Decide before the linter ever fires on a real production-blocker.

- **Note the CLAUDE.md / scope-rule coupling.** `CLAUDE.md` quotes forbidden
  phrases nine times as part of its instructions. The walker in
  `scripts/check-claims.mjs` deliberately excludes top-level `*.md` files
  other than `PRODUCT.md`. If a future change broadens the scan scope to
  include arbitrary `*.md`, `CLAUDE.md` will trip nine violations and need
  suppressions. Add an inline note near `SCAN_TOP_LEVEL_FILES` if scope
  ever expands.

## TODO verify

_(empty at inception)_
