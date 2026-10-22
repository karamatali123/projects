import { z } from "zod";
import { monthlyLoanPayment } from "@/lib/calculators/amortization";
import { roundToCents } from "@/lib/formatting/currency";
import {
  interestRate,
  nonNegativeAmount,
  percentValue,
  positiveAmount,
} from "@/lib/validation/schemas";

export const homeInputSchema = z.object({
  annualIncome: positiveAmount("Please enter an annual income greater than $0."),
  monthlyDebt: nonNegativeAmount("Please enter monthly debt of $0 or more."),
  downPayment: nonNegativeAmount("Please enter a down payment of $0 or more."),
  interestRate: interestRate(),
  loanTermYears: z.coerce
    .number({ error: "Please enter a loan term." })
    .int()
    .min(1, { error: "Loan term must be at least 1 year." })
    .max(40, { error: "Loan term cannot exceed 40 years." }),
  propertyTaxRate: percentValue("Please enter a valid property tax rate.", 10),
  homeInsuranceAnnual: nonNegativeAmount(
    "Please enter home insurance of $0 or more.",
  ),
  hoaMonthly: nonNegativeAmount("Please enter HOA dues of $0 or more."),
});

export type HomeInput = z.infer<typeof homeInputSchema>;

export type HomeResult = {
  affordableHomePrice: number;
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthlyHousingCost: number;
  frontEndRatio: number;
  backEndRatio: number;
};

export function calculateHomeAffordability(input: HomeInput): HomeResult {
  const monthlyIncome = input.annualIncome / 12;
  const maxHousing = monthlyIncome * 0.28;
  const maxTotalDebt = monthlyIncome * 0.36;
  const maxHousingFromDti = Math.max(maxTotalDebt - input.monthlyDebt, 0);
  const maxPiti = Math.max(Math.min(maxHousing, maxHousingFromDti), 0);
  const monthlyInsurance = input.homeInsuranceAnnual / 12;
  const termMonths = input.loanTermYears * 12;
  const monthlyRate = input.interestRate / 100 / 12;
  const taxRateMonthly = input.propertyTaxRate / 100 / 12;

  let paymentPerDollar = 0;
  if (termMonths > 0) {
    if (monthlyRate === 0) {
      paymentPerDollar = 1 / termMonths;
    } else {
      const factor = (1 + monthlyRate) ** termMonths;
      paymentPerDollar = (monthlyRate * factor) / (factor - 1);
    }
  }

  const numerator =
    maxPiti - monthlyInsurance - input.hoaMonthly + paymentPerDollar * input.downPayment;
  const denominator = paymentPerDollar + taxRateMonthly;
  const affordableHomePrice = denominator > 0 ? Math.max(numerator / denominator, 0) : 0;
  const loanAmount = Math.max(affordableHomePrice - input.downPayment, 0);
  const monthlyPrincipalAndInterest = monthlyLoanPayment(
    loanAmount,
    input.interestRate,
    termMonths,
  );
  const monthlyPropertyTax = affordableHomePrice * taxRateMonthly;
  const totalMonthlyHousingCost =
    monthlyPrincipalAndInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    input.hoaMonthly;

  return {
    affordableHomePrice: roundToCents(affordableHomePrice),
    loanAmount: roundToCents(loanAmount),
    monthlyPrincipalAndInterest: roundToCents(monthlyPrincipalAndInterest),
    monthlyPropertyTax: roundToCents(monthlyPropertyTax),
    monthlyInsurance: roundToCents(monthlyInsurance),
    monthlyHoa: roundToCents(input.hoaMonthly),
    totalMonthlyHousingCost: roundToCents(totalMonthlyHousingCost),
    frontEndRatio: monthlyIncome > 0 ? totalMonthlyHousingCost / monthlyIncome : 0,
    backEndRatio:
      monthlyIncome > 0
        ? (totalMonthlyHousingCost + input.monthlyDebt) / monthlyIncome
        : 0,
  };
}
