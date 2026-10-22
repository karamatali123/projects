import { z } from "zod";
import {
  monthlyLoanPayment,
  presentValueFromPayment,
} from "@/lib/calculators/amortization";
import { roundToCents } from "@/lib/formatting/currency";
import { interestRate, nonNegativeAmount } from "@/lib/validation/schemas";

export const carInputSchema = z
  .object({
    annualIncome: nonNegativeAmount("Please enter annual income of $0 or more."),
    monthlyIncome: nonNegativeAmount("Please enter monthly income of $0 or more."),
    downPayment: nonNegativeAmount("Please enter a down payment of $0 or more."),
    loanTermMonths: z.coerce
      .number({ error: "Please enter a loan term." })
      .int()
      .min(12, { error: "Loan term must be at least 12 months." })
      .max(96, { error: "Loan term cannot exceed 96 months." }),
    interestRate: interestRate(),
    monthlyDebt: nonNegativeAmount("Please enter monthly debt of $0 or more."),
    insuranceEstimate: nonNegativeAmount(
      "Please enter an insurance estimate of $0 or more.",
    ),
    desiredMonthlyPayment: nonNegativeAmount(
      "Please enter a desired monthly payment of $0 or more.",
    ),
  })
  .refine((value) => value.annualIncome > 0 || value.monthlyIncome > 0, {
    error: "Please enter an annual or monthly income greater than $0.",
    path: ["monthlyIncome"],
  });

export type CarInput = z.infer<typeof carInputSchema>;

export type CarResult = {
  monthlyIncome: number;
  recommendedMonthlyPayment: number;
  recommendedCarPrice: number;
  estimatedLoanPayment: number;
  estimatedTotalMonthlyCarCost: number;
  maxComfortablePrice: number;
  excessiveAmount: number;
  isDesiredPaymentExcessive: boolean;
};

export function calculateCarAffordability(input: CarInput): CarResult {
  const monthlyIncome =
    input.monthlyIncome > 0 ? input.monthlyIncome : input.annualIncome / 12;
  const recommendedPayment = monthlyIncome * 0.1;
  const maxPayment = Math.max(monthlyIncome * 0.15 - input.monthlyDebt * 0.1, 0);
  const targetPayment =
    input.desiredMonthlyPayment > 0
      ? Math.min(input.desiredMonthlyPayment, maxPayment || input.desiredMonthlyPayment)
      : recommendedPayment;

  const affordableLoan = presentValueFromPayment(
    Math.max(targetPayment, 0),
    input.interestRate,
    input.loanTermMonths,
  );
  const recommendedCarPrice = affordableLoan + input.downPayment;
  const estimatedLoanPayment = monthlyLoanPayment(
    Math.max(recommendedCarPrice - input.downPayment, 0),
    input.interestRate,
    input.loanTermMonths,
  );
  const estimatedTotalMonthlyCarCost = estimatedLoanPayment + input.insuranceEstimate;

  const desiredLoan =
    input.desiredMonthlyPayment > 0
      ? presentValueFromPayment(
          input.desiredMonthlyPayment,
          input.interestRate,
          input.loanTermMonths,
        )
      : 0;
  const desiredPrice = desiredLoan + input.downPayment;
  const excessiveAmount = Math.max(desiredPrice - recommendedCarPrice, 0);
  const isDesiredPaymentExcessive =
    input.desiredMonthlyPayment > 0 &&
    (input.desiredMonthlyPayment > monthlyIncome * 0.15 ||
      input.desiredMonthlyPayment + input.insuranceEstimate > monthlyIncome * 0.2);

  return {
    monthlyIncome: roundToCents(monthlyIncome),
    recommendedMonthlyPayment: roundToCents(recommendedPayment),
    recommendedCarPrice: roundToCents(recommendedCarPrice),
    estimatedLoanPayment: roundToCents(estimatedLoanPayment),
    estimatedTotalMonthlyCarCost: roundToCents(estimatedTotalMonthlyCarCost),
    maxComfortablePrice: roundToCents(
      presentValueFromPayment(maxPayment, input.interestRate, input.loanTermMonths) +
        input.downPayment,
    ),
    excessiveAmount: roundToCents(excessiveAmount),
    isDesiredPaymentExcessive,
  };
}
