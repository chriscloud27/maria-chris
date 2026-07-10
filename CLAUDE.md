# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (no emit)
npm test             # Jest (runs tests in src/)
npm run test:watch   # Vitest watch mode
npm run test:coverage # Vitest coverage
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:headed  # Playwright with browser visible
npm run test:ci      # Full CI: lint + typecheck + jest + playwright
```

**Running a single Jest test file:**
```bash
npx jest src/lib/notionClient.test.ts
```

**Running a single Vitest test file:**
```bash
npx vitest run src/components/SomeComponent.test.tsx
```

## Architecture

### Routing & Internationalization

The app uses **next-intl** with `[locale]` dynamic segments. Supported locales: `en`, `de`, `es`. Default locale is `en` (served at `/`, no prefix). German and Spanish are prefixed (`/de/...`, `/es/...`).

- `src/middleware.ts` — locale detection and routing
- `src/i18n.ts` — loads per-locale message JSON, sets `timeZone: 'America/Bogota'`
- `src/navigation.ts` — exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter`
- `src/messages/{en,de,es}.json` — all user-facing strings

**Always use `useTranslations()` for text — never hardcode user-facing strings in components.**

### Page Structure

`src/app/[locale]/page.tsx` is a `"use client"` component that composes all sections. It controls two display states via `isCountdownFinished`:
- **Before countdown ends:** shows RSVP, Attire, LocationExcursions, Hotels
- **After countdown ends:** shows Destinations, MediaUpload, hides pre-wedding sections

`Rsvp` is loaded with `next/dynamic` + `ssr: false` to avoid hydration issues.

Layouts: `src/app/[locale]/layout.tsx` wraps with `NextIntlClientProvider`. Always use `async` function signatures and `await params` for the locale param:

```ts
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // ...
}
```

### RSVP System

RSVP data flows: `Rsvp.tsx` → `POST /api/rsvp` → `notionClient.addRSVP()` → Notion database.

Key files:
- `src/components/Rsvp.tsx` — form UI, react-hook-form + zod resolver
- `src/lib/schema.ts` — Zod schema (`code`, `name`, `kids`, `+1`, `RSVP-DE`, `notes`)
- `src/app/api/rsvp/route.ts` — API route, validates with schema, calls notionClient
- `src/lib/notionClient.ts` — Notion SDK client; `addRSVP()` upserts by guest code
- `src/config/notion.ts` — reads `NOTION_TOKEN` and `NOTION_DATABASE_ID` from env

Notion property name mapping (schema field → Notion property):
- `code` → `Code` (rich_text)
- `name` → `Name` (title)
- `kids` → `Kids` (multi_select)
- `+1` → `+1` (select: "Yes"/"No")
- `RSVP-DE` → `RSVP-DE` (select: "Yes"/"No") — main wedding day attendance

### Content & Styling

Static wedding content (dates, locations, schedules) lives in `src/content/wedding.json`. Components should import from there rather than hardcoding values.

Custom global styles go in `src/app/globals.css`. Use Tailwind utility classes first; only add to globals.css when utilities aren't sufficient.

**Adding a new page section:**
1. Create the component in `src/components/`
2. Add any new text/data to `src/content/wedding.json` and the locale message files
3. Import and place the component in `src/app/[locale]/page.tsx`

### Media Upload

Guests can upload photos/videos to Google Drive. See `MEDIA-UPLOAD.md` for full setup. Requires `GOOGLE_SERVICE_ACCOUNT_KEY` and `DRIVE_FOLDER_ID` in env. The `MediaUpload` component only renders post-countdown.

### Testing Split

- **Jest** (`jest.config.js`, `ts-jest`): runs files in `src/` — used for `notionClient.test.ts` and Notion integration tests
- **Vitest** (`vitest.config.ts`, jsdom): runs component/unit tests — excludes `test/**`
- **Playwright**: E2E tests in `test/`

### Environment Variables

Required in `.env.local`:
```
NOTION_TOKEN
NOTION_DATABASE_ID
RESEND_API_KEY
RESEND_FROM_EMAIL
RSVP_DEADLINE          # e.g. '2026-05-10T23:59:59'
GOOGLE_SERVICE_ACCOUNT_KEY
DRIVE_FOLDER_ID
```

### Utility Scripts

```bash
npx ts-node scripts/backfillNotionCodes.ts  # Assign RSVP codes to guests missing them
```
