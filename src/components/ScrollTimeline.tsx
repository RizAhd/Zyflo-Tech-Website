import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { Eyebrow } from './ui'
import { MOTION_OK } from './motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

/*
  A pinned horizontal timeline.

  The section is tall; inside it a screen-sized panel sticks to the top while
  the scroll position slides a wide track sideways. A line draws itself along
  the middle of the track and each item grows a stem from it, with its number
  and name above or below and its text beneath, alternating top and bottom.

  How it stays correct at any size:

    - The slide distance is measured, not guessed: it is however far the last
      item has to travel to end up on screen. Resize, rotate, change the
      font, and it re-measures.
    - Each item reveals when ITS OWN left edge reaches the viewport
      (ScrollTrigger containerAnimation), so a reveal can never fire while its
      item is still off screen, whatever the geometry.
    - The line's head follows the same measured position.

  Sizes are in vw so the composition keeps its proportions from a phone to a
  wide monitor; text is clamped so a tablet does not shrink it to nothing.

  With motion switched off (footer toggle) the caller's static layout renders
  instead: no pinning, no sideways travel.
*/

export interface TimelineItem {
  id: string
  index: string
  title: string
  body: string
}

interface Props {
  /** The section's id, used by the nav and scroll spy. */
  id: string
  /** Section number, e.g. "02". */
  eyebrowIndex: string
  eyebrow: string
  heading: ReactNode
  lead: string
  items: TimelineItem[]
  topLabel: string
  bottomLabel: string
  /** Track width as a number of viewport widths, desktop and phone. */
  trackVw: number
  mobileTrackVw: number
  /** Full height of the pinned section, as Tailwind classes. */
  heightClass: string
  /** Rendered instead when motion is off. */
  fallback: ReactNode
}

const lineStyle: CSSProperties = { backgroundColor: 'var(--color-brand-strong)' }

const TITLE = 'text-[clamp(1.2rem,2.3vw,2.6rem)] leading-[1.05] max-[600px]:text-[6.2vw]'
const BODY =
  'text-[clamp(0.85rem,1.25vw,1.35rem)] leading-[1.35] text-muted-foreground max-[600px]:text-[4.4vw]'

function Item({ item, side }: { item: TimelineItem; side: 'top' | 'bottom' }) {
  const top = side === 'top'
  const dot = (
    <div
      className={`jd-${item.id} relative aspect-square size-[1vw] min-h-2.5 min-w-2.5 -translate-x-1/2 rounded-full max-[600px]:size-[2.5vw]`}
      style={lineStyle}
    />
  )
  const stem = (
    <div
      className={`jl-${item.id} w-px rounded-full ${
        top ? 'h-[94%] origin-bottom' : 'h-[94%] origin-top max-[600px]:h-full'
      }`}
      style={lineStyle}
    />
  )

  return (
    <div
      data-tl-item={item.id}
      className={
        top
          ? 'relative h-full w-[30vw] min-w-[15rem] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]'
          : 'relative h-full w-[25vw] min-w-[14rem] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]'
      }
    >
      <div className={`absolute left-0 h-full w-full ${top ? 'bottom-0 top-0' : 'bottom-[-1%]'}`}>
        {top ? (
          <>
            {dot}
            {stem}
          </>
        ) : (
          <>
            {stem}
            {dot}
          </>
        )}
      </div>

      <div
        className={
          top
            ? 'mt-[-1vw] space-y-[1vw] max-[600px]:mt-[-2vw]'
            : 'flex h-full w-full flex-col justify-end space-y-[1vw]'
        }
      >
        <h3 className={`title-${item.id} font-ui font-semibold ${TITLE}`}>
          <span className="text-brand-strong">{item.index}</span> {item.title}
        </h3>
        <p className={`description-${item.id} w-[92%] ${BODY}`}>{item.body}</p>
      </div>
    </div>
  )
}

export default function ScrollTimeline(props: Props) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  return motionOn ? <Pinned {...props} /> : <>{props.fallback}</>
}

function Pinned({
  id,
  eyebrowIndex,
  eyebrow,
  heading,
  lead,
  items,
  topLabel,
  bottomLabel,
  trackVw,
  mobileTrackVw,
  heightClass,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const top = items.filter((_, i) => i % 2 === 0)
  const bottom = items.filter((_, i) => i % 2 === 1)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let cancelled = false
    let ctx: gsap.Context | undefined
    let splits: SplitText[] = []

    const build = () => {
      // DOM order is the top row then the bottom row, not reading order, so
      // items are matched by id and the furthest right one is found by measuring.
      const els = Array.from(section.querySelectorAll<HTMLElement>('[data-tl-item]'))
      const last = els[0]
      const lineEl = section.querySelector<HTMLElement>('.journey-line')
      const lineWrap = lineEl?.parentElement
      if (!last || !lineEl || !lineWrap) return

      ctx = gsap.context(() => {
        // Distances, read from the layout whenever ScrollTrigger refreshes.
        const trackLeft = () => track.getBoundingClientRect().left
        const slideDistance = () => {
          const right = Math.max(
            ...els.map((el) => el.getBoundingClientRect().right - trackLeft()),
          )
          const margin = window.innerWidth * 0.06
          return -Math.max(0, right - window.innerWidth + margin)
        }

        const lineStart = () =>
          lineWrap.getBoundingClientRect().left - trackLeft() + lineEl.offsetLeft
        const lineMax = () => {
          const dots = (lineEl.previousElementSibling as HTMLElement | null)?.offsetWidth ?? 0
          return Math.max(0, lineWrap.clientWidth - dots * 2)
        }
        let start = 0
        let max = 0

        const drawLine = () => {
          const x = Number(gsap.getProperty(track, 'x')) || 0
          // The head of the line sits about 70% of the way across the screen.
          const head = -x + window.innerWidth * 0.7
          gsap.set(lineEl, { width: Math.min(max, Math.max(0, head - start)) })
        }

        const slide = gsap.to(track, {
          x: slideDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              start = lineStart()
              max = lineMax()
              drawLine()
            },
            onUpdate: drawLine,
          },
        })

        els.forEach((el) => {
          const index = items.findIndex((it) => it.id === el.dataset.tlItem)
          const item = items[index]
          if (!item) return
          const isTop = index % 2 === 0

          gsap.set(`.jl-${item.id}`, { scaleY: 0, transformOrigin: isTop ? 'bottom' : 'top' })
          gsap.set(`.jd-${item.id}`, { scale: 0 })

          const title = new SplitText(`.title-${item.id}`, { type: 'lines', mask: 'lines' })
          const body = new SplitText(`.description-${item.id}`, { type: 'lines', mask: 'lines' })
          splits.push(title, body)

          // Tied to the track's travel: runs as this item's left edge moves
          // from near the right of the screen to about the middle.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: el,
                containerAnimation: slide,
                start: 'left 90%',
                end: 'left 55%',
                scrub: true,
              },
            })
            .to(`.jl-${item.id}`, { scaleY: 1, duration: 0.5 })
            .to(`.jd-${item.id}`, { scale: 1, duration: 0.5 }, '<')
            .fromTo(
              title.lines,
              { yPercent: 110 },
              { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'power2.out' },
              '-=0.3',
            )
            .fromTo(
              body.lines,
              { yPercent: 110 },
              { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'power2.out' },
              '<',
            )
        })
      }, section)
    }

    const teardown = () => {
      ctx?.revert()
      ctx = undefined
      splits.forEach((s) => s.revert())
      splits = []
    }

    // Line splitting measures text, so it waits for the webfonts, and it is
    // redone when the width changes enough to re-wrap the text.
    let lastWidth = window.innerWidth
    let timer: number | undefined
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (cancelled || Math.abs(window.innerWidth - lastWidth) < 40) return
        lastWidth = window.innerWidth
        teardown()
        build()
        ScrollTrigger.refresh()
      }, 250)
    }

    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (cancelled) return
      build()
      ScrollTrigger.refresh()
    })
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      teardown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const vars = { '--track': `${trackVw}vw`, '--track-m': `${mobileTrackVw}vw` } as CSSProperties

  return (
    <section ref={sectionRef} id={id} className={`relative w-full ${heightClass}`}>
      <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden pt-[4.5rem]">
        <div
          ref={trackRef}
          style={vars}
          className="mr-[2vw] flex h-[max(30vw,26rem)] w-(--track) items-center gap-[5vw] px-[5vw] max-[600px]:h-[75svh] max-[600px]:w-(--track-m) max-[600px]:px-[7vw]"
        >
          {/* The introduction takes the first slot, so the section title is the
              first thing on the track. */}
          <div className="w-[30vw] min-w-[19rem] shrink-0 max-[600px]:w-[86vw]">
            <Eyebrow index={eyebrowIndex}>{eyebrow}</Eyebrow>
            <h2 className="mt-4 font-ui text-[clamp(1.9rem,3.1vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-balance max-[600px]:text-[8.4vw]">
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-[clamp(0.95rem,1.15vw,1.2rem)] leading-relaxed text-muted-foreground max-[600px]:text-[4.4vw]">
              {lead}
            </p>
          </div>

          <div className="relative h-full w-full">
            <div className="absolute left-0 top-[49%] flex h-fit w-full items-center">
              <div className="size-[.8vw] min-h-2 min-w-2 rounded-full max-[600px]:size-[2vw]" style={lineStyle} />
              <div className="journey-line h-px w-[0%] rounded-full" style={lineStyle} />
              <div className="size-[.8vw] min-h-2 min-w-2 rounded-full max-[600px]:size-[2vw]" style={lineStyle} />
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <p className="text-[clamp(0.8rem,1.1vw,1.1rem)] uppercase tracking-[0.2em] text-muted-foreground">
                  {topLabel}
                </p>
              </div>

              <div className="flex h-full w-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {top.map((item) => (
                  <Item key={item.id} item={item} side="top" />
                ))}
              </div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start">
              <div className="h-full w-[34%] pt-[2vw] max-[600px]:w-[30%] max-[600px]:pt-[5vw]">
                <p className="text-[clamp(0.8rem,1.1vw,1.1rem)] text-muted-foreground">{bottomLabel}</p>
              </div>

              <div className="ml-[7vw] flex h-full w-full gap-x-[20vw] max-[600px]:ml-[7vw] max-[600px]:gap-x-[40vw]">
                {bottom.map((item) => (
                  <Item key={item.id} item={item} side="bottom" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
