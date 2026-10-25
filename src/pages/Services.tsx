import { services } from '../data/site.config'
import FeatureParallax from '../components/FeatureParallax'
import PageHero from '../components/PageHero'
import ClosingCta from '../components/ClosingCta'

/*
  Every service is said once. GrowthLab's page top (a big centred heading,
  one line under it) with a row of links to jump straight to a service, then
  a band per service with what it is for, what it includes and a photo of it
  being done, then the close.
*/
export default function Services() {
  return (
    <>
      <PageHero
        title={
          <>
            Seven ways to make the business <span className="text-brand-strong">run better</span>.
          </>
        }
        lead="Most projects touch more than one of these. Tell us the problem and we will tell you which of them it actually needs, including when the answer is less than you think."
      >
        <nav aria-label="Services on this page" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#service-${s.id}`}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-surface px-5 font-ui text-base font-medium text-foreground transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <FeatureParallax />
      <ClosingCta
        title="See how a project runs."
        body="Four steps, from the first message to the day it is yours."
        to="/process"
        label="How it works"
      />
    </>
  )
}
