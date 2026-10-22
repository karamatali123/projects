"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import {
  calculateRentAffordability,
  rentInputSchema,
} from "@/lib/calculators/rent";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function RentCalculator() {
  const [form, setForm] = useState({
    annualIncome: "72000",
    monthlyIncome: "",
    monthlyDebt: "400",
    desiredSavings: "400",
    otherMonthlyExpenses: "600",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      rentInputSchema.safeParse({
        annualIncome: parseFormNumber(form.annualIncome || "0"),
        monthlyIncome: parseFormNumber(form.monthlyIncome || "0"),
        monthlyDebt: parseFormNumber(form.monthlyDebt || "0"),
        desiredSavings: parseFormNumber(form.desiredSavings || "0"),
        otherMonthlyExpenses: parseFormNumber(form.otherMonthlyExpenses || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateRentAffordability(parsed.data) : null;
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
            title="Recommended rent"
            headlineLabel="Recommended maximum rent"
            headlineValue={formatCurrency(result.recommendedMax, { whole: true })}
            rows={[
              {
                label: "Conservative range",
                value: `${formatCurrency(result.conservativeMin, { whole: true })} – ${formatCurrency(result.conservativeMax, { whole: true })}`,
              },
              {
                label: "Moderate range",
                value: `${formatCurrency(result.moderateMin, { whole: true })} – ${formatCurrency(result.moderateMax, { whole: true })}`,
              },
              {
                label: "Remaining after recommended rent",
                value: formatCurrency(result.remainingAfterRecommended, { whole: true }),
              },
            ]}
            footer="Recommended rent is the lesser of 30% of gross monthly income and leftover income after debt, savings, and other expenses."
          />
        ) : (
          <ResultsCard title="Recommended rent" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="annualIncome"
        label="Annual income"
        prefix="$"
        value={form.annualIncome}
        onChange={(event) => setForm({ ...form, annualIncome: event.target.value })}
        error={errors && fieldError(errors, "annualIncome")}
      />
      <NumberField
        id="monthlyIncome"
        label="Monthly income"
        prefix="$"
        hint="If filled, monthly income is used instead of annual ÷ 12."
        value={form.monthlyIncome}
        onChange={(event) => setForm({ ...form, monthlyIncome: event.target.value })}
        error={errors && fieldError(errors, "monthlyIncome")}
      />
      <NumberField
        id="monthlyDebt"
        label="Monthly debt payments"
        prefix="$"
        value={form.monthlyDebt}
        onChange={(event) => setForm({ ...form, monthlyDebt: event.target.value })}
        error={errors && fieldError(errors, "monthlyDebt")}
      />
      <NumberField
        id="desiredSavings"
        label="Desired monthly savings"
        prefix="$"
        value={form.desiredSavings}
        onChange={(event) => setForm({ ...form, desiredSavings: event.target.value })}
        error={errors && fieldError(errors, "desiredSavings")}
      />
      <NumberField
        id="otherMonthlyExpenses"
        label="Other monthly expenses"
        prefix="$"
        value={form.otherMonthlyExpenses}
        onChange={(event) =>
          setForm({ ...form, otherMonthlyExpenses: event.target.value })
        }
        error={errors && fieldError(errors, "otherMonthlyExpenses")}
      />
    </CalculatorShell>
  );
}
