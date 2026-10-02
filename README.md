# UDESport Client

Website and admin area for **UDESport**, a football scouting and player placement academy. Built solo for a client.

**Live:** https://udesportsmgt.com
**API:** [udesports-server](https://github.com/Chloetrini/udesports-server)

## What's in it

**Public site**
- Player profiles with search and filtering, and a player detail view
- News articles, gallery, awards, testimonials and a newsletter sign-up
- Skeleton loading states and responsive layouts
- Page titles, metadata and organization schema for SEO (React Helmet)

**Admin area** (login required)
- Add, edit and bulk-import players (CSV)
- Manage news, gallery, staff, awards, testimonials and headlines
- Quick updates and notifications
- Invite other admins and set their roles

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · MUI · shadcn/ui · React Router · TanStack Query · Framer Motion · Embla Carousel · TipTap editor · Axios

## Run it locally

Requires Node 20.19+ (or 22.12+) and the [backend](https://github.com/Chloetrini/udesports-server) running (it listens on `http://localhost:4200` by default).

```bash
git clone https://github.com/Chloetrini/udesports-client.git
cd udesports-client
npm install
cp .env.example .env     # then set VITE_API_URL
npm run dev              # http://localhost:4001
```

`VITE_API_URL` is the backend address including `/api`, for example `http://localhost:4200/api`.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 4001 |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project structure

```
src/routes/      pages: main/ (public) and admin/
src/services/    one file per backend resource
src/hooks/       React Query hooks
src/components/  UI, layout, home and player components
src/lib/         API client and helpers
```

Conventions for contributors and AI assistants are in [AGENTS.md](AGENTS.md).
