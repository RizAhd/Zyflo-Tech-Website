import { process } from '../data/site.config'
import { BlurIn } from './motion'

/*
  The four steps of a project as GrowthLab's process cards: tall cards on the
  black band, each one stepping further down the page than the last, with a
  big number over a photo tinted from Zyflo green into black.

  The photos are the site's own service photos, chosen to match the step
  (talking it through, mapping it out, building, handing over), turned to
  grey and then shaded, so four very different shots read as one set.
  On a phone the cards simply stack.
*/

const PHOTOS = ['services/software.webp', 'services/ai.webp', 'services/web.webp', 'studio/start-a-project.webp']
const img = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function ProcessCards() {
  return (
    <ol className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-5">
      {process.map((p, i) => (
        <li
          key={p.step}
          // The descent: each card starts lower than the one before it on a wide
          // screen, which is what turns four cards into a staircase.
          className={['', 'lg:mt-40', 'lg:mt-80', 'lg:mt-[30rem]'][i]}
        >
          <BlurIn y={36} delay={i * 0.06}>
            <article className="relative flex h-[22rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:h-[24rem]">
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

              <span className="relative self-end font-ui text-7xl font-semibold leading-none tracking-tight text-white sm:text-8xl" aria-hidden="true">
                {p.step}
              </span>
              <div className="relative">
                <h3 className="font-ui text-2xl font-semibold text-white">
                  <span className="sr-only">Step {p.step}: </span>
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/85">{p.body}</p>
              </div>
            </article>
          </BlurIn>
        </li>
      ))}
    </ol>
  )
}
