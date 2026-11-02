import { expect, test } from "@playwright/test";

test("language switching preserves the scroll-synchronized section fragment", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await page.getByLabel("Language").click();
  await page.keyboard.press("Escape");
  await page.locator("#services").evaluate((section) => {
    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.15;
    window.scrollTo({ top, behavior: "instant" });
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
  });

  await expect(page).toHaveURL(/\/en#services$/);
  await page.getByLabel("Language").click();
  await page.getByRole("button", { name: "Português (Brasil)" }).click();

  await expect(page).toHaveURL(/\/pt-BR#services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("#services")).toBeInViewport();

  await page.getByLabel("Idioma").click();
  await page.getByRole("button", { name: "English" }).click();

  await expect(page).toHaveURL(/\/en#services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#services")).toBeInViewport();
});
