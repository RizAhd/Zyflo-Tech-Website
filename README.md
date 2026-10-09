# Zyflo Tech, Website

A one-page, scroll-driven marketing site. Vite + React + TypeScript, GSAP, Lenis, Three.js.

**Zero external requests.** Fonts are self-hosted, every library is bundled, there is no CDN, no
Google Fonts, no analytics and no third-party embeds. The only network call the site ever makes
is the contact-form POST when a visitor submits it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build locally
```

## ⚠️ Before you launch, fill in your details

Everything a human needs to change lives in **one file**: [src/data/site.config.ts](src/data/site.config.ts).
Search it for `TODO_` and replace each one.

| What | Where | Notes |
|---|---|---|
| WhatsApp number | `contact.whatsapp` | Digits only, with country code, e.g. `94771234567` |
| Business email | `contact.email` | |
| Phone | `contact.phone` | Human-readable, e.g. `+94 77 123 4567` |
| Social links | `socials[]` | Facebook / Instagram / LinkedIn / GitHub |
| Contact form key | `contact.web3formsKey` | Free key from [web3forms.com](https://web3forms.com) |
| Site URL | `business.url` | Once you pick a domain |

**Nothing fake can ship by accident.** Any value still set to `TODO_` is automatically hidden, the WhatsApp button doesn't render, empty footer columns disappear, the oversized contact link in
the closing section is omitted, and the form shows direct contact links instead of a form that
would silently fail. Fill a value in and its UI appears on its own.

Work cards come from `projects[]` and the "Shipped for" list from `clients[]`, both in
`site.config.ts`. Only add an entry once the project is live.

## Deploy

The build is fully static and portable (`base: './'`), so `dist/` works as-is on:

- **Vercel / Netlify / Cloudflare Pages**, build `npm run build`, publish directory `dist`
- **cPanel / any FTP host**, upload the *contents* of `dist/` to `public_html`, including a
  sub-folder if you want (relative paths handle it)

## The design

The visual language is modelled on the **Studio Zealous** reference site (`zealousinterior-main/`), a warm editorial atelier look. The page runs:

| | Section | Reference counterpart |
|---|---|---|
|, | Full-bleed dark hero, one viewport tall | its hero photograph |
|, | Display-serif marquee band on sand | its marquee |
| 01 | **Services**, pinned horizontal gallery | `02, Selected Work` |
| 02 | **Work**, clip-wipe project grid | `04, Journal` |
| 03 | **Process**, editorial split, overlapping plates | `03, A Recent Chapter` |
|, | Statement, gradient sweep on sand | its pinned statement |
| 04 | **About**, ethos split, word-by-word reveal | `01, Ethos` |
| 05 | **Contact**, dark close, oversized link, curtain | its footer |

**The palette is Zyflo's, not the reference's.** The reference's six colour *roles* are kept
exactly and its *values* are replaced with brand colours sampled from the logo, which are also
shared with the Zyflo invoice app, so website, invoices and receipts still read as one company:

| role | reference | Zyflo |
|---|---|---|
| cream, page ground / text on dark | warm off-white | `#FDF6F1` |
| sand, band ground | sand | `#F3ECDE` |
| ink, dark ground **and** all body text | warm near-black | `#06341C` green-ink |
| clay, micro-label accent on cream | clay | `#8A6720` gold-deep |
| blush, accent on dark | blush | `#C99B4A` gold-light |
| gold, decoration | gold | `#B98B3A` |

Emerald `#008B48` is the one addition, carrying the 3D lattice, status dots and rules.

## How it's put together

- `src/data/site.config.ts`, all content and contact details
- `src/styles/tokens.css`, the design system. **The contrast notes at the top of that file are
  measured, not guessed.**
- `src/styles/global.css`, the shared vocabulary. Every primitive maps to a Tailwind utility in
  the reference (`.font-display`, `.eyebrow`, `.grain`, `.pill`, `.marquee-track`, `.shell`);
  this project writes them as plain CSS instead.
- `src/lib/useLenis.ts`, Lenis smooth scroll, wired to GSAP the way the reference does it: one
  RAF loop, `ScrollTrigger.update` on scroll, and `lagSmoothing(0)`.
- `src/lib/useReveals.ts`, the five page-wide reveals, declared by class name:
  `.reveal`, `.word-reveal`, `.proj-card`, `.statement`, `.curtain`.
- `src/lib/capability.ts`, device tiers. Tier C (no WebGL, reduced motion, Save-Data, or a
  2G/3G connection) never downloads Three.js at all and gets a pure-CSS lattice instead.
- `src/three/`, the **lattice**: a 3D grid of emerald struts with gold joint nodes that fills
  the hero's media layer, and disperses from a compact block into a wide flat field over the
  hero's own scroll. It replaces the reference's hero photograph, which Zyflo has no equivalent
  of. Fog is matched to the hero's ink so far struts *dissolve* rather than dim.

### Five details worth not undoing

- **`useHashLanding` refreshes ScrollTrigger BEFORE it measures.** The Services gallery is
  pinned, and a pin does not exist as layout until ScrollTrigger builds its spacer, which adds
  several thousand pixels to the document. Measuring first dropped every deep link
  (`/#work`, `/#about`, …) into blank space.
- **The nav is monochrome on purpose.** Under `mix-blend-difference` a colour is not a colour, it
  is whatever the compositor makes of it, the gold wordmark accent inverted to flat blue over
  the cream sections. The two halves of the wordmark are distinguished by type instead.
- **The Services gallery has a real reduced-motion layout.** A pinned section that only advances
  by horizontal tweening is a trap for anyone who asked for less motion, so the pin is skipped in
  JS and the same markup reflows into a vertical grid.
- **`.word-reveal` caches its source text** on the node. React StrictMode mounts effects twice in
  development; without the cache the second pass re-reads its own wrapped markup and nests a
  second layer of spans.
- **Tailwind was removed.** Nothing in `src/` used a single utility class, and its baseline
  emission was ~48 KB of the CSS bundle. Everything is hand-written CSS.

## Performance

| | gzipped |
|---|---|
| Initial JS (React + GSAP + app) | **~136 KB** |
| Lenis (deferred, motion-enabled only) | ~6 KB |
| CSS | ~7 KB |
| Three.js (deferred, tier A/B only) | ~233 KB |

The hero headline is real text and renders immediately, it never waits on WebGL.

## Note on `zealousinterior-main/`

That folder is the design reference, not part of the build, nothing in `src/` imports from it
and Vite never sees it. It is currently untracked; add it to `.gitignore` or move it out of the
project if you'd rather it not end up in the repo.
