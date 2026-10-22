import { AdSlot } from "@/components/ads/AdSlot";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import { Faq } from "@/components/calculator/Faq";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { ContentProvenance } from "@/components/seo/ContentProvenance";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCalculator, getCategoryForCalculator } from "@/data/calculators";
import { calculatorContent } from "@/data/content/calculators";
import {
  breadcrumbJsonLd,
  calculatorJsonLd,
  faqJsonLd,
} from "@/lib/seo/jsonld";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function CalculatorPage({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const calculator = getCalculator(slug);
  const content = calculatorContent[slug];
  if (!calculator || calculator.status !== "live" || !content) {
    notFound();
  }
  const category = getCategoryForCalculator(slug);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={calculatorJsonLd(calculator)} />
      <JsonLd data={faqJsonLd(content.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators/" },
          ...(category ? [{ name: category.name, href: category.href }] : []),
          { name: calculator.name, href: calculator.href },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/calculators/" className="hover:text-primary">
              Calculators
            </Link>
          </li>
          {category ? (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={category.href} className="hover:text-primary">
                  {category.name}
                </Link>
              </li>
            </>
          ) : null}
        </ol>
      </nav>
      <header className="mt-4 max-w-3xl">
        {category ? (
          <p
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
            style={{
              backgroundColor: `${category.tint}22`,
              color: category.tint,
            }}
          >
            {category.name}
          </p>
        ) : null}
        <h1 className="font-serif text-4xl text-navy sm:text-5xl">{calculator.name}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.intro}</p>
      </header>
      <div className="mt-8">{children}</div>
      <AdSlot slot="below-calculator" className="mt-8" />
      <section className="mt-12 max-w-3xl space-y-8">
        <div>
          <h2 className="font-serif text-2xl text-navy">How the calculator works</h2>
          <p className="mt-3 text-muted-foreground">{content.howItWorks}</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-navy">How to use it</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            {content.howToUse.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <AdSlot slot="in-content" />
        <div>
          <h2 className="font-serif text-2xl text-navy">{content.example.title}</h2>
          <p className="mt-3 text-muted-foreground">{content.example.body}</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-navy">Important assumptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            {content.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <ContentProvenance sources={content.sources} />
      </section>
      <Faq items={content.faqs} />
      <RelatedCalculators slug={slug} />
      <AdSlot slot="related" className="mt-8" />
      <Disclaimer />
    </article>
  );
}
