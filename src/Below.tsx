import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Clapperboard,
  Globe,
  KeyRound,
  LifeBuoy,
  MessageSquare,
  Receipt,
  Share2,
  Smartphone,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

import {
  about,
  business,
  capabilities,
  clients,
  contact,
  contactSection,
  faqs,
  process,
  projects,
  services,
  isTodo,
} from './data/site.config'
import { activeSocials, email, formKey, phone, whatsapp } from './data/contact'
import { LOGO_SRC } from './data/assets'
import { Button, Container, Eyebrow, SectionHead } from './components/ui'
import {
  BlurIn,
  CardParallax,
  Magnetic,
  Parallax,
  SplitHeading,
  StaggerGrid,
  Tilt,
  useProcessPin,
} from './components/motion'
import { ProjectScene, StepGlyph } from './components/scenes'
import ServiceTabs from './components/ServiceTabs'

/*
  Everything below the first screen. App.tsx loads this file after the hero has
  painted, so the phone downloads and runs the hero's code first and the
  figures, forms and the rest of the page arrive a moment later, instead of the
  whole site's JavaScript blocking the first paint.
*/

const SERVICE_ICON: Record<string, LucideIcon> = {
  web: Globe,
  software: Workflow,
  mobile: Smartphone,
  ai: Bot,
  video: Clapperboard,
  marketing: TrendingUp,
  social: Share2,
}

const POINT_ICON: LucideIcon[] = [MessageSquare, Receipt, KeyRound, LifeBuoy]
// Services: see components/ServiceTimeline.tsx

// ---------------------------------------------------------------------------
// Principles
// ---------------------------------------------------------------------------
function Principles() {
  return (
    <section className="relative py-16 sm:py-24">
      {/* A tinted band with no edge. A hairline plus an abrupt tone change made
          this read as a slab dropped onto the page; fading the tint in and out
          keeps the tonal relief without drawing a line across the document. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-muted)_16%,var(--color-muted)_84%,transparent)]"
      />
      <Container className="relative">
        <StaggerGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {about.points.map((p, i) => {
            const Icon = POINT_ICON[i] ?? Check
            return (
              <div key={p.label} className="group">
                <Icon className="h-5 w-5 text-brand transition-transform duration-300 group-hover:scale-110" />
                <p className="mt-4 font-ui text-base font-semibold">{p.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.value}</p>
              </div>
            )
          })}
        </StaggerGrid>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Process
// ---------------------------------------------------------------------------
function Process() {
  const ref = useRef<HTMLElement>(null)

  // Pins on desktop and scrubs the four steps into focus one at a time. The
  // steps sit in a plain grid, NOT a StaggerGrid: this hook is the only owner
  // of their opacity and transform, and two owners on one property is exactly
  // what painted a section blank once already.
  useProcessPin(ref, process.length)

  return (
    <section
      id="process"
      ref={ref}
      className="py-20 sm:py-24 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-0"
    >
      <Container>
        <SectionHead
          index="02"
          eyebrow="How it works"
          title={
            <>
              No mystery, <span className="text-brand-strong">no surprises</span> at the end.
            </>
          }
          lead="Every project runs the same four steps, so you always know where things stand and what happens next."
        />

        <div className="relative mt-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {process.map((p, i) => (
              <div
                key={p.step}
                className="process-step group h-full rounded-xl p-5 transition-colors duration-300 hover:bg-brand-tint/40"
              >
                {/* Each glyph acts out its own step rather than being a generic icon. */}
                <StepGlyph index={i} />
                <span className="mt-5 block font-display text-sm text-brand">{p.step}</span>
                <h3 className="mt-2 font-ui text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Work
// ---------------------------------------------------------------------------
function Work() {
  return (
    <section id="work" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          index="03"
          eyebrow="Selected work"
          title={
            <>
              Built, shipped and <span className="text-brand-strong">handed over</span>.
            </>
          }
          lead="A point of sale system for SJD, the website for mradventure.lk, and the invoicing tool the studio runs on. Each one was built by the same person who answers your enquiry."
        />

        <StaggerGrid className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {projects.map((p, i) => (
            <Tilt key={p.id} max={5} className="h-full">
              <article className="group h-full overflow-hidden rounded-card border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_50px_-28px_rgba(6,52,28,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <CardParallax className="absolute inset-0">
                    <ProjectScene index={i} />
                  </CardParallax>
                </div>

                <div className="p-6">
                  <p className="font-display text-[11px] uppercase tracking-[0.2em] text-brand-strong">
                    {p.category}
                  </p>
                  <h3 className="mt-3 font-ui text-xl font-semibold leading-snug">
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-brand-strong focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {p.title}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors group-hover:border-brand/30 group-hover:text-brand-strong"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Tilt>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Capability wall
// ---------------------------------------------------------------------------
function Capabilities() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* A tinted band with no edge. A hairline plus an abrupt tone change made
          this read as a slab dropped onto the page; fading the tint in and out
          keeps the tonal relief without drawing a line across the document. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-muted)_16%,var(--color-muted)_84%,transparent)]"
      />
      <Container className="relative">
        <SectionHead
          index="04"
          eyebrow="Capabilities"
          title={
            <>
              Everything under <span className="text-brand-strong">one roof</span>.
            </>
          }
          lead="Twenty-one things I build and run regularly. Most projects are two or three of them stitched together, so you brief once and one person carries it end to end."
          align="center"
        />

        {/* Seven rows, one per service, instead of twenty-one identical chips.
            Each capability still points at the service card that owns it, the
            same anchor the structured data references. */}
        <StaggerGrid className="mt-14 flex flex-col gap-3" stagger={0.06}>
          {services.map((s) => {
            const Icon = SERVICE_ICON[s.id] ?? Globe
            const items = capabilities.filter((c) => c.service === s.id)
            return (
              <div
                key={s.id}
                className="group grid items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-colors duration-300 hover:border-brand/40 sm:p-5 lg:grid-cols-[17rem_1fr] lg:gap-8"
              >
                <a
                  href={`#service-${s.id}`}
                  className="flex items-center gap-3.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="font-ui text-base font-semibold leading-snug">{s.title}</span>
                </a>
                <ul className="flex flex-wrap gap-x-7 gap-y-2 lg:justify-end">
                  {items.map((c) => (
                    <li key={c.title}>
                      <a
                        href={`#service-${c.service}`}
                        className="inline-flex min-h-[32px] items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-strong focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden="true" />
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </StaggerGrid>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Studio
// ---------------------------------------------------------------------------
function Studio() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <BlurIn y={12}>
              <Eyebrow index="05">The studio</Eyebrow>
            </BlurIn>
            <SplitHeading className="mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance sm:text-4xl md:text-5xl">
              {about.heading}
            </SplitHeading>
            {about.body.map((para, i) => (
              <BlurIn key={i} delay={0.1 + i * 0.08}>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{para}</p>
              </BlurIn>
            ))}
            <BlurIn delay={0.3}>
              <div className="mt-9">
                <Magnetic strength={0.25}>
                  <Button href="#contact">
                    Start a project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Magnetic>
              </div>
            </BlurIn>
          </div>

          <Parallax distance={40}>
            <Tilt max={5}>
              <div className="rounded-card border border-border bg-white p-8 shadow-[0_20px_50px_-32px_rgba(6,52,28,0.35)]">
                <img
                  src={LOGO_SRC}
                  alt="Zyflo Tech logo"
                  width={56}
                  height={56}
                  className="rounded-xl"
                />
                <p className="mt-5 font-ui text-lg font-semibold">
                  {business.name} &middot; {business.owner}
                </p>
                <p className="text-sm text-muted-foreground">
                  {business.tagline} &middot; {business.location}
                </p>

                <dl className="mt-7 divide-y divide-border border-t border-border">
                  <div className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-sm text-muted-foreground">Since</dt>
                    <dd className="text-right font-ui text-sm font-medium">{business.foundedYear}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-sm text-muted-foreground">Shipped for</dt>
                    <dd className="text-right font-ui text-sm font-medium">
                      {clients.map((c) => c.name).join(', ')}
                    </dd>
                  </div>
                  {about.points.map((p) => (
                    <div key={p.label} className="flex items-baseline justify-between gap-6 py-3.5">
                      <dt className="text-sm text-muted-foreground">{p.label}</dt>
                      <dd className="text-right font-ui text-sm font-medium">{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt>
          </Parallax>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// FAQ
//
// Questions are real headings with the answer in the very next paragraph, and
// nothing is collapsed behind a toggle. That shape is what lets a search result
// or an assistant lift a whole answer, and it is mirrored by the FAQPage
// structured data generated at build time from this same `faqs` export.
// ---------------------------------------------------------------------------
function Faqs() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          index="06"
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

// ---------------------------------------------------------------------------
// Enquiry form
// ---------------------------------------------------------------------------
function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('botcheck')) return // honeypot

    // No form service key: hand the enquiry to WhatsApp (or the mail app) with
    // every field already written out, so the form works from day one and the
    // visitor only has to press send.
    if (!formKey) {
      const text = [
        `Hi ${business.name}, I'd like to talk about a project.`,
        '',
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Service: ${data.get('service')}`,
        `Budget: ${data.get('budget')}`,
        '',
        `${data.get('message')}`,
      ].join('\n')
      if (contact.whatsapp && !isTodo(contact.whatsapp)) {
        window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      } else if (email) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(text)}`
      }
      return
    }

    data.append('access_key', formKey)
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-card border border-border bg-white p-8"
      >
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 16 }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand-strong"
        >
          <Check className="h-5 w-5" />
        </motion.span>
        <h3 className="mt-5 font-ui text-xl font-semibold">That came through.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          I read every enquiry myself and reply within a day or two.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>
          Send another
        </Button>
      </motion.div>
    )
  }

  // text-base below sm: iOS Safari zooms the page in when a focused input is
  // under 16px, and it never zooms back out.
  const field =
    'w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none sm:text-sm'
  const label = 'mb-1.5 block font-ui text-xs font-medium text-muted-foreground'

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-border bg-white p-6 sm:p-8">
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="f-name">
            Name
          </label>
          <input
            id="f-name"
            name="name"
            required
            autoComplete="name"
            className={field}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={label} htmlFor="f-email">
            Email
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            className={field}
            placeholder="you@company.lk"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="f-service">
            What do you need?
          </label>
          <select
            id="f-service"
            name="service"
            className={`${field} min-h-[44px]`}
            defaultValue={services[0].title}
          >
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="f-budget">
            Budget
          </label>
          <select
            id="f-budget"
            name="budget"
            className={`${field} min-h-[44px]`}
            defaultValue={contactSection.budgetOptions[0]}
          >
            {contactSection.budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="f-message">
          About the project
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          rows={4}
          className={`${field} resize-y`}
          placeholder="What are you trying to build, and by when?"
        />
      </div>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">
          That did not send. Please try again, or reach me directly.
        </p>
      )}

      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={(!formKey && !whatsapp && !email) || status === 'sending'}
      >
        {status === 'sending' ? 'Sending' : formKey ? 'Send enquiry' : whatsapp ? 'Send on WhatsApp' : 'Send by email'}
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Visitor facing. With no form service key the enquiry opens in
          WhatsApp (or email) pre-written; with a key it posts straight to the
          inbox. */}
      {!formKey && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {whatsapp
            ? 'Pressing send opens WhatsApp with your enquiry already written. I read every message myself and reply within a day or two.'
            : email
              ? 'Pressing send opens your email app with your enquiry already written.'
              : 'Contact details are being finalised and will appear here shortly.'}
        </p>
      )}
    </form>
  )
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-brand-bright/10 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* flex-col plus mt-auto on the details block: the left column is
              shorter than the form, which left a wide void beneath it. */}
          <div className="flex flex-col">
            <BlurIn y={12}>
              <Eyebrow index="07" onInk>
                Let us build together
              </Eyebrow>
            </BlurIn>
            <SplitHeading className="mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
              {contactSection.heading}
            </SplitHeading>
            <BlurIn delay={0.12}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
                {contactSection.lead}
              </p>
            </BlurIn>

            {(email || whatsapp) && (
              <BlurIn delay={0.18}>
                <a
                  href={email ? `mailto:${email}` : whatsapp!}
                  {...(email ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group mt-9 inline-flex items-center gap-3 font-ui text-xl font-medium text-brand-bright transition-colors hover:text-white sm:text-2xl"
                >
                  {email ?? 'Message me on WhatsApp'}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </BlurIn>
            )}

            <BlurIn delay={0.24} className="mt-12 lg:mt-auto lg:pt-12">
              <dl className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-3">
                <div>
                  <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Studio
                  </dt>
                  <dd className="mt-2 text-sm text-ink-muted">
                    {business.owner}
                    <br />
                    {business.location}
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Hours
                  </dt>
                  <dd className="mt-2 text-sm text-ink-muted">
                    Mon to Sat
                    <br />
                    9am to 7pm (+5:30)
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Reply time
                  </dt>
                  <dd className="mt-2 text-sm text-ink-muted">
                    Within a day
                    <br />
                    or two
                  </dd>
                </div>
                {phone && (
                  <div>
                    <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Phone
                    </dt>
                    <dd className="mt-2 text-sm text-ink-muted">
                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                        className="inline-flex min-h-[32px] items-center hover:text-brand-bright"
                      >
                        {phone}
                      </a>
                    </dd>
                  </div>
                )}
                {whatsapp && (
                  <div>
                    <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                      WhatsApp
                    </dt>
                    <dd className="mt-2 text-sm text-ink-muted">
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[32px] items-center hover:text-brand-bright"
                      >
                        Message me
                      </a>
                    </dd>
                  </div>
                )}
                {activeSocials.length > 0 && (
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Elsewhere
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                      {activeSocials.map((s) => (
                        <a
                          key={s.label}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-bright"
                        >
                          {s.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </BlurIn>
          </div>

          <BlurIn delay={0.12} y={32}>
            <EnquiryForm />
          </BlurIn>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-ink py-10 text-white">
      <Container className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2.5">
          <img src={LOGO_SRC} alt="" width={26} height={26} className="rounded-md" />
          <span className="font-ui text-sm font-medium">
            &copy; {year} {business.legalName}
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          {business.tagline} &middot; Built in {business.location}
        </p>
        <nav className="flex items-center gap-5 text-xs text-ink-muted" aria-label="Contact">
          {email && (
            <a href={`mailto:${email}`} className="inline-flex min-h-[44px] items-center hover:text-brand-bright">
              Email
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center hover:text-brand-bright"
            >
              WhatsApp
            </a>
          )}
          <MotionToggle />
        </nav>
      </Container>
    </footer>
  )
}

/**
 * Motion is on by default (see the gate script in index.html). This lets a
 * visitor who is bothered by movement switch it off, and the choice is
 * remembered. It reloads because the animations are armed once at load.
 */
function MotionToggle() {
  const isOn = document.documentElement.hasAttribute('data-force-motion')
  const flip = () => {
    try {
      localStorage.setItem('zyflo-motion', isOn ? 'off' : 'on')
    } catch {
      /* storage blocked: nothing to remember, the reload still applies the default */
    }
    window.location.reload()
  }
  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={isOn}
      className="inline-flex min-h-[44px] items-center hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      Motion: {isOn ? 'on' : 'off'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// What App.tsx loads
// ---------------------------------------------------------------------------

/** Tells the nav (scroll spy) that the sections it watches now exist. */
export const SECTIONS_READY = 'zyflo:sections-ready'

export function Sections() {
  useEffect(() => {
    window.dispatchEvent(new Event(SECTIONS_READY))

    // The page opened on a #hash before these sections existed, so the browser
    // had nothing to scroll to. Do it now, then let ScrollTrigger re-measure
    // once the late content has settled its heights.
    const id = decodeURIComponent(window.location.hash.slice(1))
    const raf = requestAnimationFrame(() => {
      if (id) document.getElementById(id)?.scrollIntoView()
      ScrollTrigger.refresh()
    })
    const late = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(late)
    }
  }, [])

  return (
    <>
      <ServiceTabs />
      <Principles />
      <Process />
      <Work />
      <Capabilities />
      <Studio />
      <Faqs />
      <Contact />
    </>
  )
}

export { Footer }

