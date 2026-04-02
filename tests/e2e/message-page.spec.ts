import { test, expect } from "@playwright/test";
import { getFriendMessageHref } from "./helpers/seededFriendRoutes";

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
  const messageHref = await getFriendMessageHref(page, "Alex Walker");
  await page.goto(messageHref);
  await expect(
    page.getByTestId("message-empty-conversation-state"),
  ).toBeVisible();
});
