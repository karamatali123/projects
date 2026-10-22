import { categories } from "@/data/categories";
import { calculatorsByCategory } from "@/data/calculators";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

const legalLinks = [
  { href: "/about/", label: "About" },
  { href: "/about/#how-we-make-this", label: "How we make this" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms" },
  { href: "/contact/", label: "Contact" },
  { href: "/disclaimer/", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-br from-navy via-[#174f4a] to-primary text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="sm:col-span-2 xl:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-navy-foreground/75">
            {siteConfig.tagline}. Formulas in code, copy reviewed against public
            sources. AI illustrations are labeled. Estimates only.
          </p>
        </div>
        {categories.map((category) => {
          const tools = calculatorsByCategory(category.slug);
          return (
            <div key={category.slug}>
              <h2 className="font-serif text-base text-[#ffd7c4]">{category.name}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {tools.map((calculator) =>
                  calculator.status === "live" ? (
                    <li key={calculator.slug}>
                      <Link className="text-navy-foreground/80 transition-colors hover:text-[#ffd7c4]" href={calculator.href}>
                        {calculator.name}
                      </Link>
                    </li>
                  ) : (
                    <li key={calculator.slug} className="text-navy-foreground/50">
                      {calculator.name}
                    </li>
                  ),
                )}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-navy-foreground/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {siteConfig.name}. Estimates only — not financial advice.</p>
          <ul className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
