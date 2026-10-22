"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import { Button } from "@/components/ui/button";
import { calculateOvertime, overtimeInputSchema } from "@/lib/calculators/overtime";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function OvertimeCalculator() {
  const [form, setForm] = useState({
    hourlyRate: "22",
    regularHours: "40",
    overtimeHours: "6",
    overtimeMultiplier: "1.5",
  });
  const [submitted, setSubmitted] = useState(false);
  const parsed = useMemo(
    () =>
      overtimeInputSchema.safeParse({
        hourlyRate: parseFormNumber(form.hourlyRate),
        regularHours: parseFormNumber(form.regularHours),
        overtimeHours: parseFormNumber(form.overtimeHours),
        overtimeMultiplier: parseFormNumber(form.overtimeMultiplier),
      }),
    [form],
  );
  const result = parsed.success ? calculateOvertime(parsed.data) : null;
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
            title="Weekly overtime pay"
            headlineLabel="Total pay"
            headlineValue={formatCurrency(result.totalPay)}
            rows={[
              { label: "Regular pay", value: formatCurrency(result.regularPay) },
              { label: "Overtime pay", value: formatCurrency(result.overtimePay) },
              { label: "Overtime rate", value: formatCurrency(result.overtimeRate) },
            ]}
          />
        ) : (
          <ResultsCard title="Weekly overtime pay" rows={[]} empty />
        )
      }
    >
      <NumberField
        id="hourlyRate"
        label="Hourly rate"
        prefix="$"
        value={form.hourlyRate}
        onChange={(event) => setForm({ ...form, hourlyRate: event.target.value })}
        error={errors && fieldError(errors, "hourlyRate")}
      />
      <NumberField
        id="regularHours"
        label="Regular hours"
        value={form.regularHours}
        onChange={(event) => setForm({ ...form, regularHours: event.target.value })}
        error={errors && fieldError(errors, "regularHours")}
      />
      <NumberField
        id="overtimeHours"
        label="Overtime hours"
        value={form.overtimeHours}
        onChange={(event) => setForm({ ...form, overtimeHours: event.target.value })}
        error={errors && fieldError(errors, "overtimeHours")}
      />
      <div>
        <p className="mb-2 text-sm font-medium">Overtime rate</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={form.overtimeMultiplier === "1.5" ? "primary" : "secondary"}
            onClick={() => setForm({ ...form, overtimeMultiplier: "1.5" })}
          >
            Time and a half (1.5×)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={form.overtimeMultiplier === "2" ? "primary" : "secondary"}
            onClick={() => setForm({ ...form, overtimeMultiplier: "2" })}
          >
            Double time (2×)
          </Button>
        </div>
      </div>
      <NumberField
        id="overtimeMultiplier"
        label="Overtime multiplier"
        hint="1.5 is time and a half. 2 is double time."
        value={form.overtimeMultiplier}
        onChange={(event) =>
          setForm({ ...form, overtimeMultiplier: event.target.value })
        }
        error={errors && fieldError(errors, "overtimeMultiplier")}
      />
    </CalculatorShell>
  );
}
