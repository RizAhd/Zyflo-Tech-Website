import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { faqs } from '../data/site.config'
import { CenterHead, Container } from '../components/ui'

// ---------------------------------------------------------------------------
// FAQ, GrowthLab's form: each question a rounded row with a round plus button,
// the open row filled solid (matte black here, where GrowthLab uses its
// orange) with its answer underneath. The first starts open.
//
// Every answer stays in the page while closed: the rows collapse with a grid
// track, not by removing the text, so search engines and assistants still read
// each full answer, and the FAQPage structured data generated at build time
// from this same `faqs` export matches it word for word.
// ---------------------------------------------------------------------------
export default function Faqs() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container>
        <CenterHead
          title="Frequently asked questions"
          lead="Straight answers about cost, ownership and what happens after launch. If yours is not here, ask us directly."
        />

        <ul className="mx-auto mt-14 max-w-[75rem] space-y-2">
          {faqs.map((f, i) => {
            const isOpen = i === open
            return (
              <li
                key={f.q}
                className={`rounded-[20px] transition-colors duration-300 ${isOpen ? 'bg-ink text-white' : 'bg-surface text-foreground'}`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 rounded-[20px] px-6 py-5 text-left font-ui text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-7"
                  >
                    {f.q}
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? 'bg-white text-ink' : 'bg-ink text-white'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden" aria-hidden={!isOpen}>
                    <p className={`px-6 pb-6 text-base leading-[1.4] sm:px-7 ${isOpen ? 'text-white/85' : 'text-muted-foreground'}`}>{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
