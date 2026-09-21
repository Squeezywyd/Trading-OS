import { test, expect } from "@playwright/test";

test.describe("login and route protection", () => {
  test("visiting a protected route while signed out redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    expect(new URL(page.url()).pathname).toBe("/login");
  });

  test("login page renders both password and magic-link modes", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Trading OS" })).toBeVisible();

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

    await page.getByRole("button", { name: "Magic Link" }).click();
    await expect(page.getByRole("button", { name: "Send magic link" })).toBeVisible();
  });

  test("submitting bad credentials shows an inline error, not a crash", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/invalid|error/i)).toBeVisible({ timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe("/login");
  });
});
