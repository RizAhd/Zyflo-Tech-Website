import { ArrowUpRight } from 'lucide-react'

import { LOGO_SRC } from '../data/assets'
import { whatsapp } from '../data/contact'
import { Button, Container } from './ui'
import { BlurIn, Magnetic, SplitHeading } from './motion'

/*
  The close of every page, GrowthLab's "Ready to Grow Your Brand?": one
  floating object, a big centred heading, one line under it and the button
  to the next step. GrowthLab's object is a glossy 3D knot; here it is the Z
  mark, tilted and floating on a soft green glow.

  Each page passes its own words and its own next step, so the close is never
  the same sentence twice across the site.
*/
export default function ClosingCta({
  title,
  body,
  to,
  label,
  showWhatsapp = false,
}: {
  title: React.ReactNode
  body: string
  to: string
  label: string
  /** Add a second, outlined WhatsApp button beside the main one. */
  showWhatsapp?: boolean
}) {
  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-center text-center">
        <BlurIn y={24}>
          <div className="relative animate-float">
            <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
            <img
              src={LOGO_SRC}
              alt=""
              width={168}
              height={168}
              className="h-32 w-32 rotate-[-8deg] rounded-[32px] shadow-[0_40px_70px_-30px_rgba(0,117,62,0.65)] sm:h-40 sm:w-40"
            />
          </div>
        </BlurIn>
        <SplitHeading className="mt-12 max-w-3xl font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px]">
          {title}
        </SplitHeading>
        <BlurIn delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-[1.4] text-muted-foreground sm:text-lg">{body}</p>
        </BlurIn>
        <BlurIn delay={0.18}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.25}>
              <Button href={to}>
                {label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Magnetic>
            {showWhatsapp && whatsapp && (
              <Magnetic strength={0.25}>
                <Button href={whatsapp} external variant="outline">
                  Message on WhatsApp
                </Button>
              </Magnetic>
            )}
          </div>
        </BlurIn>
      </Container>
    </section>
  )
}
