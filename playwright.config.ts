import { defineConfig } from "@playwright/test";

const port = 3456;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: `http://127.0.0.1:${port}` },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "narrow", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx next build && npx next start -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ROLE_CLOCK: "2027-01-17T04:00:00.000Z",
      // No role has a close date of its own yet, so close every USA role for the browser checks.
      ROLE_CLOSE_DATES: "region:usa=2027-01-16",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3456",
    },
  },
});
