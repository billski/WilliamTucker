---
title: WTS Backlog
status: active
last-reviewed: 2026-05-06
---

# WTS Backlog

Known gaps, deferred work, and unverified claims. When you notice
something uncertain or out of scope, append here instead of confabulating
or silently fixing.

## Suspected drift

_(empty at inception)_

## Tooling enhancements

- **Extract chatbot system prompt from `server.js:28-194` to
  `prompts/chatbot-system.md`.** Reduces a ~165-line prose blob inside JS
  to an editable file. Adds a startup-time read with a hard-fail guard.
  Deferred — done as its own task when the prompt is next edited.

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
