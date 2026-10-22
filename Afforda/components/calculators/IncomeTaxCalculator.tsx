"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import { NumberField, SelectField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { US_STATES } from "@/data/us-states";
import {
  calculateIncomeTax,
  incomeTaxInputSchema,
} from "@/lib/calculators/incomeTax";
import {
  filingStatusLabels,
  filingStatuses,
} from "@/lib/calculators/pay";
import { formatCurrency, formatPercent } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function IncomeTaxCalculator() {
  const [form, setForm] = useState({
    annualIncome: "85000",
    filingStatus: "single",
    state: "CA",
    pretaxDeductions: "0",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      incomeTaxInputSchema.safeParse({
        annualIncome: parseFormNumber(form.annualIncome),
        filingStatus: form.filingStatus,
        state: form.state,
        pretaxDeductions: parseFormNumber(form.pretaxDeductions || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateIncomeTax(parsed.data) : null;
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
            title="Estimated income tax"
            headlineLabel="Income after tax"
            headlineValue={formatCurrency(result.incomeAfterTax)}
            rows={[
              { label: "Gross income", value: formatCurrency(result.annualIncome) },
              {
                label: "Estimated federal tax",
                value: formatCurrency(result.federalIncomeTax),
              },
              {
                label: "Estimated state tax",
                value: formatCurrency(result.stateIncomeTax),
              },
              { label: "Social Security", value: formatCurrency(result.socialSecurity) },
              { label: "Medicare", value: formatCurrency(result.medicare) },
              {
                label: "Total estimated tax",
                value: formatCurrency(result.totalTax),
                emphasize: true,
              },
              {
                label: "Effective tax rate",
                value: formatPercent(result.effectiveRate),
              },
            ]}
            footer={
              <>
                {result.taxYear} estimates only — not a filed return. <Disclaimer compact />
              </>
            }
          />
        ) : (
          <ResultsCard title="Estimated income tax" rows={[]} empty />
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
      <SelectField
        id="filingStatus"
        label="Filing status"
        value={form.filingStatus}
        onChange={(event) => setForm({ ...form, filingStatus: event.target.value })}
      >
        {filingStatuses.map((status) => (
          <option key={status} value={status}>
            {filingStatusLabels[status]}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="state"
        label="State"
        value={form.state}
        onChange={(event) => setForm({ ...form, state: event.target.value })}
      >
        {US_STATES.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </SelectField>
      <NumberField
        id="pretaxDeductions"
        label="Pre-tax deductions (annual)"
        prefix="$"
        value={form.pretaxDeductions}
        onChange={(event) =>
          setForm({ ...form, pretaxDeductions: event.target.value })
        }
        error={errors && fieldError(errors, "pretaxDeductions")}
      />
    </CalculatorShell>
  );
}
