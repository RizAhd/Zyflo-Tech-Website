import { useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { Check } from 'lucide-react'

import { services } from '../data/site.config'
import { Container, Eyebrow } from './ui'
import { MOTION_OK } from './motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

/*
  The services section, as a pinned horizontal timeline.

  The section is tall; inside it a screen-sized panel sticks to the top while
  the scroll position slides a wide track sideways. A line draws itself along
  the middle of the track, and each service grows a stem from it, with its
  number and name above or below and its one-line promise beneath.

  Seven services alternate above and below the line: four on top, three under,
  in order, so the eye zig-zags from 01 to 07 as the line reaches each one.

  Everything scales in vw so the composition keeps its proportions from a phone
  to a wide monitor. Text sizes are clamped, because plain vw would shrink the
  copy to nothing on a tablet.

  With motion switched off (footer toggle) the section renders as a plain
  grid instead: no pinning, no sideways travel.
*/

const TOP = services.filter((_, i) => i % 2 === 0)
const BOTTOM = services.filter((_, i) => i % 2 === 1)

const lineStyle: CSSProperties = { backgroundColor: 'var(--color-brand-strong)' }

const TITLE = 'text-[clamp(1.2rem,2.3vw,2.6rem)] leading-[1.05] max-[600px]:text-[6.2vw]'
const BODY =
  'text-[clamp(0.85rem,1.25vw,1.35rem)] leading-[1.35] text-muted-foreground max-[600px]:text-[4.4vw]'

function Item({ s, side }: { s: (typeof services)[number]; side: 'top' | 'bottom' }) {
  const top = side === 'top'
  return (
    <div
      id={`service-${s.id}`}
      className={
        top
          ? 'relative h-full w-[30vw] min-w-[15rem] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]'
          : 'relative h-full w-[25vw] min-w-[14rem] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]'
      }
    >
      <div className={`absolute left-0 h-full w-full ${top ? 'bottom-0 top-0' : 'bottom-[-1%]'}`}>
        {top ? (
          <>
            <div
              className={`jd-${s.id} relative aspect-square size-[1vw] min-h-2.5 min-w-2.5 -translate-x-1/2 rounded-full max-[600px]:size-[2.5vw]`}
              style={lineStyle}
            />
            <div
              className={`jl-${s.id} h-[94%] w-px origin-bottom rounded-full`}
              style={lineStyle}
            />
          </>
        ) : (
          <>
            <div
              className={`jl-${s.id} h-[94%] w-px origin-top rounded-full max-[600px]:h-full`}
              style={lineStyle}
            />
            <div
              className={`jd-${s.id} relative aspect-square size-[1vw] min-h-2.5 min-w-2.5 -translate-x-1/2 rounded-full max-[600px]:size-[2.5vw]`}
              style={lineStyle}
            />
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
        <h3 className={`title-${s.id} font-ui font-semibold ${TITLE}`}>
          <span className="text-brand-strong">{s.index}</span> {s.title}
        </h3>
        <p className={`description-${s.id} w-[92%] ${BODY}`}>{s.promise}</p>
      </div>
    </div>
  )
}

function Heading({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Eyebrow index="01">What I do</Eyebrow>
      <h2 className="mt-4 font-ui text-[clamp(1.9rem,3.1vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-balance max-[600px]:text-[8.4vw]">
        Seven ways to make the business <span className="text-brand-strong">run better</span>.
      </h2>
      <p className="mt-5 max-w-md text-[clamp(0.95rem,1.15vw,1.2rem)] leading-relaxed text-muted-foreground max-[600px]:text-[4.4vw]">
        Most projects touch more than one of these. Tell me the problem and I will tell you
        which of them it actually needs, including when the answer is less than you think.
      </p>
    </div>
  )
}

/** Motion off: the same content as a plain, readable grid. */
function StaticServices() {
  return (
    <section id="services" className="py-20 sm:py-24">
      <Container>
        <Heading />
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} id={`service-${s.id}`} className="border-t border-border pt-5">
              <h3 className="font-ui text-lg font-semibold leading-snug">
                <span className="text-brand-strong">{s.index}</span> {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.promise}</p>
              <ul className="mt-4 space-y-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

export default function ServiceTimeline() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  return motionOn ? <PinnedTimeline /> : <StaticServices />
}

function PinnedTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cancelled = false
    let ctx: gsap.Context | undefined

    // Line splitting measures text, so it waits for the webfonts. Splitting on
    // the fallback face and then swapping fonts would break lines in the wrong
    // places.
    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (cancelled) return

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add({ mobile: '(max-width: 599px)', desktop: '(min-width: 600px)' }, (self) => {
          const mobile = Boolean((self.conditions as { mobile?: boolean }).mobile)

          const slidePercent = mobile ? -57 : -65
          const lineWidth = mobile ? '65%' : '98%'
          const lineStart = mobile ? 'top 30%' : 'top 25%'
          const slideEnd = mobile ? '82% 50%' : '92% bottom'
          const lineEnd = mobile ? '80% 50%' : '92% bottom'

          // The track slides as the section scrolls past.
          gsap
            .timeline({
              scrollTrigger: { trigger: section, start: 'top top', end: slideEnd, scrub: true },
              defaults: { ease: 'none' },
            })
            .fromTo(trackRef.current, { xPercent: 0 }, { xPercent: slidePercent })

          // The line along the middle draws itself.
          gsap.to('.journey-line', {
            width: lineWidth,
            ease: 'none',
            scrollTrigger: { trigger: section, start: lineStart, end: lineEnd, scrub: true },
          })

          const splits: SplitText[] = []

          // Where, as a percentage of the section, each service starts and
          // finishes revealing. Seven in a row, overlapping a little.
          const positions: ReadonlyArray<readonly [number, number]> = mobile
            ? [[22, 32], [28, 38], [36, 46], [45, 55], [52, 62], [60, 70], [69, 79]]
            : [[6, 26], [16, 36], [26, 46], [35, 55], [45, 65], [55, 75], [65, 85]]

          services.forEach((s, i) => {
            const [from, to] = positions[i]
            const isTop = i % 2 === 0

            gsap.set(`.jl-${s.id}`, { scaleY: 0, transformOrigin: isTop ? 'bottom' : 'top' })
            gsap.set(`.jd-${s.id}`, { scale: 0 })

            const title = new SplitText(`.title-${s.id}`, { type: 'lines', mask: 'lines' })
            const body = new SplitText(`.description-${s.id}`, { type: 'lines', mask: 'lines' })
            splits.push(title, body)

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: section,
                  start: `${from}% 30%`,
                  end: `${to}% 50%`,
                  scrub: true,
                },
              })
              .to(`.jl-${s.id}`, { scaleY: 1, duration: 0.5 })
              .to(`.jd-${s.id}`, { scale: 1, duration: 0.5 }, '<')
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

          return () => splits.forEach((sp) => sp.revert())
        })
      }, section)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-[max(200vw,260vh)] w-full max-[600px]:h-[400vh]"
    >
      <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden pt-[4.5rem]">
        <div
          ref={trackRef}
          className="mr-[2vw] flex h-[max(30vw,26rem)] w-[240vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[75svh] max-[600px]:w-[800vw] max-[600px]:px-[7vw]"
        >
          {/* The introduction takes the slot an image would, so the section
              title is the first thing on the track. */}
          <Heading className="w-[30vw] min-w-[19rem] shrink-0 max-[600px]:w-[86vw]" />

          <div className="relative h-full w-full">
            <div className="absolute left-0 top-[49%] flex h-fit w-full items-center">
              <div className="size-[.8vw] min-h-2 min-w-2 rounded-full max-[600px]:size-[2vw]" style={lineStyle} />
              <div className="journey-line h-px w-[0%] rounded-full" style={lineStyle} />
              <div className="size-[.8vw] min-h-2 min-w-2 rounded-full max-[600px]:size-[2vw]" style={lineStyle} />
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <p className="text-[clamp(0.8rem,1.1vw,1.1rem)] uppercase tracking-[0.2em] text-muted-foreground">
                  Keep scrolling
                </p>
              </div>

              <div className="flex h-full w-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {TOP.map((s) => (
                  <Item key={s.id} s={s} side="top" />
                ))}
              </div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start">
              <div className="h-full w-[34%] pt-[2vw] max-[600px]:w-[30%] max-[600px]:pt-[5vw]">
                <p className="text-[clamp(0.8rem,1.1vw,1.1rem)] text-muted-foreground">
                  One person, start to finish
                </p>
              </div>

              <div className="ml-[7vw] flex h-full w-full gap-x-[20vw] max-[600px]:ml-[7vw] max-[600px]:gap-x-[40vw]">
                {BOTTOM.map((s) => (
                  <Item key={s.id} s={s} side="bottom" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
