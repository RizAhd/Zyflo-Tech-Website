import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, MessageCircle, X } from 'lucide-react'

import { business, hero, navLinks } from './data/site.config'
import { whatsapp } from './data/contact'
import { LOGO_SRC } from './data/assets'
import { Badge, Button, Container } from './components/ui'
import {
  BlurIn,
  Magnetic,
  ScrollProgress,
  SplitHeading,
  useHideOnScrollNav,
  useSmoothScroll,
} from './components/motion'
import { HeroCarousel } from './components/visuals'

/*
  Zyflo Tech, one page.

  Layout language follows stemlink.online: white ground, numbered section
  eyebrows, a product hero, a capability marquee, icon cards, a dark CTA band,
  a form led close. The palette is Zyflo's single brand green rather than
  StemLink's blue, violet and lime, which is what keeps it minimal.

  There is no stock or placeholder artwork anywhere on the page. The service
  figures, the work cards and the process glyphs are drawn in DOM and SVG (see
  components/scenes.tsx). The only images are the actual logo.

  Load order: this file carries only the nav and the hero, so the first screen
  needs the least possible JavaScript. Every other section lives in Below.tsx
  and is fetched once the hero has painted.

  All copy comes from site.config.ts. Anything still set to a TODO_ value is
  hidden rather than rendered, so no placeholder detail can ship by accident.
*/

const Sections = lazy(() => import('./Below').then((m) => ({ default: m.Sections })))
const Footer = lazy(() => import('./Below').then((m) => ({ default: m.Footer })))

/** True once the browser has had a quiet moment after the first paint. */
function useAfterFirstPaint() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const go = () => setReady(true)
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (ric) {
      const id = ric(go, { timeout: 700 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(go, 150)
    return () => window.clearTimeout(id)
  }, [])
  return ready
}
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
  // The sections below the hero load a moment after the first paint (see
  // Below.tsx), so the spy attaches again when they announce themselves.
  const [sectionsReady, setSectionsReady] = useState(false)
  useEffect(() => {
    const on = () => setSectionsReady(true)
    window.addEventListener('zyflo:sections-ready', on)
    return () => window.removeEventListener('zyflo:sections-ready', on)
  }, [])

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
  }, [sectionsReady])

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
          <img src={LOGO_SRC} alt="" width={34} height={34} className="rounded-lg" />
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

      {/* Portalled to <body>. The header carries a transform and a backdrop
          filter, and either one makes it the containing block for any `fixed`
          child, so the sheet was sized to the 64px header instead of the
          screen and the links hung below it on a transparent background. */}
      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-white md:hidden"
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
      </AnimatePresence>,
      document.body,
      )}
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
export default function App() {
  useSmoothScroll()
  const rest = useAfterFirstPaint()

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
        {rest && (
          <Suspense fallback={null}>
            <Sections />
          </Suspense>
        )}
      </main>
      {rest && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
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
