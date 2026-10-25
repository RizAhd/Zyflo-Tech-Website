import { ArrowUpRight, Globe, KeyRound, LifeBuoy, MessagesSquare, Receipt, ShoppingCart } from 'lucide-react'

import { about, clients, homeStatement, services, startProjectImage } from '../data/site.config'
import { whatsapp } from '../data/contact'
import { Button, CenterHead, Container, Marquee, SplitHead } from '../components/ui'
import { BlurIn, Magnetic } from '../components/motion'
import ScrollRevealText from '../components/ScrollRevealText'
import ProcessCards from '../components/ProcessCards'
import ServiceRows from '../components/ServiceRows'
import WorkCases from '../components/WorkCases'
import { Link } from '../router'
import { Ready } from '../ready'

/*
  What follows the hero on the home page, in the GrowthLab order: a strip of
  services, a statement, who it was shipped for, the process on black, why
  businesses pick the studio, the services as rows, the work, and a closing
  call. GrowthLab's testimonials, pricing plans and blog are left out on
  purpose: the studio has none of those yet, and nothing here is invented.
*/

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`
const VALUE_ICON = [MessagesSquare, Receipt, KeyRound, LifeBuoy]

function ServiceStrip() {
  return (
    <section aria-label="Services" className="border-b border-border py-5">
      <Marquee speed="48s">
        {services.map((s) => (
          <span key={s.id} className="flex shrink-0 items-center gap-3 px-6 font-ui text-base font-medium uppercase tracking-[0.04em] text-foreground sm:text-lg">
            <span className="text-brand" aria-hidden="true">
              /
            </span>
            {s.title}
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
            <li key={t} className="font-ui text-sm font-medium uppercase tracking-[0.06em] text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
        <ScrollRevealText
          text={homeStatement.text}
          className="font-ui text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.01em] text-foreground sm:text-4xl md:col-span-8"
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
        <SplitHead title="Shipped for" lead="Real businesses, live today. Every one built and handed over by the studio." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {clients.map((c, i) => {
            const Icon = icon[i] ?? Globe
            const body = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-8 block font-ui text-2xl font-semibold tracking-tight">{c.name}</span>
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
                      className="block h-full rounded-3xl bg-surface p-7 transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {body}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className="h-full rounded-3xl bg-surface p-7">{body}</div>
                  )}
                </BlurIn>
              </li>
            )
          })}
          <li>
            <BlurIn y={20} delay={0.12}>
              <Link
                to="/contact"
                className="group flex h-full flex-col justify-between rounded-3xl bg-ink p-7 text-white transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink">
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="mt-8 block font-ui text-2xl font-semibold tracking-tight">Your business</span>
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
          lead="Four steps, a fixed quote in LKR before work starts, and a full handover at the end."
        />
        <ProcessCards />
        <div className="mt-12 lg:-mt-24">
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
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <BlurIn y={24}>
            <img
              src={img('studio/studio.webp')}
              alt={about.image.alt}
              width={1800}
              height={772}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-3xl object-cover md:h-full md:aspect-auto"
            />
          </BlurIn>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {about.points.map((pt, i) => {
              const Icon = VALUE_ICON[i] ?? MessagesSquare
              return (
                <li key={pt.label}>
                  <BlurIn y={16} delay={i * 0.05}>
                    <Icon className="h-7 w-7 text-foreground" aria-hidden="true" />
                    <h3 className="mt-8 font-ui text-xl font-semibold">{pt.label}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{pt.value}.</p>
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
          lead="Seven services that fit together, from the website to the automation behind it."
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
          lead="Built, launched and handed over. A closer look at what each project took."
        />
        <WorkCases />
      </Container>
    </section>
  )
}

function Closing() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container className="flex flex-col items-center text-center">
        <BlurIn y={24}>
          <img
            src={img(startProjectImage.src)}
            alt={startProjectImage.alt}
            width={1600}
            height={1067}
            loading="lazy"
            decoding="async"
            className="w-full max-w-md animate-float rounded-3xl object-cover shadow-[0_30px_60px_-30px_rgba(17,17,17,0.45)]"
          />
        </BlurIn>
        <h2 className="mt-12 max-w-3xl font-ui text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl">
          Ready to build what your business <span className="text-brand-strong">runs on?</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A short message is enough. You get an honest answer and a fixed quote in LKR.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Magnetic strength={0.25}>
            <Button href="/contact">
              Start a project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Magnetic>
          {whatsapp && (
            <Magnetic strength={0.25}>
              <Button href={whatsapp} external variant="outline">
                Message on WhatsApp
              </Button>
            </Magnetic>
          )}
        </div>
      </Container>
    </section>
  )
}

export default function HomeMore() {
  return (
    <>
      <ServiceStrip />
      <Statement />
      <ShippedFor />
      <Process />
      <Values />
      <Services />
      <Work />
      <Closing />
      <Ready />
    </>
  )
}
