import { defineConfig } from '@playwright/test'

/*
  End to end checks that run against the production build, the same files that
  get deployed. Uses the Chrome already installed on the machine (and on GitHub's
  runners), so there is no browser download.
*/
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  // One retry on CI: an animation finishing a frame late should not block a deploy.
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    channel: 'chrome',
    headless: true,
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
