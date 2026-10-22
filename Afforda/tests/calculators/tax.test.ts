import { describe, expect, it } from "vitest";
import {
  estimateAnnualTaxes,
  estimateFederalIncomeTax,
  taxFromBrackets,
} from "@/lib/calculators/tax";

describe("taxFromBrackets", () => {
  it("returns 0 for non-positive income", () => {
    expect(taxFromBrackets(0, [{ upTo: 100, rate: 0.1 }])).toBe(0);
    expect(taxFromBrackets(-5, [{ upTo: 100, rate: 0.1 }])).toBe(0);
  });

  it("applies progressive brackets", () => {
    const tax = taxFromBrackets(200, [
      { upTo: 100, rate: 0.1 },
      { upTo: Infinity, rate: 0.2 },
    ]);
    expect(tax).toBe(30);
  });
});

describe("estimateFederalIncomeTax", () => {
  it("taxes only income above zero in the 10% bracket", () => {
    expect(estimateFederalIncomeTax(10000, "single")).toBe(1000);
  });
});

describe("estimateAnnualTaxes", () => {
  it("applies the standard deduction", () => {
    const result = estimateAnnualTaxes({
      annualGross: 16100,
      filingStatus: "single",
      state: "TX",
    });
    expect(result.taxableIncome).toBe(0);
    expect(result.federalIncomeTax).toBe(0);
    expect(result.socialSecurity).toBeGreaterThan(0);
  });
});
