import { expect, test } from "@playwright/test";

test("calculator renders the three role banners and persists controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Fantasy 2026" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Title", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CORE" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "MID" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SUPPORT" })).toBeVisible();
  await expect(page.getByRole("link", { name: "thx for guide" })).toHaveAttribute("href", /fantasy_league_2026_guide/);
  await expect(page.getByRole("button", { name: "All except quals" })).toHaveClass(/is-active/);
  await expect(page.locator(".tournament-chip", { hasText: "FISSURE 8 Open Qual" })).toHaveCount(0);
  await expect(page.locator('.tournament-chip[data-kind="qualifier"] input').first()).not.toBeChecked();
  await expect(page.locator(".role-banner.core .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.mid .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.support .candidate-name").first()).not.toContainText("&");
  await expect(page.locator(".role-banner.mid .banner-foot")).not.toContainText("0 matches");

  const prefix = page.locator('[data-action="set-prefix"]');
  const suffix = page.locator('[data-action="set-suffix"]');
  await prefix.selectOption("crimson");
  await suffix.selectOption("lucky");
  await page.locator('.tournament-chip[data-kind="main"]').first().click();
  await page.reload();
  await expect(prefix).toHaveValue("crimson");
  await expect(suffix).toHaveValue("lucky");
  await expect(page.locator('.tournament-chip[data-kind="main"] input').first()).not.toBeChecked();

  const scrollAfterToggle = await page.locator(".tournament-strip").evaluate((strip) => {
    strip.scrollLeft = 280;
    const input = strip.querySelector('.tournament-chip[data-kind="main"] input') as HTMLInputElement | null;
    input?.click();
    return document.querySelector(".tournament-strip")?.scrollLeft ?? -1;
  });
  expect(scrollAfterToggle).toBeGreaterThan(0);
});
