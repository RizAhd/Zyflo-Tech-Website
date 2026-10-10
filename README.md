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

## Pages

Six pages, each a real file in `dist/` with its own title, description, canonical and structured
data, so search engines and AI crawlers read each one without running JavaScript:

| URL | Page |
|---|---|
| `/` | Home |
| `/services/` | Services (tabs, capabilities) |
| `/process/` | How a project runs |
| `/work/` | Selected work |
| `/about/` | The studio |
| `/contact/` | Contact form and FAQ |

The page list, titles and descriptions live in `pages[]` in `src/data/site.config.ts`. Adding a page
means: an entry in `pages[]`, a file in `src/pages/`, a line in the `ROUTES` table in `src/App.tsx`,
and (for the nav) an entry in `navLinks[]`. The build then writes the HTML file, the sitemap entry and
the `llms.txt` line. Navigation between pages runs in the browser (`src/router.tsx`) with no reload,
and old links such as `/#process` redirect to the matching page.

## Deploy

The build is fully static. Pages are written to `dist/<page>/index.html`, so the host must serve
`/services/` from that folder, which GitHub Pages, Cloudflare and Vercel all do. Assets use absolute
paths (`/assets/...`); the GitHub Pages preview, which lives under `/<repo>/`, sets `BASE_PATH` in its
workflow so those paths gain the prefix. The plan is three steps, in this order.

**1. GitHub Pages (first, for a live preview)**
1. Repo Settings, Pages, Source: **GitHub Actions**.
2. Push to `main`. `.github/workflows/deploy.yml` builds and publishes to
   `https://rizahd.github.io/Zyflo-Tech-Website/`. The canonical link, sitemap and structured data
   use that address automatically.

**2. Cloudflare Pages**
1. Cloudflare dashboard, Workers and Pages, Create, Pages, connect the GitHub repo.
2. Build command `npm run build`, output directory `dist`, framework preset none.
3. Security and caching headers come from `public/_headers`.

**3. Namecheap domain**
1. Add the domain to Cloudflare (free plan) and copy the two nameservers Cloudflare gives you.
2. In Namecheap, Domain List, Manage, Nameservers, choose Custom DNS and paste them in.
3. In Cloudflare Pages, Custom domains, add the domain (and `www`).
4. Tell the build the real address so SEO switches over: add a repository variable `SITE_URL`
   (GitHub, Settings, Secrets and variables, Actions, Variables) for the GitHub build, and an
   environment variable `SITE_URL` in the Cloudflare Pages project. Use `https://your-domain`.
5. Redeploy, then in Google Search Console add the domain and submit `/sitemap.xml`. Claim the
   business on Google Business Profile.

Any other static host works the same way: run `SITE_URL=https://your-domain npm run build` and upload
`dist/`.

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
