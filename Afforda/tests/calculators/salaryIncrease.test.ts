import { describe, expect, it } from "vitest";
import { calculateSalaryIncrease } from "@/lib/calculators/salaryIncrease";
import { salaryIncreaseInputSchema } from "@/lib/calculators/salaryIncrease";

describe("calculateSalaryIncrease", () => {
  it("applies a percent raise to annual salary", () => {
    const result = calculateSalaryIncrease({
      currentPay: 80000,
      payFrequency: "annually",
      hoursPerWeek: 40,
      weeksPerYear: 52,
      raisePercent: 5,
      raiseAmount: 0,
    });
    expect(result.increaseAnnual).toBe(4000);
    expect(result.newAnnual).toBe(84000);
    expect(result.newMonthly).toBeCloseTo(7000, 2);
  });

  it("applies a dollar-per-hour raise", () => {
    const result = calculateSalaryIncrease({
      currentPay: 25,
      payFrequency: "hourly",
      hoursPerWeek: 40,
      weeksPerYear: 52,
      raisePercent: 0,
      raiseAmount: 2,
    });
    expect(result.increaseAnnual).toBe(4160);
    expect(result.newHourly).toBe(27);
  });

  it("rejects a raise with no percent and no amount", () => {
    expect(
      salaryIncreaseInputSchema.safeParse({
        currentPay: 50000,
        payFrequency: "annually",
        hoursPerWeek: 40,
        weeksPerYear: 52,
        raisePercent: 0,
        raiseAmount: 0,
      }).success,
    ).toBe(false);
  });
});
