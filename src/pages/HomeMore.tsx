import { ArrowUpRight, Globe, KeyRound, LifeBuoy, MessagesSquare, ShoppingCart } from 'lucide-react'

import { about, capabilities, clients, homeStatement, projects, services, startProjectImage } from '../data/site.config'
import { Button, CenterHead, Container, Marquee, SplitHead } from '../components/ui'
import { BlurIn } from '../components/motion'
import ScrollRevealText from '../components/ScrollRevealText'
import ProcessCards from '../components/ProcessCards'
import ClosingCta from '../components/ClosingCta'
import { Link } from '../router'
import { Ready } from '../ready'

/*
  What follows the hero on the home page, in the GrowthLab order: a strip of
  what gets built, a statement, who it was shipped for, the process on black,
  why businesses pick the studio, the services as a short list, the work as
  small cards, and a closing call. The services page and the work page carry
  the detail, so here each is a brief way in. GrowthLab's testimonials, pricing plans and blog are left out
  on purpose: the studio has none of those yet, and nothing here is invented.

  Nothing is said twice on this page: the strip lists the specific things
  built (not the seven service names, which the list carries), the statement
  does not repeat the facts in the hero band, and every photo appears once.
*/

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`
// GrowthLab's values section has three: the fourth point (fixed quotes)
// is already one of the facts in the hero band, so it is not said again here.
const VALUES = about.points.filter((pt) => pt.label !== 'Fixed quotes')
const VALUE_ICON = [MessagesSquare, KeyRound, LifeBuoy]

function BuildStrip() {
  return (
    <section aria-label="What we build" className="border-b border-border py-6">
      <Marquee speed="70s">
        {capabilities.map((c) => (
          <span
            key={c.title}
            className="flex shrink-0 items-center gap-3 border-r border-border px-6 font-ui text-lg font-medium uppercase text-muted-foreground"
          >
            <span className="text-brand" aria-hidden="true">
              /
            </span>
            {c.title}
          </span>
        ))}
      </Marquee>
    </section>
  )
}

function Statement() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="grid gap-10 md:grid-cols-12">
        <ul className="space-y-2 md:col-span-4" aria-label="The studio in short">
          {homeStatement.tags.map((t) => (
            <li key={t} className="font-ui text-lg font-medium uppercase text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
        <ScrollRevealText
          text={homeStatement.text}
          className="font-ui text-[1.75rem] font-semibold leading-[1.2] text-foreground sm:text-4xl md:col-span-8"
        />
      </Container>
    </section>
  )
}

function ShippedFor() {
  const icon = [ShoppingCart, Globe]
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <SplitHead title="Shipped for" lead="Real businesses, live today." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {clients.map((c, i) => {
            const Icon = icon[i] ?? Globe
            const body = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-8 block font-ui text-2xl font-semibold">{c.name}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  {c.kind}
                  {c.href && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                </span>
              </>
            )
            return (
              <li key={c.name}>
                <BlurIn y={20} delay={i * 0.06}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full rounded-[20px] bg-surface p-7 transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {body}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className="h-full rounded-[20px] bg-surface p-7">{body}</div>
                  )}
                </BlurIn>
              </li>
            )
          })}
          <li>
            <BlurIn y={20} delay={0.12}>
              <Link
                to="/contact"
                className="group flex h-full flex-col justify-between rounded-[20px] bg-ink p-7 text-white transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink">
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="mt-8 block font-ui text-2xl font-semibold">Your business</span>
                  <span className="mt-1 block text-sm text-ink-muted group-hover:text-white">Start a project</span>
                </span>
              </Link>
            </BlurIn>
          </li>
        </ul>
      </Container>
    </section>
  )
}

function Process() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <Container>
        {/* The heading stays pinned under the header while the cards below
            line up, and leaves with them at the end of the section. */}
        <div className="z-10 bg-ink lg:sticky lg:top-6 lg:pb-6 lg:pt-4">
          <SplitHead
            onInk
            title={
              <>
                How a project <span className="text-brand-bright">runs</span>
              </>
            }
            lead="Four steps, so you always know where things stand and what happens next."
          />
        </div>
        <ProcessCards />
        <div className="mt-14">
          <Button href="/process" variant="accent">
            See every step
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  )
}

function Values() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SplitHead title="Why businesses pick us" lead="Straight dealing, from the first message to long after launch." />
        {/* The photo on the left, the three values stacked on the right and
            spread to the photo's full height, each on its own ruled line. */}
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <BlurIn y={24} className="h-full">
            <img
              src={img('services/marketing.webp')}
              alt=""
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] h-full w-full rounded-[20px] object-cover"
            />
          </BlurIn>
          <ul className="flex flex-col justify-between divide-y divide-border">
            {VALUES.map((pt, i) => {
              const Icon = VALUE_ICON[i] ?? MessagesSquare
              return (
                <li key={pt.label} className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <BlurIn y={12} delay={i * 0.05}>
                    <h3 className="font-ui text-2xl font-semibold">{pt.label}</h3>
                    <p className="mt-2 text-lg leading-[1.4] text-muted-foreground">{pt.value}.</p>
                  </BlurIn>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}

function Services() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <CenterHead
          title={
            <>
              What we do <span className="text-brand-strong">/</span> Services
            </>
          }
          lead="From the website to the automation behind it, and the marketing that brings people to it."
        />
        {/* One small line per service. The services page carries the detail. */}
        <ul className="mx-auto mt-12 grid max-w-5xl gap-x-12 border-t border-border sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="border-b border-border">
              <Link
                to={`/services/#service-${s.id}`}
                className="group flex min-h-[64px] items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="w-7 shrink-0 font-ui text-sm font-medium text-muted-foreground">{s.index}</span>
                <span className="flex-1 font-ui text-lg font-semibold leading-snug transition-colors group-hover:text-brand-strong">
                  {s.title}
                </span>
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface transition-colors group-hover:bg-ink group-hover:text-white"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button href="/services" variant="outline">
            Every service in detail
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  )
}

function Work() {
  // Real screenshots first; the work page has the full story of each.
  const shown = [...projects].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
  return (
    <section className="pb-8">
      <Container>
        <CenterHead title="Work that shipped" lead="A closer look at what each project took is on the work page." />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {shown.map((p, i) => (
            <li key={p.id}>
              <BlurIn y={20} delay={i * 0.06} className="h-full">
                <Link
                  to="/work"
                  className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-surface transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    {p.image ? (
                      <img
                        src={img(p.image.src)}
                        alt={p.image.alt}
                        width={1200}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="flex h-full flex-col justify-end bg-[radial-gradient(circle_at_85%_15%,rgba(0,139,72,0.5),transparent_60%)] p-6 text-white"
                        aria-hidden="true"
                      >
                        <span className="font-ui text-3xl font-semibold leading-none">{p.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-sm font-medium text-brand-strong">{p.category}</span>
                    <h3 className="mt-1 font-ui text-xl font-semibold">{p.title}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                      {p.client}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-foreground md:mt-auto md:pt-5">
                      See the work
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </BlurIn>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default function HomeMore() {
  return (
    <>
      <BuildStrip />
      <Statement />
      <ShippedFor />
      <Process />
      <Values />
      <Services />
      <Work />
      <ClosingCta
        title={
          <>
            Ready to build what your business <span className="text-brand-strong">runs on?</span>
          </>
        }
        body="A short message is enough to start the conversation."
        to="/contact"
        label="Start a project"
        showWhatsapp
        image={startProjectImage}
      />
      <Ready />
    </>
  )
}
