import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { services } from '../data/site.config'
import { Container } from './ui'
import { MOTION_OK } from './motion'
import { Link } from '../router'

/*
  The services, one after another, each in its own band, and each said once.

  As a band scrolls in, the figure is revealed left to right with a clip,
  driven by that band's own scroll progress. The text does not move: it is
  there to be read. Bands alternate sides, each with a photo of that work
  being done (public/services).

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
  const clip = useTransform(scrollYProgress, [0, 0.7], ['inset(0 100% 0 0 round 20px)', 'inset(0 0% 0 0 round 20px)'])

  return (
    <div
      ref={ref}
      id={`service-${service.id}`}
      className={`grid items-center gap-10 py-14 sm:py-20 md:min-h-[78svh] md:grid-cols-2 md:gap-20 ${
        flip ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div>
        <p className="font-ui text-base font-medium text-muted-foreground">{service.index}</p>
        <h2 className="mt-3 font-ui text-4xl font-semibold leading-[1.2] text-balance sm:text-5xl">
          {service.title}
        </h2>
        <p className="mt-5 max-w-md text-lg leading-[1.4] text-muted-foreground">{service.promise}</p>
        {/* GrowthLab shows what a service includes as soft square chips. */}
        <ul className="mt-7 grid max-w-lg gap-3 sm:grid-cols-2" aria-label={`${service.title} includes`}>
          {service.deliverables.map((d) => (
            <li key={d} className="rounded-[16px] bg-surface px-4 py-4 font-ui text-base font-medium leading-snug text-foreground">
              {d}
            </li>
          ))}
        </ul>
        <Link
          to={`/contact?service=${service.id}`}
          className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-ink px-7 font-ui text-base font-semibold text-white transition-colors hover:bg-[#2b2b2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Get a quote
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <motion.div style={motionOn ? { opacity, clipPath: clip } : undefined} className="relative">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-surface">
          <img
            src={`${import.meta.env.BASE_URL}${service.image.src}`}
            alt={service.image.alt}
            width={1600}
            height={1067}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
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
