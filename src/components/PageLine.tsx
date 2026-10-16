import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'

import { MOTION_OK } from './motion'

/*
  One royal blue line that starts at the very top of the home page, beside the
  hero, and draws itself down the right edge as you scroll through the page.

  It wraps the page so it can measure it: progress is how far the visitor has
  travelled from the top of the wrapper to its bottom. The line sits behind
  the content, so a card or a band simply covers it. A faint copy of the full
  route is always drawn, so the line has something to follow.

  The path is stretched to the page's height. A non-scaling stroke keeps its
  width the same however far it is stretched, and a clip that grows down the
  page reveals it. Hidden on a phone, where the
  edge of the screen is better left to the content, and when motion is off.
*/

// One continuous wandering line, top to bottom. 300 wide, 2000 tall, stretched.
const PATH =
  'M262 0 C262 110 150 140 170 270 S300 470 215 640 S70 800 150 980 S295 1130 205 1310 S75 1480 160 1650 S280 1790 225 2000'

const LINE_CLASS =
  'pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-[min(28vw,380px)] sm:block'

export default function PageLine({ children }: { children: ReactNode }) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  // Bumped when the page changes height (the lower half of the home page loads a moment
  // after the first paint) so the line is measured against the real page.
  const resized = useMotionValue(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => resized.set(resized.get() + 1))
    ro.observe(el)
    return () => ro.disconnect()
  }, [resized])

  // The line only ever runs downwards, so revealing it top to bottom with a clip is the
  // same as drawing it. The pen tip sits 40% of the way down the screen at the top of the
  // page and level with the bottom of the screen at the end, so it is always in view.
  const clip = useTransform([scrollY, resized], ([y]: number[]) => {
    const el = ref.current
    if (!el) return 'inset(0 0 100% 0)'
    const height = el.offsetHeight
    const vh = window.innerHeight
    const rel = y - (el.getBoundingClientRect().top + window.scrollY)
    const along = Math.min(1, Math.max(0, rel / Math.max(1, height - vh)))
    const tip = rel + vh * (0.4 + 0.6 * along)
    const share = Math.min(1, Math.max(0.02, tip / height))
    return `inset(0 0 ${(1 - share) * 100}% 0)`
  })

  return (
    <div ref={ref} className="relative isolate">
      {motionOn && (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 300 2000"
            preserveAspectRatio="none"
            fill="none"
            className={LINE_CLASS}
          >
            <path
              d={PATH}
              stroke="var(--color-brand)"
              strokeOpacity="0.12"
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 300 2000"
            preserveAspectRatio="none"
            fill="none"
            className={LINE_CLASS}
            style={{ clipPath: clip }}
          >
            <path
              d={PATH}
              stroke="var(--color-brand)"
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        </>
      )}
      {children}
    </div>
  )
}
