import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/inbox", "/agent", "/settings", "/onboarding"],
      },
    ],
    sitemap: "https://reputo.co/sitemap.xml",
  };
}
