"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField, SelectField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import {
  calculateUkSalary,
  ukPayFrequencies,
  ukPayFrequencyLabels,
  ukSalaryInputSchema,
} from "@/lib/calculators/ukSalary";
import { ukTaxRegionLabels, ukTaxRegions } from "@/lib/calculators/ukTax";
import { formatGbp } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

const defaults = {
  amount: "40000",
  payFrequency: "annually",
  region: "england_wales_ni",
  pensionSacrifice: "0",
  fullTimeHours: "37.5",
  hoursPerWeek: "37.5",
};

export function UkSalaryCalculator() {
  const [form, setForm] = useState(defaults);
  const [submitted, setSubmitted] = useState(false);

  const parsed = useMemo(
    () =>
      ukSalaryInputSchema.safeParse({
        amount: parseFormNumber(form.amount),
        payFrequency: form.payFrequency,
        region: form.region,
        pensionSacrifice: parseFormNumber(form.pensionSacrifice),
        fullTimeHours: parseFormNumber(form.fullTimeHours),
        hoursPerWeek: parseFormNumber(form.hoursPerWeek),
      }),
    [form],
  );
  const result = parsed.success ? calculateUkSalary(parsed.data) : null;
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
            title="Your estimated UK take-home pay"
            headlineLabel="Estimated annual take-home (net pay)"
            headlineValue={formatGbp(result.annualTakeHome)}
            rows={[
              {
                label: result.isProRata ? "Full-time equivalent salary" : "Gross annual salary",
                value: formatGbp(result.isProRata ? result.fteAnnual : result.annual),
              },
              ...(result.isProRata
                ? [{ label: "Pro rata annual salary", value: formatGbp(result.annual) }]
                : []),
              { label: "Gross monthly salary", value: formatGbp(result.monthly) },
              {
                label: "Monthly take-home pay",
                value: formatGbp(result.monthlyTakeHome),
                emphasize: true,
              },
              { label: "Weekly take-home pay", value: formatGbp(result.weeklyTakeHome) },
              { label: "Hourly equivalent", value: formatGbp(result.hourly) },
              { label: "Personal allowance", value: formatGbp(result.personalAllowance) },
              { label: "Income tax", value: formatGbp(result.incomeTax) },
              {
                label: "National Insurance",
                value: formatGbp(result.nationalInsurance),
              },
              ...(result.pensionSacrifice > 0
                ? [
                    {
                      label: "Pension salary sacrifice",
                      value: formatGbp(result.pensionSacrifice),
                    },
                  ]
                : []),
              {
                label: "Take-home this period",
                value: formatGbp(result.periodTakeHome),
                emphasize: true,
              },
            ]}
            footer={
              <>
                Figures are {result.taxYear} estimates for PAYE employees, not a tax
                code or P60. Student loan, marriage allowance, and Scottish Advanced
                edge cases are not included. <Disclaimer compact />
              </>
            }
          />
        ) : (
          <ResultsCard title="Your estimated UK take-home pay" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="amount"
        label="Salary amount"
        prefix="£"
        value={form.amount}
        onChange={(event) => setForm({ ...form, amount: event.target.value })}
        error={errors && fieldError(errors, "amount")}
      />
      <SelectField
        id="payFrequency"
        label="Pay frequency"
        value={form.payFrequency}
        onChange={(event) => setForm({ ...form, payFrequency: event.target.value })}
      >
        {ukPayFrequencies.map((frequency) => (
          <option key={frequency} value={frequency}>
            {ukPayFrequencyLabels[frequency]}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="region"
        label="Tax region"
        hint="Scottish income tax uses the 2026/27 devolved bands. National Insurance is the same across the UK."
        value={form.region}
        onChange={(event) => setForm({ ...form, region: event.target.value })}
      >
        {ukTaxRegions.map((region) => (
          <option key={region} value={region}>
            {ukTaxRegionLabels[region]}
          </option>
        ))}
      </SelectField>
      <NumberField
        id="pensionSacrifice"
        label="Pension salary sacrifice (annual)"
        prefix="£"
        hint="Optional. Amount taken from gross pay before income tax and National Insurance."
        value={form.pensionSacrifice}
        onChange={(event) =>
          setForm({ ...form, pensionSacrifice: event.target.value })
        }
        error={errors && fieldError(errors, "pensionSacrifice")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="fullTimeHours"
          label="Full-time hours per week"
          hint="Usually 37.5 or 40."
          value={form.fullTimeHours}
          onChange={(event) =>
            setForm({ ...form, fullTimeHours: event.target.value })
          }
          error={errors && fieldError(errors, "fullTimeHours")}
        />
        <NumberField
          id="hoursPerWeek"
          label="Your hours per week"
          hint="Lower this to pro rata a full-time salary."
          value={form.hoursPerWeek}
          onChange={(event) =>
            setForm({ ...form, hoursPerWeek: event.target.value })
          }
          error={errors && fieldError(errors, "hoursPerWeek")}
        />
      </div>
    </CalculatorShell>
  );
}
