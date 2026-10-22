"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { calculateCarAffordability, carInputSchema } from "@/lib/calculators/car";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function CarCalculator() {
  const [form, setForm] = useState({
    annualIncome: "72000",
    monthlyIncome: "",
    downPayment: "4000",
    loanTermMonths: "60",
    interestRate: "6.5",
    monthlyDebt: "250",
    insuranceEstimate: "150",
    desiredMonthlyPayment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      carInputSchema.safeParse({
        annualIncome: parseFormNumber(form.annualIncome || "0"),
        monthlyIncome: parseFormNumber(form.monthlyIncome || "0"),
        downPayment: parseFormNumber(form.downPayment || "0"),
        loanTermMonths: parseFormNumber(form.loanTermMonths),
        interestRate: parseFormNumber(form.interestRate),
        monthlyDebt: parseFormNumber(form.monthlyDebt || "0"),
        insuranceEstimate: parseFormNumber(form.insuranceEstimate || "0"),
        desiredMonthlyPayment: parseFormNumber(form.desiredMonthlyPayment || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateCarAffordability(parsed.data) : null;
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
            title="Car affordability"
            headlineLabel="Recommended car price"
            headlineValue={formatCurrency(result.recommendedCarPrice, { whole: true })}
            rows={[
              {
                label: "Recommended monthly payment",
                value: formatCurrency(result.recommendedMonthlyPayment),
              },
              {
                label: "Estimated loan payment",
                value: formatCurrency(result.estimatedLoanPayment),
              },
              {
                label: "Estimated total monthly car cost",
                value: formatCurrency(result.estimatedTotalMonthlyCarCost),
              },
              {
                label: "Amount that may be excessive",
                value: formatCurrency(result.excessiveAmount, { whole: true }),
              },
            ]}
            footer={
              result.isDesiredPaymentExcessive
                ? "Your desired payment is above 15% of income or 20% including insurance, which may crowd out other expenses."
                : "Target payment is about 10% of gross monthly income. Taxes, fees, fuel, and maintenance are not included."
            }
          />
        ) : (
          <ResultsCard title="Car affordability" rows={[]} empty />
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
        value={form.monthlyIncome}
        onChange={(event) => setForm({ ...form, monthlyIncome: event.target.value })}
        error={errors && fieldError(errors, "monthlyIncome")}
      />
      <NumberField
        id="downPayment"
        label="Down payment"
        prefix="$"
        value={form.downPayment}
        onChange={(event) => setForm({ ...form, downPayment: event.target.value })}
        error={errors && fieldError(errors, "downPayment")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="loanTermMonths"
          label="Loan term (months)"
          value={form.loanTermMonths}
          onChange={(event) =>
            setForm({ ...form, loanTermMonths: event.target.value })
          }
          error={errors && fieldError(errors, "loanTermMonths")}
        />
        <NumberField
          id="interestRate"
          label="Interest rate"
          suffix="%"
          value={form.interestRate}
          onChange={(event) => setForm({ ...form, interestRate: event.target.value })}
          error={errors && fieldError(errors, "interestRate")}
        />
      </div>
      <NumberField
        id="monthlyDebt"
        label="Monthly debt"
        prefix="$"
        value={form.monthlyDebt}
        onChange={(event) => setForm({ ...form, monthlyDebt: event.target.value })}
        error={errors && fieldError(errors, "monthlyDebt")}
      />
      <NumberField
        id="insuranceEstimate"
        label="Insurance estimate (monthly)"
        prefix="$"
        value={form.insuranceEstimate}
        onChange={(event) =>
          setForm({ ...form, insuranceEstimate: event.target.value })
        }
        error={errors && fieldError(errors, "insuranceEstimate")}
      />
      <NumberField
        id="desiredMonthlyPayment"
        label="Desired monthly payment"
        prefix="$"
        hint="Optional. Used to flag a payment that may be too high."
        value={form.desiredMonthlyPayment}
        onChange={(event) =>
          setForm({ ...form, desiredMonthlyPayment: event.target.value })
        }
        error={errors && fieldError(errors, "desiredMonthlyPayment")}
      />
    </CalculatorShell>
  );
}
