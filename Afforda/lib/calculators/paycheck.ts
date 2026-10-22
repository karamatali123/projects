import { z } from "zod";
import {
  PERIODS_PER_YEAR,
  fromAnnual,
  type FilingStatus,
  type PayFrequency,
  toAnnual,
} from "@/lib/calculators/pay";
import { estimateAnnualTaxes } from "@/lib/calculators/tax";
import { roundToCents } from "@/lib/formatting/currency";
import { nonNegativeAmount, positiveAmount } from "@/lib/validation/schemas";

export const paycheckInputSchema = z.object({
  grossPay: positiveAmount("Please enter a gross pay amount greater than $0."),
  payFrequency: z.enum(["annually", "monthly", "semimonthly", "biweekly", "weekly"]),
  state: z.string().min(2),
  filingStatus: z.enum([
    "single",
    "married_jointly",
    "married_separately",
    "head_of_household",
  ]),
  pretaxDeductions: nonNegativeAmount(
    "Please enter pre-tax deductions of $0 or more.",
  ),
  retirementContribution: nonNegativeAmount(
    "Please enter a retirement contribution of $0 or more.",
  ),
  additionalWithholding: nonNegativeAmount(
    "Please enter additional withholding of $0 or more.",
  ),
});

export type PaycheckInput = {
  grossPay: number;
  payFrequency: PayFrequency;
  state: string;
  filingStatus: FilingStatus;
  pretaxDeductions: number;
  retirementContribution: number;
  additionalWithholding: number;
};

export type PaycheckResult = {
  grossPay: number;
  estimatedFederalTax: number;
  estimatedStateTax: number;
  socialSecurity: number;
  medicare: number;
  pretaxDeductions: number;
  retirementContribution: number;
  additionalWithholding: number;
  otherDeductions: number;
  estimatedTakeHome: number;
  annualGross: number;
  annualTakeHome: number;
  taxYear: number;
};

export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  const periods = PERIODS_PER_YEAR[input.payFrequency];
  const annualGross = toAnnual(input.grossPay, input.payFrequency);
  const taxes = estimateAnnualTaxes({
    annualGross,
    filingStatus: input.filingStatus,
    state: input.state,
    pretaxDeductions: toAnnual(input.pretaxDeductions, input.payFrequency),
    retirementContribution: toAnnual(
      input.retirementContribution,
      input.payFrequency,
    ),
  });

  const estimatedFederalTax = fromAnnual(taxes.federalIncomeTax, input.payFrequency);
  const estimatedStateTax = fromAnnual(taxes.stateIncomeTax, input.payFrequency);
  const socialSecurity = fromAnnual(taxes.socialSecurity, input.payFrequency);
  const medicare = fromAnnual(taxes.medicare, input.payFrequency);
  const otherDeductions =
    input.pretaxDeductions +
    input.retirementContribution +
    input.additionalWithholding;
  const estimatedTakeHome =
    input.grossPay -
    estimatedFederalTax -
    estimatedStateTax -
    socialSecurity -
    medicare -
    otherDeductions;

  return {
    grossPay: roundToCents(input.grossPay),
    estimatedFederalTax: roundToCents(estimatedFederalTax),
    estimatedStateTax: roundToCents(estimatedStateTax),
    socialSecurity: roundToCents(socialSecurity),
    medicare: roundToCents(medicare),
    pretaxDeductions: roundToCents(input.pretaxDeductions),
    retirementContribution: roundToCents(input.retirementContribution),
    additionalWithholding: roundToCents(input.additionalWithholding),
    otherDeductions: roundToCents(otherDeductions),
    estimatedTakeHome: roundToCents(estimatedTakeHome),
    annualGross: roundToCents(annualGross),
    annualTakeHome: roundToCents(estimatedTakeHome * periods),
    taxYear: taxes.taxYear,
  };
}
