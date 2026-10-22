"use client";

import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { NumberField } from "@/components/calculator/Field";
import { ResultsCard } from "@/components/calculator/ResultsCard";
import {
  calculateHourlyToSalary,
  calculateSalaryToHourly,
  hourlyToSalarySchema,
  salaryToHourlySchema,
} from "@/lib/calculators/hourly";
import { formatCurrency } from "@/lib/formatting/currency";
import { parseFormNumber, scrollToResults } from "@/lib/forms";
import { fieldError } from "@/lib/validation/schemas";
import { useMemo, useState } from "react";

export function HourlyCalculator() {
  const [mode, setMode] = useState<"hourly" | "salary">("hourly");
  const [hourlyForm, setHourlyForm] = useState({
    hourlyWage: "25",
    hoursPerWeek: "40",
    weeksPerYear: "52",
    overtimeHours: "0",
    overtimeMultiplier: "1.5",
  });
  const [salaryForm, setSalaryForm] = useState({
    annualSalary: "85000",
    hoursPerWeek: "40",
    weeksPerYear: "52",
  });
  const [submitted, setSubmitted] = useState(false);

  const hourlyParsed = useMemo(
    () =>
      hourlyToSalarySchema.safeParse({
        hourlyWage: parseFormNumber(hourlyForm.hourlyWage),
        hoursPerWeek: parseFormNumber(hourlyForm.hoursPerWeek),
        weeksPerYear: parseFormNumber(hourlyForm.weeksPerYear),
        overtimeHours: parseFormNumber(hourlyForm.overtimeHours),
        overtimeMultiplier: parseFormNumber(hourlyForm.overtimeMultiplier),
      }),
    [hourlyForm],
  );
  const salaryParsed = useMemo(
    () =>
      salaryToHourlySchema.safeParse({
        annualSalary: parseFormNumber(salaryForm.annualSalary),
        hoursPerWeek: parseFormNumber(salaryForm.hoursPerWeek),
        weeksPerYear: parseFormNumber(salaryForm.weeksPerYear),
      }),
    [salaryForm],
  );

  const hourlyResult = hourlyParsed.success
    ? calculateHourlyToSalary(hourlyParsed.data)
    : null;
  const salaryResult = salaryParsed.success
    ? calculateSalaryToHourly(salaryParsed.data)
    : null;
  const hourlyErrors =
    submitted && mode === "hourly" && !hourlyParsed.success
      ? hourlyParsed.error
      : undefined;
  const salaryErrors =
    submitted && mode === "salary" && !salaryParsed.success
      ? salaryParsed.error
      : undefined;

  return (
    <CalculatorShell
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (
          (mode === "hourly" && hourlyParsed.success) ||
          (mode === "salary" && salaryParsed.success)
        ) {
          scrollToResults();
        }
      }}
      results={
        mode === "hourly" ? (
          hourlyResult ? (
            <ResultsCard
              title="Converted income"
              headlineLabel="Annual income"
              headlineValue={formatCurrency(hourlyResult.annualIncome)}
              rows={[
                { label: "Weekly income", value: formatCurrency(hourlyResult.weeklyIncome) },
                { label: "Monthly income", value: formatCurrency(hourlyResult.monthlyIncome) },
                { label: "Regular annual pay", value: formatCurrency(hourlyResult.annualRegular) },
                {
                  label: "Overtime income",
                  value: formatCurrency(hourlyResult.annualOvertime),
                },
              ]}
            />
          ) : (
            <ResultsCard title="Converted income" rows={[]} empty />
          )
        ) : salaryResult ? (
          <ResultsCard
            title="Hourly equivalent"
            headlineLabel="Hourly rate"
            headlineValue={formatCurrency(salaryResult.hourlyRate)}
            rows={[
              { label: "Weekly income", value: formatCurrency(salaryResult.weeklyIncome) },
              {
                label: "Monthly income",
                value: formatCurrency(salaryResult.monthlyIncome),
              },
            ]}
          />
        ) : (
          <ResultsCard title="Hourly equivalent" rows={[]} empty />
        )
      }
    >
      <div className="flex rounded-xl border border-border bg-muted p-1">
        <button
          type="button"
          className={`h-10 flex-1 rounded-lg text-sm font-semibold transition-colors ${mode === "hourly" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-card"}`}
          onClick={() => setMode("hourly")}
        >
          Hourly → salary
        </button>
        <button
          type="button"
          className={`h-10 flex-1 rounded-lg text-sm font-semibold transition-colors ${mode === "salary" ? "bg-secondary text-secondary-foreground shadow-sm" : "hover:bg-card"}`}
          onClick={() => setMode("salary")}
        >
          Salary → hourly
        </button>
      </div>

      {mode === "hourly" ? (
        <>
          <NumberField
            id="hourlyWage"
            label="Hourly wage"
            prefix="$"
            value={hourlyForm.hourlyWage}
            onChange={(event) =>
              setHourlyForm({ ...hourlyForm, hourlyWage: event.target.value })
            }
            error={hourlyErrors && fieldError(hourlyErrors, "hourlyWage")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="hoursPerWeek"
              label="Hours per week"
              value={hourlyForm.hoursPerWeek}
              onChange={(event) =>
                setHourlyForm({ ...hourlyForm, hoursPerWeek: event.target.value })
              }
              error={hourlyErrors && fieldError(hourlyErrors, "hoursPerWeek")}
            />
            <NumberField
              id="weeksPerYear"
              label="Weeks per year"
              value={hourlyForm.weeksPerYear}
              onChange={(event) =>
                setHourlyForm({ ...hourlyForm, weeksPerYear: event.target.value })
              }
              error={hourlyErrors && fieldError(hourlyErrors, "weeksPerYear")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="overtimeHours"
              label="Overtime hours per week"
              value={hourlyForm.overtimeHours}
              onChange={(event) =>
                setHourlyForm({ ...hourlyForm, overtimeHours: event.target.value })
              }
              error={hourlyErrors && fieldError(hourlyErrors, "overtimeHours")}
            />
            <NumberField
              id="overtimeMultiplier"
              label="Overtime multiplier"
              hint="1.5 is time-and-a-half"
              value={hourlyForm.overtimeMultiplier}
              onChange={(event) =>
                setHourlyForm({
                  ...hourlyForm,
                  overtimeMultiplier: event.target.value,
                })
              }
              error={hourlyErrors && fieldError(hourlyErrors, "overtimeMultiplier")}
            />
          </div>
        </>
      ) : (
        <>
          <NumberField
            id="annualSalary"
            label="Annual salary"
            prefix="$"
            value={salaryForm.annualSalary}
            onChange={(event) =>
              setSalaryForm({ ...salaryForm, annualSalary: event.target.value })
            }
            error={salaryErrors && fieldError(salaryErrors, "annualSalary")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="salaryHoursPerWeek"
              label="Hours per week"
              value={salaryForm.hoursPerWeek}
              onChange={(event) =>
                setSalaryForm({ ...salaryForm, hoursPerWeek: event.target.value })
              }
              error={salaryErrors && fieldError(salaryErrors, "hoursPerWeek")}
            />
            <NumberField
              id="salaryWeeksPerYear"
              label="Weeks per year"
              value={salaryForm.weeksPerYear}
              onChange={(event) =>
                setSalaryForm({ ...salaryForm, weeksPerYear: event.target.value })
              }
              error={salaryErrors && fieldError(salaryErrors, "weeksPerYear")}
            />
          </div>
        </>
      )}
    </CalculatorShell>
  );
}
