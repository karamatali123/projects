export const siteConfig = {
  name: "Afforda",
  tagline: "Simple Tools for Smarter Money Decisions",
  description:
    "Free money calculators for US pay, rent, cars, homes, and debt, plus a UK PAYE take-home tool for 2026/27. Results come from published formulas, not a chatbot.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.afforda.com",
  locale: "en_US",
  email: "hello@afforda.com",
} as const;

export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
