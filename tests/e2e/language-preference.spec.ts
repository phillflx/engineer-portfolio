import { expect, test } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";

test("the root selects Brazilian Portuguese from the browser's primary language", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "pt-BR" });
  const page = await context.newPage();

  await page.goto(`${baseURL}/`);
  await expect(page).toHaveURL(`${baseURL}/pt-BR`);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 2, name: "Serviços." })).toBeVisible();

  await context.close();
});

test("the root defaults to English for a non-Portuguese primary language", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "fr-FR" });
  const page = await context.newPage();

  await page.goto(`${baseURL}/`);
  await expect(page).toHaveURL(`${baseURL}/en`);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 2, name: "Services." })).toBeVisible();

  await context.close();
});

test("the language selector changes language and preserves the current section", async ({
  page,
}) => {
  await page.goto("/en#projects");
  await page.getByLabel("Language").click();
  await page.getByRole("button", { name: "Português (Brasil)" }).click();

  await expect(page).toHaveURL(/\/pt-BR#projects$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("#projects")).toBeInViewport();
  await expect(page.getByRole("heading", { level: 2, name: "Trabalhos selecionados." })).toBeVisible();

  await page.getByLabel("Idioma").click();
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en#projects$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("opening the language selector does not scroll the current page position", async ({
  page,
}) => {
  await page.goto("/en");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toBeInViewport();
  await page.evaluate(() => {
    window.scrollTo({ top: 1500, behavior: "instant" });
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1 }));
  });
  await expect(page).toHaveURL(/\/en#projects$/);

  const scrollY = await page.evaluate(() => window.scrollY);
  const trigger = page.getByRole("button", { name: "Language" });
  const bounds = await trigger.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.click(
    bounds!.x + bounds!.width / 2,
    bounds!.y + bounds!.height / 2,
  );
  await expect(page.getByRole("button", { name: "Language" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(scrollY);
  await expect(page).toHaveURL(/\/en#projects$/);
});

test("the language selector opens and closes with the keyboard", async ({
  page,
}) => {
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Language" });

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "Português (Brasil)" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("Brazilian Portuguese content includes localized controls and the existing contacts", async ({
  page,
}) => {
  await page.goto("/pt-BR");

  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "#services");
  await expect(page.getByRole("button", { name: "Próximos serviços" })).toBeEnabled();
  await expect(page.getByText("philipe.felixdossantos@gmail.com")).toBeVisible();
  await expect(page.locator("#contact ul a")).toHaveCount(4);
});
