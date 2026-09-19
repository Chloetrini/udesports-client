import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type MarqueeStatProps = {
  value: string | number
  className?: string
}

// Wraps a short stat value (a stat number, or a free-text field like
// playerAppearance that can hold "380+") for the narrow fixed-width stat
// columns on player cards. At the huge font size those columns use, a
// 3-4 character value can be wider than the column itself — previously
// that just got clipped by the column's overflow-hidden. This measures
// the rendered text against its box and, only when it's actually too wide,
// bounces it left and right (like a long track title in a music player)
// instead of letting it get cut off.
export function MarqueeStat({ value, className }: MarqueeStatProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current
    if (!container || !textEl) return

    const measure = () => {
      const overflow = textEl.scrollWidth - container.clientWidth
      setDistance(overflow > 1 ? overflow : 0)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(textEl)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={containerRef} className={cn('inline-flex max-w-full overflow-hidden', className)}>
      <span
        ref={textRef}
        className={cn('inline-block whitespace-nowrap', distance > 0 && 'animate-marquee-bounce')}
        style={distance > 0 ? ({ '--marquee-distance': `-${distance}px` } as React.CSSProperties) : undefined}
      >
        {value}
      </span>
    </span>
  )
}
