import { test, expect } from "@playwright/test";

test("message page", async ({ page }) => {
  await page.goto("/message");
  await expect(page.getByTestId("message-sidebar")).toBeVisible();
  await expect(page.getByTestId("message-panel")).toBeVisible();
});

test("message error", async ({ page }) => {
  await page.goto("/message?forceError=1");
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});

test("message empty conversation state", async ({ page }) => {
  await page.goto("/message?friendId=2");
  await expect(
    page.getByTestId("message-empty-conversation-state"),
  ).toBeVisible();
});
