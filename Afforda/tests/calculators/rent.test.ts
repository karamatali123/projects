import { describe, expect, it } from "vitest";
import { calculateRentAffordability, rentInputSchema } from "@/lib/calculators/rent";

describe("calculateRentAffordability", () => {
  it("uses 30% of gross when leftover is higher", () => {
    const result = calculateRentAffordability({
      annualIncome: 72000,
      monthlyIncome: 0,
      monthlyDebt: 200,
      desiredSavings: 200,
      otherMonthlyExpenses: 300,
    });
    expect(result.monthlyIncome).toBe(6000);
    expect(result.recommendedMax).toBe(1800);
    expect(result.conservativeMin).toBe(1500);
  });

  it("caps rent at leftover income", () => {
    const result = calculateRentAffordability({
      annualIncome: 0,
      monthlyIncome: 4000,
      monthlyDebt: 1500,
      desiredSavings: 500,
      otherMonthlyExpenses: 1200,
    });
    expect(result.leftoverBeforeRent).toBe(800);
    expect(result.recommendedMax).toBe(800);
  });

  it("requires some income", () => {
    expect(
      rentInputSchema.safeParse({
        annualIncome: 0,
        monthlyIncome: 0,
        monthlyDebt: 0,
        desiredSavings: 0,
        otherMonthlyExpenses: 0,
      }).success,
    ).toBe(false);
  });
});
