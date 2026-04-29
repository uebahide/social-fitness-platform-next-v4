import { expect, Page } from "@playwright/test";

export async function getFriendRow(page: Page, displayName: string) {
  await page.goto("/friend/friend-list");

  const friendRow = page
    .locator("li")
    .filter({ has: page.getByText(displayName, { exact: true }) })
    .first();

  await expect(friendRow).toBeVisible();
  return friendRow;
}

export async function getRequiredHref(
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

import fs from "node:fs";
import path from "node:path";

type ResolvedScenario = {
  actorProfileId: number;
  friendProfileId: number | null;
  roomId: number | null;
  messageIds: number[];
};

/**
 * @see tests/e2e/generated/scenario-manifest.json
 */

type ScenarioManifest = Record<string, ResolvedScenario>;

let cachedManifest: ScenarioManifest | null = null;

function loadManifest(): ScenarioManifest {
  if (cachedManifest) {
    return cachedManifest;
  }

  const manifestPath = path.join(
    process.cwd(),
    "tests/e2e/generated/scenario-manifest.json",
  );

  const raw = fs.readFileSync(manifestPath, "utf8");
  cachedManifest = JSON.parse(raw) as ScenarioManifest;
  return cachedManifest;
}

export function getResolvedScenario(key: string): ResolvedScenario {
  const manifest = loadManifest();
  const scenario = manifest[key];

  if (!scenario) {
    throw new Error(`Scenario not found in manifest: ${key}`);
  }

  return scenario;
}
