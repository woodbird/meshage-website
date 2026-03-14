import { MetadataRoute } from "next";
import { site } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];
  const docsBase = [
    { url: `${site.url}/docs/zh`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${site.url}/docs/en`, changeFrequency: "weekly" as const, priority: 0.9 },
  ].map((entry) => ({
    ...entry,
    lastModified: new Date(),
  }));
  return [...base, ...docsBase];
}
