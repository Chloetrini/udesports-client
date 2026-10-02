# AGENTS.md: UDESport Client

Loaded at the start of every AI session on this repo. Keep it true: update it when a convention or gotcha changes.

## What this is

The website and admin area for **UDESport**, a football scouting and player placement academy. Live: https://udesportsmgt.com. API: [udesports-server](https://github.com/Chloetrini/udesports-server).

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
- Public pages set titles and metadata with the `seo.tsx` component.

## Commits

Author every commit as `Chloetrini <trinityegbukwu1@gmail.com>`, never as "Claude" or "Claude with Trini". Set it before committing: `git config user.name "Chloetrini" && git config user.email trinityegbukwu1@gmail.com`.

## Gotchas

- `npm run build` warns about chunks over 500 kB. It is known and not a failure.
- Public player lists only show **published** players. Admin lists use the `...Admin` fetchers.
- The server caches public GET responses for 60 seconds (`x-cache: HIT | MISS`). A change you just saved may take up to a minute to appear on public pages, though admin writes bump the cache version immediately.
