/**
 * Paths to files in /public, built from the base URL so they resolve wherever
 * the site is hosted: at a domain root (Cloudflare, a custom domain) or under
 * a sub-path (GitHub Pages serves a project at /<repo>/). A hard-coded leading
 * slash would break the second case.
 */
const base = import.meta.env.BASE_URL

/** The ZYFLO TECH Z on a black tile: header, cards, icons. */
export const LOGO_SRC = `${base}brand/zyflo-tile.svg`
/** The white Z on its own, for the black footer. */
export const LOGO_WHITE_SRC = `${base}brand/zyflo-z-white.svg`
