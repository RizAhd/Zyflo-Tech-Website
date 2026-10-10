import { process } from '../data/site.config'
import { Container, SectionHead } from '../components/ui'
import { StepGlyph } from '../components/scenes'
import ScrollTimeline from '../components/ScrollTimeline'

const PROCESS_TITLE = (
  <>
    No mystery, <span className="text-brand-strong">no surprises</span> at the end.
  </>
)
const PROCESS_LEAD =
  'Every project runs the same four steps, so you always know where things stand and what happens next.'

/** The four steps as the pinned scroll timeline, or a plain grid with motion off. */
export default function Process() {
  return (
    <ScrollTimeline
      id="process"
      h1
      eyebrow="How it works"
      heading={PROCESS_TITLE}
      lead={PROCESS_LEAD}
      items={process.map((p) => ({ id: `step-${p.step}`, index: p.step, title: p.title, body: p.body }))}
      topLabel="Scroll"
      bottomLabel="Four steps, every time"
      trackVw={170}
      mobileTrackVw={470}
      heightClass="h-[max(165vw,230vh)] max-[600px]:h-[320vh]"
      fallback={
        <section id="process" className="py-20 sm:py-24">
          <Container>
            <SectionHead
              h1
              eyebrow="How it works"
              title={PROCESS_TITLE}
              lead={PROCESS_LEAD}
            />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {process.map((p, i) => (
                <div key={p.step} className="h-full rounded-xl p-5">
                  <StepGlyph index={i} />
                  <span className="mt-5 block font-display text-sm text-brand">{p.step}</span>
                  <h3 className="mt-2 font-ui text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      }
    />
  )
}
