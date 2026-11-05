import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["MJ12bot", "AhrefsBot", "SemrushBot"], disallow: "/" },
    ],
    sitemap: "https://broadcast.com.ng/sitemap.xml",
  };
}
