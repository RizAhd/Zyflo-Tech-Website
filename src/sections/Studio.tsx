import { ArrowRight } from 'lucide-react'

import { about, business, clients } from '../data/site.config'
import { LOGO_SRC } from '../data/assets'
import { Button, Container, Eyebrow } from '../components/ui'
import { BlurIn, Magnetic, Parallax, SplitHeading, Tilt } from '../components/motion'

export default function Studio() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <BlurIn y={12}>
              <Eyebrow>The studio</Eyebrow>
            </BlurIn>
            <SplitHeading as="h1" className="mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance sm:text-4xl md:text-5xl">
              {about.heading}
            </SplitHeading>
            {about.body.map((para, i) => (
              <BlurIn key={i} delay={0.1 + i * 0.08}>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{para}</p>
              </BlurIn>
            ))}
            <BlurIn delay={0.3}>
              <div className="mt-9">
                <Magnetic strength={0.25}>
                  <Button href="/contact">
                    Start a project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Magnetic>
              </div>
            </BlurIn>
          </div>

          <Parallax distance={40}>
            <Tilt max={5}>
              <div className="rounded-card border border-border bg-white p-8 shadow-[0_20px_50px_-32px_rgba(6,52,28,0.35)]">
                <img
                  src={LOGO_SRC}
                  alt="Zyflo Tech logo"
                  width={56}
                  height={56}
                  className="rounded-xl"
                />
                <p className="mt-5 font-ui text-lg font-semibold">
                  {business.name} &middot; {business.owner}
                </p>
                <p className="text-sm text-muted-foreground">
                  {business.tagline} &middot; {business.location}
                </p>

                <dl className="mt-7 divide-y divide-border border-t border-border">
                  <div className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-sm text-muted-foreground">Since</dt>
                    <dd className="text-right font-ui text-sm font-medium">{business.foundedMonth} {business.foundedYear}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-sm text-muted-foreground">Shipped for</dt>
                    <dd className="text-right font-ui text-sm font-medium">
                      {clients.map((c) => c.name).join(', ')}
                    </dd>
                  </div>
                  {about.points.map((p) => (
                    <div key={p.label} className="flex items-baseline justify-between gap-6 py-3.5">
                      <dt className="text-sm text-muted-foreground">{p.label}</dt>
                      <dd className="text-right font-ui text-sm font-medium">{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt>
          </Parallax>
        </div>
      </Container>
    </section>
  )
}
