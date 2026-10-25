import type { ReactNode } from 'react'

import { BlurIn, SplitHeading } from './motion'
import { Link } from '../router'

/*
  The small vocabulary every section is built from.

  StemLink composes its page out of shadcn primitives; this is the same idea
  cut down to what a one-page marketing site actually needs, so there is no
  component library to install and nothing unused shipped to the browser.
*/

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[75rem] px-5 sm:px-8 ${className}`}>{children}</div>
  )
}

/** `01 / What we do`. The numbered micro-label StemLink puts above every section. */
export function Eyebrow({
  index,
  children,
  onInk = false,
}: {
  index?: string
  children: ReactNode
  onInk?: boolean
}) {
  return (
    <p
      // GrowthLab's small label: plain case, medium weight, a step under body size.
      className={`font-ui text-sm font-semibold ${
        onInk ? 'text-brand-bright' : 'text-brand-strong'
      }`}
    >
      {index && <span className="opacity-60">{index} / </span>}
      {children}
    </p>
  )
}

/**
 * The GrowthLab section heading: a large title on the left and one short
 * line, smaller and muted, set against the right edge. Stacks on a phone.
 */
export function SplitHead({
  title,
  lead,
  onInk = false,
  h1 = false,
  className = '',
}: {
  title: ReactNode
  lead?: ReactNode
  onInk?: boolean
  h1?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12 ${className}`}>
      <SplitHeading
        as={h1 ? 'h1' : 'h2'}
        className={`max-w-2xl font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px] ${
          onInk ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </SplitHeading>
      {lead && (
        <BlurIn delay={0.1}>
          <p
            className={`max-w-sm text-base leading-[1.4] sm:text-lg md:pb-2 md:text-right ${
              onInk ? 'text-ink-muted' : 'text-muted-foreground'
            }`}
          >
            {lead}
          </p>
        </BlurIn>
      )}
    </div>
  )
}

/**
 * A heading centred over its section, GrowthLab's "Work That Delivers
 * Results" form: big title, one muted line under it.
 */
export function CenterHead({ title, lead }: { title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <SplitHeading className="font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px]">
        {title}
      </SplitHeading>
      {lead && (
        <BlurIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-[1.4] text-muted-foreground sm:text-lg">{lead}</p>
        </BlurIn>
      )}
    </div>
  )
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lead,
  align = 'left',
  onInk = false,
  h1 = false,
}: {
  index?: string
  /** The one page heading: render as h1 instead of h2. */
  h1?: boolean
  eyebrow: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  onInk?: boolean
}) {
  const centred = align === 'center'
  return (
    <div className={centred ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <BlurIn y={12}>
        <Eyebrow index={index} onInk={onInk}>
          {eyebrow}
        </Eyebrow>
      </BlurIn>

      <SplitHeading
        as={h1 ? 'h1' : 'h2'}
        className={`mt-4 font-ui text-4xl font-bold leading-[1.1] text-balance sm:text-5xl md:text-[64px] ${
          onInk ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </SplitHeading>

      {lead && (
        <BlurIn delay={0.12}>
          <p
            className={`mt-5 text-base leading-[1.4] sm:text-lg ${centred ? '' : 'max-w-2xl'} ${
              onInk ? 'text-ink-muted' : 'text-muted-foreground'
            }`}
          >
            {lead}
          </p>
        </BlurIn>
      )}
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'onInk'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  external?: boolean
}

const VARIANTS: Record<string, string> = {
  // Matte black with white text (18.9:1) is the main button. On a black band
  // it would vanish, so there the white `accent` button takes over.
  primary:
    'bg-ink text-white hover:bg-[#2b2b2b] shadow-sm hover:shadow-md',
  accent:
    'bg-white text-ink hover:bg-[#ebebeb] shadow-sm hover:shadow-md',
  outline:
    'border border-border bg-card text-foreground hover:border-foreground',
  ghost: 'text-foreground hover:bg-[#f2f2f2]',
  onInk: 'border border-white/25 text-white hover:bg-card hover:text-ink',
}

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  onClick,
  external,
}: ButtonProps) {
  const cls = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 py-3.5 font-ui text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`

  // Paths inside the site go through the router; anything else is a plain anchor.
  if (href?.startsWith('/')) {
    return (
      <Link to={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

/**
 * Infinite marquee. The children are rendered twice and the track translates
 * exactly -50%, so the seam is invisible and nothing runs per frame in JS.
 * Pauses on hover so a reader can actually stop and look at a label.
 */
export function Marquee({
  children,
  reverse = false,
  speed = '42s',
}: {
  children: ReactNode
  reverse?: boolean
  speed?: string
}) {
  const track = `animate-marquee flex min-w-full shrink-0 items-center group-hover:[animation-play-state:paused]`
  const style = {
    animationDuration: speed,
    animationDirection: reverse ? ('reverse' as const) : ('normal' as const),
  }
  return (
    <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={track} style={style}>
        {children}
      </div>
      <div className={track} style={style} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}
