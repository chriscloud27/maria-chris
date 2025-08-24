import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'test', // Tell Playwright where to find the tests
  webServer: {
    command: 'next build && next start -p 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  use: {
    baseURL: 'http://localhost:3000', // Your app's base URL
    trace: 'on-first-retry',
  },
});
