"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField, SelectField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import {
  calculateSalaryIncrease,
  salaryIncreaseInputSchema,
} from "@/lib/calculators/salaryIncrease";
import { formatCurrency, formatPercent } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

const frequencies = [
  { value: "annually", label: "Annual salary" },
  { value: "monthly", label: "Monthly salary" },
  { value: "biweekly", label: "Biweekly pay" },
  { value: "weekly", label: "Weekly pay" },
  { value: "hourly", label: "Hourly wage" },
] as const;

export function SalaryIncreaseCalculator() {
  const [form, setForm] = useState({
    currentPay: "80000",
    payFrequency: "annually",
    hoursPerWeek: "40",
    weeksPerYear: "52",
    raisePercent: "5",
    raiseAmount: "0",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      salaryIncreaseInputSchema.safeParse({
        currentPay: parseFormNumber(form.currentPay),
        payFrequency: form.payFrequency,
        hoursPerWeek: parseFormNumber(form.hoursPerWeek),
        weeksPerYear: parseFormNumber(form.weeksPerYear),
        raisePercent: parseFormNumber(form.raisePercent || "0"),
        raiseAmount: parseFormNumber(form.raiseAmount || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateSalaryIncrease(parsed.data) : null;
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
            title="New pay after the raise"
            headlineLabel="New annual pay"
            headlineValue={formatCurrency(result.newAnnual)}
            rows={[
              { label: "Current annual pay", value: formatCurrency(result.currentAnnual) },
              {
                label: "Raise amount (annual)",
                value: formatCurrency(result.increaseAnnual),
              },
              {
                label: "Raise percent",
                value: formatPercent(result.raisePercentApplied),
              },
              { label: "New monthly pay", value: formatCurrency(result.newMonthly) },
              { label: "New biweekly pay", value: formatCurrency(result.newBiweekly) },
              { label: "New hourly rate", value: formatCurrency(result.newHourly) },
            ]}
            footer="Gross pay only. Use the salary calculator to estimate take-home pay after tax."
          />
        ) : (
          <ResultsCard title="New pay after the raise" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="currentPay"
        label="Current pay"
        prefix="$"
        value={form.currentPay}
        onChange={(event) => setForm({ ...form, currentPay: event.target.value })}
        error={errors && fieldError(errors, "currentPay")}
      />
      <SelectField
        id="payFrequency"
        label="Pay unit"
        value={form.payFrequency}
        onChange={(event) => setForm({ ...form, payFrequency: event.target.value })}
      >
        {frequencies.map((frequency) => (
          <option key={frequency.value} value={frequency.value}>
            {frequency.label}
          </option>
        ))}
      </SelectField>
      <NumberField
        id="raisePercent"
        label="Raise percent"
        suffix="%"
        value={form.raisePercent}
        onChange={(event) => setForm({ ...form, raisePercent: event.target.value })}
        error={errors && fieldError(errors, "raisePercent")}
      />
      <NumberField
        id="raiseAmount"
        label="Raise dollar amount"
        prefix="$"
        hint="Same unit as current pay. Optional if you entered a percent."
        value={form.raiseAmount}
        onChange={(event) => setForm({ ...form, raiseAmount: event.target.value })}
        error={errors && fieldError(errors, "raiseAmount")}
      />
      {form.payFrequency === "hourly" ? (
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
      ) : null}
    </CalculatorShell>
  );
}
