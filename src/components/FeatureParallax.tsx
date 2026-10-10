import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'

import { capabilities, services } from '../data/site.config'
import { Container, SectionHead } from './ui'
import { MOTION_OK } from './motion'
import { ServiceScene } from './scenes'

/*
  The services, one after another, each in its own band.

  As a band scrolls in, the text rises into place and the figure is revealed
  left to right with a clip, all driven by that band's own scroll progress.
  Bands alternate sides. The figures are the same drawn product screens used
  in the tabs above (a page being built, a pipeline running), not photographs.

  With motion off the bands are plain: text and figure, no scroll effects.
*/

type Service = (typeof services)[number]

function Band({ service, flip, motionOn }: { service: Service; flip: boolean; motionOn: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1])
  const clip = useTransform(scrollYProgress, [0, 0.7], ['inset(0 100% 0 0 round 1.5rem)', 'inset(0 0% 0 0 round 1.5rem)'])
  const rise = useTransform(scrollYProgress, [0, 1], [-40, 0])

  const chips = capabilities.filter((c) => c.service === service.id)

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 py-14 sm:py-20 md:min-h-[78svh] md:grid-cols-2 md:gap-20 ${
        flip ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <motion.div style={motionOn ? { y: rise } : undefined}>
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
          {service.index}
        </p>
        <h3 className="mt-3 font-ui text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          {service.title}
        </h3>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          {service.promise}
        </p>
        <ul className="mt-7 max-w-md space-y-2.5">
          {service.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/80 sm:text-base">
              <Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <ul className="mt-7 flex max-w-md flex-wrap gap-2" aria-label={`${service.title} work`}>
          {chips.map((c) => (
            <li key={c.title} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {c.title}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div style={motionOn ? { opacity, clipPath: clip } : undefined} className="relative">
        <div
          className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,#f8fbf9,#eef7f2)]"
          aria-hidden="true"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
          <ServiceScene id={service.id} />
        </div>
      </motion.div>
    </div>
  )
}

export default function FeatureParallax() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches

  return (
    <section id="in-detail" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow="In detail"
          title={
            <>
              Each service, <span className="text-brand-strong">up close</span>.
            </>
          }
          lead="What is included, what it looks like when it is working, and the pieces I build most often under it."
        />
        <div className="mt-6 divide-y divide-border">
          {services.map((s, i) => (
            <Band key={s.id} service={s} flip={i % 2 === 1} motionOn={motionOn} />
          ))}
        </div>
      </Container>
    </section>
  )
}
