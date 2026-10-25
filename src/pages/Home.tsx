import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

import { hero, homeFacts } from '../data/site.config'
import { whatsapp } from '../data/contact'
import { Button, Container } from '../components/ui'
import { BlurIn, Magnetic, SplitHeading } from '../components/motion'
import HandwritingText from '../components/HandwritingText'
import HeroLine from '../components/HeroLine'

const HomeMore = lazy(() => import('./HomeMore'))
const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

/*
  The hero, in the GrowthLab form: one big line across the full width (its
  last word changing), then a full width photo band that carries the real
  heading, the facts and the buttons.
*/
function Hero() {
  const [line1, line2] = hero.headline.split('|')

  return (
    <section id="top" className="pt-24 sm:pt-28">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 xl:px-0">
        <BlurIn y={16}>
          <HeroLine />
        </BlurIn>
      </div>

      {/* The band: full bleed, a real photo under a black to green shade. */}
      <div className="relative mt-5 overflow-hidden bg-ink text-white sm:mt-8">
        <img
          src={img('studio/studio.webp')}
          alt=""
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.55)_55%,rgba(17,17,17,0.25)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(0,117,62,0.45),transparent)]"
          aria-hidden="true"
        />

        <Container className="relative flex min-h-[78svh] flex-col justify-between gap-16 py-10 sm:py-12">
          <ul className="grid grid-cols-3 gap-4 sm:gap-8" aria-label="At a glance">
            {homeFacts.map((f, i) => (
              <li key={f.label} className={i === 1 ? 'sm:justify-self-center' : i === 2 ? 'sm:justify-self-end' : ''}>
                <BlurIn delay={0.2 + i * 0.06}>
                  <span className="block font-ui text-2xl font-bold sm:text-[28px]">{f.value}</span>
                  <span className="mt-1 block max-w-[12rem] text-sm leading-[1.4] text-white/85 sm:text-base">{f.label}</span>
                </BlurIn>
              </li>
            ))}
          </ul>

          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {/* Characters, not words: the headline is the one place on the page
                  where the extra granularity earns the extra nodes. */}
              <h1 className="font-ui text-[clamp(2.1rem,7.4vw,4.5rem)] font-bold leading-[1.05]">
                <SplitHeading as="span" type="chars" className="block">
                  {line1}
                </SplitHeading>
                {/* The second line is written by pen, then inked in, in the same face. */}
                <span className="block text-brand-bright">
                  <HandwritingText text={line2} />
                </span>
              </h1>
              <BlurIn delay={0.15}>
                <p className="mt-5 max-w-xl text-base leading-[1.4] text-white/80 sm:text-lg">{hero.lead}</p>
              </BlurIn>
              <BlurIn delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Magnetic strength={0.25} className="w-full sm:w-auto">
                    {/* WhatsApp is how most visitors reach out, so it leads. */}
                    {whatsapp ? (
                      <Button href={whatsapp} external variant="accent" className="w-full sm:w-auto">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Message on WhatsApp
                      </Button>
                    ) : (
                      <Button href={hero.primaryCta.href} variant="accent" className="w-full sm:w-auto">
                        {hero.primaryCta.label}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </Magnetic>
                  <Magnetic strength={0.25} className="w-full sm:w-auto">
                    <Button href={hero.secondaryCta.href} variant="onInk" className="w-full sm:w-auto">
                      {hero.secondaryCta.label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Magnetic>
                </div>
              </BlurIn>
            </div>

          </div>
        </Container>
      </div>
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
