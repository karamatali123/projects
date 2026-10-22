import { z } from "zod";
import {
  estimateUkAnnualTaxes,
  ukTaxRegions,
  type UkTaxRegion,
} from "@/lib/calculators/ukTax";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount } from "@/lib/validation/schemas";

export const ukPayFrequencies = [
  "annually",
  "monthly",
  "fourWeekly",
  "weekly",
] as const;

export type UkPayFrequency = (typeof ukPayFrequencies)[number];

export const UK_PERIODS_PER_YEAR: Record<UkPayFrequency, number> = {
  annually: 1,
  monthly: 12,
  fourWeekly: 13,
  weekly: 52,
};

export const ukPayFrequencyLabels: Record<UkPayFrequency, string> = {
  annually: "Annually",
  monthly: "Monthly",
  fourWeekly: "Every 4 weeks",
  weekly: "Weekly",
};

export const ukSalaryInputSchema = z.object({
  amount: positiveAmount("Please enter a salary greater than £0."),
  payFrequency: z.enum(ukPayFrequencies),
  region: z.enum(ukTaxRegions),
  pensionSacrifice: nonNegativeAmount(
    "Please enter a pension salary sacrifice of £0 or more.",
  ),
  fullTimeHours: z.coerce
    .number()
    .gt(0, { error: "Please enter full-time hours greater than 0." })
    .max(168, { error: "Hours per week cannot exceed 168." }),
  hoursPerWeek: z.coerce
    .number()
    .gt(0, { error: "Please enter hours per week greater than 0." })
    .max(168, { error: "Hours per week cannot exceed 168." }),
});

export type UkSalaryInput = {
  amount: number;
  payFrequency: UkPayFrequency;
  region: UkTaxRegion;
  pensionSacrifice: number;
  fullTimeHours: number;
  hoursPerWeek: number;
};

export type UkSalaryResult = {
  fteAnnual: number;
  annual: number;
  monthly: number;
  fourWeekly: number;
  weekly: number;
  hourly: number;
  pensionSacrifice: number;
  incomeTax: number;
  nationalInsurance: number;
  personalAllowance: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  fourWeeklyTakeHome: number;
  weeklyTakeHome: number;
  periodTakeHome: number;
  taxYear: string;
  region: UkTaxRegion;
  isProRata: boolean;
};

export function calculateUkSalary(input: UkSalaryInput): UkSalaryResult {
  const fteAnnual = input.amount * UK_PERIODS_PER_YEAR[input.payFrequency];
  const proRataFactor = input.hoursPerWeek / input.fullTimeHours;
  const annual = fteAnnual * proRataFactor;
  const hoursPerYear = input.hoursPerWeek * 52;
  const taxes = estimateUkAnnualTaxes({
    annualGross: annual,
    region: input.region,
    pensionSacrifice: input.pensionSacrifice,
  });

  return {
    fteAnnual: roundToCents(fteAnnual),
    annual: roundToCents(annual),
    monthly: roundToCents(annual / 12),
    fourWeekly: roundToCents(annual / 13),
    weekly: roundToCents(annual / 52),
    hourly: roundToCents(hoursPerYear > 0 ? annual / hoursPerYear : 0),
    pensionSacrifice: taxes.pensionSacrifice,
    incomeTax: taxes.incomeTax,
    nationalInsurance: taxes.nationalInsurance,
    personalAllowance: roundToCents(taxes.personalAllowance),
    annualTakeHome: taxes.takeHome,
    monthlyTakeHome: roundToCents(taxes.takeHome / 12),
    fourWeeklyTakeHome: roundToCents(taxes.takeHome / 13),
    weeklyTakeHome: roundToCents(taxes.takeHome / 52),
    periodTakeHome: roundToCents(
      taxes.takeHome / UK_PERIODS_PER_YEAR[input.payFrequency],
    ),
    taxYear: taxes.taxYear,
    region: input.region,
    isProRata: input.hoursPerWeek !== input.fullTimeHours,
  };
}
