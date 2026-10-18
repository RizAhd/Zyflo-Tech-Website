import { business, navLinks, services } from '../data/site.config'
import { email, phone, whatsapp } from '../data/contact'
import { LOGO_WHITE_SRC } from '../data/assets'
import { Container } from '../components/ui'
import { Link } from '../router'

// ---------------------------------------------------------------------------
const linkClass =
  'inline-flex min-h-[44px] items-center text-sm text-ink-muted transition-colors hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-h-[32px]'
const headClass = 'font-mono text-xs font-medium uppercase tracking-[0.08em] text-white/60'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-ink pb-8 pt-14 text-white">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={LOGO_WHITE_SRC} alt="" width={30} height={26} />
              <span className="font-ui text-base font-semibold">{business.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {business.tagline} from a studio in {business.location}, founded by {business.owner}.
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

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-ink-muted sm:text-left">
          <p>
            &copy; {year} {business.legalName}. Built in {business.location}.
          </p>
        </div>
      </Container>
    </footer>
  )
}
