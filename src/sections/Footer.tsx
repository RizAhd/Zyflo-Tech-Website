import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react'

import { business, navLinks, services } from '../data/site.config'
import { email, phone, whatsapp } from '../data/contact'
import { LOGO_WHITE_SRC } from '../data/assets'
import { Container } from '../components/ui'
import { Link } from '../router'

/*
  The footer in the GrowthLab form: the wordmark large on black with one line
  about the studio, a "have a project" block where GrowthLab puts its
  newsletter (the studio has no newsletter, so it points at WhatsApp
  instead), then the link columns and the contact details, and the name set
  huge across the foot.
*/

const linkClass =
  'inline-flex min-h-[44px] items-center text-[15px] text-ink-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-h-[34px]'
const headClass = 'font-ui text-base font-semibold text-white'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="overflow-hidden bg-ink pt-16 text-white sm:pt-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <img src={LOGO_WHITE_SRC} alt="" width={52} height={45} className="h-10 w-auto sm:h-12" />
              <span className="font-ui text-5xl font-semibold sm:text-6xl">{business.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.4] text-ink-muted">
              {business.tagline} from a studio in {business.location}, founded by {business.owner}: websites, apps,
              AI automation and the marketing that brings people to them.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <p className="font-ui text-xl font-semibold">Have a project in mind?</p>
            <p className="mt-2 text-[15px] text-ink-muted">Tell us what you need and we will tell you honestly what it takes.</p>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-white px-7 font-ui text-base font-semibold text-ink transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Message us on WhatsApp
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1.3fr]">
          <nav aria-label="Pages">
            <p className={headClass}>Pages</p>
            <ul className="mt-3">
              <li>
                <Link to="/" className={linkClass}>
                  Home
                </Link>
              </li>
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
            <p className={headClass}>Have a question?</p>
            <ul className="mt-4 space-y-4">
              {phone && (
                <li className="flex gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span>
                    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-ui text-[15px] font-medium text-white hover:text-brand-bright">
                      {phone}
                    </a>
                    <span className="block text-sm text-ink-muted">Mon to Sat, 9am to 7pm (+5:30)</span>
                  </span>
                </li>
              )}
              {whatsapp && (
                <li className="flex gap-3">
                  <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-ui text-[15px] font-medium text-white hover:text-brand-bright">
                      WhatsApp
                    </a>
                    <span className="block text-sm text-ink-muted">The quickest way to reach us</span>
                  </span>
                </li>
              )}
              {email && (
                <li className="flex gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span className="min-w-0">
                    <a href={`mailto:${email}`} className="break-all font-ui text-[15px] font-medium text-white hover:text-brand-bright">
                      {email}
                    </a>
                    <span className="block text-sm text-ink-muted">For longer briefs and files</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-ink-muted sm:text-left">
          <p>
            &copy; {year} {business.legalName}. Built in {business.location}.
          </p>
        </div>
      </Container>

      {/* GrowthLab ends on its name set huge across the foot of the page,
          fading out and cut by the edge. Sized so "Zyflo Tech" (4.54 em wide
          in Urbanist Bold) fills the width. Decorative. */}
      <div className="mx-auto mt-10 w-full max-w-[1320px] overflow-hidden px-5 sm:px-8 xl:px-0" aria-hidden="true">
        <p className="-mb-[0.22em] whitespace-nowrap bg-[linear-gradient(180deg,#3ddc84_0%,#008b48_35%,rgba(17,17,17,0)_92%)] bg-clip-text font-ui text-[calc((100vw-2.5rem)/4.6)] font-bold leading-none tracking-[-0.02em] text-transparent sm:text-[calc((100vw-4rem)/4.6)] xl:text-[calc(1320px/4.6)]">
          {business.name}
        </p>
      </div>
    </footer>
  )
}
