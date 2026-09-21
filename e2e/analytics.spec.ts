import { test, expect } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_TEST_EMAIL,
  "Set PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD to run authenticated e2e tests.",
);

test("analytics page loads with dimension tabs", async ({ page }) => {
  await page.goto("/analytics");

  await expect(page.getByRole("heading", { name: "Analytics" })).toBeVisible();
  // Either the empty state (no trades) or the tab bar renders — both are
  // valid depending on what's in the test account, so assert on whichever
  // one the page actually shows.
  const emptyState = page.getByText("Nothing to analyze yet");
  const sessionTab = page.getByRole("tab", { name: "Session" });
  await expect(emptyState.or(sessionTab)).toBeVisible();
});

test("dashboard loads with the date range control", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("button", { name: "30D" })).toBeVisible();
});
