import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

/*
  Motion primitives.

  Two engines, each doing what it is actually good at:

    GSAP + ScrollTrigger : anything tied to scroll position (split text
                           reveals, staggered grids, scrubbed progress, the
                           pinned process section), plus looping timelines.
    framer-motion        : anything tied to React state or pointer input
                           (mount and unmount, hover springs, tilt, tickers).

  Five rules hold the whole file together:

    1. One motion signature. Every curve on the page comes from the EASE table
       below, registered once with CustomEase for GSAP and handed to framer as
       the same four numbers. Nothing eases itself.
    2. Size decides distance and duration. A 6rem headline and a 12px label do
       not travel the same 26px, and they do not take the same time. Roles
       (lead, support, detail) set the band, the element's own height places it
       inside that band, and the viewport scales the whole thing down on a
       phone where 26px is a much larger fraction of the screen.
    3. Everything is gated on prefers-reduced-motion. GSAP work goes through
       gsap.matchMedia so the reduced branch never even builds the tween, and
       the framer components fall back to a static render.
    4. Pointer driven effects are gated on a fine pointer, and refuse touch
       pointer events even there, so a hybrid laptop cannot get a jumpy tilt.
       Nothing anywhere needs hover to become visible or readable.
    5. Nothing outside useSmoothScroll may hold gsap.ticker awake. Scroll
       reactive work runs on one shared rAF loop (the velocity bus) that starts
       on the first subscriber and stops as soon as scrolling settles, and that
       works with or without Lenis so it still runs on a phone.
*/

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/*
  A phone browser resizes the viewport every time the address bar collapses or
  returns. Left alone, ScrollTrigger treats that as a real resize and refreshes,
  which on a long page is both a jank source and another chance to walk into the
  refresh trap described below. Vertical resizes on touch are ignored.
*/
if (typeof window !== 'undefined') {
  ScrollTrigger.config({ ignoreMobileResize: true })
}

// ---------------------------------------------------------------------------
// The motion signature
// ---------------------------------------------------------------------------
/*
  One small set of curves, used everywhere, so the page moves like one object
  rather than like six components that each picked a default.

    lead     display type and hero scale elements. A weighted departure and a
             long glide, because something large should read as having mass.
    out      the workhorse. Leaves decisively, settles long, never overshoots.
    snap     small elements (labels, chips, ordinals). Quick, almost no tail.
    soft     scrubbed cross fades, where the curve is read in both directions.
    exit     anything leaving. Accelerates away, the mirror of `out`.
    stagger  not a motion curve: the curve the delays themselves follow, so a
             line of characters accelerates across rather than ticking evenly.

  Held as bezier control points, not as two parallel definitions, so GSAP and
  framer-motion are provably running the same curve.
*/
type Bezier = [number, number, number, number]
type EaseName = 'lead' | 'out' | 'snap' | 'soft' | 'exit' | 'stagger'

export const EASE: Record<EaseName, Bezier> = {
  lead: [0.22, 0.61, 0.28, 1],
  out: [0.17, 0.74, 0.22, 1],
  snap: [0.3, 0.85, 0.32, 1],
  soft: [0.5, 0.05, 0.2, 1],
  exit: [0.5, 0, 0.85, 0.35],
  stagger: [0.34, 0.38, 0.42, 1],
}

for (const name of Object.keys(EASE) as EaseName[]) {
  const [x1, y1, x2, y2] = EASE[name]
  CustomEase.create(`zyflo-${name}`, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`)
}

/** The GSAP name for a curve in the table. */
const ez = (name: EaseName) => `zyflo-${name}`

// ---------------------------------------------------------------------------
// Motion gates
// ---------------------------------------------------------------------------
/** True when the OS asked for reduced motion and the override is not set. */
export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  !document.documentElement.hasAttribute('data-force-motion') &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The media query every motion gate is built on.
 *
 * gsap.matchMedia only understands media queries, and a media query cannot see
 * a DOM attribute, so the `data-force-motion` override is applied by swapping
 * in a query that always matches. Read once at module load, which is safe: the
 * inline script in index.html sets the attribute during head parsing, and this
 * module is loaded from a deferred module script afterwards.
 */
export const MOTION_OK =
  typeof document !== 'undefined' &&
  document.documentElement.hasAttribute('data-force-motion')
    ? '(min-width: 0px)'
    : '(prefers-reduced-motion: no-preference)'

const NO_PREF = MOTION_OK
const FINE = '(pointer: fine)'
const COARSE = '(pointer: coarse)'
const SMALL = '(max-width: 640px)'
const DESKTOP = `(min-width: 1024px) and ${NO_PREF}`
const HANDHELD = `(max-width: 1023px) and ${NO_PREF}`

/** Live boolean for a media query, so changing the preference re-renders. */
function useMedia(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** True only for a real cursor on a visitor who has not asked for less motion. */
function usePointerMotion() {
  const fine = useMedia(FINE)
  const noPref = useMedia(NO_PREF)
  return fine && noPref
}

/** A touch contact must never drive a hover effect, even on a hybrid machine. */
const isTouch = (e: ReactPointerEvent) => e.pointerType === 'touch'

// ---------------------------------------------------------------------------
// Scroll velocity bus
// ---------------------------------------------------------------------------
/*
  One module level rAF loop shared by every scroll reactive consumer, working
  with or without Lenis so the same code path runs on a phone.

  It starts on the first subscriber, wakes on a passive scroll event, and stops
  itself once scrolling has settled for a few frames, so an idle page burns no
  frames at all. gsap.ticker is deliberately not used here: Lenis is desktop
  only now, and the ticker would otherwise stay awake for the life of the page.
*/
export type ScrollSample = {
  /** Current window.scrollY in px. */
  y: number
  /** Signed pixels per second, smoothed. Positive is downward. */
  velocity: number
  /** 1 down, -1 up, 0 before the first real movement. */
  direction: number
}

type ScrollListener = (sample: ScrollSample) => void

const scrollListeners = new Set<ScrollListener>()
const scrollSample: ScrollSample = { y: 0, velocity: 0, direction: 0 }

let busFrame = 0
let busRunning = false
let busLastY = 0
let busLastT = 0
let busIdle = 0

const readY = () => window.scrollY || window.pageYOffset || 0

function emit() {
  for (const fn of scrollListeners) fn(scrollSample)
}

function busTick(now: number) {
  const y = readY()
  const dy = y - busLastY
  const dt = Math.max(1, now - busLastT)
  busLastY = y
  busLastT = now

  // Smoothed, so one jittery frame cannot flip the reported direction.
  const raw = (dy / dt) * 1000
  scrollSample.velocity += (raw - scrollSample.velocity) * 0.2
  if (Math.abs(scrollSample.velocity) < 1) scrollSample.velocity = 0
  scrollSample.y = y
  if (dy > 0.5) scrollSample.direction = 1
  else if (dy < -0.5) scrollSample.direction = -1

  emit()

  busIdle = Math.abs(dy) < 0.5 ? busIdle + 1 : 0
  if (busIdle > 8) {
    stopBus()
    return
  }
  busFrame = requestAnimationFrame(busTick)
}

function startBus() {
  if (busRunning || typeof window === 'undefined') return
  busRunning = true
  busIdle = 0
  busLastY = readY()
  busLastT = performance.now()
  busFrame = requestAnimationFrame(busTick)
}

function stopBus() {
  if (!busRunning) return
  busRunning = false
  cancelAnimationFrame(busFrame)
  busFrame = 0
  // One last frame at rest, so consumers relax instead of freezing mid flick.
  scrollSample.velocity = 0
  scrollSample.y = readY()
  emit()
}

const wakeBus = () => startBus()

/**
 * Low level access to the bus. Returns an unsubscribe function. The loop runs
 * only while at least one subscriber exists and the page is actually moving.
 */
export function subscribeScroll(fn: ScrollListener) {
  if (typeof window === 'undefined') return () => {}
  scrollListeners.add(fn)
  if (scrollListeners.size === 1) {
    window.addEventListener('scroll', wakeBus, { passive: true })
  }
  startBus()
  return () => {
    scrollListeners.delete(fn)
    if (scrollListeners.size === 0) {
      window.removeEventListener('scroll', wakeBus)
      stopBus()
    }
  }
}

/**
 * Scroll velocity, direction and position as refs, so reading them inside a
 * rAF or an event handler never costs a render. Works with or without Lenis,
 * which is what keeps scroll reactive motion alive on touch.
 */
export function useScrollVelocity() {
  const velocity = useRef(0)
  const direction = useRef(0)
  const y = useRef(0)

  useEffect(
    () =>
      subscribeScroll((s) => {
        velocity.current = s.velocity
        direction.current = s.direction
        y.current = s.y
      }),
    [],
  )

  return { velocity, direction, y }
}

/**
 * True while the reader is scrolling down past `threshold` px, false again the
 * moment they scroll up or come back near the top. Built for a fixed header,
 * which otherwise costs 64px of a phone screen for the whole page.
 *
 * Driven from the velocity bus, so it works without Lenis. `dead` is a small
 * dead zone in px: the state only flips after that much travel in the new
 * direction, which stops a trackpad wobble from strobing the header. Always
 * false under prefers-reduced-motion.
 */
export function useHideOnScrollNav(threshold = 120, dead = 14) {
  const [hidden, setHidden] = useState(false)
  const noPref = useMedia(NO_PREF)

  useEffect(() => {
    if (!noPref) {
      setHidden(false)
      return
    }

    let anchor = readY()
    let dir = 0
    let state = false

    const set = (next: boolean) => {
      if (next === state) return
      state = next
      setHidden(next)
    }

    return subscribeScroll(({ y, direction }) => {
      // A change of direction restarts the dead zone measurement.
      if (direction !== dir) {
        dir = direction
        anchor = y
      }
      if (y <= threshold) {
        anchor = y
        set(false)
        return
      }
      if (direction > 0 && y - anchor > dead) set(true)
      else if (direction < 0 && anchor - y > dead) set(false)
    })
  }, [threshold, dead, noPref])

  return hidden
}

// ---------------------------------------------------------------------------
// Reveal scale: distance and duration follow size
// ---------------------------------------------------------------------------
/*
  Three roles, three bands. `ratio` is the share of the element's own rendered
  height it travels, clamped into the band, so a section title lands near the
  top of the lead band and a chip lands near the bottom of the detail band.

  Lead elements move first and furthest and take longest. Support elements
  follow closer and faster, detail elements barely move at all. That ordering,
  plus the delays the page passes in, is the choreography: a section heading is
  still settling while its lead paragraph starts, and the grid under them is
  already running before either has finished.
*/
type Role = 'lead' | 'support' | 'detail'

const ROLE: Record<Role, { ratio: number; min: number; max: number; dur: number; ease: EaseName }> =
  {
    lead: { ratio: 0.3, min: 20, max: 56, dur: 0.98, ease: 'lead' },
    support: { ratio: 0.26, min: 12, max: 34, dur: 0.74, ease: 'out' },
    detail: { ratio: 0.22, min: 6, max: 18, dur: 0.5, ease: 'snap' },
  }

/**
 * How much to shrink travel for the screen it is happening on.
 *
 * 26px on a 1440px desktop is a small hop. The same 26px on a 390px phone is
 * proportionally three and a half times larger, which is why untuned desktop
 * reveals look thrown about on a handset. Mobile is not a degraded desktop, so
 * it gets its own distances rather than the desktop ones at the same value.
 */
function screenScale() {
  if (typeof window === 'undefined') return 1
  const w = window.innerWidth
  if (w < 420) return 0.5
  if (w < 640) return 0.62
  if (w < 1024) return 0.8
  return 1
}

/** Reveal travel in px. `hint` overrides the measurement, the screen still scales it. */
function travelFor(role: Role, hint?: number, el?: Element | null) {
  const r = ROLE[role]
  const h = el instanceof HTMLElement ? el.offsetHeight : 0
  const base = hint ?? gsap.utils.clamp(r.min, r.max, h * r.ratio)
  return Math.round(base * screenScale())
}

/** Duration for a reveal of `travel` px, inside the band its role allows. */
function durationFor(role: Role, travel: number) {
  const r = ROLE[role]
  const t = gsap.utils.clamp(0, 1, travel / r.max)
  return Number((r.dur * (0.82 + 0.3 * t)).toFixed(3))
}

/**
 * Reveals play faster when the reader is moving fast, so nothing is still
 * arriving after it has already been scrolled past.
 *
 * Read straight off the velocity bus rather than from Lenis, so it behaves the
 * same under a thumb flick as under a mouse wheel. If the bus happens to be
 * parked the sample is zero and this is exactly 1, which is the right answer.
 */
function revealTimeScale() {
  return gsap.utils.clamp(1, 1.75, 1 + Math.abs(scrollSample.velocity) / 3500)
}

// ---------------------------------------------------------------------------
// The refresh trap
// ---------------------------------------------------------------------------
/*
  One shot reveals never attach their tween to the ScrollTrigger.

  ScrollTrigger.refresh() re-measures by reverting every attached animation to
  progress 0. Triggers already scrolled past get re-applied afterwards and
  triggers not yet reached are still meant to be hidden, so both survive, but
  a trigger that is *currently active* is not re-entered, so its elements stay
  painted at progress 0 while the tween reports complete. That is exactly how
  the services grid ended up invisible: it was the only section inside its own
  start and end range when a refresh landed.

  So: `ScrollTrigger.create()` is used purely as a detector with `once: true`,
  and the tween is fired from `onEnter`. A trigger with no `animation` has
  nothing to revert, and it kills itself after firing.

  Scrubbed effects are the exception and may attach their tween, because scrub
  re-derives progress from scroll position on every update.
*/

/** Hidden then revealed on enter, in a way refreshes cannot undo. */
function revealOnEnter(
  el: Element,
  items: Element[],
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  start: string,
) {
  if (!items.length) return () => {}

  // Promoted for the length of the reveal only. Leaving will-change on for the
  // life of the page holds a compositor layer per element, which on a mid range
  // Android is memory that the scenes need more than a finished heading does.
  gsap.set(items, { ...from, willChange: 'transform, opacity' })

  const st = ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => {
      const tween = gsap.to(items, {
        ...to,
        overwrite: 'auto',
        onComplete: () => gsap.set(items, { willChange: 'auto' }),
      })
      tween.timeScale(revealTimeScale())
    },
  })

  return () => {
    st.kill()
    gsap.set(items, { clearProps: 'all' })
  }
}

// Webfonts change every measurement on the page; re-measure once they land.
if (typeof document !== 'undefined' && 'fonts' in document) {
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}

// ---------------------------------------------------------------------------
// Smooth scrolling and anchors
// ---------------------------------------------------------------------------
/**
 * Lenis, desktop only, driven off GSAP's ticker rather than its own rAF loop.
 * Sharing one loop is what keeps scrubbed ScrollTriggers locked to the smoothed
 * position instead of lagging a frame behind it.
 *
 * Coarse pointers get nothing: momentum scrolling on a phone is already native
 * and already better, and the ticker Lenis needs would otherwise stay awake for
 * the life of the page, which is a real battery cost on a mid range Android.
 *
 * Anchor handling runs on every device either way, because the fixed header
 * hides the top of whatever a native anchor jump lands on. The offset is
 * measured from the header rather than hardcoded, so it stays correct at both
 * header heights.
 */
export function useSmoothScroll() {
  const smooth = usePointerMotion()

  useEffect(() => {
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    if (smooth) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    const headerOffset = () => {
      const header = document.querySelector('header')
      return (header instanceof HTMLElement ? header.offsetHeight : 64) + 12
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href') ?? ''
      if (hash.length < 2) return
      // getElementById rather than querySelector: an id starting with a digit
      // is a valid id and an invalid selector, and would throw.
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      e.preventDefault()

      // Two frames of grace. The mobile sheet closes on the same click and it
      // locks the document while open, so scrolling immediately would be
      // swallowed by that lock. By the second frame React has flushed and the
      // lock is gone.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const offset = headerOffset()
          if (lenis) {
            lenis.scrollTo(target, { offset: -offset })
          } else {
            window.scrollTo({
              top: target.getBoundingClientRect().top + readY() - offset,
              behavior: prefersReduced() ? 'auto' : 'smooth',
            })
          }
        }),
      )

      if (window.location.hash !== hash) history.pushState(null, '', hash)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      if (tick) {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33) // back to the GSAP default
      }
      lenis?.destroy()
    }
  }, [smooth])
}

/**
 * Reading progress hairline across the very top of the page.
 *
 * Progress is written straight to the element's transform from the velocity
 * bus: no spring to keep alive, no gsap.ticker involvement, and no dependency
 * on Lenis, so it works on touch where Lenis is absent. It re-measures on
 * resize and on every ScrollTrigger refresh, since the document grows when
 * fonts land.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = -1

    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, readY() / max)) : 0
      if (Math.abs(p - last) < 0.0005) return
      last = p
      el.style.transform = `scaleX(${p})`
      el.style.opacity = p > 0.002 ? '1' : '0'
    }

    paint()
    const off = subscribeScroll(paint)
    window.addEventListener('resize', paint)
    ScrollTrigger.addEventListener('refresh', paint)

    return () => {
      off()
      window.removeEventListener('resize', paint)
      ScrollTrigger.removeEventListener('refresh', paint)
    }
  }, [])

  // Two tokens only, both guaranteed by the palette, so the gradient cannot be
  // invalidated by a token rename and leave the bar unpainted.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)', opacity: 0, willChange: 'transform' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[linear-gradient(90deg,var(--color-brand-strong),var(--color-brand))] transition-opacity duration-200"
    />
  )
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------
type HeadingTag = 'h1' | 'h2' | 'h3' | 'p' | 'div'

/**
 * Split text rise, driven by scroll.
 *
 * `type="words"` (the default) rises each word with a de-blur: the right
 * weight for a section heading. `type="chars"` is the hero setting: every
 * letter rises out of its own baseline with a small rotation about its bottom
 * left corner, so the line assembles and settles rather than simply arriving.
 *
 * Two things make the character mode worth its node count:
 *
 *   The travel is yPercent, not px, so it is already proportional to the size
 *   of the letter it belongs to: the same code reads correctly at the 2.6rem
 *   bottom of the hero clamp and at the 6rem top of it.
 *
 *   The delays follow a curve, not a constant. With the `stagger` ease the
 *   first letters are spaced apart and the tail compresses, so the line
 *   accelerates across itself instead of ticking out like a metronome. The
 *   whole span is capped, so a long headline never crawls.
 *
 * No mask wrapper, deliberately. Clipping each word would look sharper, but
 * the display line-height in this system is below 1, so a clip box sized to
 * the line would cut the descenders off at rest.
 *
 * Splits on words or characters, never lines: line splitting has to wait for
 * webfonts to settle or it measures the wrong break points, and waiting means
 * either a flash of unstyled text or a heading that stays invisible if
 * anything throws. Words and chars need no measurement, so the reveal can be
 * armed before first paint. SplitText's own aria handling keeps the original
 * string readable to a screen reader.
 */
export function SplitHeading({
  as = 'h2',
  children,
  className = '',
  delay = 0,
  start = 'top 88%',
  stagger,
  type = 'words',
}: {
  as?: HeadingTag
  children: ReactNode
  className?: string
  delay?: number
  start?: string
  stagger?: number
  type?: 'words' | 'chars'
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ motion: NO_PREF, coarse: COARSE, small: SMALL }, (self) => {
        const cond = (self.conditions ?? {}) as {
          motion?: boolean
          coarse?: boolean
          small?: boolean
        }
        if (!cond.motion) return

        const chars = type === 'chars'
        const split = new SplitText(el, {
          // Chars still need the word wrapper, or the line cannot wrap.
          type: chars ? 'words,chars' : 'words',
          wordsClass: 'split-word',
          charsClass: 'split-char',
        })
        const items = (chars ? split.chars : split.words) as Element[]

        // Delays are spread across a capped window, so the span is set by the
        // headline's length rather than growing without limit with it.
        const requested = stagger ?? (chars ? 0.017 : 0.05)
        const gaps = Math.max(1, items.length - 1)
        const cap = chars ? 1.05 : 0.85
        const each = Math.min(requested, cap / gaps)

        const spread = { each, from: 'start' as const, ease: ez('stagger') }

        // Blur is the single most expensive thing on this page to paint, so it
        // is spent only on the words mode, where there are a dozen or so nodes
        // and a real GPU behind them. A phone gets the rise alone, and the
        // character mode never blurs at any size.
        const blurred = !chars && !cond.coarse

        const from: gsap.TweenVars = chars
          ? {
              yPercent: 105,
              opacity: 0,
              // A low left origin, so a letter pivots up off its own baseline.
              // Dropped on touch: the extra matrix buys very little at phone
              // type sizes and every letter is a separate animating node.
              rotate: cond.coarse ? 0 : 6,
              transformOrigin: '0% 90%',
            }
          : { yPercent: 76, opacity: 0, ...(blurred ? { filter: 'blur(7px)' } : {}) }

        const to: gsap.TweenVars = {
          yPercent: 0,
          opacity: 1,
          ...(chars ? { rotate: 0 } : {}),
          ...(blurred ? { filter: 'blur(0px)' } : {}),
          // Characters are many and small, so each one moves quickly and the
          // line as a whole carries the length. Words are few and large, so
          // each one gets the longer curve.
          duration: chars ? (cond.small ? 0.66 : 0.82) : cond.small ? 0.72 : 0.92,
          ease: ez('lead'),
          stagger: spread,
          delay,
        }

        const cleanup = revealOnEnter(el, items, from, to, start)

        return () => {
          cleanup()
          split.revert()
        }
      })
    }, ref)

    return () => ctx.revert()
  }, [delay, start, stagger, type])

  return createElement(as, { ref, className }, children)
}

/**
 * Rise for a block that does not need splitting.
 *
 * `role` places it in the choreography: `lead` for something that should move
 * first and furthest, `support` (the default) for the copy and controls that
 * follow it, `detail` for a label or a chip. `y` still overrides the distance
 * where a specific block wants one, and the screen still scales it down.
 */
export function BlurIn({
  children,
  delay = 0,
  y = 20,
  role = 'support',
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  role?: Role
  className?: string
}) {
  const noPref = useMedia(NO_PREF)

  // framer-motion does not consult the preference on its own, so the reduced
  // branch renders the finished state with no animation attached at all.
  if (!noPref) return <div className={className}>{children}</div>

  const travel = travelFor(role, y)
  const duration = durationFor(role, travel)

  // A 10px hop does not want a 10px blur, and a phone does not want one at all:
  // a blur filter forces a fresh rasterisation of the whole block every frame.
  const blur = screenScale() < 0.7 ? 0 : Math.min(9, Math.round(travel * 0.5))

  return (
    <motion.div
      className={className}
      initial={blur ? { opacity: 0, y: travel, filter: `blur(${blur}px)` } : { opacity: 0, y: travel }}
      whileInView={blur ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: screenScale() < 0.7 ? '-32px' : '-60px' }}
      transition={{ duration, delay, ease: EASE[ROLE[role].ease] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A rail that fills as its parent section scrolls past. GSAP scrub, so it
 * tracks scroll position rather than playing on a timer. Reduced motion users
 * get it fully drawn, since the tween that empties it is never built.
 */
export function ScrubRail({
  vertical = false,
  className = '',
}: {
  vertical?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const fill = el?.firstElementChild as HTMLElement | null
    if (!el || !fill) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(NO_PREF, () => {
        const prop = vertical ? 'scaleY' : 'scaleX'
        const tween = gsap.fromTo(
          fill,
          { [prop]: 0 },
          {
            [prop]: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top 72%',
              end: 'bottom 80%',
              scrub: 0.5,
            },
          },
        )
        return () => tween.kill()
      })
    }, ref)

    return () => ctx.revert()
  }, [vertical])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`overflow-hidden bg-border ${vertical ? 'w-px' : 'h-px'} ${className}`}
    >
      <div
        className={`h-full w-full bg-[linear-gradient(90deg,var(--color-brand-strong),var(--color-brand))] ${
          vertical ? 'origin-top' : 'origin-left'
        }`}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Grids
// ---------------------------------------------------------------------------
/**
 * Staggers a grid's direct children in as it enters view. One ScrollTrigger for
 * the whole grid rather than one per card, which matters when the capability
 * wall alone has twenty one of them.
 *
 * Travel is measured per child, so a tall service card and a single line chip
 * in the same grid do not move the same distance. `y` overrides that where a
 * section wants a specific figure.
 *
 * `from` is handed straight to gsap's stagger: 'start' walks the grid in source
 * order, 'center' opens outwards from the middle card, 'edges' closes inwards.
 * Pick per section; a wide even grid usually reads better from 'center'.
 *
 * On a coarse pointer the gap between children is widened and the duration cut,
 * which sounds backwards but is not: both reduce how many children are in
 * flight at the same instant, and concurrent animation count is the thing a mid
 * range Android actually runs out of budget for.
 */
export function StaggerGrid({
  children,
  className = '',
  y,
  stagger = 0.055,
  start = 'top 84%',
  from = 'start',
  role = 'support',
}: {
  children: ReactNode
  className?: string
  y?: number
  stagger?: number
  start?: string
  from?: 'start' | 'center' | 'edges'
  role?: Role
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ motion: NO_PREF, coarse: COARSE }, (self) => {
        const cond = (self.conditions ?? {}) as { motion?: boolean; coarse?: boolean }
        if (!cond.motion) return

        // Array.from(el.children), not a `:scope` selector: plain children are
        // unambiguous and need no selector engine support.
        const items = Array.from(el.children)
        if (!items.length) return

        const gaps = Math.max(1, items.length - 1)
        let each = cond.coarse ? stagger * 1.35 : stagger
        // Capped total span, so twenty one chips never read as a queue.
        each = Math.min(each, 1.5 / gaps)

        // One duration for the group, taken from its first child: the children
        // of a grid are the same size as each other, and a single value keeps
        // the row reading as one movement.
        const duration = durationFor(role, travelFor(role, y, items[0])) * (cond.coarse ? 0.9 : 1)

        return revealOnEnter(
          el,
          items,
          {
            y: (_i: number, target: Element) => travelFor(role, y, target),
            opacity: 0,
            // A card settling out of a slight undersize reads as arriving
            // rather than sliding. Skipped on touch: one less transform
            // component per child, times twenty one children.
            ...(cond.coarse ? {} : { scale: 0.99 }),
          },
          {
            y: 0,
            opacity: 1,
            ...(cond.coarse ? {} : { scale: 1 }),
            duration,
            ease: ez(ROLE[role].ease),
            stagger: { each, from, ease: ez('stagger') },
          },
          start,
        )
      })
    }, ref)

    return () => ctx.revert()
  }, [y, stagger, start, from, role])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// The pinned process section
// ---------------------------------------------------------------------------
/*
  CONTRACT WITH THE INTEGRATOR

  Render the process steps in a plain container, with NO StaggerGrid and no
  other reveal wrapper around them, and put `className="process-step"` on each
  step element. Give the section a ref and pass it here:

      const ref = useRef<HTMLElement>(null)
      useProcessPin(ref, process.length)
      <section id="process" ref={ref}> ... </section>

  This hook is then the single owner of opacity and transform on every
  .process-step. Nothing else may write those two properties on those elements,
  or two owners fight and one of them wins at random.
*/
/**
 * Desktop: pins the section and scrubs a spotlight through the steps, lighting
 * each one in turn as the reader scrolls. The step arriving uses the lead
 * curve and the step leaving uses the soft one, so attention moves forward
 * rather than two things trading places. Handheld: one simple staggered reveal
 * instead, because pinning a short screen just steals it.
 *
 * Exactly one branch owns the steps per breakpoint, and neither branch exists
 * under prefers-reduced-motion, where the steps are left entirely alone at
 * their natural CSS appearance. Side effect only, returns nothing.
 */
export function useProcessPin(sectionRef: RefObject<HTMLElement | null>, stepCount: number) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || stepCount < 1) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(DESKTOP, () => {
        const steps = gsap.utils.toArray<HTMLElement>('.process-step', section)
        if (!steps.length) return

        const dim = { opacity: 0.32, scale: 0.985, y: 16 }
        gsap.set(steps, { ...dim, transformOrigin: '50% 50%', willChange: 'transform, opacity' })

        // A scrubbed timeline may safely be attached to its trigger: scrub
        // re-derives progress from scroll position on every update, so a
        // ScrollTrigger.refresh() cannot strand it at progress 0.
        const tl = gsap.timeline({
          defaults: { ease: ez('soft') },
          scrollTrigger: {
            trigger: section,
            // If the section is taller than the screen, pin from its bottom so
            // nothing at the foot of it is ever cut off.
            start: () => (section.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
            end: () => `+=${Math.round(stepCount * 55)}%`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })

        steps.forEach((step, i) => {
          tl.to(step, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: ez('lead') }, i)
          // The outgoing step keeps travelling in the direction it was already
          // going, which is what makes the pair read as one handover.
          if (i > 0) tl.to(steps[i - 1], { ...dim, y: -12, duration: 0.55, ease: ez('exit') }, i)
        })
        // A beat of hold on the last step before the pin releases.
        tl.to({}, { duration: 0.5 })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          gsap.set(steps, { clearProps: 'all' })
        }
      })

      mm.add(HANDHELD, () => {
        const steps = gsap.utils.toArray<HTMLElement>('.process-step', section)
        if (!steps.length) return
        const travel = travelFor('support', undefined, steps[0])
        return revealOnEnter(
          section,
          steps,
          { y: travel, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: durationFor('support', travel),
            ease: ez('out'),
            stagger: { each: 0.1, from: 'start', ease: ez('stagger') },
          },
          'top 78%',
        )
      })
    }, section)

    return () => ctx.revert()
  }, [sectionRef, stepCount])
}

// ---------------------------------------------------------------------------
// Card artwork parallax
// ---------------------------------------------------------------------------
/**
 * Scrubbed drift for artwork sitting inside a card, so the figure moves a
 * little slower than the card that frames it. `distance` is a percentage of the
 * element's own height, and the element is scaled just past its frame so the
 * drift never exposes an edge.
 *
 * This runs on touch as well, at roughly half the travel. A scrubbed transform
 * costs almost nothing, it cannot overflow because the card clips it, and the
 * depth it gives the work cards is most of what stops them reading flat on a
 * phone. The card (the wrapper's parent) is the trigger, which is what makes
 * each figure move on its own schedule down a two column grid.
 */
export function useCardParallax(ref: RefObject<HTMLElement | null>, distance = 7) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ motion: NO_PREF, coarse: COARSE }, (self) => {
        const cond = (self.conditions ?? {}) as { motion?: boolean; coarse?: boolean }
        if (!cond.motion) return

        const d = cond.coarse ? distance * 0.55 : distance
        const tween = gsap.fromTo(
          el,
          { yPercent: -d, scale: 1 + d / 100 + 0.02 },
          {
            yPercent: d,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: cond.coarse ? 0.6 : 0.4,
              invalidateOnRefresh: true,
            },
          },
        )
        return () => tween.kill()
      })
    }, el)

    return () => ctx.revert()
  }, [ref, distance])
}

/** Component form of useCardParallax. Wrap the figure, keep the card clipped. */
export function CardParallax({
  children,
  distance = 7,
  className = '',
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useCardParallax(ref, distance)
  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pointer driven
// ---------------------------------------------------------------------------
/*
  Everything below no-ops on a coarse pointer and under reduced motion, and
  refuses touch pointer events even when the media query says the device has a
  fine pointer, which a hybrid laptop reports while you are using its screen.

  A touch visitor cannot hover, so the springs and listeners would only ever
  cost work, and nothing here carries information: every one of these is a
  finish on something already legible and already reachable. Each component
  keeps its props and its DOM shape in both branches, so nothing reflows when
  the branch changes.
*/

/**
 * Cursor tracked glow, the one pointer following highlight on the page, and
 * only on the service cards where there is a large surface for it to wash
 * across. The position is written to CSS custom properties rather than React
 * state, so moving the mouse never triggers a render.
 *
 * The glow eases toward the cursor rather than being pinned under it, which is
 * the difference between a light in the card and a sprite following the mouse.
 * The rAF loop runs only while it is catching up: park the cursor and the loop
 * parks with it.
 */
export function Spotlight({
  children,
  className = '',
  as: Tag = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
  /** Anchor target. Service cards carry id="service-<id>", which is what the
      capability rows link to and what the Service nodes in the structured data
      point at, so the two must not drift apart. */
  id?: string
}) {
  const pointer = usePointerMotion()
  if (!pointer) {
    return createElement(Tag, { id, className: `spotlight ${className}` }, children)
  }
  return (
    <SpotlightPointer className={className} as={Tag} id={id}>
      {children}
    </SpotlightPointer>
  )
}

function SpotlightPointer({
  children,
  className,
  as: Tag,
  id,
}: {
  children: ReactNode
  className: string
  as: 'div' | 'article' | 'li'
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const target = useRef({ x: 0, y: 0 })
  const at = useRef({ x: 0, y: 0 })

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const write = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', `${at.current.x.toFixed(1)}px`)
    el.style.setProperty('--my', `${at.current.y.toFixed(1)}px`)
  }

  const loop = () => {
    const dx = target.current.x - at.current.x
    const dy = target.current.y - at.current.y
    at.current.x += dx * 0.16
    at.current.y += dy * 0.16
    write()
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      frame.current = 0
      return
    }
    frame.current = requestAnimationFrame(loop)
  }

  const local = (e: ReactPointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  return createElement(
    Tag,
    {
      ref,
      id,
      // Placed where the cursor arrived, so the glow fades in where it should
      // be rather than sweeping in from wherever it was last left.
      onPointerEnter: (e: ReactPointerEvent) => {
        if (!ref.current || isTouch(e)) return
        at.current = local(e)
        target.current = { ...at.current }
        write()
      },
      onPointerMove: (e: ReactPointerEvent) => {
        if (!ref.current || isTouch(e)) return
        target.current = local(e)
        if (!frame.current) frame.current = requestAnimationFrame(loop)
      },
      onPointerLeave: () => {
        cancelAnimationFrame(frame.current)
        frame.current = 0
      },
      className: `spotlight ${className}`,
    },
    children,
  )
}

/** Card that leans toward the cursor. */
export function Tilt({
  children,
  className = '',
  max = 7,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const pointer = usePointerMotion()
  if (!pointer) return <div className={className}>{children}</div>
  return (
    <TiltPointer className={className} max={max}>
      {children}
    </TiltPointer>
  )
}

function TiltPointer({
  children,
  className,
  max,
}: {
  children: ReactNode
  className: string
  max: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  // Damped just short of oscillating: a card should settle, not wobble.
  const srx = useSpring(rx, { stiffness: 160, damping: 20, mass: 0.6 })
  const sry = useSpring(ry, { stiffness: 160, damping: 20, mass: 0.6 })

  const rest = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || isTouch(e)) return
        const r = el.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
      }}
      onPointerLeave={rest}
      onPointerCancel={rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Pulls toward the pointer while hovered, springs back on exit.
 *
 * The pull is capped in px as well as scaled by `strength`, so a wide button
 * cannot be dragged far enough to reach the edge of a narrow viewport and open
 * a horizontal scrollbar.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const pointer = usePointerMotion()
  if (!pointer) return <div className={`inline-block ${className}`}>{children}</div>
  return (
    <MagneticPointer strength={strength} className={className}>
      {children}
    </MagneticPointer>
  )
}

function MagneticPointer({
  children,
  strength,
  className,
}: {
  children: ReactNode
  strength: number
  className: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 280, damping: 18, mass: 0.4 })

  const rest = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || isTouch(e)) return
        const r = el.getBoundingClientRect()
        const cap = Math.max(6, Math.min(16, r.width * 0.14))
        const clamp = gsap.utils.clamp(-cap, cap)
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength))
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength))
      }}
      onPointerLeave={rest}
      onPointerCancel={rest}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Decorative backgrounds
// ---------------------------------------------------------------------------
/**
 * Slow parallax drift for a decorative layer. Scrubbed, so it is refresh safe,
 * and it runs on touch too: a scrubbed transform costs almost nothing and it is
 * what gives the hero and the studio card their depth on a phone.
 *
 * The drift is centred on the element's real layout position (half the distance
 * above at the bottom of the range, half below at the top) rather than starting
 * there and leaving, so the neutral frame is the one the layout was designed
 * around. Distance is scaled down on small screens, where the same travel is a
 * far larger share of the screen and could crowd whatever sits above it.
 */
export function Parallax({
  children,
  distance = 60,
  className = '',
}: {
  children: ReactNode
  distance?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(NO_PREF, () => {
        const half = Math.round(distance * screenScale()) / 2
        const tween = gsap.fromTo(
          el,
          { y: half },
          {
            y: -half,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        )
        return () => tween.kill()
      })
    }, ref)
    return () => ctx.revert()
  }, [distance])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
