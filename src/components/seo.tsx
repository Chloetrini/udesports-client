import { Helmet } from 'react-helmet-async'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

// A JSON-LD structured data object (schema.org). Keeping this as a loose
// record rather than typing out every schema.org shape — callers build a
// real object (Organization, NewsArticle, etc.) and pass it straight
// through to the <script type="application/ld+json"> tag.
export type JsonLd = Record<string, unknown>

export interface SeoHandle {
  seo?: {
    title: string
    description?: string
    image?: string
    url?: string
    // Admin/auth pages set this so search engines never index them — there's
    // no value in "UdeSport Admin Dashboard" showing up in someone's search
    // results, and it can hint at URL structure that's better left private.
    noIndex?: boolean
    jsonLd?: JsonLd | JsonLd[]
  }
}

interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
  jsonLd?: JsonLd | JsonLd[]
}

const SITE_NAME = 'UdeSport'

export function Seo({ title, description, image, url, noIndex, jsonLd }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  // Canonical/og:url: use an explicit `url` when the route passes one,
  // otherwise the current path on the canonical domain — never
  // window.location.href, which would carry query strings, #hashes, and
  // preview/apex hostnames into the canonical link. Must match what
  // api/render.ts emits server-side.
  const canonicalUrl =
    url ?? (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname.replace(/(.)\/+$/, '$1')}` : undefined)
  const ogImage = image ?? DEFAULT_OG_IMAGE

  const jsonLdBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {canonicalUrl && !noIndex && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      {!image && <meta property="og:image:width" content="1200" />}
      {!image && <meta property="og:image:height" content="630" />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
