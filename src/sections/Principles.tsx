import { Check, KeyRound, LifeBuoy, MessageSquare, Receipt, type LucideIcon } from 'lucide-react'

import { about } from '../data/site.config'
import { Container, SplitHead } from '../components/ui'
import { StaggerGrid } from '../components/motion'

/*
  What holds on every project, under the timeline on the process page, in
  GrowthLab's values form: a split heading, then each point as an icon, a
  title and a line, on soft grey tiles.
*/

const POINT_ICON: LucideIcon[] = [MessageSquare, Receipt, KeyRound, LifeBuoy]

export default function Principles() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SplitHead title="On every project" lead="The same four promises, whatever the size of the job." />
        <StaggerGrid className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {about.points.map((p, i) => {
            const Icon = POINT_ICON[i] ?? Check
            return (
              <div key={p.label} className="flex h-full min-h-[14rem] flex-col justify-between rounded-[20px] bg-surface p-7">
                <Icon className="h-7 w-7 text-foreground" aria-hidden="true" />
                <div>
                  <h3 className="font-ui text-xl font-semibold">{p.label}</h3>
                  <p className="mt-2 text-base leading-[1.4] text-muted-foreground">{p.value}.</p>
                </div>
              </div>
            )
          })}
        </StaggerGrid>
      </Container>
    </section>
  )
}
