import type { MetadataRoute } from "next";

// Only real, crawlable pages — the old sitemap listed hash-fragment anchors
// (#features, #pricing, ...) and a demo.broadcast.com.ng subdomain that never
// existed; search engines don't index fragments as separate pages anyway.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://broadcast.com.ng/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      images: ["https://broadcast.com.ng/og-image.png"],
    },
    {
      url: "https://broadcast.com.ng/privacy-policy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://broadcast.com.ng/terms-of-service",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
