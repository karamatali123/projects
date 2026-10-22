"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { calculateSplitBill, splitBillInputSchema } from "@/lib/calculators/splitBill";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function SplitBillCalculator() {
  const [form, setForm] = useState({
    billAmount: "120",
    tipPercent: "18",
    numberOfPeople: "4",
    unequal: false,
    customAmounts: ["", "", "", ""],
  });
  const [submitted, setSubmitted] = useState(false);
  const peopleCount = Math.max(1, Number.parseInt(form.numberOfPeople, 10) || 1);
  const parsed = useMemo(
    () =>
      splitBillInputSchema.safeParse({
        billAmount: parseFormNumber(form.billAmount),
        tipPercent: parseFormNumber(form.tipPercent),
        numberOfPeople: parseFormNumber(form.numberOfPeople),
        unequal: form.unequal,
        customAmounts: form.customAmounts
          .slice(0, peopleCount)
          .map((amount) => parseFormNumber(amount || "0")),
      }),
    [form, peopleCount],
  );
  const result = parsed.success ? calculateSplitBill(parsed.data) : null;
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
            title="Split total"
            headlineLabel="Per-person amount"
            headlineValue={
              form.unequal
                ? "See shares below"
                : formatCurrency(result.equalShare)
            }
            rows={[
              { label: "Total", value: formatCurrency(result.total) },
              { label: "Tip", value: formatCurrency(result.tipAmount) },
              ...result.shares.map((share) => ({
                label: `Person ${share.index + 1}${share.isCustom ? " (custom)" : ""}`,
                value: formatCurrency(share.amount),
              })),
            ]}
          />
        ) : (
          <ResultsCard title="Split total" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="billAmount"
        label="Bill"
        prefix="$"
        value={form.billAmount}
        onChange={(event) => setForm({ ...form, billAmount: event.target.value })}
        error={errors && fieldError(errors, "billAmount")}
      />
      <NumberField
        id="tipPercent"
        label="Tip"
        suffix="%"
        value={form.tipPercent}
        onChange={(event) => setForm({ ...form, tipPercent: event.target.value })}
        error={errors && fieldError(errors, "tipPercent")}
      />
      <NumberField
        id="numberOfPeople"
        label="Number of people"
        value={form.numberOfPeople}
        onChange={(event) => {
          const nextCount = Number.parseInt(event.target.value, 10) || 0;
          const customAmounts = [...form.customAmounts];
          while (customAmounts.length < nextCount) customAmounts.push("");
          setForm({
            ...form,
            numberOfPeople: event.target.value,
            customAmounts,
          });
        }}
        error={errors && fieldError(errors, "numberOfPeople")}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.unequal}
          onChange={(event) => setForm({ ...form, unequal: event.target.checked })}
        />
        Unequal payments
      </label>
      {form.unequal
        ? Array.from({ length: peopleCount }, (_, index) => (
            <NumberField
              key={index}
              id={`person-${index}`}
              label={`Person ${index + 1} amount`}
              prefix="$"
              hint="Leave blank to split the remaining total."
              value={form.customAmounts[index] ?? ""}
              onChange={(event) => {
                const customAmounts = [...form.customAmounts];
                customAmounts[index] = event.target.value;
                setForm({ ...form, customAmounts });
              }}
            />
          ))
        : null}
    </CalculatorShell>
  );
}
