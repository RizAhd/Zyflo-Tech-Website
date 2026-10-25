import { useId } from 'react'
import { motion } from 'framer-motion'

import { MOTION_OK } from './motion'

/*
  The one huge word across the top of the home page: ZYFLO TECH in Anton,
  edge to edge, with a photo showing through the letters (GrowthLab's
  MARKETING, in this site's black and green).

  It is an SVG so it fills its width exactly at every screen size. The view
  box is Anton's own ink box for this text, measured from the font (units per
  em 2048, ink from x 32 to 8429 and from y -1776 to 16), so the letters touch
  both edges with no stretching. Two copies of the text are drawn: the first
  is filled with the photo, the second with a gradient that tints it from
  matte black at the top to Zyflo green at the bottom.

  Decorative: the page heading is the headline in the band below, so this is
  hidden from screen readers.
*/

const VIEW = '32 -1776 8397 1792'
const TEXT = 'ZYFLO TECH'

export default function PosterWord({ image, className = '' }: { image: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches

  const text = (fill: string) => (
    <text x="0" y="0" fill={fill} style={{ fontFamily: 'var(--font-poster)', fontSize: 2048 }}>
      {TEXT}
    </text>
  )

  return (
    <motion.svg
      viewBox={VIEW}
      className={`block h-auto w-full ${className}`}
      aria-hidden="true"
      focusable="false"
      initial={motionOn ? { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' } : false}
      animate={motionOn ? { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' } : undefined}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <defs>
        <pattern id={`${id}-photo`} patternUnits="userSpaceOnUse" x="32" y="-1776" width="8397" height="1792">
          <image href={image} x="0" y="0" width="8397" height="1792" preserveAspectRatio="xMidYMid slice" />
        </pattern>
        <linearGradient id={`${id}-tint`} x1="0" y1="-1776" x2="0" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#111111" stopOpacity="0.92" />
          <stop offset="0.55" stopColor="#111111" stopOpacity="0.45" />
          <stop offset="1" stopColor="#008b48" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {text(`url(#${id}-photo)`)}
      {text(`url(#${id}-tint)`)}
    </motion.svg>
  )
}
