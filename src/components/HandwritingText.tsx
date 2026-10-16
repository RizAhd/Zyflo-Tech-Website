import { useEffect, useRef, useState } from 'react'
import type { Font } from 'opentype.js'

import { MOTION_OK } from './motion'

/*
  Text that writes itself with a pen, then inks in.

  Adapted from the 21st.dev handwriting text. A web font renders as filled
  shapes with no outline, so there is nothing to stroke: the font is parsed
  from its TTF (opentype.js) and each letter turned into SVG paths. Every
  contour is its own path, because a dash pattern restarts at each subpath;
  staggering them is what moves the pen across the word. One filled copy of
  the whole phrase sits underneath and fades in as the strokes finish, so the
  holes in letters like "e" and "g" stay holes.

  Differences from the original, for this site:
    - opentype.js is bundled (a lazy chunk), not loaded from a CDN, and the font
      is the hero's own Instrument Sans SemiBold, self hosted, so the written
      line is the same text in the same face as the line above it.
    - the SVG is sized in em from the glyph box and sat on the text baseline,
      so it takes exactly the space the plain text would.
    - until the font is parsed the text holds its space invisibly (no flash of
      plain text that then vanishes), and if parsing fails or takes too long
      the plain text simply appears.
    - with motion off it is plain text.
*/

const FONT_URL = `${import.meta.env.BASE_URL}fonts/instrument-sans-600.ttf`
const EM = 100

let fontPromise: Promise<Font> | null = null
function loadFont(): Promise<Font> {
  if (!fontPromise) {
    fontPromise = Promise.all([
      import('opentype.js'),
      fetch(FONT_URL).then((res) => {
        if (!res.ok) throw new Error(`font ${res.status}`)
        return res.arrayBuffer()
      }),
    ]).then(([mod, buffer]) => {
      const lib = (mod as unknown as { parse?: typeof import('opentype.js').parse; default?: { parse: typeof import('opentype.js').parse } })
      const parse = lib.parse ?? lib.default!.parse
      return parse(buffer)
    })
  }
  return fontPromise
}

type Geometry = { full: string; contours: string[]; x: number; y: number; w: number; h: number }

export default function HandwritingText({
  text,
  duration = 1.6,
  delay = 0.35,
  strokeWidth = 1.6,
  letterSpacing = -0.025,
  className,
}: {
  text: string
  /** Seconds for the pen to cross the phrase. */
  duration?: number
  /** Seconds before the pen starts. */
  delay?: number
  /** Stroke weight, in units of a 100px em. */
  strokeWidth?: number
  /** In em, to match the heading's tracking. */
  letterSpacing?: number
  className?: string
}) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [geom, setGeom] = useState<Geometry | null>(null)
  const [failed, setFailed] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [lengths, setLengths] = useState<number[]>([])
  const refs = useRef<(SVGPathElement | null)[]>([])

  useEffect(() => {
    if (!motionOn) return
    let cancelled = false
    // Never leave the line blank: if the font is slow, show the text.
    const giveUp = window.setTimeout(() => !cancelled && setFailed(true), 3000)
    loadFont()
      .then((font) => {
        if (cancelled) return
        const path = font.getPath(text, 0, EM, EM, { letterSpacing })
        const box = path.getBoundingBox()
        const pad = EM * 0.08
        const full = path.toPathData(2)
        window.clearTimeout(giveUp)
        setGeom({
          full,
          contours: full.split(/(?=M)/).filter((d) => d.trim().length > 1),
          x: box.x1 - pad,
          y: box.y1 - pad,
          w: box.x2 - box.x1 + pad * 2,
          h: box.y2 - box.y1 + pad * 2,
        })
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      window.clearTimeout(giveUp)
    }
  }, [motionOn, text, letterSpacing])

  useEffect(() => {
    if (!geom) return
    setLengths(refs.current.slice(0, geom.contours.length).map((el) => (el ? el.getTotalLength() : 0)))
    // Two frames: the first commits full length offsets, the second animates to zero.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setDrawn(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [geom])

  if (!motionOn || failed) return <span className={className}>{text}</span>
  if (!geom) {
    return (
      <span className={className} style={{ visibility: 'hidden' }}>
        {text}
      </span>
    )
  }

  const count = Math.max(1, geom.contours.length)
  // The pen line is drawn with baseline at y = EM; sit that on the text baseline.
  const below = (geom.y + geom.h - EM) / EM

  return (
    <svg
      viewBox={`${geom.x} ${geom.y} ${geom.w} ${geom.h}`}
      role="img"
      aria-label={text}
      className={className}
      style={{
        display: 'inline-block',
        height: `${geom.h / EM}em`,
        width: `${geom.w / EM}em`,
        verticalAlign: `${-below}em`,
        marginInline: `${-(EM * 0.08) / EM}em`,
        overflow: 'visible',
      }}
    >
      <path
        d={geom.full}
        fill="currentColor"
        stroke="none"
        style={{
          opacity: drawn ? 1 : 0,
          transition: drawn ? `opacity 0.5s ease-out ${(delay + duration * 0.75).toFixed(3)}s` : 'none',
        }}
      />
      {geom.contours.map((d, i) => {
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
              strokeDasharray: length || 1,
              strokeDashoffset: drawn ? 0 : length || 1,
              transition: drawn ? `stroke-dashoffset ${each.toFixed(3)}s ease-out ${start.toFixed(3)}s` : 'none',
            }}
          />
        )
      })}
    </svg>
  )
}
