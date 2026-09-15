import { Helmet } from 'react-helmet-async'
import logo from '@/assets/logo.png'
import { SITE_URL } from '@/lib/site'

// Site-wide Organization structured data (schema.org) — rendered once from
// RootLayout so it's present on every page, independent of whatever
// page-specific JSON-LD (if any) a route's own <Seo jsonLd={...}> adds.
// This is what lets Google show a knowledge-panel-style result (logo, name)
// for "UdeSport" searches, and it's built only from facts already stated
// elsewhere in the app (About page copy, footer) — no fabricated fields
// like sameAs social links, since those aren't wired to real profiles yet.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'UdeSport',
  alternateName: 'Uche Dominic Egbukwu Sports Management Ltd',
  url: SITE_URL,
  logo: `${SITE_URL}${logo}`,
  description:
    "Nigeria's most prolific football scouting and player placement academy — 38+ verified placements at professional clubs across Europe, Asia, and Africa.",
  foundingDate: '1998',
  address: {
    '@type': 'PostalAddress',
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
