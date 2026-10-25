import { Helmet } from 'react-helmet-async'
import { CONTACT_EMAIL, CONTACT_PHONE, DEFAULT_OG_IMAGE, INSTAGRAM_URL, SITE_URL } from '@/lib/site'

// Site-wide Organization structured data (schema.org) — rendered once from
// RootLayout so it's present on every page, independent of whatever
// page-specific JSON-LD (if any) a route's own <Seo jsonLd={...}> adds.
// This is what lets Google show a knowledge-panel-style result (logo, name)
// for "UdeSport" searches, and it's built only from facts already stated
// elsewhere in the app (About page copy, footer) plus the official
// Instagram profile. Keep in sync with ORGANIZATION_JSON_LD in api/render.ts.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: 'UdeSport',
  alternateName: 'Uche Dominic Egbukwu Sports Management Ltd',
  url: `${SITE_URL}/`,
  // public/logo.png — the in-app nav logo is 35×49, below Google's 112px
  // minimum for organization logos.
  logo: `${SITE_URL}/logo.png`,
  description:
    "Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa.",
  foundingDate: '1998',
  sameAs: [INSTAGRAM_URL],
  image: DEFAULT_OG_IMAGE,
  sport: 'Association football',
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '119 Jimoh Cliff Street, Lekki',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
}

export default function OrganizationSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
    </Helmet>
  )
}
