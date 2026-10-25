import { process } from '../data/site.config'
import { BlurIn } from './motion'

/*
  The four steps of a project as GrowthLab's process cards, with GrowthLab's
  scroll behaviour, measured from the live template.

  On a wide screen each card sits in its own column, starting one card height
  (454px) lower than the card before it, so the four begin as a staircase.
  Every card is sticky about a third of the way down the screen: as the page
  scrolls, the first card stops there, the second catches up and stops beside
  it, then the third and the fourth, until all four stand in one row. All the
  columns end at the same line, so that row then scrolls away together.

  Each card is a photo tinted from Zyflo green into black (GrowthLab tints
  its photos orange), with the big number and the step at its foot: 285 by
  454px, 48px padding, 112px bold numbers. On a phone the cards simply stack.
*/

const PHOTOS = ['services/software.webp', 'services/ai.webp', 'services/web.webp', 'studio/start-a-project.webp']
const STAIR = ['', 'lg:pt-[454px]', 'lg:pt-[908px]', 'lg:pt-[1362px]']
const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function ProcessCards() {
  return (
    <ol className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
      {process.map((p, i) => (
        <li key={p.step} className={STAIR[i]}>
          <BlurIn y={36} delay={i * 0.06} className="lg:sticky lg:top-[clamp(6rem,37vh,21rem)]">
            <article className="relative flex h-[26rem] flex-col justify-between overflow-hidden rounded-[20px] border border-white/15 p-8 sm:h-[454px] sm:p-12">
              <img
                src={img(PHOTOS[i])}
                alt=""
                width={800}
                height={533}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,139,72,0.92)_0%,rgba(0,90,48,0.82)_45%,rgba(10,10,10,0.95)_100%)] mix-blend-multiply"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(10,10,10,0.75)_100%)]" aria-hidden="true" />

              <span className="relative self-end font-ui text-[88px] font-bold leading-[1.2] text-white sm:text-[112px]" aria-hidden="true">
                {p.step}
              </span>
              <div className="relative">
                <h3 className="font-ui text-2xl font-semibold text-white">
                  <span className="sr-only">Step {p.step}: </span>
                  {p.title}
                </h3>
                <p className="mt-4 text-base leading-[1.4] text-white">{p.body}</p>
              </div>
            </article>
          </BlurIn>
        </li>
      ))}
    </ol>
  )
}
