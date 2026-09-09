# Live Preview Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Enable CORS, Draft Mode, and Live Preview for Pages and Posts (Option A URLs).

**Architecture:** Same-app Next.js + Payload; preview secret unlocks Draft Mode; `RefreshRouteOnSave` refreshes iframe on autosave.

**Tech Stack:** Payload 3.87, Next.js 16 App Router, `@payloadcms/live-preview-react`, Lexical RichText.

## Global Constraints

- Keep UI templates minimal (no design overhaul).
- Do not add schedulePublish / job queue.
- Do not commit unless user asks.
- Public read access stays `authenticatedOrPublished`; Draft Mode uses `overrideAccess` only when enabled.

---

### Task 1: Env + Payload config (serverURL, cors, csrf, livePreview)

**Files:**
- Modify: `src/payload.config.ts`
- Modify: `.env`, `.env.example`
- Create: `src/lib/getURL.ts`

- [ ] Add `getServerSideURL` / `getClientSideURL` helpers from `NEXT_PUBLIC_SERVER_URL`
- [ ] Set `serverURL`, `cors`, `csrf`, `admin.livePreview` for pages + posts

### Task 2: Draft Mode routes

**Files:**
- Create: `src/app/(frontend)/next/preview/route.ts`
- Create: `src/app/(frontend)/next/exit-preview/route.ts`

- [ ] Validate `PREVIEW_SECRET`; enable draft mode; redirect to `path`
- [ ] Exit preview clears draft mode

### Task 3: Query helpers + frontend routes + RefreshRouteOnSave

**Files:**
- Create: `src/lib/getDocument.ts` (or similar)
- Create: `src/components/LivePreviewListener.tsx` (RefreshRouteOnSave wrapper)
- Create: `src/app/(frontend)/[slug]/page.tsx`
- Create: `src/app/(frontend)/posts/[slug]/page.tsx`
- Modify: `src/app/(frontend)/page.tsx` (CMS `home` with welcome fallback)
- Install: `@payloadcms/live-preview-react`

- [ ] Fetch by slug with draft/overrideAccess when Draft Mode on
- [ ] Render title + RichText; optional chaining for incomplete drafts
- [ ] Mount LivePreviewListener on content pages

### Task 4: Smoke check

- [ ] Types/lint clean for touched files
- [ ] Document how to verify in admin (Live Preview button)
