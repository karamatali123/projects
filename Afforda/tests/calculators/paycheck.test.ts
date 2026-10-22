import { describe, expect, it } from "vitest";
import { calculatePaycheck } from "@/lib/calculators/paycheck";

describe("calculatePaycheck", () => {
  it("scales annual tax estimates to a biweekly check", () => {
    const result = calculatePaycheck({
      grossPay: 2000,
      payFrequency: "biweekly",
      state: "TX",
      filingStatus: "single",
      pretaxDeductions: 0,
      retirementContribution: 0,
      additionalWithholding: 0,
    });
    expect(result.annualGross).toBe(52000);
    expect(result.estimatedTakeHome).toBeLessThan(result.grossPay);
    expect(result.socialSecurity).toBeCloseTo((52000 * 0.062) / 26, 2);
  });

  it("reduces take-home when extra withholding is added", () => {
    const base = calculatePaycheck({
      grossPay: 5000,
      payFrequency: "monthly",
      state: "FL",
      filingStatus: "married_jointly",
      pretaxDeductions: 0,
      retirementContribution: 0,
      additionalWithholding: 0,
    });
    const extra = calculatePaycheck({
      grossPay: 5000,
      payFrequency: "monthly",
      state: "FL",
      filingStatus: "married_jointly",
      pretaxDeductions: 0,
      retirementContribution: 0,
      additionalWithholding: 200,
    });
    expect(extra.estimatedTakeHome).toBeCloseTo(base.estimatedTakeHome - 200, 2);
  });

  it("treats retirement contributions as other deductions", () => {
    const result = calculatePaycheck({
      grossPay: 3000,
      payFrequency: "biweekly",
      state: "NY",
      filingStatus: "single",
      pretaxDeductions: 50,
      retirementContribution: 150,
      additionalWithholding: 0,
    });
    expect(result.otherDeductions).toBe(200);
  });
});
