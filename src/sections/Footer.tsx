import { business, navLinks, services } from '../data/site.config'
import { email, phone, whatsapp } from '../data/contact'
import { LOGO_SRC } from '../data/assets'
import { Container } from '../components/ui'
import { Link } from '../router'

// ---------------------------------------------------------------------------
const linkClass =
  'inline-flex min-h-[44px] items-center text-sm text-ink-muted transition-colors hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-h-[32px]'
const headClass = 'font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-ink pb-8 pt-14 text-white">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={LOGO_SRC} alt="" width={30} height={30} className="rounded-md" />
              <span className="font-ui text-base font-semibold">{business.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {business.tagline} from a one person studio in {business.location}. Run by {business.owner} since{' '}
              {business.foundedMonth} {business.foundedYear}.
            </p>
          </div>

          <nav aria-label="Pages">
            <p className={headClass}>Pages</p>
            <ul className="mt-3">
              {navLinks.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <p className={headClass}>Services</p>
            <ul className="mt-3">
              {services.map((sv) => (
                <li key={sv.id}>
                  <Link to={`/services/#service-${sv.id}`} className={linkClass}>
                    {sv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={headClass}>Contact</p>
            <ul className="mt-3">
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    WhatsApp{phone ? `, ${phone}` : ''}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className={`${linkClass} break-all`}>
                    {email}
                  </a>
                </li>
              )}
              <li className="py-2 text-sm text-ink-muted">Mon to Sat, 9am to 7pm (+5:30)</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-center text-xs text-ink-muted sm:flex-row sm:text-left">
          <p>
            &copy; {year} {business.legalName}. Built in {business.location}.
          </p>
          <MotionToggle />
        </div>
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
      className="inline-flex min-h-[44px] items-center text-ink-muted hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      Motion: {isOn ? 'on' : 'off'}
    </button>
  )
}
