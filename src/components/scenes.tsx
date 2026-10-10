import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

import { MOTION_OK } from './motion'

/*
  Scenes: the animated figures that stand in for photography.

  Every one of these depicts the thing it sits next to: the invoice project
  stamps an invoice PAID, the POS project rings up a sale, the website project
  assembles a landing page, and each process step has its own glyph. Nothing
  here is motion for its own sake. The services section no longer uses scenes:
  it is the scroll timeline in ServiceTimeline.tsx.

  Each scene is one GSAP timeline, looping, and paused while off screen.
  Running them all at once for content nobody is looking at is wasteful.

  They still have to survive a mid range phone, so the budget is strict:

    1. transform and opacity carry the motion. No filter, no box-shadow, no
       large blur: those force a fresh rasterisation every frame, which is
       exactly the cost a coarse pointer device cannot absorb fifteen times
       over. The only paint tween left is three 6px dots changing fill.
    2. roughly a dozen tweened targets per timeline at most. Where a figure
       wants more (the booking calendar is 28 cells) the cells travel as four
       row groups and only the meaningful ones animate individually.
    3. strokes that should read as drawn are drawn, via DrawSVGPlugin, rather
       than faked with scaleX. A scaled rectangle grows like a bar; a tick has
       to travel along itself or it does not look like a tick.
    4. useScene() narrows the on screen window on coarse pointers, so fewer
       figures are ticking at the same moment.
*/

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

const LINE = '#dfe9e3'
const MUTED = '#c3d2ca'
const WASH = '#f1f5f3'
const BRAND = 'var(--color-brand)'
const STRONG = 'var(--color-brand-strong)'
const TINT = '#eef7f2'

const q = (el: SVGSVGElement, sel: string) => Array.from(el.querySelectorAll<SVGElement>(sel))

/**
 * Builds a looping timeline for an SVG figure and runs it only while the
 * figure is on screen.
 *
 * The ScrollTrigger carries no animation of its own, it only toggles, so a
 * ScrollTrigger.refresh() has nothing to revert. (Attaching the timeline here
 * is what left the services grid painted at progress 0 earlier.)
 *
 * Coarse pointers keep every figure, because the figures are the content and
 * not decoration. What they give up instead is overlap: a tighter start and
 * end means a scene begins later and stops earlier, so fewer loops tick at
 * once, and a longer beat between repeats leaves more frames with nothing to
 * write at all.
 */
function useScene(build: (el: SVGSVGElement) => gsap.core.Timeline) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(
        { motion: MOTION_OK, coarse: '(pointer: coarse)' },
        (self) => {
          const cond = (self.conditions ?? {}) as { motion?: boolean; coarse?: boolean }
          if (!cond.motion) return

          const tl = build(el)
          tl.pause()
          if (cond.coarse) tl.repeatDelay(tl.repeatDelay() + 0.45)

          const st = ScrollTrigger.create({
            trigger: el,
            start: cond.coarse ? 'top 90%' : 'top 96%',
            end: cond.coarse ? 'bottom 10%' : 'bottom 4%',
            onToggle: (trigger) => (trigger.isActive ? tl.play() : tl.pause()),
          })
          return () => {
            st.kill()
            tl.kill()
          }
        },
      )
    }, ref)

    return () => ctx.revert()
  }, [build])

  return ref
}

const loop = (repeatDelay = 0.9) =>
  gsap.timeline({ repeat: -1, repeatDelay, defaults: { ease: 'power2.out' } })


// ===========================================================================
// Project scenes: 400 x 250, one per project, matching what it is
// ===========================================================================
const PRJ_VB = '0 0 400 250'

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#f8fbf9,#eef7f2)]">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right,#e3ede7 1px,transparent 1px),linear-gradient(to bottom,#e3ede7 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      {children}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.7),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
        aria-hidden="true"
      />
    </div>
  )
}

/* --- The invoice suite: an invoice drawing itself, then stamped PAID ------ */
const IV_ROWS = [110, 132, 154]

function buildInvoice(el: SVGSVGElement) {
  const tl = loop(1)
  tl.from(q(el, '.iv-head'), { scaleX: 0, transformOrigin: 'left center', duration: 0.45 })
    .from(q(el, '.iv-row'), { opacity: 0, x: -14, duration: 0.4, stagger: 0.16 }, '-=0.1')
    .from(q(el, '.iv-total'), { opacity: 0, scaleX: 0, transformOrigin: 'right center', duration: 0.45 })
    .fromTo(
      q(el, '.iv-stamp-line'),
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 0.55, ease: 'power2.inOut' },
      '+=0.15',
    )
    .from(
      q(el, '.iv-stamp-text'),
      { scale: 1.8, opacity: 0, transformOrigin: 'center', duration: 0.45, ease: 'back.out(1.8)' },
      '-=0.12',
    )
    .to({}, { duration: 1.4 })
  return tl
}

function InvoiceScene() {
  const ref = useScene(buildInvoice)
  return (
    <svg ref={ref} viewBox={PRJ_VB} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="98" y="18" width="204" height="214" rx="10" fill="#fff" stroke={LINE} />
      <rect className="iv-head" x="118" y="40" width="76" height="11" rx="3" fill={BRAND} opacity="0.3" />
      <rect x="118" y="58" width="50" height="6" rx="3" fill={MUTED} />
      <rect x="254" y="38" width="30" height="30" rx="7" fill={TINT} stroke={BRAND} strokeOpacity="0.25" />
      <path d="M118 86 H282" stroke={LINE} />

      {IV_ROWS.map((y, i) => (
        <g className="iv-row" key={y}>
          <rect x="118" y={y} width={[112, 96, 104][i]} height="7" rx="3.5" fill={MUTED} />
          <rect x="248" y={y} width="34" height="7" rx="3.5" fill={MUTED} opacity="0.8" />
        </g>
      ))}

      <path d="M118 178 H282" stroke={LINE} />
      <g className="iv-total">
        <rect x="196" y="188" width="86" height="16" rx="5" fill={STRONG} opacity="0.16" />
        <rect x="206" y="193" width="40" height="6" rx="3" fill={STRONG} opacity="0.55" />
      </g>

      <g className="iv-stamp" transform="rotate(-13 168 200)">
        <path
          className="iv-stamp-line"
          d="M125 182 H203 A7 7 0 0 1 210 189 V209 A7 7 0 0 1 203 216 H125 A7 7 0 0 1 118 209 V189 A7 7 0 0 1 125 182 Z"
          fill="none"
          stroke={BRAND}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
        <text
          className="iv-stamp-text font-ui"
          x="164"
          y="205"
          textAnchor="middle"
          fontSize="19"
          fontWeight="700"
          fill={BRAND}
          opacity="0.75"
        >
          PAID
        </text>
      </g>
    </svg>
  )
}

/* --- SJD POS: a till ringing up a sale, then taking payment --------------- */
const POS_TAPS = [0, 3, 4]
const POS_LINES = [86, 102, 118]

function buildPos(el: SVGSVGElement) {
  const tiles = q(el, '.pos-tile')
  const tl = loop(1)
  tl.from(tiles, { opacity: 0, scale: 0.86, transformOrigin: 'center', duration: 0.4, stagger: 0.07 })
    .from(q(el, '.pos-panel'), { opacity: 0, x: 18, duration: 0.4 }, '-=0.3')
  POS_TAPS.forEach((t, i) => {
    tl.to(tiles[t], { scale: 0.9, transformOrigin: 'center', duration: 0.13, yoyo: true, repeat: 1 }, i === 0 ? '+=0.25' : '+=0.12')
      .from(q(el, '.pos-line')[i], { opacity: 0, x: 14, duration: 0.3 }, '<0.08')
  })
  tl.from(q(el, '.pos-total'), { scaleX: 0, transformOrigin: 'left center', duration: 0.4 })
    .from(q(el, '.pos-pay'), { scale: 0.82, opacity: 0, transformOrigin: 'center', duration: 0.35, ease: 'back.out(2.4)' })
    .fromTo(q(el, '.pos-check'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' })
    .to(q(el, '.pos-pay'), { scale: 1.06, transformOrigin: 'center', duration: 0.3, yoyo: true, repeat: 1 })
    .to({}, { duration: 1.1 })
  return tl
}

function PosScene() {
  const ref = useScene(buildPos)
  return (
    <svg ref={ref} viewBox={PRJ_VB} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="40" y="22" width="320" height="206" rx="10" fill="#fff" stroke={LINE} />
      <path d="M40 54 H360" stroke={LINE} />
      <rect x="56" y="34" width="54" height="10" rx="5" fill={BRAND} opacity="0.3" />
      <rect x="236" y="33" width="104" height="12" rx="6" fill={WASH} />

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 56 + (i % 3) * 58
        const y = 68 + Math.floor(i / 3) * 62
        return (
          <g className="pos-tile" key={i}>
            <rect x={x} y={y} width="50" height="38" rx="6" fill={POS_TAPS.includes(i) ? TINT : WASH} stroke={POS_TAPS.includes(i) ? BRAND : 'none'} strokeOpacity="0.3" />
            <rect x={x} y={y + 44} width="34" height="5" rx="2.5" fill={MUTED} />
          </g>
        )
      })}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={56 + i * 58} y="196" width="50" height="10" rx="5" fill={i === 0 ? BRAND : WASH} opacity={i === 0 ? 0.28 : 1} />
      ))}

      <g className="pos-panel">
        <rect x="244" y="66" width="100" height="146" rx="8" fill={WASH} stroke={LINE} />
        {POS_LINES.map((y) => (
          <g className="pos-line" key={y}>
            <rect x="254" y={y} width="44" height="6" rx="3" fill={MUTED} />
            <rect x="308" y={y} width="26" height="6" rx="3" fill={MUTED} opacity="0.8" />
          </g>
        ))}
        <path d="M254 136 H334" stroke={LINE} />
        <g className="pos-total">
          <rect x="254" y="144" width="80" height="9" rx="4.5" fill={STRONG} opacity="0.22" />
        </g>
        <g className="pos-pay">
          <rect x="254" y="170" width="80" height="30" rx="15" fill={STRONG} />
          <rect x="264" y="182" width="32" height="6" rx="3" fill="#fff" opacity="0.85" />
          <path
            className="pos-check"
            d="M308 185 l4 4 l9 -9"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  )
}

/* --- mradventure.lk: a landing page assembling itself -------------------- */
function buildSite(el: SVGSVGElement) {
  const tl = loop(1)
  tl.from(q(el, '.sw-nav'), { opacity: 0, y: -8, duration: 0.35, stagger: 0.06 })
    .from(q(el, '.sw-hero'), { opacity: 0, scale: 0.97, transformOrigin: 'center', duration: 0.5 }, '-=0.2')
    .fromTo(q(el, '.sw-peak'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut', stagger: 0.15 }, '-=0.2')
    .from(q(el, '.sw-sun'), { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.7')
    .from(q(el, '.sw-title'), { scaleX: 0, transformOrigin: 'left center', duration: 0.45, stagger: 0.12 }, '-=0.3')
    .from(q(el, '.sw-cta'), { scale: 0.8, opacity: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(2.6)' })
    .from(q(el, '.sw-card'), { opacity: 0, y: 16, duration: 0.4, stagger: 0.1 }, '-=0.1')
    .to(q(el, '.sw-cta'), { scale: 1.08, transformOrigin: 'center', duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' })
    .to({}, { duration: 0.7 })
  return tl
}

function SiteScene() {
  const ref = useScene(buildSite)
  return (
    <svg ref={ref} viewBox={PRJ_VB} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x="40" y="18" width="320" height="214" rx="10" fill="#fff" stroke={LINE} />
      <circle cx="56" cy="32" r="3.2" fill="#f2b3ad" />
      <circle cx="67" cy="32" r="3.2" fill="#f0d79c" />
      <circle cx="78" cy="32" r="3.2" fill="#b7dcc6" />
      <rect x="140" y="26" width="120" height="12" rx="6" fill={WASH} />
      <path d="M40 46 H360" stroke={LINE} />

      <rect className="sw-nav" x="56" y="55" width="30" height="8" rx="4" fill={BRAND} opacity="0.35" />
      {[0, 1, 2].map((i) => (
        <rect className="sw-nav" key={i} x={236 + i * 36} y="56" width="26" height="6" rx="3" fill={MUTED} />
      ))}

      <g className="sw-hero">
        <rect x="56" y="74" width="288" height="86" rx="8" fill={TINT} stroke={LINE} />
      </g>
      <circle className="sw-sun" cx="300" cy="100" r="12" fill={BRAND} opacity="0.35" />
      <path className="sw-peak" d="M176 160 L224 108 L254 140 L274 120 L328 160" fill="none" stroke={BRAND} strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="sw-peak" d="M104 160 L142 126 L170 160" fill="none" stroke={STRONG} strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      <rect className="sw-title" x="72" y="88" width="84" height="9" rx="4.5" fill={STRONG} opacity="0.55" />
      <rect className="sw-title" x="72" y="104" width="62" height="9" rx="4.5" fill={STRONG} opacity="0.3" />
      <g className="sw-cta">
        <rect x="72" y="124" width="56" height="16" rx="8" fill={STRONG} />
        <rect x="82" y="130" width="28" height="4" rx="2" fill="#fff" opacity="0.85" />
      </g>

      {[0, 1, 2].map((i) => (
        <g className="sw-card" key={i}>
          <rect x={56 + i * 98} y="172" width="92" height="46" rx="6" fill="#fff" stroke={LINE} />
          <rect x={64 + i * 98} y="180" width="76" height="20" rx="4" fill={i === 1 ? TINT : WASH} />
          <rect x={64 + i * 98} y="206" width="44" height="5" rx="2.5" fill={MUTED} />
        </g>
      ))}
    </svg>
  )
}

const PROJECT_SCENE = [InvoiceScene, PosScene, SiteScene]

export function ProjectScene({ index }: { index: number }) {
  const Scene = PROJECT_SCENE[index] ?? InvoiceScene
  return (
    <Frame>
      <Scene />
    </Frame>
  )
}

// ===========================================================================
// Process glyphs: 64 x 48, one per step
// ===========================================================================
const STEP_VB = '0 0 64 48'

function buildStep(el: SVGSVGElement) {
  const tl = loop(1.1)
  tl.from(q(el, '.g-a'), { opacity: 0, y: 8, duration: 0.4 })
    .from(q(el, '.g-b'), { opacity: 0, y: 8, duration: 0.4 }, '-=0.2')
    .from(q(el, '.g-c'), { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(2.4)' }, '-=0.15')
    .to({}, { duration: 1.1 })
  return tl
}

/** Hand over runs the same beats, then genuinely draws its tick. */
function buildHandover(el: SVGSVGElement) {
  const tl = loop(1.1)
  tl.from(q(el, '.g-a'), { opacity: 0, y: 8, duration: 0.4 })
    .from(q(el, '.g-b'), { opacity: 0, y: 8, duration: 0.4 }, '-=0.2')
    .from(q(el, '.g-c'), { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(2.4)' }, '-=0.15')
    .fromTo(q(el, '.g-tick'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, '-=0.06')
    .to({}, { duration: 1.1 })
  return tl
}

/** 01 Understand: a conversation, then a written scope. */
function StepUnderstand() {
  const ref = useScene(buildStep)
  return (
    <svg ref={ref} viewBox={STEP_VB} className="h-12 w-16" aria-hidden="true">
      <g className="g-a">
        <rect x="2" y="6" width="34" height="17" rx="7" fill={WASH} />
        <rect x="9" y="13" width="18" height="3.5" rx="1.75" fill={MUTED} />
      </g>
      <g className="g-b">
        <rect x="26" y="27" width="34" height="17" rx="7" fill={STRONG} />
        <rect x="33" y="34" width="18" height="3.5" rx="1.75" fill="#fff" opacity="0.85" />
      </g>
      <circle className="g-c" cx="52" cy="12" r="7" fill={TINT} stroke={BRAND} strokeOpacity="0.35" />
    </svg>
  )
}

/** 02 Design: blocks resolving into a layout. */
function StepDesign() {
  const ref = useScene(buildStep)
  return (
    <svg ref={ref} viewBox={STEP_VB} className="h-12 w-16" aria-hidden="true">
      <rect x="2" y="4" width="60" height="40" rx="6" fill="#fff" stroke={LINE} />
      <rect className="g-a" x="8" y="10" width="24" height="14" rx="3" fill={BRAND} opacity="0.3" />
      <rect className="g-b" x="36" y="10" width="20" height="14" rx="3" fill={WASH} />
      <rect className="g-c" x="8" y="29" width="48" height="9" rx="3" fill={WASH} />
    </svg>
  )
}

/** 03 Build: code accumulating. */
function StepBuild() {
  const ref = useScene(buildStep)
  return (
    <svg ref={ref} viewBox={STEP_VB} className="h-12 w-16" aria-hidden="true">
      <rect x="2" y="4" width="60" height="40" rx="6" fill="#fff" stroke={LINE} />
      <rect className="g-a" x="9" y="13" width="30" height="4" rx="2" fill={MUTED} />
      <rect className="g-b" x="9" y="22" width="42" height="4" rx="2" fill={BRAND} opacity="0.45" />
      <rect className="g-c" x="9" y="31" width="22" height="4" rx="2" fill={STRONG} />
    </svg>
  )
}

/** 04 Hand over: the keys, transferred. */
function StepHandover() {
  const ref = useScene(buildHandover)
  return (
    <svg ref={ref} viewBox={STEP_VB} className="h-12 w-16" aria-hidden="true">
      <rect className="g-a" x="2" y="12" width="30" height="24" rx="5" fill={WASH} />
      <path className="g-b" d="M34 24 H56" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
      <g className="g-c">
        <circle cx="52" cy="24" r="9" fill={STRONG} />
        <path
          className="g-tick"
          d="M48 24 l3 3 l6 -6.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

const STEP_GLYPH = [StepUnderstand, StepDesign, StepBuild, StepHandover]

export function StepGlyph({ index }: { index: number }) {
  const Glyph = STEP_GLYPH[index] ?? StepUnderstand
  return <Glyph />
}
