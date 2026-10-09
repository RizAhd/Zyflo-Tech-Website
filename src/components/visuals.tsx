import {
  Bot,
  Braces,
  CircuitBoard,
  Cloud,
  CodeXml,
  Database,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Server,
  Smartphone,
  Terminal,
  Webhook,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

import { Marquee } from './ui'

/*
  The hero carousel.

  A row of glyphs travelling past, taken from the 21st.dev integrations hero.

  Its round chips are gone. Fourteen circles side by side all share one
  baseline, so their bottom edges line up into a broken rule running most of
  the way across the page, sitting exactly between the hero and the section
  below. Measured off a screenshot it covered 66% of that pixel row in border
  grey, and the eye joins the gaps: the row stopped reading as icons and
  started reading as a divider. Bare glyphs have no shared edge to line up.
  Parts of the original pattern were left out on purpose:

    - its icons are other companies' brand logos served from a third party CDN.
      Zyflo integrates with none of them, so showing them would be a claim, and
      hotlinking a logo set is not ours to do. These are lucide glyphs standing
      for Zyflo's own seven services instead, which is the one thing the row can
      honestly say.
    - the original fades its edges with two solid white gradient overlays. This
      hero sits on a dotted field, so a solid overlay would stamp a white band
      across it. The mask on Marquee fades to transparent and works over any
      background.
    - its keyframes ship in a <style jsx> block, which is a Next.js feature and
      does nothing in Vite. The animation lives in styles.css.

  The glyphs are the craft rather than the catalogue: code, a build, version
  control, data, a server, deployment, webhooks, automation, mobile. A trolley
  and a megaphone said "marketing agency"; this row should say the studio writes
  and ships software.
*/

const GLYPHS: LucideIcon[] = [
  CodeXml, // the site itself
  Braces, // the language it is written in
  Terminal, // the build
  GitBranch, // version control
  Layers, // component architecture
  Database, // the data behind it
  Server, // where it runs
  Cloud, // deployment
  Webhook, // integrations between systems
  Workflow, // automation
  Bot, // AI in the workflow
  CircuitBoard, // the machinery underneath
  Smartphone, // mobile builds
  MonitorSmartphone, // responsive across devices
]

/**
 * Repeated so the track always overflows its container. Marquee renders the
 * children twice and translates a full track width, so the seam is invisible
 * regardless of how wide the viewport is.
 */
const repeat = (icons: LucideIcon[], times = 2) =>
  Array.from({ length: times }).flatMap(() => icons)

function Tile({ Icon, index }: { Icon: LucideIcon; index: number }) {
  return (
    <span className="mx-5 inline-flex shrink-0 items-center justify-center sm:mx-8">
      <Icon
        className={`h-7 w-7 transition-colors duration-300 sm:h-8 sm:w-8 ${
          index % 3 === 0 ? 'text-brand-strong' : 'text-foreground/35'
        }`}
        strokeWidth={1.6}
      />
    </span>
  )
}

export function HeroCarousel() {
  return (
    <div className="relative" aria-hidden="true">
      <Marquee speed="32s">
        {repeat(GLYPHS).map((Icon, i) => (
          <Tile key={i} Icon={Icon} index={i} />
        ))}
      </Marquee>
    </div>
  )
}
