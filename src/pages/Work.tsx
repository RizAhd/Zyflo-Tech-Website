import PageHero from '../components/PageHero'
import WorkCases from '../components/WorkCases'
import ClosingCta from '../components/ClosingCta'
import { Container } from '../components/ui'

/* Shipped work, in GrowthLab's case cards, under its page top. */
export default function WorkPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Built, shipped and <span className="text-brand-strong">handed over</span>.
          </>
        }
        lead="A point of sale system for SJD, the website for mradventure.lk, and the invoicing tool the studio runs on."
      />
      <section className="pb-8">
        <Container>
          <WorkCases />
        </Container>
      </section>
      <ClosingCta
        title="Meet the studio behind the work."
        body="Start to finish, the same people. Here is how the studio runs and what you can count on."
        to="/about"
        label="About the studio"
      />
    </>
  )
}
