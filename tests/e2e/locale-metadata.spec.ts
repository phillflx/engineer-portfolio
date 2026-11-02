import { expect, test } from "@playwright/test";

const siteOrigin = "https://philipefelix.com";

const localeCases = [
  {
    path: "/en",
    language: "en",
    title: "Philipe Felix — Software Engineer & Data Engineer",
    description:
      "Explore the software and data engineering services and selected work of Philipe Felix.",
    canonical: `${siteOrigin}/en`,
    ogLocale: "en_US",
  },
  {
    path: "/pt-BR",
    language: "pt-BR",
    title: "Philipe Felix — Engenheiro de Software e Dados",
    description:
      "Conheça os serviços de engenharia de software e dados e alguns projetos de Philipe Felix.",
    canonical: `${siteOrigin}/pt-BR`,
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
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      localeCase.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      localeCase.canonical,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      `${siteOrigin}/en`,
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="pt-BR"]'),
    ).toHaveAttribute("href", `${siteOrigin}/pt-BR`);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      localeCase.ogLocale,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      localeCase.title,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      localeCase.description,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      localeCase.canonical,
    );
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBeTruthy();
    expect(new URL(ogImage!).origin).toBe(siteOrigin);
    const imageResponse = await page.request.get(new URL(ogImage!).pathname);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()["content-type"]).toContain("image/png");
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      localeCase.language === "en"
        ? "Philipe Felix portfolio preview"
        : "Imagem de compartilhamento do portfólio de Philipe Felix",
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      "content",
      "630",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      localeCase.title,
    );
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      localeCase.description,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      ogImage!,
    );
  });
}

test("sitemap lists both locales with language alternates and excludes the root chooser", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);

  const xml = await response.text();
  expect(xml).toContain(`${siteOrigin}/en`);
  expect(xml).toContain(`${siteOrigin}/pt-BR`);
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="pt-BR"');
  expect(xml).not.toContain(`<loc>${siteOrigin}</loc>`);

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
});

test("the language chooser is excluded from search indexing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});
