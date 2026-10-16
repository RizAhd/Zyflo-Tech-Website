import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

import { services } from '../data/site.config'
import { Container, SectionHead } from './ui'
import { MOTION_OK } from './motion'
import { ServiceScene } from './scenes'

/*
  The services as a list you open one at a time.

  A column of the seven services on the left; the one that is open shows its
  promise and what it includes. On the right, a figure of that service slides
  in. Nothing advances by itself: a service opens when it is chosen, from the
  list, the arrows, or a link elsewhere on the site (#service-web and so on).

  Built as a disclosure list (a button that expands its own region), which is
  the honest pattern for "open one of these", not a tablist that has to manage
  arrow keys and a separate panel.

  With motion off the figure simply swaps and the list does not animate.
*/

const variants = {
  enter: (dir: number) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: (dir: number) => ({ zIndex: 0, y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
}

export default function ServiceTabs() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)

  const go = useCallback((next: number, dir?: number) => {
    setActive((cur) => {
      const target = (next + services.length) % services.length
      setDirection(dir ?? (target > cur ? 1 : -1))
      return target
    })
  }, [])

  // A link elsewhere on the site (a service card on the home page) can point
  // at one service: open it.
  useEffect(() => {
    const open = (hash: string) => {
      const i = services.findIndex((s) => `#service-${s.id}` === hash)
      if (i >= 0) go(i)
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href*="#service-"]')
      if (a) open(`#${(a.getAttribute('href') ?? '').split('#')[1] ?? ''}`)
    }
    document.addEventListener('click', onClick)

    // Opened on a link to one service: switch to it, then bring it into view
    // once the open and closing items have finished resizing.
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
    <section id="services" className="py-20 sm:py-24">
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
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,#fdfaf1,#e9eefd)] sm:aspect-[16/9] lg:aspect-[16/11]">
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
                <p className="hidden rounded-full bg-card/85 px-3.5 py-1.5 font-ui text-xs font-medium text-foreground backdrop-blur-md sm:block">
                  <span className="text-brand-strong">{current.index}</span> {current.title}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(active - 1, -1)}
                    aria-label="Previous service"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/85 text-foreground backdrop-blur-md transition-transform hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-90"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(active + 1, 1)}
                    aria-label="Next service"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/85 text-foreground backdrop-blur-md transition-transform hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-90"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-5">
            {services.map((s, i) => {
              const isActive = i === active
              return (
                <div key={s.id} className="relative border-t border-border first:border-t-0">
                  <h2 className="m-0">
                    <button
                      type="button"
                      id={`service-${s.id}`}
                      aria-expanded={isActive}
                      aria-controls={`service-panel-${s.id}`}
                      onClick={() => {
                        if (i !== active) go(i)
                      }}
                      className={`group relative flex w-full items-start gap-4 py-5 pl-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand sm:py-6 ${
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {/* The rail: blue on the open service. */}
                      <span
                        className={`absolute bottom-0 left-0 top-0 w-0.5 transition-colors duration-300 ${
                          isActive ? 'bg-brand-strong' : 'bg-border'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="mt-1.5 font-display text-[11px] tabular-nums" aria-hidden="true">
                        {s.index}
                      </span>
                      <span className="font-ui text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                        {s.title}
                      </span>
                    </button>
                  </h2>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`service-panel-${s.id}`}
                        role="region"
                        aria-labelledby={`service-${s.id}`}
                        initial={motionOn ? { opacity: 0, height: 0 } : false}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={motionOn ? { opacity: 0, height: 0 } : undefined}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden pl-[3.1rem]"
                      >
                        <p className="max-w-md pb-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {s.promise}
                        </p>
                        <ul className="mt-4 space-y-2 pb-5">
                          {s.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/80">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
