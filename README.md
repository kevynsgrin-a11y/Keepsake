# Keepsake Almanac

Family Milestone Vault & Daily Heritage Calendar — keepsakealmanac.com

A privacy-first, no-account browser app for recording family memories, heirloom
recipes, calendar events, and time capsules. Content is saved locally in the
browser first, with an optional server-side backup via Cloudflare KV.

Operated by Oak and Main Developers LLC.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS 4 (CSS-first config, no `tailwind.config.js`)
- React Router for client-side routing
- Cloudflare Pages for hosting, with one Pages Function (`functions/api/submit-memory.ts`)
- `vite-plugin-pwa` for the installable/offline service worker

## Local development

```bash
npm ci
npm run dev       # start the dev server
npm run lint      # oxlint
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Data storage

Everything a user enters is saved to `localStorage` in their own browser —
memories, family members, calendar events, and time capsules each persist
under their own key (see `src/hooks/usePersistedState.ts`). There is no
account system.

Saving a memory also POSTs to `/api/submit-memory`, a Cloudflare Pages
Function that writes to a KV namespace **if one is bound** as `MEMORIES`.
Without that binding the function still validates the request and returns
success, so local storage is never affected either way — the KV write is a
best-effort backup, not the primary datastore.

To enable it: create a namespace (`wrangler kv namespace create MEMORIES`)
and either bind it in the Cloudflare Pages dashboard under
Settings → Functions, or uncomment and fill in the `[[kv_namespaces]]` block
in `wrangler.toml`.

## Deployment

Deploys via Cloudflare Pages. `public/_headers` sets security headers
(CSP, HSTS, etc.) and `public/_redirects` provides the SPA fallback so
deep links like `/vault` work on refresh — both are read automatically by
Cloudflare Pages from the build output.

## Project structure

```
src/
  components/       UI components, one per section/feature
  components/legal/ Privacy Policy & Terms of Service pages
  data/             Static sample data (fictional demo content, clearly
                     disclosed as such in the UI)
  hooks/            usePersistedState, useModalDismiss
  utils/almanac.ts  Date-driven season/moon-phase/sunrise-sunset calculations
functions/api/      Cloudflare Pages Functions
public/             Static assets, robots.txt, sitemap.xml, manifest.json,
                     _headers, _redirects
```
