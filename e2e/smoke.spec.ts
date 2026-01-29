import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/./);
});

test("products page loads", async ({ page }) => {
  await page.goto("/category/women");
  await expect(page).toHaveURL(/category/);
});
