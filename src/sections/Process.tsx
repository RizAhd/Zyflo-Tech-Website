import { process } from '../data/site.config'
import { Container } from '../components/ui'
import { BlurIn } from '../components/motion'
import PageHero from '../components/PageHero'

/*
  The process page: GrowthLab's page top, then the four steps as large
  cards that stack as you scroll. Each card holds the step's number, its name
  and what happens in it beside a full colour photo of that kind of work,
  the photo side alternating. Every card is sticky a little lower than the
  one before, so on a wide screen each new step slides up over the last and
  the earlier ones stay peeking out above it, like a pile of pages. On a phone
  they are simply stacked one after another.
*/

const PHOTOS = ['services/software.webp', 'services/ai.webp', 'services/web.webp', 'services/mobile.webp']
const STICK = ['lg:top-28', 'lg:top-32', 'lg:top-36', 'lg:top-40']
const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function Process() {
  return (
    <>
      <PageHero
        title={
          <>
            No mystery, <span className="text-brand-strong">no surprises</span> at the end.
          </>
        }
        lead="Every project runs the same four steps, so you always know where things stand and what happens next."
      />

      <section id="process" aria-label="The four steps" className="pb-8">
        <Container>
          <ol className="space-y-6 lg:space-y-10">
            {process.map((p, i) => (
              <li key={p.step} className={`lg:sticky ${STICK[i]}`}>
                <BlurIn y={28}>
                  <article className="grid overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_-20px_40px_-30px_rgba(17,17,17,0.35)] md:grid-cols-2 lg:min-h-[30rem]">
                    <div className={`flex flex-col justify-between gap-10 p-8 sm:p-12 ${i % 2 ? 'md:order-2' : ''}`}>
                      <span className="font-ui text-[88px] font-bold leading-none text-foreground sm:text-[112px]" aria-hidden="true">
                        {p.step}
                      </span>
                      <div>
                        <h2 className="font-ui text-4xl font-semibold leading-[1.2] sm:text-5xl">
                          <span className="sr-only">Step {p.step}: </span>
                          {p.title}
                        </h2>
                        <p className="mt-4 max-w-md text-lg leading-[1.4] text-muted-foreground">{p.body}</p>
                      </div>
                    </div>
                    <img
                      src={img(PHOTOS[i])}
                      alt=""
                      width={1600}
                      height={1067}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
                    />
                  </article>
                </BlurIn>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  )
}
