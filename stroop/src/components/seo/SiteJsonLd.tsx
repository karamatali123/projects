import { absoluteUrl } from "@/lib/site";

export function SiteJsonLd() {
  const url = absoluteUrl("/");
  const description =
    "A free browser tool that filters answers of a chosen length from the green, yellow, and gray feedback you enter.";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Wordle Solver",
        url,
        description,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        name: "Wordle Solver",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url,
        description,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
