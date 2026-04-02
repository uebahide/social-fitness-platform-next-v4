import { test, expect } from "@playwright/test";

test("activity found", async ({ page }) => {
  await page.goto("/activity");
  await expect(page.getByTestId("page-header")).toBeVisible();
  //analytics section
  await expect(page.getByTestId("analytics-section")).toBeVisible();
  //activities list section
  await expect(page.getByTestId("activities-list-section")).toBeVisible();
});

test("activity route error", async ({ page }) => {
  await page.goto("/activity?forceError=1");
  await expect(page.getByTestId("route-error-title")).toBeVisible();
  await expect(page.getByTestId("route-error-reset")).toBeVisible();
});

test("activity empty state", async ({ page }) => {
  await page.goto("/activity?category=swimming"); // hidekazu_ueba@example.com has no swimming activities
  await expect(page.getByTestId("page-header")).toBeVisible();
  //analytics section
  await expect(page.getByTestId("analytics-section")).toBeVisible();
  //activity empty state
  await expect(page.getByTestId("my-activities-empty-state")).toBeVisible();
});

test("activity category filter persists in URL", async ({ page }) => {
  await page.goto("/activity");

  const runningFilter = page.getByTestId("category-filter-running");

  await runningFilter.click();
  await expect(page).toHaveURL(/category=running/);

  // URL だけでなく、selected state の再描画まで待つ
  await expect(runningFilter).toHaveAttribute("href", "/activity?page=1");

  await runningFilter.click();
  await expect(page).toHaveURL(/\/activity(?:\?page=1)?$/);
});

test("activity pagination preserves category filter", async ({ page }) => {
  await page.goto("/activity?category=running");
  await page.getByTestId("my-activity-pagination-next").click();
  await expect(page).toHaveURL(/category=running/);
});

test("activity analytics cards render", async ({ page }) => {
  await page.goto("/activity");
  await expect(page.getByTestId("category-mix-card")).toBeVisible();
  await expect(page.getByTestId("distance-trend-card")).toBeVisible();
  await expect(page.getByTestId("duration-trend-card")).toBeVisible();
  await expect(page.getByTestId("consistency-bar-card")).toBeVisible();
  await expect(page.getByTestId("quick-stats-card")).toBeVisible();
});

test("activity analytics does not show most frequent category metric when category filter is applied", async ({
  page,
}) => {
  await page.goto("/activity?category=running");
  // check if the analytics section is visible
  await expect(page.getByTestId("analytics-section")).toBeVisible();
  // most frequent category metric is visible
  await expect(
    page.getByTestId("most-frequent-category-metric"),
  ).not.toBeVisible();
});

test("activity analytics shows most frequent category metric when category filter is not applied", async ({
  page,
}) => {
  await page.goto("/activity");
  // check if the analytics section is visible
  await expect(page.getByTestId("analytics-section")).toBeVisible();
  // most frequent category metric is visible
  await expect(page.getByTestId("most-frequent-category-metric")).toBeVisible();
});
