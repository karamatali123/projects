"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import { calculateHomeAffordability, homeInputSchema } from "@/lib/calculators/home";
import { formatCurrency, formatPercent } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function HomeCalculator() {
  const [form, setForm] = useState({
    annualIncome: "120000",
    monthlyDebt: "500",
    downPayment: "60000",
    interestRate: "6.5",
    loanTermYears: "30",
    propertyTaxRate: "1.1",
    homeInsuranceAnnual: "1800",
    hoaMonthly: "0",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      homeInputSchema.safeParse({
        annualIncome: parseFormNumber(form.annualIncome),
        monthlyDebt: parseFormNumber(form.monthlyDebt || "0"),
        downPayment: parseFormNumber(form.downPayment || "0"),
        interestRate: parseFormNumber(form.interestRate),
        loanTermYears: parseFormNumber(form.loanTermYears),
        propertyTaxRate: parseFormNumber(form.propertyTaxRate),
        homeInsuranceAnnual: parseFormNumber(form.homeInsuranceAnnual || "0"),
        hoaMonthly: parseFormNumber(form.hoaMonthly || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateHomeAffordability(parsed.data) : null;
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
            title="Home affordability estimate"
            headlineLabel="Estimated affordable home price"
            headlineValue={formatCurrency(result.affordableHomePrice, { whole: true })}
            rows={[
              {
                label: "Estimated monthly mortgage (P&I)",
                value: formatCurrency(result.monthlyPrincipalAndInterest),
              },
              {
                label: "Principal + interest",
                value: formatCurrency(result.monthlyPrincipalAndInterest),
              },
              { label: "Property tax", value: formatCurrency(result.monthlyPropertyTax) },
              { label: "Insurance", value: formatCurrency(result.monthlyInsurance) },
              { label: "HOA", value: formatCurrency(result.monthlyHoa) },
              {
                label: "Total monthly housing cost",
                value: formatCurrency(result.totalMonthlyHousingCost),
                emphasize: true,
              },
            ]}
            footer={
              <>
                Housing ratio {formatPercent(result.frontEndRatio)}. This is an estimate,
                not mortgage approval. <Disclaimer compact />
              </>
            }
          />
        ) : (
          <ResultsCard title="Home affordability estimate" rows={[]} empty />
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
        id="monthlyDebt"
        label="Monthly debt"
        prefix="$"
        value={form.monthlyDebt}
        onChange={(event) => setForm({ ...form, monthlyDebt: event.target.value })}
        error={errors && fieldError(errors, "monthlyDebt")}
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
          id="interestRate"
          label="Interest rate"
          suffix="%"
          value={form.interestRate}
          onChange={(event) => setForm({ ...form, interestRate: event.target.value })}
          error={errors && fieldError(errors, "interestRate")}
        />
        <NumberField
          id="loanTermYears"
          label="Loan term (years)"
          value={form.loanTermYears}
          onChange={(event) =>
            setForm({ ...form, loanTermYears: event.target.value })
          }
          error={errors && fieldError(errors, "loanTermYears")}
        />
      </div>
      <NumberField
        id="propertyTaxRate"
        label="Property tax"
        suffix="%"
        hint="Annual rate as a percent of home value"
        value={form.propertyTaxRate}
        onChange={(event) =>
          setForm({ ...form, propertyTaxRate: event.target.value })
        }
        error={errors && fieldError(errors, "propertyTaxRate")}
      />
      <NumberField
        id="homeInsuranceAnnual"
        label="Home insurance (annual)"
        prefix="$"
        value={form.homeInsuranceAnnual}
        onChange={(event) =>
          setForm({ ...form, homeInsuranceAnnual: event.target.value })
        }
        error={errors && fieldError(errors, "homeInsuranceAnnual")}
      />
      <NumberField
        id="hoaMonthly"
        label="HOA (monthly)"
        prefix="$"
        value={form.hoaMonthly}
        onChange={(event) => setForm({ ...form, hoaMonthly: event.target.value })}
        error={errors && fieldError(errors, "hoaMonthly")}
      />
    </CalculatorShell>
  );
}
