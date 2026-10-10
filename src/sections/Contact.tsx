import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'

import { business, contact, contactSection, isTodo, services } from '../data/site.config'
import { activeSocials, email, formKey, phone, whatsapp } from '../data/contact'
import { Button, Container, Eyebrow } from '../components/ui'
import { BlurIn, SplitHeading } from '../components/motion'

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
export default function Contact() {
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
              <Eyebrow onInk>
                Let us build together
              </Eyebrow>
            </BlurIn>
            <SplitHeading as="h1" className="mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
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
