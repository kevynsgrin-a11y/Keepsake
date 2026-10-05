# Keepsake Almanac — Audit Recommendations (Claude)

> **Handoff:** ZCode → Claude, created 2026-10-02 (fleet audit 2026-10-01). **Audited:** 2026-10-03 at `36ab8b6`, which is also the current production deploy.
> **Role:** advisory only. Nothing here was executed, merged, or deployed. Kevyn feeds this to ZCode.
> **Branch:** the handoff named `handoff/claude-audit`. That branch doesn't exist, and this session is pinned to `claude/compassionate-carson-8efj9q`, so the file lives there.
> **Supersedes:** audit Issue #4 (2026-08-28) and action-plan Task 2 "Create & bind Cloudflare KV namespace" (2026-08-31). See P1-3.
> **Decided 2026-10-03 (operator):** OD-1 = **A**, remove all three analytics paths. OD-2 = **A**, remove the server backup. Steps 0b and 2 are no longer conditional, and the Option-B material has been dropped from the plan. OD-3 through OD-8 are still open, as are OD-10 through OD-14, which were added 2026-10-05 together with the Phase 2 roadmap.
> **Decided 2026-10-05 (operator):** OD-9 = trailing slash with folder layout (`/slug/`). Step 5 is no longer conditional.

## Verdict

**The privacy contract is broken in production today, by infrastructure outside this repo. The in-repo data layer can silently lose a family's archive in several verified ways. Neither is hard to fix. Don't promote the site, and don't bind KV, until Steps 0–4 land.**

- **Live contradiction (P1-1).** Cloudflare Zaraz runs a Google Analytics 4 tool on keepsakealmanac.com: 79 GA4 pageview actions between 2026-09-06 and 2026-10-03, still firing. The Privacy Policy says "We do not use analytics … of any kind." Two more analytics injectors are configured on the same domain (Cloudflare Web Analytics auto-install, and a fleet Worker that injects a gtag snippet). The repo's CSP blocks the gtag injection (verified on a replica), but that protection is accidental. It doesn't cover Zaraz, which runs first-party.
- **Latent breach in shipped code (P1-2, P1-3).** Every saved memory is POSTed to `/api/submit-memory` with no consent and no toggle. It isn't stored only because nobody has bound KV yet, and the 2026-08-31 action plan lists binding it as a P1 task. Once bound, the endpoint is an open, world-writable, operator-readable store with client-chosen keys and no restore path. The good news: production has no KV binding, no Keepsake KV namespace exists, and Cloudflare analytics show **zero** requests to the endpoint since the custom domain went live (2026-09-05). Nothing has been collected. Remove the path now and the problem never materializes.
- **Silent data loss (P1-4 to P1-6).**
  - A schema mismatch white-screens the app permanently, Export button included.
  - Unreadable stored data is overwritten with the fictional sample family.
  - "Clear samples" deletes the user's own entries.
  - The only backup offered (Export) has no Import.
  For a vault whose only copy lives in `localStorage`, which Safari can purge after 7 days of non-use, these are the failures that matter most.
- **Tests:** none today, and the only server file is never type-checked. A `tsx` + `node:test` + `node:assert` harness runs cleanly against this repo (prototyped in a scratch copy: 7 pass, 2 `todo`). The plan lands it first. Target-contract tests go in as `todo`, and each fix branch flips its own.
- **Scope drift:** the code mostly matches the README's storage story. Two things drifted: (a) monetization and editorial surfaces the README doesn't mention; (b) an ops layer (proxy Worker, Zaraz, Web Analytics) that contradicts the README's first sentence.

**Order:** Step 0 (operator: analytics off, KV frozen) → 01 harness → 02 remove the server POST → 03 storage durability → 04 import/restore → 05–07. The operator chose option A for OD-1 and OD-2 on 2026-10-03. After that comes Phase 2 (Steps 8–15, added 2026-10-05): performance, SEO for the app's own pages, and the features that turn guide readers into vault users. Interview mode (Step 10) has the highest leverage.

### Privacy-contract scorecard (the handoff's failure modes)

| Failure mode | Status | Evidence |
|---|---|---|
| Backup on by default | **Yes. Worse: always on, no toggle, no notice** | `src/components/AddMemoryModal.tsx:53-59` |
| PII in query strings | **No** | Routes are static; search lives in React state; no user content reaches URLs or `document.title` |
| Unauthenticated KV writes | **Yes, latent** (no binding today) | `functions/api/submit-memory.ts:10-30`; reproduced against a local simulated KV |
| Cross-user reads | **No** (no read endpoint exists) | Keys are client-chosen or enumerable (`mem-<epoch ms>`) and unpartitioned, so any naive future GET endpoint would be one |
| Analytics | **Yes, live** | Zaraz GA4 (live), Web Analytics auto-install, proxy gtag injection (P1-1) |

### What leaves the browser today (production, keepsakealmanac.com)

| When | Destination | What | User consent | Status |
|---|---|---|---|---|
| Any page load | Cloudflare edge → Worker `custom-domain-proxy` → `keepsakealmanac.pages.dev` | Normal request metadata | n/a (hosting) | Live |
| Any page load | `fonts.googleapis.com`, `fonts.gstatic.com` | IP, user agent, `Referer` origin | Disclosed in policy | Live (`index.html:57-59`) |
| Page load and SPA route change | Zaraz (first-party `/cdn-cgi/zaraz/*`) → Cloudflare → Google Analytics 4 | Pageview context: path, title, referrer, UA; IP unless "hide IP" is set (it isn't) | None. Policy says "no analytics" | **Live:** 79 GA4 actions since 2026-09-06 |
| Page load | Cloudflare Web Analytics beacon | Page-load and performance beacon | None | Auto-install on. 80 page loads recorded 2026-09-28/29, none since (cause unverified) |
| Every HTML response | gtag `G-5VKBP1QHV3`, injected by the proxy Worker | Would send GA4 hits straight from the browser | None | Injected. Blocked by CSP `script-src 'self'` (replica-verified). Unblocked from at least 2026-09-22 until 2026-09-28, while production still ran a build without a CSP |
| "Save Memory to Vault" | `POST /api/submit-memory` | The whole memory: `id, title, date, category, author, generation, location, summary, fullStory, tags, isFavorite` (+ `imageUrl` if set) | None; no toggle | Code is live. **0 requests** 2026-09-05 to 2026-10-03. Not stored (no KV binding) |
| Showing a memory that has an image URL | Whatever host the user typed | IP, UA, `Referer` origin | Disclosed in the form and policy | Live |
| Family members, calendar events, time capsules, "notes" | Nowhere | — | — | Local only ✅ |

### Premise check: corrections to the handoff

| Handoff says | Actually |
|---|---|
| Branch `handoff/claude-audit` | Doesn't exist. This file is on `claude/compassionate-carson-8efj9q`. |
| "Last commit 2026-08-30" | Last commit is `36ab8b6`, 2026-10-01 (PR #4, GSC OPS heritage guides). |
| "Live Pages site" | The Pages project is only the origin. Both custom domains attached to it are **deactivated**. The apex and `www` are served by the fleet Worker `custom-domain-proxy` (routes `keepsakealmanac.com/*` and `www.keepsakealmanac.com/*`), which proxies to `keepsakealmanac.pages.dev` and injects GA4. The same Worker also fronts `fryup.uk`. Zaraz and Web Analytics run at the zone level. Three layers decide what's private, and only one of them is in this repo. |
| Optional KV backup; "KV namespace is sacred" | Production and preview have no KV binding, and the account has no Keepsake KV namespace (0 of 32 namespaces match). No user data is stored server-side. The constraint currently protects nothing, so don't create a namespace just to honor it. |
| `functions/api` auth surface | There's one function and no auth at all. It's also never type-checked: it isn't in any tsconfig, and a standalone `tsc` fails with `Cannot find name 'PagesFunction'`. |
| Prior findings in `audit/` | Four PDFs (2026-08-28 to 08-31). Most were fixed in `2c4064c`. Their Issue #4 ("wire the dead endpoint to KV and call it from AddMemoryModal") **is where P1-2 and P1-3 came from.** |
| (Implied) the prior audit's fixes are live | Only since 2026-09-28. Pages uses Direct Upload (`ad_hoc` deploys). Until then production ran the 2026-08-09 pre-audit build. That build predates `_headers` (so no CSP) and has no privacy policy, and its footer still says "Encrypted Heritage Vault". |
| tsx + node:assert convention | Works here: `node --import tsx --test "tests/**/*.test.ts"` passed on Node 22. CI pins Node 20, which reached end-of-life on 2026-04-30 and doesn't accept glob arguments to `--test`. Move CI to Node 22. |

**How this was verified.**
- Read all of `src/`, `functions/`, `public/`, the CI and config files, and the four audit PDFs.
- Built locally and served `dist/` with `wrangler pages dev` twice: unbound (matches production) and with a **local simulated** `MEMORIES` KV.
- Drove the local build with Chromium (Playwright). A local replica of the proxy's GA4 injection tested the CSP.
- Made read-only Cloudflare API calls: Pages bindings, domains, and deployments; DNS; Worker source and versions; Zaraz and Web Analytics config; aggregate GraphQL analytics counts.

**Not done:** no production writes, deploys, or KV reads. The live site was unreachable from this sandbox (egress policy, HTTP 403). I had no GA4 property access.

## Findings

### P1: fix before any promotion or KV binding

**P1-1 · Production runs analytics the Privacy Policy says don't exist** (outside the repo)
- **Zaraz** on zone `keepsakealmanac.com` has one tool, "Google Analytics 4", enabled. Settings: `autoInjectScript: true`, `historyChange: true` (tracks SPA route changes), no consent configuration. Cloudflare GraphQL `zarazActionsAdaptiveGroups` shows 79 `ga4` / `Pageview` actions from 2026-09-06 to 2026-10-03, the latest on 2026-10-03. By 2026-10-05 the total was about 91, still firing.
- **Cloudflare Web Analytics** has site `keepsakealmanac.com` with `auto_install: true`. `rumPageloadEventsAdaptiveGroups` recorded 80 page loads on 2026-09-28/29 and none since. I couldn't determine why it stopped.
- **Worker `custom-domain-proxy`** (v3, deployed 2026-09-22) injects `<script async src="https://www.googletagmanager.com/gtag/js?id=G-5VKBP1QHV3">` plus an inline `gtag()` bootstrap before `</head>` on every HTML response for the apex and `www`.
  - Today the repo CSP (`public/_headers:2`, `script-src 'self'`) blocks both scripts. Against a local replica of the Worker, Chromium logged two CSP violations and made zero requests to Google.
  - From at least 2026-09-22 until the first deploy that carried the CSP (2026-09-28 16:16 UTC), nothing blocked it.
- **Contradicts:** `src/components/legal/PrivacyPolicy.tsx:76-79` ("We do not use analytics, advertising pixels, or tracking cookies of any kind"), the footer badge at `src/App.tsx:160`, and `README.md:5` ("privacy-first").
- **Mitigating:** no memory content reaches analytics, because no user content ever appears in URLs or titles.
- **Fix:** Step 0b (OD-1 = A, decided). The CSP lock in `tests/privacy-surface.test.ts` keeps the gtag injection blocked. No repo test can see Zaraz, so it needs an ops check (Step 0b's verification).

**P1-2 · Every saved memory leaves the browser, with no consent, notice, or toggle**
- `src/components/AddMemoryModal.tsx:53-59` calls `fetch('/api/submit-memory')` with the full `MemoryItem` on every save. Fields captured in Chromium: `id, title, date, category, author, generation, location, summary, fullStory, tags, isFavorite`, plus `imageUrl` when set.
  - `.catch(() => {})` hides failures, and the response's `persisted` flag is ignored.
- The copy says otherwise:
  - The footer says "Stored Privately in Your Browser" (`App.tsx:160`).
  - The policy says "**Optionally**, on our server" (`PrivacyPolicy.tsx:52-58`). The option belongs to the operator (whether KV is bound), not the user.
  - The policy also says "this step silently does nothing". That's false: the payload is still transmitted to the function and parsed there.
- **Exposure so far:** zero requests to `/api/submit-memory` between 2026-09-05 and 2026-10-03 (path-filtered Cloudflare analytics, control-checked against `/` at 3,487 GETs and `/almanac` at 5 GETs), and no KV binding. Latent, but shipped.

**P1-3 · `/api/submit-memory` becomes an open, operator-readable store the moment `MEMORIES` is bound**
- Binding takes one uncommented block (`wrangler.toml:15-17`). Pages deploys via Direct Upload, so `wrangler.toml` is the source of truth for bindings, and the 2026-08-31 plan lists binding as a P1 task.
- With a binding, I reproduced each of these locally:
  - `submit-memory.ts:21` uses the **client-supplied `id` as the KV key**, so anyone can overwrite any record. In the demo, a second cross-origin `text/plain` POST with the same `id` replaced a stored memory with attacker-chosen fields.
  - `:22` stores the **entire request body** (`...data`): arbitrary fields and **no size cap**. A 5 MB body was accepted and stored.
  - `:12` accepts any Content-Type, so a cross-origin "simple" POST (e.g. `text/plain`) skips the CORS preflight. `:7` sends `Access-Control-Allow-Origin: *`, so any site can also read the response. There's no auth and no rate limit.
  - Keys come from one flat, enumerable keyspace (`mem-<epoch ms>`), with no per-user partition.
  - There's **no read, restore, or delete path.** The endpoint can never restore anything for the user, so it isn't a backup. All it does is create a plaintext copy on the operator's side. The 2026-08-31 plan's week 4 even says to "check the KV namespace for real submitted memories".
  - `:36-39` returns the raw `err.message` with HTTP 500 for client errors. That leaks JSON parser positions and KV internals such as "414 UTF-8 encoded length of 600 exceeds key length limit of 512".
- `PrivacyPolicy.tsx:85` promises to delete a server copy "tied to a specific entry". That's impossible as built: there's no user identifier, and entry ids never appear in the UI.
- Reproduce (local only; never point this at production):
  ```bash
  npm run build
  npx wrangler pages dev dist --kv MEMORIES --port 8789 --persist-to .wrangler/state
  curl -X POST localhost:8789/api/submit-memory -H 'Content-Type: application/json' -d '{"id":"mem-1","title":"a","author":"b"}'
  curl -X POST localhost:8789/api/submit-memory -H 'Content-Type: text/plain' -d '{"id":"mem-1","title":"x","author":"attacker","injected":1}'
  npx wrangler kv key get mem-1 --namespace-id MEMORIES --local --persist-to .wrangler/state   # → the attacker record
  ```
- **Fix:** Step 2 removes the endpoint and the client POST (OD-2 = A, decided).

**P1-4 · Stored data is never validated or versioned: schema drift white-screens the app for good, and unreadable data is replaced by the sample family**
- `src/hooks/usePersistedState.ts:13` trusts storage as-is (`JSON.parse(saved) as T`): no validation, no `schemaVersion`, no migrations. There's no error boundary anywhere (`src/main.tsx:7-13`, `src/App.tsx:96`).
- **Verified:** one stored memory missing `tags` (still valid JSON) throws `TypeError: Cannot read properties of undefined (reading 'map')`, and `#root` renders empty **on every load**.
  - The Export button is inside the unmounted tree, so the user can't even export. The only way out is clearing site data, which destroys the archive.
  - This answers the handoff's "what happens on schema change?", and it gates every data-model change in this plan.
- `usePersistedState.ts:11-16` with `:19-21`: when parsing fails, the hook returns `initial`, and its effect immediately writes `initial` back, **overwriting the unreadable original with sample data**.
  - Verified: truncated JSON in `keepsake_memories` → after reload, the key holds `mem-1` through `mem-5`.
  - The same applies to all four collections.
  - A realistic trigger: any future bug that persists `undefined` stores the string `"undefined"`, which then fails to parse.

**P1-5 · "Clear samples" deletes the user's own entries**
- `src/App.tsx:41-44` calls `setMemories([])`, while the banner promises "your entries won't be mixed with these samples" (`:88`).
- Verified: add one memory during the first session, click Clear samples, and `keepsake_memories` is `[]`.

**P1-6 · The only backup offered can't be restored**
- Export exists (`App.tsx:46-63`); import exists nowhere (verified: there's no import UI). The Terms tell users Export is their backup (`TermsOfService.tsx:47-50`).
- The export has no `schemaVersion` and no app id. Its keys are `memories, familyMembers, calendarEvents, timeCapsules, exportedAt`.
- Context: `localStorage` holds the only copy. WebKit's ITP policy deletes script-writable storage, `localStorage` included, after 7 days of Safari use without the user interacting with the site. Installed home-screen web apps are exempt from that cap.
- For an occasionally-used vault, the only protections are export **plus import**, or a real backup (OD-2 B).

### P2

- **P2-1 · Storage-quota failures are silent.** `usePersistedState.ts:20-24` swallows `QuotaExceededError`.
  - Verified: with storage full, a new memory shows in the UI and is gone after reload. No warning.
  - Export reads storage rather than state (`App.tsx:48-51`), so it silently omits unsaved entries too.
- **P2-2 · With two tabs open, the last writer wins.** There's no `storage` listener. Verified: an entry added in tab A disappears when a stale tab B saves.
- **P2-3 · Blocked storage white-screens the app.** `App.tsx:22` reads `localStorage` outside a try/catch, and so does the export handler (`:48-51`). That contradicts the hook's own comment (`usePersistedState.ts:3-5`). Verified with the `SecurityError` Chrome throws when site data is blocked.
- **P2-4 · "Family notes" are fake or ephemeral.**
  - `MemoryDetailModal.tsx:17-20` seeds two fictional comments onto **every** memory, including the user's real ones.
  - User-written notes live only in component state (`:31-38`). They bleed onto other memories (the modal stays mounted) and vanish on reload (verified).
  - Every memory also shows a fake "Archival Audio Recording (1:45)" with a dead "▶ Listen Audio" button (`:113-127`).
- **P2-5 · The time-capsule "seal" seals nothing.**
  - "🔒 Seal Capsule into Vault" (`TimeCapsules.tsx:121`) stores and displays the dedication in plain text.
  - `isUnlocked: false` is never recomputed from `unlockDate` (`:25`), so capsules stay sealed forever.
  - `sealedSecretCount: 5` is made up (`:28`).
  - The "View Seal Info" and "Explore Archives" buttons have no handlers (`:174-182`).
  - This is the same kind of false security signal as the "Encrypted Heritage Vault" claim the prior audit removed.
- **P2-6 · For returning visitors, the service worker turns guide links into the SPA's 404.**
  - `vite.config.ts:14` registers a `NavigationRoute` fallback with no denylist.
  - Every guide's canonical URL, `og:url`, and internal links use trailing slashes (e.g. `public/questions-to-ask-grandparents.html:8,10,39,70`). Pages serves `/slug` and 308-redirects `/slug/` to it (verified in `wrangler pages dev`).
  - Verified: with the service worker in control, `/questions-to-ask-grandparents/` and `/how-to-record-family-stories/` render "Page Not Found". First visits (no service worker yet) work, via the 308.
- **P2-7 · Server code is never type-checked, and CI runs no tests.**
  - `tsconfig.app.json:25` includes only `src`. Checked on its own, `functions/` fails (`Cannot find name 'KVNamespace'` / `'PagesFunction'`); with `@cloudflare/workers-types` it passes `strict` unchanged. Under OD-2 = A, Step 2 deletes `functions/`, so no server type-check is planned. If server code ever returns, add `@cloudflare/workers-types` and a `tsconfig.functions.json` in the same PR.
  - `.github/workflows/ci.yml:15` pins Node 20 (end-of-life 2026-04-30), and there's no test step.
- **P2-8 · Merging isn't deploying.** Production uses `ad_hoc` Direct Upload. Deploy history: `2026-08-09` (the pre-audit build), then `2026-09-28` (`271f60b`), then `2026-10-01` (`36ab8b6`). `main` had the audit fixes for a month before they went live. A privacy fix is only real once it's deployed and checked (OD-6).
- **P2-9 · "On This Day in Family History" never shows the family's own history.** `DailyAlmanac.tsx:20-23` filters only `SAMPLE_ON_THIS_DAY_EVENTS`, which covers the fictional family on Aug 9. The empty state invites "Be the first to add one", but a memory dated today never shows up. The app's namesake daily feature ignores user data.
- **P2-10 · Nothing can be edited or deleted:** not memories, family members, events, or capsules.
  - After the first visit, samples can't be removed (the banner shows only once), so they flow into exports and the print album.
  - Users also can't delete an entry they regret, which matters for the privacy story.
- **P2-11 · Privacy requests are postal-only.** `PrivacyPolicy.tsx:122-127` gives only a street address, while the policy invites deletion requests (`:85`) and California-rights requests (`:88-103`). The counsel review (prior plan, Task 4) is still open.

### P3

- **P3-1** Google Fonts is a third-party request on every load (`index.html:57-59`). It's disclosed, but self-hosting (e.g. `@fontsource/*`) would make "nothing leaves your browser" literally true. Afterwards, tighten `font-src` and `style-src` to `'self'`.
- **P3-2** Calendar issues:
  - Anniversaries don't recur, because events match on the exact `YYYY-MM-DD` (`AlmanacCalendar.tsx:241`).
  - "Upcoming Keepsake Dates" lists every event, including past ones, unsorted (`:294`).
  - `today` is frozen at module load (`:50`).
  - `personOrGroup: "Family"` is hard-coded (`:95`).
- **P3-3** Almanac accuracy and honesty:
  - Sunrise and sunset are computed for Portland (`almanac.ts:27`) but shown in the viewer's timezone (`:43`).
  - Seasons assume the Northern Hemisphere (`:10-15`).
  - The quote's attribution, "Eleanor Vance, 1948" (`:82`), has no source.
  - "Passed down in the 1930 Farmers' Almanac notebook" (`DailyAlmanac.tsx:150`) is invented provenance.
  - The prompt changes on every render (`:161`).
  - The button promises "View Full Memory & Comments" (`:228`), but comments are fake (P2-4).
- **P3-4** Wrong or hard-coded sample copy:
  - The "Harrison & Sterling Heritage Tree" title (`FamilyHeritage.tsx:58`) stays after users add their own family.
  - "Add your own … to replace it" (`FamilyHeritage.tsx:66`, `TimeCapsules.tsx:53`), but adding replaces nothing.
  - "1 Archived Stories" is a made-up count (`FamilyHeritage.tsx:32,198`).
- **P3-5** SEO:
  - `index.html:12` sets the canonical URL `https://keepsakealmanac.com/` on every SPA route, which conflicts with the eight SPA URLs in `sitemap.xml`.
  - Unknown routes return 200 (a "soft 404").
  - All six guide footers contain a malformed `</</a>` that swallows the closing tag.
  - The apex and `www` both serve the site, with no redirect between them.
- **P3-6** The `includeLineage` checkbox does nothing (`PrintExporter.tsx:13,61`). Affiliate links are still `href="#"` (already known: prior plan, Task 3).
- **P3-7** `URL.revokeObjectURL` runs synchronously right after `click()` (`App.tsx:62`), which can cancel the download in some browsers. Defer it.
- **P3-8** Cloudflare zone hygiene (outside the repo): Always Use HTTPS is off and the minimum TLS version is 1.0. Recommend turning it on and raising the minimum to 1.2. The service worker also precaches the 361 KB `og-image.png` (glob at `vite.config.ts:15`). Running `wrangler` creates `.wrangler/`, which isn't gitignored.
- **P3-9** Lint warning at `AlmanacCalendar.tsx:15`: sample data is exported from a component file. Moving `INITIAL_CALENDAR_EVENTS` and `CalendarEvent` to `src/data/` also lets tests import them without React.

### Scope drift: README vs what shipped (handoff Q4)

The README's storage section is accurate; it even documents the POST (`README.md:36-40`). Here's what drifted:

| Surface | In README? | Note |
|---|---|---|
| Daily Almanac: computed moon/sun/season, "On This Day", weather lore, quote, prompts | Only as `utils/almanac.ts` | The namesake feature, but it uses sample data only (P2-9) |
| Family Heritage tree; Print & Export album | Implied | Print is just `window.print()` |
| Affiliate "Recommended Resources" (3 placements, `href="#"`) | No | A monetization surface |
| Static editorial guides plus sitemap entries: 6 (GSC OPS, 2026-10-01), grown by 2026-10-05 to 13 guides plus a `/guides/` hub | No | Live outside the SPA. The app links to none of them (Step 9), and returning visitors can't open them because of P2-6 (Step 5) |
| Proxy Worker, Zaraz GA4, Web Analytics | No | Contradicts the README's first sentence (P1-1) |
| "Heirloom recipes" | Yes | Only a memory category; there's no recipe structure |
| GitHub description: "memory platform" | — | Implies accounts and sync, which don't exist |

**On Q4:** the product has outgrown its intent docs in two directions. Monetization and editorial content are fine but undocumented. The ops layer contradicts the core promise, which isn't fine. Step 7 documents both.

## Execution plan

**Ground rules for ZCode**
- One branch per step, one PR per branch.
- Never merge or deploy. Kevyn does both.
- In every fix branch, **commit the tests first** (red), then the fix (green), so reviewers can check out the first commit and watch it fail.
- Every PR must pass this gate, and its description must list the finding IDs it closes:
  ```bash
  npm ci && npm run lint && npm run build && npm test
  ```
- Branch from `main` unless a step says otherwise.
- Nothing here needs a secret. Don't create a KV namespace (OD-2 = A).
- Zaraz, Web Analytics, and the `custom-domain-proxy` Worker belong to the operator/fleet. Don't change them from this repo.

### Step 0 · Operator actions (no code; do these first)
- **0a · Freeze KV.** Don't bind `MEMORIES`, don't uncomment `wrangler.toml:15-17`, and strike Task 2 from the 2026-08-31 action plan.
- **0b · Turn off analytics (OD-1 = A, decided). This is the most urgent item: as of 2026-10-05, Zaraz had sent about 91 GA4 pageviews, 14 of them after 2026-10-03.** Do it in the Cloudflare dashboard. The Cloudflare connector used on 2026-10-05 can read these settings but not edit them: both write attempts returned `10000: Authentication error`, and nothing changed.
  1. Zaraz (zone keepsakealmanac.com): turn off the "Google Analytics 4" tool, then turn off automatic script injection. The app never calls Zaraz itself, so nothing breaks.
  2. Web Analytics: disable the keepsakealmanac.com site. Disable it rather than delete it, so its history is kept.
  3. Proxy Worker: the preferred fix is OD-10, which serves the domain from Pages directly and removes the two keepsake routes from `custom-domain-proxy`. The fallback is to delete the two keepsake entries from `GA4_MIDS` and redeploy the Worker. Either way, fryup.uk is unaffected.
  Verify: Cloudflare GraphQL `zarazActionsAdaptiveGroups` for the zone stays at 0 for 48 hours, and `curl -s https://keepsakealmanac.com/almanac | grep -cE 'googletagmanager|cdn-cgi/zaraz|cloudflareinsights'` prints `0`.
- **0c ·** Answer OD-3 through OD-8 and OD-10 through OD-14. OD-1, OD-2, and OD-9 are decided.

### Step 1 · `zcode/01-test-harness` (tests and tooling only; no app changes)
- `package.json`:
  - devDependency: `tsx`.
  - Script: `"test": "node --import tsx --test \"tests/**/*.test.ts\""`.
- `.github/workflows/ci.yml`: set `node-version: 22`, add `env: TZ: UTC`, and add an `npm test` step.
- `.gitignore`: add `.wrangler/`.
- New test files: `tests/helpers/memoryStorage.ts`, `tests/almanac.test.ts`, `tests/privacy-surface.test.ts`, `tests/static-site.test.ts`. The asserts for each are in the test spec below.
  - Target-contract cases use `{ todo: '<branch that flips it>' }`, so CI stays green.
  - Skip a KV mock and tests for `functions/api/submit-memory.ts`: Step 2 deletes that file. Its current behavior is documented in P1-3, including the reproduction steps.
- **Verify:** the gate passes, and `npm test` reports passes plus some `todo`s.

### Step 2 · `zcode/02-server-backup-off` (OD-2 = A, decided; after Step 1) → closes P1-2, P1-3
- **Commit 1:** in `tests/privacy-surface.test.ts`, turn the Step 2 `todo`s into normal tests: `functions/` doesn't exist, and the network call-site allowlist is `[]`.
- **Commit 2:**
  - Delete the POST block at `AddMemoryModal.tsx:53-59`.
  - Delete `functions/api/submit-memory.ts` and the now-empty `functions/` directory.
  - Replace the KV comment block in `wrangler.toml` (`:5-17`) with one line: the server backup was removed on purpose (OD-2 = A).
- In the same PR, so the policy and the behavior never disagree:
  - `PrivacyPolicy.tsx`: drop the "Optionally, on our server" bullet (`:52-58`) and the server-deletion bullet (`:85`), and bump `LAST_UPDATED` (`:5`).
  - `TermsOfService.tsx`: update `:36-39` and `:56-59`.
  - `README.md`: update `:29-45`.
- **Verify:** the gate passes, `grep -rn "fetch(" src/` prints nothing, and `functions/` is gone.
- **Deploy note for Kevyn:** after this deploys, any browser still running an old cached bundle will POST to `/api/submit-memory` until its service worker updates. Pages answers those requests with `405` (checked in `wrangler pages dev` with `functions/` removed), and the old client ignores the response. Nothing is received or stored.

### Step 3 · `zcode/03-storage-durability` (after Step 1; before Step 4) → closes P1-4, P1-5, P2-1, P2-2, P2-3, P3-9
- **New `src/data/schema.ts`:**
  - `SCHEMA_VERSION = 1`.
  - One validator per collection. Each returns a list of errors and never throws.
  - `migrate(raw)` from v0 (today's unversioned arrays) to v1. It repairs and never drops (a missing `tags` becomes `[]`), and it preserves unknown fields.
  - Move `CalendarEvent` and `INITIAL_CALENDAR_EVENTS` here (fixes P3-9).
  - Export `SAMPLE_IDS` covering all four collections.
- **New `src/utils/storage.ts`:**
  - `getStorage()` returns `null` when accessing storage throws.
  - `readCollection(storage, key, validate)` returns `{status, value, raw?, errors?}`, where status is one of `missing`, `ok`, `repaired`, `corrupt`, `unavailable`.
  - `writeCollection()` returns `{ok: true}` or `{ok: false, reason}`, where reason is `quota` or `unavailable`.
  - `quarantine(storage, key, raw)` copies the raw string to `keepsake_recovery_<key>_<ISO>`.
- **`usePersistedState`:**
  - Fall back to `initial` **only** on `missing`.
  - On `corrupt`: quarantine first, then run with `[]` and show a recovery banner ("Some saved data couldn't be read — Download it").
  - Never write over a value it couldn't read.
  - Return a save status the UI can show.
  - Listen for `storage` events and re-read when another tab changes the data.
- **`App.tsx`:**
  - Remove direct `localStorage` access (lines 22 and 48-51) in favor of `storage.ts`.
  - `clearSamples` removes only `SAMPLE_IDS`.
  - Wrap `<Routes>` in an `ErrorBoundary` whose fallback offers "Download raw data" (every `keepsake_*` key, verbatim), so a crash can never trap data.
- After the first user save, call `navigator.storage.persist()` (best effort, silent). Don't claim this defeats Safari's ITP.
- **Tests first:** `tests/storage.test.ts`, `tests/schema.test.ts`, and the clear-samples part of `tests/collections.test.ts`. Narrow the `privacy-surface` storage allowlist to `['src/utils/storage.ts']`.
- **Manual acceptance** (local only: `npm run build && npx wrangler pages dev dist`, in Chromium):
  1. Add a memory, then click Clear samples. The memory survives.
  2. Remove `tags` from a stored memory in DevTools and reload. The app renders, a recovery banner appears, and the raw data can be downloaded.
  3. Truncate the stored JSON and reload. `keepsake_recovery_*` holds the original, and samples did **not** overwrite it.
  4. Fill storage, then add a memory. A save-failure warning appears.
  5. Open two tabs and add a memory in each. Both persist.
  6. Block site data. The app renders in session-only mode with a notice.

### Step 4 · `zcode/04-import-restore` (after Step 3) → closes P1-6, P3-7
- **First**, before changing any export code, generate `tests/fixtures/export-v0.json` using the **current** export code (`App.tsx:46-53`).
- **New `src/utils/backupFile.ts`:**
  - `buildExport()` returns `{app: 'keepsake-almanac', schemaVersion, exportedAt, memories, familyMembers, calendarEvents, timeCapsules}`.
  - `parseImport(text)` validates and migrates, rejects newer schema versions, reports errors per item, and never throws.
  - `mergeImport(existing, incoming)` takes the union by id. When the same id has different content, it keeps both by giving the incoming item a new id. It never deletes.
  - A URL sanitizer for `imageUrl` and `avatarUrl`: keep `https:` and `/images/…`, strip everything else. Import is a new trust boundary, because relatives will pass these files to each other.
- **UI:**
  - An "Import backup" control next to Export, with a preview ("12 memories, 4 family members… 9 new, 3 already present") and a confirm step.
  - Store `keepsake_last_export_at`, and nudge the user after 30 days if there are changes.
  - Defer `revokeObjectURL`.
- **Tests first:** `tests/export-import.test.ts`.
- **Manual acceptance:**
  - Export, clear site data, then import: the counts and titles are identical.
  - Importing a file whose `imageUrl` uses `javascript:` strips that URL.

### Step 5 · `zcode/05-guide-urls-and-sw` (independent; after Step 1) → closes P2-6, P3-5
- **URL convention (OD-9, decided 2026-10-05): trailing slash, with a folder layout.** This matches what's live: as of 2026-10-05, all 14 static pages (13 guides plus the `/guides/` hub) declare `/slug/` canonical URLs, and there are 247 internal links in that form. Only `sitemap.xml` uses the slash-less form.
  - Move each `public/<slug>.html`, including `guides.html`, to `public/<slug>/index.html`. Verified with `wrangler pages dev`: `/slug/` returns 200, and both `/slug` and `/slug/index.html` 308-redirect to `/slug/`.
  - Change every guide `<loc>` in `sitemap.xml` to the trailing-slash form, so the canonical URL, sitemap entry, and internal links all agree.
  - Fix the `</</a>` in the six original guides.
- In the workbox section of `vite.config.ts`, add a `navigateFallbackDenylist` covering `/api/`, `/guides/`, and every guide path, both with and without the slash.
  - Better: build the list at build time from the folders in `public/`, so new guides are covered automatically.
  - Without this, the service worker answers guide URLs with the SPA's 404.
- `index.html`: remove the blanket canonical tag (Step 9 adds per-route canonicals).
- Flip the `static-site` todos.
- **Verify:**
  - The gate passes, and `grep -c denylist dist/sw.js` prints at least 1.
  - Manually: with the service worker in control, `/questions-to-ask-grandparents/` shows the guide, and `/questions-to-ask-grandparents` 308-redirects to it.
- **Rule for content waves (GSC OPS and others):** every new guide goes in `public/<slug>/index.html`, with a trailing-slash canonical URL and a matching trailing-slash sitemap entry. `static-site.test.ts` enforces this on every PR. Each new guide written the old way adds another page that returning visitors can't open.

### Step 6 · `zcode/06-honest-ui` (after Step 3) → closes P2-4, P2-5, P2-9, P2-10, P3-2 to P3-4, P3-6
- Remove the seeded comments and the fake audio block. Persisting notes instead would add a fifth collection to the schema and export (OD-4).
- Time capsules:
  - Use honest copy: "not encrypted — visible to anyone using this browser".
  - Add `isCapsuleUnlocked(c, today)`.
  - Drop the made-up counts and the dead buttons.
- On This Day: add `memoriesOnThisDay(memories, date)` so users' own memories appear, and label the samples as samples.
- Other cleanup:
  - Remove the invented provenance and the unsourced attribution.
  - Derive the heritage title from data.
  - Fix the "replace" copy.
  - Implement or remove `includeLineage`.
- Edit/delete: add delete (and ideally edit) for all four collections. The pure reducers live in `collections.ts` and are covered by `tests/collections.test.ts`.
- Calendar:
  - Add `eventsOnDay(events, date)`, with yearly recurrence for Birthday, Anniversary, and Memorial (OD-7).
  - Make "Upcoming" sorted and future-only.
  - Read `today` at render time.
- **Tests first:** the additions to `collections.test.ts`.

### Step 7 · `zcode/07-privacy-docs-sync` (after Steps 0 and 2) → closes P2-11 and the Q4 drift
- README:
  - A data-flow table (the "What leaves the browser" table, updated after the fixes).
  - An Infrastructure section naming the proxy Worker, Zaraz, and Web Analytics, their state after Step 0, and who owns each.
  - The editorial pages, the monetization placements, and how to run the tests.
- Privacy Policy: an analytics statement that matches the OD-1 outcome, a privacy contact email (OD-5), and a bumped `LAST_UPDATED`. Then send it for counsel review.

### Phase 2 · Growth and performance (Steps 8–15; start once Steps 1–5 are merged)

Ordered by impact, with the same ground rules: tests first and one branch per step.

Two numbers from the 2026-10-05 build shape this phase:
- The app ships as a single 344.7 KB JS chunk (104.7 KB gzipped): react-dom is 52%, app code 26%, react-router 11%, canvas-confetti 3%.
- The guides ship no JS, and their fonts are system fonts. Once Step 0b removes the injected analytics, they're about as fast as a page can be. The app is where performance work pays off.

**Step 8 · `zcode/08-perf-quick-wins`** (no behavior change)
- **Self-host fonts.** Ship only the faces actually used: Inter 400–700 (or the variable font), Playfair Display 700, and Cormorant Garamond 400 and 400 italic. Confirm against the CSS first.
  - Use the Latin subset with `font-display: swap`, and preload the face the hero headline uses.
  - Remove the Google Fonts links (`index.html:57-59`), then tighten the CSP to `font-src 'self'` and `style-src 'self' 'unsafe-inline'`.
  - This removes a third party and a render-blocking request (closes P3-1).
- **Code-split by route.** Lazy-load every route except `/almanac`, plus the two modals. Load `canvas-confetti` only on the first save.
- **Cache hashed assets.** In `_headers`, give `/assets/*` the header `Cache-Control: public, max-age=31536000, immutable`, so repeat visits stop revalidating files whose names already change on every build.
- **Trim the service worker.** Add `globIgnores: ['og-image.png']`; that one image is 361 KB of a roughly 900 KiB precache.
- **Guard it in CI.** Add a size budget that fails the build if initial JS exceeds about 90 KB gzipped, and run Lighthouse CI on `/almanac` and one guide.
- **Optional, only if Lighthouse shows JS is the bottleneck:** switching to `preact/compat` would save roughly 40 KB gzipped, at some compatibility risk with React 19 and React Router 7.
- **Verify:**
  - The initial chunk is under budget and Lighthouse CI passes.
  - A local run makes no requests to Google Fonts.

**Step 9 · `zcode/09-seo-app-routes`** (closes the rest of P3-5)
- Give each app route its own `<title>`, description, and canonical URL via a small `useDocumentMeta` hook (no new dependency).
- **Link the app to the guides.** Add "Guides" to the header and footer, pointing at `/guides/`. Today the app links to none of the 13 guides, and only the guides link into the app.
- Unknown routes should render `NotFound` with `<meta name="robots" content="noindex">`, so search engines don't index the "soft 404" pages.
- **Only if Search Console shows the app routes aren't indexed:**
  - Prerender them at build time as `dist/<route>.html` (static meta and copy only, with date-dependent content left to the client). That keeps today's URLs, because Pages serves `/vault` from `vault.html` (verified for the guides).
  - Implement it with `react-dom/server` plus `StaticRouter`. It depends on Step 3, because module-level `localStorage` reads have to be guarded first.

**Step 10 · `zcode/10-interview-mode`** (the single biggest lever)
- **The gap:** the content waves bring in people searching "questions to ask your grandmother/parents/a dying loved one". Right now they read a list and leave, because nothing on the page leads into the app.
- `src/data/questionSets.ts`: one question set per guide (grandparents, grandmother, grandfather, parents, family-recipe, holiday, reunion, dying-loved-one), with a stable id for every question.
- An `/interview/:setId` route:
  - Shows one question at a time with an answer box and skip/next.
  - Saving creates a memory: the title is the question, the tags are the set id, and the category is inferred.
  - Shows progress and resumes where the user left off. Everything stays local.
- Each guide gets an "Answer these in your vault →" button that links to `/interview/<setId>`. The URL only ever carries our own ids, never user content, so "no personal data in query strings" stays true.
- **Measurement without tracking:** Cloudflare's server-side analytics count first-visit arrivals at `/interview/*` by path.
- **Tests:** `tests/interview.test.ts`:
  - Every guide's set id exists.
  - An answer produces a memory that passes the schema.
  - The resume state survives a reload (the reducer is a pure function).

**Step 11 · `zcode/11-indexeddb-and-photos`** (after Steps 3 and 4)
- **Move storage to IndexedDB.** Use `idb-keyval` (about 1 KB) behind the Step 3 storage interface. Migrate once, and keep the `localStorage` copy until the IndexedDB copy has been read back and the item counts match.
- **Photo attachments.** Pick from files or the camera roll, resize in the browser (longest side about 1600 px, roughly 80% JPEG/WebP quality), and store the blobs in IndexedDB.
  - Show storage use from `navigator.storage.estimate()` in Settings, and call `navigator.storage.persist()`.
- **Export as a zip.** Package `backup.json` plus a `photos/` folder using `fflate`, loaded only when the user exports. Import validates exactly as in Step 4.
- **Why:** photos are the feature people most expect from a memory keeper, and `localStorage`'s roughly 5 MB limit can't hold them (P2-1).

**Step 12 · `zcode/12-calendar-ics-and-print`**
- **Calendar export:** "Add to my calendar" downloads an `.ics` file covering birthdays, anniversaries, and memorials, each repeating yearly (`RRULE`). Reminders arrive on the user's own calendar with no server involved.
- **Print album:** a real lineage page built from the family members, a recipe-card layout for heirloom recipes, proper page breaks, and a cover with the family's name.
- **Recipe fields:** optional ingredients and steps for heirloom-recipe memories. This is a schema v2 migration through Step 3's `migrate`.

**Step 13 · `zcode/13-install-and-backup-nudges`**
- **Install prompt:** after the third saved item, prompt to install the app. Android gets the browser's `beforeinstallprompt`; iOS gets an instruction sheet. Home-screen web apps on iOS are exempt from Safari's 7-day storage purge.
- **Backup reminder:** after a set number of changes or 30 days, show "Download a backup" (from Step 4). On mobile, use the Web Share API to send the file to Files, Drive, or email.

**Step 14 · `zcode/14-guide-template-rules`** (applies to every future content wave)
- **Every guide must have:**
  - The folder layout, trailing-slash canonical URL, and sitemap entry from Step 5.
  - `Article` and `BreadcrumbList` JSON-LD. Skip FAQ and HowTo markup: Google stopped showing those rich results for most sites in 2023.
  - A visible author and last-updated date.
  - Links to `/guides/` and to the matching interview set.
  - A print stylesheet plus a "Print this list" button, to capture "printable" searches.
  - No invented statistics or quotes.
- **Add an `/about/` page** covering who runs the site, why it's private by design, and how to check: the Network tab shows nothing leaving the browser on save. It builds trust, counts toward Google's E-E-A-T quality signals, and works as marketing.
- **Enforce it:** `static-site.test.ts` checks the mechanical rules on every PR, so content waves can't regress them.

**Step 15 · `zcode/15-affiliate`** (after OD-11)
- Replace the placeholder links in the three app placements with real affiliate links. Add contextual links in the guides: recorders for "how to record", archival boxes for "memory box", scanners for "preserve photos".
- Mark links `rel="sponsored noopener"` and put a disclosure next to each placement.
- Add one sentence to the privacy policy: affiliate partners may set cookies after a visitor clicks through to their site.

### Phase 3 · Later bets (each is its own project; the operator picks the order, OD-14)
- **Voice recordings:** record in the browser and store locally. Needs `Permissions-Policy: microphone=(self)` and a privacy-policy update.
- **A real family tree:** parent/child links plus GEDCOM import and export (the standard genealogy file format). This reaches genealogy users and fits DNA-kit affiliates.
- **Sealed time capsules that actually seal:** passphrase encryption with WebCrypto, an exportable sealed file to hand to someone, and an `.ics` reminder for the unlock date.
- **A shareable offline keepsake book:** one self-contained HTML file with the data and photos embedded, sent by email or AirDrop. Sharing needs no server, and every shared copy carries the site's name.
- **Opt-in end-to-end-encrypted sync,** only if people actually ask for cross-device access (see the OD-2 note).
- **Spanish editions** of the app and the top guides.

### Test suite spec (file → asserts)

**`tests/helpers/memoryStorage.ts`**
- `createStorage({ quotaChars?, throwOnAccess? })` implements `Storage`.
- Past the quota, `setItem` throws `DOMException(…, 'QuotaExceededError')`.
- With `throwOnAccess`, every call throws `SecurityError`.

**`tests/almanac.test.ts`** (Step 1; passes today)
1. `toMonthDay(new Date(2026, 0, 5)) === '01-05'`.
2. `getSeasonName` never returns `'Unknown Season'` for months 0–11. December, January, and February map to `Winter`, `Winter`, `Late Winter`.
3. `isSameCalendarDay` is true for 00:01 vs 23:59 on the same day, and false for 23:59 vs 00:01 the next day.
4. `getLunarPhase`, using UTC instants chosen mid-bucket:
   - `2026-10-10T12:00Z` matches `/^New Moon/`.
   - `2026-10-18T12:00Z` matches `/^First Quarter/`.
   - `2026-10-26T12:00Z` matches `/^Full Moon/`.
   - `2026-11-01T12:00Z` matches `/^Last Quarter/`.
5. `getSunTimes(new Date('2026-12-21T12:00Z'), 78.2, 15.6)` deep-equals `{sunrise: '—', sunset: '—'}`. This is polar night, where suncalc returns `null`.
6. `getWeatherLore` returns the same value at 09:00 and 18:00 on one day, and repeats after 7 days. Pick dates away from DST changes.
7. `buildTodayAlmanac(d, events).onThisDayEvents === events`, and `dateString` equals `d.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})`.

**`tests/privacy-surface.test.ts`** (Step 1; the Step 2 items become normal tests in Step 2)
1. From `public/_headers`:
   - `script-src` is exactly `'self'`.
   - `connect-src` is exactly `'self'`.
   - `script-src` contains no `'unsafe-inline'` or `'unsafe-eval'`.
   - `frame-ancestors 'none'` is present.
   This lock is the only thing blocking the proxy's gtag injection, so loosening it has to show up as a visible test change.
2. The network call sites in `src/**/*.{ts,tsx}` (`fetch(`, `sendBeacon`, `XMLHttpRequest`, `WebSocket`, `EventSource`) exactly match an allowlist: `['src/components/AddMemoryModal.tsx']` in Step 1, `[]` from Step 2 on.
3. `index.html` and `public/*.html` contain no `<script src="http…">`, and no inline `<script>` other than `type="application/ld+json"`.
4. The files that touch `localStorage` are a subset of an allowlist: `['src/App.tsx', 'src/hooks/usePersistedState.ts']` in Step 1, `['src/utils/storage.ts']` from Step 3 on.
5. `functions/` does not exist, so the site has no server code (`todo` until Step 2). If server code ever comes back, that has to show up as a visible test change.

**`tests/static-site.test.ts`** (Step 1; the `todo`s flip in Step 5)
- **Passes today:** every sitemap `<loc>` maps either to a file in `public/` (`<slug>.html` or `<slug>/index.html`) or to a route in `App.tsx`, and `robots.txt` points to the sitemap.
- **`todo` until Step 5:**
  - Every guide lives at `public/<slug>/index.html`.
  - For each guide, the canonical URL, `og:url`, and sitemap `<loc>` are all `https://keepsakealmanac.com/<slug>/`.
  - Every internal link to a guide uses the `/<slug>/` form.
  - No `</</a>`.
  - The workbox denylist covers every folder in `public/` that contains an `index.html`.

**`tests/storage.test.ts`** (Step 3)
1. A missing key → `missing`, and the hook seeds `initial`. The first-visit path is unchanged.
2. Corrupt JSON → `corrupt` with `raw`. After a full load → save cycle, the original string still exists, at its key or under `keepsake_recovery_*`. It is never overwritten.
3. Valid JSON with a memory missing `tags` → `repaired`, with `tags: []` and an error entry. Nothing is dropped.
4. A write over quota → `{ok: false, reason: 'quota'}`, and the previously stored value is unchanged.
5. With `throwOnAccess`: `getStorage()` returns `null`, reads return `unavailable`, and nothing throws.
6. The pure function `applyExternalChange(current, newRaw, validate)` (for cross-tab changes) adopts valid values and ignores invalid ones.

**`tests/schema.test.ts`** (Step 3)
1. Every sample constant validates with zero errors: `INITIAL_MEMORIES`, `INITIAL_FAMILY_MEMBERS`, `TIME_CAPSULES`, `INITIAL_CALENDAR_EVENTS`.
2. `migrate(v0)` produces `schemaVersion: 1`; `migrate(migrate(x))` deep-equals `migrate(x)`; unknown fields survive.
3. Input with `schemaVersion: 99` → `{error: 'newer-version'}`, and the input is left untouched.

**`tests/collections.test.ts`** (Steps 3 and 6)
1. `clearSamples(list)` keeps every item whose id isn't in `SAMPLE_IDS` and removes the rest (P1-5).
2. `toggleFavorite` doesn't mutate its input.
3. `memoriesOnThisDay` matches MM-DD across years. Whatever Feb 29 does in non-leap years, pin it.
4. `eventsOnDay`: recurring types match every year, and non-recurring types match only the exact date. `upcoming(events, today)` is sorted ascending and excludes past events.
5. `isCapsuleUnlocked(c, today)` is true exactly when `today >= c.unlockDate`.
6. `deleteItem(list, id)` removes only that id and doesn't mutate its input.

**`tests/export-import.test.ts`** (Step 4)
1. `buildExport()` includes `app`, `schemaVersion`, an ISO `exportedAt`, and the four collections.
2. Round trip: `parseImport(JSON.stringify(buildExport(s)))` deep-equals `s`, including emoji, right-to-left text, and newlines in `fullStory`.
3. `fixtures/export-v0.json` imports and migrates.
4. Invalid JSON, the wrong `app`, and a newer `schemaVersion` each return a specific error code. Nothing throws.
5. `mergeImport`: identical duplicates collapse, a same-id conflict keeps both, and `existing.length` never decreases.
6. Image URLs using `javascript:`, `data:`, or `http:` are stripped; `https:` and `/images/…` URLs are kept.
7. A 2,000-memory archive round-trips in under 1 second.

## Operator decisions needed

**OD-1 · Analytics on keepsakealmanac.com: DECIDED 2026-10-03 → A, remove all three.**
- The three are the Zaraz GA4 tool, Web Analytics auto-install, and the proxy's gtag entry. Step 0b carries out the removal; Step 7 brings the policy and README into line.
- Rationale: privacy is the product's differentiator, and the data is thin anyway (about 79 GA4 pageviews in 4 weeks). Cloudflare's server-side zone analytics already count requests without any tracking in the browser.
- Still open after removal:
  - The policy has been inaccurate since about 2026-09-06, when Zaraz started sending data.
  - Before 2026-09-28, production had no policy page at all.
  - Whether that calls for any notice or remediation is a question for counsel; this isn't legal advice.
  - Check DevTools → Application → Cookies on the live site to see whether Zaraz left a client-ID cookie, since the policy says "no tracking cookies".

**OD-2 · Server-side backup: DECIDED 2026-10-03 → A, remove it.**
- Step 2 carries this out. The endpoint gave users nothing (it can't restore anything), it was pure liability, and nothing was ever stored, so removing it loses no data.
- Consequence to keep in view: local-only storage with export/import is honest, but users who never export lose everything if they lose a device or the browser purges storage (Safari's 7-day ITP purge included). That makes Steps 3 and 4 (durability, then import and export reminders) the main protection.
- If cross-device restore becomes a requirement later, the only design consistent with "privacy-first" is an opt-in, end-to-end-encrypted backup: data encrypted in the browser, the server holding ciphertext only, and a recovery code that stays with the user. Spec that as a new project; don't revive the old endpoint.

**OD-3 · Sample data.** Two options: keep auto-seeded samples (with Clear samples fixed and delete added), or start empty with a "Load example family" button. Recommendation: start empty, so samples never mix with real data or leak into exports and print.

**OD-4 · Placeholder UI.** Approve removing the seeded comments, fake audio, "seal" wording, and invented provenance (Step 6). The alternative is to keep comments as a real, persisted feature, which adds a collection to the schema and the export.

**OD-5 · Privacy contact.** Provide an email address or form for privacy and deletion requests. Today the policy offers only postal mail.

**OD-6 · Deploy discipline.** Decide who deploys, and how each deploy records its commit plus a post-deploy check (security headers present, no analytics tags). After the last audit, production ran a month-old build.

**OD-7 · Calendar semantics.** Should Birthday, Anniversary, and Memorial events recur every year? Recommendation: yes.

**OD-8 · CI runtime.** Node 22 (recommended; satisfies Vite 8's `>=22.12` requirement) or Node 24.

**OD-9 · URL convention for content pages: DECIDED 2026-10-05 → trailing slash with folder layout (`/slug/`).**
- **Why:** it matches the 14 live canonical URLs and all 247 internal links, so only the sitemap and the file layout change (Step 5).
- **Rejected:** no slash (`/slug`), which would have meant rewriting 247 links and the content template.
- This is now the one rule for every content wave: new guides go in `public/<slug>/index.html` with a `/slug/` canonical URL and sitemap entry.

**OD-10 · Serve keepsakealmanac.com directly from Pages.**
- **Recommended.** Reactivate the two custom domains on the Pages project, point the apex and `www` at `keepsakealmanac.pages.dev`, remove the two keepsake routes from `custom-domain-proxy`, and redirect `www` to the apex.
- **Why:**
  - Every HTML response currently makes an extra hop through the proxy, which reads the whole page into memory before sending it, so visitors get the first byte later.
  - It removes the shared proxy's ability to inject scripts into this site.
  - The fallback in Step 0b (editing `GA4_MIDS`) becomes unnecessary.
- **Side effect:** any fleet dashboard that reads GA4 will show zero for Keepsake once OD-1 is done. Use Cloudflare's server-side analytics and Search Console for this site instead.

**OD-11 · Monetization policy.**
- **Recommended: affiliate links only, no ad networks.** Ad networks mean third-party tracking scripts, which break the privacy promise and slow the pages down.
- **Your call:** whether to include affiliate links for paid story-capture subscription services on the "questions" guides. They tend to convert well on that content, but they send readers away from the vault.

**OD-12 · How to measure success without in-browser tracking.**
- **Recommended, reviewed monthly:**
  1. Search Console clicks and impressions for `/guides/*`.
  2. Server-side request counts for first-visit arrivals at `/interview/*` and `/vault` (Cloudflare zone analytics, aggregate by path).
  3. Affiliate revenue from the network dashboards.
- **If real-user performance data is ever needed:** the honest option is Cloudflare Web Analytics, which is cookieless, with one line added to the policy. Not GA4.

**OD-13 · Sequence approval.**
- **Recommended:** Phase 1 (Steps 1–7) before any Phase 2 work, except Step 5, which should land before the next content wave.
- Inside Phase 2, Step 10 (interview mode) has the highest return.

**OD-14 · Phase 3 order.** Pick one or two of: voice recordings, family tree with GEDCOM, real sealed capsules, the shareable offline book, end-to-end-encrypted sync, Spanish.
