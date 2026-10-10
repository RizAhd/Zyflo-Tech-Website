import { Check, KeyRound, LifeBuoy, MessageSquare, Receipt, type LucideIcon } from 'lucide-react'

import { about } from '../data/site.config'
import { Container } from '../components/ui'
import { StaggerGrid } from '../components/motion'

const POINT_ICON: LucideIcon[] = [MessageSquare, Receipt, KeyRound, LifeBuoy]

export default function Principles() {
  return (
    <section className="relative py-16 sm:py-24">
      {/* A tinted band with no edge. A hairline plus an abrupt tone change made
          this read as a slab dropped onto the page; fading the tint in and out
          keeps the tonal relief without drawing a line across the document. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-muted)_16%,var(--color-muted)_84%,transparent)]"
      />
      <Container className="relative">
        <StaggerGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {about.points.map((p, i) => {
            const Icon = POINT_ICON[i] ?? Check
            return (
              <div key={p.label} className="group">
                <Icon className="h-5 w-5 text-brand transition-transform duration-300 group-hover:scale-110" />
                <p className="mt-4 font-ui text-base font-semibold">{p.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.value}</p>
              </div>
            )
          })}
        </StaggerGrid>
      </Container>
    </section>
  )
}
