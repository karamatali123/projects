"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField, SelectField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Disclaimer } from "@/components/calculator/Disclaimer";
import { US_STATES } from "@/data/us-states";
import { calculatePaycheck, paycheckInputSchema } from "@/lib/calculators/paycheck";
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
  grossPay: "3269",
  payFrequency: "biweekly",
  state: "CA",
  filingStatus: "single",
  pretaxDeductions: "0",
  retirementContribution: "0",
  additionalWithholding: "0",
};

export function PaycheckCalculator() {
  const [form, setForm] = useState(defaults);
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      paycheckInputSchema.safeParse({
        grossPay: parseFormNumber(form.grossPay),
        payFrequency: form.payFrequency,
        state: form.state,
        filingStatus: form.filingStatus,
        pretaxDeductions: parseFormNumber(form.pretaxDeductions),
        retirementContribution: parseFormNumber(form.retirementContribution),
        additionalWithholding: parseFormNumber(form.additionalWithholding),
      }),
    [form],
  );
  const result = parsed.success ? calculatePaycheck(parsed.data) : null;
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
            title="Estimated paycheck"
            headlineLabel="Estimated take-home pay"
            headlineValue={formatCurrency(result.estimatedTakeHome)}
            rows={[
              { label: "Gross pay", value: formatCurrency(result.grossPay) },
              {
                label: "Estimated federal tax",
                value: formatCurrency(result.estimatedFederalTax),
              },
              {
                label: "Estimated state tax",
                value: formatCurrency(result.estimatedStateTax),
              },
              { label: "Social Security", value: formatCurrency(result.socialSecurity) },
              { label: "Medicare", value: formatCurrency(result.medicare) },
              {
                label: "Other deductions",
                value: formatCurrency(result.otherDeductions),
              },
            ]}
            footer={
              <>
                {result.taxYear} estimates only — not a payroll withholding engine.{" "}
                <Disclaimer compact />
              </>
            }
          />
        ) : (
          <ResultsCard title="Estimated paycheck" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="grossPay"
        label="Gross salary / pay"
        prefix="$"
        hint="Amount for the selected pay frequency"
        value={form.grossPay}
        onChange={(event) => setForm({ ...form, grossPay: event.target.value })}
        error={errors && fieldError(errors, "grossPay")}
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
      <NumberField
        id="pretaxDeductions"
        label="Pre-tax deductions (per period)"
        prefix="$"
        value={form.pretaxDeductions}
        onChange={(event) =>
          setForm({ ...form, pretaxDeductions: event.target.value })
        }
        error={errors && fieldError(errors, "pretaxDeductions")}
      />
      <NumberField
        id="retirementContribution"
        label="Retirement contribution (per period)"
        prefix="$"
        hint="Traditional 401(k) or similar. Use $0 for Roth."
        value={form.retirementContribution}
        onChange={(event) =>
          setForm({ ...form, retirementContribution: event.target.value })
        }
        error={errors && fieldError(errors, "retirementContribution")}
      />
      <NumberField
        id="additionalWithholding"
        label="Additional withholding (per period)"
        prefix="$"
        value={form.additionalWithholding}
        onChange={(event) =>
          setForm({ ...form, additionalWithholding: event.target.value })
        }
        error={errors && fieldError(errors, "additionalWithholding")}
      />
    </CalculatorShell>
  );
}
