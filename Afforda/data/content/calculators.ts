import { ukTaxSources, usTaxSources, type ContentSource } from "@/data/editorial";

export type FaqItem = { question: string; answer: string };

export type CalculatorContent = {
  intro: string;
  howItWorks: string;
  howToUse: string[];
  example: { title: string; body: string };
  assumptions: string[];
  faqs: FaqItem[];
  sources?: ContentSource[];
};

export const calculatorContent: Record<string, CalculatorContent> = {
  "salary-calculator": {
    intro:
      "Convert a US salary between annual, monthly, twice-monthly, biweekly, weekly, and hourly amounts, then see a 2026 take-home estimate after federal tax, a simplified state tax, Social Security, and Medicare. This is a planning figure, not a paycheck.",
    howItWorks:
      "The tool first turns your entry into annual gross pay: ×12 for monthly, ×24 for twice a month, ×26 for biweekly, ×52 for weekly. Hourly equivalent is annual pay divided by hours per week × weeks per year (2,080 hours if you leave 40 and 52). Tax is estimated on that annual amount using 2026 federal brackets and the standard deduction, employee FICA, and a condensed state table, then divided back into each pay period.",
    howToUse: [
      "Enter the salary in the unit on your offer or stub.",
      "Pick the state you file in and a filing status. State tax is a simplified estimate, not your return.",
      "Change hours or weeks only if your schedule is not a 40-hour, 52-week year.",
    ],
    example: {
      title: "Worked example",
      body: "Gross conversion is exact: $85,000 a year is $7,083.33 a month, $3,269.23 every two weeks, $1,634.62 a week, and $40.87 an hour at 40 × 52 hours. Take-home is lower after tax. In Texas (no state income tax) the federal and FICA estimate is higher than gross minus zero state tax; in California the same salary shows additional state tax, so net pay is lower than the Texas result.",
    },
    assumptions: [
      "Federal figures follow 2026 inflation-adjusted brackets and standard deductions. They do not run IRS Publication 15-T withholding, Form W-4 steps, or tax credits.",
      "Social Security is 6.2% of wages up to the 2026 wage base of $184,500. Medicare is 1.45%, plus 0.9% additional Medicare above the statutory threshold for your filing status.",
      "State tax is a flattened table. Local taxes (NYC, some Ohio cities, and others) are omitted.",
      "Pre-tax benefits, extra withholding, and itemized deductions are omitted here. Use the paycheck calculator if you want those on a single check.",
    ],
    faqs: [
      {
        question: "How is take-home different from monthly salary?",
        answer:
          "Monthly salary here is gross annual pay ÷ 12. Monthly take-home is estimated annual net pay ÷ 12. Net is gross minus the federal, state, and FICA amounts this page estimates.",
      },
      {
        question: "Why doesn’t this match my stub?",
        answer:
          "Payroll uses withholding methods, benefits, 401(k), local tax, and your W-4. This page annualizes a salary and applies a simplified annual tax model. Compare it with a stub, then use the paycheck calculator if you have per-check deductions.",
      },
      {
        question: "Do you use 2,080 hours for hourly equivalent?",
        answer:
          "Yes, when hours per week are 40 and weeks per year are 52. Some employers use 2,000 hours. Change the hour fields to match the offer letter.",
      },
      {
        question: "Is this for UK pay?",
        answer:
          "No. This page is US wages. The UK Salary Calculator uses 2026/27 income tax, National Insurance, and optional Scotland, salary sacrifice, and pro rata hours.",
      },
    ],
    sources: usTaxSources,
  },
  "uk-salary-calculator": {
    intro:
      "Estimate PAYE take-home for a UK employee in tax year 2026/27 (6 April 2026 to 5 April 2027). You can switch Scotland on, subtract pension salary sacrifice, and pro rata a full-time salary by hours. This is not a tax code or a P60.",
    howItWorks:
      "Pay is converted to an annual amount (×12 monthly, ×13 every four weeks, ×52 weekly). If your hours are below the full-time hours you enter, gross is scaled by that ratio. Salary sacrifice comes off gross before tax and employee National Insurance. Income tax uses a £12,570 personal allowance, tapered by £1 for every £2 of income over £100,000. England, Wales, and Northern Ireland use 20% / 40% / 45%. Scotland uses the 2026/27 starter through top rates. Employee Class 1 NI is 8% between £12,570 and £50,270 and 2% above. Take-home is reduced gross minus income tax minus NI.",
    howToUse: [
      "Enter the salary from your contract, usually the annual figure.",
      "Choose Scotland only if that is your tax residence; NI bands are the same either way.",
      "Enter an annual pension salary sacrifice if your employer takes pension from gross pay.",
      "To pro rata a full-time offer, keep full-time hours at 37.5 or 40 and lower your hours.",
    ],
    example: {
      title: "Worked example",
      body: "On £40,000 in England with a full personal allowance, taxable pay is £27,430. Income tax at 20% is £5,486. Employee NI on £27,430 above the primary threshold is £2,194.40. Take-home is £32,319.60, or £2,693.30 a month. The same salary in Scotland uses the devolved bands and shows slightly more income tax at this level; NI is unchanged.",
    },
    assumptions: [
      "Modeled as a single PAYE employment with the standard personal allowance. Emergency codes, Blind Person’s Allowance, and marriage allowance are omitted.",
      "Student loan, postgraduate loan, and attachment of earnings are omitted.",
      "Employer NI is not taken from take-home.",
      "NHS bands, high-cost area supplements, and provider-specific pensions are not built in. Enter the cash salary from your contract.",
    ],
    faqs: [
      {
        question: "How do you get monthly take-home from an annual salary?",
        answer:
          "Estimate annual net pay (gross after sacrifice, minus income tax and employee NI), then divide by 12. Gross monthly pay is still annual ÷ 12 before tax.",
      },
      {
        question: "What does salary sacrifice change?",
        answer:
          "The sacrificed amount leaves gross pay before income tax and NI, so both usually fall. Cash take-home is the smaller gross minus the new tax and NI. Enter the annual amount your payroll deducts.",
      },
      {
        question: "How is Scottish income tax different in 2026/27?",
        answer:
          "Scotland sets its own bands: 19% starter, 20% basic, 21% intermediate, 42% higher, 45% advanced, and 48% top, with thresholds published by the Scottish Government. National Insurance remains UK-wide.",
      },
      {
        question: "How do you pro rata a salary?",
        answer:
          "Full-time salary × (your hours ÷ full-time hours). A £37,500 salary at 30 hours of a 37.5-hour week is £30,000. Tax is then estimated on the pro-rated amount.",
      },
    ],
    sources: ukTaxSources,
  },
  "hourly-to-salary-calculator": {
    intro:
      "Turn an hourly wage into weekly, monthly, and annual gross pay, including regular overtime, or reverse a salaried offer into an hourly rate. Tax is not deducted on this page.",
    howItWorks:
      "Regular annual pay is hourly wage × hours per week × weeks per year. Overtime is overtime hours × hourly wage × the multiplier (1.5 for time and a half) × weeks per year. Monthly pay is the annual total ÷ 12. The salary-to-hourly side divides annual salary by the same hour total and ignores overtime.",
    howToUse: [
      "Enter the hourly rate and the hours you actually work in a typical week.",
      "Use 52 weeks unless you have unpaid time off you want excluded.",
      "Add weekly overtime and the multiplier from your employer if overtime is routine.",
      "Switch to salary → hourly when you have an annual number and want a rate.",
    ],
    example: {
      title: "Worked example",
      body: "$25 × 40 × 52 = $52,000 regular pay, or $1,000 a week. Four overtime hours at 1.5× add $150 a week and $7,800 a year, for $59,800 gross. Going the other way, $85,000 ÷ 2,080 hours is $40.87 an hour.",
    },
    assumptions: [
      "Results are gross pay. For take-home, annualize first and use the salary or paycheck calculator.",
      "Overtime hours are added on top of regular hours, not swapped in for them.",
      "Salary-to-hourly does not add overtime.",
    ],
    faqs: [
      {
        question: "Should I use 2,080 or 2,000 hours?",
        answer:
          "2,080 is 40 × 52. Some HR teams use 2,000. Match the hours in the offer; the two methods disagree by about 4%.",
      },
      {
        question: "Does this include overtime tax?",
        answer:
          "No. It only converts gross pay. Overtime is often taxed through withholding as supplemental wages, which this page does not model.",
      },
    ],
  },
  "paycheck-calculator": {
    intro:
      "Estimate one US paycheck after federal tax, state tax, Social Security, Medicare, and the deductions you type in. Use this when you have a gross amount per week, every two weeks, twice a month, or per month.",
    howItWorks:
      "Your period gross is multiplied up to an annual figure. Traditional 401(k) and other pre-tax amounts you enter reduce estimated income tax. FICA is estimated on wages after ordinary pre-tax deductions but not after 401(k), which matches typical employee treatment. Annual tax is divided by the number of pay periods to show one check.",
    howToUse: [
      "Enter gross pay for one period, or annual salary with frequency set to annually.",
      "Choose state and filing status.",
      "Copy pre-tax medical, retirement, and extra withholding from a stub if you have one. Roth 401(k) should be left at $0 in the retirement field.",
    ],
    example: {
      title: "Worked example",
      body: "A $3,269.23 biweekly gross amount is $85,000 a year. In California the estimate subtracts federal tax, CA state tax, Social Security, and Medicare from that check. Adding a $150 pre-tax medical deduction lowers taxable wages and the tax line; take-home falls by less than $150 because of that tax reduction.",
    },
    assumptions: [
      "This is not payroll software. It does not implement Publication 15-T percentage methods, W-4 step 2/3/4, or year-to-date true-up.",
      "Roth contributions do not reduce taxable wages. Put them in extra withholding only if you want a lower net for another reason.",
      "Local tax and garnishments are omitted unless you include them in the deduction fields.",
    ],
    faqs: [
      {
        question: "Are deductions per paycheck or per year?",
        answer:
          "Per paycheck, in the same unit as gross pay. If health insurance is $150 on each stub, enter 150, not 3,900.",
      },
      {
        question: "Why is this different from the salary calculator?",
        answer:
          "The salary page converts units and applies a simple annual tax model. This page is built for one check and the deductions on that check.",
      },
    ],
    sources: usTaxSources,
  },
  "rent-affordability-calculator": {
    intro:
      "See a rent cap from income, debt payments, savings, and other bills. The recommended maximum is the smaller of 30% of gross monthly income and what is left after those obligations. Landlords and cities do not have to follow this rule.",
    howItWorks:
      "Monthly income is the monthly figure you enter, or annual ÷ 12. Conservative rent is 25–28% of gross monthly income. Moderate rent is 28–33%. Recommended rent cannot exceed 30% of gross and cannot exceed leftover income after debt, savings, and other expenses.",
    howToUse: [
      "Enter annual income, monthly income, or both. If both are filled, monthly income is used.",
      "Include minimum debt payments, the savings you want to keep, and bills that are not rent.",
      "Read the recommended cap against the conservative and moderate ranges, not as a lease offer.",
    ],
    example: {
      title: "Worked example",
      body: "On $6,000 a month with $400 debt, $400 savings, and $600 other expenses, leftover income is $4,600. Thirty percent of gross is $1,800, so recommended rent is $1,800. After that rent, $2,800 remains for the items you already counted plus day-to-day spending. If leftover had been $1,200, the cap would fall to $1,200, not 30%.",
    },
    assumptions: [
      "The 30% guideline is a HUD-era rule of thumb. Many households in high-rent metros spend more.",
      "Income is treated as gross unless you enter take-home as monthly income on purpose, which makes the cap tighter.",
      "Utilities are not added unless you put them in other expenses.",
    ],
    faqs: [
      {
        question: "Should the 30% rule use gross or take-home pay?",
        answer:
          "The usual version uses gross. Using take-home as the income input produces a lower cap and is more conservative.",
      },
      {
        question: "What if leftover income is less than 30%?",
        answer:
          "Recommended rent drops to leftover income so the estimate does not spend money already reserved for debt, savings, and other bills.",
      },
    ],
  },
  "car-affordability-calculator": {
    intro:
      "Estimate a car price and monthly payment from income, down payment, term, APR, existing debt, and insurance. The default target payment is about 10% of gross monthly income; 15% is treated as a stretch. This is not a dealer quote.",
    howItWorks:
      "Ten percent of gross monthly income is converted to a loan amount with standard amortization (the same interest formula used in the debt tool). Adding your down payment gives a recommended price. Total monthly car cost is that payment plus the insurance you enter. A payment above 15% of income is flagged as aggressive.",
    howToUse: [
      "Enter income and a down payment you can actually write a check for.",
      "Match term and APR to quotes, or start with 60 months and a current average rate.",
      "Include insurance. Fuel, maintenance, and sales tax are omitted from the monthly total.",
    ],
    example: {
      title: "Worked example",
      body: "At $72,000 a year ($6,000 a month), a 10% payment target is $600. With 5% APR, 60 months, and $4,000 down, the amortized loan plus down payment lands in the mid-$30,000s before tax, title, and fees. Raising the term to 72 months increases the price the same payment can support and increases total interest.",
    },
    assumptions: [
      "Sales tax, title, dealer fees, and warranties are not in the price.",
      "Insurance is your estimate, not a carrier quote.",
      "A longer term lowers the payment and raises the chance the car is worth less than the loan.",
    ],
    faqs: [
      {
        question: "Is 10% of income a hard limit?",
        answer:
          "No. It is a planning target. High rent or other debt often means a smaller payment is safer.",
      },
      {
        question: "Does a larger down payment raise the recommended payment?",
        answer:
          "No. The payment target stays tied to income. A larger down payment increases the vehicle price that payment can buy.",
      },
    ],
  },
  "home-affordability-calculator": {
    intro:
      "Estimate a home price and monthly housing cost from income, debts, down payment, rate, term, property tax, insurance, and HOA. Housing is capped near 28% of gross monthly income; housing plus other debts near 36%. This is not mortgage approval.",
    howItWorks:
      "The 28/36 guidelines set a maximum housing payment and a maximum total debt payment. After insurance and HOA, the remainder is treated as principal and interest. Property tax is a percentage of home value, so price and tax are solved together with the loan payment.",
    howToUse: [
      "Enter gross annual income and monthly minimums on other debts.",
      "Add down payment, interest rate, and term in years.",
      "Use a local property tax rate (often 0.5%–2.5% of value) and realistic insurance and HOA.",
    ],
    example: {
      title: "Worked example",
      body: "On $120,000 income, $500 other monthly debt, 6.5% interest, 30 years, $60,000 down (20% of a $300,000 example price), 1.1% property tax, and $1,800 annual insurance, the tool solves for a price whose PITI + HOA sits near the 28% housing cap, then checks the 36% total-debt cap.",
    },
    assumptions: [
      "Lenders also review credit, assets, employment, and property type. Pre-approval is a different process.",
      "PMI is omitted. Conventional loans with less than 20% down usually add PMI, which would lower the affordable price.",
      "Closing costs, maintenance, and utilities are omitted from the monthly housing cost.",
    ],
    faqs: [
      {
        question: "What are the 28/36 rules?",
        answer:
          "They are common underwriting guidelines: housing up to about 28% of gross income, and housing plus other debts up to about 36%. Some loan programs allow higher ratios.",
      },
      {
        question: "Why is property tax a percentage of price?",
        answer:
          "Tax usually scales with assessed value. A rate keeps the estimate consistent as the affordable price changes.",
      },
    ],
  },
  "tip-calculator": {
    intro:
      "Add a tip to a US restaurant bill and split the total evenly. Buttons cover 15%, 18%, 20%, 22%, and 25%. For unequal shares, use the split-bill tool.",
    howItWorks:
      "Tip = bill × tip percent. Total = bill + tip. Each person pays total ÷ number of people. Amounts round to the nearest cent.",
    howToUse: [
      "Enter the amount you are tipping on (pre-tax subtotal or the full bill).",
      "Pick a percent or type your own.",
      "Set the number of people for an even split.",
    ],
    example: {
      title: "Worked example",
      body: "An $86.40 bill at 20% adds $17.28, for $103.68 total. Split three ways, that is $34.56 each.",
    },
    assumptions: [
      "Whether you tip on tax is your choice. Enter the line you want to tip on.",
      "This page splits evenly. Unequal orders belong on the Split Bill Calculator.",
    ],
    faqs: [
      {
        question: "What tip is typical in a US sit-down restaurant?",
        answer:
          "18–25% of the amount you choose to tip on is common for standard table service. Counter service and takeout are different, and some cities have service charges printed on the check.",
      },
    ],
  },
  "split-bill-calculator": {
    intro:
      "Split a bill and tip among a group. Shares can be equal, or you can lock a dollar amount for anyone who ordered more or less.",
    howItWorks:
      "Tip is added to the bill first. Equal mode divides the total by the number of people. Unequal mode keeps custom dollar amounts and splits whatever is left among people without a custom amount.",
    howToUse: [
      "Enter the bill and tip percent.",
      "Set how many people are paying.",
      "For an unequal split, enter a dollar amount only for people who should pay a specific share.",
    ],
    example: {
      title: "Worked example",
      body: "A $120 bill with 18% tip is $141.60. Four equal shares are $35.40. If one person pays a custom $50, the other three split the remaining $91.60.",
    },
    assumptions: [
      "Custom amounts are not forced to add up to the total. Leftover is split among people without a custom amount.",
      "Tax is assumed to be inside the bill you enter.",
    ],
    faqs: [
      {
        question: "What if custom amounts exceed the total?",
        answer:
          "People with custom amounts keep those figures. Remaining shares can be $0. Change the custom amounts so they match what the group agreed.",
      },
    ],
  },
  "overtime-calculator": {
    intro:
      "Calculate one week of gross overtime pay from an hourly rate, regular hours, and overtime hours. Use 1.5 for time and a half or 2 for double time. This is not a tax estimate.",
    howItWorks:
      "Regular pay = hourly rate × regular hours. Overtime rate = hourly rate × multiplier. Overtime pay = overtime rate × overtime hours. Weekly total is the sum.",
    howToUse: [
      "Enter your regular hourly rate.",
      "Enter regular hours (often 40) and overtime hours for that week.",
      "Use 1.5 unless your employer’s policy or state rule uses a different multiplier.",
    ],
    example: {
      title: "Worked example",
      body: "At $22 an hour with 40 regular hours and 6 overtime hours at 1.5×, regular pay is $880, overtime is $198, and the week totals $1,078 gross.",
    },
    assumptions: [
      "US federal overtime for most non-exempt employees is time and a half after 40 hours in a workweek (Fair Labor Standards Act). California and some other states also have daily overtime. Exemptions for salaried roles can apply.",
      "This page does not decide whether you are exempt. It only multiplies the hours you enter.",
    ],
    faqs: [
      {
        question: "How do I calculate time and a half?",
        answer:
          "Hourly rate × 1.5 × overtime hours. At $22, time and a half is $33 an hour; six hours add $198.",
      },
      {
        question: "Is overtime always 1.5×?",
        answer:
          "1.5× is the usual federal minimum for eligible employees. Some agreements pay 2× on holidays or extra hours past a daily cap.",
      },
    ],
    sources: [
      {
        name: "US Department of Labor, overtime pay",
        href: "https://www.dol.gov/agencies/whd/overtime",
      },
    ],
  },
  "debt-payoff-calculator": {
    intro:
      "See how long a balance takes to reach zero, how much interest you may pay, and what happens if you add extra to the monthly payment. Compare minimum-only with extra payments on the same APR.",
    howItWorks:
      "Each month, interest is balance × APR ÷ 12. The payment covers interest first, then principal. If the payment is at or below that month’s interest, principal never falls and payoff is reported as never. Extra payment is added to the monthly amount in the comparison path.",
    howToUse: [
      "Enter the current balance, APR, and the payment you actually make (or the minimum due).",
      "Add an extra monthly amount to see months saved and interest avoided.",
      "Read both paths on the results card before changing a payment in real life.",
    ],
    example: {
      title: "Worked example",
      body: "An $8,000 balance at 19.99% APR with a $200 payment accrues about $133 of interest in the first month, so only about $67 hits principal. Adding $100 extra each month cuts months and total interest compared with $200 alone. Exact totals depend on the remaining schedule; run both amounts in the form.",
    },
    assumptions: [
      "APR is treated as a constant annual rate divided by 12. Many cards compound daily, which can raise interest slightly.",
      "Payments are assumed on time with no new charges.",
      "Late fees and penalty APRs are omitted.",
    ],
    faqs: [
      {
        question: "Why does it say the debt never pays off?",
        answer:
          "The payment is not larger than that month’s interest, so principal does not decline. Raise the payment or lower the balance.",
      },
      {
        question: "Is this snowball or avalanche?",
        answer:
          "Neither. It models one balance. For several debts, run each balance separately or pay extra toward the highest APR (avalanche) or the smallest balance (snowball) using these results as inputs.",
      },
    ],
  },
  "income-tax-calculator": {
    intro:
      "Estimate 2026 US income tax on wages: federal income tax, a simplified state tax, Social Security, and Medicare. The remainder is income after tax for planning, not a filed Form 1040.",
    howItWorks:
      "Taxable income is wages minus the 2026 standard deduction for your filing status minus any pre-tax amount you enter. Federal tax uses the seven 2026 brackets. State tax uses the same condensed table as the salary tool. FICA is separate: Social Security at 6.2% up to $184,500, Medicare at 1.45% plus additional Medicare where it applies.",
    howToUse: [
      "Enter annual wages, not household net worth or capital gains.",
      "Choose filing status and state.",
      "Add pre-tax deductions such as health insurance if you want them in the estimate.",
    ],
    example: {
      title: "Worked example",
      body: "On $85,000 of wages as a single filer in Texas, federal tax applies after the 2026 single standard deduction, there is no state income tax in this table, and FICA is withheld on wages. Income after tax is $85,000 minus those lines. The same wages in California add a state tax line.",
    },
    assumptions: [
      "Credits (including the Child Tax Credit), itemized deductions, and local income taxes are omitted. Omitting credits can overstate tax.",
      "This is not a substitute for IRS Tax Withholding Estimator or software used to file.",
    ],
    faqs: [
      {
        question: "How is this different from the salary calculator?",
        answer:
          "Both use the same tax year tables. This page is built to show the tax lines on annual wages. The salary page also converts pay into monthly, biweekly, weekly, and hourly amounts.",
      },
      {
        question: "Does this include tax credits?",
        answer:
          "No. That is deliberate so the estimate stays inspectable. If you qualify for credits, actual tax can be lower.",
      },
    ],
    sources: usTaxSources,
  },
  "salary-increase-calculator": {
    intro:
      "See how a raise changes annual, monthly, biweekly, and hourly gross pay. Enter a percent, a dollar amount, or both. Tax on the raise is not deducted here.",
    howItWorks:
      "Current pay is converted to annual. A percent raise is applied to that annual figure. A dollar raise uses the same unit as current pay (annual dollars, or dollars per hour if you chose hourly), then is added. New monthly, biweekly, and hourly amounts are derived from the new annual pay.",
    howToUse: [
      "Enter current salary or hourly wage and the matching frequency.",
      "Type a raise percent (for example 4), a dollar increase, or both.",
      "For take-home on the new salary, copy the new annual amount into the salary calculator.",
    ],
    example: {
      title: "Worked example",
      body: "A 5% raise on $80,000 is $4,000 a year, about $333 more per month before tax. A $2 raise on a $25 hourly wage is an 8% increase ($4,160 a year at 40 × 52 hours), which is a different comparison than a flat $4,000 salary bump.",
    },
    assumptions: [
      "Results are gross. Use the salary or paycheck calculator for tax on the new amount.",
      "A dollar raise uses the same unit as current pay.",
    ],
    faqs: [
      {
        question: "Should I compare a percent raise with a dollar raise?",
        answer:
          "Yes. Convert both to annual dollars before you accept. A 4% raise on $70,000 is $2,800 a year; a $1 hourly raise at 2,080 hours is $2,080 a year.",
      },
      {
        question: "Does this include overtime on the new rate?",
        answer:
          "No. It applies the raise to the pay you enter. Use the overtime calculator with the new hourly rate if overtime is part of the job.",
      },
    ],
  },
};
