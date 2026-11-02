import { expect, test } from "@playwright/test";

const localeCases = [
  {
    path: "/en",
    language: "en",
    title: "Philipe Felix — Software Engineer & Data Engineer",
    canonical: "https://portfolio.example.com/en",
    ogLocale: "en_US",
  },
  {
    path: "/pt-BR",
    language: "pt-BR",
    title: "Philipe Felix — Engenheiro de Software e Dados",
    canonical: "https://portfolio.example.com/pt-BR",
    ogLocale: "pt_BR",
  },
];

for (const localeCase of localeCases) {
  test(`${localeCase.language} page exposes localized SEO and sharing metadata`, async ({
    page,
  }) => {
    await page.goto(localeCase.path);

    await expect(page.locator("html")).toHaveAttribute("lang", localeCase.language);
    await expect(page).toHaveTitle(localeCase.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      localeCase.canonical,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://portfolio.example.com/en",
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="pt-BR"]'),
    ).toHaveAttribute("href", "https://portfolio.example.com/pt-BR");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      localeCase.ogLocale,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      localeCase.title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      localeCase.title,
    );
  });
}

test("sitemap lists both locales with language alternates and excludes the root chooser", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);

  const xml = await response.text();
  expect(xml).toContain("https://portfolio.example.com/en");
  expect(xml).toContain("https://portfolio.example.com/pt-BR");
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="pt-BR"');
  expect(xml).not.toContain("<loc>https://portfolio.example.com</loc>");
});

test("the language chooser is excluded from search indexing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});
