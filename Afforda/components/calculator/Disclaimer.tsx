export function Disclaimer({ compact = false }: { compact?: boolean }) {
  const text =
    "These calculators provide estimates for educational purposes only. Actual taxes, loan terms, fees, and costs may vary. This tool is not financial, tax, legal, or investment advice. Numbers come from the formula on this page, not from a language model.";

  if (compact) {
    return <p className="text-xs text-navy-foreground/70">{text}</p>;
  }

  return (
    <p className="mt-10 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
      {text}
    </p>
  );
}
