import type { CalculatorDefinition } from "@/data/calculators";
import type { FaqItem } from "@/data/content/calculators";
import { editorial } from "@/data/editorial";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function websiteJsonLd() {
  const logo = absoluteUrl("/images/afforda-logo-mark.jpg");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    dateModified: editorial.reviewedIso,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/afforda-hero.jpg"),
      creditText: "AI-generated illustration",
      digitalSourceType: "https://schema.org/TrainedAlgorithmicMedia",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: logo,
      },
    },
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function calculatorJsonLd(calculator: CalculatorDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.name,
    url: absoluteUrl(calculator.href),
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    dateModified: editorial.reviewedIso,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: calculator.description,
    isAccessibleForFree: true,
  };
}
