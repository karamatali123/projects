export const payFrequencies = [
  "annually",
  "monthly",
  "semimonthly",
  "biweekly",
  "weekly",
] as const;

export type PayFrequency = (typeof payFrequencies)[number];

export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  annually: 1,
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
};

export const payFrequencyLabels: Record<PayFrequency, string> = {
  annually: "Annually",
  monthly: "Monthly",
  semimonthly: "Twice a month",
  biweekly: "Biweekly",
  weekly: "Weekly",
};

export const filingStatuses = [
  "single",
  "married_jointly",
  "married_separately",
  "head_of_household",
] as const;

export type FilingStatus = (typeof filingStatuses)[number];

export const filingStatusLabels: Record<FilingStatus, string> = {
  single: "Single",
  married_jointly: "Married filing jointly",
  married_separately: "Married filing separately",
  head_of_household: "Head of household",
};

export const STANDARD_HOURS_PER_YEAR = 2080;

export function toAnnual(amount: number, frequency: PayFrequency): number {
  return amount * PERIODS_PER_YEAR[frequency];
}

export function fromAnnual(annual: number, frequency: PayFrequency): number {
  return annual / PERIODS_PER_YEAR[frequency];
}

export function hourlyFromAnnual(
  annual: number,
  hoursPerWeek = 40,
  weeksPerYear = 52,
): number {
  const hours = hoursPerWeek * weeksPerYear;
  if (hours <= 0) return 0;
  return annual / hours;
}

export function annualFromHourly(
  hourly: number,
  hoursPerWeek = 40,
  weeksPerYear = 52,
): number {
  return hourly * hoursPerWeek * weeksPerYear;
}
