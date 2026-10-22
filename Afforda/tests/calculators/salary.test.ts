import { describe, expect, it } from "vitest";
import { calculateSalary } from "@/lib/calculators/salary";
import { salaryInputSchema } from "@/lib/calculators/salary";

const base = {
  hoursPerWeek: 40,
  weeksPerYear: 52,
  state: "TX",
  filingStatus: "single" as const,
};

describe("calculateSalary", () => {
  it("converts an annual salary into other frequencies", () => {
    const result = calculateSalary({
      ...base,
      amount: 85000,
      payFrequency: "annually",
    });
    expect(result.annual).toBe(85000);
    expect(result.monthly).toBeCloseTo(85000 / 12, 2);
    expect(result.biweekly).toBeCloseTo(85000 / 26, 2);
    expect(result.weekly).toBeCloseTo(85000 / 52, 2);
    expect(result.hourly).toBeCloseTo(85000 / 2080, 2);
  });

  it("annualizes a biweekly paycheck", () => {
    const result = calculateSalary({
      ...base,
      amount: 2000,
      payFrequency: "biweekly",
    });
    expect(result.annual).toBe(52000);
  });

  it("estimates zero state tax in Texas", () => {
    const result = calculateSalary({
      ...base,
      amount: 60000,
      payFrequency: "annually",
      state: "TX",
    });
    expect(result.estimatedStateTax).toBe(0);
    expect(result.estimatedFederalTax).toBeGreaterThan(0);
    expect(result.socialSecurity).toBeCloseTo(60000 * 0.062, 2);
    expect(result.medicare).toBeCloseTo(60000 * 0.0145, 2);
  });

  it("estimates California state tax above Texas", () => {
    const tx = calculateSalary({
      ...base,
      amount: 90000,
      payFrequency: "annually",
      state: "TX",
    });
    const ca = calculateSalary({
      ...base,
      amount: 90000,
      payFrequency: "annually",
      state: "CA",
    });
    expect(ca.estimatedStateTax).toBeGreaterThan(tx.estimatedStateTax);
    expect(ca.estimatedAnnualTakeHome).toBeLessThan(tx.estimatedAnnualTakeHome);
  });

  it("rejects a zero salary", () => {
    const parsed = salaryInputSchema.safeParse({
      ...base,
      amount: 0,
      payFrequency: "annually",
    });
    expect(parsed.success).toBe(false);
  });

  it("handles large salaries and additional Medicare", () => {
    const result = calculateSalary({
      ...base,
      amount: 300000,
      payFrequency: "annually",
    });
    expect(result.medicare).toBeGreaterThan(300000 * 0.0145);
    expect(result.socialSecurity).toBeCloseTo(184500 * 0.062, 2);
  });
});
