# Zyflo Tech, Website

The marketing site for Zyflo Tech. Vite, React, TypeScript, Tailwind CSS v4, GSAP and framer-motion.

Fonts (Inter and Instrument Sans) are self-hosted, every library is bundled, and there is no CDN,
no analytics and no third-party embed. The only network call the site makes is the contact-form
POST when a visitor submits it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serve the production build locally
```

## Before you launch, fill in your details

Everything a human needs to change lives in one file: [src/data/site.config.ts](src/data/site.config.ts).
Search it for `TODO_` and replace each one.

| What | Where | Notes |
|---|---|---|
| WhatsApp number | `contact.whatsapp` | Digits only, with country code, e.g. `94771234567` |
| Business email | `contact.email` | |
| Phone | `contact.phone` | Human-readable, e.g. `+94 77 123 4567` |
| Social links | `socials[]` | Facebook, Instagram, LinkedIn, GitHub |
| Contact form key | `contact.web3formsKey` | Free key from [web3forms.com](https://web3forms.com) |
| Site URL | `business.url` | Once you pick a domain |

Any value still set to `TODO_` is hidden automatically: the WhatsApp button does not render, empty
footer columns disappear, and the form shows direct contact links instead of a form that would
silently fail. Fill a value in and its UI appears on its own.

Work cards come from `projects[]` and the "Shipped for" list from `clients[]`. Only add an entry
once the project is live.

## Deploy

The build is fully static, so `dist/` works as-is on:

- **Vercel, Netlify or Cloudflare Pages**: build command `npm run build`, publish directory `dist`
- **cPanel or any FTP host**: upload the contents of `dist/` to `public_html`

## SEO, GEO and AEO

Generated at build time from `site.config.ts` by the `zyflo-seo` plugin in `vite.config.ts`, so the
metadata cannot drift from the page copy: title, description, Open Graph, JSON-LD (business, all
seven services, FAQ), `llms.txt`, `robots.txt`, the web manifest and, once `business.url` is set,
the canonical link and `sitemap.xml`. A readable copy of the page also sits inside `#root` for
crawlers that do not run JavaScript. It is clipped out of sight, and shown normally if JavaScript is off.

## Motion

The site honours `prefers-reduced-motion`, so a visitor who asked their OS for less movement gets a
still page. On `localhost` and LAN addresses animation is forced on for review. On a real domain, add
`?motion=on` to preview it (`?motion=off` clears it).
