import type { FaqItem } from "@/data/content/calculators";

export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="font-serif text-2xl text-navy">
        Frequently asked questions
      </h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)] transition-colors open:border-primary/30 open:bg-primary-soft/40"
          >
            <summary className="cursor-pointer font-medium text-foreground transition-colors group-open:text-primary">
              {item.question}
            </summary>
            <p className="mt-3 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
