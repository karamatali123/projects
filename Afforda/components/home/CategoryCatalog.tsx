import { CalculatorCard } from "@/components/home/CalculatorCard";
import { AiImage } from "@/components/seo/AiImage";
import { getCategory, type CategorySlug } from "@/data/categories";
import { calculatorsByCategory } from "@/data/calculators";
import { notFound } from "next/navigation";

export function CategoryCatalog({
  slug,
  heading,
}: {
  slug: CategorySlug;
  heading?: string;
}) {
  const category = getCategory(slug);
  if (!category) notFound();
  const tools = calculatorsByCategory(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <h1 className="font-serif text-4xl text-navy">
            {heading ?? `${category.name} calculators`}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{category.intro}</p>
        </div>
        <AiImage
          src={category.image}
          alt={category.imageAlt}
          width={1152}
          height={864}
          className="h-auto w-full rounded-3xl border-4 border-white object-cover shadow-[var(--shadow-hover)] ring-1 ring-primary/15"
          sizes="(min-width: 1024px) 420px, 100vw"
          priority
        />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </div>
  );
}
