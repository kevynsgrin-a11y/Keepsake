# HANDOFF → Claude: Keepsake Almanac — audit + test backfill

**Created:** 2026-10-02 by ZCode (fleet audit 2026-10-01). **Branch:** `handoff/claude-audit`.
**The loop:** you audit + advise → write `RECOMMENDATIONS-CLAUDE.md` (spec at bottom) →
Kevyn feeds it to ZCode for execution. You advise; you do not execute, merge, or deploy.

## What this build is

keepsakealmanac.com — "Family Milestone Vault & Daily Heritage Calendar": a
**privacy-first, no-account browser app** for family memories, heirloom recipes,
calendar events, and time capsules. Content is saved **locally in the browser first**,
with **optional server-side backup via Cloudflare KV**. Oak and Main Developers LLC.
Stack: Vite + React + TS (src/components, hooks, utils, data), `functions/api/` (Pages
Functions), wrangler.toml, an `audit/` directory in-repo.

## Where the intent lives

`README.md` (the privacy-first contract above is the product's identity), `audit/`
(prior audit findings — read before re-finding them), then code.

## Verified current status

Live Pages site. **Zero tests** despite hooks/utils/api layers. Last commit 2026-08-30;
GitHub description mentions milestone vault + legacy calendar + daily almanac + memory
platform — feature surface has grown past the README's first paragraph.

## The audit ask

1. **Privacy-contract audit** (the core claim): local-first correctness — what exactly
   leaves the browser, when, and with whose consent? Map every network call in
   `functions/api/` + any analytics. An optional-KV-backup design has classic failure
   modes: backup-on-by-default, PII in query strings, unauthenticated KV writes,
   cross-user reads. Verify none exist; flag anything ambiguous.
2. **Data-layer durability**: localStorage/IndexedDB schema + versioning — what happens
   to a user's family archive on schema change or quota exhaustion? Export/import story?
   (For a memories vault, silent data loss is the worst possible failure.)
3. **Test strategy** (zero exist): spec first suites — utils pure functions,
   export/import round-trip, KV backup client contract (with a mock KV), and the
   functions/api auth surface. Name files + asserts; ZCode writes them.
4. **Scope drift**: README vs shipped features — is the daily-almanac/legacy-calendar
   surface documented, or has the site outgrown its own intent docs?

## Fleet constraints

Live site — no deploys. Never merge. KV namespace is sacred (no deletion). Secrets via
vault. tsx + node:assert convention.

## Deliverable spec

`RECOMMENDATIONS-CLAUDE.md` in repo root (this branch): `## Verdict` · `## Findings`
(P1/P2/P3 with file:line) · `## Execution plan` (ordered; test files first; branch
names + verification commands) · `## Operator decisions needed`.
