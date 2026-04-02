import { expect, test } from "@playwright/test";

test("friend search idle state", async ({ page }) => {
  await page.goto("/friend/search");
  await expect(page.getByTestId("friend-search-guide-panel")).toBeVisible();
  await expect(page.getByTestId("friend-search-search-input")).toBeVisible();
  await expect(page.getByTestId("friend-search-idle-state")).toBeVisible();
});
test("friend search empty state", async ({ page }) => {
  await page.goto("/friend/search");
  await expect(page.getByTestId("friend-search-guide-panel")).toBeVisible();
  await expect(page.getByTestId("friend-search-search-input")).toBeVisible();
  await page.getByTestId("friend-search-search-input").fill("nonexistent");
  await expect(page.getByTestId("friend-search-empty-state")).toBeVisible();
});
test("friend search error state", async ({ page }) => {
  await page.goto("/friend/search?forceError=1");
  await expect(page.getByTestId("friend-search-guide-panel")).toBeVisible();
  await expect(page.getByTestId("friend-search-search-input")).toBeVisible();
  await page.getByTestId("friend-search-search-input").fill("a");
  await expect(page.getByTestId("friend-search-error-state")).toBeVisible();
});
test("friend search result", async ({ page }) => {
  await page.goto("/friend/search");
  await expect(page.getByTestId("friend-search-guide-panel")).toBeVisible();
  await expect(page.getByTestId("friend-search-search-input")).toBeVisible();
  await page.getByTestId("friend-search-search-input").fill("a");
  await expect(page.getByTestId("friend-search-result-0")).toBeVisible();
});
