import { describe, expect, it } from "vitest";
import { calculateHomeAffordability } from "@/lib/calculators/home";
import { monthlyLoanPayment } from "@/lib/calculators/amortization";

describe("calculateHomeAffordability", () => {
  it("keeps housing cost near the 28% cap", () => {
    const result = calculateHomeAffordability({
      annualIncome: 120000,
      monthlyDebt: 0,
      downPayment: 60000,
      interestRate: 6.5,
      loanTermYears: 30,
      propertyTaxRate: 1.1,
      homeInsuranceAnnual: 1800,
      hoaMonthly: 0,
    });
    const monthlyIncome = 10000;
    expect(result.totalMonthlyHousingCost).toBeLessThanOrEqual(
      monthlyIncome * 0.28 + 1,
    );
    expect(result.affordableHomePrice).toBeGreaterThan(60000);
    expect(result.loanAmount).toBeGreaterThan(0);
  });

  it("reduces price when monthly debt is high", () => {
    const lowDebt = calculateHomeAffordability({
      annualIncome: 100000,
      monthlyDebt: 0,
      downPayment: 20000,
      interestRate: 6,
      loanTermYears: 30,
      propertyTaxRate: 1,
      homeInsuranceAnnual: 1200,
      hoaMonthly: 0,
    });
    const highDebt = calculateHomeAffordability({
      annualIncome: 100000,
      monthlyDebt: 2000,
      downPayment: 20000,
      interestRate: 6,
      loanTermYears: 30,
      propertyTaxRate: 1,
      homeInsuranceAnnual: 1200,
      hoaMonthly: 0,
    });
    expect(highDebt.affordableHomePrice).toBeLessThan(lowDebt.affordableHomePrice);
  });

  it("matches amortization for the derived loan", () => {
    const result = calculateHomeAffordability({
      annualIncome: 90000,
      monthlyDebt: 400,
      downPayment: 30000,
      interestRate: 5,
      loanTermYears: 15,
      propertyTaxRate: 0.8,
      homeInsuranceAnnual: 1000,
      hoaMonthly: 50,
    });
    const expectedPi = monthlyLoanPayment(result.loanAmount, 5, 180);
    expect(result.monthlyPrincipalAndInterest).toBeCloseTo(expectedPi, 1);
  });

  it("handles 0% interest", () => {
    const result = calculateHomeAffordability({
      annualIncome: 80000,
      monthlyDebt: 0,
      downPayment: 10000,
      interestRate: 0,
      loanTermYears: 10,
      propertyTaxRate: 0,
      homeInsuranceAnnual: 0,
      hoaMonthly: 0,
    });
    expect(result.affordableHomePrice).toBeGreaterThan(10000);
    expect(result.monthlyPrincipalAndInterest).toBeGreaterThan(0);
  });
});
