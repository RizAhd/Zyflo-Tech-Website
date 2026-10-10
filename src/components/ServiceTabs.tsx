import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

import { services } from '../data/site.config'
import { Container, SectionHead } from './ui'
import { MOTION_OK } from './motion'
import { ServiceScene } from './scenes'

/*
  The services section as vertical tabs.

  A column of the seven services on the left; the one that is open shows its
  promise and what it includes, and a thin progress bar beside it counts down
  to the next. On the right, a figure of that service at work slides in. It
  advances by itself every few seconds while the section is on screen, stops
  while the pointer is over the figure, and any click takes over.

  The figures are the same drawn product screens as before (a page being
  built, a pipeline running, a video cut playing back), not photographs.

  With motion off there is no autoplay and no sliding: a tab is just a tab.
*/

const AUTO_PLAY_MS = 5500

const variants = {
  enter: (dir: number) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: (dir: number) => ({ zIndex: 0, y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
}

export default function ServiceTabs() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  const go = useCallback((next: number, dir?: number) => {
    setActive((cur) => {
      const target = (next + services.length) % services.length
      setDirection(dir ?? (target > cur ? 1 : -1))
      return target
    })
  }, [])
  const next = useCallback(() => go(active + 1, 1), [go, active])
  const prev = useCallback(() => go(active - 1, -1), [go, active])

  // Only count down while the section is actually on screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = motionOn && visible && !paused

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(next, AUTO_PLAY_MS)
    return () => window.clearTimeout(t)
  }, [running, next, active])

  // A link elsewhere on the page (the capabilities list) can point at one
  // service: open that tab.
  useEffect(() => {
    const open = (hash: string) => {
      const i = services.findIndex((s) => `#service-${s.id}` === hash)
      if (i >= 0) {
        setPaused(true)
        go(i)
      }
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href*="#service-"]')
      if (a) open(`#${(a.getAttribute('href') ?? '').split('#')[1] ?? ''}`)
    }
    document.addEventListener('click', onClick)

    // Opened on a link to one service: switch to it, then bring it into view
    // once the open and closing tabs have finished resizing.
    let settle: number | undefined
    const hash = window.location.hash
    if (hash.startsWith('#service-')) {
      open(hash)
      settle = window.setTimeout(
        () => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'center' }),
        500,
      )
    }
    return () => {
      document.removeEventListener('click', onClick)
      window.clearTimeout(settle)
    }
  }, [go])

  const current = services[active]

  return (
    <section id="services" ref={rootRef} className="py-20 sm:py-24">
      <Container>
        <SectionHead
          h1
          eyebrow="What I do"
          title={
            <>
              Seven ways to make the business <span className="text-brand-strong">run better</span>.
            </>
          }
          lead="Most projects touch more than one of these. Tell me the problem and I will tell you which of them it actually needs, including when the answer is less than you think."
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* The figure comes first on a phone, so the open service is seen
              before the list that controls it. */}
          <div className="order-1 lg:sticky lg:top-28 lg:order-2 lg:col-span-7">
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,#f8fbf9,#eef7f2)] sm:aspect-[16/9] lg:aspect-[16/11]">
                <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={motionOn ? variants : undefined}
                    initial={motionOn ? 'enter' : false}
                    animate={motionOn ? 'center' : undefined}
                    exit={motionOn ? 'exit' : undefined}
                    transition={{
                      y: { type: 'spring', stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0"
                    aria-hidden="true"
                  >
                    <ServiceScene id={current.id} />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="hidden rounded-full bg-white/85 px-3.5 py-1.5 font-ui text-xs font-medium text-foreground backdrop-blur-md sm:block">
                    <span className="text-brand-strong">{current.index}</span> {current.title}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPaused(false)
                        prev()
                      }}
                      aria-label="Previous service"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/85 text-foreground backdrop-blur-md transition-transform hover:bg-white active:scale-90"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaused(false)
                        next()
                      }}
                      aria-label="Next service"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/85 text-foreground backdrop-blur-md transition-transform hover:bg-white active:scale-90"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Services" className="order-2 lg:order-1 lg:col-span-5">
            {services.map((s, i) => {
              const isActive = i === active
              return (
                <div key={s.id} className="relative border-t border-border first:border-t-0">
                  <button
                    type="button"
                    role="tab"
                    id={`service-${s.id}`}
                    aria-selected={isActive}
                    aria-controls={`service-panel-${s.id}`}
                    onClick={() => {
                      setPaused(false)
                      if (i !== active) go(i)
                    }}
                    className={`group relative flex w-full items-start gap-4 py-5 pl-5 text-left transition-colors duration-300 sm:py-6 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {/* The rail, and the bar that fills it while this tab is open. */}
                    <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-border" aria-hidden="true">
                      {isActive && (
                        <motion.span
                          key={`${active}-${running}`}
                          className="absolute left-0 top-0 w-full origin-top bg-brand-strong"
                          initial={{ height: motionOn ? '0%' : '100%' }}
                          animate={{ height: !motionOn || running ? '100%' : '0%' }}
                          transition={{
                            duration: motionOn && running ? AUTO_PLAY_MS / 1000 : 0,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </span>

                    <span className="mt-1.5 font-display text-[11px] tabular-nums opacity-60">{s.index}</span>

                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="font-ui text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                        {s.title}
                      </span>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.span
                            id={`service-panel-${s.id}`}
                            role="tabpanel"
                            initial={motionOn ? { opacity: 0, height: 0 } : false}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={motionOn ? { opacity: 0, height: 0 } : undefined}
                            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                            className="block overflow-hidden"
                          >
                            <span className="block max-w-md pb-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                              {s.promise}
                            </span>
                            <span className="mt-4 block space-y-2 pb-1">
                              {s.deliverables.map((d) => (
                                <span key={d} className="flex items-start gap-2.5 text-sm text-foreground/80">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                                  {d}
                                </span>
                              ))}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
