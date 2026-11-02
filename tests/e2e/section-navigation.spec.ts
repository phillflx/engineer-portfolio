import { expect, test } from "@playwright/test";

test("header section links continue to reach their matching sections", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");

  const navigation = page.getByRole("navigation", {
    name: "Main navigation",
  });

  for (const [label, section] of [
    ["Services", "services"],
    ["Projects", "projects"],
    ["Contact", "contact"],
  ]) {
    await navigation.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`/en#${section}$`));
    await expect(page.locator(`#${section}`)).toBeInViewport();
  }
});

test("valid direct fragments reach their section and unknown fragments do not prevent loading", async ({
  page,
}) => {
  await page.goto("/en#projects");
  await expect(page.locator("#projects")).toBeInViewport();
  await expect(page).toHaveURL(/\/en#projects$/);

  await page.goto("/pt-BR#unknown-section");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Serviços." })).toBeVisible();
});
