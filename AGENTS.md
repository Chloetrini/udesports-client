# AGENTS.md: UDESport Client

Loaded at the start of every AI session on this repo. Keep it true: update it when a convention or gotcha changes.

## What this is

The website and admin area for **UDESport**, a football scouting and player placement academy. Live: https://www.udesportsmgt.com (the apex domain redirects to `www`, which is canonical). API: [udesports-server](https://github.com/Chloetrini/udesports-server).

## Stack (do not swap without asking)

React 19 + TypeScript · Vite (React Compiler via `@rolldown/plugin-babel`) · Tailwind CSS 4 · shadcn/ui + MUI · React Router 7 (`react-router-dom`) · TanStack Query · Axios · Framer Motion · Embla Carousel · TipTap · React Helmet · react-toastify.

## Commands

```bash
npm run dev       # http://localhost:4001
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview
```

No test script. `build` and `lint` pass (lint has 2 warnings, 0 errors). Keep it that way.

## Environment

Copy `.env.example` to `.env` (git-ignored).

- `VITE_API_URL`: backend base URL including `/api`, for example `http://localhost:4200/api`. Without it the client calls `/api` on its own origin.
- The backend allows the dev origin `http://localhost:4001`. If you change the dev port, add it to `allowedOrigins` in `udesports-server/src/server.ts`.

## Layout

```
src/routes/      index.tsx (route table); main/ (public pages), admin/ (admin pages), root/ (layout)
src/services/    one file per backend resource (Players.ts, Articles.ts, Auth.ts, ...)
src/hooks/       useApi.tsx (React Query hooks for every service), getAge.tsx
src/lib/api.ts   Axios client + api.get/post/put/delete helpers
src/components/  ui/ (shadcn), universal/ (NavBar, Footer), home/, player-information/
src/contexts/    ThemeContext.tsx
src/types/       dataTypes.ts
```

## Conventions

- Imports use the `@/` alias (maps to `src/`).
- Data flow: HTTP in `src/services/*` using `api` from `src/lib/api.ts`, React Query hooks in `src/hooks/useApi.tsx`, components use the hooks. No raw Axios calls in components.
- The API replies `{ success, message, body? }` or `{ success: false, message, details? }`. `api.*` returns that envelope and throws an `Error` with the server's message.
- Updates use `PUT`, not `PATCH`. Routes are `/api/...` with no version prefix.
- File uploads: pass a `FormData` to `api.post`/`api.put`; the helper drops the JSON content-type so the browser sets the multipart boundary.
- Auth is a JWT in an httpOnly cookie, so the Axios client uses `withCredentials: true`. Never store the token in `localStorage`.
- Public pages set titles and metadata with the `seo.tsx` component, rendered by the page itself. A route's `handle.seo` is only a fallback for pages without their own `<Seo>` (currently `/unsubscribe`). Don't add both: with React 19, `react-helmet-async` renders every `<Seo>` natively and doesn't deduplicate.

## SEO rendering (`api/render.ts`)

The app is a client-rendered SPA, so crawlers and link previews (WhatsApp, X, LinkedIn) that don't run JS used to get one generic page. In production every page request goes through `api/render.ts` (a Vercel Function), which serves the built shell with route-specific `<title>`, description, canonical, Open Graph/Twitter tags, JSON-LD, and a plain-HTML copy of the page content inside `#root`, using live API data. React's `createRoot` replaces that content on load. It also serves `/sitemap.xml` from the live article list.

- `vercel.json` renames `dist/index.html` to `dist/shell.html` after the build, so `/` isn't served statically, and rewrites every non-asset path to the function. Locally, `npm run dev` and `npm run preview` behave as before, without the function.
- Server-injected head tags carry `data-ssr`; `src/main.tsx` removes them before mounting so `<Seo>` doesn't duplicate them. JSON-LD the client never renders (WebSite, BreadcrumbList) is left unmarked so Google still sees it.
- When you add or rename a public page, change its copy, or change its `<Seo>` title/description, update the matching function in `api/render.ts` too.
- `SITE_URL` lives in `src/lib/site.ts`, with copies in `api/render.ts` and `public/robots.txt`. Keep all three in sync.
- Responses are cached at Vercel's edge for 5 minutes (stale-while-revalidate), so a new article's link preview can take that long to appear.
- `public/og-image.jpg` (1200×630) is the default share image; `public/logo.png` is the Organization logo (Google needs at least 112px).

## Commits

Author every commit as `Chloetrini <trinityegbukwu1@gmail.com>`, never as "Claude" or "Claude with Trini". Set it before committing: `git config user.name "Chloetrini" && git config user.email trinityegbukwu1@gmail.com`.

## Gotchas

- `npm run build` warns about chunks over 500 kB. It is known and not a failure.
- Some files use CRLF line endings (e.g. `src/layouts/RootLayout.tsx`, `src/components/error-boundary.tsx`). Keep them as they are so diffs stay small.
- Public player lists only show **published** players. Admin lists use the `...Admin` fetchers.
- The server caches public GET responses for 60 seconds (`x-cache: HIT | MISS`). A change you just saved may take up to a minute to appear on public pages, though admin writes bump the cache version immediately.
