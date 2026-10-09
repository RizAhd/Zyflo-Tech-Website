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

| What | Where | Status |
|---|---|---|
| WhatsApp number | `contact.whatsapp` | Set |
| Business email | `contact.email` | Set |
| Phone | `contact.phone` | Set |
| Social links | `socials[]` | Still `TODO_`, hidden until filled |
| Contact form key | `contact.web3formsKey` | Optional, see below |
| Site URL | `business.url` | Optional, see below |

Any value still set to `TODO_` is hidden automatically. Fill a value in and its UI appears on its own.

**Contact form.** With no `web3formsKey` the form still works: pressing send opens WhatsApp with the
enquiry already written out. Add a free key from [web3forms.com](https://web3forms.com) if you would
rather have enquiries land in your inbox without leaving the page.

**Site URL.** The canonical link, Open Graph URLs, `sitemap.xml`, the `Sitemap:` line in `robots.txt`
and the structured data all need the public address. The build finds it by itself, in this order:
`business.url` in `site.config.ts`, a `SITE_URL` environment variable, then the production URL that
Vercel or Netlify report during the build. So the first deploy is already correct, and when you
attach a custom domain, set `SITE_URL` (or `business.url`) to it and redeploy.

Work cards come from `projects[]` and the "Shipped for" list from `clients[]`. Only add an entry
once the project is live.

## Deploy

The build is fully static, so `dist/` works as-is on:

- **Vercel, Netlify or Cloudflare Pages**: import the GitHub repo, build command `npm run build`,
  publish directory `dist`. Security and caching headers are already set in `vercel.json` and
  `public/_headers`.
- **cPanel or any FTP host**: run `SITE_URL=https://your-domain npm run build` and upload the contents
  of `dist/` to `public_html`

After it is live: add the site to Google Search Console, submit `https://your-domain/sitemap.xml`, and
claim the business on Google Business Profile.

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
