# AI Coding Agent Instructions for web-iwkz-2.0

These instructions help an AI agent quickly become productive in this Next.js 15 (App Router) project using Tailwind v4 and shadcn-style UI.

## Overview & Architecture

- **App Router:** Pages and layout live under [app/](app). Entry layout in [app/layout.tsx](app/layout.tsx) wraps content with `ToastProvider`.
- **Client-first UI:** Many components are client components (e.g., [app/page.tsx](app/page.tsx), [components/prayerTimesCard/prayerTimesCard.tsx](components/prayerTimesCard/prayerTimesCard.tsx)). Default to client when interacting with browser APIs or hooks.
- **API proxy routes:** App-provided API endpoints in [app/api/\*\*](app/api) proxy to an external CMS using `IWKZ_API_URL` and `STRAPI_API_TOKEN` (e.g., [app/api/pages/route.tsx](app/api/pages/route.tsx), [app/api/global/route.tsx](app/api/global/route.tsx), [app/api/prayer-time/route.tsx](app/api/prayer-time/route.tsx)). Responses are returned via `NextResponse.json`.
- **Content model (Strapi):** Page content is structured with dynamic zones and typed in [types/page.types.ts](types/page.types.ts) (e.g., `IHeroComponent`, `IActivityCategorySectionComponent`). Global UI chrome (navbar/footer) types are in [types/globalContent.types.ts](types/globalContent.types.ts). Media structures are in [types/media.types.ts](types/media.types.ts).
- **Images:** Remote images are allowed from Cloudinary per [next.config.ts](next.config.ts) (hostname `res.cloudinary.com`, path `/iwkz/**`). Use `next/image` when rendering CMS image URLs.

## Developer Workflows

- **Node & pnpm:** Requires Node `22.x` and pnpm `10.x` (see [package.json](package.json)).
- **Start dev:** `pnpm dev` (uses `next dev --turbopack`).
- **Build/Start:** `pnpm build` then `pnpm start`.
- **Lint:** `pnpm lint`.
- **Paths:** TS path alias `@/*` -> project root (see [tsconfig.json](tsconfig.json)). shadcn aliases in [components.json](components.json) (`components`, `ui`, `lib`, `utils`, `hooks`).

## UI Conventions

- **Tailwind v4:** Configured via PostCSS plugin in [postcss.config.mjs](postcss.config.mjs). Global CSS theme tokens are in [app/globals.css](app/globals.css) with light/dark variants and CSS variables.
- **Utility `cn`:** Use `cn()` from [lib/utils.ts](lib/utils.ts) with `tailwind-merge` to combine classes.
- **shadcn-style components:** Variants via `class-variance-authority` (`cva`) as in [components/ui/button.tsx](components/ui/button.tsx). Cards and primitives live in [components/ui/\*\*](components/ui).
- **Animations:** Use `framer-motion` helpers like [components/ui/fadeInScroll.tsx](components/ui/fadeInScroll.tsx) (`useInView`, `motion`). Prefer simple, performant transitions.
- **Toasts:** Wrap the app with `ToastProvider` (already done in layout). Fire notifications using `useToast().toast({ title, description, variant })` (see [components/ui/toast.tsx](components/ui/toast.tsx)).

## Data Flow Patterns

- **Home page load:** [app/page.tsx](app/page.tsx) fetches three internal endpoints in parallel (`/api/prayer-time`, `/api/pages`, `/api/global`), stores state, shows [components/loadingPage/loadingPage.tsx](components/loadingPage/loadingPage.tsx) until ready, and renders `Header`, `PrayerTimesCard`, `Hero`, `OurServices`, `ContactFooter` with typed props.
- **Prayer times:** [components/prayerTimesCard/prayerTimesCard.tsx](components/prayerTimesCard/prayerTimesCard.tsx) consumes `IPrayerTimes` ([types/prayerTimes.types.ts](types/prayerTimes.types.ts)) and uses `dayjs` + `duration` to compute current/next prayer and countdown.
- **Navbar model:** Construct derived navbar data from `IGlobalContent.data.navbar` (see manipulation in [app/page.tsx](app/page.tsx)). `Header` renders responsive desktop/mobile navigation ([components/header/header.tsx](components/header/header.tsx)).

## Extending the Project

- **Add a new API route:** Create a file under [app/api/<name>/route.tsx](app/api) exporting `GET` and proxying to `${process.env.IWKZ_API_URL}/<endpoint>` with `Authorization: Bearer ${process.env.STRAPI_API_TOKEN}`. Return `NextResponse.json(data)` and handle non-OK responses with an error status.
- **Add a typed content section:** Define interfaces in [types/\*\*](types) and consume them in client components under [components/\*\*](components). Keep props typed and derive minimal view-models when needed.
- **Create a variant component:** Use `cva` for variants and `cn` for class merging, mirroring [components/ui/button.tsx](components/ui/button.tsx). Place shared primitives in [components/ui/\*\*](components/ui).

## Environment & Integrations

- **Required env vars:** `IWKZ_API_URL`, `STRAPI_API_TOKEN`. Needed for API routes under [app/api/\*\*](app/api). In dev, add them to a local `.env` (not committed).
- **Images/CDN:** Cloudinary URLs from CMS are safe to render via `next/image` thanks to [next.config.ts](next.config.ts).

If any section feels incomplete or unclear (e.g., additional dynamic zones, more API endpoints, or deployment details), tell me what to add and I'll refine this guide.
