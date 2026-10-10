import { capabilities, services } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import { StaggerGrid } from '../components/motion'
import { Link } from '../router'
import { SERVICE_ICON } from './icons'
import { Globe } from 'lucide-react'

export default function Capabilities() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* A tinted band with no edge. A hairline plus an abrupt tone change made
          this read as a slab dropped onto the page; fading the tint in and out
          keeps the tonal relief without drawing a line across the document. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-muted)_16%,var(--color-muted)_84%,transparent)]"
      />
      <Container className="relative">
        <SectionHead
          eyebrow="Capabilities"
          title={
            <>
              Everything under <span className="text-brand-strong">one roof</span>.
            </>
          }
          lead="Twenty-one things I build and run regularly. Most projects are two or three of them stitched together, so you brief once and one person carries it end to end."
          align="center"
        />

        {/* Seven rows, one per service, instead of twenty-one identical chips.
            Each capability still points at the service card that owns it, the
            same anchor the structured data references. */}
        <StaggerGrid className="mt-14 flex flex-col gap-3" stagger={0.06}>
          {services.map((s) => {
            const Icon = SERVICE_ICON[s.id] ?? Globe
            const items = capabilities.filter((c) => c.service === s.id)
            return (
              <div
                key={s.id}
                className="group grid items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-colors duration-300 hover:border-brand/40 sm:p-5 lg:grid-cols-[17rem_1fr] lg:gap-8"
              >
                <Link
                  to={`/services/#service-${s.id}`}
                  className="flex items-center gap-3.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="font-ui text-base font-semibold leading-snug">{s.title}</span>
                </Link>
                <ul className="flex flex-wrap gap-x-7 gap-y-2 lg:justify-end">
                  {items.map((c) => (
                    <li key={c.title}>
                      <Link
                        to={`/services/#service-${c.service}`}
                        className="inline-flex min-h-[32px] items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-strong focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden="true" />
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </StaggerGrid>
      </Container>
    </section>
  )
}
