import { z } from "zod";
import { annualFromHourly, hourlyFromAnnual } from "@/lib/calculators/pay";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount } from "@/lib/validation/schemas";

export const hourlyToSalarySchema = z.object({
  hourlyWage: positiveAmount("Please enter an hourly wage greater than $0."),
  hoursPerWeek: z.coerce
    .number({ error: "Please enter hours per week." })
    .gt(0, { error: "Please enter hours per week greater than 0." })
    .max(168, { error: "Hours per week cannot exceed 168." }),
  weeksPerYear: z.coerce
    .number({ error: "Please enter weeks per year." })
    .gt(0, { error: "Please enter weeks per year greater than 0." })
    .max(52, { error: "Weeks per year cannot exceed 52." }),
  overtimeHours: nonNegativeAmount("Please enter overtime hours of 0 or more."),
  overtimeMultiplier: z.coerce
    .number({ error: "Please enter an overtime multiplier." })
    .gt(0, { error: "Please enter an overtime multiplier greater than 0." })
    .max(10, { error: "Please enter a realistic overtime multiplier." }),
});

export const salaryToHourlySchema = z.object({
  annualSalary: positiveAmount("Please enter a salary greater than $0."),
  hoursPerWeek: z.coerce
    .number({ error: "Please enter hours per week." })
    .gt(0, { error: "Please enter hours per week greater than 0." })
    .max(168, { error: "Hours per week cannot exceed 168." }),
  weeksPerYear: z.coerce
    .number({ error: "Please enter weeks per year." })
    .gt(0, { error: "Please enter weeks per year greater than 0." })
    .max(52, { error: "Weeks per year cannot exceed 52." }),
});

export type HourlyToSalaryInput = z.infer<typeof hourlyToSalarySchema>;
export type SalaryToHourlyInput = z.infer<typeof salaryToHourlySchema>;

export type HourlyToSalaryResult = {
  weeklyRegular: number;
  weeklyOvertime: number;
  weeklyIncome: number;
  monthlyIncome: number;
  annualIncome: number;
  annualOvertime: number;
  annualRegular: number;
};

export type SalaryToHourlyResult = {
  hourlyRate: number;
  weeklyIncome: number;
  monthlyIncome: number;
};

export function calculateHourlyToSalary(
  input: HourlyToSalaryInput,
): HourlyToSalaryResult {
  const annualRegular = annualFromHourly(
    input.hourlyWage,
    input.hoursPerWeek,
    input.weeksPerYear,
  );
  const weeklyRegular = input.hourlyWage * input.hoursPerWeek;
  const weeklyOvertime =
    input.overtimeHours * input.hourlyWage * input.overtimeMultiplier;
  const annualOvertime = weeklyOvertime * input.weeksPerYear;
  const annualIncome = annualRegular + annualOvertime;
  const weeklyIncome = weeklyRegular + weeklyOvertime;

  return {
    weeklyRegular: roundToCents(weeklyRegular),
    weeklyOvertime: roundToCents(weeklyOvertime),
    weeklyIncome: roundToCents(weeklyIncome),
    monthlyIncome: roundToCents(annualIncome / 12),
    annualIncome: roundToCents(annualIncome),
    annualOvertime: roundToCents(annualOvertime),
    annualRegular: roundToCents(annualRegular),
  };
}

export function calculateSalaryToHourly(
  input: SalaryToHourlyInput,
): SalaryToHourlyResult {
  const hourlyRate = hourlyFromAnnual(
    input.annualSalary,
    input.hoursPerWeek,
    input.weeksPerYear,
  );
  return {
    hourlyRate: roundToCents(hourlyRate),
    weeklyIncome: roundToCents(hourlyRate * input.hoursPerWeek),
    monthlyIncome: roundToCents(input.annualSalary / 12),
  };
}
