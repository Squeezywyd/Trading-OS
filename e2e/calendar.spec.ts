import { test, expect } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_TEST_EMAIL,
  "Set PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD to run authenticated e2e tests.",
);

test("calendar renders the current month grid and navigates", async ({ page }) => {
  await page.goto("/calendar");

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  await expect(page.getByRole("heading", { name: monthLabel })).toBeVisible();

  await page.getByRole("button", { name: "Next month" }).click();
  await expect(page.getByRole("heading", { name: monthLabel })).not.toBeVisible();

  await page.getByRole("button", { name: "Previous month" }).click();
  await expect(page.getByRole("heading", { name: monthLabel })).toBeVisible();
});
