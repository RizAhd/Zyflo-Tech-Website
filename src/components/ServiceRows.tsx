import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { services } from '../data/site.config'
import { Link } from '../router'
import { MOTION_OK } from './motion'

/*
  The services as GrowthLab's service rows. Every service is a slim row: its
  number, a small group label, its name and a "Get a quote" pill. One row is
  open at a time, and the open row becomes a dark panel with the service's
  photo, its promise and what it includes as chips. The first one starts
  open; a row opens when its name is chosen.

  Built as a disclosure list: each name is a button that expands its own
  region. The quote pill is a separate link beside it, never inside it.
*/

const GROUP: Record<string, string> = {
  web: 'Build',
  software: 'Build',
  mobile: 'Build',
  ai: 'AI',
  video: 'AI',
  marketing: 'Grow',
  social: 'Grow',
}

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

function QuotePill({ id, onInk = false }: { id: string; onInk?: boolean }) {
  return (
    <Link
      to={`/contact?service=${id}`}
      className={`inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full px-7 font-ui text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        onInk ? 'bg-white text-ink hover:bg-[#ebebeb]' : 'bg-ink text-white hover:bg-[#2b2b2b]'
      }`}
    >
      Get a quote
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}

export default function ServiceRows() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [open, setOpen] = useState(0)

  return (
    <div className="mt-14 border-t border-border">
      {services.map((s, i) => {
        const isOpen = i === open
        return (
          <div
            key={s.id}
            className={`border-b transition-colors duration-300 ${isOpen ? 'border-transparent bg-ink text-white' : 'border-border'}`}
          >
            <div className="mx-auto flex w-full max-w-[75rem] items-center gap-4 px-5 py-6 sm:gap-8 sm:px-8 sm:py-7">
              <span className={`w-8 shrink-0 font-ui text-sm font-medium ${isOpen ? 'text-white/70' : 'text-muted-foreground'}`}>
                {s.index}
              </span>
              <h3 className="m-0 min-w-0 flex-1">
                <button
                  type="button"
                  id={`row-${s.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`row-panel-${s.id}`}
                  onClick={() => setOpen(i)}
                  className="group flex w-full flex-col items-start rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <span className={`text-sm font-medium ${isOpen ? 'text-brand-bright' : 'text-brand-strong'}`}>
                    {GROUP[s.id] ?? 'Service'}
                  </span>
                  <span
                    className={`mt-1 font-ui text-2xl font-semibold leading-[1.2] transition-colors sm:text-4xl md:text-5xl ${
                      isOpen ? 'text-white' : 'text-foreground group-hover:text-brand-strong'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              </h3>
              <span className="hidden sm:inline-flex">
                <QuotePill id={s.id} onInk={isOpen} />
              </span>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`row-panel-${s.id}`}
                  role="region"
                  aria-labelledby={`row-${s.id}`}
                  initial={motionOn ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={motionOn ? { height: 0, opacity: 0 } : undefined}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mx-auto grid w-full max-w-[75rem] gap-8 px-5 pb-10 sm:px-8 md:grid-cols-12 md:gap-10 md:pb-12">
                    <div className="md:col-span-5 md:col-start-2">
                      <img
                        src={img(s.image.src)}
                        alt={s.image.alt}
                        width={1600}
                        height={1067}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full rounded-2xl object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center md:col-span-6">
                      <p className="max-w-lg text-base leading-[1.4] text-white/80 sm:text-lg">{s.promise}</p>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={`${s.title} includes`}>
                        {s.deliverables.map((d) => (
                          <li key={d} className="rounded-2xl bg-white px-4 py-4 font-ui text-base font-medium leading-snug text-ink">
                            {d}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 sm:hidden">
                        <QuotePill id={s.id} onInk />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
