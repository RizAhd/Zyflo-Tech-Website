import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'

import { hero } from '../data/site.config'
import { whatsapp } from '../data/contact'
import { Button, Container } from '../components/ui'
import { BlurIn, Magnetic, SplitHeading } from '../components/motion'
import HandwritingText from '../components/HandwritingText'
import PageLine from '../components/PageLine'
import ServiceTicker from '../components/ServiceTicker'

const HomeMore = lazy(() => import('./HomeMore'))

function Hero() {
  const [line1, line2] = hero.headline.split('|')

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
      {/* Pure white behind the headline: no glow, no pattern. */}
      <Container className="relative w-full">
        <div className="mx-auto max-w-3xl text-center">
          {/* Characters, not words: the headline is the one place on the page
              where the extra granularity earns the extra nodes. Fluid size so
              it never overflows a 360px screen. */}
          <h1 className="font-ui text-[clamp(2.05rem,8.6vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance sm:text-6xl md:text-7xl">
            <SplitHeading as="span" type="chars" className="block">
              {line1}
            </SplitHeading>
            {/* The second line is written by pen, then inked in, in the same face. */}
            <span className="text-brand-strong sm:underline-sweep sm:inline-block">
              <HandwritingText text={line2} />
            </span>
          </h1>

          {/* The services, one at a time, once the pen has finished. */}
          <ServiceTicker className="mt-5" />

          <BlurIn delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.lead}
            </p>
          </BlurIn>

          <BlurIn delay={0.24}>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Magnetic strength={0.25} className="w-full sm:w-auto">
                {/* WhatsApp is how most visitors reach out, so it leads. Without a
                    number the button falls back to the contact page. */}
                {whatsapp ? (
                  <Button href={whatsapp} external className="w-full sm:w-auto">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Message on WhatsApp
                  </Button>
                ) : (
                  <Button href={hero.primaryCta.href} className="w-full sm:w-auto">
                    {hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
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
    </section>
  )
}

/*
  The home page: the hero first, then the rest of the page. The lower half is
  its own chunk, requested the moment the hero has been committed: early
  enough that it is there before anyone scrolls, late enough that it does not
  compete with the hero for the first paint.
*/
export default function Home() {
  const [rest, setRest] = useState(false)
  useEffect(() => setRest(true), [])
  return (
    <PageLine>
      <Hero />
      {rest && (
        <Suspense fallback={null}>
          <HomeMore />
        </Suspense>
      )}
    </PageLine>
  )
}
