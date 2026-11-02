import { expect, test } from "@playwright/test";

test("visitors can browse all service offerings using the carousel controls", async ({
  page,
}) => {
  await page.goto("/en#services");

  const services = page.getByRole("list", { name: "Service offerings" });
  const items = services.getByRole("listitem");
  const next = page.getByRole("button", { name: "Next service offerings" });
  const previous = page.getByRole("button", { name: "Previous service offerings" });

  await expect(items).toHaveCount(4);
  await expect(items.nth(0)).toContainText("Data engineering");
  await expect(page.locator(".carousel__position")).toHaveCount(0);
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.focus();
  await next.press("Enter");
  await expect(previous).toBeEnabled();

  await previous.click();
  await expect(previous).toBeDisabled();

  if (test.info().project.name === "mobile-chromium") {
    const box = await next.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(previous).toBeEnabled();
  }
});

test("service cards match the tallest card in both locales and viewport sizes", async ({
  page,
}) => {
  for (const locale of ["en", "pt-BR"]) {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}#services`);

      const services = page.getByRole("list", {
        name: locale === "en" ? "Service offerings" : "Serviços oferecidos",
      });
      const heights = await services.getByRole("listitem").evaluateAll((items) =>
        items.map((item) =>
          (item.firstElementChild as HTMLElement).getBoundingClientRect().height,
        ),
      );

      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
    }
  }
});

test("service card content starts near the top of each card", async ({ page }) => {
  for (const locale of ["en", "pt-BR"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}#services`);

    const cards = page
      .getByRole("list", {
        name: locale === "en" ? "Service offerings" : "Serviços oferecidos",
      })
      .locator(".carousel__item > article");
    const titleOffsets = await cards.evaluateAll((items) =>
      items.map((item) => {
        const card = item as HTMLElement;
        const title = card.querySelector("h3");
        return title
          ? title.getBoundingClientRect().top -
              card.getBoundingClientRect().top
          : Number.POSITIVE_INFINITY;
      }),
    );

    expect(titleOffsets.every((offset) => offset < 150)).toBe(true);
  }
});
