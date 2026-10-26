import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const CI = !!process.env.CI;
const API_URL = 'http://localhost:3001';
const APP_URL = 'http://localhost:5173';

// Gherkin feature files are compiled into Playwright specs in .features-gen/ by `bddgen`.
const bddTestDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'tests/fixtures.ts'],
});

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'], baseURL: APP_URL },
    },
    {
      name: 'api',
      testDir: 'tests/api',
      use: { baseURL: API_URL },
    },
  ],
  webServer: [
    { command: 'npm run api', url: `${API_URL}/api/health`, reuseExistingServer: !CI, timeout: 30_000 },
    { command: 'npm run app', url: APP_URL, reuseExistingServer: !CI, timeout: 60_000 },
  ],
});
