import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/en", "/pt-BR"],
      disallow: "/",
    },
    sitemap: "https://portfolio.example.com/sitemap.xml",
  };
}
