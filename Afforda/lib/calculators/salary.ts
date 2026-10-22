import { z } from "zod";
import {
  fromAnnual,
  hourlyFromAnnual,
  type FilingStatus,
  type PayFrequency,
  toAnnual,
} from "@/lib/calculators/pay";
import { estimateAnnualTaxes } from "@/lib/calculators/tax";
import { roundToCents } from "@/lib/formatting/currency";
import { positiveAmount } from "@/lib/validation/schemas";

export const salaryInputSchema = z.object({
  amount: positiveAmount("Please enter a salary greater than $0."),
  payFrequency: z.enum(["annually", "monthly", "semimonthly", "biweekly", "weekly"]),
  hoursPerWeek: z.coerce.number().gt(0).max(168).default(40),
  weeksPerYear: z.coerce.number().gt(0).max(52).default(52),
  state: z.string().min(2),
  filingStatus: z.enum([
    "single",
    "married_jointly",
    "married_separately",
    "head_of_household",
  ]),
});

export type SalaryInput = {
  amount: number;
  payFrequency: PayFrequency;
  hoursPerWeek: number;
  weeksPerYear: number;
  state: string;
  filingStatus: FilingStatus;
};

export type SalaryResult = {
  annual: number;
  monthly: number;
  semimonthly: number;
  biweekly: number;
  weekly: number;
  hourly: number;
  estimatedFederalTax: number;
  estimatedStateTax: number;
  socialSecurity: number;
  medicare: number;
  estimatedAnnualTakeHome: number;
  estimatedMonthlyTakeHome: number;
  estimatedPeriodTakeHome: number;
  taxYear: number;
};

export function calculateSalary(input: SalaryInput): SalaryResult {
  const annual = toAnnual(input.amount, input.payFrequency);
  const taxes = estimateAnnualTaxes({
    annualGross: annual,
    filingStatus: input.filingStatus,
    state: input.state,
  });

  return {
    annual: roundToCents(annual),
    monthly: roundToCents(fromAnnual(annual, "monthly")),
    semimonthly: roundToCents(fromAnnual(annual, "semimonthly")),
    biweekly: roundToCents(fromAnnual(annual, "biweekly")),
    weekly: roundToCents(fromAnnual(annual, "weekly")),
    hourly: roundToCents(
      hourlyFromAnnual(annual, input.hoursPerWeek, input.weeksPerYear),
    ),
    estimatedFederalTax: roundToCents(taxes.federalIncomeTax),
    estimatedStateTax: roundToCents(taxes.stateIncomeTax),
    socialSecurity: roundToCents(taxes.socialSecurity),
    medicare: roundToCents(taxes.medicare),
    estimatedAnnualTakeHome: roundToCents(taxes.netPay),
    estimatedMonthlyTakeHome: roundToCents(taxes.netPay / 12),
    estimatedPeriodTakeHome: roundToCents(fromAnnual(taxes.netPay, input.payFrequency)),
    taxYear: taxes.taxYear,
  };
}
