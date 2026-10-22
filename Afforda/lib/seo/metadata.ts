import type { Metadata } from "next";
import { getCalculator } from "@/data/calculators";
import { getCategory, type CategorySlug } from "@/data/categories";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function defaultMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} – ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: `${siteConfig.name} – ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: absoluteUrl("/"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} – ${siteConfig.tagline}`,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function calculatorMetadata(slug: string): Metadata {
  const calculator = getCalculator(slug);
  if (!calculator) {
    return { title: "Calculator" };
  }
  const url = absoluteUrl(calculator.href);
  return {
    title: calculator.seo.title,
    description: calculator.seo.description,
    alternates: { canonical: calculator.href },
    openGraph: {
      title: calculator.seo.title,
      description: calculator.seo.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.seo.title,
      description: calculator.seo.description,
    },
  };
}

export function categoryMetadata(slug: CategorySlug): Metadata {
  const category = getCategory(slug);
  if (!category) return { title: "Calculators" };
  return {
    title:
      slug === "income"
        ? "Salary, Take-Home Pay & Hourly Calculators"
        : `${category.name} Calculators`,
    description: category.description,
    alternates: { canonical: category.href },
    openGraph: {
      title: `${category.name} Calculators | ${siteConfig.name}`,
      description: category.description,
      url: absoluteUrl(category.href),
    },
  };
}
