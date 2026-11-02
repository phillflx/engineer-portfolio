import { expect, test } from "@playwright/test";

test("visitors can identify the engineer and find the contact section", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Hi, I’m Your Name/ }),
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
    "Contact details can be configured",
  );
  await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(0);

  await expect(page).toHaveTitle("Your Name — Software Engineer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Explore the software engineering services and selected work of Your Name.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://portfolio.example.com",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Your Name — Software Engineer",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://portfolio.example.com/images/social-preview.png",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://portfolio.example.com/images/social-preview.png",
  );
  const image = await page.request.get("/images/social-preview.png");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
