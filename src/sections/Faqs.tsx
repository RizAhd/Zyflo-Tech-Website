import { faqs } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import { StaggerGrid } from '../components/motion'

// ---------------------------------------------------------------------------
// FAQ
//
// Questions are real headings with the answer in the very next paragraph, and
// nothing is collapsed behind a toggle. That shape is what lets a search result
// or an assistant lift a whole answer, and it is mirrored by the FAQPage
// structured data generated at build time from this same `faqs` export.
// ---------------------------------------------------------------------------
export default function Faqs() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow="Questions"
          title={
            <>
              The things people <span className="text-brand-strong">ask first</span>.
            </>
          }
          lead="Straight answers about cost, ownership and what happens after launch. If yours is not here, ask me directly."
        />

        <StaggerGrid className="mt-14 grid gap-x-12 gap-y-8 md:grid-cols-2" stagger={0.05}>
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-border pt-6">
              <h3 className="font-ui text-lg font-semibold leading-snug">{f.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  )
}
