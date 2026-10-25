import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// The HTML arrives with per-route SEO tags (api/render.ts, or index.html's
// defaults) for crawlers and link previews that don't run JS. Once the app
// runs, <Seo> renders its own, so drop these first to avoid two titles,
// descriptions, canonicals, etc. in <head>.
document.head.querySelectorAll('[data-ssr]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>,
)
