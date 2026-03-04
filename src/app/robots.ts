import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/joncoadm/",
      },
    ],
    sitemap: "https://jonco.pro/sitemap.xml",
  };
}
