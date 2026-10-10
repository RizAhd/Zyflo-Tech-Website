import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

/*
  A small history router. The site has six fixed pages, so a routing library
  would be more code to ship than the routing itself.

  Every page also exists as a real file on the server (/services/ is
  services/index.html), so a direct visit, a crawler and a refresh all get the
  page itself. This router only takes over once the app is running, to move
  between pages without a reload.

  Paths inside the app never carry the base ("/services"). The base only
  appears on the address bar, so the same build works at the site root
  (zyflo.tech) and under a sub path (a GitHub Pages preview).
*/

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') // '' or '/repo'

/** "/Zyflo-Tech-Website/services/" -> "/services" */
function normalise(pathname: string): string {
  let p = pathname
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length)
  p = p.replace(/\/index\.html$/, '').replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/** "/services" + "#service-ai" -> "/Zyflo-Tech-Website/services/#service-ai" */
export function hrefFor(to: string): string {
  const hashAt = to.indexOf('#')
  const path = hashAt >= 0 ? to.slice(0, hashAt) : to
  const hash = hashAt >= 0 ? to.slice(hashAt) : ''
  const clean = path === '' || path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`
  return `${BASE}${clean}${hash}`
}

// Links that predate the pages ("zyflo.tech/#process") keep working.
const LEGACY_HASH: Record<string, string> = {
  services: '/services',
  process: '/process',
  work: '/work',
  about: '/about',
  faq: '/contact',
  contact: '/contact',
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

if (typeof window !== 'undefined') {
  const legacy = LEGACY_HASH[window.location.hash.slice(1)]
  if (legacy && normalise(window.location.pathname) === '/') {
    history.replaceState(null, '', hrefFor(legacy))
  }
  window.addEventListener('popstate', emit)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const readPath = () => normalise(window.location.pathname)
const readHash = () => window.location.hash

/** The current page, such as "/", "/services" or "/contact". */
export function usePath(): string {
  return useSyncExternalStore(subscribe, readPath, () => '/')
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, readHash, () => '')
}

export function navigate(to: string) {
  const target = hrefFor(to)
  const current = window.location.pathname + window.location.hash
  if (target !== current) history.pushState(null, '', target)
  emit()
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

/** An ordinary anchor (so it is crawlable and opens in a new tab) that navigates in place. */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const handle = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (rest.target && rest.target !== '_self') return
      e.preventDefault()
      navigate(to)
    },
    [to, onClick, rest.target],
  )
  return (
    <a href={hrefFor(to)} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

/**
 * After a page change: back to the top of the new page, or to the section a
 * hash points at. The service tabs place themselves from their own hash, so
 * those are left alone.
 */
export function useScrollOnNavigate(onSettled?: () => void) {
  const path = usePath()
  const hash = useHash()
  const first = useRef(true)

  useEffect(() => {
    // The first run is the page the visitor landed on: leave the browser's own
    // position alone and only act on a hash.
    const landing = first.current
    first.current = false
    let raf = 0
    let tries = 0
    const id = decodeURIComponent(hash.slice(1))
    // Hand focus to the page so a keyboard or screen reader user starts at its
    // top, not on the link they just used (which no longer exists on screen).
    if (!landing) document.getElementById('main')?.focus({ preventScroll: true })
    if (!id) {
      if (!landing) window.scrollTo({ top: 0, behavior: 'auto' })
    } else if (!id.startsWith('service-')) {
      const seek = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else if (tries++ < 40) raf = requestAnimationFrame(seek)
      }
      seek()
    }
    const settle = window.setTimeout(() => onSettled?.(), 250)
    const late = window.setTimeout(() => onSettled?.(), 900)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      window.clearTimeout(late)
    }
    // onSettled is stable by construction at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, hash])
}
