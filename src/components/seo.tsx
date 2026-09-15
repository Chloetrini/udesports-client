import { Helmet } from 'react-helmet-async'

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
  // otherwise fall back to the page's own current address so every route
  // gets a correct canonical link without having to hardcode one per route.
  const canonicalUrl = url ?? (typeof window !== 'undefined' ? window.location.href : undefined)

  const jsonLdBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
