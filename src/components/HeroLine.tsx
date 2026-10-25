import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { MOTION_OK } from './motion'

/*
  The one big line across the top of the home page, in Bebas Neue (the face
  of GrowthLab's huge MARKETING): "Scaling your vision with AI", where the
  last word keeps changing to the next thing the studio builds.

  Sized from the font itself so the longest version fills the width on one
  line: in Bebas Neue "SCALING YOUR VISION WITH MARKETING" is 11.72 em wide,
  so the size is the available width divided by 11.8. On a phone the line
  breaks after VISION and the size is set by "SCALING YOUR VISION" (6.38 em).
  The words stay left aligned so the fixed part never moves while the last
  word changes.

  A screen reader gets the whole sentence once, as plain text; the moving
  version is hidden from it. With motion off the first word simply stays.
*/

const WORDS = ['AI', 'Software', 'Websites', 'Apps', 'Marketing']
const EVERY = 2200

export default function HeroLine() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!motionOn) return
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), EVERY)
    return () => window.clearInterval(t)
  }, [motionOn])

  return (
    <p className="font-poster uppercase leading-[0.95] text-ink">
      <span className="sr-only">Scaling your vision with AI, software, websites, apps and marketing.</span>
      <span
        aria-hidden="true"
        className="block text-[calc((100vw-2.5rem)/6.45)] sm:text-[min(calc((100vw-4rem)/11.8),calc(1320px/11.8))]"
      >
        Scaling your vision <br className="sm:hidden" />
        with{' '}
        <span className="relative inline-flex h-[0.95em] overflow-hidden align-bottom">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={WORDS[i]}
              initial={motionOn ? { y: '100%' } : false}
              animate={{ y: '0%' }}
              exit={motionOn ? { y: '-100%' } : undefined}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="block bg-[linear-gradient(90deg,#0a0a0a_0%,#00753e_40%,#3ddc84_70%,#008b48_100%)] bg-clip-text text-transparent"
            >
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </p>
  )
}
