import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

import { MOTION_OK } from './motion'

/*
  Scenes: the animated figures that stand in for photography.

  Every one of these depicts the thing it sits next to. The web card builds a
  page, the software card runs tasks down a pipeline, the AI card answers a
  message, the video card renders a cut and plays it back, the social card
  works a queue while replies come in, the invoice project stamps an invoice
  PAID. Nothing here is motion for its own sake. If a figure could be swapped
  between two cards without anyone noticing, it would not belong.

  Each scene is one GSAP timeline, looping, and paused while off screen: seven
  service cards plus four projects plus four steps is fifteen timelines, and
  running them all at once for content nobody is looking at is wasteful.

  Fifteen loops have to survive a mid range phone, so the budget is strict:

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
const BRIGHT = 'var(--color-brand-bright)'
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
// Service scenes: 280 x 104
//
// These are drawn as product interfaces rather than diagrams: window chrome and
// a tab strip, an admin table with columns and a status pill, a phone with a
// status bar and a tab bar, a node graph with real ports and curved wires, an
// editing timeline with a ruler and stacked tracks, a charting panel, a
// scheduling composer. Density is the point. A figure reads as software because
// of the furniture around the content, not because of the content.
//
// The canvas grew from 260x88 to fit that detail, and the card band in App.tsx
// grew with it. At the old size the labels would have been texture rather than
// an interface.
// ===========================================================================
const SVC_VB = '0 0 280 104'
const svgCls = 'h-full w-full'

/* --- Website Building: a site loading, assembling, then auditing at 100 --- */
const WB_CARDS = [16, 101, 186]

function buildWeb(el: SVGSVGElement) {
  const load = q(el, '.wb-load')
  const ring = q(el, '.wb-ring')

  const tl = loop(0.6)
  tl.set(load, { scaleX: 0, opacity: 1, transformOrigin: 'left center' })
    .set(ring, { drawSVG: '0%' })
    // the page loads
    .to(load, { scaleX: 1, duration: 0.62, ease: 'power1.inOut' })
    // then it comes in section by section, the way a build does
    .from(q(el, '.wb-nav'), { opacity: 0, y: -7, duration: 0.32 }, '-=0.26')
    .to(load, { opacity: 0, duration: 0.22 }, '-=0.06')
    .from(q(el, '.wb-h1'), { opacity: 0, y: 8, duration: 0.34 }, '-=0.14')
    .from(q(el, '.wb-htxt'), { opacity: 0, y: 6, duration: 0.28, stagger: 0.08 }, '-=0.18')
    .from(q(el, '.wb-tile'), { opacity: 0, scale: 0.93, transformOrigin: 'center', duration: 0.4 }, '-=0.34')
    .from(q(el, '.wb-card'), { opacity: 0, y: 9, duration: 0.32, stagger: 0.09 }, '-=0.16')
    .from(q(el, '.wb-foot'), { opacity: 0, duration: 0.3 }, '-=0.08')
    // shipped: the audit lands and the ring is drawn, not grown
    .from(q(el, '.wb-score'), { scale: 0, transformOrigin: 'center', duration: 0.42, ease: 'back.out(2.2)' }, '+=0.12')
    .to(ring, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, '-=0.16')
    .from(q(el, '.wb-num'), { opacity: 0, scale: 0.55, transformOrigin: 'center', duration: 0.3, ease: 'back.out(2.4)' }, '-=0.2')
    .to({}, { duration: 0.8 })
  return tl
}

function WebScene() {
  const ref = useScene(buildWeb)
  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <clipPath id="zy-wb-clip">
          <rect x="6" y="2" width="268" height="100" rx="9" />
        </clipPath>
      </defs>

      <rect x="6" y="2" width="268" height="100" rx="9" fill="#fff" stroke={LINE} />

      <g clipPath="url(#zy-wb-clip)">
        {/* window chrome: tab strip */}
        <rect x="6" y="2" width="268" height="18" fill={WASH} />
        <circle cx="18" cy="11" r="2.6" fill="#ff5f57" />
        <circle cx="26" cy="11" r="2.6" fill="#febc2e" />
        <circle cx="34" cy="11" r="2.6" fill="#28c840" />

        <path d="M46 20 V11 A5 5 0 0 1 51 6 H122 A5 5 0 0 1 127 11 V20 Z" fill="#fff" />
        <rect x="55" y="9.5" width="7" height="7" rx="2" fill={BRAND} />
        <text x="66" y="15.6" fontSize="7" fill={MUTED} className="font-ui">
          index.html
        </text>

        <rect x="136" y="9.5" width="7" height="7" rx="2" fill={LINE} />
        <rect x="147" y="11" width="30" height="4" rx="2" fill={LINE} />
        <rect x="190" y="9.5" width="7" height="7" rx="2" fill={LINE} />
        <rect x="201" y="11" width="26" height="4" rx="2" fill={LINE} />
        <path d="M246 11 H254 M250 7 V15" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M6 20 H274" stroke={LINE} />

        {/* window chrome: toolbar */}
        <path
          d="M18.5 24.5 L15.5 27.5 L18.5 30.5"
          fill="none"
          stroke={MUTED}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.5 24.5 L29.5 27.5 L26.5 30.5"
          fill="none"
          stroke={MUTED}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <circle
          cx="42"
          cy="27.5"
          r="3.8"
          fill="none"
          stroke={MUTED}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="18 6"
        />
        <path d="M41.6 22.4 L43.9 23.7 L41.6 25 Z" fill={MUTED} />

        <rect x="56" y="22.5" width="176" height="10" rx="5" fill={WASH} />
        <path
          d="M63.2 26.6 V25.2 A1.3 1.3 0 0 1 65.8 25.2 V26.6"
          fill="none"
          stroke={MUTED}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <rect x="62" y="26.4" width="5.2" height="4.2" rx="1.1" fill={MUTED} />
        <rect x="73" y="25.9" width="62" height="3.4" rx="1.7" fill={MUTED} opacity="0.7" />
        <circle cx="244" cy="27.5" r="4.6" fill={WASH} />
        <circle cx="258" cy="23.9" r="1.1" fill={MUTED} />
        <circle cx="258" cy="27.5" r="1.1" fill={MUTED} />
        <circle cx="258" cy="31.1" r="1.1" fill={MUTED} />

        <path d="M6 35 H274" stroke={LINE} />
        <rect className="wb-load" x="6" y="34" width="268" height="1.4" fill={BRAND} />

        {/* the page: nav */}
        <g className="wb-nav">
          <rect x="16" y="37.5" width="9" height="9" rx="2.5" fill={STRONG} />
          <rect x="29" y="40" width="24" height="4" rx="2" fill={MUTED} />
          <rect x="146" y="40.3" width="17" height="3.4" rx="1.7" fill={MUTED} />
          <rect x="169" y="40.3" width="22" height="3.4" rx="1.7" fill={MUTED} />
          <rect x="197" y="40.3" width="15" height="3.4" rx="1.7" fill={MUTED} />
          <rect x="222" y="37" width="42" height="10" rx="5" fill={TINT} stroke={BRAND} strokeOpacity="0.35" />
          <rect x="231" y="40.3" width="24" height="3.4" rx="1.7" fill={BRAND} opacity="0.55" />
          <path d="M6 50 H274" stroke={LINE} />
        </g>

        {/* the page: hero */}
        <rect className="wb-h1" x="16" y="54" width="98" height="9" rx="2.5" fill={BRAND} opacity="0.28" />
        <rect className="wb-htxt" x="16" y="67" width="88" height="4" rx="2" fill={MUTED} />
        <rect className="wb-htxt" x="16" y="73.5" width="60" height="4" rx="2" fill={MUTED} opacity="0.7" />
        <g className="wb-tile">
          <rect x="150" y="54" width="114" height="18" rx="5" fill={TINT} stroke={BRAND} strokeOpacity="0.25" />
          <circle cx="160" cy="59.5" r="2.6" fill={BRAND} opacity="0.35" />
          <path d="M156 72 L167 61 L174 67.5 L180 63 L192 72 Z" fill={BRAND} opacity="0.2" />
        </g>

        {/* the page: card row */}
        {WB_CARDS.map((x) => (
          <g className="wb-card" key={x}>
            <rect x={x} y="79" width="78" height="15" rx="4" fill="#fff" stroke={LINE} />
            <rect x={x + 6} y="82" width="9" height="9" rx="2" fill={TINT} />
            <rect x={x + 20} y="83" width="40" height="3.6" rx="1.8" fill={MUTED} />
            <rect x={x + 20} y="89.4" width="26" height="3" rx="1.5" fill={MUTED} opacity="0.6" />
            <path
              d={`M${x + 64} 84.6 l2.6 2.2 l-2.6 2.2`}
              fill="none"
              stroke={BRAND}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </g>
        ))}

        {/* the page: footer */}
        <g className="wb-foot">
          <path d="M16 97 H264" stroke={LINE} />
          <rect x="16" y="98.6" width="30" height="2.6" rx="1.3" fill={MUTED} opacity="0.6" />
          <rect x="206" y="98.6" width="22" height="2.6" rx="1.3" fill={MUTED} opacity="0.6" />
          <rect x="234" y="98.6" width="30" height="2.6" rx="1.3" fill={MUTED} opacity="0.6" />
        </g>

        <rect x="270" y="54" width="2.6" height="26" rx="1.3" fill={LINE} />

        {/* the audit, landing on the shipped page */}
        <g className="wb-score">
          <circle cx="246" cy="85" r="12" fill="#fff" stroke={LINE} />
          <circle cx="246" cy="85" r="8.6" fill="none" stroke={WASH} strokeWidth="2.6" />
          <circle
            className="wb-ring"
            cx="246"
            cy="85"
            r="8.6"
            fill="none"
            stroke={STRONG}
            strokeWidth="2.6"
            strokeLinecap="round"
            transform="rotate(-90 246 85)"
          />
          <text
            className="wb-num font-ui"
            x="246"
            y="88"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={STRONG}
          >
            100
          </text>
        </g>
      </g>
    </svg>
  )
}

/* --- Software Application Development: a record marked paid in an admin tool --- */
function buildSoftware(el: SVGSVGElement) {
  const cursor = q(el, '.sw-cursor')

  const tl = loop(0.9)
  // the table fills, the pointer arrives at a status cell, that record is marked paid
  tl.from(q(el, '.sw-row'), { opacity: 0, x: -10, duration: 0.32, stagger: 0.08 })
    .from(q(el, '.sw-sel'), { opacity: 0, duration: 0.24 }, '-=0.08')
    .from(cursor, { x: 30, y: 24, opacity: 0, duration: 0.52, ease: 'power2.inOut' }, '<')
    .add('click')
    .to(cursor, { scale: 0.82, transformOrigin: 'left top', duration: 0.11, yoyo: true, repeat: 1 }, 'click')
    .fromTo(
      q(el, '.sw-ring'),
      { scale: 0.35, opacity: 0.9, transformOrigin: 'center' },
      { scale: 1.5, opacity: 0, duration: 0.52, ease: 'power2.out', immediateRender: false },
      'click',
    )
    .to(q(el, '.sw-pend'), { opacity: 0, scale: 0.7, transformOrigin: 'center', duration: 0.22 }, 'click+=0.1')
    .from(
      q(el, '.sw-paid'),
      { scale: 0, transformOrigin: 'center', duration: 0.42, ease: 'back.out(2.3)' },
      'click+=0.16',
    )
    // the tick travels along itself; a scaled shape would only pop
    .fromTo(
      q(el, '.sw-tick'),
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 0.3, ease: 'power2.out' },
      'click+=0.44',
    )
    .to(cursor, { x: 22, y: 20, opacity: 0, duration: 0.5, ease: 'power2.in' }, 'click+=0.85')
    .to({}, { duration: 0.4 })
  return tl
}

function SoftwareScene() {
  const ref = useScene(buildSoftware)

  // tops of the five record rows (each 10 high), which of them already read as
  // paid, and the one the pointer marks
  const rows = [47, 57, 67, 77, 87]
  const settled = [0, 4]
  const mark = 2
  // name / reference / amount bar widths, so no two records look alike
  const cells: Array<[number, number, number]> = [
    [36, 24, 22],
    [28, 20, 18],
    [34, 26, 24],
    [30, 22, 20],
    [26, 24, 16],
  ]
  const nav = [24, 20, 26, 18, 22]

  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      {/* the app window: fill first, border last, so the chrome fills can carry
          the rounded corners without eating the stroke */}
      <rect x="8" y="5" width="264" height="94" rx="8" fill="#fff" />

      {/* title bar */}
      <path d="M8 17 V13 A8 8 0 0 1 16 5 H264 A8 8 0 0 1 272 13 V17 Z" fill={WASH} />
      <circle cx="17" cy="11" r="2.2" fill="#ff5f57" />
      <circle cx="24.5" cy="11" r="2.2" fill="#febc2e" />
      <circle cx="32" cy="11" r="2.2" fill="#28c840" />
      <rect x="112" y="7" width="56" height="8" rx="4" fill="#fff" stroke={LINE} />

      {/* sidebar */}
      <path d="M8 17 H64 V99 H16 A8 8 0 0 1 8 91 Z" fill={WASH} />
      <rect x="15" y="23" width="11" height="11" rx="3.2" fill={STRONG} />
      <rect x="18" y="26.4" width="5" height="1.8" rx="0.9" fill="#fff" opacity="0.9" />
      <rect x="18" y="29.6" width="3.2" height="1.8" rx="0.9" fill="#fff" opacity="0.6" />
      <rect x="30" y="25" width="22" height="3.6" rx="1.8" fill={MUTED} />
      <rect x="30" y="31" width="14" height="3" rx="1.5" fill={MUTED} opacity="0.55" />
      <path d="M14 38.5 H58" stroke={LINE} />

      <rect x="12" y="52" width="46" height="11" rx="4" fill={TINT} />
      <rect x="9" y="55" width="2.4" height="5" rx="1.2" fill={STRONG} />
      {nav.map((w, i) => {
        const y = 42 + i * 11
        const on = i === 1
        return (
          <g key={y}>
            <rect
              x="16"
              y={y + 1.2}
              width="6.6"
              height="6.6"
              rx="2"
              fill={on ? BRAND : MUTED}
              opacity={on ? 0.9 : 0.75}
            />
            <rect x="27" y={y + 3} width={w} height="3.6" rx="1.8" fill={on ? BRAND : MUTED} opacity={on ? 0.7 : 0.85} />
          </g>
        )
      })}

      {/* toolbar: search, a filter chip, the primary action */}
      <rect x="72" y="21" width="104" height="11" rx="5.5" fill="#fff" stroke={LINE} />
      <circle cx="80.5" cy="26.5" r="2.7" fill="none" stroke={MUTED} strokeWidth="1.2" />
      <path d="M82.5 28.5 l2.2 2.2" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="90" y="24.5" width="40" height="4" rx="2" fill={MUTED} opacity="0.55" />

      <rect x="182" y="21" width="30" height="11" rx="4" fill="#fff" stroke={LINE} />
      <path
        d="M186 24.6 H194 M187.6 26.6 H192.4 M189 28.6 H191"
        stroke={MUTED}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect x="197" y="24.5" width="10" height="4" rx="2" fill={MUTED} opacity="0.55" />

      <rect x="222" y="20.5" width="42" height="12" rx="4" fill={STRONG} />
      <path d="M229 26.5 H235 M232 23.5 V29.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="239" y="24.5" width="18" height="4" rx="2" fill="#fff" opacity="0.9" />

      {/* table header */}
      <rect x="64" y="36" width="208" height="11" fill={WASH} />
      <rect x="73" y="40" width="26" height="3" rx="1.5" fill={MUTED} opacity="0.75" />
      <rect x="134" y="40" width="18" height="3" rx="1.5" fill={MUTED} opacity="0.75" />
      <rect x="178" y="40" width="16" height="3" rx="1.5" fill={MUTED} opacity="0.75" />
      <path
        d="M196 40.3 l2.4 2.2 l2.4 -2.2"
        fill="none"
        stroke={MUTED}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="210" y="40" width="20" height="3" rx="1.5" fill={MUTED} opacity="0.75" />

      {/* the row under the pointer */}
      <g className="sw-sel">
        <rect x="64" y={rows[mark]} width="208" height="10" fill={TINT} />
        <rect x="64" y={rows[mark]} width="2.4" height="10" fill={BRAND} opacity="0.55" />
      </g>

      <path d="M8 17 H272 M64 17 V99 M64 36 H272 M64 47 H272" stroke={LINE} />
      <path d="M64 57 H272 M64 67 H272 M64 77 H272 M64 87 H272" stroke={LINE} />

      {/* the records */}
      {rows.map((y, i) => {
        const c = y + 5
        const [nw, rw, aw] = cells[i]
        return (
          <g className="sw-row" key={y}>
            <circle cx="77" cy={c} r="3.6" fill={i % 2 ? TINT : WASH} stroke={LINE} />
            <rect x="86" y={c - 2} width={nw} height="4" rx="2" fill={MUTED} />
            <rect x="134" y={c - 1.75} width={rw} height="3.5" rx="1.75" fill={MUTED} opacity="0.6" />
            <rect x={200 - aw} y={c - 2} width={aw} height="4" rx="2" fill={MUTED} />

            {i === mark ? (
              <>
                <g className="sw-pend">
                  <rect x="210" y={c - 4} width="40" height="8" rx="4" fill={WASH} />
                  <circle cx="217.5" cy={c} r="1.8" fill={MUTED} />
                  <rect x="223" y={c - 1.5} width="20" height="3" rx="1.5" fill={MUTED} />
                </g>
                <g className="sw-paid">
                  <rect x="210" y={c - 4} width="40" height="8" rx="4" fill={STRONG} />
                  <path
                    className="sw-tick"
                    d={`M215.4 ${c} l2 2.1 l4.2 -4.6`}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="224" y={c + 2.5} fontSize="7" fontWeight="600" fill="#fff" className="font-ui">
                    Paid
                  </text>
                </g>
              </>
            ) : settled.includes(i) ? (
              <g>
                <rect x="210" y={c - 4} width="40" height="8" rx="4" fill={TINT} stroke={BRAND} strokeOpacity="0.35" />
                <circle cx="217.5" cy={c} r="1.8" fill={BRAND} />
                <rect x="223" y={c - 1.5} width="18" height="3" rx="1.5" fill={BRAND} opacity="0.5" />
              </g>
            ) : (
              <g>
                <rect x="210" y={c - 4} width="40" height="8" rx="4" fill={WASH} />
                <circle cx="217.5" cy={c} r="1.8" fill={MUTED} />
                <rect x="223" y={c - 1.5} width="20" height="3" rx="1.5" fill={MUTED} />
              </g>
            )}

            <circle cx="259" cy={c - 3.2} r="1" fill={MUTED} />
            <circle cx="259" cy={c} r="1" fill={MUTED} />
            <circle cx="259" cy={c + 3.2} r="1" fill={MUTED} />
          </g>
        )
      })}

      <rect x="268" y="50" width="2.4" height="26" rx="1.2" fill={LINE} />

      {/* the pointer, and the click it lands */}
      <circle className="sw-ring" cx="234" cy="70.5" r="7" fill="none" stroke={BRAND} strokeWidth="1.4" opacity="0" />
      <path
        className="sw-cursor"
        d="M234 70.5 L234 78.2 L236 76.3 L237.4 79 L238.6 78.3 L237.3 75.8 L239.8 75.6 Z"
        fill="#fff"
        stroke={STRONG}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <rect x="8" y="5" width="264" height="94" rx="8" fill="none" stroke={LINE} />
    </svg>
  )
}

/* --- Mobile Application Development: the app running in the hand --------- */
const MB_MAIL = [
  { y: 47.5, a: 22, b: 15 },
  { y: 62, a: 17, b: 12 },
  { y: 76.5, a: 21, b: 16 },
  { y: 91, a: 19, b: 13 },
  { y: 105.5, a: 23, b: 14 },
]
const MB_TABS = [123, 134.5, 146, 157.5]
const MB_LEDGER = [61, 76]

function buildMobile(el: SVGSVGElement) {
  const tl = loop(0.6)
  tl.set(q(el, '.mb-list'), { x: 0, y: 0, opacity: 1 })
    .set(q(el, '.mb-view'), { x: 16, opacity: 0 })
    .set(q(el, '.mb-spark'), { drawSVG: '0%' })
    .set(q(el, '.mb-pill'), { x: 0 })
    .set(q(el, '.mb-on1'), { opacity: 1 })
    .set(q(el, '.mb-on2'), { opacity: 0 })
    .set(q(el, '.mb-t1'), { opacity: 1 })
    .set(q(el, '.mb-t2'), { opacity: 0 })
    .set(q(el, '.mb-toast'), { y: -20, opacity: 0 })
    .set(q(el, '.mb-badge'), { scale: 0, transformOrigin: 'center' })

    // a thumb flicks the inbox twice: a real scroll, not a reveal
    .to(q(el, '.mb-list'), { y: -15, duration: 0.42, ease: 'power3.out' }, '+=0.2')
    .to(q(el, '.mb-list'), { y: -30, duration: 0.44, ease: 'power3.out' }, '+=0.2')

    // the second tab is tapped: the indicator slides, its icon lights, the view pushes across
    .fromTo(
      q(el, '.mb-tap'),
      { scale: 0.2, opacity: 0.28 },
      { scale: 1, opacity: 0, transformOrigin: 'center', duration: 0.5 },
      '+=0.26',
    )
    .to(q(el, '.mb-pill'), { x: 11.5, duration: 0.4, ease: 'back.out(1.7)' }, '<')
    .to(q(el, '.mb-on1'), { opacity: 0, duration: 0.22 }, '<')
    .to(q(el, '.mb-on2'), { opacity: 1, duration: 0.26 }, '<+=0.05')
    .to(q(el, '.mb-list'), { x: -20, opacity: 0, duration: 0.32, ease: 'power2.in' }, '<-=0.05')
    .to(q(el, '.mb-t1'), { opacity: 0, duration: 0.2 }, '<')
    .to(q(el, '.mb-view'), { x: 0, opacity: 1, duration: 0.4 }, '<+=0.1')
    .to(q(el, '.mb-t2'), { opacity: 1, duration: 0.24 }, '<')
    // the card's trend line is drawn along itself, not scaled up
    .to(q(el, '.mb-spark'), { drawSVG: '100%', duration: 0.55, ease: 'power1.inOut' }, '<+=0.14')

    // then a push notification lands, and leaves its badge behind
    .to(q(el, '.mb-toast'), { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.5)' }, '+=0.3')
    .to(q(el, '.mb-toast'), { y: -20, opacity: 0, duration: 0.34, ease: 'power2.in' }, '+=0.65')
    .to(q(el, '.mb-badge'), { scale: 1, duration: 0.42, ease: 'back.out(3)' }, '-=0.08')
    .to({}, { duration: 0.8 })
  return tl
}

function MobileScene() {
  const ref = useScene(buildMobile)
  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <clipPath id="zy-mb-screen">
          <rect x="113" y="5" width="54" height="94" rx="10" />
        </clipPath>
        <clipPath id="zy-mb-body">
          <rect x="113" y="32" width="54" height="48" />
        </clipPath>
      </defs>

      {/* the sign up screen, one handset over */}
      <g transform="translate(7 0)">
        <rect x="26" y="13" width="46" height="77" rx="10" fill="#fff" stroke={LINE} />
        <rect x="28.5" y="15.5" width="41" height="72" rx="8" fill="#fff" stroke={LINE} />
        <rect x="43.5" y="17.5" width="11" height="4" rx="2" fill={MUTED} />
        <rect x="32" y="18.5" width="6" height="2.2" rx="1.1" fill={MUTED} opacity="0.7" />
        <rect x="60" y="18.5" width="6" height="2.2" rx="1.1" fill={MUTED} opacity="0.5" />
        <rect x="32" y="26" width="24" height="5.5" rx="2.2" fill={BRAND} opacity="0.3" />
        <rect x="32" y="35" width="30" height="2.6" rx="1.3" fill={MUTED} />
        <rect x="32" y="42" width="34" height="9" rx="3" fill="#fff" stroke={LINE} />
        <rect x="35.5" y="45.5" width="15" height="2.4" rx="1.2" fill={MUTED} opacity="0.7" />
        <rect x="32" y="54" width="34" height="9" rx="3" fill="#fff" stroke={LINE} />
        <rect x="35.5" y="57.5" width="19" height="2.4" rx="1.2" fill={MUTED} opacity="0.7" />
        <circle cx="61" cy="58.7" r="1.4" fill={MUTED} opacity="0.6" />
        <rect x="32" y="67" width="34" height="9" rx="4.5" fill={BRAND} opacity="0.28" />
        <rect x="42" y="70.5" width="14" height="2.6" rx="1.3" fill="#fff" opacity="0.9" />
        <rect x="38" y="80" width="22" height="2.4" rx="1.2" fill={MUTED} opacity="0.55" />
        <rect x="43" y="84.4" width="12" height="1.6" rx="0.8" fill={MUTED} opacity="0.5" />
      </g>

      {/* the conversation screen, the other handset over */}
      <g transform="translate(-7 0)">
        <rect x="208" y="13" width="46" height="77" rx="10" fill="#fff" stroke={LINE} />
        <rect x="210.5" y="15.5" width="41" height="72" rx="8" fill="#fff" stroke={LINE} />
        <rect x="225.5" y="17.5" width="11" height="4" rx="2" fill={MUTED} />
        <rect x="214" y="18.5" width="6" height="2.2" rx="1.1" fill={MUTED} opacity="0.7" />
        <rect x="242" y="18.5" width="6" height="2.2" rx="1.1" fill={MUTED} opacity="0.5" />
        <path
          d="M216.8 24.8 L214.3 27.3 L216.8 29.8"
          fill="none"
          stroke={MUTED}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="222.5" cy="27" r="3.2" fill={TINT} stroke={BRAND} strokeOpacity="0.22" />
        <rect x="228" y="24.6" width="15" height="2.8" rx="1.4" fill={MUTED} />
        <rect x="228" y="28.6" width="9" height="2.2" rx="1.1" fill={MUTED} opacity="0.55" />
        <path d="M210.5 34 H251.5" stroke={LINE} />
        <rect x="214" y="39" width="25" height="12" rx="4.5" fill={WASH} />
        <rect x="217.5" y="42" width="16" height="2.3" rx="1.15" fill={MUTED} opacity="0.85" />
        <rect x="217.5" y="46.2" width="11" height="2.1" rx="1.05" fill={MUTED} opacity="0.6" />
        <rect x="221" y="55" width="27" height="12" rx="4.5" fill={BRAND} opacity="0.26" />
        <rect x="224.5" y="58" width="17" height="2.3" rx="1.15" fill="#fff" opacity="0.9" />
        <rect x="224.5" y="62.2" width="12" height="2.1" rx="1.05" fill="#fff" opacity="0.65" />
        <rect x="213.5" y="74" width="27" height="9" rx="4.5" fill="#fff" stroke={LINE} />
        <rect x="217" y="77.5" width="13" height="2.4" rx="1.2" fill={MUTED} opacity="0.7" />
        <circle cx="245.8" cy="78.5" r="4.6" fill={BRAND} opacity="0.34" />
        <path d="M243.8 76.2 L248.4 78.5 L243.8 80.8 Z" fill="#fff" opacity="0.95" />
        <rect x="225" y="84.6" width="12" height="1.6" rx="0.8" fill={MUTED} opacity="0.5" />
      </g>

      {/* the handset under the thumb */}
      <rect x="108.4" y="30" width="1.6" height="8" rx="0.8" fill={LINE} />
      <rect x="108.4" y="41" width="1.6" height="8" rx="0.8" fill={LINE} />
      <rect x="170" y="34" width="1.6" height="12" rx="0.8" fill={LINE} />
      <rect x="110" y="2" width="60" height="100" rx="13" fill="#fff" stroke={LINE} />
      <rect x="113" y="5" width="54" height="94" rx="10" fill="#fff" stroke={LINE} />

      {/* status bar */}
      <rect x="116.5" y="9.6" width="9" height="3" rx="1.5" fill={MUTED} />
      <rect x="134" y="7" width="12" height="5.5" rx="2.75" fill={MUTED} />
      <rect x="148" y="11" width="2" height="2.2" rx="0.6" fill={MUTED} />
      <rect x="151" y="10" width="2" height="3.2" rx="0.6" fill={MUTED} />
      <rect x="154" y="9" width="2" height="4.2" rx="0.6" fill={MUTED} />
      <rect x="157.5" y="9" width="7" height="4" rx="1.3" fill="none" stroke={MUTED} />
      <rect x="158.4" y="9.9" width="4.2" height="2.2" rx="0.8" fill={MUTED} />

      {/* app header: the title swaps when the tab does */}
      <rect className="mb-t1" x="118" y="22" width="26" height="6.5" rx="2.6" fill={BRAND} fillOpacity="0.3" />
      <rect
        className="mb-t2"
        x="118"
        y="22"
        width="19"
        height="6.5"
        rx="2.6"
        fill={BRAND}
        fillOpacity="0.3"
        opacity="0"
      />
      <path d="M154.6 27.3 L155.6 25.6 V23.3 a2.4 2.4 0 0 1 4.8 0 v2.3 l1 1.7 Z" fill={MUTED} />
      <circle cx="158" cy="28.4" r="1.1" fill={MUTED} />
      <g className="mb-badge">
        <circle cx="161.8" cy="20.8" r="4.3" fill={STRONG} />
        <text x="161.8" y="23.3" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" className="font-ui">
          2
        </text>
      </g>
      <path d="M113 32 H167" stroke={LINE} />

      {/* the screen body: an inbox that scrolls, then the view it switches to */}
      <g clipPath="url(#zy-mb-body)">
        <rect x="113" y="32" width="54" height="48" fill={WASH} />

        <g className="mb-list">
          <rect x="116" y="34" width="48" height="10" rx="5" fill="#fff" stroke={LINE} />
          <circle cx="122" cy="38.6" r="2.2" fill="none" stroke={MUTED} strokeWidth="1.1" />
          <path d="M123.6 40.2 L125.1 41.7" stroke={MUTED} strokeWidth="1.1" strokeLinecap="round" />
          <rect x="128" y="37.8" width="16" height="2.6" rx="1.3" fill={MUTED} opacity="0.65" />

          {MB_MAIL.map((m, i) => (
            <g key={m.y}>
              <rect x="116" y={m.y} width="48" height="12" rx="3.5" fill="#fff" stroke={LINE} />
              <circle
                cx="123.5"
                cy={m.y + 6}
                r="4"
                fill={i % 2 ? WASH : TINT}
                stroke={i % 2 ? 'none' : BRAND}
                strokeOpacity="0.22"
              />
              <rect x="131" y={m.y + 3} width={m.a} height="2.7" rx="1.35" fill={MUTED} />
              <rect x="131" y={m.y + 7.3} width={m.b} height="2.2" rx="1.1" fill={MUTED} opacity="0.6" />
              <rect x="155.5" y={m.y + 3.2} width="6.5" height="2" rx="1" fill={MUTED} opacity="0.5" />
              {(i === 0 || i === 3) && <circle cx="159.5" cy={m.y + 8.4} r="1.6" fill={BRAND} />}
            </g>
          ))}
        </g>

        <g className="mb-view" opacity="0">
          <rect x="116" y="34" width="48" height="24" rx="5" fill="#fff" stroke={LINE} />
          <rect x="121" y="38.5" width="13" height="2.6" rx="1.3" fill={MUTED} />
          <rect x="121" y="43.4" width="19" height="4.6" rx="2.3" fill={BRAND} opacity="0.4" />
          <path
            className="mb-spark"
            d="M121 55.4 L127.5 52.4 L133 54 L139 50 L144.5 51.6 L151 47.4 L159 44.2"
            fill="none"
            stroke={BRAND}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {MB_LEDGER.map((y) => (
            <g key={y}>
              <rect x="116" y={y} width="48" height="12" rx="3.5" fill="#fff" stroke={LINE} />
              <rect
                x="120"
                y={y + 2.8}
                width="6.4"
                height="6.4"
                rx="2"
                fill={TINT}
                stroke={BRAND}
                strokeOpacity="0.22"
              />
              <rect x="130" y={y + 3} width="17" height="2.7" rx="1.35" fill={MUTED} />
              <rect x="130" y={y + 7.3} width="11" height="2.2" rx="1.1" fill={MUTED} opacity="0.6" />
              <rect x="151.5" y={y + 4.3} width="9.5" height="3.2" rx="1.6" fill={STRONG} opacity="0.45" />
            </g>
          ))}
        </g>
      </g>

      {/* tab bar */}
      <path d="M113 80 H167" stroke={LINE} />
      <g className="mb-pill">
        <rect x="115" y="81.6" width="16" height="11" rx="5.5" fill={BRAND} fillOpacity="0.16" />
      </g>

      <path d="M118.8 87.9 L123 83.7 L127.2 87.9 V91.5 H118.8 Z" fill={MUTED} />
      <rect x="130.6" y="83.8" width="3.6" height="3.6" rx="1" fill={MUTED} />
      <rect x="134.8" y="83.8" width="3.6" height="3.6" rx="1" fill={MUTED} />
      <rect x="130.6" y="88" width="3.6" height="3.6" rx="1" fill={MUTED} />
      <rect x="134.8" y="88" width="3.6" height="3.6" rx="1" fill={MUTED} />
      <rect x="141.5" y="83.6" width="9" height="6.6" rx="2.2" fill={MUTED} />
      <path d="M144 90.2 L144 92.6 L147 90.2 Z" fill={MUTED} />
      <circle cx="157.5" cy="85.6" r="2.1" fill={MUTED} />
      <path d="M153.7 91.5 a3.8 3.8 0 0 1 7.6 0 Z" fill={MUTED} />
      {MB_TABS.map((c) => (
        <rect key={c} x={c - 4} y="93.4" width="8" height="2.4" rx="1.2" fill={MUTED} opacity="0.7" />
      ))}

      <g className="mb-on1">
        <path d="M118.8 87.9 L123 83.7 L127.2 87.9 V91.5 H118.8 Z" fill={STRONG} />
        <rect x="119" y="93.4" width="8" height="2.4" rx="1.2" fill={STRONG} />
      </g>
      <g className="mb-on2" opacity="0">
        <rect x="130.6" y="83.8" width="3.6" height="3.6" rx="1" fill={STRONG} />
        <rect x="134.8" y="83.8" width="3.6" height="3.6" rx="1" fill={STRONG} />
        <rect x="130.6" y="88" width="3.6" height="3.6" rx="1" fill={STRONG} />
        <rect x="134.8" y="88" width="3.6" height="3.6" rx="1" fill={STRONG} />
        <rect x="130.5" y="93.4" width="8" height="2.4" rx="1.2" fill={STRONG} />
      </g>
      <circle className="mb-tap" cx="134.5" cy="87.4" r="7" fill={BRAND} opacity="0" />
      <rect x="133.5" y="96.6" width="13" height="1.7" rx="0.85" fill={MUTED} opacity="0.75" />

      {/* the push notification, clipped to the glass */}
      <g clipPath="url(#zy-mb-screen)">
        <g className="mb-toast" opacity="0">
          <rect x="116" y="17.5" width="48" height="13" rx="4.5" fill={TINT} stroke={BRAND} strokeOpacity="0.3" />
          <rect x="119.5" y="20" width="8" height="8" rx="2.5" fill={BRAND} fillOpacity="0.45" />
          <rect x="131" y="20.6" width="19" height="2.8" rx="1.4" fill={MUTED} />
          <rect x="131" y="25" width="25" height="2.4" rx="1.2" fill={MUTED} opacity="0.6" />
          <rect x="155" y="20.6" width="6" height="2.2" rx="1.1" fill={MUTED} opacity="0.5" />
        </g>
      </g>
    </svg>
  )
}

/* --- AI Automation: a flow wired up on the canvas, then run -------------- */
function buildAi(el: SVGSVGElement) {
  const run = q(el, '.ai-run')
  const on1 = q(el, '.ai-on1')
  const on2 = q(el, '.ai-on2')
  const on3 = q(el, '.ai-on3')
  const e1 = q(el, '.ai-e1')
  const e2 = q(el, '.ai-e2')
  const p1 = q(el, '.ai-p1')
  const p2 = q(el, '.ai-p2')
  const bar = q(el, '.ai-bar')
  const badge = q(el, '.ai-badge')
  const tick = q(el, '.ai-tick')

  /*
    The run crossing a wire is a fixed length window of that wire's own stroke
    pushed along the curve: it grows out of the output port, runs the bezier,
    and is drawn into the input port at the far end. A dot flown over the top
    of a wire reads as a dot on a wire; this reads as the wire carrying
    something.
  */
  const travel = () => [
    { drawSVG: '0% 20%', duration: 0.14 },
    { drawSVG: '80% 100%', duration: 0.4 },
    { drawSVG: '100% 100%', duration: 0.14 },
  ]

  const tl = loop(0.8)
  tl.set([...run, ...on1, ...on2, ...on3, ...badge], { opacity: 0 })
    .set(badge, { scale: 0, transformOrigin: 'center' })
    .set([...e1, ...e2, ...bar, ...p1, ...p2], { opacity: 1 })
    .set([...e1, ...e2, ...bar, ...tick], { drawSVG: '0%' })
    .set([...p1, ...p2], { drawSVG: '0% 0%' })

    // Run is pressed and the trigger node takes the event.
    .to(run, { opacity: 1, duration: 0.22 })
    .to(on1, { opacity: 1, duration: 0.2 }, '-=0.08')
    // the wire is made between the two ports, then carries the run across
    .to(e1, { drawSVG: '100%', duration: 0.4, ease: 'power1.inOut' })
    .to(p1, { keyframes: travel(), ease: 'none' }, '-=0.08')
    .to(on2, { opacity: 1, duration: 0.2 }, '-=0.06')
    // the middle step working: its progress line is drawn, not scaled
    .to(bar, { drawSVG: '100%', duration: 0.62, ease: 'none' }, '<')
    .to(e2, { drawSVG: '100%', duration: 0.4, ease: 'power1.inOut' }, '-=0.16')
    .to(p2, { keyframes: travel(), ease: 'none' }, '-=0.08')
    .to(on3, { opacity: 1, duration: 0.2 }, '-=0.06')
    // the last node reports back
    .to(badge, { opacity: 1, scale: 1, duration: 0.34, ease: 'back.out(2.4)' }, '-=0.02')
    .to(tick, { drawSVG: '100%', duration: 0.26 }, '-=0.12')
    .to(run, { opacity: 0, duration: 0.3 }, '+=0.2')
    .to({}, { duration: 0.5 })
  return tl
}

function AiScene() {
  const ref = useScene(buildAi)
  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <pattern id="zy-ai-dots" x="30" y="22" width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.75" fill="#e6ede9" />
        </pattern>
        <clipPath id="zy-ai-canvas">
          <path d="M30 22 H276 V91 A9 9 0 0 1 267 100 H30 Z" />
        </clipPath>
      </defs>

      {/* the editor window, its chrome and its tab strip */}
      <rect x="4" y="4" width="272" height="96" rx="9" fill="#fff" stroke={LINE} />
      <path d="M13 4 H267 A9 9 0 0 1 276 13 V22 H4 V13 A9 9 0 0 1 13 4 Z" fill={WASH} />
      <circle cx="14" cy="13" r="2.2" fill="#ff5f57" />
      <circle cx="22" cy="13" r="2.2" fill="#febc2e" />
      <circle cx="30" cy="13" r="2.2" fill="#28c840" />
      <path d="M45.5 8 H102.5 A3.5 3.5 0 0 1 106 11.5 V22 H42 V11.5 A3.5 3.5 0 0 1 45.5 8 Z" fill="#fff" />
      <circle cx="51" cy="15" r="2.6" fill={BRAND} opacity="0.55" />
      <rect x="58" y="13" width="34" height="4" rx="2" fill={MUTED} />
      <circle cx="116" cy="15" r="2.6" fill={LINE} />
      <rect x="123" y="13" width="28" height="4" rx="2" fill={LINE} />
      <path d="M4 22 H276" stroke={LINE} />

      {/* the run button, and the same button lit while the flow runs */}
      <rect x="230" y="8" width="40" height="14" rx="7" fill="#fff" stroke={LINE} />
      <path d="M239 11.6 L245 15 L239 18.4 Z" fill={BRAND} opacity="0.55" />
      <rect x="249" y="13" width="14" height="4" rx="2" fill={MUTED} />
      <g className="ai-run" opacity="0">
        <rect x="230" y="8" width="40" height="14" rx="7" fill={STRONG} />
        <path d="M239 11.6 L245 15 L239 18.4 Z" fill="#fff" />
        <rect x="249" y="13" width="14" height="4" rx="2" fill="#fff" opacity="0.75" />
      </g>

      {/* the node palette down the left */}
      <path d="M4 22 H30 V100 H13 A9 9 0 0 1 4 91 Z" fill={WASH} />
      <rect x="5" y="32" width="2" height="8" rx="1" fill={BRAND} />
      <rect x="11" y="30" width="12" height="12" rx="3" fill={TINT} stroke={BRAND} strokeOpacity="0.35" />
      <circle cx="17" cy="36" r="2" fill={BRAND} opacity="0.55" />
      <rect x="11" y="47" width="12" height="12" rx="3" fill="#fff" stroke={LINE} />
      <rect x="14" y="50.4" width="6" height="1.6" rx="0.8" fill={MUTED} />
      <rect x="14" y="53.8" width="6" height="1.6" rx="0.8" fill={MUTED} />
      <rect x="11" y="64" width="12" height="12" rx="3" fill="#fff" stroke={LINE} />
      <circle cx="17" cy="70" r="2.4" fill="none" stroke={MUTED} strokeWidth="1.3" />
      <rect x="11" y="81" width="12" height="12" rx="3" fill="#fff" stroke={LINE} />
      <circle cx="14.4" cy="87" r="0.9" fill={MUTED} />
      <circle cx="17" cy="87" r="0.9" fill={MUTED} />
      <circle cx="19.6" cy="87" r="0.9" fill={MUTED} />
      <path d="M30 22 V100" stroke={LINE} />

      {/* the canvas itself */}
      <g clipPath="url(#zy-ai-canvas)">
        <rect x="30" y="22" width="246" height="78" fill="url(#zy-ai-dots)" />
      </g>

      {/* wires: one branch already connected, two made during the run */}
      <path d="M98 60 C111 60 111 82 124 82" fill="none" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      <path
        className="ai-e1"
        d="M98 60 C111 60 111 45 124 45"
        fill="none"
        stroke={BRAND}
        strokeOpacity="0.45"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0"
      />
      <path
        className="ai-e2"
        d="M184 45 C197 45 197 68 210 68"
        fill="none"
        stroke={BRAND}
        strokeOpacity="0.45"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0"
      />
      <path className="ai-p1" d="M98 60 C111 60 111 45 124 45" fill="none" stroke={STRONG} strokeWidth="2.6" strokeLinecap="round" opacity="0" />
      <path className="ai-p2" d="M184 45 C197 45 197 68 210 68" fill="none" stroke={STRONG} strokeWidth="2.6" strokeLinecap="round" opacity="0" />

      {/* the trigger node */}
      <rect x="38" y="44" width="60" height="32" rx="5" fill="#fff" stroke={LINE} />
      <path d="M38 55 V49 a5 5 0 0 1 5 -5 h50 a5 5 0 0 1 5 5 v6 Z" fill={WASH} />
      <path d="M38 55 H98" stroke={LINE} />
      <rect x="43" y="45.5" width="8" height="8" rx="2.5" fill={TINT} />
      <path d="M48.3 46.4 L44.9 50.6 H46.9 L46.1 52.9 L49.4 48.8 H47.4 Z" fill={BRAND} />
      <rect x="54" y="47.7" width="26" height="3.6" rx="1.8" fill={MUTED} />
      <circle cx="91" cy="49.5" r="2" fill={LINE} />
      <rect x="44" y="59" width="48" height="11" rx="3" fill="#fff" stroke={LINE} />
      <rect x="48" y="63" width="26" height="3.2" rx="1.6" fill={MUTED} opacity="0.75" />
      <path d="M83 63.3 l2.4 2.4 l2.4 -2.4" fill="none" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="98" cy="60" r="2.8" fill="#fff" stroke={BRAND} strokeOpacity="0.5" strokeWidth="1.4" />

      {/* the model step */}
      <rect x="124" y="29" width="60" height="32" rx="5" fill="#fff" stroke={LINE} />
      <path d="M124 40 V34 a5 5 0 0 1 5 -5 h50 a5 5 0 0 1 5 5 v6 Z" fill={WASH} />
      <path d="M124 40 H184" stroke={LINE} />
      <rect x="129" y="30.5" width="8" height="8" rx="2.5" fill={TINT} />
      <path
        d="M133 31.7 l0.95 2.3 l2.3 0.95 l-2.3 0.95 l-0.95 2.3 l-0.95 -2.3 l-2.3 -0.95 l2.3 -0.95 Z"
        fill={BRAND}
      />
      <rect x="140" y="32.7" width="26" height="3.6" rx="1.8" fill={MUTED} />
      <circle cx="177" cy="34.5" r="2" fill={LINE} />
      <rect x="130" y="44" width="48" height="11" rx="3" fill="#fff" stroke={LINE} />
      <rect x="134" y="48" width="28" height="3.2" rx="1.6" fill={MUTED} opacity="0.75" />
      <path d="M169 48.3 l2.4 2.4 l2.4 -2.4" fill="none" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M130 58 H178" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      <path className="ai-bar" d="M130 58 H178" fill="none" stroke={BRAND} strokeWidth="1.6" strokeLinecap="round" opacity="0" />
      <circle cx="124" cy="45" r="2.8" fill="#fff" stroke={BRAND} strokeOpacity="0.5" strokeWidth="1.4" />
      <circle cx="184" cy="45" r="2.8" fill="#fff" stroke={BRAND} strokeOpacity="0.5" strokeWidth="1.4" />

      {/* the step that sends the answer back out */}
      <rect x="210" y="52" width="60" height="32" rx="5" fill="#fff" stroke={LINE} />
      <path d="M210 63 V57 a5 5 0 0 1 5 -5 h50 a5 5 0 0 1 5 5 v6 Z" fill={WASH} />
      <path d="M210 63 H270" stroke={LINE} />
      <rect x="215" y="53.5" width="8" height="8" rx="2.5" fill={TINT} />
      <path d="M216.3 57.6 L222 54.9 L219.4 60.6 L218.5 58.5 Z" fill={BRAND} />
      <rect x="226" y="55.7" width="24" height="3.6" rx="1.8" fill={MUTED} />
      <rect x="216" y="67" width="48" height="11" rx="3" fill="#fff" stroke={LINE} />
      <rect x="220" y="71" width="22" height="3.2" rx="1.6" fill={MUTED} opacity="0.75" />
      <path d="M255 71.3 l2.4 2.4 l2.4 -2.4" fill="none" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="210" cy="68" r="2.8" fill="#fff" stroke={BRAND} strokeOpacity="0.5" strokeWidth="1.4" />

      {/* the branch this run does not take, collapsed */}
      <rect x="124" y="72" width="60" height="20" rx="5" fill="#fff" stroke={LINE} />
      <rect x="130" y="78" width="8" height="8" rx="2.5" fill={WASH} />
      <circle cx="134" cy="82" r="2" fill={MUTED} opacity="0.6" />
      <rect x="142" y="80.2" width="26" height="3.6" rx="1.8" fill={MUTED} opacity="0.7" />
      <circle cx="177" cy="82" r="2" fill={LINE} />
      <circle cx="124" cy="82" r="2.8" fill="#fff" stroke={LINE} strokeWidth="1.4" />

      {/* each node lighting as the run reaches it */}
      <g className="ai-on1" opacity="0">
        <rect x="38" y="44" width="60" height="32" rx="5" fill="none" stroke={BRAND} strokeWidth="1.4" />
        <circle cx="91" cy="49.5" r="2" fill={STRONG} />
      </g>
      <g className="ai-on2" opacity="0">
        <rect x="124" y="29" width="60" height="32" rx="5" fill="none" stroke={BRAND} strokeWidth="1.4" />
        <circle cx="177" cy="34.5" r="2" fill={STRONG} />
      </g>
      <g className="ai-on3" opacity="0">
        <rect x="210" y="52" width="60" height="32" rx="5" fill="none" stroke={BRAND} strokeWidth="1.4" />
      </g>

      {/* the last node reporting success */}
      <g className="ai-badge" opacity="0">
        <circle cx="266" cy="54" r="7.6" fill="#fff" />
        <circle cx="266" cy="54" r="6.2" fill={STRONG} />
        <path
          className="ai-tick"
          d="M262.6 54 l2.2 2.3 l4.4 -5"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* canvas furniture: zoom controls and a minimap */}
      <rect x="36" y="86" width="46" height="11" rx="3.5" fill="#fff" stroke={LINE} />
      <path d="M42 91.5 H48" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M55 91.5 H61 M58 88.5 V94.5" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="69" y="88.5" width="6" height="6" rx="1.5" fill="none" stroke={MUTED} strokeWidth="1.2" />
      <rect x="222" y="86" width="48" height="11" rx="3" fill="#fff" stroke={LINE} />
      <rect x="227" y="90" width="7" height="3.5" rx="1" fill={MUTED} opacity="0.55" />
      <rect x="240" y="88.5" width="7" height="3.5" rx="1" fill={MUTED} opacity="0.55" />
      <rect x="253" y="91" width="7" height="3.5" rx="1" fill={BRAND} opacity="0.5" />
    </svg>
  )
}

/* --- AI Video Generation: a shot is generated, cut in, and played back ---- */
function buildVideo(el: SVGSVGElement) {
  const head = q(el, '.vg-head')
  const tl = loop(1.1)

  tl.set(head, { x: 0 })
    .set(q(el, '.vg-prog'), { drawSVG: '0%' })
    .set(q(el, '.vg-scrub'), { drawSVG: '0%' })
    .set(q(el, '.vg-play'), { opacity: 1, scale: 1, transformOrigin: 'center' })
    .set(q(el, '.vg-fb'), { opacity: 0 })

    // the prompt is sent, and the empty slot renders
    .to(q(el, '.vg-gen'), {
      scale: 1.14,
      transformOrigin: 'center',
      duration: 0.16,
      yoyo: true,
      repeat: 1,
    })
    .to(q(el, '.vg-prog'), { drawSVG: '100%', duration: 0.8, ease: 'none' }, '-=0.08')
    .from(
      q(el, '.vg-shot'),
      { opacity: 0, scale: 0.82, transformOrigin: 'center', duration: 0.34, ease: 'back.out(2.2)' },
      '-=0.06',
    )

    // the finished shot is dragged down into V1; its audio and caption follow
    .from(
      q(el, '.vg-clip'),
      {
        x: 102,
        y: -26.5,
        scale: 0.7,
        opacity: 0,
        transformOrigin: 'center',
        duration: 0.55,
        ease: 'power3.out',
      },
      '-=0.12',
    )
    .from(q(el, '.vg-wave'), { opacity: 0, scaleY: 0.2, transformOrigin: 'center', duration: 0.3 }, '-=0.22')
    .from(q(el, '.vg-cap'), { opacity: 0, y: 4, duration: 0.28 }, '-=0.16')

    // playback: the transport clears and the playhead runs the cut
    .to(q(el, '.vg-play'), { opacity: 0, scale: 0.7, transformOrigin: 'center', duration: 0.26 }, '+=0.14')
    .addLabel('run')
    .to(head, { x: 78, duration: 0.66, ease: 'none' }, 'run')
    .to(head, { x: 196, duration: 0.96, ease: 'none' }, 'run+=0.66')
    .to(q(el, '.vg-scrub'), { drawSVG: '100%', duration: 1.62, ease: 'none' }, 'run')
    // it reaches the new clip, and the viewer cuts to that shot
    .to(q(el, '.vg-fb'), { opacity: 1, duration: 0.22 }, 'run+=0.62')
    .to({}, { duration: 0.35 })
  return tl
}

function VideoScene() {
  const ref = useScene(buildVideo)

  // the ruler is two paths, not fifty rects: majors every 28u, minors every 7u
  const major = Array.from({ length: 8 }, (_, i) => `M${48 + i * 28} 64 V72`).join(' ')
  const minor = Array.from({ length: 32 }, (_, i) => i)
    .filter((i) => i % 4 !== 0)
    .map((i) => `M${48 + i * 7} 68.5 V72`)
    .join(' ')
  // one path per audio clip, so a lane of peaks costs a single element
  const wave = (x0: number, x1: number) => {
    let d = ''
    for (let x = x0 + 3.4; x < x1 - 2; x += 3.6) {
      const env = 0.5 * Math.abs(Math.sin(x * 0.47)) + 0.5 * Math.abs(Math.sin(x * 0.173 + 2.1))
      const h = 0.3 + Math.pow(env, 1.8) * 2.5
      d += `M${x.toFixed(1)} ${(84.5 - h).toFixed(1)} V${(84.5 + h).toFixed(1)} `
    }
    return d
  }
  const CLIPS: Array<[number, number]> = [
    [48, 45],
    [94, 31],
    [175, 42],
    [218, 26],
  ]
  const CAPS: Array<[number, number]> = [
    [50, 30],
    [84, 24],
    [112, 13],
    [178, 28],
    [210, 30],
  ]
  const TRACKS: Array<[string, number]> = [
    ['V1', 73],
    ['A1', 81],
    ['C1', 89],
  ]

  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <clipPath id="zy-vg-view">
          <rect x="11" y="21" width="70" height="39" rx="4" />
        </clipPath>
        <clipPath id="zy-vg-th">
          <rect x="236" y="41" width="32" height="18" rx="2.5" />
        </clipPath>
      </defs>

      {/* the window, and the panel splits inside it */}
      <rect x="5" y="3" width="270" height="98" rx="9" fill="#fff" stroke={LINE} />
      <path d="M5 19 H275 M86 19 V62 M5 62 H275 M44 62 V101 M44 72 H275" stroke={LINE} fill="none" />

      {/* title bar: traffic lights, a tab strip, a view toggle */}
      <circle cx="16" cy="11" r="2.6" fill="#ff5f57" />
      <circle cx="25" cy="11" r="2.6" fill="#febc2e" />
      <circle cx="34" cy="11" r="2.6" fill="#28c840" />
      <rect x="46" y="6.5" width="64" height="12" rx="3" fill={TINT} />
      <text x="78" y="15" textAnchor="middle" fontSize="7" fill={MUTED} className="font-ui">
        reel-01.mp4
      </text>
      <rect x="113" y="6.5" width="50" height="12" rx="3" fill={WASH} />
      <rect x="121" y="10.6" width="28" height="3.8" rx="1.9" fill={MUTED} opacity="0.7" />
      <rect x="232" y="6.5" width="11" height="12" rx="3" fill={WASH} />
      <rect x="235" y="9.8" width="5" height="5" rx="1" fill="none" stroke={MUTED} />
      <rect x="245" y="6.5" width="11" height="12" rx="3" fill={WASH} />
      <circle cx="248" cy="12.4" r="1.1" fill={MUTED} />
      <circle cx="250.5" cy="12.4" r="1.1" fill={MUTED} />
      <circle cx="253" cy="12.4" r="1.1" fill={MUTED} />
      <rect x="258" y="6.5" width="11" height="12" rx="3" fill={TINT} />
      <path
        d="M263.5 9.4 V14.2 M261.3 12 L263.5 14.3 L265.7 12"
        fill="none"
        stroke={BRAND}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* the viewer */}
      <g clipPath="url(#zy-vg-view)">
        <g>
          <rect x="11" y="21" width="70" height="39" fill={TINT} />
          <circle cx="64" cy="32" r="6" fill={BRAND} opacity="0.3" />
          <rect x="11" y="50" width="70" height="10" fill={BRAND} opacity="0.16" />
          <path d="M11 60 L29 41 L46 60 Z" fill={BRAND} opacity="0.24" />
          <path d="M33 60 L52 44 L72 60 Z" fill={BRAND} opacity="0.34" />
        </g>
        <g className="vg-fb" opacity="0">
          <rect x="11" y="21" width="70" height="39" fill={TINT} />
          <rect x="53" y="21" width="28" height="39" fill={BRAND} opacity="0.12" />
          <circle cx="40" cy="37" r="8" fill={BRAND} opacity="0.34" />
          <path d="M24 60 A16 16 0 0 1 56 60 Z" fill={BRAND} opacity="0.26" />
        </g>
        <rect
          x="15"
          y="24"
          width="62"
          height="25"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeDasharray="3 3"
        />
        <rect x="11" y="51" width="70" height="9" fill="#fff" opacity="0.86" />
        <path d="M16 53.4 L21 55.5 L16 57.6 Z" fill={STRONG} />
        <path d="M25 55.5 H68" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
        <path className="vg-scrub" d="M25 55.5 H68" stroke={STRONG} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="72" y="53.4" width="4.6" height="4.2" rx="1" fill="none" stroke={MUTED} />
      </g>
      <rect x="11" y="21" width="70" height="39" rx="4" fill="none" stroke={LINE} />
      <g className="vg-play">
        <circle cx="46" cy="40" r="8.6" fill="#fff" opacity="0.92" stroke={LINE} />
        <path d="M43.2 36.2 L50.2 40 L43.2 43.8 Z" fill={STRONG} />
      </g>

      {/* the shot browser: a prompt, a render button, a strip of takes */}
      <rect x="92" y="25" width="142" height="12" rx="3" fill={WASH} stroke={LINE} />
      <rect x="98" y="29.4" width="96" height="3.6" rx="1.8" fill={MUTED} />
      <rect x="198" y="28" width="1.2" height="6.4" rx="0.6" fill={BRAND} />
      <g className="vg-gen">
        <rect x="240" y="25" width="28" height="12" rx="3" fill={STRONG} />
        <path
          d="M254 27.3 L255.3 29.7 L257.7 31 L255.3 32.3 L254 34.7 L252.7 32.3 L250.3 31 L252.7 29.7 Z"
          fill="#fff"
        />
      </g>

      {[92, 128, 164, 200].map((x, i) => (
        <g key={x}>
          <rect x={x} y="41" width="32" height="18" rx="2.5" fill={WASH} />
          {i % 2 === 0 ? (
            <>
              <circle cx={x + 10} cy="47" r="4.2" fill={BRAND} opacity="0.28" />
              <path d={`M${x + 2} 59 L${x + 14} 47 L${x + 26} 59 Z`} fill={BRAND} opacity="0.2" />
            </>
          ) : (
            <>
              <rect x={x + 8} y="45" width="9" height="14" rx="2" fill={BRAND} opacity="0.3" />
              <rect x={x + 20} y="49" width="7" height="10" rx="1.5" fill={BRAND} opacity="0.18" />
            </>
          )}
        </g>
      ))}

      {/* the empty slot, rendering */}
      <rect x="236" y="41" width="32" height="18" rx="2.5" fill={WASH} stroke={LINE} strokeDasharray="3 3" />
      <path d="M240 54 H264" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <path className="vg-prog" d="M240 54 H264" stroke={STRONG} strokeWidth="2" strokeLinecap="round" />
      <g className="vg-shot" clipPath="url(#zy-vg-th)">
        <rect x="236" y="41" width="32" height="18" fill={TINT} />
        <rect x="259" y="41" width="9" height="18" fill={BRAND} opacity="0.12" />
        <circle cx="248" cy="47.5" r="3.6" fill={BRAND} opacity="0.34" />
        <path d="M242 59 A8 8 0 0 1 258 59 Z" fill={BRAND} opacity="0.26" />
        <rect x="236" y="41" width="32" height="18" rx="2.5" fill="none" stroke={BRAND} strokeOpacity="0.4" />
      </g>

      {/* the timeline gutter: timecode readout, track heads */}
      <rect x="14" y="63.5" width="26" height="8" rx="2" fill={WASH} />
      <text x="27" y="69.9" textAnchor="middle" fontSize="7" fill={STRONG} className="font-ui">
        04:12
      </text>
      {TRACKS.map(([name, y], i) => (
        <g key={name}>
          <text x="17" y={y + 5.2} fontSize="7" fill={MUTED} className="font-ui">
            {name}
          </text>
          <rect x="31" y={y + 1.8} width="9" height="3.6" rx="1.8" fill={i === 0 ? TINT : WASH} />
          <rect x="44" y={y} width="227" height="7" fill={WASH} />
        </g>
      ))}

      {/* the ruler */}
      <path d={minor} stroke={LINE} />
      <path d={major} stroke={MUTED} />

      {/* V1: the cut, with the generated shot landing in the gap */}
      {CLIPS.map(([x, w]) => (
        <g key={x}>
          <rect x={x} y="73" width={w} height="7" rx="2" fill={BRAND} opacity="0.3" />
          <rect x={x + 1.5} y="74" width={w - 3} height="1.6" rx="0.8" fill="#fff" opacity="0.5" />
        </g>
      ))}
      <g className="vg-clip">
        <rect x="126" y="73" width="48" height="7" rx="2" fill={STRONG} />
        <rect x="127.5" y="74" width="45" height="1.6" rx="0.8" fill="#fff" opacity="0.45" />
        <rect x="125" y="72" width="50" height="9" rx="3" fill="none" stroke={BRIGHT} strokeWidth="1.2" />
      </g>

      {/* A1: the bed, plus the new take's own waveform */}
      <rect x="48" y="81" width="77" height="7" rx="2" fill={TINT} stroke={BRAND} strokeOpacity="0.25" />
      <path d={wave(48, 125)} stroke={BRAND} strokeOpacity="0.5" strokeWidth="0.85" strokeLinecap="round" />
      <rect x="175" y="81" width="69" height="7" rx="2" fill={TINT} stroke={BRAND} strokeOpacity="0.25" />
      <path d={wave(175, 244)} stroke={BRAND} strokeOpacity="0.5" strokeWidth="0.85" strokeLinecap="round" />
      <g className="vg-wave">
        <rect x="126" y="81" width="48" height="7" rx="2" fill={TINT} stroke={BRAND} strokeOpacity="0.45" />
        <path d={wave(126, 174)} stroke={STRONG} strokeOpacity="0.75" strokeWidth="0.85" strokeLinecap="round" />
      </g>

      {/* C1: caption chips */}
      {CAPS.map(([x, w]) => (
        <g key={x}>
          <rect x={x} y="89" width={w} height="7" rx="2" fill="#fff" stroke={LINE} />
          <rect x={x + 3} y="91.9" width={w - 6} height="2.2" rx="1.1" fill={MUTED} />
        </g>
      ))}
      <g className="vg-cap">
        <rect x="128" y="89" width="44" height="7" rx="2" fill={TINT} stroke={BRAND} strokeOpacity="0.35" />
        <rect x="131" y="91.9" width="38" height="2.2" rx="1.1" fill={BRAND} opacity="0.55" />
      </g>

      {/* the playhead */}
      <g className="vg-head">
        <path d="M43 62.5 H53 V68 L48 71.8 L43 68 Z" fill={STRONG} />
        <path d="M48 62.5 V96.5" stroke={STRONG} strokeWidth="1.3" />
      </g>
    </svg>
  )
}

/* --- Digital Marketing: an analytics board plotting a period ------------- */
const MK_TREND = 'M34 79 L58 72 L82 75 L106 64 L130 68 L154 55 L178 47 L196 43'
const MK_PREV = 'M34 85 L58 81 L82 83 L106 78 L130 80 L154 74 L178 71 L196 69'
const MK_AREA = `${MK_TREND} L196 88 L34 88 Z`
const MK_GRID = [40, 52, 64, 76]
/** y gridline, label stub width: the bottom stub is narrow, the way a "0" is. */
const MK_YTICK: Array<[number, number]> = [
  [40, 10],
  [52, 10],
  [64, 9],
  [76, 9],
  [88, 5],
]
const MK_XTICK = [40, 78, 116, 154, 192]
const MK_RANGE = ['7D', '30D', '90D']
/** tile top, arrow fill, meter fill, meter width */
const MK_TILES: Array<[number, string, string, number]> = [
  [32, STRONG, STRONG, 28],
  [66, BRAND, BRIGHT, 21],
]

function buildMarketing(el: SVGSVGElement) {
  const tl = loop(0.6)
  // A range is picked, the period plots itself, the reading lands, the tiles fill.
  // The line is drawn (DrawSVG, arc length) while the area and the comparison
  // series are wiped in (a clip rect, linear in x). Over this path the two
  // parametrisations diverge by under 1.4px, so the stroke tip and the fill edge
  // travel as one thing.
  tl.fromTo(q(el, '.mk-seg'), { x: -52 }, { x: 0, duration: 0.42, ease: 'power3.inOut' })
    .from(
      q(el, '.mk-wipe'),
      { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'none' },
      '-=0.06',
    )
    .fromTo(q(el, '.mk-line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'none' }, '<')
    .fromTo(q(el, '.mk-cross'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3 }, '-=0.18')
    .from(q(el, '.mk-pt'), { scale: 0, transformOrigin: 'center', duration: 0.36, ease: 'back.out(2.6)' }, '-=0.08')
    .from(q(el, '.mk-tip'), { opacity: 0, y: -5, duration: 0.32 }, '-=0.16')
    .from(
      q(el, '.mk-fill'),
      { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.12 },
      '-=0.24',
    )
    .from(
      q(el, '.mk-arrow'),
      { scale: 0, transformOrigin: 'center', duration: 0.3, stagger: 0.12, ease: 'back.out(2.8)' },
      '-=0.32',
    )
    .to(
      q(el, '.mk-halo'),
      { scale: 1.3, transformOrigin: 'center', duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' },
      '-=0.06',
    )
    .to({}, { duration: 0.85 })
  return tl
}

function MarketingScene() {
  const ref = useScene(buildMarketing)
  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <clipPath id="zy-mk-clip">
          <rect className="mk-wipe" x="28" y="38" width="172" height="52" />
        </clipPath>
      </defs>

      {/* the window */}
      <rect x="6" y="6" width="268" height="92" rx="9" fill="#fff" stroke={LINE} />
      <path d="M6 24 H274" stroke={LINE} />
      <circle cx="17" cy="15" r="2.4" fill="#e4ebe7" />
      <circle cx="26" cy="15" r="2.4" fill="#e4ebe7" />
      <circle cx="35" cy="15" r="2.4" fill="#e4ebe7" />
      <rect x="46" y="12.5" width="30" height="5" rx="2.5" fill={MUTED} opacity="0.55" />
      <rect x="80" y="12.5" width="18" height="5" rx="2.5" fill={MUTED} opacity="0.3" />

      {/* the date range control: the pill slides to the segment that is lit */}
      <rect x="190" y="9" width="78" height="13" rx="6.5" fill={WASH} />
      <rect className="mk-seg" x="243.5" y="11" width="23" height="9" rx="4.5" fill="#fff" stroke={LINE} />
      {MK_RANGE.map((label, i) => (
        <text
          key={label}
          x={203 + i * 26}
          y="18"
          textAnchor="middle"
          fontSize="7"
          fontWeight="600"
          fill={i === 2 ? STRONG : MUTED}
          className="font-ui"
        >
          {label}
        </text>
      ))}

      {/* the metric rail */}
      <path d="M208 24 V98" stroke={LINE} />
      {MK_TILES.map(([ty, arrow, meter, w]) => (
        <g key={ty}>
          <rect x="216" y={ty} width="50" height="28" rx="6" fill="#fff" stroke={LINE} />
          <rect x="222" y={ty + 5.5} width="20" height="3.2" rx="1.6" fill={MUTED} />
          <path className="mk-arrow" d={`M254 ${ty + 9.6} L258.2 ${ty + 5} L262.4 ${ty + 9.6} Z`} fill={arrow} />
          <rect x="222" y={ty + 12} width={ty === 32 ? 24 : 20} height="5.5" rx="2" fill={MUTED} opacity="0.85" />
          <rect x="222" y={ty + 21.5} width="38" height="4" rx="2" fill={WASH} />
          <rect className="mk-fill" x="222" y={ty + 21.5} width={w} height="4" rx="2" fill={meter} />
        </g>
      ))}

      {/* the legend: this period, and the one before it */}
      <rect x="28" y="30.6" width="12" height="2.2" rx="1.1" fill={STRONG} />
      <circle cx="34" cy="31.7" r="2.2" fill={STRONG} />
      <rect x="44" y="29.6" width="22" height="4" rx="2" fill={MUTED} />
      <rect x="72" y="30.6" width="12" height="2.2" rx="1.1" fill={MUTED} />
      <rect x="88" y="29.6" width="16" height="4" rx="2" fill={MUTED} opacity="0.55" />

      {/* axes, gridlines and the stubs where axis labels sit */}
      {MK_YTICK.map(([y, w]) => (
        <rect key={y} x={24 - w} y={y - 1.2} width={w} height="2.4" rx="1.2" fill={MUTED} opacity="0.5" />
      ))}
      {MK_XTICK.map((x) => (
        <rect key={x} x={x - 4.5} y="91.4" width="9" height="2.4" rx="1.2" fill={MUTED} opacity="0.5" />
      ))}
      {MK_GRID.map((y) => (
        <path key={y} d={`M28 ${y} H200`} stroke={LINE} />
      ))}
      <path d="M28 38 V88" stroke={LINE} />
      <path d="M28 88 H200" stroke={LINE} />

      {/* the fill and the previous period, wiped in behind the drawing line */}
      <g clipPath="url(#zy-mk-clip)">
        <path d={MK_AREA} fill={BRAND} opacity="0.12" />
        <path d={MK_PREV} fill="none" stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round" />
      </g>

      <path
        className="mk-cross"
        d="M154 88 L154 45"
        fill="none"
        stroke={BRAND}
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        className="mk-line"
        d={MK_TREND}
        fill="none"
        stroke={STRONG}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* the point the crosshair lands on, and its readout */}
      <g className="mk-pt">
        <circle className="mk-halo" cx="154" cy="55" r="7.5" fill={BRAND} opacity="0.14" />
        <circle cx="154" cy="55" r="4.2" fill="#fff" stroke={STRONG} strokeWidth="2" />
        <circle cx="154" cy="55" r="1.5" fill={STRONG} />
      </g>

      <g className="mk-tip">
        <rect x="112" y="28" width="46" height="17" rx="4" fill="#fff" stroke={LINE} />
        <circle cx="119" cy="33.5" r="2" fill={STRONG} />
        <rect x="125" y="32" width="25" height="3" rx="1.5" fill={MUTED} />
        <rect x="125" y="38" width="17" height="4" rx="2" fill={STRONG} opacity="0.5" />
      </g>
    </svg>
  )
}

/* --- Social Media Management: a post composed, scheduled, engaged -------- */
const SM_COLS = [159, 175, 191, 207, 223, 239, 255]
const SM_ROWS = [42, 60, 78]
const SM_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const SM_TODAY = 2
/** [column, row] of the slots that already hold a scheduled post. */
const SM_TAKEN: Array<[number, number]> = [
  [0, 0],
  [1, 2],
  [2, 0],
  [3, 1],
  [4, 0],
  [5, 2],
  [6, 1],
]

function buildSocial(el: SVGSVGElement) {
  const caret = q(el, '.sm-cr')
  const chip = q(el, '.sm-chip')
  const ghost = q(el, '.sm-ghost')
  const label = q(el, '.sm-label')

  const tl = loop(0.5)
  tl.set(chip, { opacity: 0 })
    .set(label, { opacity: 1 })
    .set(caret, { opacity: 1 })
    // the post is written
    .from(q(el, '.sm-type'), { scaleX: 0, transformOrigin: 'left center', duration: 0.42, stagger: 0.2 })
    .to(caret, { opacity: 0, duration: 0.2, repeat: 3, yoyo: true, ease: 'none' }, '-=0.34')
    // its image is attached
    .from(
      q(el, '.sm-img'),
      { scale: 0.6, opacity: 0, transformOrigin: 'center', duration: 0.36, ease: 'back.out(2.2)' },
      '-=0.35',
    )
    // the slot it is bound for opens as a drop target
    .from(ghost, { opacity: 0, scale: 0.72, transformOrigin: 'center', duration: 0.3 }, '-=0.1')
    // Schedule is pressed
    .to(q(el, '.sm-btn'), { scale: 0.94, transformOrigin: 'center', duration: 0.13, yoyo: true, repeat: 1 }, '+=0.12')
    .to(caret, { opacity: 0, duration: 0.12 }, '<')
    // and the post travels into the slot, which fills. x and y run on their
    // own eases so the chip arcs up out of the composer instead of sliding.
    .set(chip, { opacity: 1, x: -76.5, y: 18, scale: 1.7, transformOrigin: 'center' })
    .to(chip, { x: 0, duration: 0.62, ease: 'power1.inOut' })
    .to(chip, { y: 0, duration: 0.62, ease: 'power2.out' }, '<')
    .to(chip, { scale: 1, duration: 0.62, ease: 'power2.inOut' }, '<')
    .to(ghost, { opacity: 0, duration: 0.22 }, '-=0.2')
    // the button confirms: the label goes, the tick is drawn
    .to(label, { opacity: 0, duration: 0.18 }, '-=0.32')
    .fromTo(q(el, '.sm-ok'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, '-=0.04')
    // engagement comes back on the post
    .from(q(el, '.sm-heart'), { scale: 0, transformOrigin: 'center', duration: 0.34, ease: 'back.out(3)' }, '+=0.3')
    .from(
      q(el, '.sm-count'),
      { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.3, stagger: 0.26 },
      '-=0.16',
    )
    .from(q(el, '.sm-reply'), { scale: 0, transformOrigin: 'center', duration: 0.34, ease: 'back.out(3)' }, '-=0.34')
    .to({}, { duration: 0.8 })
  return tl
}

function SocialScene() {
  const ref = useScene(buildSocial)
  return (
    <svg ref={ref} viewBox={SVC_VB} className={svgCls} aria-hidden="true">
      <defs>
        <clipPath id="zy-sm-av">
          <circle cx="23" cy="37" r="9" />
        </clipPath>
      </defs>

      {/* the app window */}
      <rect x="5" y="5" width="270" height="94" rx="9" fill="#fff" stroke={LINE} />
      <path d="M5 23 H275" stroke={LINE} />
      <circle cx="15" cy="14" r="2.4" fill="#ff5f57" />
      <circle cx="23.5" cy="14" r="2.4" fill="#febc2e" />
      <circle cx="32" cy="14" r="2.4" fill="#28c840" />
      <rect x="60" y="9" width="34" height="10" rx="5" fill={TINT} />
      <rect x="100" y="9" width="28" height="10" rx="5" fill={WASH} />
      <rect x="134" y="9" width="24" height="10" rx="5" fill={WASH} />
      <rect x="200" y="9" width="44" height="10" rx="5" fill={WASH} />
      <circle cx="258" cy="14" r="6" fill={TINT} stroke={BRAND} strokeOpacity="0.3" />
      <circle cx="262.5" cy="10" r="2.2" fill={STRONG} />
      <path d="M152 23 V99" stroke={LINE} />

      {/* composer: the account posting */}
      <circle cx="23" cy="37" r="9" fill={TINT} stroke={BRAND} strokeOpacity="0.3" />
      <g clipPath="url(#zy-sm-av)">
        <circle cx="23" cy="34.6" r="3.1" fill={BRAND} opacity="0.45" />
        <path d="M15.5 47 C15.5 36.5 30.5 36.5 30.5 47 Z" fill={BRAND} opacity="0.35" />
      </g>
      <rect x="38" y="30" width="48" height="5.5" rx="2.75" fill={MUTED} />
      <rect x="38" y="39" width="30" height="4.5" rx="2.25" fill={MUTED} opacity="0.5" />

      {/* the channels it goes to, one selected */}
      <circle cx="104" cy="37" r="7" fill={TINT} stroke={BRAND} strokeOpacity="0.45" />
      <circle cx="104" cy="37" r="2.6" fill={BRAND} />
      <circle cx="120" cy="37" r="7" fill={WASH} />
      <circle cx="120" cy="37" r="2.6" fill={MUTED} />
      <circle cx="136" cy="37" r="7" fill={WASH} />
      <circle cx="136" cy="37" r="2.6" fill={MUTED} />

      {/* the post being written */}
      <rect x="14" y="50" width="129" height="26" rx="5" fill="#fff" stroke={LINE} />
      <rect className="sm-type" x="21" y="56" width="98" height="5" rx="2.5" fill={MUTED} />
      <rect className="sm-type" x="21" y="65" width="66" height="5" rx="2.5" fill={MUTED} opacity="0.75" />
      <rect className="sm-cr" x="89" y="63.5" width="1.6" height="8" rx="0.8" fill={STRONG} />

      {/* its attachment */}
      <g className="sm-img">
        <rect x="14" y="80" width="26" height="16" rx="4" fill={TINT} stroke={BRAND} strokeOpacity="0.3" />
        <circle cx="20.5" cy="85.5" r="1.9" fill={BRAND} opacity="0.5" />
        <path d="M16 94 l5.5 -5.5 l3.5 3.5 l3 -3 l5 5 Z" fill={BRAND} opacity="0.3" />
      </g>

      {/* engagement on the post: the empty glyph sits under the filled one */}
      <path
        d="M49 93 C49 93 44 89.8 44 86.9 C44 85.3 45.2 84 46.7 84 C47.8 84 48.6 84.6 49 85.3 C49.4 84.6 50.2 84 51.3 84 C52.8 84 54 85.3 54 86.9 C54 89.8 49 93 49 93 Z"
        fill="none"
        stroke={MUTED}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        className="sm-heart"
        d="M49 93 C49 93 44 89.8 44 86.9 C44 85.3 45.2 84 46.7 84 C47.8 84 48.6 84.6 49 85.3 C49.4 84.6 50.2 84 51.3 84 C52.8 84 54 85.3 54 86.9 C54 89.8 49 93 49 93 Z"
        fill={BRAND}
      />
      <rect className="sm-count" x="57" y="86" width="8" height="4.6" rx="2.3" fill={BRAND} opacity="0.5" />
      <path
        d="M74 83 H80 A4 4 0 0 1 84 87 V88.5 A4 4 0 0 1 80 92.5 H77.5 L74 95.8 L74.2 92.5 H74 A4 4 0 0 1 70 88.5 V87 A4 4 0 0 1 74 83 Z"
        fill="none"
        stroke={MUTED}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g className="sm-reply">
        <path
          d="M74 83 H80 A4 4 0 0 1 84 87 V88.5 A4 4 0 0 1 80 92.5 H77.5 L74 95.8 L74.2 92.5 H74 A4 4 0 0 1 70 88.5 V87 A4 4 0 0 1 74 83 Z"
          fill={STRONG}
        />
        <circle cx="73.5" cy="87.7" r="1.4" fill="#fff" opacity="0.85" />
        <circle cx="77" cy="87.7" r="1.4" fill="#fff" opacity="0.85" />
        <circle cx="80.5" cy="87.7" r="1.4" fill="#fff" opacity="0.85" />
      </g>
      <rect className="sm-count" x="86" y="86" width="8" height="4.6" rx="2.3" fill={BRAND} opacity="0.5" />

      {/* the schedule button, which becomes a tick */}
      <g className="sm-btn">
        <rect x="99" y="79" width="44" height="17" rx="5" fill={STRONG} />
        <text
          className="sm-label font-ui"
          x="121"
          y="90.3"
          textAnchor="middle"
          fontSize="7.2"
          fontWeight="600"
          fill="#fff"
        >
          Schedule
        </text>
        <path
          className="sm-ok"
          d="M115 87.4 l3.6 3.8 l7.8 -8.6"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* the week it is being scheduled into */}
      {SM_DAYS.map((d, i) => (
        <text
          key={i}
          className="font-ui"
          x={SM_COLS[i] + 6.5}
          y="33"
          textAnchor="middle"
          fontSize="7"
          fill={MUTED}
          opacity={i > 4 ? 0.55 : 1}
        >
          {d}
        </text>
      ))}
      <rect x={SM_COLS[SM_TODAY] + 3.5} y="35.5" width="6" height="1.8" rx="0.9" fill={STRONG} />
      <path d="M152 38 H275" stroke={LINE} />

      {/* 21 slots and the posts already in them are static: density is free */}
      {SM_ROWS.map((y, r) =>
        SM_COLS.map((x, c) => (
          <rect
            key={`${c}-${r}`}
            x={x}
            y={y}
            width="13"
            height="15"
            rx="3"
            fill={c === SM_TODAY ? TINT : WASH}
            opacity={c > 4 ? 0.55 : 1}
          />
        )),
      )}

      {SM_TAKEN.map(([c, r]) => {
        const x = SM_COLS[c]
        const y = SM_ROWS[r]
        return (
          <g key={`${c}-${r}`}>
            <rect x={x + 1} y={y + 1.5} width="11" height="12" rx="2.5" fill={BRAND} opacity="0.16" />
            <circle cx={x + 4} cy={y + 5.5} r="1.8" fill={BRAND} opacity="0.5" />
            <rect x={x + 2.5} y={y + 9} width="7.5" height="2.4" rx="1.2" fill={BRAND} opacity="0.4" />
          </g>
        )
      })}

      {/* the slot this post is going into, and the post that lands in it */}
      <rect
        className="sm-ghost"
        x="191"
        y="60"
        width="13"
        height="15"
        rx="3"
        fill="none"
        stroke={BRAND}
        strokeWidth="1.2"
        strokeOpacity="0.75"
        strokeDasharray="3 2.6"
      />
      <g className="sm-chip">
        <rect x="191.5" y="60.5" width="12" height="14" rx="3" fill={STRONG} />
        <circle cx="195.5" cy="65" r="2" fill="#fff" opacity="0.9" />
        <rect x="193.5" y="69" width="7.5" height="2.6" rx="1.3" fill="#fff" opacity="0.75" />
      </g>
    </svg>
  )
}

const SERVICE_SCENE: Record<string, () => React.ReactElement> = {
  web: WebScene,
  software: SoftwareScene,
  mobile: MobileScene,
  ai: AiScene,
  video: VideoScene,
  marketing: MarketingScene,
  social: SocialScene,
}

export function ServiceScene({ id }: { id: string }) {
  const Scene = SERVICE_SCENE[id] ?? WebScene
  return <Scene />
}

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
