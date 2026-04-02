import { test, expect } from "@playwright/test";
import { getFriendProfileHref } from "./helpers/seededFriendRoutes";

test("profile not found", async ({ page }) => {
  await page.goto("/profile/1000");
  await expect(page.getByTestId("not-found-title")).toBeVisible();
});

test("profile found", async ({ page }) => {
  const profileHref = await getFriendProfileHref(page, "Alex Walker");
  await page.goto(profileHref);
  await expect(page.getByTestId("user-display-name")).toBeVisible();
});

test("profile error", async ({ page }) => {
  const profileHref = await getFriendProfileHref(page, "Alex Walker");
  await page.goto(`${profileHref}?forceError=1`);
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});
