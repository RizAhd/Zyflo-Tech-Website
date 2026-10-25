import { ArrowUpRight, Globe, KeyRound, LifeBuoy, MessagesSquare, ShoppingCart } from 'lucide-react'

import { about, capabilities, clients, homeStatement, startProjectImage } from '../data/site.config'
import { Button, CenterHead, Container, Marquee, SplitHead } from '../components/ui'
import { BlurIn } from '../components/motion'
import ScrollRevealText from '../components/ScrollRevealText'
import ProcessCards from '../components/ProcessCards'
import ServiceRows from '../components/ServiceRows'
import WorkCases from '../components/WorkCases'
import ClosingCta from '../components/ClosingCta'
import { Link } from '../router'
import { Ready } from '../ready'

/*
  What follows the hero on the home page, in the GrowthLab order: a strip of
  what gets built, a statement, who it was shipped for, the process on black,
  why businesses pick the studio, the services as rows, the work, and a
  closing call. GrowthLab's testimonials, pricing plans and blog are left out
  on purpose: the studio has none of those yet, and nothing here is invented.

  Nothing is said twice on this page: the strip lists the specific things
  built (not the seven service names, which the rows carry), the statement
  does not repeat the facts in the hero band, and every photo appears once.
*/

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`
// GrowthLab's values section has three: the fourth point (fixed quotes in LKR)
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
        <SplitHead
          onInk
          title={
            <>
              How a project <span className="text-brand-bright">runs</span>
            </>
          }
          lead="Four steps, so you always know where things stand and what happens next."
        />
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
        {/* GrowthLab's arrangement: the photo and the first value side by side,
            the other two values beneath. */}
        <ul className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
          <li aria-hidden="true">
            <BlurIn y={24}>
              <img
                src={img(startProjectImage.src)}
                alt=""
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full rounded-[20px] object-cover"
              />
            </BlurIn>
          </li>
          {VALUES.map((pt, i) => {
            const Icon = VALUE_ICON[i] ?? MessagesSquare
            return (
              <li key={pt.label} className={i === 0 ? 'md:self-end' : 'md:px-5'}>
                <BlurIn y={16} delay={i * 0.05}>
                  <Icon className="h-7 w-7 text-foreground" aria-hidden="true" />
                  <h3 className="mt-10 font-ui text-xl font-semibold">{pt.label}</h3>
                  <p className="mt-2 max-w-md text-base leading-[1.4] text-muted-foreground">{pt.value}.</p>
                </BlurIn>
              </li>
            )
          })}
        </ul>
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
      </Container>
      <ServiceRows />
      <Container className="mt-10 text-center">
        <Button href="/services" variant="outline">
          Every service in detail
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Container>
    </section>
  )
}

function Work() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <CenterHead
          title="Work that shipped"
          lead="A closer look at what each project took."
        />
        <WorkCases />
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
      />
      <Ready />
    </>
  )
}
