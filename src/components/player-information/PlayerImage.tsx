import { useState } from 'react'
import { optimizeImageUrl } from '@/lib/utils'

type PlayerImageProps = {
  src: string
  alt: string
  className: string
  // Class(es) for the pulsing placeholder shown while the image loads —
  // usually just the size/position classes without object-fit, since the
  // placeholder is a plain block, not an <img>.
  skeletonClassName?: string
  // Pixel width to request from Cloudinary (roughly 2x the on-screen size
  // covers retina without downloading a full-resolution original). Defaults
  // to a sensible card-sized value.
  width?: number
}

// Wraps a player photo with a pulsing placeholder that shows until the
// image has actually finished loading, instead of a blank gap or a pop-in.
// Each instance tracks its own loaded state, so this is safe to use inside
// a list of many cards.
//
// If the image fails to load (broken URL, blocked host, network error) we
// stop the pulsing and fall back to a plain static placeholder — otherwise
// a single bad image would pulse forever and look indistinguishable from
// "no image is showing".
//
// IMPORTANT: the <img> is hidden via opacity, not `display:none`/`hidden`.
// Native `loading="lazy"` never fetches an image that isn't part of the
// rendered layout (display:none has no box to intersect the viewport with),
// so hiding it that way created a deadlock — the image stayed hidden until
// it loaded, but could never load while it was hidden. Opacity keeps it in
// the layout (so the browser actually requests it) while still keeping it
// invisible until it's ready.
const PlayerImage = ({ src, alt, className, skeletonClassName, width = 500 }: PlayerImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={`${skeletonClassName ?? className} bg-gray-200 dark:bg-white/10`} />
  }

  return (
    <>
      {!loaded && (
        <div className={`${skeletonClassName ?? className} bg-gray-200 dark:bg-white/10 animate-pulse`} />
      )}
      <img
        src={optimizeImageUrl(src, width)}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}

export default PlayerImage
