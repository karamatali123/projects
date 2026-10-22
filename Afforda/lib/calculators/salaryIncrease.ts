import { z } from "zod";
import {
  fromAnnual,
  hourlyFromAnnual,
  toAnnual,
  type PayFrequency,
} from "@/lib/calculators/pay";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, percentValue, positiveAmount } from "@/lib/validation/schemas";

export const salaryIncreaseInputSchema = z
  .object({
    currentPay: positiveAmount("Please enter current pay greater than $0."),
    payFrequency: z.enum(["annually", "monthly", "biweekly", "weekly", "hourly"]),
    hoursPerWeek: z.coerce.number().gt(0).max(168).default(40),
    weeksPerYear: z.coerce.number().gt(0).max(52).default(52),
    raisePercent: percentValue("Please enter a valid raise percentage.", 200),
    raiseAmount: nonNegativeAmount("Please enter a raise amount of $0 or more."),
  })
  .refine((value) => value.raisePercent > 0 || value.raiseAmount > 0, {
    error: "Please enter a raise percent or a dollar amount.",
    path: ["raisePercent"],
  });

export type SalaryIncreaseInput = {
  currentPay: number;
  payFrequency: PayFrequency | "hourly";
  hoursPerWeek: number;
  weeksPerYear: number;
  raisePercent: number;
  raiseAmount: number;
};

export type SalaryIncreaseResult = {
  currentAnnual: number;
  newAnnual: number;
  increaseAnnual: number;
  newMonthly: number;
  newBiweekly: number;
  newHourly: number;
  raisePercentApplied: number;
};

export function calculateSalaryIncrease(
  input: SalaryIncreaseInput,
): SalaryIncreaseResult {
  const currentAnnual =
    input.payFrequency === "hourly"
      ? input.currentPay * input.hoursPerWeek * input.weeksPerYear
      : toAnnual(input.currentPay, input.payFrequency);
  const percentIncrease = currentAnnual * (input.raisePercent / 100);
  const dollarIncrease =
    input.payFrequency === "hourly"
      ? input.raiseAmount * input.hoursPerWeek * input.weeksPerYear
      : input.raiseAmount === 0
        ? 0
        : toAnnual(input.raiseAmount, input.payFrequency);
  const increaseAnnual = percentIncrease + dollarIncrease;
  const newAnnual = currentAnnual + increaseAnnual;
  const raisePercentApplied =
    currentAnnual > 0 ? increaseAnnual / currentAnnual : 0;

  return {
    currentAnnual: roundToCents(currentAnnual),
    newAnnual: roundToCents(newAnnual),
    increaseAnnual: roundToCents(increaseAnnual),
    newMonthly: roundToCents(fromAnnual(newAnnual, "monthly")),
    newBiweekly: roundToCents(fromAnnual(newAnnual, "biweekly")),
    newHourly: roundToCents(
      hourlyFromAnnual(newAnnual, input.hoursPerWeek, input.weeksPerYear),
    ),
    raisePercentApplied,
  };
}
