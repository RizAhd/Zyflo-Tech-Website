import { ArrowUpRight } from 'lucide-react'

import { projects } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import { CardParallax, StaggerGrid, Tilt } from '../components/motion'
import { ProjectScene } from '../components/scenes'

export default function Work({
  ids,
  h1 = false,
}: {
  /** Show only these projects (the home page teaser). */
  ids?: string[]
  h1?: boolean
}) {
  const shown = projects.map((p, i) => ({ p, i })).filter(({ p }) => !ids || ids.includes(p.id))
  return (
    <section id="work" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          h1={h1}
          eyebrow="Selected work"
          title={
            <>
              Built, shipped and <span className="text-brand-strong">handed over</span>.
            </>
          }
          lead="A point of sale system for SJD, the website for mradventure.lk, and the invoicing tool the studio runs on. Each one was built by the same person who answers your enquiry."
        />

        <StaggerGrid
          className={`mt-14 grid gap-5 md:grid-cols-2 ${ids ? '' : 'lg:grid-cols-3'}`}
          stagger={0.08}
        >
          {shown.map(({ p, i }) => (
            <Tilt key={p.id} max={5} className="h-full">
              <article className="group h-full overflow-hidden rounded-card border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_50px_-28px_rgba(6,52,28,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <CardParallax className="absolute inset-0">
                    <ProjectScene index={i} />
                  </CardParallax>
                </div>

                <div className="p-6">
                  <p className="font-display text-[11px] uppercase tracking-[0.2em] text-brand-strong">
                    {p.category}
                  </p>
                  <h3 className="mt-3 font-ui text-xl font-semibold leading-snug">
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-brand-strong focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {p.title}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors group-hover:border-brand/30 group-hover:text-brand-strong"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Tilt>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  )
}
