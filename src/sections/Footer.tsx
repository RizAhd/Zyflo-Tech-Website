import { business, navLinks } from '../data/site.config'
import { email, whatsapp } from '../data/contact'
import { LOGO_SRC } from '../data/assets'
import { Container } from '../components/ui'
import { Link } from '../router'

// ---------------------------------------------------------------------------
export default function Footer() {
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
        <nav className="flex flex-wrap items-center justify-center gap-x-5 text-xs text-ink-muted" aria-label="Footer">
          {navLinks.map((l) => (
            <Link key={l.path} to={l.path} className="inline-flex min-h-[44px] items-center hover:text-brand-bright">
              {l.label}
            </Link>
          ))}
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
