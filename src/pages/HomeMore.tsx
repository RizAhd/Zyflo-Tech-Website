import { ArrowRight, Globe } from 'lucide-react'

import { services } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import { StaggerGrid } from '../components/motion'
import PageCta from '../components/PageCta'
import ScrollStroke from '../components/ScrollStroke'
import { Link } from '../router'
import Work from '../sections/Work'
import { Ready } from '../ready'
import { SERVICE_ICON } from '../sections/icons'

/** What follows the hero on the home page: a way into each part of the site. */
export default function HomeMore() {
  return (
    <>
      <ScrollStroke />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHead
            eyebrow="What I do"
            title={
              <>
                One studio, <span className="text-brand-strong">seven services</span>.
              </>
            }
            lead="Pick the one you need or combine several. Each opens with what it includes and what you get at the end."
          />

          <StaggerGrid className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
            {services.map((s) => {
              const Icon = SERVICE_ICON[s.id] ?? Globe
              return (
                <Link
                  key={s.id}
                  to={`/services/#service-${s.id}`}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_18px_40px_-28px_rgba(6,52,28,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="mt-5 font-ui text-base font-semibold leading-snug">{s.title}</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {s.promise}
                  </span>
                </Link>
              )
            })}
            <Link
              to="/services"
              className="group flex flex-col justify-between rounded-2xl bg-ink p-5 text-white transition-colors duration-300 hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="font-ui text-base font-semibold leading-snug">See all services</span>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted group-hover:text-white">
                What each one includes
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </StaggerGrid>
        </Container>
      </section>

      <Work ids={['sjd-pos', 'mradventure']} />

      <PageCta
        eyebrow="Start here"
        title="Tell me what you need."
        body="A short message is enough. You get an honest answer, a fixed quote in LKR and one person who stays with it to the end."
        to="/contact"
        label="Start a project"
      />
      <Ready />
    </>
  )
}
