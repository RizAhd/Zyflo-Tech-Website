import { ArrowRight } from 'lucide-react'

import { Button, Container, Eyebrow } from './ui'
import { BlurIn, Magnetic, SplitHeading } from './motion'

/*
  The closing band of a page: one sentence about where to go next and one
  button. Each page points at the next step of a visit (services, how it works,
  the work, the person, then contact), so a reader is never left at a dead end.
*/
export default function PageCta({
  eyebrow = 'Next',
  title,
  body,
  to,
  label,
}: {
  eyebrow?: string
  title: string
  body: string
  to: string
  label: string
}) {
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-14 sm:py-20">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-bright/15 blur-[110px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <BlurIn y={10}>
              <Eyebrow onInk>{eyebrow}</Eyebrow>
            </BlurIn>
            <SplitHeading className="mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
              {title}
            </SplitHeading>
            <BlurIn delay={0.1}>
              <p className="mt-5 text-balance text-base leading-relaxed text-ink-muted">{body}</p>
            </BlurIn>
            <BlurIn delay={0.18}>
              <div className="mt-9">
                <Magnetic strength={0.25}>
                  <Button href={to}>
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
