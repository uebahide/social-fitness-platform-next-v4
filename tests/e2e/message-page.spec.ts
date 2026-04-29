import { test, expect, Page } from "@playwright/test";
import path from "path";
import { getResolvedScenario } from "./helpers/seededFriendRoutes";

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
  const scenario = getResolvedScenario("message.empty_conversation");
  await page.goto(`/message?friendId=${scenario.friendProfileId}`);
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

  test("text message optimistic pending & success", async ({ page }) => {
    const scenario = getResolvedScenario("message.with_text_history");
    await page.goto(`/message?friendId=${scenario.friendProfileId}`);

    await expect(page.getByTestId("message-textarea")).toBeVisible();
    await page.getByTestId("message-textarea").fill("Hello text success");

    const lastGroup = await submitAndGetLastOwnMessageGroup(page);

    await expect(lastGroup.getByTestId("message-pending-text")).toBeVisible();
    await expect(lastGroup.getByTestId("message-pending-text")).not.toBeVisible(
      {
        timeout: 10000,
      },
    );
    await expect(
      lastGroup.getByTestId("message-failed-text"),
    ).not.toBeVisible();
  });

  test("text message optimistic failure", async ({ page }) => {
    const scenario = getResolvedScenario("message.with_text_history");
    await page.goto(
      `/message?friendId=${scenario.friendProfileId}&forceSendFailure=1`,
    );

    await expect(page.getByTestId("message-textarea")).toBeVisible();
    await page.getByTestId("message-textarea").fill("Hello text failure");

    const lastGroup = await submitAndGetLastOwnMessageGroup(page);

    await expect(lastGroup.getByTestId("message-pending-text")).not.toBeVisible(
      {
        timeout: 10000,
      },
    );
    await expect(lastGroup.getByTestId("message-failed-text")).toBeVisible();
  });

  test("image optimistic pending", async ({ page }) => {
    const scenario = getResolvedScenario("message.with_text_history");
    await page.goto(`/message?friendId=${scenario.friendProfileId}`);

    await page
      .getByTestId("images-input")
      .setInputFiles([
        path.join(process.cwd(), "tests/fixtures/test-image.png"),
      ]);

    const lastGroup = await submitAndGetLastOwnMessageGroup(page);

    await expect(lastGroup.getByTestId("message-pending-text")).toBeVisible();
    await expect(lastGroup.getByTestId("message-pending-text")).not.toBeVisible(
      {
        timeout: 10000,
      },
    );
    await expect(
      lastGroup.getByTestId("message-failed-text"),
    ).not.toBeVisible();
  });
});
