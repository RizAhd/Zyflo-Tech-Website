import { services } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import FeatureParallax from '../components/FeatureParallax'
import PageCta from '../components/PageCta'

/*
  Every service is said once. A short head, a row of links to jump straight to
  one, then a band per service with what it is for, what it includes and a
  photo of it being done.
*/
export default function Services() {
  return (
    <div className="pt-12 sm:pt-16">
      <section className="pt-20 sm:pt-24">
        <Container>
          <SectionHead
            h1
            eyebrow="What we do"
            title={
              <>
                Seven ways to make the business <span className="text-brand-strong">run better</span>.
              </>
            }
            lead="Most projects touch more than one of these. Tell us the problem and we will tell you which of them it actually needs, including when the answer is less than you think."
          />
        </Container>
      </section>

      {/* Straight to one service. */}
      <nav aria-label="Services on this page" className="mt-10">
        <Container>
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#service-${s.id}`}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-border px-3.5 font-ui text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="font-mono text-xs text-brand-strong">{s.index}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <FeatureParallax />
      <PageCta
        title="See how a project runs."
        body="Four steps, a fixed quote in LKR up front, and a full handover at the end."
        to="/process"
        label="How it works"
      />
    </div>
  )
}
