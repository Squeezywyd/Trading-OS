import { test, expect } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_TEST_EMAIL,
  "Set PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD to run authenticated e2e tests.",
);

test("today's prep form saves the game plan", async ({ page }) => {
  const gamePlan = `E2E smoke plan ${Date.now()}`;

  await page.goto("/prep");
  await page.getByLabel("Game plan").fill(gamePlan);
  await page.getByRole("button", { name: "Save prep" }).click();

  await expect(page.getByText(/prep saved/i)).toBeVisible({ timeout: 10_000 });
  await page.reload();
  await expect(page.getByLabel("Game plan")).toHaveValue(gamePlan);
});

test("Bias Wizard applies a call back to the Daily Bias select", async ({ page }) => {
  await page.goto("/prep");
  await page.getByRole("button", { name: "Bias Wizard" }).click();
  await page.getByRole("button", { name: "Bullish" }).first().click();
  await page.getByRole("button", { name: "Apply to prep" }).click();

  await expect(page.getByText("Bullish")).toBeVisible();
});
