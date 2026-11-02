import type { MetadataRoute } from "next";
import englishJson from "./data/portfolio.en.json";
import { validateLocalizedPortfolio } from "./lib/portfolio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { canonicalUrl } = validateLocalizedPortfolio(englishJson, "en").profile;

  return {
    rules: {
      userAgent: "*",
      allow: ["/en", "/pt-BR"],
      disallow: "/",
    },
    sitemap: new URL("/sitemap.xml", canonicalUrl).toString(),
  };
}
