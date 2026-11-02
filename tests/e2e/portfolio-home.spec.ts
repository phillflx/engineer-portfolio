import { expect, test } from "@playwright/test";

test("visitors can identify the engineer and find the contact section", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Hi, I’m Philipe Felix/,
    }),
  ).toBeVisible();
  await expect(page.getByText(/software engineer/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /let.s talk/i })).toHaveAttribute(
    "href",
    "#contact",
  );

  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute(
    "href",
    "#services",
  );
  await expect(nav.getByRole("link", { name: "Projects" })).toHaveAttribute(
    "href",
    "#projects",
  );
  await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute(
    "href",
    "#contact",
  );
  await expect(page.locator("header")).toHaveCSS("position", "sticky");

  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator("#contact")).toContainText(
    "philipe.felixdossantos@gmail.com",
  );
  await expect(page.locator("#contact ul a")).toHaveCount(4);
  await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(1);
  await expect(page.locator("#contact a[href^='https://wa.me/']")).toHaveCount(1);

  await expect(page).toHaveTitle(
    "Philipe Felix — Software Engineer & Data Engineer",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Explore the software and data engineering services and selected work of Philipe Felix.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://philipefelix.com/en",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Philipe Felix — Software Engineer & Data Engineer",
  );
  const socialImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(socialImage).toBeTruthy();
  const socialImagePath = new URL(socialImage!).pathname;
  expect(socialImagePath).toMatch(/^\/_next\/static\/media\/.+\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    socialImage!,
  );
  const image = await page.request.get(socialImagePath);
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
