import { expect, test } from "@playwright/test";

test("calculator renders the three role banners and persists controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Fantasy 2026" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Title", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CORE" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "MID" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SUPPORT" })).toBeVisible();
  await expect(page.getByRole("link", { name: "thx for guide" })).toHaveAttribute("href", /fantasy_league_2026_guide/);
  await expect(page.locator(".role-banner.core .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.mid .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.support .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.mid .banner-foot")).not.toContainText("0 matches");

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
