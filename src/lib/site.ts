// Single source of truth for the site's public URL — used by canonical
// links, JSON-LD, and anywhere else an absolute URL is needed. The apex
// domain (udesportsmgt.com) 308-redirects to www, so www is canonical.
// api/render.ts and public/robots.txt hardcode the same value.
export const SITE_URL = 'https://www.udesportsmgt.com'

// Default social preview image (1200×630) for pages without their own.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

// Official profiles and primary contact details (same as the Contact page).
// INSTAGRAM_URL also feeds the Organization JSON-LD `sameAs`, which is how
// Google links the profile to UdeSport in search results.
export const INSTAGRAM_URL = 'https://www.instagram.com/udesportsmanagmentltd/'
export const CONTACT_EMAIL = 'info@dominicegbukwusoccerafrica.com'
export const CONTACT_PHONE = '+2348187038043'
