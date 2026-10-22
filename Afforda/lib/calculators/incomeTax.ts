import { z } from "zod";
import type { FilingStatus } from "@/lib/calculators/pay";
import { estimateAnnualTaxes } from "@/lib/calculators/tax";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount } from "@/lib/validation/schemas";

export const incomeTaxInputSchema = z.object({
  annualIncome: positiveAmount("Please enter an income greater than $0."),
  filingStatus: z.enum([
    "single",
    "married_jointly",
    "married_separately",
    "head_of_household",
  ]),
  state: z.string().min(2),
  pretaxDeductions: nonNegativeAmount(
    "Please enter pre-tax deductions of $0 or more.",
  ),
});

export type IncomeTaxInput = {
  annualIncome: number;
  filingStatus: FilingStatus;
  state: string;
  pretaxDeductions: number;
};

export type IncomeTaxResult = {
  annualIncome: number;
  taxableIncome: number;
  standardDeduction: number;
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  incomeAfterTax: number;
  effectiveRate: number;
  taxYear: number;
};

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const taxes = estimateAnnualTaxes({
    annualGross: input.annualIncome,
    filingStatus: input.filingStatus,
    state: input.state,
    pretaxDeductions: input.pretaxDeductions,
  });
  const incomeAfterTax = taxes.netPay;
  const effectiveRate =
    input.annualIncome > 0 ? taxes.totalTax / input.annualIncome : 0;

  return {
    annualIncome: roundToCents(input.annualIncome),
    taxableIncome: roundToCents(taxes.taxableIncome),
    standardDeduction: taxes.standardDeduction,
    federalIncomeTax: roundToCents(taxes.federalIncomeTax),
    stateIncomeTax: roundToCents(taxes.stateIncomeTax),
    socialSecurity: roundToCents(taxes.socialSecurity),
    medicare: roundToCents(taxes.medicare),
    totalTax: roundToCents(taxes.totalTax),
    incomeAfterTax: roundToCents(incomeAfterTax),
    effectiveRate,
    taxYear: taxes.taxYear,
  };
}
