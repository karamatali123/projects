import { describe, expect, it } from "vitest";
import { calculateIncomeTax } from "@/lib/calculators/incomeTax";

describe("calculateIncomeTax", () => {
  it("returns zero state tax in Texas", () => {
    const result = calculateIncomeTax({
      annualIncome: 80000,
      filingStatus: "single",
      state: "TX",
      pretaxDeductions: 0,
    });
    expect(result.stateIncomeTax).toBe(0);
    expect(result.federalIncomeTax).toBeGreaterThan(0);
    expect(result.incomeAfterTax).toBeLessThan(80000);
    expect(result.effectiveRate).toBeGreaterThan(0);
  });

  it("reduces federal tax with pre-tax deductions", () => {
    const base = calculateIncomeTax({
      annualIncome: 90000,
      filingStatus: "single",
      state: "FL",
      pretaxDeductions: 0,
    });
    const withPretax = calculateIncomeTax({
      annualIncome: 90000,
      filingStatus: "single",
      state: "FL",
      pretaxDeductions: 5000,
    });
    expect(withPretax.federalIncomeTax).toBeLessThan(base.federalIncomeTax);
  });
});
