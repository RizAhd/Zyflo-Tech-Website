import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Menu, MessageCircle, X } from 'lucide-react'

import { business, navLinks, pages } from './data/site.config'
import { whatsapp } from './data/contact'
import { LOGO_SRC } from './data/assets'
import { Button, Container } from './components/ui'
import {
  Magnetic,
  ScrollProgress,
  useHideOnScrollNav,
  useSmoothScroll,
} from './components/motion'
import { Link, usePath, useScrollOnNavigate } from './router'
import Home from './pages/Home'
import Footer from './sections/Footer'
import { Ready, ReadyContext } from './ready'

/*
  Zyflo Tech, six pages.

  Layout language follows stemlink.online: white ground, eyebrows, a product
  hero, icon cards, a dark CTA band, a form led close. The palette is Zyflo's
  single brand green rather than StemLink's blue, violet and lime, which is
  what keeps it minimal.

  There is no stock or placeholder artwork anywhere on the site. The service
  figures, the work cards and the process glyphs are drawn in DOM and SVG (see
  components/scenes.tsx). The only images are the actual logo.

  This file is the frame every page shares: the header, the footer and the
  WhatsApp button. Each page is its own chunk, fetched when it is opened, and
  the home page is the only one bundled in, so the first screen needs the
  least possible JavaScript.

  All copy comes from data/site.config.ts. Anything still set to a TODO_ value
  is hidden rather than rendered, so no placeholder detail can ship by
  accident.
*/

const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  '/services': () => import('./pages/Services'),
  '/process': () => import('./pages/Process'),
  '/work': () => import('./pages/Work'),
  '/about': () => import('./pages/About'),
  '/contact': () => import('./pages/Contact'),
}

const ROUTES: Record<string, ComponentType> = {
  '/': Home,
  ...Object.fromEntries(Object.entries(loaders).map(([path, load]) => [path, lazy(load)])),
}


// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function Nav() {
  const path = usePath()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
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

  // The contact page opens on a dark panel, where a transparent header would
  // put dark text on dark. It gets the solid bar from the first pixel.
  const solid = scrolled || path === '/contact'

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
      } ${solid ? 'bg-white/[0.98] shadow-[0_6px_24px_-16px_rgba(6,52,28,0.45)] backdrop-blur-xl' : 'bg-transparent'}`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label={`${business.name}, home`}
        >
          <img src={LOGO_SRC} alt="" width={34} height={34} className="rounded-lg" />
          <span className="font-ui text-[17px] font-semibold tracking-tight">Zyflo Tech</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((l) => {
            const active = path === l.path
            return (
              <Link
                key={l.path}
                to={l.path}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded font-ui text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-brand-strong"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapped rather than given `hidden` directly: Button's base class
              sets `inline-flex`, and the two display utilities have equal
              specificity, so the base one won and the CTA stayed visible on
              phones next to the burger. */}
          <span className="hidden sm:inline-flex">
            <Magnetic strength={0.22}>
              <Button href="/contact">
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
                <span className="font-ui text-[17px] font-semibold">Zyflo Tech</span>
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
                {navLinks.map((l, i) => {
                  const active = path === l.path
                  return (
                    <motion.div
                      key={l.path}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={l.path}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-[56px] items-center justify-between border-b border-border py-4 font-ui text-2xl font-medium ${
                          active ? 'text-brand-strong' : ''
                        }`}
                      >
                        {l.label}
                        {active && <span className="h-2 w-2 rounded-full bg-brand-strong" aria-hidden="true" />}
                      </Link>
                    </motion.div>
                  )
                })}
                <Button href="/contact" className="mt-8 w-full" onClick={() => setOpen(false)}>
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
// Page not found
// ---------------------------------------------------------------------------
function NotFound() {
  return (
    <section className="py-32 sm:py-40">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
            Error 404
          </p>
          <h1 className="mt-4 font-ui text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            That page does not exist.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            The link may be old or mistyped. These are the pages that do exist.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/">Back to home</Button>
            <Button href="/contact" variant="outline">
              Contact
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Keeps the title, description and canonical in step with the page on screen
// after an in-app navigation. A direct visit already has them in the HTML.
// ---------------------------------------------------------------------------
function useDocumentMeta(path: string) {
  useEffect(() => {
    const page = pages.find((p) => p.path === path)
    const title = page?.title ?? 'Page not found | Zyflo Tech'
    document.title = title
    const set = (sel: string, attr: string, value: string) =>
      document.head.querySelector(sel)?.setAttribute(attr, value)
    if (page) set('meta[name="description"]', 'content', page.description)
    set('meta[property="og:title"]', 'content', title)
    if (page) set('meta[property="og:description"]', 'content', page.description)
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical && page) {
      // The canonical is the real domain's address, never the preview's base.
      const url = new URL(page.path === '/' ? '/' : `${page.path}/`, canonical.href).href
      canonical.href = url
      set('meta[property="og:url"]', 'content', url)
    }
  }, [path])
}

function Page({ onReady }: { onReady: (path: string) => void }) {
  const path = usePath()
  const markReady = useCallback(() => onReady(path), [onReady, path])
  useDocumentMeta(path)
  useScrollOnNavigate(() => ScrollTrigger.refresh())
  const View = ROUTES[path] ?? NotFound

  // Keyed by path: a new page mounts fresh (its scroll triggers are created
  // and cleaned up with it) and fades in. There is no exit animation, so the
  // old page's pinned sections never linger while the new one loads.
  return (
    <ReadyContext.Provider value={markReady}>
      <div key={path} className="page-in">
        <Suspense fallback={<div className="min-h-[70svh]" aria-busy="true" />}>
          <View />
          {/* The home page reports itself once its lower half has loaded. */}
          {path !== '/' && <Ready />}
        </Suspense>
      </div>
    </ReadyContext.Provider>
  )
}

// ---------------------------------------------------------------------------
export default function App() {
  useSmoothScroll()
  const path = usePath()
  const [readyPath, setReadyPath] = useState<string | null>(null)

  // Once the first page has painted, fetch the other pages in the background
  // so moving to one is instant instead of waiting on a download.
  useEffect(() => {
    const warm = () => Object.values(loaders).forEach((load) => void load())
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (ric) {
      const id = ric(warm, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(warm, 2500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="min-h-[65svh] outline-none">
        <Page onReady={setReadyPath} />
      </main>
      {readyPath === path && <Footer />}
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
