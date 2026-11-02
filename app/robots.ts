import type { MetadataRoute } from "next";
import portfolioJson from "./data/portfolio.json";
import { validatePortfolio } from "./lib/portfolio";

export const dynamic = "force-static";

const { profile } = validatePortfolio(portfolioJson);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", profile.canonicalUrl).toString(),
  };
}
