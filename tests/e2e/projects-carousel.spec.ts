import { expect, test } from "@playwright/test";

test("visitors can browse sample projects and only see configured project links", async ({
  page,
}) => {
  await page.goto("/en#projects");

  const projects = page.getByRole("list", { name: "Sample projects" });
  const items = projects.getByRole("listitem");
  const next = page.getByRole("button", { name: "Next sample projects" });

  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Device Upgrade Intelligence Platform");
  await expect(items.nth(0)).toContainText("Led a data science initiative");
  await expect(page.locator(".carousel__position")).toHaveCount(0);

  await expect(projects.locator('a[target="_blank"]')).toHaveCount(0);

  if (test.info().project.name === "mobile-chromium") {
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page.getByRole("button", { name: "Previous sample projects" })).toBeEnabled();
    await expect(items.nth(1)).toContainText("UOL Tag Manager and PayUOL");

    await page.goto("/en#projects");
    const nextButton = page.getByRole("button", { name: "Next sample projects" });
    const box = await nextButton.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(
      box!.x + box!.width / 2,
      box!.y + box!.height / 2,
    );
    await expect(
      page.getByRole("button", { name: "Previous sample projects" }),
    ).toBeEnabled();
  } else {
    await expect(next).toHaveCount(0);
    await expect(items.nth(2)).toContainText("Veja São Paulo app");
  }
});

test("project cards match the tallest card in both locales and viewport sizes", async ({
  page,
}) => {
  for (const locale of ["en", "pt-BR"]) {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}#projects`);

      const projects = page.getByRole("list", {
        name: locale === "en" ? "Sample projects" : "Projetos de exemplo",
      });
      const heights = await projects.getByRole("listitem").evaluateAll((items) =>
        items.map((item) =>
          (item.firstElementChild as HTMLElement).getBoundingClientRect().height,
        ),
      );

      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
    }
  }
});

test("carousel cards are justified only when all items fit in the viewport", async ({
  page,
}) => {
  const track = page.getByRole("list", { name: "Sample projects" });
  const previous = page.getByRole("button", { name: "Previous sample projects" });
  const next = page.getByRole("button", { name: "Next sample projects" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en#projects");
  await expect
    .poll(() =>
      track.evaluate((element) => getComputedStyle(element).justifyContent),
    )
    .toBe("space-between");
  await expect(previous).toHaveCount(0);
  await expect(next).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 900 });
  await expect
    .poll(() =>
      track.evaluate((element) => getComputedStyle(element).justifyContent),
    )
    .toBe("normal");
  await expect(previous).toBeVisible();
  await expect(next).toBeVisible();
});
