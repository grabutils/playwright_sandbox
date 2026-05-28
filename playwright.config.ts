import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./reporters/extent-style-reporter.ts', { outputFile: 'extent-report/index.html' }],
  ],
  use: {
    baseURL: process.env.APP_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /saucedemo-checkout\/.*\.spec\.ts/,
    },
  ],
});
