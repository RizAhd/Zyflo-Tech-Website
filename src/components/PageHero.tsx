import type { ReactNode } from 'react'

import { Container } from './ui'
import { BlurIn, SplitHeading } from './motion'

/*
  The top of an inner page, GrowthLab's form: the page heading large, bold
  and centred, with one short muted line under it, then whatever the page
  wants to put beneath (jump links, a statement). The h1 of the page.
*/
export default function PageHero({ title, lead, children }: { title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <section className="pb-16 pt-32 sm:pb-20 sm:pt-40">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <SplitHeading as="h1" className="font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px]">
            {title}
          </SplitHeading>
          {lead && (
            <BlurIn delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-base leading-[1.4] text-muted-foreground sm:text-lg">{lead}</p>
            </BlurIn>
          )}
        </div>
        {children}
      </Container>
    </section>
  )
}
