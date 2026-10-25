import { about, business, clients } from '../data/site.config'
import { LOGO_WHITE_SRC } from '../data/assets'
import { CenterHead, Container } from '../components/ui'
import { BlurIn, SplitHeading } from '../components/motion'
import ScrollRevealText from '../components/ScrollRevealText'

/*
  The about page in GrowthLab's form. First a small "About us" label beside
  the heading and a statement that darkens as it scrolls. Then the studio at
  a glance as GrowthLab's impact tiles: one dark feature tile and the facts
  around it (where GrowthLab shows client counts and percentages, this shows
  only what is true: when it started, who it shipped for, how it works).
  Then the studio at work, as a wide photo.
*/

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function Studio() {
  const facts = [
    { value: `${business.foundedMonth} ${business.foundedYear}`, label: 'Building since' },
    { value: clients.map((c) => c.name).join(', '), label: 'Shipped for' },
    ...about.points.map((p) => ({ value: p.value, label: p.label })),
  ]

  return (
    <>
      <section id="about" className="pb-20 pt-32 sm:pb-24 sm:pt-40">
        <Container className="grid gap-8 md:grid-cols-12">
          <BlurIn y={10} className="md:col-span-3">
            <p className="font-ui text-lg font-medium text-muted-foreground">About us</p>
          </BlurIn>
          <div className="md:col-span-9">
            <SplitHeading as="h1" className="font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px]">
              {about.heading}
            </SplitHeading>
            <ScrollRevealText
              text={about.body[0]}
              className="mt-8 font-ui text-2xl font-semibold leading-[1.25] text-foreground sm:text-[32px]"
            />
            <BlurIn delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-[1.4] text-muted-foreground">{about.body[1]}</p>
            </BlurIn>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <CenterHead title="The studio at a glance" lead="What you can count on, in plain words." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <li className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
              <BlurIn y={20} className="h-full">
                <div className="flex h-full flex-col justify-between gap-10 rounded-[20px] bg-brand-strong p-7 text-white">
                  <img src={LOGO_WHITE_SRC} alt="" width={52} height={45} className="h-10 w-auto self-start" />
                  <div>
                    <p className="font-ui text-xl font-semibold leading-[1.3]">
                      {business.name} is a small studio. The people you brief are the people who build it.
                    </p>
                    <p className="mt-6 text-sm text-white">
                      Founded by {business.owner}, {business.location}
                    </p>
                  </div>
                </div>
              </BlurIn>
            </li>
            {facts.map((f, i) => (
              <li key={f.label}>
                <BlurIn y={20} delay={0.04 * i} className="h-full">
                  <div className="flex h-full min-h-[11rem] flex-col justify-end rounded-[20px] bg-surface p-7">
                    <span className="font-ui text-2xl font-semibold leading-[1.2] text-foreground">{f.value}</span>
                    <span className="mt-2 text-base text-muted-foreground">{f.label}</span>
                  </div>
                </BlurIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <BlurIn y={24}>
            <img
              src={img(about.image.src)}
              alt={about.image.alt}
              width={1800}
              height={772}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full rounded-[20px] object-cover sm:aspect-[21/9]"
            />
          </BlurIn>
        </Container>
      </section>
    </>
  )
}
