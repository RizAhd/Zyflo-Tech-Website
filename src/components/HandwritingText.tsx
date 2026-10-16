import { useEffect, useRef, useState } from 'react'
import pen from 'virtual:pen-paths'

import { MOTION_OK } from './motion'

/*
  Text that writes itself with a pen, then inks in.

  Adapted from the 21st.dev handwriting text. A web font renders as filled
  shapes with no outline, so there is nothing to stroke: the letters are
  traced into SVG paths. Every contour is its own path, because a dash
  pattern restarts at each subpath; staggering them is what moves the pen
  across the word. One filled copy of the whole phrase sits underneath and
  fades in as the strokes finish, so the holes in letters like "e" and "g"
  stay holes.

  Differences from the original, for this site:
    - the tracing happens at build time (vite.config.ts, `virtual:pen-paths`)
      from the hero's own Geist SemiBold, so the page ships a few kilobytes of
      path data instead of a font parser and a font file, and the pen starts
      the moment the headline appears.
    - the SVG is sized in em from the glyph box and sat on the text baseline,
      so it takes exactly the space the plain text would.
    - with motion off, or for any text that was not traced, it is plain text.
*/

export default function HandwritingText({
  text,
  duration = 1.6,
  delay = 0.35,
  strokeWidth = 1.6,
  className,
}: {
  text: string
  /** Seconds for the pen to cross the phrase. */
  duration?: number
  /** Seconds before the pen starts. */
  delay?: number
  /** Stroke weight, in units of a 100px em. */
  strokeWidth?: number
  className?: string
}) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const traced = motionOn && pen.text === text
  const [drawn, setDrawn] = useState(false)
  const [lengths, setLengths] = useState<number[]>([])
  const refs = useRef<(SVGPathElement | null)[]>([])

  useEffect(() => {
    if (!traced) return
    setLengths(refs.current.slice(0, pen.contours.length).map((el) => (el ? el.getTotalLength() : 0)))
    // Two frames: the first commits full length offsets, the second animates to zero.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setDrawn(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [traced])

  if (!traced) return <span className={className}>{text}</span>

  const { em, x, y, w, h } = pen
  const count = Math.max(1, pen.contours.length)
  // The pen line is drawn with baseline at y = em; sit that on the text baseline.
  const below = (y + h - em) / em

  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      role="img"
      aria-label={text}
      className={className}
      style={{
        display: 'inline-block',
        height: `${h / em}em`,
        width: `${w / em}em`,
        verticalAlign: `${-below}em`,
        marginInline: '-0.08em',
        overflow: 'visible',
      }}
    >
      <path
        d={pen.full}
        fill="currentColor"
        stroke="none"
        style={{
          opacity: drawn ? 1 : 0,
          transition: drawn ? `opacity 0.5s ease-out ${(delay + duration * 0.75).toFixed(3)}s` : 'none',
        }}
      />
      {pen.contours.map((d, i) => {
        const length = lengths[i] || 0
        const each = (duration / count) * 2.4
        const start = delay + (i / count) * duration
        return (
          <path
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              // Until measured, a huge dash keeps the stroke invisible rather than flashing in.
              strokeDasharray: length || 1e4,
              strokeDashoffset: drawn ? 0 : length || 1e4,
              transition: drawn ? `stroke-dashoffset ${each.toFixed(3)}s ease-out ${start.toFixed(3)}s` : 'none',
            }}
          />
        )
      })}
    </svg>
  )
}
