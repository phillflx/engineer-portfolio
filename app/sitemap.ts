import type { MetadataRoute } from "next";
import englishJson from "./data/portfolio.en.json";
import portugueseJson from "./data/portfolio.pt-BR.json";
import { validateLocalizedPortfolio } from "./lib/portfolio";

export const dynamic = "force-static";

const english = validateLocalizedPortfolio(englishJson, "en");
const portuguese = validateLocalizedPortfolio(portugueseJson, "pt-BR");
const siteOrigin = new URL(english.profile.canonicalUrl);
if (new URL(portuguese.profile.canonicalUrl).origin !== siteOrigin.origin) {
  throw new Error("Localized portfolio canonical URLs must share the same site origin.");
}
const englishUrl = new URL("/en", siteOrigin).toString();
const portugueseUrl = new URL("/pt-BR", siteOrigin).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    en: englishUrl,
    "pt-BR": portugueseUrl,
  };

  return [
    {
      url: englishUrl,
      lastModified: new Date("2026-11-02"),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: portugueseUrl,
      lastModified: new Date("2026-11-02"),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
  ];
}
