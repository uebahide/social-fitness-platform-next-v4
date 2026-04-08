import { expect, Page } from "@playwright/test";

async function getFriendRow(page: Page, displayName: string) {
  await page.goto("/friend/friend-list");

  const friendRow = page
    .locator("li")
    .filter({ has: page.getByText(displayName, { exact: true }) })
    .first();

  await expect(friendRow).toBeVisible();
  return friendRow;
}

async function getRequiredHref(
  page: Page,
  displayName: string,
  linkIndex: number,
  queryParams?: Record<string, string>,
) {
  const friendRow = await getFriendRow(page, displayName);
  let href = await friendRow.locator("a").nth(linkIndex).getAttribute("href");

  if (!href) {
    throw new Error(`Could not resolve href for ${displayName}`);
  }

  if (queryParams) {
    const separator = href.includes("?") ? "&" : "?";
    href += separator + new URLSearchParams(queryParams).toString();
  }

  return href;
}

export async function getFriendProfileHref(page: Page, displayName: string) {
  return getRequiredHref(page, displayName, 0);
}

export async function getFriendMessageHref(
  page: Page,
  displayName: string,
  queryParams?: Record<string, string>,
) {
  return getRequiredHref(page, displayName, 1, queryParams);
}
