"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField, SelectField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import { US_STATES } from "@/data/us-states";
import { calculateSalary, salaryInputSchema } from "@/lib/calculators/salary";
import {
  filingStatusLabels,
  filingStatuses,
  payFrequencies,
  payFrequencyLabels,
} from "@/lib/calculators/pay";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

const defaults = {
  amount: "85000",
  payFrequency: "annually",
  hoursPerWeek: "40",
  weeksPerYear: "52",
  state: "CA",
  filingStatus: "single",
};

export function SalaryCalculator() {
  const [form, setForm] = useState(defaults);
  const [submitted, setSubmitted] = useState(false);

  const parsed = useMemo(
    () =>
      salaryInputSchema.safeParse({
        amount: parseFormNumber(form.amount),
        payFrequency: form.payFrequency,
        hoursPerWeek: parseFormNumber(form.hoursPerWeek),
        weeksPerYear: parseFormNumber(form.weeksPerYear),
        state: form.state,
        filingStatus: form.filingStatus,
      }),
    [form],
  );
  const result = parsed.success ? calculateSalary(parsed.data) : null;
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
            title="Your estimated pay"
            headlineLabel="Estimated annual take-home (net pay)"
            headlineValue={formatCurrency(result.estimatedAnnualTakeHome)}
            rows={[
              { label: "Gross annual salary", value: formatCurrency(result.annual) },
              { label: "Gross monthly salary", value: formatCurrency(result.monthly) },
              {
                label: "Monthly take-home pay",
                value: formatCurrency(result.estimatedMonthlyTakeHome),
                emphasize: true,
              },
              { label: "Biweekly", value: formatCurrency(result.biweekly) },
              { label: "Weekly", value: formatCurrency(result.weekly) },
              { label: "Hourly equivalent", value: formatCurrency(result.hourly) },
              {
                label: "Estimated federal tax",
                value: formatCurrency(result.estimatedFederalTax),
              },
              {
                label: "Estimated state tax",
                value: formatCurrency(result.estimatedStateTax),
              },
              {
                label: "Social Security",
                value: formatCurrency(result.socialSecurity),
              },
              { label: "Medicare", value: formatCurrency(result.medicare) },
              {
                label: "Estimated take-home (this period)",
                value: formatCurrency(result.estimatedPeriodTakeHome),
                emphasize: true,
              },
            ]}
            footer={
              <>
                Tax figures are {result.taxYear} estimates, not exact withholding.{" "}
                <Disclaimer compact />
              </>
            }
          />
        ) : (
          <ResultsCard title="Your estimated pay" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="amount"
        label="Salary amount"
        prefix="$"
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
        {payFrequencies.map((frequency) => (
          <option key={frequency} value={frequency}>
            {payFrequencyLabels[frequency]}
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
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="hoursPerWeek"
          label="Hours per week"
          value={form.hoursPerWeek}
          onChange={(event) =>
            setForm({ ...form, hoursPerWeek: event.target.value })
          }
          error={errors && fieldError(errors, "hoursPerWeek")}
        />
        <NumberField
          id="weeksPerYear"
          label="Weeks per year"
          value={form.weeksPerYear}
          onChange={(event) =>
            setForm({ ...form, weeksPerYear: event.target.value })
          }
          error={errors && fieldError(errors, "weeksPerYear")}
        />
      </div>
    </CalculatorShell>
  );
}
