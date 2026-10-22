import type { CalculatorDefinition } from "@/data/calculators";
import { getCategory } from "@/data/categories";
import Link from "next/link";

export function CalculatorCard({
  calculator,
}: {
  calculator: CalculatorDefinition;
}) {
  const category = getCategory(calculator.category);

  if (calculator.status !== "live") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/80 p-5">
        <p className="text-xs font-medium tracking-wide text-secondary uppercase">
          Coming soon
        </p>
        <h3 className="mt-2 font-medium text-navy">{calculator.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{calculator.description}</p>
      </div>
    );
  }

  return (
    <Link
      href={calculator.href}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[var(--shadow-hover)]"
    >
      <span
        aria-hidden
        className="mb-3 block h-1.5 w-10 rounded-full transition-all duration-200 group-hover:w-16"
        style={{ backgroundColor: category?.tint ?? "var(--primary)" }}
      />
      <h3 className="font-medium text-navy transition-colors group-hover:text-primary">
        {calculator.name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{calculator.description}</p>
    </Link>
  );
}
