import { defineConfig, devices } from "@playwright/test";

/**
 * Authenticated flows need a real Supabase user — set PLAYWRIGHT_TEST_EMAIL /
 * PLAYWRIGHT_TEST_PASSWORD to credentials for a throwaway (or your own,
 * since this is single-user) account. Without them, e2e/auth.setup.ts skips
 * and every test in the "authenticated" project skips with it — only
 * e2e/login.spec.ts (which needs no session) still runs.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "unauthenticated",
      testMatch: /login\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authenticated",
      testMatch: /(journal|prep|calendar|analytics)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
