"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { calculateDebtPayoff, debtInputSchema } from "@/lib/calculators/debt";
import { formatCurrency, formatMonths } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

function moneyOrNever(value: number) {
  return Number.isFinite(value) ? formatCurrency(value) : "Never";
}

export function DebtCalculator() {
  const [form, setForm] = useState({
    balance: "8000",
    apr: "19.99",
    minimumPayment: "200",
    additionalPayment: "100",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      debtInputSchema.safeParse({
        balance: parseFormNumber(form.balance),
        apr: parseFormNumber(form.apr),
        minimumPayment: parseFormNumber(form.minimumPayment),
        additionalPayment: parseFormNumber(form.additionalPayment || "0"),
      }),
    [form],
  );
  const result = parsed.success ? calculateDebtPayoff(parsed.data) : null;
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
            title="Payoff comparison"
            headlineLabel="Months until payoff with extra payment"
            headlineValue={formatMonths(result.withExtra.months)}
            rows={[
              {
                label: "Total interest (with extra)",
                value: moneyOrNever(result.withExtra.totalInterest),
              },
              {
                label: "Total amount paid (with extra)",
                value: moneyOrNever(result.withExtra.totalPaid),
              },
              {
                label: "Interest saved by paying extra",
                value: formatCurrency(result.interestSaved),
                emphasize: true,
              },
              {
                label: "Minimum-only payoff time",
                value: formatMonths(result.minimumOnly.months),
              },
              {
                label: "Minimum-only interest",
                value: moneyOrNever(result.minimumOnly.totalInterest),
              },
              {
                label: "Minimum-only total paid",
                value: moneyOrNever(result.minimumOnly.totalPaid),
              },
            ]}
            footer={
              result.withExtra.neverPaysOff
                ? "The payment does not cover monthly interest, so the balance will not reach zero."
                : `Paying extra may save ${formatMonths(result.monthsSaved)}.`
            }
          />
        ) : (
          <ResultsCard title="Payoff comparison" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="balance"
        label="Debt balance"
        prefix="$"
        value={form.balance}
        onChange={(event) => setForm({ ...form, balance: event.target.value })}
        error={errors && fieldError(errors, "balance")}
      />
      <NumberField
        id="apr"
        label="APR"
        suffix="%"
        value={form.apr}
        onChange={(event) => setForm({ ...form, apr: event.target.value })}
        error={errors && fieldError(errors, "apr")}
      />
      <NumberField
        id="minimumPayment"
        label="Minimum payment"
        prefix="$"
        value={form.minimumPayment}
        onChange={(event) => setForm({ ...form, minimumPayment: event.target.value })}
        error={errors && fieldError(errors, "minimumPayment")}
      />
      <NumberField
        id="additionalPayment"
        label="Additional monthly payment"
        prefix="$"
        value={form.additionalPayment}
        onChange={(event) =>
          setForm({ ...form, additionalPayment: event.target.value })
        }
        error={errors && fieldError(errors, "additionalPayment")}
      />
    </CalculatorShell>
  );
}
