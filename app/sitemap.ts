import type { MetadataRoute } from "next";
import portfolioJson from "../data/portfolio.json";
import { validatePortfolio } from "../lib/portfolio";

export const dynamic = "force-static";

const { profile } = validatePortfolio(portfolioJson);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.canonicalUrl,
      lastModified: new Date("2026-11-02"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
