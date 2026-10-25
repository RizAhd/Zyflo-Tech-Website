import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { services } from '../data/site.config'
import { MOTION_OK } from './motion'

/*
  Under the hero headline: the seven services, one at a time, in green.

  It waits until the hand written line has finished, so the two never move at
  once, then slides each service up into place every couple of seconds. A
  screen reader gets the whole list once, as plain text, instead of a line
  that keeps changing. With motion off the line is not shown at all; the lead
  below already names what the studio does.
*/

const START_AFTER = 2600
const EVERY = 2200

export default function ServiceTicker({
  className = '',
  onInk = false,
  startAfter = START_AFTER,
}: {
  className?: string
  onInk?: boolean
  /** Milliseconds before the first service shows. */
  startAfter?: number
}) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [i, setI] = useState(-1)

  useEffect(() => {
    if (!motionOn) return
    let tick = 0
    const start = window.setTimeout(() => {
      setI(0)
      tick = window.setInterval(() => setI((n) => (n + 1) % services.length), EVERY)
    }, startAfter)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(tick)
    }
  }, [motionOn, startAfter])

  if (!motionOn) return null

  return (
    <p className={className}>
      <span className="sr-only">Services: {services.map((s) => s.title).join(', ')}.</span>
      <span
        aria-hidden="true"
        className={`relative flex h-[1.6em] items-center overflow-hidden font-ui text-base font-medium sm:text-xl ${
          onInk ? 'text-brand-bright' : 'mx-auto justify-center text-brand-strong'
        }`}
      >
        <AnimatePresence initial={false} mode="wait">
          {i >= 0 && (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="whitespace-nowrap"
            >
              {services[i].title}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </p>
  )
}
