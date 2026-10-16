import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

import { services } from '../data/site.config'
import { Container } from './ui'
import { MOTION_OK } from './motion'
import { ServiceScene } from './scenes'
import { Link } from '../router'

/*
  The services, one after another, each in its own band, and each said once.

  As a band scrolls in, the figure is revealed left to right with a clip,
  driven by that band's own scroll progress. The text does not move: it is
  there to be read. Bands alternate sides. A service shows its photo when it
  has one (public/services) and the drawn product screen until then.

  Every band carries the id `service-<id>`, which is what the jump links on
  this page, the home page cards and the footer point at.

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

  return (
    <div
      ref={ref}
      id={`service-${service.id}`}
      className={`grid items-center gap-10 py-14 sm:py-20 md:min-h-[78svh] md:grid-cols-2 md:gap-20 ${
        flip ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-brand-strong">
          {service.index}
        </p>
        <h2 className="mt-3 font-ui text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-balance sm:text-5xl">
          {service.title}
        </h2>
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
        <Link
          to={`/contact?service=${service.id}`}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full font-ui text-sm font-medium text-brand-strong hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Get a quote for this
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <motion.div style={motionOn ? { opacity, clipPath: clip } : undefined} className="relative">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-border bg-white">
          {service.image ? (
            <img
              src={`${import.meta.env.BASE_URL}${service.image.src}`}
              alt={service.image.alt}
              width={1600}
              height={1100}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
              <ServiceScene id={service.id} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function FeatureParallax() {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches

  return (
    <section aria-label="Services in detail" className="pb-20 sm:pb-24">
      <Container>
        <div className="divide-y divide-border">
          {services.map((s, i) => (
            <Band key={s.id} service={s} flip={i % 2 === 1} motionOn={motionOn} />
          ))}
        </div>
      </Container>
    </section>
  )
}
