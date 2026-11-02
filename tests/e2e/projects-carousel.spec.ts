import { expect, test } from "@playwright/test";

test("visitors can browse sample projects and only see configured project links", async ({
  page,
}) => {
  await page.goto("/#projects");

  const projects = page.getByRole("list", { name: "Sample projects" });
  const items = projects.getByRole("listitem");
  const next = page.getByRole("button", { name: "Next sample projects" });

  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Digital experiences");
  await expect(items.nth(0)).toContainText("Replace this description");
  await expect(page.getByText("Item 1 of 3")).toBeVisible();

  await expect(projects.locator('a[target="_blank"]')).toHaveCount(0);

  if (test.info().project.name === "mobile-chromium") {
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page.getByText(/Item [2-3] of 3/)).toBeVisible();
    await expect(items.nth(1)).toContainText("Interface experiments");

    await page.goto("/#projects");
    const nextButton = page.getByRole("button", { name: "Next sample projects" });
    const box = await nextButton.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(
      box!.x + box!.width / 2,
      box!.y + box!.height / 2,
    );
    await expect(page.getByText(/Item [2-3] of 3/)).toBeVisible();
  } else {
    await expect(next).toBeDisabled();
    await expect(items.nth(2)).toContainText("Creative technology");
  }
});
