# Live Preview, Draft Mode & CORS — Design

**Date:** 2026-08-08  
**Status:** Approved (Approach 1, URL Option A)

## Goal

WordPress-like Live Preview in the Payload admin iframe, with secure Draft Mode so unpublished content is visible only when preview is intentionally enabled.

## URL shape (Option A)

| Content | Public URL |
|---------|------------|
| Page `home` | `/` |
| Other pages | `/{slug}` |
| Posts | `/posts/{slug}` |

Reserved: `/posts` is not a CMS page slug for routing (Next.js `/posts/[slug]` wins for post URLs).

## Architecture

Same Next.js app hosts admin + frontend.

1. **CORS / CSRF / `serverURL`** — `NEXT_PUBLIC_SERVER_URL` in Payload config (needed for iframe `postMessage` and relationships).
2. **`admin.livePreview`** — enabled for `pages` + `posts`; URL function builds preview path from slug, then hits `/next/preview` with secret so Draft Mode turns on before the page loads.
3. **Draft Mode** — `/next/preview` validates `PREVIEW_SECRET`, enables Next.js draft mode, redirects to the content path. `/next/exit-preview` disables it.
4. **Frontend routes** — slim templates (title + Lexical body; posts also excerpt/hero). Queries use `draft` + `overrideAccess` only when Draft Mode is on.
5. **`RefreshRouteOnSave`** — client component from `@payloadcms/live-preview-react` refreshes the route on autosave/publish.

## Env

- `NEXT_PUBLIC_SERVER_URL` (e.g. `http://localhost:3000`)
- `PREVIEW_SECRET` (random string; required to enable Draft Mode)

## Out of scope

Scheduled publish, visual editor, full marketing theme, separate frontend app.

## Success criteria

- Admin → Live Preview shows the matching frontend URL.
- Typing + autosave updates the iframe without publishing.
- Public visitors without Draft Mode never see drafts.
- Invalid/missing preview secret cannot enable Draft Mode.
