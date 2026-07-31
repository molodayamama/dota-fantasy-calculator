import { expect, test } from "@playwright/test";

test("calculator renders the three role banners and persists controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Fantasy 2026" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Титул" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ОСНОВА" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ЦЕНТР" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ПОДДЕРЖКА" })).toBeVisible();

  const prefix = page.locator('[data-action="set-prefix"]');
  const suffix = page.locator('[data-action="set-suffix"]');
  await prefix.selectOption("crimson");
  await suffix.selectOption("lucky");
  await page.locator(".tournament-chip").first().click();
  await page.reload();
  await expect(prefix).toHaveValue("crimson");
  await expect(suffix).toHaveValue("lucky");
  await expect(page.locator('[data-action="toggle-tournament"]').first()).not.toBeChecked();
});
