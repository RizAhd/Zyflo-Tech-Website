/** The hand written hero line, traced from the font at build time (vite.config.ts, zyflo-pen). */
declare module 'virtual:pen-paths' {
  const pen: {
    /** The text the outlines spell. */
    text: string
    /** Units per em of the traced outline. */
    em: number
    /** Every letter as one filled path. */
    full: string
    /** Each closed outline on its own, for the pen to draw one after another. */
    contours: string[]
    x: number
    y: number
    w: number
    h: number
  }
  export default pen
}
