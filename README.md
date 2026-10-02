# UDESport Client

Website for **UDESport**, a football scouting and player placement academy. Built solo for a client.

**Live:** https://udesportsmgt.com
**API:** [udesports-server](https://github.com/Chloetrini/udesports-server)

## What's in it

- Player profiles with search and filtering
- Player detail view
- Skeleton loading states and responsive layouts
- Gallery, news, testimonials and a newsletter sign-up
- Admin area: add players, bulk CSV import, quick updates, notifications
- Page titles, metadata and organization schema for SEO (React Helmet)

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · MUI · shadcn/ui · React Router · TanStack Query · Framer Motion · Embla Carousel · TipTap editor · Axios

## Run it locally

Requires Node 20.19+ (or 22.12+) and the [backend](https://github.com/Chloetrini/udesports-server) running.

```bash
git clone https://github.com/Chloetrini/udesports-client.git
cd udesports-client
npm install
```

Create a `.env` file with the API URL:

```
VITE_API_URL=https://your-api-url
```

Then:

```bash
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run lint      # run ESLint
npm run preview   # preview the production build
```
