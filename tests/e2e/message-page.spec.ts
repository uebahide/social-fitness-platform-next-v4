import { test, expect } from "@playwright/test";
import { getFriendMessageHref } from "./helpers/seededFriendRoutes";
import path from "path";

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
  const messageHref = await getFriendMessageHref(page, "Empty Messages");
  await page.goto(messageHref);
  await expect(
    page.getByTestId("message-empty-conversation-state"),
  ).toBeVisible();
});

//optimistic message check

//text message optimistic pending & success
test("text message optimistic pending & success", async ({ page }) => {
  const messageHref = await getFriendMessageHref(page, "Alex Walker");
  await page.goto(messageHref);
  await expect(page.getByTestId("message-textarea")).toBeVisible();
  await page.getByTestId("message-textarea").fill("Hello");
  await page.getByTestId("message-submit-button").click();
  // start pending
  await expect(page.getByTestId("message-pending-text")).toBeVisible();
  //success
  await expect(page.getByTestId("message-pending-text")).not.toBeVisible();
  await expect(page.getByTestId("message-failed-text")).not.toBeVisible();
});
//text message optimistic failure
test("text message optimistic failure", async ({ page }) => {
  const messageHref = await getFriendMessageHref(page, "Alex Walker", {
    forceSendFailure: "1",
  });
  await page.goto(messageHref);
  await expect(page.getByTestId("message-textarea")).toBeVisible();
  await page.getByTestId("message-textarea").fill("Hello");
  await page.getByTestId("message-submit-button").click();
  // failure
  await expect(page.getByTestId("message-pending-text")).not.toBeVisible();
  await expect(page.getByTestId("message-failed-text")).toBeVisible();
});
//image message optimistic pending & success
test("image optimistic pending", async ({ page }) => {
  const messageHref = await getFriendMessageHref(page, "Alex Walker");
  await page.goto(messageHref);
  await page
    .getByTestId("images-input")
    .setInputFiles([path.join(process.cwd(), "tests/fixtures/test-image.png")]);
  await page.getByTestId("message-submit-button").click();
  // start pending
  await expect(page.getByTestId("message-pending-text")).toBeVisible();
  //success
  await expect(page.getByTestId("message-pending-text")).not.toBeVisible();
  await expect(page.getByTestId("message-failed-text")).not.toBeVisible();
});
//image message optimistic failure
test("image optimistic failure", async ({ page }) => {
  const messageHref = await getFriendMessageHref(page, "Alex Walker", {
    forceSendFailure: "1",
  });
  await page.goto(messageHref);
  await page
    .getByTestId("images-input")
    .setInputFiles([path.join(process.cwd(), "tests/fixtures/test-image.png")]);
  await page.getByTestId("message-submit-button").click();
  // start pending
  await expect(page.getByTestId("message-pending-text")).not.toBeVisible();
  //failed
  await expect(page.getByTestId("message-failed-image-bubble")).toBeVisible();
  await expect(page.getByTestId("message-failed-text")).toBeVisible();
});
