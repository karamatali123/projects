type Redirect = {
  source: string;
  destination: string;
  permanent: true;
};

const aliasMap: Record<string, string[]> = {
  "/salary-calculator/": [
    "/take-home-pay-calculator",
    "/take-home-salary-calculator",
    "/salary-after-tax-calculator",
    "/monthly-salary-calculator",
    "/annual-salary-calculator",
    "/gross-pay-calculator",
    "/the-salary-calculator",
    "/my-salary-calculator",
    "/net-salary-calculator",
    "/salary-take-home-calculator",
    "/salary-calculator-2026",
    "/salary-calculator-2025",
    "/monthly-take-home-calculator",
    "/monthly-take-home-pay-calculator",
  ],
  "/uk-salary-calculator/": [
    "/salary-calculator-uk",
    "/uk-take-home-pay-calculator",
    "/take-home-pay-calculator-uk",
    "/take-home-salary-calculator-uk",
    "/uk-take-home-salary-calculator",
    "/uk-salary-tax-calculator",
    "/salary-tax-calculator-uk",
    "/net-salary-calculator-uk",
    "/net-pay-calculator-uk",
    "/monthly-salary-calculator-uk",
    "/take-home-pay-calculator-scotland",
    "/salary-calculator-scotland",
    "/scottish-income-tax-calculator",
    "/income-tax-calculator-uk",
    "/uk-income-tax-calculator",
    "/income-tax-uk-calculator",
    "/hourly-wage-calculator-uk",
    "/salary-to-hourly-rate-calculator-uk",
    "/salary-sacrifice-calculator",
    "/salary-sacrifice-pension-calculator",
    "/pension-salary-sacrifice-calculator",
    "/the-salary-calculator-uk",
    "/pro-rata-salary-calculator",
  ],
  "/paycheck-calculator/": [
    "/net-pay-calculator",
    "/paycheck-estimator",
    "/weekly-paycheck-calculator",
    "/biweekly-paycheck-calculator",
  ],
  "/hourly-to-salary-calculator/": [
    "/hourly-wage-calculator",
    "/salary-to-hourly-calculator",
    "/salary-calculator-hourly-rate",
    "/hourly-salary-calculator",
  ],
  "/overtime-calculator/": [
    "/time-and-a-half-calculator",
    "/overtime-pay-calculator",
    "/double-time-calculator",
  ],
  "/income-tax-calculator/": [
    "/tax-calculator",
    "/income-after-tax-calculator",
    "/salary-tax-calculator",
  ],
  "/salary-increase-calculator/": ["/raise-calculator", "/pay-raise-calculator"],
};

export const keywordRedirects: Redirect[] = Object.entries(aliasMap).flatMap(
  ([destination, aliases]) =>
    aliases.flatMap((alias) => {
      const withoutSlash = alias.replace(/\/$/, "");
      return [
        { source: withoutSlash, destination, permanent: true as const },
        { source: `${withoutSlash}/`, destination, permanent: true as const },
      ];
    }),
);
