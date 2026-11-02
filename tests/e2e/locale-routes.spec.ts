import { expect, test } from "@playwright/test";

test("direct locale URLs override the browser language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "pt-BR" });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:3000/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 2, name: "Services." })).toBeVisible();

  await page.goto("http://127.0.0.1:3000/pt-BR");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 2, name: "Serviços." })).toBeVisible();

  await context.close();
});

test("unsupported locale paths show the English recovery page", async ({ page }) => {
  const response = await page.goto("/fr");

  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View the English portfolio" })).toHaveAttribute(
    "href",
    "/en",
  );
});
