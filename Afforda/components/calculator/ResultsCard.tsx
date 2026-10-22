import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ResultRow = {
  label: string;
  value: string;
  emphasize?: boolean;
};

type ResultsCardProps = {
  title: string;
  headlineLabel?: string;
  headlineValue?: string;
  rows: ResultRow[];
  footer?: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
};

export function ResultsCard({
  title,
  headlineLabel,
  headlineValue,
  rows,
  footer,
  empty,
  emptyMessage = "Enter your details to see results.",
}: ResultsCardProps) {
  return (
    <Card
      className="border-0 bg-gradient-to-br from-navy via-[#174f4a] to-primary p-5 text-navy-foreground shadow-[var(--shadow-hover)] sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 className="font-serif text-2xl">{title}</h2>
      {empty ? (
        <p className="mt-4 text-navy-foreground/75">{emptyMessage}</p>
      ) : (
        <>
          {headlineValue ? (
            <p className="mt-5">
              {headlineLabel ? (
                <span className="block text-sm text-navy-foreground/70">
                  {headlineLabel}
                </span>
              ) : null}
              <span className="mt-1 block text-4xl font-semibold tracking-tight text-[#ffd7c4]">
                {headlineValue}
              </span>
            </p>
          ) : null}
          <dl className="mt-6 space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className={cn(
                  "flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-0",
                  row.emphasize && "text-base font-semibold text-[#ffd7c4]",
                )}
              >
                <dt className="text-sm text-navy-foreground/75">{row.label}</dt>
                <dd className="text-right text-lg tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
          {footer ? <div className="mt-5 text-sm text-navy-foreground/75">{footer}</div> : null}
        </>
      )}
    </Card>
  );
}
