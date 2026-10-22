import { describe, expect, it } from "vitest";
import { calculateCarAffordability } from "@/lib/calculators/car";

describe("calculateCarAffordability", () => {
  it("targets about 10% of monthly income for the payment", () => {
    const result = calculateCarAffordability({
      annualIncome: 72000,
      monthlyIncome: 0,
      downPayment: 4000,
      loanTermMonths: 60,
      interestRate: 5,
      monthlyDebt: 0,
      insuranceEstimate: 150,
      desiredMonthlyPayment: 0,
    });
    expect(result.monthlyIncome).toBe(6000);
    expect(result.recommendedMonthlyPayment).toBe(600);
    expect(result.recommendedCarPrice).toBeGreaterThan(4000);
    expect(result.estimatedTotalMonthlyCarCost).toBeGreaterThan(
      result.estimatedLoanPayment,
    );
  });

  it("flags an excessive desired payment", () => {
    const result = calculateCarAffordability({
      annualIncome: 48000,
      monthlyIncome: 0,
      downPayment: 0,
      loanTermMonths: 72,
      interestRate: 8,
      monthlyDebt: 0,
      insuranceEstimate: 200,
      desiredMonthlyPayment: 1200,
    });
    expect(result.isDesiredPaymentExcessive).toBe(true);
    expect(result.excessiveAmount).toBeGreaterThan(0);
  });

  it("handles 0% APR", () => {
    const result = calculateCarAffordability({
      annualIncome: 60000,
      monthlyIncome: 0,
      downPayment: 2000,
      loanTermMonths: 36,
      interestRate: 0,
      monthlyDebt: 0,
      insuranceEstimate: 100,
      desiredMonthlyPayment: 0,
    });
    expect(result.recommendedCarPrice).toBeCloseTo(2000 + 500 * 36, 0);
  });
});
