import { getRelatedCalculators } from "@/data/calculators";
import Link from "next/link";

export function RelatedCalculators({ slug }: { slug: string }) {
  const related = getRelatedCalculators(slug);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="font-serif text-2xl text-navy">
        Related calculators
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {related.map((calculator) => (
          <li key={calculator.slug}>
            <Link
              href={calculator.href}
              className="block rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[var(--shadow-hover)]"
            >
              <span className="font-medium text-navy hover:text-primary">{calculator.name}</span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {calculator.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
