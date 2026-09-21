import { test, expect } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_TEST_EMAIL,
  "Set PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD to run authenticated e2e tests.",
);

test("logging a trade appears in the journal table", async ({ page }) => {
  const title = `E2E smoke trade ${Date.now()}`;

  await page.goto("/journal/new");
  await page.getByLabel("Trade title").fill(title);
  await page.getByRole("button", { name: "Log trade" }).click();

  await page.waitForURL("/journal");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
});
