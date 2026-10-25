import { ArrowUpRight } from 'lucide-react'

import { LOGO_SRC } from '../data/assets'
import { whatsapp } from '../data/contact'
import { Button, Container } from './ui'
import { BlurIn, Magnetic, SplitHeading } from './motion'

/*
  The close of every page, GrowthLab's "Ready to Grow Your Brand?": one
  floating object, a big centred heading, one line under it and the button
  to the next step. GrowthLab's object is a glossy 3D knot; here it is the Z
  mark, tilted and floating on a soft green glow, or a real photo when the
  page passes one.

  Each page passes its own words and its own next step, so the close is never
  the same sentence twice across the site.
*/
export default function ClosingCta({
  title,
  body,
  to,
  label,
  showWhatsapp = false,
  image,
}: {
  title: React.ReactNode
  body: string
  to: string
  label: string
  /** Add a second, outlined WhatsApp button beside the main one. */
  showWhatsapp?: boolean
  /** A real photo in place of the floating Z mark. */
  image?: { src: string; alt: string }
}) {
  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-center text-center">
        {image ? (
          <BlurIn y={24} className="w-full max-w-2xl">
            <img
              src={`${import.meta.env.BASE_URL}${image.src}`}
              alt={image.alt}
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full animate-float rounded-[20px] object-cover shadow-[0_40px_80px_-40px_rgba(17,17,17,0.55)]"
            />
          </BlurIn>
        ) : (
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
        )}
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
