import { expect, test } from "@playwright/test";

test("visitors can browse all service offerings using the carousel controls", async ({
  page,
}) => {
  await page.goto("/#services");

  const services = page.getByRole("list", { name: "Service offerings" });
  const items = services.getByRole("listitem");
  const next = page.getByRole("button", { name: "Next service offerings" });
  const previous = page.getByRole("button", { name: "Previous service offerings" });

  await expect(items).toHaveCount(4);
  await expect(items.nth(0)).toContainText("Web development");
  await expect(page.getByText("Item 1 of 4")).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.focus();
  await next.press("Enter");
  await expect(page.getByText("Item 2 of 4")).toBeVisible();
  await expect(previous).toBeEnabled();

  await previous.click();
  await expect(page.getByText("Item 1 of 4")).toBeVisible();

  if (test.info().project.name === "mobile-chromium") {
    const box = await next.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page.getByText(/Item [2-4] of 4/)).toBeVisible();
  }
});
