import { CalculatorCard } from "@/components/home/CalculatorCard";
import { Search } from "@/components/layout/Search";
import { AiImage } from "@/components/seo/AiImage";
import { categories } from "@/data/categories";
import { calculatorsByCategory, liveCalculators } from "@/data/calculators";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Calculators",
  description:
    "Browse Afforda’s live money calculators: US pay and tax estimates, UK PAYE take-home, rent, cars, homes, debt, and restaurant math. Each page lists its formula and limits.",
  alternates: { canonical: "/calculators/" },
};

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-navy">Calculators</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        {liveCalculators().length} live tools. Results come from the formula on each
        page, not from a language model. Close keyword URLs redirect here or to one
        canonical calculator instead of duplicate articles.
      </p>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Topic photos are AI-generated illustrations.{" "}
        <Link href="/about/#how-we-make-this" className="font-medium text-primary hover:text-secondary">
          How we make this
        </Link>
        .
      </p>
      <div className="mt-6 max-w-md">
        <Search />
      </div>
      {categories.map((category) => (
        <section key={category.slug} className="mt-12" aria-labelledby={category.slug}>
          <div className="flex items-start gap-4">
            <AiImage
              src={category.image}
              alt={category.imageAlt}
              caption=""
              width={160}
              height={120}
              className="h-20 w-28 rounded-xl border border-border object-cover"
              figureClassName="hidden sm:block"
            />
            <div>
              <h2 id={category.slug} className="font-serif text-2xl text-navy">
                {category.name}
              </h2>
              <p className="mt-2 text-muted-foreground">{category.intro}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculatorsByCategory(category.slug).map((calculator) => (
              <CalculatorCard key={calculator.slug} calculator={calculator} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
