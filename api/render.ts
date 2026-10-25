import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Server-rendered HTML for every page request (Vercel Function).
//
// The app itself is a client-rendered SPA, so the raw HTML used to be the
// same empty shell for every URL: one generic title/description and an empty
// <div id="root">. Google eventually runs the JS, but link previews
// (WhatsApp, X, LinkedIn, Facebook, Slack) and most other crawlers never do —
// they saw the homepage tags on /news/<id> and no page content at all.
//
// vercel.json rewrites every non-asset path here. We take the built shell
// (dist/shell.html — the Vite index.html renamed at deploy so it can't be
// served for "/" directly), and for that path inject:
//   - route-specific <title>, description, canonical, Open Graph / Twitter
//     tags and JSON-LD, built from live API data (articles, players, gallery)
//   - a plain, crawlable HTML version of the page inside #root. React's
//     createRoot() replaces it as soon as the bundle runs, so visitors get the
//     normal app; before that they see readable content instead of a blank page.
// It also serves /sitemap.xml, generated from the live article list.
//
// Head tags carry data-ssr; src/main.tsx removes them just before React
// mounts, so the app's own <Seo> tags (React 19 hoists them into <head>)
// don't end up next to a second title/description/canonical.
//
// Responses are cached at Vercel's edge for a few minutes (and served stale
// while revalidating), so the API is hit at most once per path per window and
// new articles get correct previews without a redeploy.

const SITE_URL = 'https://www.udesportsmgt.com'
const SITE_NAME = 'UdeSport'
const LEGAL_NAME = 'Uche Dominic Egbukwu Sports Management Ltd'
const INSTAGRAM_URL = 'https://www.instagram.com/udesportsmanagmentltd/'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_IMAGE_ALT = 'UdeSport — We build legends, not just players.'
const API_URL = (process.env.VITE_API_URL || 'https://udesports-server.vercel.app/api').replace(/\/+$/, '')
const API_TIMEOUT_MS = 3000

const EDGE_CACHE = 'max-age=300, stale-while-revalidate=86400'

// ---------------------------------------------------------------------------
// API data (only the fields used here — see src/types/dataTypes.ts)
// ---------------------------------------------------------------------------

interface Article {
  id: string
  headline: string
  category: string
  summary: string | null
  body: string | null
  coverImage: string | null
  createdAt: string
  updatedAt: string
  author: { name: string } | null
}

interface Player {
  id: string
  playerName: string
  nationality: string | null
  position: string | null
  status: string | null
  currentClubName: string | null
  playerPhoto: string | null
}

interface GalleryItem {
  id: string
  headline: string | null
  description: string | null
  coverImage: string | null
  instaUrl: string | null
}

interface Headline {
  id: string
  category: string
  headline: string
}

// Returns null on any failure (timeout, non-2xx, bad JSON) so a slow or
// down API degrades to generic-but-valid HTML instead of an error page.
async function api<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(API_TIMEOUT_MS) })
    if (!res.ok) return null
    const json = (await res.json()) as { success?: boolean; body?: T }
    return json.success === false ? null : (json.body ?? null)
  } catch {
    return null
  }
}

const getArticles = async () => (await api<{ news: Article[] }>('/news'))?.news ?? null
const getPlayers = async () => (await api<{ players: Player[] }>('/players'))?.players ?? null
const getGallery = async () => (await api<{ items: GalleryItem[] }>('/gallery'))?.items ?? null
const getHeadlines = async () => (await api<{ headlines: Headline[] }>('/headlines'))?.headlines ?? null

// undefined = API unreachable (don't claim 404), null = genuinely not found.
async function getArticle(id: string): Promise<Article | null | undefined> {
  try {
    const res = await fetch(`${API_URL}/news/${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok) return undefined
    const json = (await res.json()) as { body?: { news?: Article } }
    return json.body?.news ?? null
  } catch {
    return undefined
  }
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&')
}

// Article bodies are rich text (TipTap HTML) written in the admin. Rather than
// trust and re-emit that markup, reduce it to plain paragraphs.
function htmlToParagraphs(html: string): string[] {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
  return decodeEntities(text)
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

// Meta descriptions get cut off around 155–160 characters in search results.
function truncate(value: string, max = 158): string {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`
}

function titleCase(value: string): string {
  return value.toLowerCase().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase())
}

// Lagos time, so dates match what the site shows Nigerian visitors.
function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' })
}

// Same idea as optimizeImageUrl() in src/lib/utils.ts, but for share
// previews: a fixed 1200×630 crop (the size every platform renders) as JPEG,
// since some scrapers reject WebP/AVIF and WhatsApp drops large images.
// Returns null for non-Cloudinary URLs, whose size we can't control.
function socialImage(url: string | null | undefined): string | null {
  const marker = '/upload/'
  const i = url ? url.indexOf(marker) : -1
  if (!url || !url.includes('res.cloudinary.com') || i === -1) return null
  const at = i + marker.length
  return `${url.slice(0, at)}c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/${url.slice(at)}`
}

// In-page images: resized, auto-format (mirrors optimizeImageUrl).
function contentImage(url: string, width = 1200): string {
  const marker = '/upload/'
  const i = url.indexOf(marker)
  if (!url.includes('res.cloudinary.com') || i === -1) return url
  const at = i + marker.length
  return `${url.slice(0, at)}w_${width},c_limit,q_auto,f_auto/${url.slice(at)}`
}

// Types the client renders itself (OrganizationSchema, the full-news page),
// so the server copy is marked for removal. Others (WebSite, BreadcrumbList)
// exist only here and must stay in the DOM — Google reads structured data
// from the rendered page.
const CLIENT_RENDERED_JSON_LD = new Set(['SportsOrganization', 'NewsArticle'])

// JSON inside <script> must not be able to close the tag.
function jsonLdScript(data: object): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  const type = (data as { '@type'?: string })['@type'] ?? ''
  return `<script${CLIENT_RENDERED_JSON_LD.has(type) ? ' data-ssr' : ''} type="application/ld+json">${json}</script>`
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

interface Page {
  status: number
  // Without the " | UdeSport" suffix — same convention as src/components/seo.tsx.
  title: string
  description: string
  path: string
  // Share image; must be 1200×630 (see socialImage). Defaults to og-image.jpg.
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  jsonLd?: object[]
  // HTML for inside <main>; empty for admin pages.
  content: string
}

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/players', label: 'Players' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact Us' },
]

const CONTACT = {
  address: '119, Jimoh Cliff Street, Lekki, Lagos, Nigeria',
  phones: ['+234 818 703 8043', '+234 803 916 692', '+234 805 534 0408', '+44 7031 885358'],
  emails: ['info@dominicegbukwusoccerafrica.com', 'soccerafrica2000@yahoo.com'],
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: LEGAL_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: DEFAULT_IMAGE,
  description:
    "Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa.",
  foundingDate: '1998',
  sameAs: [INSTAGRAM_URL],
  sport: 'Association football',
  email: CONTACT.emails[0],
  telephone: CONTACT.phones[0].replace(/\s/g, ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: '119 Jimoh Cliff Street, Lekki',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
}

function breadcrumb(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

function articleCard(article: Article): string {
  const date = formatDate(article.createdAt)
  return `<article>
<h3><a href="/news/${esc(article.id)}">${esc(article.headline)}</a></h3>
<p class="ssr-meta">${esc(titleCase(article.category))}${date ? ` · <time datetime="${esc(article.createdAt)}">${esc(date)}</time>` : ''}</p>
${article.summary ? `<p>${esc(article.summary)}</p>` : ''}
</article>`
}

function playerItem(player: Player): string {
  const details = [
    player.position,
    player.nationality,
    player.currentClubName ? `Club: ${player.currentClubName}` : null,
    player.status ? titleCase(player.status) : null,
  ].filter(Boolean) as string[]
  return `<li><strong>${esc(player.playerName)}</strong>${details.length ? ` — ${esc(details.join(' · '))}` : ''}</li>`
}

async function homePage(): Promise<Page> {
  const [headlines, players, articles] = await Promise.all([getHeadlines(), getPlayers(), getArticles()])
  return {
    status: 200,
    path: '/',
    title: 'Football Scouting, Player Management & Placement',
    description:
      "UdeSport is Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa.",
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
    content: `<section>
<h1>We Build Legends. Not Just Players.</h1>
<p>From Nigeria to the world's biggest stadiums. UdeSport has placed 100+ players at elite clubs across Europe, Asia, and Africa.</p>
<ul class="ssr-stats"><li><strong>100+</strong> transfers</li><li><strong>15+</strong> countries</li><li><strong>25</strong> years of experience</li></ul>
<p><a href="/players">View players</a> · <a href="/about">Our story</a></p>
</section>
${headlines?.length ? `<section><h2>Latest transfers &amp; announcements</h2><ul>${headlines.map((h) => `<li><strong>${esc(titleCase(h.category))}:</strong> ${esc(h.headline)}</li>`).join('')}</ul></section>` : ''}
${players?.length ? `<section><h2>Featured players</h2><p>Every player on this roster has been developed, tested, and proven.</p><ul>${players.slice(0, 8).map(playerItem).join('')}</ul><p><a href="/players">View all players</a></p></section>` : ''}
${articles?.length ? `<section><h2>Latest news</h2>${articles.slice(0, 3).map(articleCard).join('')}<p><a href="/news">All news</a></p></section>` : ''}`,
  }
}

function aboutPage(): Page {
  return {
    status: 200,
    path: '/about',
    title: 'About Us',
    description:
      'Meet the team behind UdeSport and see our track record of verified player placements at professional clubs across Europe, Asia, and Africa.',
    jsonLd: [breadcrumb([{ name: 'About', path: '/about' }])],
    content: `<section>
<p class="ssr-meta">Est. 1998</p>
<h1>About UdeSport</h1>
<p>Nigeria's most prolific football management and development academy. From grassroots to global stages. ${esc(LEGAL_NAME)} is registered with the Corporate Affairs Commission, Federal Republic of Nigeria (CAC) RC 788922.</p>
<h2>Who are we?</h2>
<p>UdeSport Management Limited is a licensed football scouting and player placement organisation founded by Dominic Egbukwu. Headquartered in Nigeria, we have operated for over 25 years identifying, assessing, and placing West African talent at professional clubs across Europe, Asia, and Africa.</p>
<p>Our scouting methodology is built on systematic player evaluation — technical ability, physical profile, positional intelligence, mental resilience, and long-term development potential. Every player in our database has been assessed against professional standards before any club recommendation is made.</p>
<p>Our placement record speaks directly to the quality of our scouting process. 38+ verified placements at the highest levels of the game, including Vincent Enyeama, Kelechi Iheanacho, Victor Osimhen, Ogenyi Onazi, and Kenneth Omeruo.</p>
<h2>What we do</h2>
<p>UdeSport operates across three scouting divisions: Talent Identification (ages 15–23), Player Assessment and Recommendation, and International Club Placement.</p>
<p>Our scouting coverage spans three active centres — Lagos, Abuja, and Port Harcourt — running structured observation programmes across the U-17, U-20, and U-23 age categories.</p>
<p>We maintain established working relationships with club scouts, technical directors, and recruitment departments across the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and leagues across Asia and the Middle East.</p>
</section>`,
  }
}

function contactPage(): Page {
  return {
    status: 200,
    path: '/contact',
    title: 'Contact Us',
    description:
      'Get in touch with UdeSport — Lekki, Lagos. Reach out for scouting inquiries, player placements, or partnership opportunities.',
    jsonLd: [breadcrumb([{ name: 'Contact', path: '/contact' }])],
    content: `<section>
<h1>Contact UdeSport</h1>
<p>Scouting inquiries, player placements, or partnership opportunities — get in touch.</p>
<h2>Office</h2>
<address>${esc(CONTACT.address)}</address>
<h2>Phone</h2>
<ul>${CONTACT.phones.map((p) => `<li><a href="tel:${esc(p.replace(/\s/g, ''))}">${esc(p)}</a></li>`).join('')}</ul>
<h2>Email</h2>
<ul>${CONTACT.emails.map((e) => `<li><a href="mailto:${esc(e)}">${esc(e)}</a></li>`).join('')}</ul>
</section>`,
  }
}

async function playersPage(): Promise<Page> {
  const players = await getPlayers()
  return {
    status: 200,
    path: '/players',
    title: 'Player Roster',
    description:
      "Browse UdeSport's full roster of scouted and placed footballers — filter by age group, status, and position.",
    jsonLd: [breadcrumb([{ name: 'Players', path: '/players' }])],
    content: `<section>
<h1>Player Roster</h1>
<p>UdeSport's roster of scouted, developed, and placed footballers.</p>
${players?.length ? `<ul>${players.map(playerItem).join('')}</ul>` : ''}
</section>`,
  }
}

async function newsPage(): Promise<Page> {
  const articles = await getArticles()
  return {
    status: 200,
    path: '/news',
    title: 'News & Transfers',
    description:
      "The latest transfer news, academy updates, and milestones from UdeSport's roster of placed players.",
    jsonLd: [breadcrumb([{ name: 'News', path: '/news' }])],
    content: `<section>
<h1>News &amp; Transfers</h1>
${articles?.length ? articles.map(articleCard).join('') : '<p>Transfer updates, trials, and academy news from UdeSport.</p>'}
</section>`,
  }
}

async function articlePage(id: string): Promise<Page> {
  const article = await getArticle(id)
  const path = `/news/${id}`
  if (article === undefined) {
    // API unreachable — serve generic tags rather than a false 404.
    return {
      status: 200,
      path,
      title: 'News',
      description: 'Full article — UdeSport News & Transfers.',
      content: '<section><h1>UdeSport News</h1><p><a href="/news">Browse all news</a></p></section>',
    }
  }
  if (article === null) return notFoundPage(path)

  const paragraphs = article.body ? htmlToParagraphs(article.body) : []
  const description = truncate(article.summary || paragraphs[0] || 'Full article — UdeSport News & Transfers.')
  const date = formatDate(article.createdAt)
  const author = article.author?.name
  return {
    status: 200,
    path,
    type: 'article',
    title: article.headline,
    description,
    image: socialImage(article.coverImage) ?? undefined,
    imageAlt: article.headline,
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.headline.slice(0, 110),
        description,
        image: [socialImage(article.coverImage) ?? DEFAULT_IMAGE],
        datePublished: article.createdAt,
        dateModified: article.updatedAt,
        author: author ? { '@type': 'Person', name: author } : { '@id': `${SITE_URL}/#organization` },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      },
      breadcrumb([
        { name: 'News', path: '/news' },
        { name: article.headline, path },
      ]),
    ],
    content: `<article>
<p class="ssr-meta"><a href="/news">News</a> · ${esc(titleCase(article.category))}</p>
<h1>${esc(article.headline)}</h1>
<p class="ssr-meta">${author ? `By ${esc(author)}` : ''}${author && date ? ' · ' : ''}${date ? `<time datetime="${esc(article.createdAt)}">${esc(date)}</time>` : ''}</p>
${article.coverImage ? `<img src="${esc(contentImage(article.coverImage))}" alt="${esc(article.headline)}">` : ''}
${article.summary ? `<p><strong>${esc(article.summary)}</strong></p>` : ''}
${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
</article>`,
  }
}

async function galleryPage(): Promise<Page> {
  const items = await getGallery()
  return {
    status: 200,
    path: '/gallery',
    title: 'Gallery',
    description: "Photos and videos from UdeSport's academy sessions, trials, and player placements.",
    image: socialImage(items?.find((item) => item.coverImage)?.coverImage) ?? undefined,
    jsonLd: [breadcrumb([{ name: 'Gallery', path: '/gallery' }])],
    content: `<section>
<h1>Gallery</h1>
<p>Photos from UdeSport's academy sessions, trials, and player placements.</p>
${(items ?? [])
  .map(
    (item) => `<figure>
${item.coverImage ? `<img src="${esc(contentImage(item.coverImage, 800))}" alt=""${esc(item.headline ?? 'UdeSport gallery photo')}" loading="lazy">` : ''}
<figcaption>${item.headline ? `<strong>${esc(item.headline)}</strong> ` : ''}${item.description ? esc(item.description) : ''}${item.instaUrl ? ` <a href="${esc(item.instaUrl)}" rel="noopener">View on Instagram</a>` : ''}</figcaption>
</figure>`,
  )
  .join('\n')}
</section>`,
  }
}

function unsubscribePage(): Page {
  return {
    status: 200,
    path: '/unsubscribe',
    title: 'Unsubscribe',
    description: 'Unsubscribe from UdeSport newsletter emails.',
    noIndex: true,
    content: '<section><h1>Unsubscribe</h1><p>Manage your UdeSport newsletter subscription.</p></section>',
  }
}

function adminPage(path: string): Page {
  return { status: 200, path, title: 'Admin', description: '', noIndex: true, content: '' }
}

function notFoundPage(path: string): Page {
  return {
    status: 404,
    path,
    title: 'Page not found',
    description: "The page you're looking for doesn't exist or has moved.",
    noIndex: true,
    content: '<section><h1>Page not found</h1><p>The page you\'re looking for doesn\'t exist or has moved. <a href="/">Go to the homepage</a>.</p></section>',
  }
}

async function resolvePage(path: string): Promise<Page> {
  if (path === '/') return homePage()
  if (path === '/admin' || path.startsWith('/admin/')) return adminPage(path)
  const article = /^\/news\/([^/]+)$/.exec(path)
  if (article) return articlePage(decodeURIComponent(article[1]))
  switch (path) {
    case '/about': return aboutPage()
    case '/contact': return contactPage()
    case '/players': return playersPage()
    case '/news': return newsPage()
    case '/gallery': return galleryPage()
    case '/unsubscribe': return unsubscribePage()
    default: return notFoundPage(path)
  }
}

// ---------------------------------------------------------------------------
// HTML assembly
// ---------------------------------------------------------------------------

// Minimal styling for the pre-JS content, scoped to .ssr so it can't leak into
// the app. Matches the site's palette and fonts closely enough that the brief
// moment before React mounts doesn't look broken.
const SSR_STYLE = `<style data-ssr-style>
.ssr{--bg:#fff;--fg:#060A0F;--muted:#68717D;--accent:#00A553;min-height:100vh;background:var(--bg);color:var(--fg);font:16px/1.6 Manrope,system-ui,sans-serif}
@media (prefers-color-scheme:dark){.ssr{--bg:#000;--fg:#fff;--muted:#9AA3AE;--accent:#00D46A}}
.ssr a{color:var(--accent)}
.ssr header,.ssr main,.ssr footer{max-width:1100px;margin:0 auto;padding:20px}
.ssr header{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:space-between}
.ssr header nav{display:flex;flex-wrap:wrap;gap:8px 20px}
.ssr header nav a{color:inherit;text-decoration:none}
.ssr .ssr-brand{font:28px/1 'Bebas Neue',sans-serif;color:var(--accent);text-decoration:none}
.ssr h1,.ssr h2,.ssr h3{font-family:'Bebas Neue',sans-serif;font-weight:400;line-height:1.1;margin:1.2em 0 .4em}
.ssr h1{font-size:clamp(40px,6vw,64px)}.ssr h2{font-size:32px}.ssr h3{font-size:24px}
.ssr p,.ssr li,.ssr address{max-width:70ch;color:var(--muted);font-style:normal}
.ssr .ssr-meta{font-size:14px}
.ssr .ssr-stats{display:flex;flex-wrap:wrap;gap:24px;list-style:none;padding:0}
.ssr img{display:block;max-width:100%;height:auto;max-height:420px;object-fit:cover;border-radius:16px}
.ssr figure{margin:24px 0}
.ssr footer{border-top:1px solid rgba(128,128,128,.25);font-size:14px;color:var(--muted)}
</style>`

function headTags(page: Page): string {
  const title = `${page.title} | ${SITE_NAME}`
  const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`
  const image = page.image ?? DEFAULT_IMAGE
  const imageAlt = page.image ? (page.imageAlt ?? page.title) : DEFAULT_IMAGE_ALT
  const tag = (attr: 'name' | 'property', key: string, value: string) =>
    `<meta data-ssr ${attr}="${key}" content="${esc(value)}" />`

  const tags = [
    `<title data-ssr>${esc(title)}</title>`,
    page.description ? tag('name', 'description', page.description) : '',
    tag('name', 'robots', page.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),
    page.noIndex ? '' : `<link data-ssr rel="canonical" href="${esc(url)}" />`,
    tag('property', 'og:type', page.type ?? 'website'),
    tag('property', 'og:site_name', SITE_NAME),
    tag('property', 'og:locale', 'en_GB'),
    tag('property', 'og:title', title),
    page.description ? tag('property', 'og:description', page.description) : '',
    tag('property', 'og:url', url),
    tag('property', 'og:image', image),
    tag('property', 'og:image:alt', imageAlt),
    tag('property', 'og:image:width', '1200'),
    tag('property', 'og:image:height', '630'),
    page.publishedTime ? tag('property', 'article:published_time', page.publishedTime) : '',
    page.modifiedTime ? tag('property', 'article:modified_time', page.modifiedTime) : '',
    tag('name', 'twitter:card', 'summary_large_image'),
    tag('name', 'twitter:title', title),
    page.description ? tag('name', 'twitter:description', page.description) : '',
    tag('name', 'twitter:image', image),
    tag('name', 'twitter:image:alt', imageAlt),
    page.noIndex ? '' : jsonLdScript(ORGANIZATION_JSON_LD),
    ...(page.jsonLd ?? []).map(jsonLdScript),
    page.content ? SSR_STYLE : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

function bodyContent(page: Page): string {
  if (!page.content) return ''
  return `<div class="ssr">
<header><a class="ssr-brand" href="/">UdeSport</a><nav aria-label="Main">${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join('')}</nav></header>
<main>${page.content}</main>
<footer><p>© ${new Date().getUTCFullYear()} ${esc(LEGAL_NAME)} · ${esc(CONTACT.address)} · <a href="mailto:${esc(CONTACT.emails[0])}">${esc(CONTACT.emails[0])}</a> · <a href="${INSTAGRAM_URL}" rel="noopener">Instagram</a></p></footer>
</div>`
}

const HEAD_START = '<!--app-head:start-->'
const HEAD_END = '<!--app-head:end-->'

function renderHtml(shell: string, page: Page): string {
  let html = shell
  const start = html.indexOf(HEAD_START)
  const end = html.indexOf(HEAD_END)
  if (start !== -1 && end > start) {
    html = html.slice(0, start) + headTags(page) + html.slice(end + HEAD_END.length)
  } else {
    // Older shell without markers: drop its title and append ours.
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace('</head>', `${headTags(page)}\n  </head>`)
  }
  return html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${bodyContent(page)}</div>`)
}

// ---------------------------------------------------------------------------
// Shell loading
// ---------------------------------------------------------------------------

let cachedShell: string | null = null

// dist/shell.html is bundled with the function (vercel.json includeFiles).
// If it isn't there for any reason, fetch the static copy from this same
// deployment instead.
async function loadShell(origin: string): Promise<string> {
  if (cachedShell) return cachedShell
  try {
    cachedShell = readFileSync(join(process.cwd(), 'dist', 'shell.html'), 'utf8')
    return cachedShell
  } catch {
    // fall through
  }
  const headers: Record<string, string> = {}
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  }
  const res = await fetch(`${origin}/shell.html`, { headers, signal: AbortSignal.timeout(API_TIMEOUT_MS) })
  if (!res.ok) throw new Error(`shell.html: HTTP ${res.status}`)
  cachedShell = await res.text()
  return cachedShell
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

async function sitemap(): Promise<string> {
  const articles = (await getArticles()) ?? []
  const latest = articles.map((a) => a.updatedAt).sort().at(-1)
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: latest },
    { loc: '/about' },
    { loc: '/players' },
    { loc: '/news', lastmod: latest },
    { loc: '/gallery' },
    { loc: '/contact' },
    ...articles.map((a) => ({ loc: `/news/${encodeURIComponent(a.id)}`, lastmod: a.updatedAt })),
  ]
  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${esc(`${SITE_URL}${u.loc}`)}</loc>${u.lastmod ? `\n    <lastmod>${esc(u.lastmod)}</lastmod>` : ''}\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

function normalisePath(raw: string | null): string {
  let path = raw || '/'
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/{2,}/g, '/')
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  // vercel.json passes the original path as ?__path=; the rest of the query
  // string is the visitor's own and doesn't affect what we render.
  const path = normalisePath(url.searchParams.get('__path'))

  if (path === '/sitemap.xml') {
    return new Response(await sitemap(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Vercel-CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=86400',
      },
    })
  }

  const [shell, page] = await Promise.all([loadShell(url.origin), resolvePage(path)])
  const headers: Record<string, string> = {
    'Content-Type': 'text/html; charset=utf-8',
    // Browsers always revalidate (so a new deploy shows up immediately);
    // Vercel's edge cache absorbs the traffic.
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Vercel-CDN-Cache-Control': page.status === 200 ? EDGE_CACHE : 'max-age=60',
  }
  if (page.noIndex) headers['X-Robots-Tag'] = 'noindex, nofollow'
  return new Response(renderHtml(shell, page), { status: page.status, headers })
}

export const HEAD = GET
