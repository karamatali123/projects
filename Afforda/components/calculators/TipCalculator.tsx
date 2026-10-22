"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Button } from "@/components/ui/button";
import { calculateTip, tipInputSchema } from "@/lib/calculators/tip";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

const QUICK_TIPS = [15, 18, 20, 22, 25];

export function TipCalculator() {
  const [form, setForm] = useState({
    billAmount: "86.40",
    tipPercent: "20",
    numberOfPeople: "2",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      tipInputSchema.safeParse({
        billAmount: parseFormNumber(form.billAmount),
        tipPercent: parseFormNumber(form.tipPercent),
        numberOfPeople: parseFormNumber(form.numberOfPeople),
      }),
    [form],
  );
  const result = parsed.success ? calculateTip(parsed.data) : null;
  const errors = submitted && !parsed.success ? parsed.error : undefined;

  return (
    <CalculatorShell
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (parsed.success) scrollToResults();
      }}
      results={
        result ? (
          <ResultsCard
            title="Tip and total"
            headlineLabel="Total bill"
            headlineValue={formatCurrency(result.totalBill)}
            rows={[
              { label: "Tip amount", value: formatCurrency(result.tipAmount) },
              { label: "Amount per person", value: formatCurrency(result.amountPerPerson) },
              { label: "Tip per person", value: formatCurrency(result.tipPerPerson) },
            ]}
          />
        ) : (
          <ResultsCard title="Tip and total" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="billAmount"
        label="Bill amount"
        prefix="$"
        value={form.billAmount}
        onChange={(event) => setForm({ ...form, billAmount: event.target.value })}
        error={errors && fieldError(errors, "billAmount")}
      />
      <div>
        <p className="mb-2 text-sm font-medium">Quick tip</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TIPS.map((percent) => (
            <Button
              key={percent}
              type="button"
              size="sm"
              variant={form.tipPercent === String(percent) ? "primary" : "outline"}
              onClick={() => setForm({ ...form, tipPercent: String(percent) })}
            >
              {percent}%
            </Button>
          ))}
        </div>
      </div>
      <NumberField
        id="tipPercent"
        label="Tip percentage"
        suffix="%"
        value={form.tipPercent}
        onChange={(event) => setForm({ ...form, tipPercent: event.target.value })}
        error={errors && fieldError(errors, "tipPercent")}
      />
      <NumberField
        id="numberOfPeople"
        label="Number of people"
        value={form.numberOfPeople}
        onChange={(event) =>
          setForm({ ...form, numberOfPeople: event.target.value })
        }
        error={errors && fieldError(errors, "numberOfPeople")}
      />
    </CalculatorShell>
  );
}
