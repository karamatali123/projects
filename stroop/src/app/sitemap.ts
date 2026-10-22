import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexableSite, PUBLIC_PATHS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexableSite()) return [];

  return PUBLIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/guides/") ? 0.6 : 0.4,
  }));
}
