import { test, expect, Page } from "@playwright/test";
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

const getOwnMessageGroups = (page: Page) => page.getByTestId("message-group");

const submitAndGetLastOwnMessageGroup = async (page: Page) => {
  const groups = getOwnMessageGroups(page);

  await expect(groups.first()).toBeVisible({ timeout: 10000 });
  const beforeCount = await groups.count();

  await page.getByTestId("message-submit-button").click();
  await expect(groups).toHaveCount(beforeCount + 1, { timeout: 10000 });

  return groups.nth(beforeCount);
};

test.describe("message optimistic flows", () => {
  test.describe.configure({ mode: "serial" });

  //text message optimistic pending & success
  test("text message optimistic pending & success", async ({ page }) => {
    const messageHref = await getFriendMessageHref(page, "Alex Walker");
    await page.goto(messageHref);
    await expect(page.getByTestId("message-textarea")).toBeVisible();
    await page.getByTestId("message-textarea").fill("Hello text success");
    const lastGroup = await submitAndGetLastOwnMessageGroup(page);
    // start pending
    await expect(lastGroup.getByTestId("message-pending-text")).toBeVisible();
    //success
    await expect(lastGroup.getByTestId("message-pending-text")).not.toBeVisible(
      {
        timeout: 10000,
      },
    );
    await expect(
      lastGroup.getByTestId("message-failed-text"),
    ).not.toBeVisible();
  });

  //text message optimistic failure
  test("text message optimistic failure", async ({ page }) => {
    const messageHref = await getFriendMessageHref(page, "Alex Walker", {
      forceSendFailure: "1",
    });
    await page.goto(messageHref);
    await expect(page.getByTestId("message-textarea")).toBeVisible();
    await page.getByTestId("message-textarea").fill("Hello text failure");
    const lastGroup = await submitAndGetLastOwnMessageGroup(page);
    // failure
    await expect(
      lastGroup.getByTestId("message-pending-text"),
    ).not.toBeVisible({
      timeout: 10000,
    });
    await expect(lastGroup.getByTestId("message-failed-text")).toBeVisible();
  });

  //image message optimistic pending & success
  test("image optimistic pending", async ({ page }) => {
    const messageHref = await getFriendMessageHref(page, "Alex Walker");
    await page.goto(messageHref);
    await page
      .getByTestId("images-input")
      .setInputFiles([
        path.join(process.cwd(), "tests/fixtures/test-image.png"),
      ]);
    const lastGroup = await submitAndGetLastOwnMessageGroup(page);
    // start pending
    await expect(lastGroup.getByTestId("message-pending-text")).toBeVisible();
    //success
    await expect(lastGroup.getByTestId("message-pending-text")).not.toBeVisible(
      {
        timeout: 10000,
      },
    );
    await expect(
      lastGroup.getByTestId("message-failed-text"),
    ).not.toBeVisible();
  });

  //image message optimistic failure
  test("image optimistic failure", async ({ page }) => {
    const messageHref = await getFriendMessageHref(page, "Alex Walker", {
      forceSendFailure: "1",
    });
    await page.goto(messageHref);
    await page
      .getByTestId("images-input")
      .setInputFiles([
        path.join(process.cwd(), "tests/fixtures/test-image.png"),
      ]);
    const lastGroup = await submitAndGetLastOwnMessageGroup(page);
    // start pending
    await expect(
      lastGroup.getByTestId("message-pending-text"),
    ).not.toBeVisible({
      timeout: 10000,
    });
    //failed
    await expect(
      lastGroup.getByTestId("message-failed-image-bubble"),
    ).toBeVisible();
    await expect(lastGroup.getByTestId("message-failed-text")).toBeVisible();
  });
});
