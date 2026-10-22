export const editorial = {
  reviewedOn: "October 7, 2026",
  reviewedIso: "2026-10-07",
} as const;

export type ContentSource = {
  name: string;
  href: string;
};

export const usTaxSources: ContentSource[] = [
  {
    name: "IRS Tax Year 2026 inflation adjustments (Rev. Proc. 2025-32)",
    href: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026",
  },
  {
    name: "Social Security Administration 2026 wage base",
    href: "https://www.ssa.gov/oact/cola/cbb.html",
  },
];

export const ukTaxSources: ContentSource[] = [
  {
    name: "GOV.UK employer rates and thresholds 2026 to 2027",
    href: "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
  },
  {
    name: "Scottish Income Tax 2026 to 2027 factsheet",
    href: "https://www.gov.scot/publications/scottish-income-tax-technical-factsheet/",
  },
];
