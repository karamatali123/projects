import type { FilingStatus } from "@/lib/calculators/pay";

export const TAX_YEAR = 2026;

export type TaxBracket = {
  upTo: number;
  rate: number;
};

export type StateTaxConfig =
  | { type: "none" }
  | { type: "flat"; rate: number }
  | { type: "progressive"; brackets: TaxBracket[] };

const FEDERAL_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16100,
  married_jointly: 32200,
  married_separately: 16100,
  head_of_household: 24150,
};

const FEDERAL_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { upTo: 24800, rate: 0.1 },
    { upTo: 100800, rate: 0.12 },
    { upTo: 211400, rate: 0.22 },
    { upTo: 403550, rate: 0.24 },
    { upTo: 512450, rate: 0.32 },
    { upTo: 768700, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 384350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { upTo: 17700, rate: 0.1 },
    { upTo: 67450, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256200, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE = 184500;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  married_jointly: 250000,
  married_separately: 125000,
  head_of_household: 200000,
};

/**
 * Simplified 2026-oriented state income tax estimates.
 * Progressive brackets are condensed approximations, not full state returns.
 */
export const STATE_TAX: Record<string, StateTaxConfig> = {
  AL: { type: "progressive", brackets: [{ upTo: 500, rate: 0.02 }, { upTo: 3000, rate: 0.04 }, { upTo: Infinity, rate: 0.05 }] },
  AK: { type: "none" },
  AZ: { type: "flat", rate: 0.025 },
  AR: { type: "flat", rate: 0.039 },
  CA: {
    type: "progressive",
    brackets: [
      { upTo: 10756, rate: 0.01 },
      { upTo: 25499, rate: 0.02 },
      { upTo: 40245, rate: 0.04 },
      { upTo: 55757, rate: 0.06 },
      { upTo: 70606, rate: 0.08 },
      { upTo: 360659, rate: 0.093 },
      { upTo: 432787, rate: 0.103 },
      { upTo: 721314, rate: 0.113 },
      { upTo: Infinity, rate: 0.123 },
    ],
  },
  CO: { type: "flat", rate: 0.044 },
  CT: {
    type: "progressive",
    brackets: [
      { upTo: 10000, rate: 0.02 },
      { upTo: 50000, rate: 0.045 },
      { upTo: 100000, rate: 0.055 },
      { upTo: 200000, rate: 0.06 },
      { upTo: 250000, rate: 0.065 },
      { upTo: 500000, rate: 0.069 },
      { upTo: Infinity, rate: 0.0699 },
    ],
  },
  DE: {
    type: "progressive",
    brackets: [
      { upTo: 2000, rate: 0.0 },
      { upTo: 5000, rate: 0.022 },
      { upTo: 10000, rate: 0.039 },
      { upTo: 20000, rate: 0.048 },
      { upTo: 25000, rate: 0.052 },
      { upTo: 60000, rate: 0.0555 },
      { upTo: Infinity, rate: 0.066 },
    ],
  },
  DC: {
    type: "progressive",
    brackets: [
      { upTo: 10000, rate: 0.04 },
      { upTo: 40000, rate: 0.06 },
      { upTo: 60000, rate: 0.065 },
      { upTo: 250000, rate: 0.085 },
      { upTo: 500000, rate: 0.0925 },
      { upTo: 1000000, rate: 0.0975 },
      { upTo: Infinity, rate: 0.1075 },
    ],
  },
  FL: { type: "none" },
  GA: { type: "flat", rate: 0.0539 },
  HI: {
    type: "progressive",
    brackets: [
      { upTo: 9600, rate: 0.014 },
      { upTo: 19200, rate: 0.032 },
      { upTo: 28800, rate: 0.055 },
      { upTo: 38400, rate: 0.064 },
      { upTo: 48000, rate: 0.068 },
      { upTo: 72000, rate: 0.072 },
      { upTo: 96000, rate: 0.076 },
      { upTo: 300000, rate: 0.079 },
      { upTo: Infinity, rate: 0.11 },
    ],
  },
  ID: { type: "flat", rate: 0.05695 },
  IL: { type: "flat", rate: 0.0495 },
  IN: { type: "flat", rate: 0.0305 },
  IA: { type: "flat", rate: 0.038 },
  KS: {
    type: "progressive",
    brackets: [
      { upTo: 23000, rate: 0.052 },
      { upTo: Infinity, rate: 0.0558 },
    ],
  },
  KY: { type: "flat", rate: 0.04 },
  LA: { type: "flat", rate: 0.03 },
  ME: {
    type: "progressive",
    brackets: [
      { upTo: 26800, rate: 0.058 },
      { upTo: 63450, rate: 0.0675 },
      { upTo: Infinity, rate: 0.0715 },
    ],
  },
  MD: {
    type: "progressive",
    brackets: [
      { upTo: 1000, rate: 0.02 },
      { upTo: 2000, rate: 0.03 },
      { upTo: 3000, rate: 0.04 },
      { upTo: 100000, rate: 0.0475 },
      { upTo: 125000, rate: 0.05 },
      { upTo: 150000, rate: 0.0525 },
      { upTo: 250000, rate: 0.055 },
      { upTo: Infinity, rate: 0.0575 },
    ],
  },
  MA: { type: "flat", rate: 0.05 },
  MI: { type: "flat", rate: 0.0425 },
  MN: {
    type: "progressive",
    brackets: [
      { upTo: 31690, rate: 0.0535 },
      { upTo: 104090, rate: 0.068 },
      { upTo: 193240, rate: 0.0785 },
      { upTo: Infinity, rate: 0.0985 },
    ],
  },
  MS: { type: "flat", rate: 0.04 },
  MO: { type: "flat", rate: 0.047 },
  MT: { type: "flat", rate: 0.059 },
  NE: {
    type: "progressive",
    brackets: [
      { upTo: 3700, rate: 0.0246 },
      { upTo: 22170, rate: 0.0351 },
      { upTo: 35730, rate: 0.0501 },
      { upTo: Infinity, rate: 0.0584 },
    ],
  },
  NV: { type: "none" },
  NH: { type: "none" },
  NJ: {
    type: "progressive",
    brackets: [
      { upTo: 20000, rate: 0.014 },
      { upTo: 35000, rate: 0.0175 },
      { upTo: 40000, rate: 0.035 },
      { upTo: 75000, rate: 0.05525 },
      { upTo: 500000, rate: 0.0637 },
      { upTo: 1000000, rate: 0.0897 },
      { upTo: Infinity, rate: 0.1075 },
    ],
  },
  NM: {
    type: "progressive",
    brackets: [
      { upTo: 5500, rate: 0.015 },
      { upTo: 16500, rate: 0.032 },
      { upTo: 33500, rate: 0.047 },
      { upTo: 66500, rate: 0.049 },
      { upTo: 210000, rate: 0.048 },
      { upTo: Infinity, rate: 0.059 },
    ],
  },
  NY: {
    type: "progressive",
    brackets: [
      { upTo: 8500, rate: 0.04 },
      { upTo: 11700, rate: 0.045 },
      { upTo: 13900, rate: 0.0525 },
      { upTo: 80650, rate: 0.055 },
      { upTo: 215400, rate: 0.06 },
      { upTo: 1077550, rate: 0.0685 },
      { upTo: 5000000, rate: 0.0965 },
      { upTo: 25000000, rate: 0.103 },
      { upTo: Infinity, rate: 0.109 },
    ],
  },
  NC: { type: "flat", rate: 0.0425 },
  ND: {
    type: "progressive",
    brackets: [
      { upTo: 44725, rate: 0.0 },
      { upTo: 225975, rate: 0.0195 },
      { upTo: Infinity, rate: 0.025 },
    ],
  },
  OH: { type: "flat", rate: 0.035 },
  OK: { type: "flat", rate: 0.0475 },
  OR: {
    type: "progressive",
    brackets: [
      { upTo: 4300, rate: 0.0475 },
      { upTo: 10750, rate: 0.0675 },
      { upTo: 125000, rate: 0.0875 },
      { upTo: Infinity, rate: 0.099 },
    ],
  },
  PA: { type: "flat", rate: 0.0307 },
  RI: {
    type: "progressive",
    brackets: [
      { upTo: 77450, rate: 0.0375 },
      { upTo: 176050, rate: 0.0475 },
      { upTo: Infinity, rate: 0.0599 },
    ],
  },
  SC: {
    type: "progressive",
    brackets: [
      { upTo: 3460, rate: 0.0 },
      { upTo: 17330, rate: 0.03 },
      { upTo: Infinity, rate: 0.062 },
    ],
  },
  SD: { type: "none" },
  TN: { type: "none" },
  TX: { type: "none" },
  UT: { type: "flat", rate: 0.0455 },
  VT: {
    type: "progressive",
    brackets: [
      { upTo: 45400, rate: 0.0335 },
      { upTo: 110050, rate: 0.066 },
      { upTo: 229150, rate: 0.076 },
      { upTo: Infinity, rate: 0.0875 },
    ],
  },
  VA: {
    type: "progressive",
    brackets: [
      { upTo: 3000, rate: 0.02 },
      { upTo: 5000, rate: 0.03 },
      { upTo: 17000, rate: 0.05 },
      { upTo: Infinity, rate: 0.0575 },
    ],
  },
  WA: { type: "none" },
  WV: {
    type: "progressive",
    brackets: [
      { upTo: 10000, rate: 0.0236 },
      { upTo: 25000, rate: 0.0315 },
      { upTo: 40000, rate: 0.0354 },
      { upTo: 60000, rate: 0.0472 },
      { upTo: Infinity, rate: 0.0512 },
    ],
  },
  WI: {
    type: "progressive",
    brackets: [
      { upTo: 14320, rate: 0.035 },
      { upTo: 28650, rate: 0.044 },
      { upTo: 315310, rate: 0.053 },
      { upTo: Infinity, rate: 0.0765 },
    ],
  },
  WY: { type: "none" },
};

export function taxFromBrackets(taxableIncome: number, brackets: TaxBracket[]): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let previous = 0;
  for (const bracket of brackets) {
    const taxableInBracket = Math.min(taxableIncome, bracket.upTo) - previous;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    if (taxableIncome <= bracket.upTo) break;
    previous = bracket.upTo;
  }
  return tax;
}

export function estimateFederalIncomeTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
): number {
  return taxFromBrackets(taxableIncome, FEDERAL_BRACKETS[filingStatus]);
}

export function getStandardDeduction(filingStatus: FilingStatus): number {
  return FEDERAL_STANDARD_DEDUCTION[filingStatus];
}

export function estimateSocialSecurityTax(wages: number): number {
  const taxable = Math.min(Math.max(wages, 0), SOCIAL_SECURITY_WAGE_BASE);
  return taxable * SOCIAL_SECURITY_RATE;
}

export function estimateMedicareTax(wages: number, filingStatus: FilingStatus): number {
  const safeWages = Math.max(wages, 0);
  const base = safeWages * MEDICARE_RATE;
  const extraThreshold = ADDITIONAL_MEDICARE_THRESHOLD[filingStatus];
  const extra = Math.max(0, safeWages - extraThreshold) * ADDITIONAL_MEDICARE_RATE;
  return base + extra;
}

export function estimateStateIncomeTax(taxableIncome: number, stateCode: string): number {
  const config = STATE_TAX[stateCode] ?? { type: "none" as const };
  if (taxableIncome <= 0 || config.type === "none") return 0;
  if (config.type === "flat") return taxableIncome * config.rate;
  return taxFromBrackets(taxableIncome, config.brackets);
}

export type AnnualTaxEstimateInput = {
  annualGross: number;
  filingStatus: FilingStatus;
  state: string;
  pretaxDeductions?: number;
  retirementContribution?: number;
};

export type AnnualTaxEstimate = {
  taxYear: number;
  annualGross: number;
  taxableIncome: number;
  standardDeduction: number;
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  netPay: number;
  isEstimate: true;
};

export function estimateAnnualTaxes(input: AnnualTaxEstimateInput): AnnualTaxEstimate {
  const pretax = Math.max(input.pretaxDeductions ?? 0, 0);
  const retirement = Math.max(input.retirementContribution ?? 0, 0);
  const annualGross = Math.max(input.annualGross, 0);
  const ficaWages = Math.max(annualGross - pretax, 0);
  const incomeTaxableWages = Math.max(annualGross - pretax - retirement, 0);
  const standardDeduction = getStandardDeduction(input.filingStatus);
  const taxableIncome = Math.max(incomeTaxableWages - standardDeduction, 0);
  const federalIncomeTax = estimateFederalIncomeTax(taxableIncome, input.filingStatus);
  const stateIncomeTax = estimateStateIncomeTax(taxableIncome, input.state);
  const socialSecurity = estimateSocialSecurityTax(ficaWages);
  const medicare = estimateMedicareTax(ficaWages, input.filingStatus);
  const totalTax = federalIncomeTax + stateIncomeTax + socialSecurity + medicare;
  const netPay = annualGross - pretax - retirement - totalTax;

  return {
    taxYear: TAX_YEAR,
    annualGross,
    taxableIncome,
    standardDeduction,
    federalIncomeTax,
    stateIncomeTax,
    socialSecurity,
    medicare,
    totalTax,
    netPay,
    isEstimate: true,
  };
}
