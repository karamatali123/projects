import { categories } from "@/data/categories";
import { liveCalculators } from "@/data/calculators";
import { editorial } from "@/data/editorial";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = editorial.reviewedIso;
  const staticRoutes = [
    "/",
    "/calculators/",
    "/about/",
    "/privacy/",
    "/terms/",
    "/contact/",
    "/disclaimer/",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(category.href),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...liveCalculators().map((calculator) => ({
      url: absoluteUrl(calculator.href),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
