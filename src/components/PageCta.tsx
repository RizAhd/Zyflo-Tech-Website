import { ArrowRight } from 'lucide-react'

import { Button, Container, Eyebrow } from './ui'
import { BlurIn, Magnetic, SplitHeading } from './motion'

/*
  The closing band of a page: one sentence about where to go next and one
  button. Each page points at the next step of a visit (services, how it works,
  the work, the studio, then contact), so a reader is never left at a dead end.

  With an `image` the band splits in two: the text on the left, the photo on
  the right (above the text on a phone). Without one it stays centred.
*/
export default function PageCta({
  eyebrow = 'Next',
  title,
  body,
  to,
  label,
  image,
}: {
  eyebrow?: string
  title: string
  body: string
  to: string
  label: string
  image?: { src: string; alt: string }
}) {
  const split = Boolean(image)
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <Container>
        <div
          className={`relative overflow-hidden rounded-[2rem] bg-ink text-white ${
            split ? 'grid items-center gap-8 p-4 sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8' : 'px-6 py-14 sm:px-14 sm:py-20'
          }`}
        >
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[110px]"
            aria-hidden="true"
          />
          {image && (
            <BlurIn y={16} className="relative lg:order-2">
              <img
                src={`${import.meta.env.BASE_URL}${image.src}`}
                alt={image.alt}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full rounded-[1.4rem] object-cover"
              />
            </BlurIn>
          )}
          <div
            className={`relative flex flex-col ${
              split ? 'items-start px-2 pb-6 text-left sm:px-4 lg:order-1 lg:pb-0 lg:pl-8' : 'mx-auto max-w-2xl items-center text-center'
            }`}
          >
            <BlurIn y={10}>
              <Eyebrow onInk>{eyebrow}</Eyebrow>
            </BlurIn>
            <SplitHeading className="mt-4 font-ui text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance text-white sm:text-4xl md:text-5xl">
              {title}
            </SplitHeading>
            <BlurIn delay={0.1}>
              <p className="mt-5 text-balance text-base leading-relaxed text-ink-muted sm:text-lg">{body}</p>
            </BlurIn>
            <BlurIn delay={0.18}>
              <div className="mt-9">
                <Magnetic strength={0.25}>
                  <Button href={to} variant="accent">
                    {label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Magnetic>
              </div>
            </BlurIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
