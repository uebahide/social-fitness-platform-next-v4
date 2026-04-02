import { test, expect } from "@playwright/test";

test("friend list page", async ({ page }) => {
  await page.goto("/friend/friend-list");
  await expect(page.getByTestId("friend-list-guide-panel")).toBeVisible();
});

test("friend list error", async ({ page }) => {
  await page.goto("/friend/friend-list?forceError=1");
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});

test.describe("friend list with empty friends", () => {
  test.use({
    storageState: "tests/e2e/playwright/.auth/user-empty-friends.json",
  });

  test("friend list empty friends state", async ({ page }) => {
    await page.goto("/friend/friend-list");
    await expect(
      page.getByTestId("friend-list-empty-friends-state"),
    ).toBeVisible();
  });

  test("friend list empty requests", async ({ page }) => {
    await page.goto("/friend/friend-list");
    await page.getByTestId("friend-list-and-request-toggle-request").click();
    await expect(
      page.getByTestId("friend-list-empty-requests-state"),
    ).toBeVisible();
  });
});
