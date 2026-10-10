import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { business, hero } from '../data/site.config'
import { Badge, Button, Container } from '../components/ui'
import { BlurIn, Magnetic, SplitHeading } from '../components/motion'
import { HeroCarousel } from '../components/visuals'

const HomeMore = lazy(() => import('./HomeMore'))

/** True once the browser has had a quiet moment after the first paint. */
function useAfterFirstPaint() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const go = () => setReady(true)
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (ric) {
      const id = ric(go, { timeout: 700 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(go, 150)
    return () => window.clearTimeout(id)
  }, [])
  return ready
}

function Hero() {
  const [line1, line2] = hero.headline.split('|')

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_55%_at_50%_28%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[54rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <BlurIn y={10}>
            <Badge>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              {business.location} &middot; Est. {business.foundedYear}
            </Badge>
          </BlurIn>

          {/* Characters, not words: the headline is the one place on the page
              where the extra granularity earns the extra nodes. Fluid size so
              it never overflows a 360px screen. */}
          <SplitHeading
            as="h1"
            type="chars"
            className="mt-6 font-ui text-[clamp(2.05rem,8.6vw,2.6rem)] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl"
          >
            {line1}{' '}
            <br />
            <span className="text-brand-strong sm:underline-sweep sm:inline-block">{line2}</span>
          </SplitHeading>

          <BlurIn delay={0.15}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.lead}
            </p>
          </BlurIn>

          <BlurIn delay={0.24}>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Magnetic strength={0.25} className="w-full sm:w-auto">
                <Button href={hero.primaryCta.href} className="w-full sm:w-auto">
                  {hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
              <Magnetic strength={0.25} className="w-full sm:w-auto">
                <Button href={hero.secondaryCta.href} variant="outline" className="w-full sm:w-auto">
                  {hero.secondaryCta.label}
                </Button>
              </Magnetic>
            </div>
          </BlurIn>
        </div>
      </Container>

      {/* Full bleed: a marquee that stops at the container edge reads as a
          cropped list rather than something continuing past the screen. */}
      <BlurIn delay={0.3} y={30} className="relative mt-16 sm:mt-20">
        <HeroCarousel />
      </BlurIn>
    </section>
  )
}

/*
  The home page: the hero first, with the least possible JavaScript, then the
  rest once the hero has painted.
*/
export default function Home() {
  const rest = useAfterFirstPaint()
  return (
    <>
      <Hero />
      {rest && (
        <Suspense fallback={null}>
          <HomeMore />
        </Suspense>
      )}
    </>
  )
}
