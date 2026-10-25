import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { business, contact, contactSection, isTodo, services, startProjectImage } from '../data/site.config'
import { activeSocials, email, formKey, phone, whatsapp } from '../data/contact'
import { Button, CenterHead, Container, SplitHead } from '../components/ui'
import { BlurIn } from '../components/motion'

// ---------------------------------------------------------------------------
// Enquiry form
// ---------------------------------------------------------------------------
function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // A "get a quote for this" link on a service opens the form on that service.
  const wanted = new URLSearchParams(window.location.search).get('service')
  const preselected = services.find((s) => s.id === wanted)?.title ?? services[0].title

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
        role="status"
        className="rounded-[20px] bg-surface p-8"
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
          We read every enquiry and reply within a day or two.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>
          Send another
        </Button>
      </motion.div>
    )
  }

  // text-base below sm: iOS Safari zooms the page in when a focused input is
  // under 16px, and it never zooms back out.
  // GrowthLab's fields: soft filled boxes, no outline until focused.
  const field =
    'w-full rounded-xl border border-transparent bg-surface px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:bg-white focus:outline-none'
  const label = 'mb-2 block font-ui text-base font-medium text-foreground'

  return (
    <form onSubmit={onSubmit}>
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
            defaultValue={preselected}
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
        <p role="alert" className="mt-4 text-sm text-red-700">
          That did not send. Please try again, or reach us directly.
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
        <p className="mt-4 text-xs leading-[1.4] text-muted-foreground">
          {whatsapp
            ? 'Pressing send opens WhatsApp with your enquiry already written. We read every message and reply within a day or two.'
            : email
              ? 'Pressing send opens your email app with your enquiry already written.'
              : 'Contact details are being finalised and will appear here shortly.'}
        </p>
      )}
      <p className="mt-2 text-xs leading-[1.4] text-muted-foreground">
        What you write is used only to reply to you. It is not shared or added to a mailing list.
      </p>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Contact, in GrowthLab's form: the heading on the left and the promise on
// the right, then the enquiry form beside a photo, then the ways to reach
// the studio as four cards.
// ---------------------------------------------------------------------------
const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

function ReachCard({
  icon: Icon,
  title,
  sub,
  href,
  external,
}: {
  icon: typeof Mail
  title: string
  sub: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="mt-6 block break-words font-ui text-lg font-semibold text-foreground">{title}</span>
      <span className="mt-1 block text-sm leading-[1.4] text-muted-foreground">{sub}</span>
    </>
  )
  const cls = 'block h-full rounded-[20px] bg-surface p-6 text-center [&>span:first-child]:mx-auto'
  return href ? (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${cls} transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function Contact() {
  return (
    <>
      <section id="contact" className="pb-20 pt-32 sm:pb-24 sm:pt-40">
        <Container>
          <SplitHead h1 title={contactSection.heading} lead={contactSection.lead} />

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <BlurIn delay={0.12} y={24}>
              <EnquiryForm />
            </BlurIn>
            <BlurIn delay={0.18} y={24} className="hidden lg:block">
              <img
                src={img(startProjectImage.src)}
                alt=""
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="h-full min-h-[32rem] w-full rounded-[20px] object-cover"
              />
            </BlurIn>
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <CenterHead title="Other ways to reach us" lead="WhatsApp is the quickest. Every message is read and answered within a day or two." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whatsapp && (
              <li>
                <ReachCard icon={MessageCircle} title="WhatsApp" sub="Message us, the quickest way in" href={whatsapp} external />
              </li>
            )}
            {email && (
              <li>
                <ReachCard icon={Mail} title={email} sub="For longer briefs and files" href={`mailto:${email}`} />
              </li>
            )}
            {phone && (
              <li>
                <ReachCard icon={Phone} title={phone} sub="Mon to Sat, 9am to 7pm (+5:30)" href={`tel:${phone.replace(/[^\d+]/g, '')}`} />
              </li>
            )}
            <li>
              <ReachCard icon={MapPin} title={business.location} sub={`${business.name}, working with clients anywhere`} />
            </li>
          </ul>
          {activeSocials.length > 0 && (
            <p className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {activeSocials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-brand-strong">
                  {s.label}
                </a>
              ))}
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
