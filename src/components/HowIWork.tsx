import { ArrowRight } from 'lucide-react'

import { Button, Container, Eyebrow } from './ui'

/*
  The studio's way of working in one short block. The line that runs down the
  right edge of the home page (see PageLine) passes by it; this section itself
  is plain text and does not pin or move.
*/
export default function HowIWork() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="max-w-xl">
          <Eyebrow>How I work</Eyebrow>
          <h2 className="mt-4 font-ui text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            One line from the first message to <span className="text-brand-strong">handover</span>.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            You brief one person and that same person carries it through: the scope, the design, the build
            and the handover. Nothing gets passed along, so nothing gets lost.
          </p>
          <div className="mt-9">
            <Button href="/process">
              See how a project runs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
