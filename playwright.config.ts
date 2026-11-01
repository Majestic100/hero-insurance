import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const isCI = Boolean(process.env.CI);

/**
 * End-to-end tests of the quote flow against a production build.
 * POST /api/leads is mocked in the tests, so they never write to a
 * database and need no secrets (CI runs without Supabase keys).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "da-DK",
    trace: "retain-on-failure",
  },
  projects: [
    // Mobile first: 375px wide, touch, as in CLAUDE.md rule 5.
    { name: "mobile", use: { ...devices["iPhone SE"], browserName: "chromium" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // CI builds in an earlier step; locally build first.
    command: isCI
      ? `npm run start -- --port ${PORT}`
      : `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 240_000,
  },
});
