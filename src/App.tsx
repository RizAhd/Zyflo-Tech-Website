import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Clapperboard,
  Globe,
  KeyRound,
  LifeBuoy,
  Menu,
  MessageCircle,
  MessageSquare,
  Receipt,
  Share2,
  Smartphone,
  TrendingUp,
  Workflow,
  X,
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
  hero,
  navLinks,
  process,
  projects,
  services,
  socials,
  isTodo,
} from './data/site.config'
import { Badge, Button, Container, Eyebrow, SectionHead } from './components/ui'
import {
  BlurIn,
  CardParallax,
  Magnetic,
  Parallax,
  ScrollProgress,
  Spotlight,
  SplitHeading,
  StaggerGrid,
  Tilt,
  useHideOnScrollNav,
  useProcessPin,
  useSmoothScroll,
} from './components/motion'
import { HeroCarousel } from './components/visuals'
import { ProjectScene, ServiceScene, StepGlyph } from './components/scenes'

/*
  Zyflo Tech, one page.

  Layout language follows stemlink.online: white ground, numbered section
  eyebrows, a product hero, a capability marquee, icon cards, a dark CTA band,
  a form led close. The palette is Zyflo's single brand green rather than
  StemLink's blue, violet and lime, which is what keeps it minimal.

  There is no stock or placeholder artwork anywhere on the page. The hero
  device, the seven service figures, the work cards and the process glyphs are
  drawn in DOM and SVG (see components/scenes.tsx). The only images are the
  actual logo.

  All copy comes from site.config.ts. Anything still set to a TODO_ value is
  hidden rather than rendered, so no placeholder detail can ship by accident.
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

const email = isTodo(contact.email) ? null : contact.email
const whatsapp = isTodo(contact.whatsapp)
  ? null
  : `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`
const phone = isTodo(contact.phone) ? null : contact.phone
const formKey = isTodo(contact.web3formsKey) ? null : contact.web3formsKey
const activeSocials = socials.filter((s) => !isTodo(s.url))

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const burgerRef = useRef<HTMLButtonElement>(null)

  // Retreats while reading down, returns the moment you scroll back up. A
  // fixed 64px header is roughly a tenth of a phone screen to give away.
  const hidden = useHideOnScrollNav()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll spy. rootMargin pins the current band to the upper third of the
  // viewport so a section counts as active once its heading is comfortably in
  // view, not the instant its first pixel appears.
  useEffect(() => {
    const sections = navLinks
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Lock the page behind the sheet, close on Escape, and hand focus back to the
  // button that opened it. The lock goes on documentElement: with overflow-x
  // set on html, html is the scroll container and an overflow on body is not
  // propagated to the viewport, so locking body did nothing.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      burgerRef.current?.focus()
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hidden && !open ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'bg-white/[0.98] shadow-[0_6px_24px_-16px_rgba(6,52,28,0.45)] backdrop-blur-xl' : 'bg-transparent'}`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label={`${business.name}, back to top`}
        >
          <img src="/brand/logo.png" alt="" width={34} height={34} className="rounded-lg" />
          <span className="font-ui text-[17px] font-semibold tracking-tight">
            Zyflo Tech
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? 'true' : undefined}
              className={`relative font-ui text-sm transition-colors ${
                active === l.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-brand-strong"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapped rather than given `hidden` directly: Button's base class
              sets `inline-flex`, and the two display utilities have equal
              specificity, so the base one won and the CTA stayed visible on
              phones next to the burger. */}
          <span className="hidden sm:inline-flex">
            <Magnetic strength={0.22}>
              <Button href="#contact">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Magnetic>
          </span>
          <button
            ref={burgerRef}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 overscroll-contain bg-white md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <Container className="flex h-16 items-center justify-between">
              <span className="font-ui text-[17px] font-semibold">
                Zyflo Tech
              </span>
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </Container>
            <Container className="mt-4 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-border py-4 font-ui text-2xl font-medium"
                >
                  {l.label}
                </motion.a>
              ))}
              <Button href="#contact" className="mt-8 w-full" onClick={() => setOpen(false)}>
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero() {
  const [line1, line2] = hero.headline.split('|')

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_55%_at_50%_28%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[54rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <BlurIn y={10}>
            <Badge>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              {business.location} &middot; Est. {business.foundedYear}
            </Badge>
          </BlurIn>

          {/* Characters, not words: the headline is the one place on the page
              where the extra granularity earns the extra nodes. Fluid size so
              it never overflows a 360px screen. */}
          <SplitHeading
            as="h1"
            type="chars"
            className="mt-6 font-ui text-[clamp(2.05rem,8.6vw,2.6rem)] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl"
          >
            {line1}
            <br />
            <span className="text-brand-strong sm:underline-sweep sm:inline-block">{line2}</span>
          </SplitHeading>

          <BlurIn delay={0.15}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.lead}
            </p>
          </BlurIn>

          <BlurIn delay={0.24}>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Magnetic strength={0.25} className="w-full sm:w-auto">
                <Button href={hero.primaryCta.href} className="w-full sm:w-auto">
                  {hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
              <Magnetic strength={0.25} className="w-full sm:w-auto">
                <Button href={hero.secondaryCta.href} variant="outline" className="w-full sm:w-auto">
                  {hero.secondaryCta.label}
                </Button>
              </Magnetic>
            </div>
          </BlurIn>
        </div>
      </Container>

      {/* Full bleed: a marquee that stops at the container edge reads as a
          cropped list rather than something continuing past the screen. */}
      <BlurIn delay={0.3} y={30} className="relative mt-16 sm:mt-20">
        <HeroCarousel />
      </BlurIn>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
function ServiceCard({ s, featured }: { s: (typeof services)[number]; featured: boolean }) {
  const Icon = SERVICE_ICON[s.id] ?? Globe

  return (
    <Spotlight
      as="article"
      id={`service-${s.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-card border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_40px_-24px_rgba(6,52,28,0.4)] ${
        featured ? 'lg:col-span-3' : ''
      }`}
    >
      <div className={`relative z-10 flex h-full flex-col ${featured ? 'lg:flex-row' : ''}`}>
        {/* The figure performs the service the card describes. The web card
            builds a page, the video card renders a cut and plays it back. */}
        <div
          className={`relative h-32 border-b border-border bg-[linear-gradient(135deg,#f8fbf9,#eef7f2)] ${
            featured ? 'lg:h-auto lg:w-[42%] lg:border-b-0 lg:border-r' : ''
          }`}
        >
          <ServiceScene id={s.id} />
        </div>

        <div className={`flex flex-1 flex-col p-6 ${featured ? 'lg:p-8' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-strong transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className={`font-ui font-semibold leading-snug ${featured ? 'text-xl' : 'text-lg'}`}>
              {s.title}
            </h3>
            <span className="ml-auto shrink-0 self-start font-display text-[11px] text-muted-foreground/60">
              {s.index}
            </span>
          </div>

          <p className="mt-3 pb-5 text-sm leading-relaxed text-muted-foreground">{s.promise}</p>

          <ul
            className={`mt-auto space-y-2 border-t border-border pt-5 ${
              featured ? 'sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 sm:space-y-0' : ''
            }`}
          >
            {s.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Spotlight>
  )
}

function Services() {
  return (
    <section id="services" className="py-20 sm:py-24">
      <Container>
        <SectionHead
          index="01"
          eyebrow="What I do"
          title={
            <>
              Seven ways to make the business <span className="text-brand-strong">run better</span>.
            </>
          }
          lead="Most projects touch more than one of these. Tell me the problem and I will tell you which of them it actually needs, including when the answer is less than you think."
        />

        {/* Seven cards in a three column grid would leave one orphan on the
            last row, so the first runs full width as a featured card and the
            remaining six fill two even rows. */}
        <StaggerGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" from="start">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} featured={i === 0} />
          ))}
        </StaggerGrid>
      </Container>
    </section>
  )
}

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
          lead="A point of sale system for SJD, the website for mrvadventure.lk, and the invoicing tool the studio runs on. Each one was built by the same person who answers your enquiry."
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
                  src="/brand/logo.png"
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
          <img src="/brand/logo.png" alt="" width={26} height={26} className="rounded-md" />
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
        </nav>
      </Container>
    </footer>
  )
}

// ---------------------------------------------------------------------------
export default function App() {
  useSmoothScroll()

  return (
    <>
      <ScrollProgress />
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Principles />
        <Process />
        <Work />
        <Capabilities />
        <Studio />
        <Faqs />
        <Contact />
      </main>
      <Footer />
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-strong text-white shadow-[0_12px_30px_-10px_rgba(6,52,28,0.6)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:bottom-6 sm:right-6"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
      )}
    </>
  )
}
