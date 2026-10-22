import { z } from "zod";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount } from "@/lib/validation/schemas";

export const rentInputSchema = z
  .object({
    annualIncome: nonNegativeAmount("Please enter annual income of $0 or more."),
    monthlyIncome: nonNegativeAmount("Please enter monthly income of $0 or more."),
    monthlyDebt: nonNegativeAmount("Please enter monthly debt of $0 or more."),
    desiredSavings: nonNegativeAmount(
      "Please enter desired monthly savings of $0 or more.",
    ),
    otherMonthlyExpenses: nonNegativeAmount(
      "Please enter other monthly expenses of $0 or more.",
    ),
  })
  .refine((value) => value.annualIncome > 0 || value.monthlyIncome > 0, {
    error: "Please enter an annual or monthly income greater than $0.",
    path: ["monthlyIncome"],
  });

export type RentInput = z.infer<typeof rentInputSchema>;

export type RentResult = {
  monthlyIncome: number;
  conservativeMin: number;
  conservativeMax: number;
  moderateMin: number;
  moderateMax: number;
  recommendedMax: number;
  remainingAfterRecommended: number;
  leftoverBeforeRent: number;
  usedThirtyPercentCap: boolean;
};

export function calculateRentAffordability(input: RentInput): RentResult {
  const monthlyIncome =
    input.monthlyIncome > 0 ? input.monthlyIncome : input.annualIncome / 12;
  const leftoverBeforeRent = Math.max(
    monthlyIncome -
      input.monthlyDebt -
      input.desiredSavings -
      input.otherMonthlyExpenses,
    0,
  );
  const conservativeMin = monthlyIncome * 0.25;
  const conservativeMax = monthlyIncome * 0.28;
  const moderateMin = monthlyIncome * 0.28;
  const moderateMax = monthlyIncome * 0.33;
  const thirtyPercent = monthlyIncome * 0.3;
  const recommendedMax = roundToCents(Math.min(thirtyPercent, leftoverBeforeRent));

  return {
    monthlyIncome: roundToCents(monthlyIncome),
    conservativeMin: roundToCents(conservativeMin),
    conservativeMax: roundToCents(conservativeMax),
    moderateMin: roundToCents(moderateMin),
    moderateMax: roundToCents(moderateMax),
    recommendedMax,
    remainingAfterRecommended: roundToCents(leftoverBeforeRent - recommendedMax),
    leftoverBeforeRent: roundToCents(leftoverBeforeRent),
    usedThirtyPercentCap: thirtyPercent <= leftoverBeforeRent,
  };
}
