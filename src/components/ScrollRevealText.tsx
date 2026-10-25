import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

import { MOTION_OK } from './motion'

/*
  A statement that darkens word by word as it scrolls through the screen
  (GrowthLab's "We don't do generic" paragraph). Each word starts pale and
  reaches full colour in turn, so the eye is pulled along the sentence at the
  pace of the scroll. The text is ordinary text in a paragraph, so it reads
  and copies normally; with motion off every word is simply full colour.
*/

function Word({ word, progress, from, to }: { word: string; progress: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(progress, [from, to], [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  )
}

export default function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const motionOn = typeof window !== 'undefined' && window.matchMedia(MOTION_OK).matches
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  if (!motionOn) return <p className={className}>{text}</p>

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} />
      ))}
    </p>
  )
}
