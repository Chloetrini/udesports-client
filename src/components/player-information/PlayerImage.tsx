import { useState } from 'react'

type PlayerImageProps = {
  src: string
  alt: string
  className: string
  // Class(es) for the pulsing placeholder shown while the image loads —
  // usually just the size/position classes without object-fit, since the
  // placeholder is a plain block, not an <img>.
  skeletonClassName?: string
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
const PlayerImage = ({ src, alt, className, skeletonClassName }: PlayerImageProps) => {
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
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} ${loaded ? '' : 'hidden'}`}
      />
    </>
  )
}

export default PlayerImage
