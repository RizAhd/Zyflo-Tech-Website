/**
 * Paths to files in /public, built from the base URL so they resolve wherever
 * the site is hosted: at a domain root (Cloudflare, a custom domain) or under
 * a sub-path (GitHub Pages serves a project at /<repo>/). A hard-coded leading
 * slash would break the second case.
 */
const base = import.meta.env.BASE_URL

export const LOGO_SRC = `${base}brand/logo.png`
