import { test, expect } from "@playwright/test";

test("activity found", async ({ page }) => {
  await page.goto("/activity");
  await expect(page.getByTestId("activity-title")).toBeVisible();
});

test("activity error", async ({ page }) => {
  await page.goto("/activity?forceError=1");
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});
