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
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
  )
}

/** `01 / What I do`. The numbered micro-label StemLink puts above every section. */
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
      // font-ui, not font-display: Orbitron draws a slashed zero, so "01 / "
      // rendered as a slashed zero. StemLink sets its eyebrows in the UI face too and
      // keeps its techy display font for branding only.
      className={`font-ui text-[11px] font-semibold uppercase tracking-[0.22em] ${
        onInk ? 'text-brand-bright' : 'text-brand-strong'
      }`}
    >
      {index && <span className="opacity-60">{index} / </span>}
      {children}
    </p>
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
        className={`mt-4 font-ui text-3xl font-semibold leading-[1.12] tracking-tight text-balance sm:text-4xl md:text-5xl ${
          onInk ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </SplitHeading>

      {lead && (
        <BlurIn delay={0.12}>
          <p
            className={`mt-5 text-base leading-relaxed ${centred ? '' : 'max-w-2xl'} ${
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
  variant?: 'primary' | 'outline' | 'ghost' | 'onInk'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  external?: boolean
}

const VARIANTS: Record<string, string> = {
  // brand-strong, not brand: white on #008B48 is 4.39:1, which fails AA for
  // button text. #00753E carries the same green at 5.81:1.
  primary:
    'bg-brand-strong text-white hover:bg-brand shadow-sm hover:shadow-md',
  outline:
    'border border-border bg-white text-foreground hover:border-brand hover:text-brand-strong',
  ghost: 'text-foreground hover:bg-muted',
  onInk: 'border border-white/25 text-white hover:bg-white hover:text-ink',
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
  const cls = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 font-ui text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`

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

/** Small rounded label. */
export function Badge({
  children,
  onInk = false,
}: {
  children: ReactNode
  onInk?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-ui text-xs font-medium ${
        onInk
          ? 'border border-white/20 text-white/80'
          : 'border border-border bg-white text-muted-foreground'
      }`}
    >
      {children}
    </span>
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
