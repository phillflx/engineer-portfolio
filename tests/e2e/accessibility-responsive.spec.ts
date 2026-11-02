import { expect, test } from "@playwright/test";

test("the homepage stays readable, keyboard-operable, and within the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    const pageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(pageWidth).toBeLessThanOrEqual(width);

    const nextService = page.getByRole("button", {
      name: "Next service offerings",
    });
    await nextService.focus();
    await expect(nextService).toBeFocused();
    await expect(nextService).toHaveCSS("outline-style", "solid");
  }
});
