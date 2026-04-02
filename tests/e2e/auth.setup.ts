// tests/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import path from "path";

setup("authenticate default user", async ({ page }) => {
  const authFile = path.join(__dirname, "../e2e/playwright/.auth/user.json");
  await page.goto("/login");

  await page.getByLabel("Email").fill("hidekazu.ueba@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");
  await page.context().storageState({ path: authFile });
});

setup("authenticate empty friends user", async ({ page }) => {
  const authFile = path.join(
    __dirname,
    "../e2e/playwright/.auth/user-empty-friends.json",
  );
  await page.goto("/login");

  await page.getByLabel("Email").fill("empty.friends@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");
  await page.context().storageState({ path: authFile });
});
