import { categories, type CategorySlug } from "./categories";

export type CalculatorStatus = "live" | "coming-soon";

export type CalculatorDefinition = {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  href: string;
  keywords: string[];
  related: string[];
  status: CalculatorStatus;
  popular?: boolean;
  /** Exact-match URLs that 301 to this calculator. */
  aliases?: string[];
  seo: {
    title: string;
    description: string;
  };
};

export const calculators: CalculatorDefinition[] = [
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    category: "income",
    description:
      "Convert annual, monthly, biweekly, weekly, and hourly US pay, then see a 2026 take-home estimate after tax.",
    href: "/salary-calculator/",
    keywords: [
      "salary calculator",
      "take home pay calculator",
      "take home salary",
      "salary after tax",
      "monthly salary",
      "annual salary",
      "gross pay",
      "net pay",
      "hourly equivalent",
    ],
    related: [
      "paycheck-calculator",
      "income-tax-calculator",
      "hourly-to-salary-calculator",
      "uk-salary-calculator",
    ],
    status: "live",
    popular: true,
    aliases: [
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
    seo: {
      title: "Salary Calculator – US Pay Conversion and Take-Home Estimate",
      description:
        "Convert a US salary between annual, monthly, biweekly, weekly, and hourly pay, then see a 2026 federal, state, and FICA take-home estimate. Not a paycheck.",
    },
  },
  {
    slug: "uk-salary-calculator",
    name: "UK Salary Calculator",
    category: "income",
    description:
      "Estimate 2026/27 UK take-home after income tax and National Insurance, with Scotland, salary sacrifice, and pro rata hours.",
    href: "/uk-salary-calculator/",
    keywords: [
      "uk salary calculator",
      "salary calculator uk",
      "take home pay calculator uk",
      "uk take home pay",
      "net salary calculator uk",
      "monthly salary calculator uk",
      "scottish income tax",
      "salary sacrifice calculator",
      "pro rata salary",
      "after tax salary uk",
    ],
    related: [
      "salary-calculator",
      "income-tax-calculator",
      "hourly-to-salary-calculator",
      "paycheck-calculator",
    ],
    status: "live",
    popular: true,
    aliases: [
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
    seo: {
      title: "UK Salary Calculator – 2026/27 PAYE Take-Home Estimate",
      description:
        "Estimate UK take-home pay for tax year 2026/27 after income tax and employee National Insurance. Includes Scotland, salary sacrifice, and pro rata hours.",
    },
  },
  {
    slug: "paycheck-calculator",
    name: "Paycheck Calculator",
    category: "income",
    description:
      "Estimate one US paycheck after simplified federal tax, state tax, FICA, and the deductions you enter.",
    href: "/paycheck-calculator/",
    keywords: [
      "paycheck calculator",
      "paycheck estimator",
      "net pay calculator",
      "weekly paycheck",
      "biweekly paycheck",
      "take-home pay",
      "gross pay",
      "withholding",
      "FICA",
    ],
    related: [
      "salary-calculator",
      "income-tax-calculator",
      "hourly-to-salary-calculator",
      "overtime-calculator",
    ],
    status: "live",
    popular: true,
    aliases: [
      "/net-pay-calculator",
      "/paycheck-estimator",
      "/weekly-paycheck-calculator",
      "/biweekly-paycheck-calculator",
    ],
    seo: {
      title: "Paycheck Calculator – Estimate One US Net Paycheck",
      description:
        "Estimate weekly, biweekly, or monthly take-home from one gross paycheck after simplified federal tax, state tax, and FICA, plus deductions you type in.",
    },
  },
  {
    slug: "hourly-to-salary-calculator",
    name: "Hourly Wage Calculator",
    category: "income",
    description:
      "Convert an hourly wage to weekly, monthly, and annual salary, including overtime. Also convert salary to an hourly rate.",
    href: "/hourly-to-salary-calculator/",
    keywords: [
      "hourly wage calculator",
      "hourly to salary calculator",
      "salary to hourly calculator",
      "hourly rate",
      "annual income",
      "overtime wage",
    ],
    related: [
      "salary-calculator",
      "overtime-calculator",
      "paycheck-calculator",
      "salary-increase-calculator",
    ],
    status: "live",
    popular: true,
    aliases: [
      "/hourly-wage-calculator",
      "/salary-to-hourly-calculator",
      "/salary-calculator-hourly-rate",
      "/hourly-salary-calculator",
    ],
    seo: {
      title: "Hourly Wage Calculator – Hourly Pay to Annual Salary",
      description:
        "Turn an hourly wage into weekly, monthly, and annual gross pay, including overtime, or convert an annual salary to an hourly rate. Tax is not deducted.",
    },
  },
  {
    slug: "overtime-calculator",
    name: "Overtime Calculator",
    category: "income",
    description:
      "Calculate overtime pay, time and a half, and double time from your hourly rate.",
    href: "/overtime-calculator/",
    keywords: [
      "overtime calculator",
      "overtime pay calculator",
      "time and a half calculator",
      "double time calculator",
      "hourly overtime",
    ],
    related: [
      "hourly-to-salary-calculator",
      "salary-calculator",
      "paycheck-calculator",
      "salary-increase-calculator",
    ],
    status: "live",
    aliases: [
      "/time-and-a-half-calculator",
      "/overtime-pay-calculator",
      "/double-time-calculator",
    ],
    seo: {
      title: "Overtime Calculator – Time and a Half Pay",
      description:
        "Calculate one week of gross overtime from an hourly rate, regular hours, and overtime hours. Use 1.5 for time and a half or 2 for double time.",
    },
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    category: "income",
    description:
      "Estimate federal income tax, state tax, FICA, and income after tax for a US filing status.",
    href: "/income-tax-calculator/",
    keywords: [
      "income tax calculator",
      "tax calculator",
      "salary after tax",
      "federal income tax",
      "after tax income",
    ],
    related: [
      "salary-calculator",
      "paycheck-calculator",
      "uk-salary-calculator",
      "hourly-to-salary-calculator",
    ],
    status: "live",
    popular: true,
    aliases: [
      "/tax-calculator",
      "/income-after-tax-calculator",
      "/salary-tax-calculator",
    ],
    seo: {
      title: "Income Tax Calculator – 2026 US Wage Estimate",
      description:
        "Estimate 2026 US tax on wages: federal income tax, a simplified state tax, Social Security, and Medicare. This is not a filed return.",
    },
  },
  {
    slug: "salary-increase-calculator",
    name: "Salary Increase Calculator",
    category: "income",
    description:
      "See how a raise changes annual, monthly, and hourly pay from a percent or dollar increase.",
    href: "/salary-increase-calculator/",
    keywords: [
      "salary increase calculator",
      "raise calculator",
      "pay raise",
      "salary raise",
      "percent increase",
    ],
    related: [
      "salary-calculator",
      "hourly-to-salary-calculator",
      "paycheck-calculator",
      "overtime-calculator",
    ],
    status: "live",
    aliases: ["/raise-calculator", "/pay-raise-calculator"],
    seo: {
      title: "Salary Increase Calculator – Percent or Dollar Raise",
      description:
        "See how a raise changes annual, monthly, biweekly, and hourly gross pay. Enter a percent, a dollar amount, or both. Tax is not deducted.",
    },
  },
  {
    slug: "rent-affordability-calculator",
    name: "Rent Affordability Calculator",
    category: "housing",
    description:
      "Estimate a recommended rent range from income, debt, savings goals, and other expenses.",
    href: "/rent-affordability-calculator/",
    keywords: ["rent", "afford rent", "30 percent rule", "housing budget"],
    related: [
      "salary-calculator",
      "home-affordability-calculator",
      "debt-payoff-calculator",
      "paycheck-calculator",
    ],
    status: "live",
    popular: true,
    seo: {
      title: "Rent Affordability Calculator – 30% Income Guideline",
      description:
        "Estimate a rent cap from income, debt, savings, and other bills. Recommended rent is the smaller of 30% of gross monthly income and leftover cash.",
    },
  },
  {
    slug: "home-affordability-calculator",
    name: "Home Affordability Calculator",
    category: "housing",
    description:
      "Estimate an affordable home price and monthly housing cost using common 28/36 guidelines.",
    href: "/home-affordability-calculator/",
    keywords: ["home affordability", "mortgage estimate", "how much house", "PITI"],
    related: [
      "rent-affordability-calculator",
      "salary-calculator",
      "debt-payoff-calculator",
      "car-affordability-calculator",
    ],
    status: "live",
    popular: true,
    seo: {
      title: "Home Affordability Calculator – 28/36 Planning Estimate",
      description:
        "Estimate a home price and monthly housing cost from income, debts, down payment, rate, tax, and insurance using common 28/36 guidelines. Not mortgage approval.",
    },
  },
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "housing",
    description: "Estimate monthly principal and interest for a home loan.",
    href: "/mortgage-calculator/",
    keywords: ["mortgage", "monthly payment", "home loan"],
    related: ["home-affordability-calculator", "rent-affordability-calculator"],
    status: "coming-soon",
    seo: {
      title: "Mortgage Calculator",
      description: "Coming soon: estimate a monthly mortgage payment.",
    },
  },
  {
    slug: "car-affordability-calculator",
    name: "Car Affordability Calculator",
    category: "cars",
    description:
      "Estimate a comfortable car price, monthly loan payment, and total monthly car cost.",
    href: "/car-affordability-calculator/",
    keywords: ["car affordability", "auto loan", "car payment", "how much car"],
    related: [
      "salary-calculator",
      "home-affordability-calculator",
      "debt-payoff-calculator",
      "paycheck-calculator",
    ],
    status: "live",
    popular: true,
    seo: {
      title: "Car Affordability Calculator – Price and Payment Estimate",
      description:
        "Estimate a car price and monthly payment from income, down payment, term, APR, and insurance. The default target is about 10% of gross monthly income.",
    },
  },
  {
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    category: "cars",
    description: "Estimate monthly payments for a car loan.",
    href: "/auto-loan-calculator/",
    keywords: ["auto loan", "car loan payment"],
    related: ["car-affordability-calculator"],
    status: "coming-soon",
    seo: {
      title: "Auto Loan Calculator",
      description: "Coming soon: estimate an auto loan payment.",
    },
  },
  {
    slug: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    category: "debt",
    description:
      "See how long a balance takes to pay off, total interest, and savings from extra payments.",
    href: "/debt-payoff-calculator/",
    keywords: ["debt payoff", "pay off debt", "APR", "extra payment", "interest"],
    related: [
      "salary-calculator",
      "paycheck-calculator",
      "rent-affordability-calculator",
      "car-affordability-calculator",
    ],
    status: "live",
    popular: true,
    seo: {
      title: "Debt Payoff Calculator – Time and Interest",
      description:
        "See how long a balance takes to reach zero, how much interest you may pay, and what extra monthly payments change. One APR at a time.",
    },
  },
  {
    slug: "credit-card-payoff",
    name: "Credit Card Payoff",
    category: "debt",
    description: "Estimate time and interest to pay off a credit card balance.",
    href: "/credit-card-payoff/",
    keywords: ["credit card", "payoff"],
    related: ["debt-payoff-calculator"],
    status: "coming-soon",
    seo: {
      title: "Credit Card Payoff Calculator",
      description: "Coming soon: estimate credit card payoff time.",
    },
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "debt",
    description: "Estimate payment, interest, and payoff time for a fixed loan.",
    href: "/loan-calculator/",
    keywords: ["loan", "personal loan"],
    related: ["debt-payoff-calculator"],
    status: "coming-soon",
    seo: {
      title: "Loan Calculator",
      description: "Coming soon: estimate a fixed loan payment.",
    },
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "everyday-money",
    description: "Calculate tip, total bill, and amount per person with quick tip buttons.",
    href: "/tip-calculator/",
    keywords: ["tip", "gratuity", "split check", "restaurant"],
    related: [
      "split-bill-calculator",
      "hourly-to-salary-calculator",
      "overtime-calculator",
      "salary-calculator",
    ],
    status: "live",
    popular: true,
    seo: {
      title: "Tip Calculator – Percent, Total, and Split",
      description:
        "Add a 15–25% tip to a US restaurant bill and split the total evenly. Amounts round to the nearest cent.",
    },
  },
  {
    slug: "split-bill-calculator",
    name: "Split Bill Calculator",
    category: "everyday-money",
    description:
      "Split a bill and tip among a group, with optional unequal amounts.",
    href: "/split-bill-calculator/",
    keywords: ["split bill", "split check", "group dinner", "unequal split"],
    related: [
      "tip-calculator",
      "overtime-calculator",
      "debt-payoff-calculator",
      "rent-affordability-calculator",
    ],
    status: "live",
    seo: {
      title: "Split Bill Calculator – Equal or Custom Shares",
      description:
        "Split a bill and tip among a group. Use equal shares, or lock a dollar amount for anyone who ordered more or less.",
    },
  },
  {
    slug: "budget-calculator",
    name: "Budget Calculator",
    category: "everyday-money",
    description: "Plan monthly income, needs, wants, and savings.",
    href: "/budget-calculator/",
    keywords: ["budget", "50/30/20"],
    related: ["salary-calculator", "rent-affordability-calculator"],
    status: "coming-soon",
    seo: {
      title: "Budget Calculator",
      description: "Coming soon: a simple monthly budget calculator.",
    },
  },
];

const bySlug = new Map(calculators.map((calculator) => [calculator.slug, calculator]));

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return bySlug.get(slug);
}

export function liveCalculators(): CalculatorDefinition[] {
  return calculators.filter((calculator) => calculator.status === "live");
}

export function popularCalculators(): CalculatorDefinition[] {
  return liveCalculators().filter((calculator) => calculator.popular);
}

export function calculatorsByCategory(category: CategorySlug): CalculatorDefinition[] {
  return calculators.filter((calculator) => calculator.category === category);
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return liveCalculators();
  return liveCalculators().filter((calculator) => {
    const haystack = [
      calculator.name,
      calculator.description,
      calculator.category,
      ...(calculator.aliases ?? []),
      ...calculator.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function getRelatedCalculators(
  slug: string,
  limit = 4,
): CalculatorDefinition[] {
  const current = getCalculator(slug);
  if (!current) return liveCalculators().slice(0, limit);

  const related = current.related
    .map((relatedSlug) => getCalculator(relatedSlug))
    .filter((calculator): calculator is CalculatorDefinition =>
      Boolean(calculator && calculator.status === "live" && calculator.slug !== slug),
    );

  if (related.length >= limit) return related.slice(0, limit);

  const extras = liveCalculators().filter(
    (calculator) =>
      calculator.slug !== slug &&
      !related.some((item) => item.slug === calculator.slug) &&
      (calculator.category === current.category || calculator.popular),
  );

  return [...related, ...extras].slice(0, limit);
}

export function getCategoryForCalculator(slug: string) {
  const calculator = getCalculator(slug);
  if (!calculator) return undefined;
  return categories.find((category) => category.slug === calculator.category);
}
