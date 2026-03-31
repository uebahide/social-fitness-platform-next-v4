import { test, expect } from "@playwright/test";

test("friend list page", async ({ page }) => {
  await page.goto("/friend/friend-list");
  await expect(page.getByTestId("friend-list-description")).toBeVisible();
});

test("friend list error", async ({ page }) => {
  await page.goto("/friend/friend-list?forceError=1");
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});
