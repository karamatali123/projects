export const categorySlugs = [
  "income",
  "housing",
  "cars",
  "debt",
  "everyday-money",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type CategoryDefinition = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  href: string;
  description: string;
  intro: string;
  image: string;
  imageAlt: string;
  tint: string;
};

export const categories: CategoryDefinition[] = [
  {
    slug: "income",
    name: "Income & Pay",
    shortName: "Income",
    href: "/calculators/income/",
    description:
      "US salary conversion, paycheck estimates, overtime, raises, and 2026 income tax, plus a separate UK PAYE take-home calculator for 2026/27.",
    intro:
      "These tools convert pay, estimate a US tax haircut, or run UK PAYE for 2026/27. The US and UK engines are different formulas. Results are planning estimates, not a filed return or a payroll stub.",
    image: "/images/afforda-income.jpg",
    imageAlt:
      "Illustration of an earnings statement, a calculator, and a pen on linen.",
    tint: "#0c7a6e",
  },
  {
    slug: "housing",
    name: "Housing",
    shortName: "Housing",
    href: "/calculators/housing/",
    description:
      "Rent and home-price planning using the 30% rent guideline and common 28/36 housing ratios — estimates, not approval.",
    intro:
      "Housing is usually the largest monthly bill. The rent tool caps recommended rent at the smaller of 30% of gross income and leftover cash after debts. The home tool uses 28/36 guidelines. Neither is a lease or a mortgage offer.",
    image: "/images/afforda-housing.jpg",
    imageAlt:
      "Illustration of a wooden house model, a key, a lease agreement, and a navy notebook.",
    tint: "#e26a3d",
  },
  {
    slug: "cars",
    name: "Cars",
    shortName: "Cars",
    href: "/calculators/cars/",
    description:
      "Estimate a car price and monthly payment from income, down payment, term, APR, and insurance. Not a dealer quote.",
    intro:
      "The payment you can type into a calculator is only part of owning a car. This category starts from a share of income, then amortizes a loan and adds the insurance you enter. Fuel, tax, and dealer fees are omitted unless noted.",
    image: "/images/afforda-cars.jpg",
    imageAlt:
      "Illustration of a car key, an auto insurance policy, and a navy notebook.",
    tint: "#2b7bbf",
  },
  {
    slug: "debt",
    name: "Debt",
    shortName: "Debt",
    href: "/calculators/debt/",
    description:
      "See months to pay off a balance, interest cost, and what extra payments change on one APR.",
    intro:
      "Interest turns a small balance into a long bill. The live tool models one balance at a constant APR: interest first, then principal. If the payment does not cover that month’s interest, payoff is reported as never.",
    image: "/images/afforda-debt.jpg",
    imageAlt:
      "Illustration of blank cards, a calculator, and a payoff-plan notebook.",
    tint: "#d4a017",
  },
  {
    slug: "everyday-money",
    name: "Everyday Money",
    shortName: "Everyday",
    href: "/calculators/everyday-money/",
    description:
      "Tip and split-bill arithmetic for a restaurant check. Equal or custom shares, amounts to the cent.",
    intro:
      "These pages do not estimate tax or credit. They add a tip and divide a check. Use equal shares, or lock a dollar amount for anyone who ordered more or less.",
    image: "/images/afforda-everyday.jpg",
    imageAlt:
      "Illustration of a restaurant check, a tip jar, and a split-the-check notepad.",
    tint: "#7b5ea7",
  },
];

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categories.find((category) => category.slug === slug);
}
