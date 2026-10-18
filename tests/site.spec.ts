import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/*
  What must stay true on every page, whatever else changes: it loads, it has
  one h1, its own title and canonical, valid structured data, no console
  errors, no sideways scroll, and no serious accessibility violation.
*/

const ORIGIN = 'https://zyflo.tech'
const PAGES = [
  { path: '/', canonical: `${ORIGIN}/` },
  { path: '/services/', canonical: `${ORIGIN}/services/` },
  { path: '/process/', canonical: `${ORIGIN}/process/` },
  { path: '/work/', canonical: `${ORIGIN}/work/` },
  { path: '/about/', canonical: `${ORIGIN}/about/` },
  { path: '/contact/', canonical: `${ORIGIN}/contact/` },
]

/** Collects anything the page logs as an error or throws. */
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  return errors
}

for (const { path, canonical } of PAGES) {
  test.describe(path, () => {
    test('loads with its own head, one h1 and valid structured data', async ({ page }) => {
      const errors = watchErrors(page)
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)

      await expect(page.locator('main h1')).toHaveCount(1)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(20)
      expect(title.length).toBeLessThanOrEqual(70)
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', canonical)
      await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /.{60,}/)

      const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
      expect(ld.length).toBeGreaterThan(0)
      for (const block of ld) expect(() => JSON.parse(block)).not.toThrow()

      expect(errors).toEqual([])
    })

    for (const size of [
      { name: 'phone', width: 390, height: 844 },
      { name: 'laptop', width: 1366, height: 768 },
    ]) {
      test(`no sideways scroll on a ${size.name}`, async ({ page }) => {
        await page.setViewportSize(size)
        await page.goto(path)
        await page.waitForSelector('main h1')
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        )
        expect(overflow).toBe(false)
      })
    }

    // Motion off gives a stable, fully drawn page, so contrast is measured on
    // the final colours and not on a frame in the middle of a fade.
    test('has no serious accessibility violations', async ({ page }) => {
      await page.goto(`${path}?motion=off`)
      await page.waitForSelector('main h1')
      await page.waitForTimeout(800)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(
        bad.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`),
      ).toEqual([])
    })
  })
}

// House style: no em or en dashes anywhere a visitor or a search engine reads.
test('no em or en dashes on any page', async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path)
    await page.waitForSelector('main h1')
    const text = [
      await page.title(),
      await page.locator('meta[name=description]').getAttribute('content'),
      await page.locator('body').innerText(),
    ].join('\n')
    expect(text, path).not.toMatch(/[–—]/)
  }
})

// Motion is always on: not switched off by the operating system, not by a setting
// saved by the old footer button, and there is no button to do it.
test('motion is always on and has no switch', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => localStorage.setItem('zyflo-motion', 'off'))
  await page.goto('/')
  await page.waitForSelector('main h1')
  await expect(page.locator('html')).toHaveAttribute('data-force-motion', '')
  expect(await page.evaluate(() => localStorage.getItem('zyflo-motion'))).toBeNull()
  await page.locator('footer').waitFor({ state: 'attached' })
  await expect(page.getByRole('button', { name: /motion/i })).toHaveCount(0)
  await expect(page.locator('footer')).not.toContainText(/motion:/i)
})

test('titles are unique across pages', async ({ page }) => {
  const titles = new Set<string>()
  for (const { path } of PAGES) {
    await page.goto(path)
    titles.add(await page.title())
  }
  expect(titles.size).toBe(PAGES.length)
})

test('navigating in the app updates the page, title and canonical', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/')
  for (const { path, canonical } of PAGES.slice(1)) {
    await page.locator('nav[aria-label=Primary]').getByRole('link').and(page.locator(`[href$="${path}"]`)).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', canonical)
  }
  expect(errors).toEqual([])
})

test('an old anchor link redirects to its page', async ({ page }) => {
  await page.goto('/#process')
  await expect(page).toHaveURL(/\/process\/$/)
})

test('a service link scrolls to that service', async ({ page }) => {
  await page.goto('/services/#service-ai')
  await expect(page.locator('#service-ai h2')).toBeInViewport()
})

test('each service is described once on the services page', async ({ page }) => {
  await page.goto('/services/')
  await page.waitForSelector('main h1')
  for (const id of ['web', 'software', 'mobile', 'ai', 'video', 'marketing', 'social']) {
    await expect(page.locator(`#service-${id}`)).toHaveCount(1)
  }
  // The first promise appears once in the page text, not in a list and again in a band.
  const text = await page.locator('main').innerText()
  expect(text.split('A fast, findable website').length - 1).toBe(1)
})
