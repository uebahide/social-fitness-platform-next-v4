// tests/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../e2e/playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("hidekazu_ueba@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");
  await page.context().storageState({ path: authFile });
});
