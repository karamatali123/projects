import { roundToCents } from "@/lib/formatting/currency";

/** UK tax year 6 April 2026 – 5 April 2027. Rates are estimates, not PAYE software. */
export const UK_TAX_YEAR = "2026/27";
export const UK_PERSONAL_ALLOWANCE = 12570;
export const UK_PA_TAPER_START = 100000;
export const UK_ADDITIONAL_RATE_THRESHOLD = 125140;
export const UK_BASIC_RATE_LIMIT = 37700;
export const UK_NI_PRIMARY_THRESHOLD = 12570;
export const UK_NI_UPPER_EARNINGS_LIMIT = 50270;
export const UK_NI_MAIN_RATE = 0.08;
export const UK_NI_UPPER_RATE = 0.02;

export type UkTaxRegion = "england_wales_ni" | "scotland";

export const ukTaxRegions = ["england_wales_ni", "scotland"] as const;

export const ukTaxRegionLabels: Record<UkTaxRegion, string> = {
  england_wales_ni: "England, Wales or Northern Ireland",
  scotland: "Scotland",
};

type Band = { upTo: number; rate: number };

function taxFromBands(amount: number, bands: Band[]): number {
  let tax = 0;
  let previous = 0;
  for (const band of bands) {
    const slice = Math.min(amount, band.upTo) - previous;
    if (slice > 0) tax += slice * band.rate;
    previous = band.upTo;
    if (amount <= band.upTo) break;
  }
  return tax;
}

export function ukPersonalAllowance(annualIncome: number): number {
  if (annualIncome <= UK_PA_TAPER_START) return UK_PERSONAL_ALLOWANCE;
  const reduction = Math.floor((annualIncome - UK_PA_TAPER_START) / 2);
  return Math.max(0, UK_PERSONAL_ALLOWANCE - reduction);
}

export function ukIncomeTax(annualIncome: number, region: UkTaxRegion): number {
  const allowance = ukPersonalAllowance(annualIncome);
  const taxable = Math.max(0, annualIncome - allowance);
  if (taxable === 0) return 0;

  const additionalStart = Math.max(0, UK_ADDITIONAL_RATE_THRESHOLD - allowance);

  if (region === "scotland") {
    return taxFromBands(taxable, [
      { upTo: 3967, rate: 0.19 },
      { upTo: 16956, rate: 0.2 },
      { upTo: 31092, rate: 0.21 },
      { upTo: 62430, rate: 0.42 },
      { upTo: additionalStart, rate: 0.45 },
      { upTo: Infinity, rate: 0.48 },
    ]);
  }

  return taxFromBands(taxable, [
    { upTo: UK_BASIC_RATE_LIMIT, rate: 0.2 },
    { upTo: additionalStart, rate: 0.4 },
    { upTo: Infinity, rate: 0.45 },
  ]);
}

export function ukEmployeeNationalInsurance(annualIncome: number): number {
  if (annualIncome <= UK_NI_PRIMARY_THRESHOLD) return 0;
  const mainBand =
    Math.min(annualIncome, UK_NI_UPPER_EARNINGS_LIMIT) - UK_NI_PRIMARY_THRESHOLD;
  const upperBand = Math.max(0, annualIncome - UK_NI_UPPER_EARNINGS_LIMIT);
  return mainBand * UK_NI_MAIN_RATE + upperBand * UK_NI_UPPER_RATE;
}

export function estimateUkAnnualTaxes(input: {
  annualGross: number;
  region: UkTaxRegion;
  pensionSacrifice?: number;
}) {
  const sacrifice = Math.min(
    Math.max(0, input.pensionSacrifice ?? 0),
    Math.max(0, input.annualGross),
  );
  const taxablePay = Math.max(0, input.annualGross - sacrifice);
  const incomeTax = roundToCents(ukIncomeTax(taxablePay, input.region));
  const nationalInsurance = roundToCents(ukEmployeeNationalInsurance(taxablePay));
  const takeHome = roundToCents(taxablePay - incomeTax - nationalInsurance);

  return {
    taxYear: UK_TAX_YEAR,
    personalAllowance: ukPersonalAllowance(taxablePay),
    taxablePay: roundToCents(taxablePay),
    pensionSacrifice: roundToCents(sacrifice),
    incomeTax,
    nationalInsurance,
    takeHome,
  };
}
