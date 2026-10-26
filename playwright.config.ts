import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, 'env', '.env');
const envResult = dotenv.config({ path: envPath, quiet: true });
if (envResult.error) {
  throw new Error(`Could not load environment file at ${envPath}: ${envResult.error.message}`);
}

if (!process.env.PLAYWRIGHT_ENV_LOGGED) {
  const count = Object.keys(envResult.parsed ?? {}).length;
  console.log(`Loaded ${count} settings from env/.env`);
  process.env.PLAYWRIGHT_ENV_LOGGED = '1';
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    trace: 'on',
    testIdAttribute: 'data-test',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

});
