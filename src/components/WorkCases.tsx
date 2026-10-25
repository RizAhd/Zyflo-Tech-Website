import { ArrowUpRight } from 'lucide-react'

import { projects } from '../data/site.config'
import { Link } from '../router'
import { BlurIn } from './motion'

/*
  Shipped work as GrowthLab's case cards: the story on the left (what it is,
  who it was for, what it took) and the work itself on the right. A project
  with a real screenshot shows it; one without gets a plain black panel with
  its name set large, rather than a mock screen. Nothing here is invented: client, category and tags all
  come from the project's own entry in site.config.
*/

const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

function Dot({ children }: { children: string }) {
  return (
    <li className="inline-flex items-center gap-2 font-ui text-base font-medium text-foreground">
      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </li>
  )
}

export default function WorkCases({ ids }: { ids?: string[] }) {
  const shown = projects
    .map((p) => ({ p }))
    .filter(({ p }) => !ids || ids.includes(p.id))
    .sort((a, b) => Number(Boolean(b.p.image)) - Number(Boolean(a.p.image)))

  return (
    <div className="mt-14 space-y-5">
      {shown.map(({ p }) => (
        <BlurIn key={p.id} y={28}>
          <article className="grid overflow-hidden rounded-[20px] bg-surface md:grid-cols-2">
            <div className="flex flex-col p-7 sm:p-9">
              <h3 className="font-ui text-2xl font-semibold sm:text-3xl">{p.title}</h3>
              <p className="mt-3 max-w-md text-base leading-[1.4] text-muted-foreground">{p.summary}</p>

              <dl className="mt-6 border-t border-border pt-5">
                <dt className="text-sm text-muted-foreground">Client</dt>
                <dd className="mt-2">
                  <ul>
                    <Dot>{p.client}</Dot>
                  </ul>
                </dd>
                <dt className="mt-5 border-t border-border pt-5 text-sm text-muted-foreground">Work</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    <Dot>{p.category}</Dot>
                    {p.tags
                      // Status words, and any tag the category already says ("Website" next
                      // to "Website Building"), would only repeat what is on the card.
                      .filter((t) => t !== 'Shipped' && t !== 'Live')
                      .filter((t) => !p.category.toLowerCase().includes(t.toLowerCase()) && !t.toLowerCase().includes(p.category.toLowerCase()))
                      .slice(0, 2)
                      .map((t) => (
                        <Dot key={t}>{t}</Dot>
                      ))}
                  </ul>
                </dd>
              </dl>

              <div className="mt-8 md:mt-auto md:pt-8">
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-ink px-7 font-ui text-base font-semibold text-white transition-colors hover:bg-[#2b2b2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Visit the live site
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-ink px-7 font-ui text-base font-semibold text-white transition-colors hover:bg-[#2b2b2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Build something like this
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative min-h-[16rem] bg-ink md:min-h-full">
              {p.image ? (
                <img
                  src={img(p.image.src)}
                  alt={p.image.alt}
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <div
                  className="absolute inset-0 flex flex-col justify-end bg-[radial-gradient(circle_at_85%_15%,rgba(0,139,72,0.45),transparent_55%)] p-8 text-white sm:p-10"
                  aria-hidden="true"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.08em] text-brand-bright">{p.category}</span>
                  <span className="mt-3 font-ui text-5xl font-semibold leading-none sm:text-6xl">{p.title}</span>
                </div>
              )}
            </div>
          </article>
        </BlurIn>
      ))}
    </div>
  )
}
