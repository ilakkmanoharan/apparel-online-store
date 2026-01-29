import { test, expect } from "@playwright/test";

test("checkout page loads", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/checkout/);
});
